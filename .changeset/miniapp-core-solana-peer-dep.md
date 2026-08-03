---
'@farcaster/miniapp-core': minor
---

Move `@solana/web3.js` from `dependencies` to an optional `peerDependency`. The Solana wire/transaction helpers are opt-in, so consumers that only use schemas/manifests no longer pull the entire Solana v1 RPC stack (`jayson`/`rpc-websockets` and their transitive advisories, including the `uuid` bounds-check issue) into their production dependency tree. Consumers that use the Solana helpers must declare `@solana/web3.js` themselves (most already do).
