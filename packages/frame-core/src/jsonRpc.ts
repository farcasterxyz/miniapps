import type { RpcRequest, RpcResponse, RpcSchema } from 'ox'
import * as Errors from './errors'
import type { FrameContext } from './context'
import type { ready } from './actions/Ready'
import type { openUrl } from './actions/OpenUrl'

export type Schema = RpcSchema.From<
  | {
      Request: {
        method: 'app_add'
        params?: undefined
      }
      ReturnType: undefined
    }
  | {
      Request: {
        method: 'app_context'
        params?: undefined
      }
      ReturnType: FrameContext
    }
  | {
      Request: {
        method: 'app_ready'
        params?: ready.Options
      }
      ReturnType: undefined
    }
  | {
      Request: {
        method: 'app_open_url'
        params?: openUrl.Options
      }
      ReturnType: undefined
    }
>

export type Request = RpcRequest.RpcRequest<Schema>
export type Response = RpcResponse.RpcResponse<Schema>

export type RequestFn = <
  methodName extends RpcSchema.MethodNameGeneric<Schema>,
>(
  parameters: RpcSchema.ExtractRequest<Schema, methodName>,
) => Promise<
  RpcResponse.RpcResponse<RpcSchema.ExtractReturnType<Schema, methodName>>
>

export type Transport = {
  request: RequestFn
}

type TransportConfig = {
  request: RequestFn
}

export const createTransport = ({ request }: TransportConfig): Transport => ({
  request,
})

export type RequestHandler = (request: Request) => Promise<Response>

export class RpcRequestError extends Errors.BaseError {
  override name = 'JsonRpc.RpcRequestError'

  code: number
  data?: unknown

  constructor({
    error,
  }: {
    body: { [x: string]: unknown } | { [y: string]: unknown }[]
    error: { code: number; data?: unknown; message: string }
    url: string
  }) {
    super('RPC request failed.', {
      cause: error as any,
    })
    this.code = error.code
    this.data = error.data
  }
}
