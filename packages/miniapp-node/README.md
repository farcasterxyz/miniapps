# @farcaster/miniapp-node

Utility methods for Mini App backends

## Installation

```bash
pnpm add @farcaster/miniapp-node
```

## Documentation

- `parseWebhookEvent`: parses and verifies webhook events, using a `VerifyAppKey` method
- `verifyJsonFarcasterSignature`: verifies a [JSON Farcaster Signature](https://github.com/farcasterxyz/protocol/discussions/208) payload, using a `VerifyAppKey` method
- `createJsonFarcasterSignature`: creates a [JSON Farcaster Signature](https://github.com/farcasterxyz/protocol/discussions/208) payload

For signature verification, you need to pass in a `VerifyAppKey` method that verifies that an app key is valid for an FID. You can use the included `verifyAppKeyWithNeynar` which uses [Neynar](https://neynar.com) and requires the `NEYNAR_API_KEY` environment variable to be defined.
