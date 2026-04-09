import { describe, expect, test } from 'vitest'
import {
  sendNotificationFailedTokenReasonSchema,
  sendNotificationFailedTokenSchema,
  sendNotificationResponseSchema,
} from '../../src/schemas/notifications.ts'

describe('sendNotificationFailedTokenReasonSchema', () => {
  test.each([
    'domain_mismatch',
    'target_url_mismatch',
    'no_webhook_url',
    'invalid_token',
    'unknown',
  ])('accepts %s', (reason) => {
    const result = sendNotificationFailedTokenReasonSchema.safeParse(reason)
    expect(result.success).toBe(true)
  })

  test('rejects an unknown reason string', () => {
    const result =
      sendNotificationFailedTokenReasonSchema.safeParse('something_else')
    expect(result.success).toBe(false)
  })

  test('rejects a non-string', () => {
    const result = sendNotificationFailedTokenReasonSchema.safeParse(42)
    expect(result.success).toBe(false)
  })
})

describe('sendNotificationFailedTokenSchema', () => {
  test('accepts a minimal entry', () => {
    const result = sendNotificationFailedTokenSchema.safeParse({
      token: 'abc',
      reason: 'invalid_token',
    })
    expect(result.success).toBe(true)
  })

  test('accepts an entry with optional fid', () => {
    const result = sendNotificationFailedTokenSchema.safeParse({
      token: 'abc',
      fid: 1234,
      reason: 'domain_mismatch',
    })
    expect(result.success).toBe(true)
  })

  test('rejects a non-positive fid', () => {
    const result = sendNotificationFailedTokenSchema.safeParse({
      token: 'abc',
      fid: 0,
      reason: 'domain_mismatch',
    })
    expect(result.success).toBe(false)
  })

  test('rejects a missing reason', () => {
    const result = sendNotificationFailedTokenSchema.safeParse({
      token: 'abc',
    })
    expect(result.success).toBe(false)
  })

  test('rejects an invalid reason value', () => {
    const result = sendNotificationFailedTokenSchema.safeParse({
      token: 'abc',
      reason: 'wat',
    })
    expect(result.success).toBe(false)
  })
})

describe('sendNotificationResponseSchema', () => {
  test('parses a legacy response without failedTokens', () => {
    const result = sendNotificationResponseSchema.safeParse({
      result: {
        successfulTokens: ['t1', 't2'],
        invalidTokens: ['t3'],
        rateLimitedTokens: [],
      },
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.result.failedTokens).toBeUndefined()
    }
  })

  test('parses a new response with failedTokens', () => {
    const result = sendNotificationResponseSchema.safeParse({
      result: {
        successfulTokens: ['t1'],
        invalidTokens: ['t2'],
        rateLimitedTokens: [],
        failedTokens: [
          { token: 't2', fid: 42, reason: 'invalid_token' },
          { token: 't3', fid: 99, reason: 'domain_mismatch' },
          { token: 't4', reason: 'target_url_mismatch' },
        ],
      },
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.result.failedTokens).toHaveLength(3)
    }
  })

  test('rejects a response whose failedTokens has an invalid reason', () => {
    const result = sendNotificationResponseSchema.safeParse({
      result: {
        successfulTokens: [],
        invalidTokens: [],
        rateLimitedTokens: [],
        failedTokens: [{ token: 't1', reason: 'bogus' }],
      },
    })
    expect(result.success).toBe(false)
  })

  test('rejects a response missing one of the legacy arrays', () => {
    const result = sendNotificationResponseSchema.safeParse({
      result: {
        successfulTokens: [],
        invalidTokens: [],
      },
    })
    expect(result.success).toBe(false)
  })
})
