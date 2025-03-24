import type * as Errors from '../errors'
import type { Transport } from '../jsonRpc'

export declare namespace ready {
  type Options = {
    /**
     * Disable native gestures. Use this option if your frame uses gestures
     * that conflict with native gestures.
     *
     * @defaultValue false
     */
    disableNativeGestures?: boolean
  }

  type ErrorType = Errors.GlobalErrorType
}

export async function ready(transport: Transport, options: ready.Options) {
  return await transport.request({
    method: 'app_ready',
    params: options,
  })
}

export const DEFAULT_READY_OPTIONS = {
  disableNativeGestures: false,
} satisfies ready.Options
