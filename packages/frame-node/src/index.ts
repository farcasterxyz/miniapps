// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '[DEPRECATION WARNING] @farcaster/frame-node is deprecated. Please migrate to @farcaster/miniapp-node. ' +
      'See https://github.com/farcasterxyz/frames/blob/main/MIGRATION.md for migration guide.',
  )
}

// Re-export everything from miniapp-node
export * from '@farcaster/miniapp-node'
