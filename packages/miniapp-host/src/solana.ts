/**
 * `@farcaster/miniapp-host/solana` — opt-in Solana support for hosts.
 *
 * Importing this entrypoint has the side effect of registering the
 * `@solana/web3.js`-backed request wrapper, which lets a host expose a Solana
 * provider to mini apps. It requires `@solana/web3.js` to be installed (an
 * optional peer dependency).
 *
 * Import it once in your host entry:
 *
 * ```ts
 * import '@farcaster/miniapp-host/solana'
 * ```
 *
 * Hosts that do not support Solana should not import this module, so that
 * `@solana/web3.js` stays out of their bundle.
 */
import { wrapSolanaProviderRequest } from '@farcaster/miniapp-core/solana'

import { registerSolanaProviderWrap } from './helpers/sdk.ts'

registerSolanaProviderWrap(wrapSolanaProviderRequest)
