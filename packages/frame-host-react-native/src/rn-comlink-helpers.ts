import {
  type Remote,
  type TransferHandler,
  type WireValue,
  WireValueType,
  fromWireValue,
  toWireValue,
} from '@farcaster/frame-host'

// The shape of the serialized function reference coming from the WebView
interface SerializedRnFunction {
  __isRNProxiedFunction: true
  id: string
  type: 'function'
}

function processArgumentsForRN(
  argumentList: any[],
): [WireValue[], Transferable[]] {
  const processed = argumentList.map((arg) => toWireValue(arg))
  const wireValues = processed.map((p) => p[0])
  const transferables = processed.flatMap((p) => p[1])
  if (transferables.length > 0) {
    console.warn(
      '[RN Host Comlink] Transferables found in arguments to WebView proxied function are ignored.',
    )
  }
  return [wireValues, []]
}

export interface ReactNativeWebViewProxy {
  _callWebViewProxiedFunction: (
    id: string,
    args: WireValue[],
  ) => Promise<WireValue>
}

/**
 * Creates a Comlink TransferHandler for deserializing functions proxied from WebView
 * and serializing function stubs created by this handler.
 */
export function createReactNativeFunctionDeserializer(
  getWebViewProxy: () => Remote<ReactNativeWebViewProxy> | undefined,
): TransferHandler<Function, SerializedRnFunction> {
  return {
    // canHandle checks if a given value is a Function stub that this handler can serialize.
    canHandle: (value: unknown): value is Function => {
      return (
        typeof value === 'function' &&
        Object.hasOwn(value, '__functionId__') &&
        typeof (value as any).__functionId__ === 'string'
      )
    },
    // deserialize converts the wire format (SerializedRnFunction) into a callable Function stub.
    deserialize: (serializedValue: SerializedRnFunction): Function => {
      const functionId = serializedValue.id
      console.debug(
        `[RN Host Comlink] Creating stub for WebView function ID: ${functionId}`,
      )
      const webViewFunctionStub = async (...args: any[]) => {
        const webViewProxy = getWebViewProxy()
        if (!webViewProxy || !webViewProxy._callWebViewProxiedFunction) {
          console.error(
            '[RN Host Comlink] WebView proxy or _callWebViewProxiedFunction not available.',
          )
          throw new Error(
            '[RN Host Comlink] WebView proxy not available. Cannot call remote function.',
          )
        }
        console.debug(
          `[RN Host Comlink] Calling WebView function ID: ${functionId} with args:`,
          args,
        )
        const [wireArgs] = processArgumentsForRN(args)
        try {
          const typedProxy = webViewProxy as Remote<ReactNativeWebViewProxy>
          const wireResult = await typedProxy._callWebViewProxiedFunction(
            functionId,
            wireArgs,
          )
          if (
            wireResult &&
            wireResult.type === WireValueType.HANDLER &&
            (wireResult as any).name === 'throw'
          ) {
            return fromWireValue(wireResult)
          }
          return fromWireValue(wireResult)
        } catch (error) {
          console.error(
            `[RN Host Comlink] Error in stub for function ID ${functionId}:`,
            error,
          )
          throw error
        }
      }
      ;(webViewFunctionStub as any).__functionId__ = functionId
      return webViewFunctionStub
    },
    // serialize converts a Function stub (that this handler knows about) into its wire format.
    serialize: (fnStub: Function): [SerializedRnFunction, Transferable[]] => {
      // canHandle should have already verified this is one of our stubs.
      const id = (fnStub as any).__functionId__
      console.debug(`[RN Host Comlink] Serializing function stub ID: ${id}`)
      return [{ __isRNProxiedFunction: true, id, type: 'function' }, []]
    },
  }
}
