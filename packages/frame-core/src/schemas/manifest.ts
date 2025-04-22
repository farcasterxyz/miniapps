import { z } from 'zod'
import {
  buttonTitleSchema,
  createSimpleStringSchema,
  encodedJsonFarcasterSignatureSchema,
  frameNameSchema,
  hexColorSchema,
  secureUrlSchema,
} from './shared'

const primaryCategorySchema = z.enum([
  'games',
  'social',
  'finance',
  'utility',
  'productivity',
  'health-fitness',
  'news-media',
  'music',
  'shopping',
  'education',
  'developer-tools',
  'entertainment',
  'art-creativity',
])

export const domainFrameConfigSchema = z.object({
  // 0.0.0 and 0.0.1 are not technically part of the spec but kept for
  // backwards compatibilty. next should always resolve to the most recent
  // schema version.
  version: z.union([
    z.literal('0.0.0'),
    z.literal('0.0.1'),
    z.literal('1'),
    z.literal('next'),
  ]),
  name: frameNameSchema,
  iconUrl: secureUrlSchema,
  homeUrl: secureUrlSchema,
  /** deprecated, set ogImageUrl instead */
  imageUrl: secureUrlSchema.optional(),
  /** deprecated, will rely on fc:frame meta tag */
  buttonTitle: buttonTitleSchema.optional(),
  splashImageUrl: secureUrlSchema.optional(),
  splashBackgroundColor: hexColorSchema.optional(),
  webhookUrl: secureUrlSchema.optional(),
  /** see: https://github.com/farcasterxyz/miniapps/discussions/191 */
  subtitle: createSimpleStringSchema({ max: 30 }).optional(),
  description: createSimpleStringSchema({ max: 170 }).optional(),
  screenshotUrls: z.array(secureUrlSchema).max(3).optional(),
  primaryCategory: primaryCategorySchema.optional(),
  tags: z
    .array(createSimpleStringSchema({ max: 20, noSpaces: true }))
    .max(5)
    .optional(),
  heroImageUrl: secureUrlSchema.optional(),
  tagline: createSimpleStringSchema({ max: 30 }).optional(),
  ogTitle: createSimpleStringSchema({ max: 30 }).optional(),
  ogDescription: createSimpleStringSchema({ max: 100 }).optional(),
  ogImageUrl: secureUrlSchema.optional(),
  /** see: https://github.com/farcasterxyz/miniapps/discussions/204 */
  noindex: z.boolean().optional(),
})

export const domainManifestSchema = z.object({
  accountAssociation: encodedJsonFarcasterSignatureSchema,
  frame: domainFrameConfigSchema.optional(),
})
