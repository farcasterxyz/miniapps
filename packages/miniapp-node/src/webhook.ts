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

// Support legacy frame_* event names by mapping them to miniapp_*
const LEGACY_EVENT_MAP: Record<string, string> = {
  frame_added: 'miniapp_added',
  frame_removed: 'miniapp_removed',
  frame_add_rejected: 'miniapp_add_rejected',
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

  const normalizedPayload =
    payloadJson && typeof payloadJson.event === 'string'
      ? {
          ...payloadJson,
          event: LEGACY_EVENT_MAP[payloadJson.event] ?? payloadJson.event,
        }
      : payloadJson

  const event = serverEventSchema.safeParse(normalizedPayload)
  if (event.success === false) {
    throw new InvalidEventDataError('Invalid event payload', event.error)
  }

  return { fid, appFid, event: event.data }
}
