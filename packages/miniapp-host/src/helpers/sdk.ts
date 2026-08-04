import type {
  MiniAppHost,
  SolanaRequestFn,
  SolanaWireRequestFn,
  WireMiniAppHost,
} from '@farcaster/miniapp-core'
import { AddMiniApp, SignIn, SignManifest } from '@farcaster/miniapp-core'

/**
 * The `wrapSolanaProviderRequest` helper reconstructs `@solana/web3.js`
 * transaction instances from their wire representation, so it depends on
 * `@solana/web3.js` runtime values and lives in the
 * `@farcaster/miniapp-core/solana` subpath.
 *
 * To keep `@solana/web3.js` out of the default `@farcaster/miniapp-host`
 * module graph (so that hosts that do not support Solana bundle without it),
 * that helper is registered via a side-effecting import of
 * `@farcaster/miniapp-host/solana` rather than being imported statically.
 */
type WrapSolanaProviderRequest = (
  request: SolanaRequestFn,
) => SolanaWireRequestFn

let registeredWrap: WrapSolanaProviderRequest | undefined

/**
 * Registers the `@solana/web3.js`-backed wrap helper used by
 * {@link wrapHandlers}. Called by the `@farcaster/miniapp-host/solana`
 * entrypoint; consumers should not call this directly.
 */
export function registerSolanaProviderWrap(
  wrap: WrapSolanaProviderRequest,
): void {
  registeredWrap = wrap
}

/**
 * Produce the wire-format Solana request fn for a host that provides a rich
 * (`@solana/web3.js`-typed) `solanaProviderRequest`. The wrapping is deferred
 * to the first Solana request; if Solana support was not enabled (via
 * `import '@farcaster/miniapp-host/solana'`), the call throws a descriptive
 * error instead of silently failing.
 */
function toWireSolanaProviderRequest(
  request: SolanaRequestFn,
): SolanaWireRequestFn {
  let wrapped: SolanaWireRequestFn | undefined
  const fn = (wireRequest: unknown) => {
    if (!wrapped) {
      if (!registeredWrap) {
        throw new Error(
          "Solana support is not enabled. Install '@solana/web3.js' and add `import '@farcaster/miniapp-host/solana'` to your host entry to expose a Solana provider.",
        )
      }
      wrapped = registeredWrap(request)
    }
    return (wrapped as (r: unknown) => Promise<unknown>)(wireRequest)
  }
  return fn as unknown as SolanaWireRequestFn
}

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
      ? toWireSolanaProviderRequest(host.solanaProviderRequest)
      : undefined,
    // Pass through haptics methods directly
    impactOccurred: host.impactOccurred,
    notificationOccurred: host.notificationOccurred,
    selectionChanged: host.selectionChanged,
  }
}
