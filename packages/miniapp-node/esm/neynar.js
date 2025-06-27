import { createVerifyAppKeyWithHub } from "./farcaster.js";
const apiKey = process.env.NEYNAR_API_KEY || '';
export const verifyAppKeyWithNeynar = async (fid, appKey) => {
    if (!apiKey) {
        throw new Error('Environment variable NEYNAR_API_KEY needs to be set to use Neynar for app key verification');
    }
    const verifier = createVerifyAppKeyWithHub('https://hub-api.neynar.com', {
        headers: {
            'x-api-key': apiKey,
        },
    });
    return verifier(fid, appKey);
};
