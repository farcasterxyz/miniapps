import * as Errors from '../errors.ts'
import type { OneOf } from '../internal/types.ts'

export type Options = {
  /** Text of the cast. Mentions use the human-writable form (e.g. @farcaster). */
  text: string

  /** Embeds. Max two. The host may only allow URLs on the mini app's domain. */
  embeds?: [] | [string] | [string, string]

  /** Cast to reply to. */
  parent?: { type: 'cast'; hash: string }

  /**
   * A cast the host's guidelines check refused, posted again with the author's
   * explanation.
   */
  submissionId?: number
  codeExplanation?: string
}

export type Result = {
  cast: {
    hash: string
  }
}

export type PublishCast = (options: Options) => Promise<Result>

type RejectedByUserJsonError = {
  type: 'rejected_by_user'
}

export type PublishCastJsonError = RejectedByUserJsonError

export type PublishCastJsonResult = OneOf<
  { result: Result } | { error: PublishCastJsonError }
>

export type WirePublishCast = (
  options: Options,
) => Promise<PublishCastJsonResult>

/** Thrown when the user declines to let the mini app publish for them. */
export class RejectedByUser extends Errors.BaseError {
  override readonly name = 'PublishCast.RejectedByUser'

  constructor() {
    super('Publish cast rejected by user')
  }
}
