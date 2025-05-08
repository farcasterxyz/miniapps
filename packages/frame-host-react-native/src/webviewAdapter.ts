import type {
  FrameHost,
  Remote as FrameHostRemote,
} from '@farcaster/frame-host'
import { exposeToEndpoint } from '@farcaster/frame-host'
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
import { releaseProxy, wrapWebViewForRnComlink } from './rn-comlink'
import type { ReactNativeWebViewProxy } from './rn-comlink-helpers'
import { type WebViewEndpoint, createWebViewRpcEndpoint } from './webview'

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
  sdk: Omit<FrameHost, 'ethProviderRequestV2'>
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

    const webViewProxy =
      wrapWebViewForRnComlink<ReactNativeWebViewProxy>(newEndpoint)

    const cleanup = exposeToEndpoint({
      endpoint: newEndpoint,
      sdk,
      ethProvider,
      frameOrigin: 'ReactNativeWebView',
      debug,
    })

    return () => {
      cleanup?.()
      webViewProxy?.[releaseProxy]?.()
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
  webViewRef: RefObject<WebView>,
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
  sdk: Omit<FrameHost, 'ethProviderRequestV2'>
  ethProvider?: Provider
  debug?: boolean
}) {
  useEffect(() => {
    let webViewProxy: FrameHostRemote<ReactNativeWebViewProxy> | null = null
    let cleanup: (() => void) | undefined | null = null

    if (endpoint) {
      webViewProxy = wrapWebViewForRnComlink<ReactNativeWebViewProxy>(endpoint)

      cleanup = exposeToEndpoint({
        endpoint,
        sdk,
        ethProvider,
        frameOrigin: 'ReactNativeWebView',
        debug,
      })
    }
    return () => {
      cleanup?.()
      webViewProxy?.[releaseProxy]?.()
    }
  }, [endpoint, sdk, ethProvider, debug])
}
