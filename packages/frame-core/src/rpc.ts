import {
  Provider,
  RpcRequest,
  RpcResponse,
  type RpcSchema,
  type RpcTransport,
} from 'ox'
import type { ShareState } from './funcs'

export interface EventSource {
  addEventListener(
    type: string,
    listener: (event: MessageEvent) => void,
    options?: {},
  ): void

  removeEventListener(
    type: string,
    listener: (event: MessageEvent) => void,
    options?: {},
  ): void
}

export interface Endpoint extends EventSource {
  postMessage(data?: any): void
}

export function createClient<schema extends RpcSchema.Generic>({
  channelName,
  endpoint,
}: {
  channelName: string
  endpoint: Endpoint
}) {
  const pendingRequestCallbacks: Record<string, (response: unknown) => void> =
    {}
  const store = RpcRequest.createStore<schema>()

  const request: RpcTransport.RequestFn<false, {}, schema> = async (
    parameters,
  ) => {
    return new Promise((resolve, reject) => {
      const request = store.prepare(parameters)

      pendingRequestCallbacks[request.id] = (response) => {
        try {
          resolve(
            RpcResponse.parse(response, {
              request,
            }) as never,
          )
        } catch (error) {
          reject(error)
        }
      }

      endpoint.postMessage({
        [channelName]: request,
      })
    })
  }

  function handleMessage(
    event: MessageEvent<Record<string, RpcResponse.RpcResponse>>,
  ) {
    const message = event.data
    if (message[channelName]) {
      const response = message[channelName]
      const callback = pendingRequestCallbacks[response.id]
      if (callback) {
        delete pendingRequestCallbacks[response.id]
        return callback(response)
      }
    }
  }

  function destroy() {
    endpoint.removeEventListener('message', handleMessage)

    for (const [id, cb] of Object.entries(pendingRequestCallbacks)) {
      cb({
        id: Number(id),
        jsonrpc: '2.0',
        error: {
          code: RpcResponse.InternalError.code,
          message: 'Client destroyed',
        },
      })
    }
  }

  endpoint.addEventListener('message', handleMessage)

  return {
    request,
    destroy,
  }
}

export function createServer<schema extends RpcSchema.Generic>({
  channelName,
  endpoint,
  handleRequest,
}: {
  channelName: string
  endpoint: Endpoint
  handleRequest: RpcTransport.RequestFn<false, {}, schema>
}) {
  function handleMessage(
    event: MessageEvent<Record<string, RpcRequest.RpcRequest>>,
  ) {
    const message = event.data
    if (message[channelName]) {
      const request = message[channelName]
      ;(async () => {
        const response = await (async () => {
          try {
            const result = await handleRequest(request as never)
            return RpcResponse.from({ result }, { request })
          } catch (e) {
            if (
              e instanceof RpcResponse.BaseError ||
              e instanceof Provider.ProviderRpcError
            ) {
              return {
                id: request.id,
                jsonrpc: request.jsonrpc,
                error: {
                  code: e.code,
                  message: e.message,
                },
              }
            }

            return {
              id: request.id,
              jsonrpc: request.jsonrpc,
              error: {
                code: RpcResponse.InternalError.code,
                message: (e as Error).message,
              },
            }
          }
        })()

        endpoint.postMessage({
          [channelName]: response,
        })
      })()
    }

    return
  }

  endpoint.addEventListener('message', handleMessage)

  function close() {
    endpoint.removeEventListener('message', handleMessage)
  }

  return {
    close,
  }
}

export type AppProviderSchema = RpcSchema.From<{
  Request: {
    method: 'get_share_state'
    params?: undefined
  }
  ReturnType: ShareState
}>
