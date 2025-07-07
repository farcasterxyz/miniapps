// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '@farcaster/frame-host-react-native is deprecated. Please use @farcaster/miniapp-host-react-native instead.',
  )
}

// Re-export everything from miniapp-host-react-native
export * from '@farcaster/miniapp-host-react-native'
