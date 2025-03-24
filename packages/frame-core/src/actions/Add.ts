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
  try {
    return await transport.request({ method: 'app_add' })
  } catch (e) {
    if (e instanceof RpcResponse.BaseError && e.code === -32000) {
      if (e.code === -32000) {
        const data = e.data as { name: add.ErrorType['name'] }
        if (data.name === 'Add.RejectedByUserError') {
          throw new RejectedByUserError()
        }
        if (data.name === 'Add.InvalidFarcasterJsonError') {
          throw new InvalidFarcasterJsonError()
        }
      }
    }

    throw e
  }
}

/**
 * Thrown when the frame does not have a valid domain manifest.
 */
export class InvalidFarcasterJsonError extends Errors.BaseError {
  override readonly name = 'Add.InvalidFarcasterJsonError'

  constructor() {
    super('Invalid farcaster.json', {
      docsPath: '/docs/actions/add',
    })
  }
}

/**
 * Thrown when add frame action was rejected by the user.
 */
export class RejectedByUserError extends Errors.BaseError {
  override readonly name = 'Add.RejectedByUserError'

  constructor() {
    super('Add rejected by user', {
      docsPath: '/docs/actions/add',
    })
  }
}
