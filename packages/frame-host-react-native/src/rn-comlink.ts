import {
  type FrameHost,
  type Endpoint as FrameHostEndpoint,
  type Remote as FrameHostRemote,
  type TransferHandler as FrameHostTransferHandler,
  expose,
  releaseProxy,
  transferHandlers,
  wrap,
} from '@farcaster/frame-host'
import {
  forwardProviderEvents,
  wrapProviderRequest,
} from '@farcaster/frame-host/src/helpers/provider'
import { wrapHandlers } from '@farcaster/frame-host/src/helpers/sdk'
import type { Provider } from 'ox/Provider'
import {
  type ReactNativeWebViewProxy,
  createReactNativeFunctionDeserializer,
} from './rn-comlink-helpers'

// Re-export releaseProxy symbol for use in cleanup
export { releaseProxy }

let rnHandlersInitialized = false
let webViewProxyInstance: FrameHostRemote<ReactNativeWebViewProxy> | null = null
let rnFunctionDeserializer: FrameHostTransferHandler<any, any> | null = null

/**
 * Ensures React Native specific Comlink transfer handlers are registered globally.
 */
export function ensureRnComlinkHandlers(): void {
  if (rnHandlersInitialized) {
    return
  }

  const getWebViewProxy = ():
    | FrameHostRemote<ReactNativeWebViewProxy>
    | undefined => {
    return webViewProxyInstance === null ? undefined : webViewProxyInstance
  }

  rnFunctionDeserializer =
    createReactNativeFunctionDeserializer(getWebViewProxy)
  transferHandlers.set(
    'rn_function',
    rnFunctionDeserializer as FrameHostTransferHandler<any, any>,
  )
  console.debug(
    '[RN Host Comlink] Registered ReactNativeFunctionDeserializer via ensureRnComlinkHandlers.',
  )
  rnHandlersInitialized = true
}

/**
 * Wraps a WebView endpoint with Comlink, ensuring RN handlers are set up.
 * Crucially, it sets the webViewProxyInstance needed by the deserializer's callback.
 *
 * If this is not called, deserializing the function will fail.
 */
export function wrapWebViewForRnComlink<T extends ReactNativeWebViewProxy>(
  endpoint: FrameHostEndpoint,
): FrameHostRemote<T> {
  ensureRnComlinkHandlers()

  const proxy: FrameHostRemote<T> = wrap<T>(
    endpoint,
  ) as unknown as FrameHostRemote<T>

  webViewProxyInstance = proxy as FrameHostRemote<ReactNativeWebViewProxy>

  return proxy
}

/**
 * Exposes the Host SDK object to the WebView, ensuring RN handlers are set up
 * on the Comlink instance used for the exposure.
 * Replicates logic from `@farcaster/frame-host`'s `exposeToEndpoint` helper
 * but makes sure to set up the RN handlers first.
 *
 * @returns Cleanup function if any event listeners were added (e.g., provider events)
 */
export function exposeToWebViewWithRnComlink({
  endpoint,
  sdk,
  ethProvider,
  debug = false,
}: {
  endpoint: FrameHostEndpoint
  sdk: Omit<FrameHost, 'ethProviderRequestV2'>
  ethProvider?: Provider
  debug?: boolean
}): (() => void) | undefined {
  ensureRnComlinkHandlers()

  const extendedSdk = wrapHandlers(sdk as FrameHost)

  let providerCleanup: (() => void) | undefined
  if (ethProvider) {
    extendedSdk.ethProviderRequestV2 = wrapProviderRequest({
      provider: ethProvider,
      debug,
    })
    try {
      providerCleanup = forwardProviderEvents({
        provider: ethProvider,
        endpoint: endpoint as any,
      })
    } catch (e) {
      console.error(
        '[RN Host Comlink] Error setting up provider event forwarding:',
        e,
      )
    }
  }

  try {
    expose(extendedSdk, endpoint)
    console.debug(
      '[RN Host Comlink] Exposed SDK to WebView via exposeToWebViewWithRnComlink',
    )
  } catch (e) {
    console.warn(
      '[RN Host Comlink] Error exposing API (may already be exposed):',
      e,
    )
  }

  return providerCleanup
}
