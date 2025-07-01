// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '@farcaster/frame-host is deprecated. Please use @farcaster/miniapp-host instead.',
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
    exposeToIframeWarningShown = true
    console.warn(
      'The frameOrigin parameter in exposeToIframe is deprecated. Please use miniAppOrigin instead.',
    )
  }
  return _exposeToIframe({
    iframe,
    sdk,
    ethProvider,
    miniAppOrigin: frameOrigin,
    debug,
  })
}
