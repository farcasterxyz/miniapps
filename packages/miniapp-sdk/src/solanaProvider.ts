import {
  createSolanaWalletProvider,
  type MiniAppHostCapability,
  type SolanaRequestFn,
  type SolanaWalletProvider,
  type SolanaWireRequestFn,
} from '@farcaster/miniapp-core'

import { miniAppHost } from './miniAppHost.ts'

/**
 * The `unwrapSolanaProviderRequest` helper reconstructs `@solana/web3.js`
 * transaction instances from their wire representation, so it depends on
 * `@solana/web3.js` runtime values and lives in the
 * `@farcaster/miniapp-core/solana` subpath.
 *
 * To keep `@solana/web3.js` out of the default `@farcaster/miniapp-sdk` module
 * graph (so that mini apps that never touch Solana bundle without it), that
 * helper is registered here via a side-effecting import of
 * `@farcaster/miniapp-sdk/solana` rather than being imported statically.
 */
type UnwrapSolanaProviderRequest = (fn: SolanaWireRequestFn) => SolanaRequestFn

let registeredUnwrap: UnwrapSolanaProviderRequest | undefined

/**
 * Registers the `@solana/web3.js`-backed unwrap helper that powers
 * {@link getSolanaProvider}. Called by the `@farcaster/miniapp-sdk/solana`
 * entrypoint; consumers should not call this directly.
 */
function registerSolanaProviderUnwrap(
  unwrap: UnwrapSolanaProviderRequest,
): void {
  registeredUnwrap = unwrap
}

let solanaProvider: SolanaWalletProvider | undefined

function ensureSolanaProvider(): SolanaWalletProvider | undefined {
  if (solanaProvider) {
    return solanaProvider
  }

  const { solanaProviderRequest } = miniAppHost
  if (!solanaProviderRequest) {
    return undefined
  }

  if (!registeredUnwrap) {
    throw new Error(
      "Solana support is not enabled. Install '@solana/web3.js' and add `import '@farcaster/miniapp-sdk/solana'` to your app entry before calling sdk.wallet.getSolanaProvider().",
    )
  }

  solanaProvider = createSolanaWalletProvider(
    registeredUnwrap(solanaProviderRequest as unknown as SolanaWireRequestFn),
  )

  return solanaProvider
}

async function getSolanaProvider(): Promise<SolanaWalletProvider | undefined> {
  let capabilities: MiniAppHostCapability[] | undefined
  try {
    capabilities = await miniAppHost.getCapabilities()
  } catch (error) {
    console.warn(
      'Unable to read Mini App host capabilities while detecting Solana support.',
      error,
    )
  }

  if (!capabilities?.includes('wallet.getSolanaProvider')) {
    return undefined
  }
  return ensureSolanaProvider()
}

export { getSolanaProvider, registerSolanaProviderUnwrap }
