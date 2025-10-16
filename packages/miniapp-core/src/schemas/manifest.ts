import { z } from 'zod'
import { miniAppHostCapabilityList } from '../types.ts'
import {
  buttonTitleSchema,
  createSimpleStringSchema,
  domainSchema,
  encodedJsonFarcasterSignatureSchema,
  hexColorSchema,
  miniAppNameSchema,
  secureUrlSchema,
} from './shared.ts'

export const primaryCategories = [
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
] as const

export type PrimaryCategory = (typeof primaryCategories)[number]

export const primaryCategorySchema = z.enum(primaryCategories)

export const versionSchema = z.union([
  z.literal('0.0.0'),
  z.literal('0.0.1'),
  z.literal('1'),
  z.literal('next'),
])

export const subtitleSchema = createSimpleStringSchema({ max: 30 })

export const descriptionSchema = createSimpleStringSchema({ max: 170 })

export const screenshotUrlsSchema = z.array(secureUrlSchema).max(3)

export const tagsSchema = z
  .array(createSimpleStringSchema({ max: 20, noSpaces: true }))
  .max(5)

export const taglineSchema = createSimpleStringSchema({ max: 30 })

export const ogTitleSchema = createSimpleStringSchema({ max: 30 })

export const ogDescriptionSchema = createSimpleStringSchema({ max: 100 })

export const noindexSchema = z.boolean()

export const chains = [
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
  'eip155:999', // HyperEVM
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp', // Solana
] as const

export type Chains = (typeof chains)[number]

function removeArrayDuplicates<T>(arr: T[]) {
  const set = new Set(arr)
  return Array.from(set)
}

export const requiredChainsSchema = z
  .array(z.enum(chains))
  .transform(removeArrayDuplicates)

export const requiredCapabilitiesSchema = z
  .array(z.enum(miniAppHostCapabilityList))
  .transform(removeArrayDuplicates)

export const domainMiniAppConfigSchema = z
  .object({
    // 0.0.0 and 0.0.1 are not technically part of the spec but kept for
    // backwards compatibility. next should always resolve to the most recent
    // schema version.
    version: versionSchema,
    name: miniAppNameSchema,
    iconUrl: secureUrlSchema,
    homeUrl: secureUrlSchema,
    /** deprecated, set ogImageUrl instead */
    imageUrl: secureUrlSchema.optional(),
    /** deprecated, will rely on fc:frame/fc:miniapp meta tag */
    buttonTitle: buttonTitleSchema.optional(),
    splashImageUrl: secureUrlSchema.optional(),
    splashBackgroundColor: hexColorSchema.optional(),
    webhookUrl: secureUrlSchema.optional(),
    /** see: https://github.com/farcasterxyz/miniapps/discussions/191 */
    subtitle: subtitleSchema.optional(),
    description: descriptionSchema.optional(),
    screenshotUrls: screenshotUrlsSchema.optional(),
    primaryCategory: primaryCategorySchema.optional(),
    tags: tagsSchema.optional(),
    heroImageUrl: secureUrlSchema.optional(),
    tagline: taglineSchema.optional(),
    ogTitle: ogTitleSchema.optional(),
    ogDescription: ogDescriptionSchema.optional(),
    ogImageUrl: secureUrlSchema.optional(),
    /** see: https://github.com/farcasterxyz/miniapps/discussions/204 */
    noindex: noindexSchema.optional(),
    /** see https://github.com/farcasterxyz/miniapps/discussions/256 */
    requiredChains: requiredChainsSchema.optional(),
    requiredCapabilities: requiredCapabilitiesSchema.optional(),
    /** see https://github.com/farcasterxyz/miniapps/discussions/158 */
    /** Documentation will be added once this feature is finalized. */
    castShareUrl: secureUrlSchema.optional(),
    /** Canonical domain for the miniapp application */
    canonicalDomain: domainSchema.optional(),
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

export const domainManifestSchema = z
  .object({
    accountAssociation: encodedJsonFarcasterSignatureSchema,
    miniapp: domainMiniAppConfigSchema.optional(),
    // Support both 'frame' and 'miniapp' during transition period
    frame: domainMiniAppConfigSchema.optional(),
  })
  .refine(
    (data) => {
      // If both are provided, they must be identical
      if (data.frame && data.miniapp) {
        return JSON.stringify(data.frame) === JSON.stringify(data.miniapp)
      }
      return true
    },
    {
      message:
        'If both "frame" and "miniapp" are provided, they must be identical',
      path: ['frame', 'miniapp'],
    },
  )
  .transform((schema) => {
    return {
      ...schema,
      frame: schema.frame ?? schema.miniapp,
    }
  })
