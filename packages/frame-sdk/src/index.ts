// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '[DEPRECATION WARNING] @farcaster/frame-sdk is deprecated. Please migrate to @farcaster/miniapp-sdk. ' +
      'See https://github.com/farcasterxyz/frames/blob/main/MIGRATION.md for migration guide.',
  )
}

// Re-export everything from miniapp-sdk
export * from '@farcaster/miniapp-sdk'

// Import for aliasing
import { miniAppHost, sdk as miniAppSdk } from '@farcaster/miniapp-sdk'

// Backward compatibility exports
export const sdk = miniAppSdk

// Create a proxy for frameHost that logs deprecation warning on first access
let frameHostWarningShown = false
export const frameHost = new Proxy(miniAppHost, {
  get(target, prop, receiver) {
    if (
      !frameHostWarningShown &&
      typeof console !== 'undefined' &&
      console.warn
    ) {
      console.warn(
        '[DEPRECATION WARNING] frameHost is deprecated. Please use miniAppHost instead. ' +
          'Import from @farcaster/miniapp-sdk and use miniAppHost.',
      )
      frameHostWarningShown = true
    }
    return Reflect.get(target, prop, receiver)
  },
})

export type FrameSDK = typeof miniAppSdk

// Default export
export default sdk
