import { describe, expect, test } from 'vitest'
import {
  domainManifestSchema,
  domainMiniAppConfigSchema,
} from '../../src/schemas/manifest.ts'

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

describe('domainManifestSchema transform', () => {
  // Mock accountAssociation for all tests
  const mockAccountAssociation = {
    header: '{"fid":1234,"type":"app_key","key":"0x1234"}',
    payload:
      '{"domain":"example.com","timestamp":1234567890,"expiresAt":1234567899}',
    signature:
      '0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234567890',
  }

  const baseFrame = {
    version: '1' as const,
    name: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    homeUrl: 'https://example.com/home',
  }

  test('preserves frame when only frame is provided', () => {
    const manifest = {
      accountAssociation: mockAccountAssociation,
      frame: baseFrame,
    }

    const result = domainManifestSchema.parse(manifest)
    expect(result.frame).toEqual(baseFrame)
  })

  test('copies miniapp to frame when only miniapp is provided', () => {
    const manifest = {
      accountAssociation: mockAccountAssociation,
      miniapp: baseFrame,
    }

    const result = domainManifestSchema.parse(manifest)
    expect(result.frame).toEqual(baseFrame)
    expect(result.miniapp).toEqual(baseFrame)
  })

  test('preserves both frame and miniapp when both are provided and identical', () => {
    const manifest = {
      accountAssociation: mockAccountAssociation,
      frame: baseFrame,
      miniapp: baseFrame,
    }

    const result = domainManifestSchema.parse(manifest)
    expect(result.frame).toEqual(baseFrame)
    expect(result.miniapp).toEqual(baseFrame)
  })

  test('fails when both frame and miniapp are provided but not identical', () => {
    const differentApp = {
      ...baseFrame,
      name: 'Different App',
    }

    const manifest = {
      accountAssociation: mockAccountAssociation,
      frame: baseFrame,
      miniapp: differentApp,
    }

    const result = domainManifestSchema.safeParse(manifest)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'If both "frame" and "miniapp" are provided, they must be identical',
      )
    }
  })

  test('transform ensures frame is always present in output', () => {
    // Test with only miniapp
    const manifestWithMiniapp = {
      accountAssociation: mockAccountAssociation,
      miniapp: baseFrame,
    }

    const result1 = domainManifestSchema.parse(manifestWithMiniapp)
    expect(result1.frame).toBeDefined()
    expect(result1.frame).toEqual(baseFrame)

    // Test with only frame
    const manifestWithFrame = {
      accountAssociation: mockAccountAssociation,
      frame: baseFrame,
    }

    const result2 = domainManifestSchema.parse(manifestWithFrame)
    expect(result2.frame).toBeDefined()
    expect(result2.frame).toEqual(baseFrame)
  })

  test('validates that at least one of frame or miniapp is provided', () => {
    const manifestWithNeither = {
      accountAssociation: mockAccountAssociation,
    }

    const result = domainManifestSchema.parse(manifestWithNeither)
    // After transform, frame should be undefined since neither was provided
    expect(result.frame).toBeUndefined()
  })
})
