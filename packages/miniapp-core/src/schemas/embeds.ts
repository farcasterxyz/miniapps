import { z } from 'zod'
import {
  aspectRatioSchema,
  buttonTitleSchema,
  caip19TokenSchema,
  hexColorSchema,
  miniAppNameSchema,
  secureUrlSchema,
} from './shared.ts'

export const actionLaunchFrameSchema = z.object({
  type: z.literal('launch_frame'),
  name: miniAppNameSchema,
  url: secureUrlSchema.optional(),
  splashImageUrl: secureUrlSchema.optional(),
  splashBackgroundColor: hexColorSchema.optional(),
})

export const actionLaunchMiniAppSchema = z.object({
  type: z.literal('launch_miniapp'),
  name: miniAppNameSchema,
  url: secureUrlSchema.optional(),
  splashImageUrl: secureUrlSchema.optional(),
  splashBackgroundColor: hexColorSchema.optional(),
})

export const actionViewTokenSchema = z.object({
  type: z.literal('view_token'),
  token: caip19TokenSchema,
})

export const actionSchema = z.discriminatedUnion('type', [
  actionLaunchMiniAppSchema,
  actionViewTokenSchema,
  // Remove after compatibility period
  actionLaunchFrameSchema,
])

export const buttonSchema = z.object({
  title: buttonTitleSchema,
  action: actionSchema,
})

export const miniAppEmbedNextSchema = z.object({
  version: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .pipe(z.union([z.literal('next'), z.literal('1')])),
  imageUrl: secureUrlSchema,
  aspectRatio: aspectRatioSchema.optional(),
  button: buttonSchema,
})

export const safeParseMiniAppEmbed = (rawResponse: unknown) =>
  miniAppEmbedNextSchema.safeParse(rawResponse)

// Backward compatibility - also parse fc:frame meta tags
export const safeParseFrameEmbed = safeParseMiniAppEmbed

export type MiniAppEmbedNext = z.infer<typeof miniAppEmbedNextSchema>
export type FrameEmbedNext = MiniAppEmbedNext
