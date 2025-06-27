import type {
  EthProviderWireEvent,
  MiniAppClientEvent,
  MiniAppHostCapability,
} from '@farcaster/miniapp-core'
import type {
  AnnounceProviderParameters,
  AnnounceProviderReturnType,
  EIP1193Provider,
  EIP6963ProviderDetail,
} from 'mipd'
import * as Provider from 'ox/Provider'
import * as RpcRequest from 'ox/RpcRequest'
import * as RpcResponse from 'ox/RpcResponse'
import { miniAppHost } from './miniAppHost.ts'

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

export const ethereumProvider: Provider.Provider = Provider.from({
  ...emitter,
  async request(args) {
    // @ts-expect-error
    const request = store.prepare(args)

    try {
      const response = await miniAppHost
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
        return await miniAppHost.ethProviderRequest(request)
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

export async function getEthereumProvider(): Promise<
  Provider.Provider | undefined
> {
  try {
    const capabilities = await miniAppHost.getCapabilities()
    if (
      !capabilities.includes('wallet.getEthereumProvider') &&
      !capabilities.includes('wallet.getEvmProvider' as MiniAppHostCapability)
    ) {
      // We used getEvmProvider for a short period before getEthereumProvider.
      // In case we're talking to an old host, we check the old key.
      return undefined
    }
    return ethereumProvider
  } catch {
    // If this is an old frame host that doesn't support getCapabilities,
    // getEthereumProvider will assume that it's supported
    return ethereumProvider
  }
}

function announceEvmProvider(
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
    miniAppHost.eip6963RequestProvider()
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
      const miniAppEvent = event.data as MiniAppClientEvent
      if (miniAppEvent.event === 'eip6963:announceProvider') {
        announceEvmProvider({
          info: miniAppEvent.info,
          provider: ethereumProvider as EIP1193Provider,
        })
      }
    }
  })
}

// Required to pass SSR
if (typeof window !== 'undefined') {
  // forward eip6963:requestProvider events to the host
  window.addEventListener('eip6963:requestProvider', () => {
    miniAppHost.eip6963RequestProvider()
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
        const miniAppEvent = event.data.event as MiniAppClientEvent
        if (miniAppEvent.event === 'eip6963:announceProvider') {
          announceEvmProvider({
            info: miniAppEvent.info,
            provider: ethereumProvider as EIP1193Provider,
          })
        }
      }
    }
  })
}
