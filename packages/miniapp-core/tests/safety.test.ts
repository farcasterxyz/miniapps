import { describe, expect, test } from 'vitest'
import {
  isReportedMaliciousMiniAppId,
  REPORTED_MALICIOUS_MINI_APP_IDS,
} from '../src/safety.ts'

describe('isReportedMaliciousMiniAppId', () => {
  test('matches known reported id', () => {
    expect(isReportedMaliciousMiniAppId('TKmCN5l0NjbZ')).toBe(true)
  })

  test('trims whitespace', () => {
    expect(isReportedMaliciousMiniAppId('  TKmCN5l0NjbZ  ')).toBe(true)
  })

  test('rejects unknown ids', () => {
    expect(isReportedMaliciousMiniAppId('unknown')).toBe(false)
    expect(isReportedMaliciousMiniAppId('')).toBe(false)
  })

  test('list is non-empty', () => {
    expect(REPORTED_MALICIOUS_MINI_APP_IDS.length).toBeGreaterThan(0)
  })
})
