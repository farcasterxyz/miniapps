import * as Errors from '../errors.ts'
import type { OneOf } from '../internal/types.ts'

export type SignInOptions = {
  /**
   * A random string used to prevent replay attacks.
   */
  nonce: string

  /**
   * Start time at which the signature becomes valid.
   * ISO 8601 datetime.
   */
  notBefore?: string

  /**
   * Expiration time at which the signature is no longer valid.
   * ISO 8601 datetime.
   */
  expirationTime?: string

  /**
   * Whether an [Auth
   * Address](https://github.com/farcasterxyz/protocol/discussions/225) signed
   * message is acceptable. Defaults to `true` for the best user experience.
   * Set to `false` if your verification method does not support auth addresses.
   *
   * @default true
   */
  acceptAuthAddress?: boolean
}

export type SignInResult = {
  signature: string
  message: string

  /**
   * Indicates if the signature was produced by a custody or auth address.
   */
  authMethod: 'custody' | 'authAddress'
}

export type SignIn = (options: SignInOptions) => Promise<SignInResult>

type RejectedByUserJsonError = {
  type: 'rejected_by_user'
}

export type SignInJsonError = RejectedByUserJsonError

export type SignInJsonResult = OneOf<
  { result: SignInResult } | { error: SignInJsonError }
>

export type WireSignIn = (options: SignInOptions) => Promise<SignInJsonResult>

/**
 * Thrown when a sign in action was rejected.
 */
export class RejectedByUser extends Errors.BaseError {
  override readonly name = 'SignIn.RejectedByUser'

  constructor() {
    super('Sign in rejected by user')
  }
}
