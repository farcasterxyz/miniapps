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

## What changed

- `zod` upgraded from `^3.x` to `^4.0.0` across all packages.
- `ox` upgraded from `^0.4.4` to `^0.14.0`, removing its `zod@^3` peer dependency.
- The `ethProvider` parameter in `@farcaster/miniapp-host` and `@farcaster/miniapp-host-react-native` is now typed as `Provider.Provider<undefined, true>` (requires `on`/`removeListener` to be present, not optional). Runtime behavior is unchanged.

## Migration guide

### 1. Zod v4 — upgrade your own zod dependency

If your project imports `zod` directly, upgrade it:

```sh
npm install zod@^4.0.0
# or
pnpm add zod@^4.0.0
```

If you were composing schemas exported from these packages (e.g. `domainMiniAppConfigSchema`, `versionSchema`) with your own `z.merge()` or `z.extend()` calls, this is now required. Mixing a Zod v3 schema with a Zod v4 schema exported from this package will produce a runtime error like:

```
TypeError: schema.merge is not a function
```

or a TypeScript error like:

```
Argument of type 'ZodObject<...>' is not assignable to parameter of type 'ZodObject<...>'
```

**Search pattern**: grep your codebase for imports of schema objects from these packages combined with `.merge(`, `.extend(`, `.and(`, `.or(`, `.pipe(`:

```sh
grep -r "miniapp-core\|frame-core" --include="*.ts" --include="*.tsx" -l | xargs grep -l "\.merge\|\.extend\|\.and\|\.or\|\.pipe"
```

No code change is needed if you only call `.parse()`, `.safeParse()`, or use `z.infer<typeof schema>`.

### 2. `ethProvider` type — fix TypeScript errors in host integrations

**Affected functions**: `exposeToEndpoint`, `useExposeToEndpoint`, `exposeToIframe` (in `@farcaster/miniapp-host`), and `useWebViewRpcAdapter`, `useExposeWebViewToEndpoint` (in `@farcaster/miniapp-host-react-native`).

If you pass a custom `ethProvider`, you may see a TypeScript error like:

```
Argument of type 'EthereumProvider' is not assignable to parameter of type 'Provider<undefined, true>'.
  Types of property 'on' are incompatible.
```

The provider must now declare `on` and `removeListener` as required (not optional) methods. If your provider wraps a standard EIP-1193 provider, assert the type:

```ts
// Before
exposeToEndpoint({ ..., ethProvider: myProvider })

// After — if myProvider has on/removeListener but TypeScript doesn't see them as required
import type * as OxProvider from 'ox/Provider'
exposeToEndpoint({ ..., ethProvider: myProvider as OxProvider.Provider<undefined, true> })
```

Or narrow at the call site:

```ts
if (typeof myProvider.on === 'function' && typeof myProvider.removeListener === 'function') {
  exposeToEndpoint({ ..., ethProvider: myProvider })
}
```

**Search pattern**:

```sh
grep -r "exposeToEndpoint\|useExposeToEndpoint\|exposeToIframe\|useWebViewRpcAdapter\|useExposeWebViewToEndpoint" --include="*.ts" --include="*.tsx" -l
```

### 3. Wagmi connector — ensure your provider implements event methods

`@farcaster/miniapp-wagmi-connector` now throws at connect time if the provider is missing `on` or `removeListener`:

```
Error: MiniApp provider does not support event listeners.
```

Previously this was a silent no-op. If you supply a custom provider to the wagmi connector, ensure it implements the full EIP-1193 event interface.
