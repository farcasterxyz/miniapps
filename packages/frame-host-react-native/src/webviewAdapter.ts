import type { FrameHost } from '@farcaster/frame-host'
import { exposeToEndpoint, useExposeToEndpoint } from '@farcaster/frame-host'
import type { Provider } from 'ox'
import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type WebView from 'react-native-webview'
import type { WebViewMessageEvent, WebViewProps } from 'react-native-webview'
import { type WebViewEndpoint, createWebViewRpcEndpoint } from './webview'

/**
 * Returns a handler of RPC message from WebView.
 */
export function useWebViewRpcAdapter({
  webViewRef,
  sdk,
  ethProvider,
  debug = false,
}: {
  webViewRef: RefObject<WebView>
  sdk: Omit<FrameHost, 'ethProviderRequestV2'>
  ethProvider?: Provider.Provider
  debug?: boolean
}) {
  const [endpoint, setEndpoint] = useState<WebViewEndpoint>()

  const onMessage: WebViewProps['onMessage'] = useCallback(
    (e: WebViewMessageEvent) => {
      endpoint?.onMessage(e)
    },
    [endpoint],
  )

  useEffect(() => {
    const newEndpoint = createWebViewRpcEndpoint(webViewRef)
    setEndpoint(newEndpoint)

    const cleanup = exposeToEndpoint({
      endpoint: newEndpoint,
      sdk,
      ethProvider,
      frameOrigin: 'ReactNativeWebView',
      debug,
    })

    return () => {
      cleanup?.()
      setEndpoint(undefined)
    }
  }, [webViewRef, sdk, ethProvider, debug])

  return useMemo(
    () => ({
      onMessage,
      emit: endpoint?.emit,
      emitEthProvider: endpoint?.emitEthProvider,
    }),
    [onMessage, endpoint],
  )
}

export function useWebViewRpcEndpoint(webViewRef: RefObject<WebView>) {
  const [endpoint, setEndpoint] = useState<WebViewEndpoint>()

  const onMessage: WebViewProps['onMessage'] = useCallback(
    (e: WebViewMessageEvent) => {
      endpoint?.onMessage(e)
    },
    [endpoint],
  )

  useEffect(() => {
    const newEndpoint = createWebViewRpcEndpoint(webViewRef)
    setEndpoint(newEndpoint)

    return () => {
      setEndpoint(undefined)
    }
  }, [webViewRef])

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
  sdk: Omit<FrameHost, 'ethProviderRequestV2'>
  ethProvider?: Provider.Provider
  debug?: boolean
}) {
  useExposeToEndpoint({
    endpoint,
    sdk,
    frameOrigin: 'ReactNativeWebView',
    ethProvider,
    debug,
  })
}
