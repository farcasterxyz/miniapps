import { z } from 'zod'
import { miniAppHostCapabilityList } from '../types.ts'
import {
  buttonTitleSchema,
  createSimpleStringSchema,
  encodedJsonFarcasterSignatureSchema,
  frameNameSchema,
  hexColorSchema,
  secureUrlSchema,
} from './shared.ts'

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

const chainList: [string, ...string[]] = [
  'eip155:1', // Ethereum mainnet
  'eip155:8453', // Base mainnet
  'eip155:42161', // Arbitrum One
  'eip155:421614', // Arbitrum Sepolia
  'eip155:84532', // Base Sepolia
  'eip155:666666666', // Degen
  'eip155:100', // Gnosis
  'eip155:10', // Optimism
  'eip155:11155420', // Optimism Sepolia
  'eip155:137', // Polygon
  'eip155:11155111', // Ethereum Sepolia
  'eip155:7777777', // Zora
  'eip155:130', // Unichain
  'eip155:10143', // Monad testnet
  'eip155:42220', // Celo
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp', // Solana
]

export const domainFrameConfigSchema = z
  .object({
    // 0.0.0 and 0.0.1 are not technically part of the spec but kept for
    // backwards compatibility. next should always resolve to the most recent
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
    /** see https://github.com/farcasterxyz/miniapps/discussions/256 */
    requiredChains: z.array(z.enum(chainList)).max(chainList.length).optional(),
    requiredCapabilities: z
      .array(z.enum(miniAppHostCapabilityList))
      .max(miniAppHostCapabilityList.length)
      .optional(),
    /** see https://github.com/farcasterxyz/miniapps/discussions/158 */
    /** Documentation will be added once this feature is finalized. */
    castShareUrl: secureUrlSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.castShareUrl === undefined) return true
      try {
        const homeUrlDomain = new URL(data.homeUrl).hostname
        const castShareUrlDomain = new URL(data.castShareUrl).hostname
        return homeUrlDomain === castShareUrlDomain
      } catch {
        return false
      }
    },
    {
      message: 'castShareUrl must have the same domain as homeUrl',
      path: ['castShareUrl'],
    },
  )

export const domainManifestSchema = z.object({
  accountAssociation: encodedJsonFarcasterSignatureSchema,
  frame: domainFrameConfigSchema.optional(),
})
