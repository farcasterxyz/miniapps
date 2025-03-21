import * as Errors from '../errors'
import type { Transport } from '../jsonRpc'

export declare namespace openUrl {
  type Options = {
    /** The URL to open **/
    url: string
  }

  type ErrorType = OpenFailedError | Errors.GlobalErrorType
}

export async function openUrl(transport: Transport, options: openUrl.Options) {
  // TODO catch and throw OpenFailedError
  return transport.request({ method: 'app_open_url', params: options })
}

/**
 * Thrown if the URL can't be opened.
 */
export class OpenFailedError extends Errors.BaseError {
  override readonly name = 'OpenUrl.OpenFailedError'

  constructor({ url }: { url: string }) {
    super(`Failed to open URL \`${url}\`.`)
  }
}
