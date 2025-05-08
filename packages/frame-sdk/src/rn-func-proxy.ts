import {
  type TransferHandler,
  type WireValue,
  fromWireValue,
  proxyMarker,
  toWireValue,
} from '@farcaster/frame-host'
import { isInReactNativeWebViewEnvironment } from './rn'

// Since Comlink's proxyTransferHandler doesn't work on React Native, we need to
// manually serialize and deserialize functions.
// We associate each function with a unique ID and store it in a map so the host
// receives a function stub that when called passes the ID and arguments to the
// WebView which then looks up the function by ID and calls it.

export const proxiedFunctionsForReactNative = new Map<string, Function>()
let nextFunctionId = 0

function generateFunctionId(): string {
  return `rn_webview_fn_proxy_${nextFunctionId++}`
}

const comlinkThrownValueMarker = Symbol.for('Comlink.thrown')

export const reactNativeFunctionSerializerTransferHandler: TransferHandler<
  Function,
  { __isRNProxiedFunction: true; id: string; type: 'function' }
> = {
  canHandle: (value: unknown): value is Function => {
    if (isInReactNativeWebViewEnvironment() && typeof value === 'function') {
      // In RN WebView, we force this handler for all functions to ensure ID-based proxying,
      // as standard MessageChannel-based proxying won't work.
      // This overrides Comlink's default proxyTransferHandler if the function was pre-marked.
      return true
    }
    return false
  },
  serialize: (funcToProxy: Function) => {
    const functionId = generateFunctionId()
    proxiedFunctionsForReactNative.set(functionId, funcToProxy)
    console.debug(
      `[WebView RN Comlink] Serializing function (name: '${
        funcToProxy.name || 'anonymous'
      }', hasProxyMarker: ${!!(funcToProxy as any)[proxyMarker]}) to ID: ${functionId}`,
    )
    return [
      { __isRNProxiedFunction: true, id: functionId, type: 'function' },
      [],
    ]
  },
  deserialize: (serializedValue: {
    __isRNProxiedFunction: true
    id: string
    type: 'function'
  }): Function => {
    const func = proxiedFunctionsForReactNative.get(serializedValue.id)
    if (!func) {
      console.error(
        `[WebView RN Comlink] Proxied function with ID ${serializedValue.id} not found during deserialization on WebView.`,
      )
      throw new Error(
        `Proxied function with ID ${serializedValue.id} not found on WebView.`,
      )
    }
    console.debug(
      `[WebView RN Comlink] Deserializing ID ${serializedValue.id} back to function on WebView.`,
    )
    return func
  },
}

export async function _callWebViewProxiedFunction(
  functionId: string,
  wireArgs: WireValue[],
): Promise<WireValue> {
  const func = proxiedFunctionsForReactNative.get(functionId)

  if (!func) {
    console.error(
      `[WebView RN Comlink] Proxied function with ID ${functionId} not found for execution.`,
    )
    const error = new Error(
      `Proxied function with ID ${functionId} not found on WebView.`,
    )
    const valueWithMarker = { value: error, [comlinkThrownValueMarker]: 0 }
    const [wireError] = toWireValue(valueWithMarker)
    return wireError
  }

  const args = wireArgs.map((arg) => fromWireValue(arg))

  try {
    const result = await func(...args)
    const [wireResult, transferables] = toWireValue(result)
    if (transferables.length > 0) {
      console.warn(
        '[WebView RN Comlink] Transferables returned from _callWebViewProxiedFunction are ignored.',
      )
    }
    return wireResult
  } catch (error) {
    console.error(
      `[WebView RN Comlink] Error executing proxied function ID ${functionId}:`,
      error,
    )
    const valueWithMarker = { value: error, [comlinkThrownValueMarker]: 0 }
    const [wireError] = toWireValue(valueWithMarker)
    return wireError
  }
}
