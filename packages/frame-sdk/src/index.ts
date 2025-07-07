// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '@farcaster/frame-sdk is deprecated. Please use @farcaster/miniapp-sdk instead.',
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
      frameHostWarningShown = true
      console.warn('frameHost is deprecated. Please use miniAppHost instead.')
    }
    return Reflect.get(target, prop, receiver)
  },
})

export type FrameSDK = typeof miniAppSdk

// Default export
export default sdk
