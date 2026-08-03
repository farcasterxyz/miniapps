/**
 * `@farcaster/miniapp-sdk/solana` — opt-in Solana support for the SDK.
 *
 * Importing this entrypoint has the side effect of registering the
 * `@solana/web3.js`-backed request unwrapper, which enables
 * `sdk.wallet.getSolanaProvider()`. It requires `@solana/web3.js` to be
 * installed (an optional peer dependency).
 *
 * Import it once in your app entry:
 *
 * ```ts
 * import '@farcaster/miniapp-sdk/solana'
 * ```
 *
 * Mini apps that do not use Solana should not import this module, so that
 * `@solana/web3.js` stays out of their bundle.
 */
import { unwrapSolanaProviderRequest } from '@farcaster/miniapp-core/solana'

import { registerSolanaProviderUnwrap } from './solanaProvider.ts'

registerSolanaProviderUnwrap(unwrapSolanaProviderRequest)

export { getSolanaProvider } from './solanaProvider.ts'
