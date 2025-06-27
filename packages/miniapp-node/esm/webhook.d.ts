import { type VerifyJsonFarcasterSignature } from './jfs.ts';
import { BaseError, type ParseWebhookEventResult, type VerifyAppKey } from './types.ts';
export declare namespace ParseWebhookEvent {
    type ErrorType = VerifyJsonFarcasterSignature.ErrorType | InvalidEventDataError;
}
export declare class InvalidEventDataError<C extends Error | undefined = undefined> extends BaseError<C> {
    readonly name = "VerifyJsonFarcasterSignature.InvalidEventDataError";
}
export declare function parseWebhookEvent(rawData: unknown, verifyAppKey: VerifyAppKey): Promise<ParseWebhookEventResult>;
