// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '@farcaster/frame-wagmi-connector is deprecated. Please use @farcaster/miniapp-wagmi-connector instead.',
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
    farcasterFrameWarningShown = true
    console.warn(
      'farcasterFrame() is deprecated. Please use the new import syntax from @farcaster/miniapp-wagmi-connector.',
    )
  }
  return _farcasterFrame()
}

export default farcasterFrame
