import { describe, expect, test } from 'vitest'
import {
  createSimpleStringSchema,
  domainSchema,
} from '../../src/schemas/shared.ts'

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
