import { Errors, createClient } from '@farcaster/quick-auth'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import { resolveUser } from './resolveUser.js'

const client = createClient()
const app = new Hono<{ Bindings: Cloudflare.Env }>()

const quickAuthMiddleware = createMiddleware<{
  Bindings: Cloudflare.Env
  Variables: {
    user: {
      fid: number
      primaryAddress?: string
    }
  }
}>(async (c, next) => {
  const authorization = c.req.header('Authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing token' })
  }

  try {
    const payload = await client.verifyJwt({
      token: authorization.split(' ')[1] as string,
      domain: c.env.HOSTNAME,
    })

    const user = await resolveUser(payload.sub)
    c.set('user', user)
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      console.info('Invalid token:', e.message)
      throw new HTTPException(401, { message: 'Invalid token' })
    }

    throw e
  }

  await next()
})

app.use(cors())

app.get('/me', quickAuthMiddleware, (c) => {
  return c.json(c.get('user'))
})

export default app
