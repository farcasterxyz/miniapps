import type { MiniAppServerEvent } from '@farcaster/miniapp-core'

export type VerifyAppKeyResult =
  | { valid: true; appFid: number }
  | { valid: false }

export type VerifyAppKey = (
  fid: number,
  appKey: string,
) => Promise<VerifyAppKeyResult>

export type VerifyJfsResult = {
  fid: number
  appFid: number
  payload: Uint8Array
}

export type ParseWebhookEventResult = {
  fid: number
  appFid: number
  event: MiniAppServerEvent
}

export class BaseError<C extends Error | undefined = undefined> extends Error {
  override name = 'BaseError'
  cause: C

  constructor(message: string, cause?: C) {
    super(message)
    this.cause = cause as any
  }
}
