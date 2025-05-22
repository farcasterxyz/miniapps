import type { Adapter } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react'
import * as React from 'react'

import { localStorageKey } from './constants'

// Farcaster Solana wallet will auto-connect
const wallets: Adapter[] = []

type FarcasterSolanaProviderProps = {
  endpoint: string
  children: React.ReactNode
}

export const FarcasterSolanaProvider: React.FC<FarcasterSolanaProviderProps> =
  React.memo(({ endpoint, children }) => (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        localStorageKey={localStorageKey}
        autoConnect
      >
        {children}
      </WalletProvider>
    </ConnectionProvider>
  ))
