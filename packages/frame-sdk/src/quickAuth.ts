import { SignIn, type WireFrameHost } from '@farcaster/frame-core'
import type { JWTPayload } from '@farcaster/quick-auth'
import { decodeJwt } from '@farcaster/quick-auth/decodeJwt'
import { createLightClient } from '@farcaster/quick-auth/light'
import type { Remote } from 'comlink'
import * as Siwe from 'ox/Siwe'

export declare namespace getToken {
  type Options = {
    /**
     * Use a custom Quick Auth server, otherwise defaults to the public
     * instance provided by Farcaster.
     *
     * @default https://auth.farcaster.xyz
     */
    quickAuthServerOrigin?: string

    /**
     * Acquire a new token even if one is already in memory and not expired.
     *
     * @default false
     */
    force?: string
  }

  type ReturnValue = { token: string }
  type ReturnType = Promise<ReturnValue>

  type ErrorType = SignIn.RejectedByUser | Error
}

export type QuickAuth = {
  token: string | undefined

  /**
   * Get a Quick Auth JWT.
   *
   * If a token is already in memory and not expired it will be returned unless
   * `force` is used. Otherwise a new token will be acquired.
   */
  getToken: (options?: getToken.Options) => getToken.ReturnType
  fetch: typeof fetch
}

export const createQuickAuth = ({
  frameHost,
}: {
  frameHost: Remote<WireFrameHost>
}): QuickAuth => {
  let current:
    | {
        token: string
        payload: JWTPayload
      }
    | undefined
  let pendingPromise: Promise<getToken.ReturnValue> | undefined = undefined

  async function getTokenInner(options: getToken.Options): getToken.ReturnType {
    const quickAuthClient = createLightClient({
      origin: options.quickAuthServerOrigin,
    })

    const { nonce } = await quickAuthClient.generateNonce()
    const response = await frameHost.signIn({
      nonce,
      acceptAuthAddress: true,
    })

    if (response.result) {
      const parsedSiwe = Siwe.parseMessage(response.result.message)

      // The Farcaster Client rendering the Mini App will set the domain
      // based on the URL it's rendering. It should always be set.
      if (!parsedSiwe.domain) {
        throw new Error('Missing domain on SIWE message')
      }

      const verifyResult = await quickAuthClient.verifySiwf({
        domain: parsedSiwe.domain,
        message: response.result.message,
        signature: response.result.signature,
      })

      current = {
        token: verifyResult.token,
        payload: decodeJwt(verifyResult.token),
      }

      return verifyResult
    }

    if (response.error.type === 'rejected_by_user') {
      throw new SignIn.RejectedByUser()
    }

    throw new Error('Unreachable')
  }

  return {
    token: current ? current.token : undefined,
    async getToken(options = {}) {
      const force = options.force ?? false

      if (
        current &&
        !force &&
        new Date(current.payload.exp * 1000) > new Date(Date.now() + 15000)
      ) {
        return { token: current.token }
      }

      if (!pendingPromise) {
        pendingPromise = getTokenInner(options)
      }

      pendingPromise.finally(() => {
        pendingPromise = undefined
      })

      return pendingPromise
    },
    async fetch(url, options) {
      const { token } = await this.getToken()

      const headers = new Headers(options?.headers)
      headers.set('Authorization', `Bearer ${token}`)

      return fetch(url, {
        ...options,
        headers,
      })
    },
  }
}
