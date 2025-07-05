import type { MiniAppHost } from '@farcaster/miniapp-core'
import type * as Provider from 'ox/Provider'
import { useEffect } from 'react'
import * as Comlink from '../comlink/index.ts'
import type { HostEndpoint } from '../types.ts'
import {
  forwardEthereumProviderEvents,
  wrapEthereumProviderRequest,
} from './ethereumProvider.ts'
import { wrapHandlers } from './sdk.ts'

/**
 * @returns function to cleanup provider listeners
 */
export function exposeToEndpoint({
  endpoint,
  sdk,
  miniAppOrigin,
  ethProvider,
  debug = false,
}: {
  endpoint: HostEndpoint
  sdk: Omit<MiniAppHost, 'ethProviderRequestV2' | 'addFrame'>
  miniAppOrigin: string
  ethProvider?: Provider.Provider
  debug?: boolean
}) {
  const extendedSdk = wrapHandlers(sdk as MiniAppHost)

  let cleanup: (() => void) | undefined
  if (ethProvider) {
    extendedSdk.ethProviderRequestV2 = wrapEthereumProviderRequest({
      provider: ethProvider,
      debug,
    })
    cleanup = forwardEthereumProviderEvents({ provider: ethProvider, endpoint })
  }

  const unexpose = Comlink.expose(extendedSdk, endpoint, [miniAppOrigin])

  return () => {
    cleanup?.()
    unexpose()
  }
}

export function useExposeToEndpoint({
  endpoint,
  sdk,
  miniAppOrigin,
  ethProvider,
  debug = false,
}: {
  endpoint: HostEndpoint | undefined
  sdk: Omit<MiniAppHost, 'ethProviderRequestV2'>
  miniAppOrigin: string
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
      miniAppOrigin,
      ethProvider,
      debug,
    })

    return cleanup
  }, [endpoint, sdk, ethProvider, miniAppOrigin, debug])
}
