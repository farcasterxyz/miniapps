import * as AbiParameters from 'ox/AbiParameters'
import { z } from 'zod'
import { BaseError, type VerifyAppKey, type VerifyAppKeyResult } from './types'

export const signedKeyRequestAbi = [
  {
    components: [
      {
        name: 'requestFid',
        type: 'uint256',
      },
      {
        name: 'requestSigner',
        type: 'address',
      },
      {
        name: 'signature',
        type: 'bytes',
      },
      {
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'SignedKeyRequest',
    type: 'tuple',
  },
] as const

const hubResponseSchema = z.object({
  events: z.array(
    z.object({
      signerEventBody: z.object({
        key: z.string(),
        metadata: z.string(),
      }),
    }),
  ),
})

export const createVerifyAppKeyWithHub: (
  hubUrl: string,
  requestOptions?: RequestInit,
) => VerifyAppKey =
  (hubUrl, requestOptions) =>
  async (fid: number, appKey: string): Promise<VerifyAppKeyResult> => {
    const url = new URL('/v1/onChainSignersByFid', hubUrl)
    url.searchParams.append('fid', fid.toString())

    const response = await fetch(url, requestOptions)

    if (response.status !== 200) {
      throw new BaseError(`Non-200 response received: ${await response.text()}`)
    }

    const responseJson = await response.json()
    const parsedResponse = hubResponseSchema.safeParse(responseJson)
    if (parsedResponse.error) {
      throw new BaseError('Error parsing Hub response', parsedResponse.error)
    }

    const appKeyLower = appKey.toLowerCase()

    const signerEvent = parsedResponse.data.events.find(
      (event) => event.signerEventBody.key.toLowerCase() === appKeyLower,
    )
    if (!signerEvent) {
      return { valid: false }
    }

    const decoded = AbiParameters.decode(
      signedKeyRequestAbi,
      Buffer.from(signerEvent.signerEventBody.metadata, 'base64'),
    )
    if (decoded.length !== 1) {
      throw new BaseError('Error decoding metadata')
    }

    const appFid = Number(decoded[0].requestFid)

    return { valid: true, appFid }
  }
