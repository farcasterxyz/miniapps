import {
  createSolanaWalletProvider,
  type MiniAppHostCapability,
  type SolanaWalletProvider,
  type SolanaWireRequestFn,
  unwrapSolanaProviderRequest,
} from '@farcaster/miniapp-core'

import { miniAppHost } from './miniAppHost.ts'

const { solanaProviderRequest } = miniAppHost

let solanaProvider: SolanaWalletProvider | undefined
if (solanaProviderRequest) {
  solanaProvider = createSolanaWalletProvider(
    unwrapSolanaProviderRequest(
      solanaProviderRequest as unknown as SolanaWireRequestFn,
    ),
  )
}

async function getSolanaProvider(): Promise<SolanaWalletProvider | undefined> {
  let capabilities: MiniAppHostCapability[] | undefined
  try {
    capabilities = await miniAppHost.getCapabilities()
  } catch {}
  if (!capabilities?.includes('wallet.getSolanaProvider')) {
    return undefined
  }
  return solanaProvider
}

export { getSolanaProvider }
