export type Options<close extends boolean | undefined = undefined> = {
    /**
     * Suggested text for the body of the cast.
     *
     * Mentions can be included using the human-writable form (e.g. @farcaster).
     **/
    text?: string;
    /** Suggested embeds. Max two. */
    embeds?: [] | [string] | [string, string];
    /** Suggested parent. */
    parent?: {
        type: 'cast';
        hash: string;
    };
    /** Whether the app should be closed when this action is called. */
    close?: close;
    /** Whether the cast should be posted to a channel. */
    channelKey?: string;
};
export type ComposeCastInnerResult = {
    /** Cast of the created cast */
    hash: string;
    /** Text of the created cast */
    text?: string;
    /** Embeds of the created cast */
    embeds?: [] | [string] | [string, string];
    /** Parent of the created cast */
    parent?: {
        type: 'cast';
        hash: string;
    };
    /** Channel key of the created cast */
    channelKey?: string;
};
export type Result<close extends boolean | undefined = undefined> = close extends true ? undefined : {
    cast: ComposeCastInnerResult | null;
};
