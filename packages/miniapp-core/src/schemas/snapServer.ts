import { z } from 'zod'
import { secureUrlSchema } from './shared.ts'

/**
 * Hex-encoded Farcaster cast hash (40 hex chars), with or without a 0x prefix.
 */
export const castHashSchema = z
  .string()
  .min(40)
  .max(42)
  .refine(
    (h) => {
      const hex = h.startsWith('0x') || h.startsWith('0X') ? h.slice(2) : h
      return /^[0-9a-fA-F]{40}$/.test(hex)
    },
    {
      message:
        'Must be a 40-character hex cast hash, optionally prefixed with 0x',
    },
  )

/**
 * Identifies a cast on the network (FID of the author + hash), equivalent to
 * legacy Frames' `castId` / `castId.hash` usage.
 */
export const miniAppCastIdSchema = z.object({
  fid: z.number().int().positive(),
  hash: castHashSchema,
})

export type MiniAppCastId = z.infer<typeof miniAppCastIdSchema>

/**
 * Request body Farcaster clients SHOULD send when fetching a Mini App embed's
 * `imageUrl` (the "Snap" / dynamic image server) so servers can render
 * context-aware preview images (e.g. quotes of the parent cast in a reply).
 *
 * All fields are optional so hosts can incrementally adopt; servers should
 * tolerate older clients that send an empty body.
 */
export const snapImageServerRequestBodySchema = z.object({
  /**
   * Cast that contains this embed (the "host" cast in the feed).
   */
  castId: miniAppCastIdSchema.optional(),
  /**
   * Direct parent cast when the host cast is a reply (for quote-image, thread context).
   */
  parentCastId: miniAppCastIdSchema.optional(),
  /**
   * Convenience: parent cast hash alone when FID is unavailable.
   * Prefer `parentCastId` when both fid and hash are known.
   */
  parentHash: castHashSchema.optional(),
  /**
   * Thread root hash when the client can provide it.
   */
  threadHash: castHashSchema.optional(),
  /**
   * Canonical embed URL (the page whose `fc:miniapp` / `fc:frame` meta produced this card).
   */
  embedUrl: secureUrlSchema.optional(),
})

export type SnapImageServerRequestBody = z.infer<
  typeof snapImageServerRequestBodySchema
>
