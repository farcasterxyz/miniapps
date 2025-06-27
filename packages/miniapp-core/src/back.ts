export type BackState = {
  /**
   * Is the back control visible. Note that on mobile devices Farcaster clients
   * may support a gesture based control rather than button control.
   *
   * @default false
   */
  visible: boolean
}

export const DEFAULT_BACK_STATE = {
  visible: false,
} satisfies BackState

export type UpdateBackState = (state: BackState) => Promise<void>
