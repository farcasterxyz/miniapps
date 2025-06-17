import { describe, expect, test } from 'vitest'
import { actionLaunchFrameSchema } from '../src/schemas/embeds.ts'
import { actionSchema, createSimpleStringSchema } from '../src/schemas/index.ts'
import { domainFrameConfigSchema } from '../src/schemas/manifest.ts'
import { domainSchema } from '../src/schemas/shared.ts'

describe('createSimpleStringSchema', () => {
  test('valid string', () => {
    const result = createSimpleStringSchema().safeParse('test: this is valid!')
    expect(result.success).toBe(true)
  })

  test('no special characters', () => {
    const result = createSimpleStringSchema().safeParse('test@#$%^&*()')
    expect(result.success).toBe(false)
  })

  test('no repeated punctuation', () => {
    const result = createSimpleStringSchema().safeParse('test!!')
    expect(result.success).toBe(false)
  })

  test('no emojis', () => {
    const result = createSimpleStringSchema().safeParse('test👍')
    expect(result.success).toBe(false)
  })

  test('no spaces', () => {
    const result = createSimpleStringSchema({ noSpaces: true }).safeParse(
      'test with spaces',
    )
    expect(result.success).toBe(false)
  })

  test('max length', () => {
    const result = createSimpleStringSchema({ max: 5 }).safeParse('test length')
    expect(result.success).toBe(false)
  })
})

describe('actionLaunchFrameSchema', () => {
  test('valid with URL', () => {
    const result = actionLaunchFrameSchema.safeParse({
      type: 'launch_frame',
      name: 'Open',
      url: 'https://www.bountycaster.xyz/bounty/0x0000000000000000000000000000000000000000/frames',
      splashImageUrl:
        'https://www.bountycaster.xyz/static/images/bounty/logo.png',
      splashBackgroundColor: '#ffffff',
    })
    expect(result.success).toBe(true)
  })

  test('valid without URL', () => {
    const result = actionLaunchFrameSchema.safeParse({
      type: 'launch_frame',
      name: 'Open',
      splashImageUrl:
        'https://www.bountycaster.xyz/static/images/bounty/logo.png',
      splashBackgroundColor: '#ffffff',
    })
    expect(result.success).toBe(true)
  })
})

describe('actionViewTokenSchema', () => {
  test('valid CAIP-19', () => {
    const VALID_CAIP_19_IDS = [
      'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      'eip155:1/slip44:60',
      'eip155:8453/native',
      'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'solana:101/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'bip122:000000000019d6689c085ae165831e93/slip44:0',
      'cosmos:cosmoshub-3/slip44:118',
      'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
      'cosmos:Binance-Chain-Tigris/slip44:714',
      'cosmos:iov-mainnet/slip44:234',
      'lip9:9ee11e9df416b18b/slip44:134',
      'eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f',
      'eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
      'eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769',
      'hedera:mainnet/nft:0.0.55492/12',
    ]

    for (const id of VALID_CAIP_19_IDS) {
      const result = actionSchema.safeParse({
        type: 'view_token',
        token: id,
      })
      expect(result.success, `Expected valid CAIP-19: ${id}`).toBe(true)
    }
  })

  test('invalid CAIP-19', () => {
    const INVALID_CAIP_19_IDS = [
      'eip155',
      'eip155:1/slip44',
      'eip155/native',
      'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'not_a_caip_19_id',
      'eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769/12345',
    ]

    for (const id of INVALID_CAIP_19_IDS) {
      const result = actionSchema.safeParse({
        type: 'view_token',
        token: id,
      })
      expect(result.success, `Expected invalid CAIP-19: ${id}`).toBe(false)
    }
  })
})

describe('domainFrameConfigSchema castShareUrl validation', () => {
  const baseConfig = {
    version: '1' as const,
    name: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    homeUrl: 'https://example.com/home',
  }

  test('valid when castShareUrl is undefined', () => {
    const result = domainFrameConfigSchema.safeParse(baseConfig)
    expect(result.success).toBe(true)
  })

  test('valid when castShareUrl has same domain as homeUrl', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      castShareUrl: 'https://example.com/share',
    })
    expect(result.success).toBe(true)
  })

  test('invalid when castShareUrl has different domain than homeUrl', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      castShareUrl: 'https://different.com/share',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'castShareUrl must have the same domain as homeUrl',
      )
    }
  })
})

describe('domainSchema', () => {
  test('valid domains', () => {
    const validDomains = [
      'example.com',
      'sub.example.com',
      'sub.sub.example.com',
      'example.co.uk',
      'test-domain.com',
      'test123.com',
      '123test.com',
      'a.b.c.d.example.com',
      'x.com', // Single letter domains are valid
      '0.pizza', // Single digit domains are valid
    ]

    for (const domain of validDomains) {
      const result = domainSchema.safeParse(domain)
      expect(result.success, `Expected valid domain: ${domain}`).toBe(true)
    }
  })

  test('invalid domains with protocols', () => {
    const invalidDomains = [
      'http://example.com',
      'https://example.com',
      'ftp://example.com',
      'ws://example.com',
    ]

    for (const domain of invalidDomains) {
      const result = domainSchema.safeParse(domain)
      expect(result.success, `Expected invalid domain: ${domain}`).toBe(false)
    }
  })

  test('invalid domains with paths', () => {
    const result = domainSchema.safeParse('example.com/path')
    expect(result.success).toBe(false)
  })

  test('invalid domains with port numbers', () => {
    const result = domainSchema.safeParse('example.com:8080')
    expect(result.success).toBe(false)
  })

  test('invalid domains with @ symbol', () => {
    const result = domainSchema.safeParse('user@example.com')
    expect(result.success).toBe(false)
  })

  test('invalid domain formats', () => {
    const invalidDomains = [
      'example', // No TLD
      '.example.com', // Starts with dot
      'example.com.', // Ends with dot
      'example..com', // Consecutive dots
      '-example.com', // Starts with hyphen
      'example-.com', // Ends with hyphen
      'example.c', // TLD too short
      'example.123', // Numeric TLD
      '', // Empty string
      'example .com', // Contains space
    ]

    for (const domain of invalidDomains) {
      const result = domainSchema.safeParse(domain)
      expect(result.success, `Expected invalid domain: ${domain}`).toBe(false)
    }
  })
})

describe('domainFrameConfigSchema canonicalDomain validation', () => {
  const baseConfig = {
    version: '1' as const,
    name: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    homeUrl: 'https://example.com/home',
  }

  test('valid when canonicalDomain is a valid domain', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      canonicalDomain: 'app.example.com',
    })
    expect(result.success).toBe(true)
  })

  test('invalid when canonicalDomain contains protocol', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      canonicalDomain: 'https://app.example.com',
    })
    expect(result.success).toBe(false)
  })
})
