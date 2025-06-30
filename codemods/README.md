# Farcaster Frames to Mini Apps Migration Codemods

This package provides automated codemods to help migrate your codebase from Farcaster Frames to Mini Apps.

## Warnings

This tool might make mistakes. Make sure you are working from a clean, committed branch and have backed up your project.

## Installation

```bash
npm install -g @farcaster/miniapp-codemods
```

Or run directly with npx:

```bash
npx @farcaster/miniapp-codemods <path-to-your-project>
```

## Usage

### Basic usage

Run all codemods on your project:

```bash
miniapp-migrate ./src
```

### Dry run mode

Preview changes without modifying files:

```bash
miniapp-migrate ./src --dry-run
```

### Run specific transform

Run only a specific transformation:

```bash
miniapp-migrate ./src --transform update-imports
```

### Available transforms

- `update-imports` - Updates package imports from `@farcaster/frame-*` to `@farcaster/miniapp-*`
- `update-api-methods` - Updates API method names (e.g., `frameHost` → `miniAppHost`)
- `update-types` - Updates TypeScript type names (e.g., `FrameContext` → `MiniAppContext`)
- `update-event-names` - Updates event names (e.g., `frame_added` → `miniapp_added`)

## What gets migrated

### 1. Package imports

```diff
- import { frameHost } from '@farcaster/frame-sdk'
+ import { miniAppHost } from '@farcaster/miniapp-sdk'

- import { FrameContext } from '@farcaster/frame-core'
+ import { MiniAppContext } from '@farcaster/miniapp-core'
```

### 2. API methods

```diff
- const context = await frameHost.getFrameContext()
+ const context = await miniAppHost.getMiniAppContext()

- frameHost.addFrame({ url: 'https://example.com' })
+ miniAppHost.addMiniApp({ url: 'https://example.com' })
```

### 3. TypeScript types

```diff
- const context: FrameContext = { ... }
+ const context: MiniAppContext = { ... }

- export interface MyFrameHost extends FrameHost { ... }
+ export interface MyMiniAppHost extends MiniAppHost { ... }
```

### 4. Event names

```diff
- sdk.on('frame_added', handler)
+ sdk.on('miniapp_added', handler)

- if (event.type === 'frame_removed') { ... }
+ if (event.type === 'miniapp_removed') { ... }
```

### 5. Manifest files

The codemod will update `farcaster.json` files to include both `frame` and `miniapp` properties for backward compatibility:

```diff
{
  "accountAssociation": { ... },
  "frame": {
    "version": "1",
    "name": "My App",
    ...
  }
+ "miniapp": {
+   "version": "1",
+   "name": "My App",
+   ...
+ }
}
```

## Manual steps after migration

After running the codemods, you'll need to:

1. **Update your package.json dependencies**:
   ```json
   {
     "dependencies": {
       "@farcaster/miniapp-sdk": "^0.0.61",
       "@farcaster/miniapp-wagmi-connector": "^0.0.5"
     }
   }
   ```

2. **Update meta tags in your HTML** (if using embeds):
   ```html
   <meta name="fc:miniapp" content="..." />
   <!-- Keep for backward compatibility -->
   <meta name="fc:frame" content="..." />
   ```

3. **Test your application thoroughly**

## Backward compatibility

The migration maintains backward compatibility:
- Old `@farcaster/frame-*` packages still work but show deprecation warnings
- Both `frame` and `miniapp` properties in manifests are supported
- The `fc:frame` meta tag continues to work alongside `fc:miniapp`

## Troubleshooting

### Transform not finding files

Make sure your file extensions match the patterns:
- JavaScript/TypeScript files: `.js`, `.jsx`, `.ts`, `.tsx`
- Manifest files: `farcaster.json` or `.well-known/farcaster.json`

### Syntax errors after transformation

The codemods use jscodeshift which preserves most formatting, but complex code might need manual adjustment. Always review the changes and run your tests.

### Missing transformations

Some edge cases might not be covered. Please report issues at:
https://github.com/farcasterxyz/miniapps/issues

## Examples

### Migrate a Next.js project

```bash
miniapp-migrate ./src --dry-run
# Review changes
miniapp-migrate ./src
```

### Migrate only TypeScript files

```bash
miniapp-migrate ./src --transform update-types
```

### Migrate with detailed output

```bash
miniapp-migrate ./src --verbose
```
