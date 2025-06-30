// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '[DEPRECATION WARNING] @farcaster/frame-host is deprecated. Please migrate to @farcaster/miniapp-host. ' +
      'See https://github.com/farcasterxyz/frames/blob/main/MIGRATION.md for migration guide.',
  )
}

// Re-export everything from miniapp-host
export * from '@farcaster/miniapp-host'

// Backward compatibility - re-export exposeToIframe with old parameter name
import { exposeToIframe as _exposeToIframe } from '@farcaster/miniapp-host'

let exposeToIframeWarningShown = false
export function exposeToIframe({
  iframe,
  sdk,
  ethProvider,
  frameOrigin,
  debug = false,
}: {
  iframe: HTMLIFrameElement
  sdk: Parameters<typeof _exposeToIframe>[0]['sdk']
  frameOrigin: string
  ethProvider?: Parameters<typeof _exposeToIframe>[0]['ethProvider']
  debug?: boolean
}) {
  if (
    !exposeToIframeWarningShown &&
    typeof console !== 'undefined' &&
    console.warn
  ) {
    console.warn(
      '[DEPRECATION WARNING] The frameOrigin parameter is deprecated. Please use miniAppOrigin instead. ' +
        'Import exposeToIframe from @farcaster/miniapp-host.',
    )
    exposeToIframeWarningShown = true
  }
  return _exposeToIframe({
    iframe,
    sdk,
    ethProvider,
    miniAppOrigin: frameOrigin,
    debug,
  })
}
