export type ReadyOptions = {
  /**
   * Disable native gestures. Use this option if your frame uses gestures
   * that conflict with native gestures.
   *
   * @defaultValue false
   */
  disableNativeGestures: boolean
}

export const DEFAULT_READY_OPTIONS = {
  disableNativeGestures: false,
} satisfies ReadyOptions

export type Ready = (options?: Partial<ReadyOptions>) => void
