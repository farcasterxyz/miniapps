import type { WireMiniAppHost } from '@farcaster/miniapp-core'
import { wrap } from 'comlink'
import { endpoint } from './endpoint.ts'

export const miniAppHost = wrap<WireMiniAppHost>(endpoint)

// Backward compatibility
export const frameHost = miniAppHost
