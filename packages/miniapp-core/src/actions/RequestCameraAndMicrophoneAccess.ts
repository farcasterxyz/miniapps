/**
 * Requests permission to access the camera and microphone.
 * This method will trigger a permission dialog in the host app.
 *
 * The promise will resolve if the user grants permission, and reject if denied.
 *
 * @example
 * ```ts
 * try {
 *   await sdk.actions.requestCameraAndMicrophoneAccess()
 *   console.log('Camera and microphone access granted')
 * } catch (error) {
 *   console.log('Camera and microphone access denied')
 * }
 * ```
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/sdk/actions/request-camera-and-microphone-access | Request Camera and Microphone Access Documentation}
 */
export type RequestCameraAndMicrophoneAccess = () => Promise<void>
