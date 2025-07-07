// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '@farcaster/frame-node is deprecated. Please use @farcaster/miniapp-node instead.',
  )
}

// Re-export everything from miniapp-node
export * from '@farcaster/miniapp-node'
