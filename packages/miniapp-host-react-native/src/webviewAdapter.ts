import type { MiniAppHost } from '@farcaster/miniapp-host'
import { exposeToEndpoint, useExposeToEndpoint } from '@farcaster/miniapp-host'
import type { Provider } from 'ox/Provider'
import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AppState, Platform } from 'react-native'
import type WebView from 'react-native-webview'
import type { WebViewMessageEvent, WebViewProps } from 'react-native-webview'
import { createWebViewRpcEndpoint, type WebViewEndpoint } from './webview.ts'

/**
 * Android can replace the native WebView while the React ref object stays the
 * same, which would leave Comlink/expose wired to a stale session. Detect
 * instance changes and bump a tick so callers re-run endpoint setup.
 */
function useWebViewNativeInstanceRegenerationTick(
  webViewRef: RefObject<WebView | null>,
) {
  const [tick, setTick] = useState(0)
  const bump = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        bump()
      }
    })
    return () => sub.remove()
  }, [bump])

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return
    }

    let prevNativeInstance: unknown
    let isFirstSample = true

    const id = setInterval(() => {
      const cur = webViewRef.current as unknown
      if (isFirstSample) {
        isFirstSample = false
        prevNativeInstance = cur
        return
      }
      if (cur !== prevNativeInstance) {
        prevNativeInstance = cur
        bump()
      }
    }, 300)

    return () => clearInterval(id)
  }, [webViewRef, bump])

  return tick
}

/**
 * Returns a handler of RPC message from WebView.
 *
 * @param webViewMountGeneration - Increment when the WebView component remounts
 *   (e.g. `key` on WebView changes) so the RPC layer re-initializes immediately.
 */
export function useWebViewRpcAdapter({
  webViewRef,
  domain,
  sdk,
  ethProvider,
  debug = false,
  webViewMountGeneration = 0,
}: {
  webViewRef: RefObject<WebView | null>
  domain: string
  sdk: Omit<MiniAppHost, 'ethProviderRequestV2'>
  ethProvider?: Provider
  debug?: boolean
  /** Bump when the WebView element remounts so RPC/comlink re-binds without waiting for polling. */
  webViewMountGeneration?: number
}) {
  const [endpoint, setEndpoint] = useState<WebViewEndpoint>()
  const nativeRegenTick = useWebViewNativeInstanceRegenerationTick(webViewRef)

  const onMessage: WebViewProps['onMessage'] = useCallback(
    (e: WebViewMessageEvent) => {
      endpoint?.onMessage(e)
    },
    [endpoint],
  )

  useEffect(() => {
    void webViewMountGeneration
    void nativeRegenTick
    const newEndpoint = createWebViewRpcEndpoint(webViewRef, domain)
    setEndpoint(newEndpoint)

    if (debug) {
      // biome-ignore lint/suspicious/noConsole: intentional when callers pass debug
      console.debug(
        '[miniapp-host-react-native] WebView RPC endpoint (re)initialized',
        {
          domain,
          webViewMountGeneration,
          nativeRegenTick,
        },
      )
    }

    const cleanup = exposeToEndpoint({
      endpoint: newEndpoint,
      sdk,
      ethProvider,
      miniAppOrigin: 'ReactNativeWebView',
      debug,
    })

    return () => {
      cleanup?.()
      setEndpoint(undefined)
    }
  }, [
    webViewRef,
    domain,
    sdk,
    ethProvider,
    debug,
    webViewMountGeneration,
    nativeRegenTick,
  ])

  return useMemo(
    () => ({
      onMessage,
      emit: endpoint?.emit,
      emitEthProvider: endpoint?.emitEthProvider,
    }),
    [onMessage, endpoint],
  )
}

export function useWebViewRpcEndpoint(
  webViewRef: RefObject<WebView | null>,
  domain: string,
  webViewMountGeneration = 0,
) {
  const [endpoint, setEndpoint] = useState<WebViewEndpoint>()
  const nativeRegenTick = useWebViewNativeInstanceRegenerationTick(webViewRef)

  const onMessage: WebViewProps['onMessage'] = useCallback(
    (e: WebViewMessageEvent) => {
      endpoint?.onMessage(e)
    },
    [endpoint],
  )

  useEffect(() => {
    void webViewMountGeneration
    void nativeRegenTick
    const newEndpoint = createWebViewRpcEndpoint(webViewRef, domain)
    setEndpoint(newEndpoint)

    return () => {
      setEndpoint(undefined)
    }
  }, [webViewRef, domain, webViewMountGeneration, nativeRegenTick])

  return useMemo(
    () => ({
      endpoint,
      onMessage,
    }),
    [endpoint, onMessage],
  )
}

export function useExposeWebViewToEndpoint({
  endpoint,
  sdk,
  ethProvider,
  debug = false,
}: {
  endpoint: WebViewEndpoint | undefined
  sdk: Omit<MiniAppHost, 'ethProviderRequestV2' | 'addFrame'>
  ethProvider?: Provider
  debug?: boolean
}) {
  useExposeToEndpoint({
    endpoint,
    sdk,
    miniAppOrigin: 'ReactNativeWebView',
    ethProvider,
    debug,
  })
}
