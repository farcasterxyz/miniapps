---
'@farcaster/miniapp-core': minor
---

Move `@solana/web3.js` from `dependencies` to an optional `peerDependency`, and move the `@solana/web3.js`-backed helpers to a new `@farcaster/miniapp-core/solana` subpath.

Consumers that only use schemas/manifests no longer pull the entire Solana v1 RPC stack (`jayson`/`rpc-websockets` and their transitive advisories, including the `uuid` bounds-check issue GHSA-w5hq-g745-h8pq) into their production dependency tree. The package root (`@farcaster/miniapp-core`) no longer references `@solana/web3.js` at all — not at runtime and not in its emitted type declarations — so it installs, imports, bundles, and type-checks without `@solana/web3.js` present.

If you use the Solana helpers, you must now:

1. Install `@solana/web3.js` yourself (it is an optional peer dependency; it is not installed automatically).
2. Import the `@solana/web3.js`-backed values from the `@farcaster/miniapp-core/solana` subpath instead of the package root.

The moved values are `SolanaConnection`, `wrapSolanaProviderRequest`, and `unwrapSolanaProviderRequest`. All Solana *types* (e.g. `SolanaWalletProvider`, `SolanaRequestFn`, `SolanaWireRequestFn`, `SolanaCombinedTransaction`, `SolanaSendOptions`) and the runtime-pure `createSolanaWalletProvider` remain exported from the package root and no longer force resolution of `@solana/web3.js`. (`SolanaCombinedTransaction` and `SolanaSendOptions` are now minimal structural types; concrete `@solana/web3.js` `Transaction`/`VersionedTransaction`/`SendOptions` values remain assignable to them.)

Migration:

```ts
// Before
import {
  SolanaConnection,
  wrapSolanaProviderRequest,
  unwrapSolanaProviderRequest,
} from '@farcaster/miniapp-core'

// After — install @solana/web3.js, then:
import {
  SolanaConnection,
  wrapSolanaProviderRequest,
  unwrapSolanaProviderRequest,
} from '@farcaster/miniapp-core/solana'
```
