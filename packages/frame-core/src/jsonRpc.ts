import { RpcRequest, RpcResponse, type RpcSchema } from 'ox'
import type { openUrl } from './actions/OpenUrl'
import type { ready } from './actions/Ready'
import type { FrameContext } from './context'

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

export type Response<methodName extends RpcSchema.ExtractMethodName<Schema>> =
  RpcResponse.RpcResponse<RpcSchema.ExtractReturnType<Schema, methodName>>

export type ResponseReturnType<
  methodName extends RpcSchema.ExtractMethodName<Schema>,
> = RpcResponse.RpcResponse<RpcSchema.ExtractReturnType<Schema, methodName>>

export type RequestFn<raw extends boolean = false> = <
  methodName extends RpcSchema.ExtractMethodName<Schema>,
>(
  parameters: raw extends true
    ? RpcRequest.RpcRequest<Schema>
    : RpcSchema.ExtractRequest<Schema, methodName>,
) => Promise<
  raw extends true
    ? Response<methodName>
    : RpcSchema.ExtractReturnType<Schema, methodName>
>

export type Transport = {
  request: RequestFn<false>
}

export type TransportConfig = {
  request: RequestFn<true>
}

export const createTransport = ({
  request: requestFn,
}: TransportConfig): Transport => {
  const store = RpcRequest.createStore<Schema>()

  return {
    async request(parameters) {
      const request = store.prepare(parameters as never)
      const response = await requestFn(request as never)

      return RpcResponse.parse(response as never, {
        request,
      })
    },
  }
}
