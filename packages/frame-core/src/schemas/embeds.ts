import { z } from 'zod'
import {
  aspectRatioSchema,
  buttonTitleSchema,
  caip19TokenSchema,
  frameNameSchema,
  hexColorSchema,
  secureUrlSchema,
} from './shared.ts'

export const actionLaunchFrameSchema = z.object({
  type: z.literal('launch_frame'),
  name: frameNameSchema,
  url: secureUrlSchema.optional(),
  splashImageUrl: secureUrlSchema.optional(),
  splashBackgroundColor: hexColorSchema.optional(),
})

export const actionViewTokenSchema = z.object({
  type: z.literal('view_token'),
  token: caip19TokenSchema,
})

export const actionSchema = z.discriminatedUnion('type', [
  actionLaunchFrameSchema,
  actionViewTokenSchema,
])

export const buttonSchema = z.object({
  title: buttonTitleSchema,
  action: actionSchema,
})

export const frameEmbedNextSchema = z.object({
  version: z.union([z.literal('next'), z.literal('1')]),
  imageUrl: secureUrlSchema,
  aspectRatio: aspectRatioSchema.optional(),
  button: buttonSchema,
})

export const safeParseFrameEmbed = (rawResponse: unknown) =>
  frameEmbedNextSchema.safeParse(rawResponse)

export type FrameEmbedNext = z.infer<typeof frameEmbedNextSchema>
