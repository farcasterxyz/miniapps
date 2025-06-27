---
title: isInMiniApp
description: Detect if your app is running in a Mini App environment
---

# isInMiniApp

Determines if the current environment is a Mini App context by analyzing both environment characteristics and communication capabilities.

## Usage

```ts twoslash
import { sdk } from '@farcaster/miniapp-sdk'

// Check if running in a Mini App
const isMiniApp = await sdk.isInMiniApp()

if (isMiniApp) {
  // Mini App-specific code
} else {
  // Regular web app code
}
```

## Parameters

### timeoutMs (optional)

- **Type:** `number`
- **Default:** `100`

Optional timeout in milliseconds for context verification. If the context doesn't resolve within this time, the function assumes it's not in a Mini App environment.

## Return Value

- **Type:** `Promise<boolean>`

Returns a promise that resolves to `true` if running in a Mini App context, or `false` otherwise.

## Details

The function uses a multi-step approach to detect Mini App environments:

1. **Fast Short-Circuit:** Returns `false` immediately in certain scenarios:
   - During server-side rendering
   - When neither in an iframe nor in ReactNative WebView

2. **Context Verification:** For potential Mini App environments (iframe or ReactNative WebView), verifies by checking for context communication.

3. **Result Caching:** Once confirmed to be in a Mini App, the result is cached for faster subsequent calls.

This approach ensures accurate detection while optimizing performance.

:::tip
Need to branch during **server-side rendering**?
See the **Hybrid & SSR-friendly detection** subsection in the [Publishing guide](/docs/guides/publishing#hybrid-detection).
:::