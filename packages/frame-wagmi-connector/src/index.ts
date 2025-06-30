// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '[DEPRECATION WARNING] @farcaster/frame-wagmi-connector is deprecated. Please migrate to @farcaster/miniapp-wagmi-connector. ' +
      'See https://github.com/farcasterxyz/frames/blob/main/MIGRATION.md for migration guide.',
  )
}

// Re-export everything from miniapp-wagmi-connector
export * from '@farcaster/miniapp-wagmi-connector'

// Import and re-export for backward compatibility
import { farcasterFrame as _farcasterFrame } from '@farcaster/miniapp-wagmi-connector'

// Add deprecation warning when farcasterFrame is used
let farcasterFrameWarningShown = false
export const farcasterFrame = () => {
  if (
    !farcasterFrameWarningShown &&
    typeof console !== 'undefined' &&
    console.warn
  ) {
    console.warn(
      '[DEPRECATION WARNING] farcasterFrame() is deprecated. Please use farcasterMiniApp() instead. ' +
        'Import from @farcaster/miniapp-wagmi-connector.',
    )
    farcasterFrameWarningShown = true
  }
  return _farcasterFrame()
}

export default farcasterFrame
