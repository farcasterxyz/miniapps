/**
 * Asks the host to show the mini app full screen.
 *
 * Mini apps always open at their default (mobile-sized) frame. Hosts that can
 * show a larger frame, such as web clients, may expand the mini app to fill
 * the screen. Hosts decide whether to honor the request, for example only for
 * mini apps that set `supportsFullScreen` in their manifest. The user can
 * always return to the default frame from the host's own controls.
 *
 * The promise resolves once the mini app is full screen, and rejects if the
 * host doesn't support full screen or declines the request. Mini apps should
 * respond to the new size the same way any responsive web page does, by
 * listening for `resize` or using CSS media queries.
 *
 * @example
 * ```ts
 * try {
 *   await sdk.actions.requestFullScreen()
 * } catch {
 *   // Stay in the default frame
 * }
 * ```
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/sdk/actions/request-full-screen | Request Full Screen Documentation}
 */
export type RequestFullScreen = () => Promise<void>

/**
 * Asks the host to return the mini app to its default frame. Resolves once
 * the mini app is no longer full screen, and also resolves if it wasn't full
 * screen to begin with.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/sdk/actions/request-full-screen | Request Full Screen Documentation}
 */
export type ExitFullScreen = () => Promise<void>
