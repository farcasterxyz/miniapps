import * as Errors from '../errors.ts'
import type { OneOf } from '../internal/types.ts'

export type SaveFileWireOptions = {
  /**
   * File bytes to save.
   */
  data: Uint8Array
  /**
   * Suggested filename including extension (e.g. `export.csv`).
   */
  filename: string
  /**
   * MIME type hint for the file (e.g. `text/csv`). Helps hosts pick filters and blob types.
   */
  mimeType?: string
}

export type SaveFile = (options: SaveFileWireOptions) => Promise<void>

type UnsupportedJsonError = {
  type: 'unsupported'
}

type RejectedByUserJsonError = {
  type: 'rejected_by_user'
}

type SaveFailedJsonError = {
  type: 'save_failed'
  message?: string
}

export type SaveFileJsonError =
  | UnsupportedJsonError
  | RejectedByUserJsonError
  | SaveFailedJsonError

export type SaveFileJsonResult = OneOf<
  { result: true } | { error: SaveFileJsonError }
>

export type WireSaveFile = (
  options: SaveFileWireOptions,
) => Promise<SaveFileJsonResult>

/**
 * Thrown when the host does not support saving files to the device.
 */
export class Unsupported extends Errors.BaseError {
  override readonly name = 'SaveFile.Unsupported'

  constructor() {
    super('Saving files is not supported in this client')
  }
}

/**
 * Thrown when the user dismisses the native save dialog or otherwise cancels.
 */
export class RejectedByUser extends Errors.BaseError {
  override readonly name = 'SaveFile.RejectedByUser'

  constructor() {
    super('Save file was cancelled')
  }
}

/**
 * Thrown when the save operation fails for a reason other than user cancellation.
 */
export class SaveFailed extends Errors.BaseError {
  override readonly name = 'SaveFile.SaveFailed'

  constructor(message = 'Failed to save file') {
    super(message)
  }
}
