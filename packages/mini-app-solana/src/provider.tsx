import type { Adapter } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react'
import * as React from 'react'

// Farcaster Solana wallet will auto-connect
const wallets: Adapter[] = []

type FarcasterSolanaProviderProps = {
  endpoint: string
  children: React.ReactNode
}

export const FarcasterSolanaProvider: React.FC<FarcasterSolanaProviderProps> =
  React.memo(({ endpoint, children }) => (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <FarcasterSolanaWalletSelector />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  ))

function FarcasterSolanaWalletSelector() {
  const { wallets, select, connect } = useWallet()

  const farcasterWallet = wallets.find((w) => w.adapter.name === 'Farcaster')

  const selectedFarcasterWalletRef = React.useRef(false)
  React.useEffect(() => {
    if (!farcasterWallet || selectedFarcasterWalletRef.current) {
      return
    }
    selectedFarcasterWalletRef.current = true
    ;(async () => {
      try {
        await select(farcasterWallet.adapter.name)
        await connect()
      } catch (e) {
        console.error('failed to select Farcaster Solana wallet', e)
      }
    })()
  }, [farcasterWallet, select, connect])

  return null
}
