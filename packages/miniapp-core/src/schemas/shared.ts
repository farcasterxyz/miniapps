import { z } from 'zod'

const SPECIAL_CHARS_PATTERN = /[@#$%^&*+=/\\|~«»]/
const REPEATED_PUNCTUATION_PATTERN = /(!{2,}|\?{2,}|-{2,})/

// Unicode ranges for emoji detection:
// \u{1F300}-\u{1F9FF} - Miscellaneous Symbols, Pictographs, Emoticons, Transport, Map, and Supplemental
// \u{2702}-\u{27B0} - Dingbats
// \u{2600}-\u{26FF} - Miscellaneous Symbols
// \u{2B00}-\u{2BFF} - Miscellaneous Symbols and Arrows
const EMOJI_PATTERN =
  /[\u{1F300}-\u{1F9FF}]|[\u{2702}-\u{27B0}]|[\u{2600}-\u{26FF}]|[\u{2B00}-\u{2BFF}]/u

export const createSimpleStringSchema = ({
  max,
  noSpaces,
}: {
  max?: number
  noSpaces?: boolean
} = {}) => {
  const stringValidations = noSpaces
    ? z
        .string()
        .max(max ?? Number.POSITIVE_INFINITY)
        .regex(/^\S*$/, 'Spaces are not allowed')
    : z.string().max(max ?? Number.POSITIVE_INFINITY)

  return stringValidations
    .refine((value) => !EMOJI_PATTERN.test(value), {
      message: 'Emojis and symbols are not allowed',
    })
    .refine((value) => !SPECIAL_CHARS_PATTERN.test(value), {
      message:
        'Special characters (@, #, $, %, ^, &, *, +, =, /, \\, |, ~, «, ») are not allowed',
    })
    .refine((value) => !REPEATED_PUNCTUATION_PATTERN.test(value), {
      message: 'Repeated punctuations (!!, ??, --) are not allowed',
    })
}

export const secureUrlSchema = z
  .string()
  .url()
  .startsWith('https://', { message: 'Must be an https url' })
  .max(1024)
  .refine((url) => !url.includes(' '), {
    message: 'URL must not contain spaces',
  })
  .refine(
    (url) => {
      try {
        const hostname = new URL(url).hostname
        // Check for localhost
        if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
          return false
        }
        // Check for IPv4 addresses
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
        if (ipv4Regex.test(hostname)) {
          return false
        }
        // Check for IPv6 addresses (including brackets)
        if (hostname.startsWith('[') && hostname.endsWith(']')) {
          return false
        }
        return true
      } catch {
        return false
      }
    },
    {
      message: 'URL must not use IP addresses or localhost',
    },
  )

export const miniAppNameSchema = z.string().max(32)
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

// Domain validation regex:
// - Each label (part between dots) must start and end with alphanumeric
// - Labels can contain hyphens in the middle
// - Cannot have consecutive dots
// - Must have at least one dot (TLD required)
// - TLD must be at least 2 characters and only letters
const DOMAIN_REGEX =
  /^(?!.*\.\.)([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

export const domainSchema = z
  .string()
  .max(1024)
  .regex(DOMAIN_REGEX, {
    message: 'Must be a valid domain name (e.g., example.com, sub.example.com)',
  })
  .refine((value) => !value.includes('://'), {
    message: 'Domain must not include protocol (http://, https://, etc.)',
  })
  .refine((value) => !value.includes('/'), {
    message: 'Domain must not include path separators',
  })
  .refine((value) => !value.includes('@'), {
    message: 'Domain must not include @ symbol',
  })
  .refine((value) => !value.includes(':'), {
    message: 'Domain must not include port numbers',
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
