import type { MiniAppHost, WireMiniAppHost } from '@farcaster/miniapp-core'
import {
  AddMiniApp,
  SignIn,
  SignManifest,
  wrapSolanaProviderRequest,
} from '@farcaster/miniapp-core'

export function wrapHandlers(host: MiniAppHost): WireMiniAppHost {
  return {
    ...host,
    addFrame: async () => {
      try {
        const result = await host.addMiniApp()
        return { result }
      } catch (e) {
        if (e instanceof AddMiniApp.RejectedByUser) {
          return {
            error: {
              type: 'rejected_by_user',
            },
          }
        }

        if (e instanceof AddMiniApp.InvalidDomainManifest) {
          return {
            error: {
              type: 'invalid_domain_manifest',
            },
          }
        }

        throw e
      }
    },
    addMiniApp: async () => {
      try {
        const result = await host.addMiniApp()
        return { result }
      } catch (e) {
        if (e instanceof AddMiniApp.RejectedByUser) {
          return {
            error: {
              type: 'rejected_by_user',
            },
          }
        }

        if (e instanceof AddMiniApp.InvalidDomainManifest) {
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
    signManifest: async (options) => {
      try {
        const result = await host.signManifest(options)
        return { result }
      } catch (e) {
        if (e instanceof SignManifest.RejectedByUser) {
          return {
            error: {
              type: 'rejected_by_user',
            },
          }
        }

        if (e instanceof SignManifest.InvalidDomain) {
          return {
            error: {
              type: 'invalid_domain',
            },
          }
        }

        if (e instanceof SignManifest.GenericError) {
          return {
            error: {
              type: 'generic_error',
              message: e.message,
            },
          }
        }

        throw e
      }
    },
    solanaProviderRequest: host.solanaProviderRequest
      ? wrapSolanaProviderRequest(host.solanaProviderRequest)
      : undefined,
    // Pass through haptics methods directly
    impactOccurred: host.impactOccurred,
    notificationOccurred: host.notificationOccurred,
    selectionChanged: host.selectionChanged,
  }
}
