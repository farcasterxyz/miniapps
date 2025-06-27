import { serverEventSchema } from '@farcaster/miniapp-core';
import { verifyJsonFarcasterSignature, } from "./jfs.js";
import { BaseError, } from "./types.js";
export class InvalidEventDataError extends BaseError {
    name = 'VerifyJsonFarcasterSignature.InvalidEventDataError';
}
export async function parseWebhookEvent(rawData, verifyAppKey) {
    const { fid, appFid, payload } = await verifyJsonFarcasterSignature(rawData, verifyAppKey);
    // Pase and validate event payload
    let payloadJson;
    try {
        payloadJson = JSON.parse(Buffer.from(payload).toString('utf-8'));
    }
    catch (error) {
        throw new InvalidEventDataError('Error decoding and parsing payload', error instanceof Error ? error : undefined);
    }
    const event = serverEventSchema.safeParse(payloadJson);
    if (event.success === false) {
        throw new InvalidEventDataError('Invalid event payload', event.error);
    }
    return { fid, appFid, event: event.data };
}
