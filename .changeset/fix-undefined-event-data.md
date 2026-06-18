---
'@farcaster/miniapp-sdk': patch
---

Guard against `message` events with no `data` payload. Other SDKs on the same page can dispatch `window` `message` events without a `data` object, which made the SDK throw `TypeError: Cannot read properties of undefined (reading 'type')`. The handler now reads `event.data?.type` so unrelated events are ignored.
