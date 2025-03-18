import { describe, expect, test } from 'vitest'
import { stringify, isAllowedOrigin } from '../src/util'

describe('stringify', () => {
  test('parameters: JSON', () => {
    const obj = { foo: 'bar', baz: 123 }
    expect(stringify(obj)).toBe('{"foo":"bar","baz":123}')
  })

  test('parameters: object with BigInt', () => {
    const obj = { amount: BigInt('9007199254740991') }
    expect(stringify(obj)).toBe('{"amount":"9007199254740991"}')
  })

  test('parameters: custom replacer', () => {
    const obj = { foo: 'bar', baz: 123, hidden: 'secret' }
    const replacer = (key: string, value: any) =>
      key === 'hidden' ? undefined : value
    expect(stringify(obj, replacer)).toBe('{"foo":"bar","baz":123}')
  })

  test('parameters: space', () => {
    const obj = { foo: 'bar' }
    expect(stringify(obj, null, 2)).toBe('{\n  "foo": "bar"\n}')
  })
})

describe('isAllowedOrigin', () => {
  test('parameters: matching origin', () => {
    const allowedOrigins = ['https://example.com']
    expect(isAllowedOrigin(allowedOrigins, 'https://example.com')).toBe(true)
  })

  test('parameters: non-matching origin', () => {
    const allowedOrigins = ['https://example.com']
    expect(isAllowedOrigin(allowedOrigins, 'https://malicious.com')).toBe(false)
  })

  test('parameters: wildcard origin', () => {
    const allowedOrigins = ['*']
    expect(isAllowedOrigin(allowedOrigins, 'https://any-domain.com')).toBe(true)
  })

  test('parameters: matching RegExp', () => {
    const allowedOrigins = [/^https:\/\/.*\.example\.com$/]
    expect(
      isAllowedOrigin(allowedOrigins, 'https://subdomain.example.com'),
    ).toBe(true)
  })

  test('parameters: non-matching RegExp', () => {
    const allowedOrigins = [/^https:\/\/.*\.example\.com$/]
    expect(
      isAllowedOrigin(allowedOrigins, 'https://subdomain.different.com'),
    ).toBe(false)
  })

  test('parameters: some matches', () => {
    const allowedOrigins = [
      'https://first.com',
      'https://second.com',
      /^https:\/\/.*\.third\.com$/,
    ]
    expect(isAllowedOrigin(allowedOrigins, 'https://second.com')).toBe(true)
    expect(isAllowedOrigin(allowedOrigins, 'https://sub.third.com')).toBe(true)
  })
})
