import { expose, transferHandlers } from 'comlink'
import {
  _callWebViewProxiedFunction,
  proxiedFunctionsForReactNative,
  reactNativeFunctionSerializerTransferHandler,
} from './rn-func-proxy'

const comlinkListeners = new Map<EventListener, EventListener>()

/**
 * @returns true if the environment is a React Native WebView, false otherwise.
 */
export function isInReactNativeWebViewEnvironment(): boolean {
  return typeof window !== 'undefined' && !!(window as any).ReactNativeWebView
}

/**
 * Initializes the React Native SDK.
 * This function should be called before the SDK is used.
 *
 * This is necessary because Complink function proxing doesn't work on React Native
 * so we have our custom implementation we need to expose to the host.
 */
export const initializeReactNativeSDK = () => {
  if (isInReactNativeWebViewEnvironment()) {
    if (!transferHandlers.has('rn_function')) {
      transferHandlers.set(
        'rn_function',
        reactNativeFunctionSerializerTransferHandler as any,
      )
      console.debug(
        '[WebView RN Comlink] Registered reactNativeFunctionSerializerTransferHandler.',
      )
    }

    const sdkApiToExpose = {
      _callWebViewProxiedFunction,
    }

    if (window.ReactNativeWebView) {
      const endpointForHostViaRN = {
        postMessage: (message: any, _transfer?: Transferable[]) => {
          if (window.ReactNativeWebView) {
            console.debug('[SDK->Host Comlink] postMessage', message)
            window.ReactNativeWebView.postMessage(JSON.stringify(message))
          } else {
            console.error(
              '[SDK->Host Comlink] ReactNativeWebView became undefined.',
            )
          }
        },
        addEventListener: (
          type: string,
          listener: EventListenerOrEventListenerObject,
        ) => {
          if (type === 'message' && typeof listener === 'function') {
            const adaptedListener = (event: Event) => {
              const me = event as MessageEvent
              const comlinkMessageData = me.data

              if (!comlinkMessageData) {
                console.warn(
                  '[SDK Comlink Endpoint] Received event with no data from host',
                )
                return
              }
              // Comlink's listener expects a MessageEvent-like object with a `data` property.
              // Cast to `any` to satisfy the EventListenerOrEventListenerObject type constraint,
              // while providing the structure Comlink needs.
              listener({ data: comlinkMessageData } as any)
            }
            comlinkListeners.set(listener, adaptedListener)
            document.addEventListener('FarcasterFrameCallback', adaptedListener)
          }
        },
        removeEventListener: (
          type: string,
          listener: EventListenerOrEventListenerObject,
        ) => {
          if (type === 'message' && typeof listener === 'function') {
            const adaptedListener = comlinkListeners.get(listener)
            if (adaptedListener) {
              console.debug('[SDK->Host Comlink] removeEventListener', listener)
              document.removeEventListener(
                'FarcasterFrameCallback',
                adaptedListener,
              )
              comlinkListeners.delete(listener)
            }
          }
        },
      }

      try {
        expose(sdkApiToExpose, endpointForHostViaRN)
        console.debug(
          '[WebView RN Comlink] Exposed SDK API for RN Host:',
          Object.keys(sdkApiToExpose),
        )
      } catch (e) {
        // Comlink throws if an endpoint is already exposed.
        console.warn(
          '[WebView RN Comlink] Error exposing SDK API (might be already exposed): ',
          e,
        )
      }

      window.addEventListener('unload', () => {
        proxiedFunctionsForReactNative.clear()
        comlinkListeners.forEach((adaptedListener, _originalListener) => {
          document.removeEventListener(
            'FarcasterFrameCallback',
            adaptedListener,
          )
        })
        comlinkListeners.clear()
      })
    } else {
      console.warn(
        '[WebView RN Comlink] ReactNativeWebView not found, cannot expose SDK API to host.',
      )
    }
  }
}
