import type {
  EthProviderWireEvent,
  FrameClientEvent,
} from '@farcaster/frame-core'
import type {
  AnnounceProviderParameters,
  AnnounceProviderReturnType,
  EIP1193Provider,
  EIP6963ProviderDetail,
} from 'mipd'
import * as Provider from 'ox/Provider'
import * as RpcRequest from 'ox/RpcRequest'
import * as RpcResponse from 'ox/RpcResponse'
import { frameHost } from './frameHost'

const emitter = Provider.createEmitter()
const store = RpcRequest.createStore()

type GenericProviderRpcError = {
  code: number
  details?: string
}

function toProviderRpcError({
  code,
  details,
}: GenericProviderRpcError): Provider.ProviderRpcError {
  switch (code) {
    case 4001:
      return new Provider.UserRejectedRequestError()
    case 4100:
      return new Provider.UnauthorizedError()
    case 4200:
      return new Provider.UnsupportedMethodError()
    case 4900:
      return new Provider.DisconnectedError()
    case 4901:
      return new Provider.ChainDisconnectedError()
    default:
      return new Provider.ProviderRpcError(
        code,
        details ?? 'Unknown provider RPC error',
      )
  }
}

export const provider: Provider.Provider = Provider.from({
  ...emitter,
  async request(args) {
    // @ts-expect-error
    const request = store.prepare(args)

    try {
      const response = await frameHost
        .ethProviderRequestV2(request)
        .then((res) => RpcResponse.parse(res, { request, raw: true }))

      if (response.error) {
        throw toProviderRpcError(response.error)
      }

      return response.result
    } catch (e) {
      // ethProviderRequestV2 not supported, fall back to v1
      if (
        e instanceof Error &&
        e.message.match(/cannot read property 'apply'/i)
      ) {
        return await frameHost.ethProviderRequest(request)
      }

      if (
        e instanceof Provider.ProviderRpcError ||
        e instanceof RpcResponse.BaseError
      ) {
        throw e
      }

      throw new RpcResponse.InternalError({
        message: e instanceof Error ? e.message : undefined,
      })
    }
  },
})

function announceProvider(
  detail: AnnounceProviderParameters,
): AnnounceProviderReturnType {
  const event: CustomEvent<EIP6963ProviderDetail> = new CustomEvent(
    'eip6963:announceProvider',
    { detail: Object.freeze(detail) },
  )

  window.dispatchEvent(event)

  const handler = () => window.dispatchEvent(event)
  window.addEventListener('eip6963:requestProvider', handler)
  return () => window.removeEventListener('eip6963:requestProvider', handler)
}

// Required to pass SSR
if (typeof document !== 'undefined') {
  // forward eip6963:requestProvider events to the host
  document.addEventListener('eip6963:requestProvider', () => {
    frameHost.eip6963RequestProvider()
  })

  // react native webview events
  document.addEventListener('FarcasterFrameEthProviderEvent', (event) => {
    if (event instanceof MessageEvent) {
      const ethProviderEvent = event.data as EthProviderWireEvent
      // @ts-expect-error
      emitter.emit(ethProviderEvent.event, ...ethProviderEvent.params)
    }
  })

  document.addEventListener('FarcasterFrameEvent', (event) => {
    if (event instanceof MessageEvent) {
      const frameEvent = event.data as FrameClientEvent
      if (frameEvent.event === 'eip6963:announceProvider') {
        announceProvider({
          info: frameEvent.info,
          provider: provider as EIP1193Provider,
        })
      }
    }
  })
}

// Required to pass SSR
if (typeof window !== 'undefined') {
  // forward eip6963:requestProvider events to the host
  window.addEventListener('eip6963:requestProvider', () => {
    frameHost.eip6963RequestProvider()
  })

  // web events
  window.addEventListener('message', (event) => {
    if (event instanceof MessageEvent) {
      if (event.data.type === 'frameEthProviderEvent') {
        const ethProviderEvent = event.data as EthProviderWireEvent
        // @ts-expect-error
        emitter.emit(ethProviderEvent.event, ...ethProviderEvent.params)
      }
    }
  })

  window.addEventListener('message', (event) => {
    if (event instanceof MessageEvent) {
      if (event.data.type === 'frameEvent') {
        const frameEvent = event.data.event as FrameClientEvent
        if (frameEvent.event === 'eip6963:announceProvider') {
          announceProvider({
            info: frameEvent.info,
            provider: provider as EIP1193Provider,
          })
        }
      }
    }
  })
}
