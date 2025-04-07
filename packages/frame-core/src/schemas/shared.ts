import { z } from 'zod'

export const secureUrlSchema = z
  .string()
  .url()
  .startsWith('https://', { message: 'Must be an https url' })
  .max(1024)

export const frameNameSchema = z.string().max(32)
export const buttonTitleSchema = z.string().max(32)

const CAIP_19_REGEX =
  /^[-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32}\/(?:[-a-z0-9]{3,8}:[-.%a-zA-Z0-9]{1,128}(?:\/[-.%a-zA-Z0-9]{1,78})?|native)$/

export const caip19TokenSchema = z
  .string()
  .regex(CAIP_19_REGEX, { message: 'Invalid CAIP-19 asset ID' })

export const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i, {
    message:
      'Invalid hex color code. It should be in the format #RRGGBB or #RGB.',
  })

export const aspectRatioSchema = z.union([z.literal('1:1'), z.literal('3:2')])

export const encodedJsonFarcasterSignatureSchema = z.object({
  header: z.string(),
  payload: z.string(),
  signature: z.string(),
})

export type EncodedJsonFarcasterSignatureSchema = z.infer<
  typeof encodedJsonFarcasterSignatureSchema
>

export const jsonFarcasterSignatureHeaderSchema = z.object({
  fid: z.number(),
  type: z.literal('app_key'),
  key: z.string().startsWith('0x'),
})

export type JsonFarcasterSignatureHeaderSchema = z.infer<
  typeof jsonFarcasterSignatureHeaderSchema
>
