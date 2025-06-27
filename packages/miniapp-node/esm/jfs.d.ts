import { type EncodedJsonFarcasterSignatureSchema } from '@farcaster/miniapp-core';
import { BaseError, type VerifyAppKey, type VerifyJfsResult } from './types.ts';
export declare namespace VerifyJsonFarcasterSignature {
    type ErrorType = InvalidJfsDataError | InvalidJfsAppKeyError | VerifyAppKeyError;
}
export declare class InvalidJfsDataError<C extends Error | undefined = undefined> extends BaseError<C> {
    readonly name = "VerifyJsonFarcasterSignature.InvalidDataError";
}
export declare class InvalidJfsAppKeyError<C extends Error | undefined = undefined> extends BaseError<C> {
    readonly name = "VerifyJsonFarcasterSignature.InvalidAppKeyError";
}
export declare class VerifyAppKeyError<C extends Error | undefined = undefined> extends BaseError<C> {
    readonly name = "VerifyJsonFarcasterSignature.VerifyAppKeyError";
}
export declare function verifyJsonFarcasterSignature(data: unknown, verifyAppKey: VerifyAppKey): Promise<VerifyJfsResult>;
export declare function createJsonFarcasterSignature({ fid, type, privateKey, payload, }: {
    fid: number;
    type: 'app_key';
    privateKey: Uint8Array;
    payload: Uint8Array;
}): EncodedJsonFarcasterSignatureSchema;
