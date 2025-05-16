import type { FrameHost } from '@farcaster/frame-core'
import type * as Provider from 'ox/Provider'
import { useEffect } from 'react'
import * as Comlink from '../comlink'
import type { HostEndpoint } from '../types'
import {
  forwardEthereumProviderEvents,
  wrapEthereumProviderRequest,
} from './ethereumProvider'
import { wrapHandlers } from './sdk'

/**
 * @returns function to cleanup provider listeners
 */
export function exposeToEndpoint({
  endpoint,
  sdk,
  frameOrigin,
  ethProvider,
  debug = false,
}: {
  endpoint: HostEndpoint
  sdk: Omit<FrameHost, 'ethProviderRequestV2'>
  frameOrigin: string
  ethProvider?: Provider.Provider
  debug?: boolean
}) {
  const extendedSdk = wrapHandlers(sdk as FrameHost)

  let cleanup: (() => void) | undefined
  if (ethProvider) {
    extendedSdk.ethProviderRequestV2 = wrapEthereumProviderRequest({
      provider: ethProvider,
      debug,
    })
    cleanup = forwardEthereumProviderEvents({ provider: ethProvider, endpoint })
  }

  const unexpose = Comlink.expose(extendedSdk, endpoint, [frameOrigin])

  return () => {
    cleanup?.()
    unexpose()
  }
}

export function useExposeToEndpoint({
  endpoint,
  sdk,
  frameOrigin,
  ethProvider,
  debug = false,
}: {
  endpoint: HostEndpoint | undefined
  sdk: Omit<FrameHost, 'ethProviderRequestV2'>
  frameOrigin: string
  ethProvider?: Provider.Provider
  debug?: boolean
}) {
  useEffect(() => {
    if (!endpoint) {
      return
    }

    const cleanup = exposeToEndpoint({
      endpoint,
      sdk,
      frameOrigin,
      ethProvider,
      debug,
    })

    return cleanup
  }, [endpoint, sdk, ethProvider, frameOrigin, debug])
}
