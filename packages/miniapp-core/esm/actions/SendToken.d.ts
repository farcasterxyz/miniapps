export type SendTokenOptions = {
    /**
     * CAIP-19 asset ID
     * For example, Base USDC:
     * eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
     */
    token?: string;
    /**
     * Token amount, as numeric string.
     * For example, 10 USDC: 1000000
     */
    amount?: string;
    /**
     * Recipient address.
     */
    recipientAddress?: string;
    /**
     * Recipient fid.
     */
    recipientFid?: number;
};
type SendTokenDetails = {
    /**
     * Tx identifier.
     */
    transaction: `0x${string}`;
};
type SendTokenErrorDetails = {
    /**
     * Error code.
     */
    error: string;
    /**
     * Error message.
     */
    message?: string;
};
export type SendTokenErrorReason = 'rejected_by_user' | 'send_failed';
export type SendTokenResult = {
    success: true;
    send: SendTokenDetails;
} | {
    success: false;
    reason: SendTokenErrorReason;
    error?: SendTokenErrorDetails;
};
export type SendToken = (options: SendTokenOptions) => Promise<SendTokenResult>;
export {};
