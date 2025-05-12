import {
  type SolanaRequestFn,
  type SolanaWalletProvider,
  createSolanaWalletProvider,
} from '@farcaster/frame-core'

import { frameHost } from './frameHost'

const solanaProvider = createSolanaWalletProvider(
  frameHost.solanaProviderRequest as unknown as SolanaRequestFn,
)

async function getSolanaProvider(): Promise<SolanaWalletProvider | undefined> {
  const capabilities = await frameHost.getCapabilities()
  if (!capabilities.includes('wallet.getSolanaProvider')) {
    return undefined
  }
  return solanaProvider
}

export { getSolanaProvider }
