import { type Endpoint, windowEndpoint } from 'comlink'

const mockEndpoint: Endpoint = {
  postMessage() {
    // noop
  },
  addEventListener: () => {
    // noop
  },
  removeEventListener: () => {
    // noop
  },
}

const webViewEndpoint: Endpoint = {
  postMessage: (data: unknown) => {
    console.debug('[webview:req]', data)
    window.ReactNativeWebView.postMessage(JSON.stringify(data))
  },
  addEventListener: (_, listener, ...args) => {
    document.addEventListener('FarcasterFrameCallback', listener, ...args)
  },
  removeEventListener: (_, listener) => {
    document.removeEventListener('FarcasterFrameCallback', listener)
  },
}

export const endpoint = (() => {
  // No actions are actually gonna take place during SSR, thus it's safe to return mocked endpoint
  if (typeof window === 'undefined') return mockEndpoint
  return window?.ReactNativeWebView
    ? webViewEndpoint
    : windowEndpoint(window?.parent ?? window)
})()
