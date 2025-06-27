import { serverEventSchema } from '@farcaster/miniapp-core'
import {
  type VerifyJsonFarcasterSignature,
  verifyJsonFarcasterSignature,
} from './jfs.ts'
import {
  BaseError,
  type ParseWebhookEventResult,
  type VerifyAppKey,
} from './types.ts'

export declare namespace ParseWebhookEvent {
  type ErrorType =
    | VerifyJsonFarcasterSignature.ErrorType
    | InvalidEventDataError
}

export class InvalidEventDataError<
  C extends Error | undefined = undefined,
> extends BaseError<C> {
  override readonly name = 'VerifyJsonFarcasterSignature.InvalidEventDataError'
}

export async function parseWebhookEvent(
  rawData: unknown,
  verifyAppKey: VerifyAppKey,
): Promise<ParseWebhookEventResult> {
  const { fid, appFid, payload } = await verifyJsonFarcasterSignature(
    rawData,
    verifyAppKey,
  )

  // Pase and validate event payload
  let payloadJson: any
  try {
    payloadJson = JSON.parse(Buffer.from(payload).toString('utf-8'))
  } catch (error: unknown) {
    throw new InvalidEventDataError(
      'Error decoding and parsing payload',
      error instanceof Error ? error : undefined,
    )
  }

  const event = serverEventSchema.safeParse(payloadJson)
  if (event.success === false) {
    throw new InvalidEventDataError('Invalid event payload', event.error)
  }

  return { fid, appFid, event: event.data }
}
