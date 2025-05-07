import {
  AddFrame,
  type FrameHost,
  SignIn,
  type WireFrameHost,
  sharedStateSchema,
} from '@farcaster/frame-core'

export function wrapHandlers(host: FrameHost): WireFrameHost {
  return {
    ...host,
    addFrame: async () => {
      try {
        const result = await host.addFrame()
        return { result }
      } catch (e) {
        if (e instanceof AddFrame.RejectedByUser) {
          return {
            error: {
              type: 'rejected_by_user',
            },
          }
        }

        if (e instanceof AddFrame.InvalidDomainManifest) {
          return {
            error: {
              type: 'invalid_domain_manifest',
            },
          }
        }

        throw e
      }
    },
    signIn: async (options) => {
      try {
        const result = await host.signIn(options)
        return { result }
      } catch (e) {
        if (e instanceof SignIn.RejectedByUser) {
          return {
            error: {
              type: 'rejected_by_user',
            },
          }
        }

        throw e
      }
    },
    setShareStateProvider: async (fn) => {
      host.setShareStateProvider(async () => {
        const result = fn()
        const state = await Promise.resolve(result)
        const parsed = sharedStateSchema.safeParse(state)
        if (!parsed.success) {
          throw new Error('Invalid share state', { cause: parsed.error })
        }
        return parsed.data
      })
    },
  }
}
