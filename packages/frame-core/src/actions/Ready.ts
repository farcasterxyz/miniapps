export type ReadyOptions = {
  /**
   * Disable native gestures. Use this option if your frame uses gestures
   * that conflict with native gestures.
   *
   * @defaultValue false
   */
  disableNativeGestures: boolean

  /**
   * Enable back navigation control in the parent rendering the Mini App.
   *
   * - If `false` no navigation control will be rendered by the parent.
   * - If `true` the parent will include a native navigation control that will
   *   trigger `backNavigationTriggered` events. It's up to the applicatin to
   *   handle these events and trigger the appropriate behavior.
   * - If `'web'` the parent will include a native navigation control that will
   *   trigger `backNavigationTriggered` events and a default handler will be
   *   setup that hooks into the web History / Navigation APIs to trigger back
   *   automatically.
   *
   * @defaultValue false
   */
  enableBackNavigation: boolean | 'web'
}

export const DEFAULT_READY_OPTIONS = {
  disableNativeGestures: false,
  enableBackNavigation: false,
} satisfies ReadyOptions

export type Ready = (options?: Partial<ReadyOptions>) => void
