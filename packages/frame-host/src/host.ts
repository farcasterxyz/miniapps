import { Provider, type WireFrameHost } from '@farcaster/frame-core'
import { RpcResponse } from 'ox'

export function fromHost({
  host,
}: {
  host: WireFrameHost
}): Provider.Provider {
  const emitter = Provider.createEmitter()

  // @ts-expect-error
  return {
    ...emitter,
    async request({ method, params }) {
      try {
        switch (method) {
          case 'app_context':
            return host.context as never
          case 'app_ready':
            return host.ready(params as never) as never
          case 'app_add':
            return host.addFrame() as never
          case 'app_open_url':
            return host.openUrl(params as never) as never
          default:
            throw new RpcResponse.MethodNotSupportedError()
        }
      } catch (e) {
        if (e instanceof RpcResponse.BaseError) {
          throw e
        }

        // TODO message?
        throw new RpcResponse.InternalError()
      }
    },
  }
}

// // SDK to wire functions
// export function handleJsonRpc({ request }) {
//         const request = ev.data.payload as JsonRpc.Request

//       const result = await (async () => {
//         try {
//           const result = await frameProvider.request(request)

//           return {
//             id: request.id,
//             jsonrpc: request.jsonrpc,
//             result,
//           }
//         } catch (e) {
//           if (e instanceof RpcResponse.BaseError) {
//             return {
//               id: request.id,
//               jsonrpc: request.jsonrpc,
//               error: {
//                 code: e.code,
//                 message: e.message,
//                 data: e.data,
//               },
//             }
//           }
//         }
//       })()
// }
