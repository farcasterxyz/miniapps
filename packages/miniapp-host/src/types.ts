import type { EmitEthProvider, MiniAppClientEvent } from '@farcaster/miniapp-core'
import type { Endpoint } from './comlink/protocol.ts'

export type HostEndpoint = Endpoint & {
  emit: (event: MiniAppClientEvent) => void
  emitEthProvider: EmitEthProvider
}
