import type { MiniAppHost } from '@farcaster/miniapp-core'
import type * as OxProvider from 'ox/Provider'
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
  ethProvider?: OxProvider.Provider<undefined, true>
  debug?: boolean
}) {
  const prevInline = {
    width: iframe.style.width,
    height: iframe.style.height,
    minHeight: iframe.style.minHeight,
    display: iframe.style.display,
  }
  if (!prevInline.width) iframe.style.width = '100%'
  if (!prevInline.height) iframe.style.height = '100%'
  if (!prevInline.minHeight) iframe.style.minHeight = '100%'
  if (!prevInline.display) iframe.style.display = 'block'

  const endpoint = createIframeEndpoint({
    iframe,
    targetOrigin: miniAppOrigin,
    debug,
  })
  const cleanupRpc = exposeToEndpoint({
    endpoint,
    sdk,
    ethProvider,
    miniAppOrigin,
    debug,
  })

  const cleanup = () => {
    cleanupRpc()
    iframe.style.width = prevInline.width
    iframe.style.height = prevInline.height
    iframe.style.minHeight = prevInline.minHeight
    iframe.style.display = prevInline.display
  }

  return {
    endpoint,
    cleanup,
  }
}
