# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the Farcaster Mini Apps monorepo - a framework for building onchain social applications on Farcaster. The codebase includes core packages for building Mini Apps and Frames, SDKs, host implementations, and developer tooling.

Key terminology:

- **Mini Apps**: The current name for applications built on this framework
- **Frames**: The deprecated predecessor to Mini Apps (frame-\* packages still exist for backward compatibility)
- **SDK**: Client-side packages used by Mini App developers
- **Host**: Packages used by Farcaster clients to host Mini Apps
- **Core**: Shared types, schemas, and utilities

## Commands

### Development

```bash
pnpm install          # Install dependencies (pnpm is required, enforced by only-allow)
pnpm dev              # Start dev mode across all packages (Turbo)
pnpm build            # Build all packages (Turbo)
pnpm clean            # Clean build artifacts
```

### Code Quality

```bash
pnpm check            # Run Biome linting and formatting checks
pnpm check:write      # Auto-fix Biome issues (--unsafe flag)
pnpm format           # Format code with Biome
pnpm typecheck        # Type check all packages (Turbo)
pnpm check:repo       # Check repo consistency with sherif
```

### Testing

```bash
pnpm test                    # Run all tests (Turbo)
pnpm --filter <package> test # Run tests for specific package
pnpm --filter <package> test:watch        # Watch mode for specific package
pnpm --filter <package> test:coverage     # Coverage for specific package
```

Test files are located in `tests/**/*.test.ts` within each package. Only some packages have tests (miniapp-core, frame-core, miniapp-node, frame-node).

### Package-Specific

```bash
pnpm --filter <package> build      # Build specific package
pnpm --filter <package> typecheck  # Type check specific package
pnpm --filter site dev             # Run documentation site
```

### Publishing

```bash
pnpm changeset:version   # Update versions based on changesets
pnpm changeset:publish   # Build and publish packages to npm
```

## Architecture

### Package Structure

The monorepo is organized into three main categories:

**Core Libraries** (shared types and utilities):

- `miniapp-core`: Core types, schemas, actions, and Solana utilities for Mini Apps
- `frame-core`: Deprecated wrapper around miniapp-core with backward compatibility aliases

**SDK Packages** (for Mini App developers):

- `miniapp-sdk`: Browser SDK for building Mini Apps (uses Comlink for iframe messaging)
- `frame-sdk`: Deprecated wrapper around miniapp-sdk
- `miniapp-wagmi-connector`: Wagmi connector integration
- `frame-wagmi-connector`: Deprecated wrapper
- `mini-app-solana`: Solana-specific utilities

**Host Packages** (for Farcaster clients):

- `miniapp-host`: React hooks and components for hosting Mini Apps (web)
- `frame-host`: Deprecated wrapper around miniapp-host
- `miniapp-host-react-native`: React Native implementation
- `frame-host-react-native`: React Native implementation (deprecated name)

**Node/Server Packages**:

- `miniapp-node`: Server-side utilities for Node.js environments
- `frame-node`: Deprecated wrapper

**Tooling**:

- `create-mini-app`: CLI for scaffolding new Mini Apps
- `tsconfig`: Shared TypeScript configurations
- `codemods`: Automated migration tools from Frames to Mini Apps

### Key Architectural Patterns

1. **Dual Build System**: Most packages build both CJS (`dist/`) and ESM (`esm/`) outputs
   - CJS: `tsc -p tsconfig.node.json`
   - ESM: `tsc -p tsconfig.json`
   - SDK packages also build UMD bundles via esbuild

2. **Workspace Dependencies**: Packages use `workspace:*` protocol for internal dependencies

3. **Action-Based API**: Mini Apps communicate via typed action schemas (in `miniapp-core/src/actions/`)
   - Actions include: AddMiniApp, ComposeCast, SignIn, SendToken, SwapToken, ViewCast, etc.

4. **Context System**: `MiniAppContext` provides client info, user data, location context, and features
   - `ClientContext`: platform type, FID, add status, safe area insets
   - `UserContext`: FID, username, display name, profile image, location
   - `LocationContext`: where Mini App was launched (cast_embed, notification, launcher, channel, etc.)

5. **Deprecation Strategy**: `frame-*` packages re-export from `miniapp-*` packages with deprecation warnings and type aliases for backward compatibility

### Build Dependencies

The Turbo pipeline enforces build order:

- `build` tasks depend on `^build` (parent packages build first)
- `test` and `typecheck` depend on local `build` and `^test`/`^typecheck`

### Code Style

The repo uses Biome (not ESLint/Prettier):

- Single quotes, trailing commas, semicolons as needed
- Import extensions required (`.ts`, `.tsx`)
- No console except `console.log`
- Special override: `frame-*/src/index.ts` allows console for deprecation warnings

### Migration Tools

The `codemods` package provides automated migration from Frames → Mini Apps:

- Transform imports: `@farcaster/frame-*` → `@farcaster/miniapp-*`
- Rename types: `FrameContext` → `MiniAppContext`
- Update method names: `frameHost` → `miniAppHost`
- Update events: `frame_added` → `miniapp_added`

## Important Constraints

1. **Node version**: Requires Node.js ≥22 (enforced in root package.json)
2. **Package manager**: Must use pnpm (enforced by `only-allow` preinstall hook)
3. **Git hooks**: Pre-commit hook runs `pnpm check`
4. **Import extensions**: All imports must include `.ts` or `.tsx` extensions
5. **Lockfile**: `pnpm-lock.yaml` is committed and must stay in sync

## Documentation

- Full documentation site lives in `site/` (built with Vocs)
- Run locally: `pnpm docs:dev`
- Published at: https://miniapps.farcaster.xyz
