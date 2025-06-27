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
import type WebView from 'react-native-webview'
import type { WebViewMessageEvent, WebViewProps } from 'react-native-webview'
import { type WebViewEndpoint, createWebViewRpcEndpoint } from './webview.ts'

/**
 * Returns a handler of RPC message from WebView.
 */
export function useWebViewRpcAdapter({
  webViewRef,
  domain,
  sdk,
  ethProvider,
  debug = false,
}: {
  webViewRef: RefObject<WebView>
  domain: string
  sdk: Omit<MiniAppHost, 'ethProviderRequestV2'>
  ethProvider?: Provider
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
    const newEndpoint = createWebViewRpcEndpoint(webViewRef, domain)
    setEndpoint(newEndpoint)

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
  }, [webViewRef, domain, sdk, ethProvider, debug])

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
) {
  const [endpoint, setEndpoint] = useState<WebViewEndpoint>()

  const onMessage: WebViewProps['onMessage'] = useCallback(
    (e: WebViewMessageEvent) => {
      endpoint?.onMessage(e)
    },
    [endpoint],
  )

  useEffect(() => {
    const newEndpoint = createWebViewRpcEndpoint(webViewRef, domain)
    setEndpoint(newEndpoint)

    return () => {
      setEndpoint(undefined)
    }
  }, [webViewRef, domain])

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
  sdk: Omit<MiniAppHost, 'ethProviderRequestV2'>
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
