import { encodedJsonFarcasterSignatureSchema, jsonFarcasterSignatureHeaderSchema, } from '@farcaster/miniapp-core';
import { ed25519 } from '@noble/curves/ed25519';
import { BaseError, } from "./types.js";
import { bytesToHex, hexToBytes } from "./util.js";
export class InvalidJfsDataError extends BaseError {
    name = 'VerifyJsonFarcasterSignature.InvalidDataError';
}
export class InvalidJfsAppKeyError extends BaseError {
    name = 'VerifyJsonFarcasterSignature.InvalidAppKeyError';
}
export class VerifyAppKeyError extends BaseError {
    name = 'VerifyJsonFarcasterSignature.VerifyAppKeyError';
}
export async function verifyJsonFarcasterSignature(data, verifyAppKey) {
    //
    // Parse, decode and validate data
    //
    const body = encodedJsonFarcasterSignatureSchema.safeParse(data);
    if (body.success === false) {
        throw new InvalidJfsDataError('Error parsing data', body.error);
    }
    let headerData;
    try {
        headerData = JSON.parse(Buffer.from(body.data.header, 'base64url').toString('utf-8'));
    }
    catch (error) {
        throw new InvalidJfsDataError('Error decoding and parsing header');
    }
    const header = jsonFarcasterSignatureHeaderSchema.safeParse(headerData);
    if (header.success === false) {
        throw new InvalidJfsDataError('Error parsing header', header.error);
    }
    const payload = Buffer.from(body.data.payload, 'base64url');
    const signature = Buffer.from(body.data.signature, 'base64url');
    if (signature.byteLength !== 64) {
        throw new InvalidJfsDataError('Invalid signature length');
    }
    //
    // Verify the signature
    //
    const fid = header.data.fid;
    const appKey = header.data.key;
    const appKeyBytes = hexToBytes(appKey);
    const signedInput = new Uint8Array(Buffer.from(body.data.header + '.' + body.data.payload));
    let verifyResult;
    try {
        verifyResult = ed25519.verify(signature, signedInput, appKeyBytes);
    }
    catch (e) {
        throw new InvalidJfsDataError('Error checking signature', e instanceof Error ? e : undefined);
    }
    if (!verifyResult) {
        throw new InvalidJfsDataError('Invalid signature');
    }
    //
    // Verify that the app key belongs to the FID
    //
    let appKeyResult;
    try {
        appKeyResult = await verifyAppKey(fid, appKey);
    }
    catch (error) {
        throw new VerifyAppKeyError('Error verifying app key', error instanceof Error ? error : undefined);
    }
    if (!appKeyResult.valid) {
        throw new InvalidJfsAppKeyError('App key not valid for FID');
    }
    return { fid, appFid: appKeyResult.appFid, payload };
}
export function createJsonFarcasterSignature({ fid, type, privateKey, payload, }) {
    const publicKey = ed25519.getPublicKey(privateKey);
    const header = { fid, type, key: bytesToHex(publicKey) };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(payload).toString('base64url');
    const signatureInput = new Uint8Array(Buffer.from(encodedHeader + '.' + encodedPayload, 'utf-8'));
    const signature = ed25519.sign(signatureInput, privateKey);
    const encodedSignature = Buffer.from(signature).toString('base64url');
    return {
        header: encodedHeader,
        payload: encodedPayload,
        signature: encodedSignature,
    };
}
