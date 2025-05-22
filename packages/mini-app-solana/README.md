# @farcaster/mini-app-solana

This package enables Mini Apps to interact with a user's Solana wallet through [Wallet Standard](https://github.com/anza-xyz/wallet-standard/).

Mini apps written in React can use [Wallet Adapter](https://github.com/anza-xyz/wallet-adapter/)'s React hooks, which are sort of like Solana's equivalent of Wagmi.

## Installation

```bash
pnpm add @farcaster/mini-app-solana
```

## Usage

```
import * as React from 'react';
import { FarcasterSolanaProvider } from '@farcaster/mini-app-solana';
import { useWallet } from '@solana/wallet-adapter-react';

const solanaEndpoint = 'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY';

function App() {
  // FarcasterSolanaProvider internally renders ConnectionProvider
  // and WalletProvider from @solana/wallet-adapter-react
  return (
    <FarcasterSolanaProvider endpoint={solanaEndpoint}>
      <Content />
    </FarcasterSolanaProvider>
  )
}

function Content() {
  const { publicKey } = useWallet();
  const solanaAddress = publicKey?.toBase58() ?? '';
  return <span>{solanaAddress}</span>;
}
```

You can now interact with the user's connected wallet via Wallet Adapter.
