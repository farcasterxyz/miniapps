import {
  type MiniAppHostCapability,
  type SolanaWalletProvider,
  type SolanaWireRequestFn,
  createSolanaWalletProvider,
  unwrapSolanaProviderRequest,
} from '@farcaster/frame-core'

import { frameHost } from './frameHost.ts'

const { solanaProviderRequest } = frameHost

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
    capabilities = await frameHost.getCapabilities()
  } catch {}
  if (!capabilities?.includes('wallet.getSolanaProvider')) {
    return undefined
  }
  return solanaProvider
}

export { getSolanaProvider }
