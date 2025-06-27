/**
 * Farcaster manifest for a domain hosted at `/.well-known/farcaster.json`
 */
export type Manifest = {
    accountAssociation: AccountAssociation;
    miniapp?: MiniAppConfig;
    frame?: MiniAppConfig;
};
/**
 * Signed domain association linking this miniapp to a Farcaster account
 *
 * A DomainAssociation can be generated using the {@link https://farcaster.xyz/~/developers/domains | Warpcast
 * Domains Developer} tool.
 */
export type AccountAssociation = {
    /**
     * Base64URL encoded JFS signature
     */
    header: string;
    /**
     * Base64URL encoded payload signature
     */
    payload: string;
    /**
     * Base64URL encoded signature
     */
    signature: string;
};
/**
 * MiniApp configuration
 *
 * @example
 * ``ts
 * const miniapp: MiniAppConfig = {
 *   version: '1',
 *   name: 'Yoink!',
 *   homeUrl: 'https://yoink.party',
 *   iconUrl: 'https://yoink.party/img/icon.png',
 *   imageUrl: 'https://yoink.party/framesV2/opengraph-image',
 *   buttonTitle: '🚩 Start',
 *   splashImageUrl: 'https://yoink.party/img/splash.png',
 *   splashImageBackgroundColor: '#eeeee4',
 *   webhookUrl: 'https://yoink.party/webhook'
 * };
 * ``
 */
export type MiniAppConfig = {
    /**
     * Manifest version
     *
     * Must be the literal '1'.
     */
    version: '1';
    /**
     * App name that will be displayed to users
     *
     * Max length of 32 characters.
     */
    name: string;
    /**
     * Default launch URL
     *
     * Max length of 1024 characters.
     */
    homeUrl: string;
    /**
     * Icon URL
     *
     * Max length of 1024 characters. Image must be 200x200px and less than 1MB.
     */
    iconUrl: string;
    /**
     * Image URL
     *
     * Max length of 1024 characters. Image must have a 3:2 ratio.
     */
    imageUrl: string;
    /**
     * Default button title to use when miniapp is rendered.
     *
     * Max length of 32 characters.
     */
    buttonTitle: string;
    /**
     * Splash image URL
     *
     * Max length of 1024 characters. Image must be 200x200px and less than 1MB.
     */
    splashImageUrl?: string;
    /**
     * Splash background color
     *
     * Must be a hex color code.
     */
    splashBackgroundColor?: string;
    /**
     * URL to which clients will POST server events.
     * Max length of 1024 characters.
     * Required if the miniapp application uses notifications.
     */
    webhookUrl?: string;
    /**
     * Canonical domain for the miniapp application.
     * If specified, this domain will be treated as the primary domain for the miniapp.
     * Max length of 1024 characters.
     */
    canonicalDomain?: string;
};
/**
 * Helper function to get the MiniApp config from a manifest,
 * supporting both 'miniapp' and 'frame' properties during the transition period
 */
export declare function getMiniAppConfig(manifest: Manifest): MiniAppConfig | undefined;
