import type { Address } from 'ox';
import * as Errors from '../errors'
import { OneOf } from '../internal/types';

export type SignInOptions  = {
 /**
  * A random string used to prevent replay attacks.
  */
  nonce: string;

 /**
  * Start time at which the signature becomes valid. 
  * ISO 8601 datetime.	
  */
  notBefore?: string;

  /**
   * Expiration time at which the signature is no longer valid. 
   * ISO 8601 datetime.	
   */
  expirationTime?: string;
};

export type SignInResult = {
  signature: string; 
  message: string;
}

export type SignIn = (options: SignInOptions) => Promise<SignInResult>;

export type RejectedByUserError  = {
  type: 'rejected_by_user'
};

export type JsonSignInError = RejectedByUserError;

export type WireSignInResponse = OneOf<{ result: SignInResult } | { error: JsonSignInError }>

export type WireSignIn = (options: SignInOptions) => Promise<WireSignInResponse>;

/**
 * Thrown when a sign in action was rejected.
 */
export class RejectedByUser extends Errors.BaseError {
  override readonly name = 'SignIn.RejectedByUser'

  constructor() {
    super("Sign in rejected by user")
  }
}
