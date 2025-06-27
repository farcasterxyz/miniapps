import { createVerifyAppKeyWithHub } from './farcaster.ts'
import type { VerifyAppKey, VerifyAppKeyResult } from './types.ts'

const apiKey = process.env.NEYNAR_API_KEY || ''

export const verifyAppKeyWithNeynar: VerifyAppKey = async (
  fid: number,
  appKey: string,
): Promise<VerifyAppKeyResult> => {
  if (!apiKey) {
    throw new Error(
      'Environment variable NEYNAR_API_KEY needs to be set to use Neynar for app key verification',
    )
  }

  const verifier = createVerifyAppKeyWithHub('https://hub-api.neynar.com', {
    headers: {
      'x-api-key': apiKey,
    },
  })

  return verifier(fid, appKey)
}
