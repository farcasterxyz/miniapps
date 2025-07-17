# Mini App Documentation Improvements

## Summary of Changes

Added domain matching warnings to Mini App documentation based on user feedback about tunnel domain issues.

### Files Updated:

1. **`snippets/exposeLocalhost.mdx`**
   - Added warning about tunnel domain limitations
   - Clarified that `addMiniApp()` won't work with tunnel domains
   - Noted apps on tunnel domains are excluded from discovery

2. **`pages/docs/sdk/actions/add-miniapp.mdx`**
   - Added caution box explaining domain matching requirements
   - Enhanced `InvalidDomainManifestJson` error description with common causes
   - Explicitly stated tunnel domains will cause failures

3. **`pages/docs/guides/notifications.mdx`**
   - Added warning that `addMiniApp()` requires production domain
   - Placed warning right after the code example for visibility

4. **`pages/docs/guides/agents-checklist.mdx`**
   - Enhanced tunnel URL troubleshooting section
   - Listed all limitations when using tunnel domains
   - Emphasized need to deploy to production for testing manifest features

## Key Message

The consistent message across all documentation:
- Tunnel domains (ngrok, localtunnel, etc.) are for development preview only
- SDK actions requiring manifest validation (like `addMiniApp()`) need exact domain matching
- For production features, apps must be deployed to their registered domain