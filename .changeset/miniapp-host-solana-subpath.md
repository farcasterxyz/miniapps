---
'@farcaster/miniapp-host': minor
---

Keep `@solana/web3.js` out of the default `@farcaster/miniapp-host` module graph so hosts that do not support Solana install, import, bundle, and type-check without it (and without pulling in the Solana v1 RPC stack / GHSA-w5hq-g745-h8pq).

`@solana/web3.js` is now an optional peer dependency. The `@solana/web3.js`-backed request wrapping used by `wrapHandlers`/`exposeToEndpoint` has moved to an opt-in `@farcaster/miniapp-host/solana` entrypoint.

If your host exposes a Solana provider (sets `solanaProviderRequest` on its `MiniAppHost`), you must now:

1. Install `@solana/web3.js`.
2. Add `import '@farcaster/miniapp-host/solana'` once in your host entry.

```ts
import '@farcaster/miniapp-host/solana' // enables wrapping of solanaProviderRequest
```

A host that provides `solanaProviderRequest` without importing the subpath will throw a descriptive error the first time a mini app makes a Solana request. Hosts that do not support Solana require no changes.
