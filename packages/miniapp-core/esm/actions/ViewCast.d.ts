export type ViewCastOptions = {
    /**
     * The hash of the cast to view.
     * @example "0x6a112e2d35e2d2008e25dd29811e8769d1edd9ca"
     */
    hash: string;
    /**
     * Whether the app should be closed when this action is called.
     * If true, the app will be closed after opening the cast view.
     */
    close?: boolean;
};
/**
 * Opens a cast view in the Farcaster client.
 *
 * @example
 * ```ts
 * await sdk.actions.viewCast({
 *   hash: "0x6a112e2d35e2d2008e25dd29811e8769d1edd9ca"
 * })
 * ```
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/sdk/actions/view-cast | View Cast Documentation}
 */
export type ViewCast = (options: ViewCastOptions) => Promise<void>;
