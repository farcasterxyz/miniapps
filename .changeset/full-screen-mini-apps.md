---
'@farcaster/miniapp-core': minor
'@farcaster/miniapp-sdk': minor
'@farcaster/miniapp-host': minor
---

Add `sdk.actions.requestFullScreen()` and `sdk.actions.exitFullScreen()`, the matching `actions.requestFullScreen` and `actions.exitFullScreen` capabilities, and a `supportsFullScreen` manifest property. Hosts that can show mini apps full screen (for example on web) can implement the new optional `requestFullScreen` and `exitFullScreen` handlers on `MiniAppHost`; hosts that omit them reject the request.
