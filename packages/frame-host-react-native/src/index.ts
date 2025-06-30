// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '[DEPRECATION WARNING] @farcaster/frame-host-react-native is deprecated. Please migrate to @farcaster/miniapp-host-react-native. ' +
      'See https://github.com/farcasterxyz/frames/blob/main/MIGRATION.md for migration guide.',
  )
}

// Re-export everything from miniapp-host-react-native
export * from '@farcaster/miniapp-host-react-native'
