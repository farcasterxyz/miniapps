import { describe, expect, test } from 'vitest'
import { domainFrameConfigSchema } from '../../src/schemas/manifest.ts'

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

describe('domainFrameConfigSchema URL fields with spaces', () => {
  const baseConfig = {
    version: '1' as const,
    name: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    homeUrl: 'https://example.com/home',
  }

  test('invalid when iconUrl contains spaces', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      iconUrl: 'https://example.com https://example.com',
    })
    expect(result.success).toBe(false)
  })

  test('invalid when homeUrl contains spaces', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      homeUrl: 'https://example.com https://example.com',
    })
    expect(result.success).toBe(false)
  })

  test('invalid when splashImageUrl contains spaces', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      splashImageUrl:
        'https://example.com/image.png https://example.com/image.png',
    })
    expect(result.success).toBe(false)
  })

  test('invalid when webhookUrl contains spaces', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      webhookUrl: 'https://example.com/webhook https://example.com/webhook',
    })
    expect(result.success).toBe(false)
  })

  test('invalid when castShareUrl contains spaces', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      castShareUrl: 'https://example.com/share https://example.com/share',
    })
    expect(result.success).toBe(false)
  })

  test('invalid when heroImageUrl contains spaces', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      heroImageUrl: 'https://example.com/hero.jpg https://example.com/hero.jpg',
    })
    expect(result.success).toBe(false)
  })

  test('invalid when ogImageUrl contains spaces', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      ogImageUrl: 'https://example.com/og.png https://example.com/og.png',
    })
    expect(result.success).toBe(false)
  })

  test('invalid when screenshotUrls contains URLs with spaces', () => {
    const result = domainFrameConfigSchema.safeParse({
      ...baseConfig,
      screenshotUrls: [
        'https://example.com/screenshot1.png',
        'https://example.com/screenshot2.png https://example.com/screenshot2.png',
      ],
    })
    expect(result.success).toBe(false)
  })
})
