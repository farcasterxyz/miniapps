---
"@farcaster/miniapp-host-react-native": minor
"@farcaster/frame-host-react-native": minor
"@farcaster/miniapp-wagmi-connector": minor
"@farcaster/miniapp-core": minor
"@farcaster/miniapp-host": minor
"@farcaster/miniapp-node": minor
"@farcaster/miniapp-sdk": minor
"@farcaster/frame-core": minor
"@farcaster/frame-host": minor
"@farcaster/frame-node": minor
"@farcaster/frame-sdk": minor
---

Upgrade to Zod v4 and ox v0.14.x

- `zod` upgraded from `^3.x` to `^4.0.0` across all packages. Zod v4 exports the same API from the `"zod"` root, so existing imports are unchanged.
- `ox` upgraded from `^0.4.4` to `^0.14.0`. The new version removes its `zod@^3` peer dependency, resolving the peer conflict that originally blocked Zod v4 adoption.
- The `ethProvider` parameter type in `@farcaster/miniapp-host` (`exposeToEndpoint`, `useExposeToEndpoint`, `exposeToIframe`) is now typed as `Provider.Provider<undefined, true>` to reflect that the provider must supply event-emitter methods. This is a TypeScript-level change only; passing any EIP-1193 provider with `on`/`removeListener` continues to work at runtime.
