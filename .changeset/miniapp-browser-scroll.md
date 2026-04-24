---
'@farcaster/miniapp-sdk': patch
'@farcaster/miniapp-host': patch
---

Isolate mini app document scrolling in browser iframes: set `overscroll-behavior` on the root document, and default iframe sizing so the embedded app can fill its viewport without fighting the parent page scroll.
