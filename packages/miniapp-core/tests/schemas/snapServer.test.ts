import { describe, expect, it } from 'vitest'
import {
  castHashSchema,
  miniAppCastIdSchema,
  snapImageServerRequestBodySchema,
} from '../../src/schemas/snapServer.ts'

describe('castHashSchema', () => {
  it('accepts 40-char hex with or without 0x', () => {
    const h = '0x9885d02b3ad622033c92ab023c2e9d5a378a32e2' as const
    expect(castHashSchema.safeParse(h).success).toBe(true)
    expect(
      castHashSchema.safeParse('9885d02b3ad622033c92ab023c2e9d5a378a32e2')
        .success,
    ).toBe(true)
  })

  it('rejects invalid hash', () => {
    expect(castHashSchema.safeParse('0x123').success).toBe(false)
    expect(castHashSchema.safeParse('not-hex').success).toBe(false)
  })
})

describe('miniAppCastIdSchema', () => {
  it('parses fid + hash', () => {
    const r = miniAppCastIdSchema.safeParse({
      fid: 10956,
      hash: '0x9885d02b3ad622033c92ab023c2e9d5a378a32e2',
    })
    expect(r.success).toBe(true)
  })
})

describe('snapImageServerRequestBodySchema', () => {
  it('accepts full cast context', () => {
    const r = snapImageServerRequestBodySchema.safeParse({
      castId: {
        fid: 2417,
        hash: '0x5415e243853e0000000000000000000000000000',
      },
      parentCastId: {
        fid: 100,
        hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
      threadHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      embedUrl: 'https://example.com/path',
    })
    expect(r.success).toBe(true)
  })

  it('accepts empty object', () => {
    expect(snapImageServerRequestBodySchema.safeParse({}).success).toBe(true)
  })

  it('strips unknown keys by default', () => {
    const r = snapImageServerRequestBodySchema.safeParse({
      castId: { fid: 1, hash: '0x' + 'a'.repeat(40) },
      futureField: 'x',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect('futureField' in r.data).toBe(false)
    }
  })
})
