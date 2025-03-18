import { describe, expect, test } from 'vitest'
import { BaseError } from '../src/errors'

describe('BaseError', () => {
  test('paramters: message', () => {
    const error = new BaseError('Test error')
    expect(error.message).toBe('Test error')
    expect(error.name).toBe('BaseError')
    expect(error.cause).toBeUndefined()
  })

  test('parameters: cause', () => {
    const cause = new Error('Cause error')
    const error = new BaseError('Test error', { cause })
    expect(error.message).toBe('Test error')
    expect(error.cause).toBe(cause)
  })

  test('behavior: preserves stack trace', () => {
    const cause = new Error('Cause error')
    const error = new BaseError('Test error', { cause })
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })
})
