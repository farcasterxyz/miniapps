import { RefObject, useCallback, useEffect, useRef } from "react";
import type { Provider } from "ox";
import WebView, {
  WebViewMessageEvent,
  WebViewProps,
} from "react-native-webview";
import type { FrameHost } from "@farcaster/frame-core";
import {
  exposeToEndpoint,
  HostEndpoint,
  useExposeToEndpoint,
} from "@farcaster/frame-host";
import { WebViewEndpoint, createWebViewRpcEndpoint } from "./webview";

/**
 * Returns a handler of RPC message from WebView.
 */
export function useWebViewRpcAdapter({
  webViewRef,
  sdk,
  ethProvider,
  debug = false,
}: {
  webViewRef: RefObject<WebView>;
  sdk: Omit<FrameHost, "ethProviderRequestV2">;
  ethProvider?: Provider.Provider;
  debug?: boolean;
}) {
  const endpointRef = useRef<WebViewEndpoint>();

  const onMessage: WebViewProps["onMessage"] = useCallback(
    (e: WebViewMessageEvent) => {
      endpointRef.current?.onMessage(e);
    },
    [endpointRef],
  );

  useEffect(() => {
    const endpoint = createWebViewRpcEndpoint(webViewRef);
    endpointRef.current = endpoint;

    const cleanup = exposeToEndpoint({
      endpoint,
      sdk,
      ethProvider,
      frameOrigin: "ReactNativeWebView",
      debug,
    });

    return () => {
      cleanup?.();
      endpointRef.current = undefined;
    };
  }, [webViewRef, sdk, ethProvider]);

  return {
    onMessage,
    emit: endpointRef.current?.emit,
    emitEthProvider: endpointRef.current?.emitEthProvider,
  };
}

export function useWebViewRpcEndpoint(webViewRef: RefObject<WebView>) {
  const endpointRef = useRef<WebViewEndpoint>();

  const onMessage: WebViewProps["onMessage"] = useCallback(
    (e: WebViewMessageEvent) => {
      endpointRef.current?.onMessage(e);
    },
    [endpointRef],
  );

  useEffect(() => {
    const endpoint = createWebViewRpcEndpoint(webViewRef);
    endpointRef.current = endpoint;

    return () => {
      endpointRef.current = undefined;
    };
  }, [webViewRef]);

  return {
    endpoint: endpointRef.current,
    onMessage,
  };
}

export function useExposeWebViewToEndpoint({
  endpoint,
  sdk,
  ethProvider,
  debug = false,
}: {
  endpoint: WebViewEndpoint | undefined;
  sdk: Omit<FrameHost, "ethProviderRequestV2">;
  ethProvider?: Provider.Provider;
  debug?: boolean;
}) {
  useExposeToEndpoint({
    endpoint,
    sdk,
    frameOrigin: "ReactNativeWebView",
    ethProvider,
    debug,
  });
}
