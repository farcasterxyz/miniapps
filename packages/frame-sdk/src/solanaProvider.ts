import {
  type SolanaWalletProvider,
  type SolanaWireRequestFn,
  createSolanaWalletProvider,
  unwrapSolanaProviderRequest,
} from '@farcaster/frame-core'

import { frameHost } from './frameHost'

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
  const capabilities = await frameHost.getCapabilities()
  if (!capabilities.includes('wallet.getSolanaProvider')) {
    return undefined
  }
  return solanaProvider
}

export { getSolanaProvider }
