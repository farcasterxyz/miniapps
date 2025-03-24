import type { EmitEthProvider, FrameClientEvent } from '@farcaster/frame-core'

export interface EventSource {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: {},
  ): void

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: {},
  ): void
}

export interface HostEndpoint extends EventSource {
  postMessage(message: any): void
  emit: (event: FrameClientEvent) => void
  emitEthProvider: EmitEthProvider
}
