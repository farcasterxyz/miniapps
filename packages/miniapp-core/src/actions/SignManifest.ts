import * as Errors from '../errors.ts'
import type { OneOf } from '../internal/types.ts'

export type SignManifestOptions = {
  domain: string
}

export type SignManifestResult = {
  header: string
  payload: string
  signature: string
}

export type SignManifest = (
  options: SignManifestOptions,
) => Promise<SignManifestResult>

type RejectedByUserJsonError = {
  type: 'rejected_by_user'
}

type InvalidDomainJsonError = {
  type: 'invalid_domain'
}

type GenericErrorJsonError = {
  type: 'generic_error'
  message?: string
}

export type SignManifestJsonError =
  | RejectedByUserJsonError
  | InvalidDomainJsonError
  | GenericErrorJsonError

export type SignManifestRejectedReason = SignManifestJsonError['type']

export type SignManifestJsonResult = OneOf<
  { result: SignManifestResult } | { error: SignManifestJsonError }
>

export type WireSignManifest = (
  options: SignManifestOptions,
) => Promise<SignManifestJsonResult>

/**
 * Thrown when sign manifest action was rejected by the user.
 */
export class RejectedByUser extends Errors.BaseError {
  override readonly name = 'SignManifest.RejectedByUser'

  constructor() {
    super('Sign manifest rejected by user')
  }
}

/**
 * Thrown when the provided domain is invalid.
 */
export class InvalidDomain extends Errors.BaseError {
  override readonly name = 'SignManifest.InvalidDomain'

  constructor() {
    super('Invalid domain provided')
  }
}

/**
 * Thrown when manifest signing fails for generic reasons.
 */
export class GenericError extends Errors.BaseError {
  override readonly name = 'SignManifest.GenericError'

  constructor(message = 'Manifest signing failed') {
    super(message)
  }
}
