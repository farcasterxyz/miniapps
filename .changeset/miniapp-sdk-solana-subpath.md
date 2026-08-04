---
'@farcaster/miniapp-sdk': minor
---

Keep `@solana/web3.js` out of the default `@farcaster/miniapp-sdk` module graph so mini apps that do not use Solana install, import, bundle, and type-check without it (and without pulling in the Solana v1 RPC stack / GHSA-w5hq-g745-h8pq).

`@solana/web3.js` is now an optional peer dependency. The `@solana/web3.js`-backed request unwrapping that powers `sdk.wallet.getSolanaProvider()` has moved to an opt-in `@farcaster/miniapp-sdk/solana` entrypoint.

If you use `sdk.wallet.getSolanaProvider()` (the low-level Solana provider), you must now:

1. Install `@solana/web3.js`.
2. Add `import '@farcaster/miniapp-sdk/solana'` once in your app entry to enable it.

```ts
import '@farcaster/miniapp-sdk/solana' // enables sdk.wallet.getSolanaProvider()
import { sdk } from '@farcaster/miniapp-sdk'

const solanaProvider = await sdk.wallet.getSolanaProvider()
```

Calling `getSolanaProvider()` in a Solana-capable host without importing the subpath now throws a descriptive error instead of returning a broken provider. Apps built with `@farcaster/mini-app-solana` (Wallet Standard / Wallet Adapter) are unaffected — that path does not use `getSolanaProvider()`.
