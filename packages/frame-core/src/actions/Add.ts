import { RpcResponse } from 'ox'
import * as Errors from '../errors'
import type { Transport } from '../jsonRpc'

export declare namespace add {
  type ErrorType =
    | InvalidFarcasterJsonError
    | RejectedByUserError
    | Errors.GlobalErrorType
}

export async function add(transport: Transport) {
  const response = await transport.request({ method: 'app_add' })

  if (response.error) {
    if (response.error.code === -32000) {
      const data = response.error.data as { name: add.ErrorType['name'] }
      if (data.name === 'Add.RejectedByUserError') {
        throw new RejectedByUserError()
      }
      if (data.name === 'Add.InvalidFarcasterJsonError') {
        throw new InvalidFarcasterJsonError()
      }
    }

    // TODO clean up error type
    throw new RpcResponse.InternalError()
  }

  return response.result
}

/**
 * Thrown when the frame does not have a valid domain manifest.
 */
export class InvalidFarcasterJsonError extends Errors.BaseError {
  override readonly name = 'Add.InvalidFarcasterJsonError'

  constructor() {
    super('Invalid farcaster.json')
  }
}

/**
 * Thrown when add frame action was rejected by the user.
 */
export class RejectedByUserError extends Errors.BaseError {
  override readonly name = 'Add.RejectedByUserError'

  constructor() {
    super('Add rejected by user')
  }
}
