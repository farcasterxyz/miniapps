import type { MiniAppHost } from '@farcaster/miniapp-core'
import type { Provider } from 'ox/Provider'
import * as Comlink from './comlink/index.ts'
import { exposeToEndpoint } from './helpers/endpoint.ts'
import type { HostEndpoint } from './types.ts'

/**
 * An endpoint of communicating with an iFrame
 */
export function createIframeEndpoint({
  iframe,
  targetOrigin,
  debug = true,
}: {
  iframe: HTMLIFrameElement
  targetOrigin: string
  debug?: boolean
}): HostEndpoint {
  return {
    // when is contentWindow null
    ...Comlink.windowEndpoint(iframe.contentWindow!),
    emit: (event) => {
      if (debug) {
        console.debug('frameEvent', event)
      }

      const wireEvent = {
        type: 'frameEvent',
        event,
      }

      iframe.contentWindow?.postMessage(wireEvent, targetOrigin)
    },
    emitEthProvider: (event, params) => {
      if (debug) {
        console.debug('fc:emitEthProvider', event, params)
      }

      const wireEvent = {
        type: 'frameEthProviderEvent',
        event,
        params,
      }

      iframe.contentWindow?.postMessage(wireEvent, targetOrigin)
    },
  }
}

export function exposeToIframe({
  iframe,
  sdk,
  ethProvider,
  miniAppOrigin,
  debug = false,
}: {
  iframe: HTMLIFrameElement
  sdk: Omit<MiniAppHost, 'ethProviderRequestV2'>
  miniAppOrigin: string
  ethProvider?: Provider
  debug?: boolean
}) {
  const endpoint = createIframeEndpoint({
    iframe,
    targetOrigin: miniAppOrigin,
    debug,
  })
  const cleanup = exposeToEndpoint({
    endpoint,
    sdk,
    ethProvider,
    miniAppOrigin,
    debug,
  })

  return {
    endpoint,
    cleanup,
  }
}
