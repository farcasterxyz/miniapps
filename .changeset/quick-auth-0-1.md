---
'@farcaster/miniapp-sdk': patch
'@farcaster/frame-sdk': patch
---

Upgrade `@farcaster/quick-auth` to `^0.1.0`, which moves it from Zod 3 to Zod 4 and removes quick-auth's copy of `zod` < 4.6.6 (GHSA-mrhx-c7xc-m3w5). The SDK only uses quick-auth's light client, `decodeJwt` and the `JWTPayload` type, none of which changed, so there is no API change for SDK users.
