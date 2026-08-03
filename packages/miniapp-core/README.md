# @farcaster/miniapp-core

Build onchain social apps

## Installation

```bash
pnpm add @farcaster/miniapp-core
```

## Solana support

`@solana/web3.js` is an **optional** peer dependency. The package root does not
depend on it, so apps that don't use Solana don't pull in the Solana v1 RPC
stack.

If you use the Solana helpers (`SolanaConnection`, `wrapSolanaProviderRequest`,
`unwrapSolanaProviderRequest`), install `@solana/web3.js` yourself and import
them from the `@farcaster/miniapp-core/solana` subpath:

```bash
pnpm add @solana/web3.js
```

```ts
import {
  SolanaConnection,
  wrapSolanaProviderRequest,
  unwrapSolanaProviderRequest,
} from '@farcaster/miniapp-core/solana'
```

Solana types (`SolanaWalletProvider`, `SolanaRequestFn`, `SolanaWireRequestFn`,
…) and `createSolanaWalletProvider` remain available from the package root and
do not require `@solana/web3.js`.

## Documentation

For documentation and guides, visit [miniapps.farcaster.xyz](https://miniapps.farcaster.xyz).
