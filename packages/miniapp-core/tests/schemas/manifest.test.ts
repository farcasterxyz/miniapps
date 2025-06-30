import { describe, expect, test } from 'vitest'
import { domainMiniAppConfigSchema } from '../../src/schemas/manifest.ts'

describe('domainMiniAppConfigSchema castShareUrl validation', () => {
  const baseConfig = {
    version: '1' as const,
    name: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    homeUrl: 'https://example.com/home',
  }

  test('valid when castShareUrl is undefined', () => {
    const result = domainMiniAppConfigSchema.safeParse(baseConfig)
    expect(result.success).toBe(true)
  })

  test('valid when castShareUrl has same domain as homeUrl', () => {
    const result = domainMiniAppConfigSchema.safeParse({
      ...baseConfig,
      castShareUrl: 'https://example.com/share',
    })
    expect(result.success).toBe(true)
  })

  test('invalid when castShareUrl has different domain than homeUrl', () => {
    const result = domainMiniAppConfigSchema.safeParse({
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

describe('domainMiniAppConfigSchema canonicalDomain validation', () => {
  const baseConfig = {
    version: '1' as const,
    name: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    homeUrl: 'https://example.com/home',
  }

  test('valid when canonicalDomain is a valid domain', () => {
    const result = domainMiniAppConfigSchema.safeParse({
      ...baseConfig,
      canonicalDomain: 'app.example.com',
    })
    expect(result.success).toBe(true)
  })

  test('invalid when canonicalDomain contains protocol', () => {
    const result = domainMiniAppConfigSchema.safeParse({
      ...baseConfig,
      canonicalDomain: 'https://app.example.com',
    })
    expect(result.success).toBe(false)
  })
})

describe('domainMiniAppConfigSchema URL field validation', () => {
  const baseConfig = {
    version: '1' as const,
    name: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    homeUrl: 'https://example.com/home',
  }

  test('URL fields use secureUrlSchema validation', () => {
    // Test that required URL fields reject invalid URLs
    const requiredFields = ['iconUrl', 'homeUrl']
    for (const field of requiredFields) {
      const result = domainMiniAppConfigSchema.safeParse({
        ...baseConfig,
        [field]: 'http://example.com', // not https
      })
      expect(result.success).toBe(false)
    }
  })

  test('optional URL fields use secureUrlSchema validation', () => {
    // Test one invalid URL for each optional field to verify validation is applied
    const optionalUrlFields = [
      'splashImageUrl',
      'webhookUrl',
      'heroImageUrl',
      'ogImageUrl',
    ]

    for (const field of optionalUrlFields) {
      const result = domainMiniAppConfigSchema.safeParse({
        ...baseConfig,
        [field]: 'invalid-url',
      })
      expect(result.success).toBe(false)
    }
  })

  test('screenshotUrls array uses secureUrlSchema validation', () => {
    const result = domainMiniAppConfigSchema.safeParse({
      ...baseConfig,
      screenshotUrls: ['https://example.com/valid.png', 'not-a-url'],
    })
    expect(result.success).toBe(false)
  })
})
