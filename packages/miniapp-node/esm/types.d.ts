import type { MiniAppServerEvent } from '@farcaster/miniapp-core';
export type VerifyAppKeyResult = {
    valid: true;
    appFid: number;
} | {
    valid: false;
};
export type VerifyAppKey = (fid: number, appKey: string) => Promise<VerifyAppKeyResult>;
export type VerifyJfsResult = {
    fid: number;
    appFid: number;
    payload: Uint8Array;
};
export type ParseWebhookEventResult = {
    fid: number;
    appFid: number;
    event: MiniAppServerEvent;
};
export declare class BaseError<C extends Error | undefined = undefined> extends Error {
    name: string;
    cause: C;
    constructor(message: string, cause?: C);
}
