import { describe, expect, it } from 'vitest'
import {
  createJsonFarcasterSignature,
  InvalidJfsAppKeyError,
  InvalidJfsDataError,
  VerifyAppKeyError,
  verifyJsonFarcasterSignature,
} from '../src/jfs.ts'
import type { VerifyAppKey } from '../src/types.ts'
import { hexToBytes } from '../src/util.ts'

describe('verifyJsonFarcasterSignature', () => {
  const verifyAppKeySuccess: VerifyAppKey = async (
    _fid: number,
    _appKey: string,
  ) => ({ valid: true, appFid: 100 })
  const verifyAppKeyFailure: VerifyAppKey = async (
    _fid: number,
    _appKey: string,
  ) => ({ valid: false })
  const verifyAppKeyThrows: VerifyAppKey = async (
    _fid: number,
    _appKey: string,
  ) => {
    throw new Error('test')
  }

  it('succeeds', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 5448,
          type: 'app_key',
          key: '0x6bc06a1584f29d8a3133ea6b9ea17210a7a2f7d60b7dc82e770ca7b4bf241296',
        }),
      ).toString('base64url'),
      payload: Buffer.from('b').toString('base64url'),
      signature:
        '9vrDlE4zISYHvOIjl7R7AzzS_nwoxMa7A9IfwTYfegyvazS6Poq_2XXpZQq3i8JGUWXzF0X-TyDuiMEGPaIlCQ',
    }

    await expect(
      verifyJsonFarcasterSignature(data, verifyAppKeySuccess),
    ).resolves.toMatchObject({ fid: 5448, payload: Buffer.from('b') })
  })

  it('succeeds with data signed by createJsonFarcasterSignature', async () => {
    const payload = { 'some key': 'some value' }
    const signedData = createJsonFarcasterSignature({
      fid: 1,
      type: 'app_key',
      privateKey: hexToBytes(
        '0x7b6b8945ed9e063980046b348eed0404dc8fe95d9106412400a4879865cce465',
      ),
      payload: Buffer.from(JSON.stringify(payload)),
    })

    const result = await verifyJsonFarcasterSignature(
      signedData,
      verifyAppKeySuccess,
    )

    expect(result.fid).toEqual(1)
    expect(JSON.parse(Buffer.from(result.payload).toString('utf-8'))).toEqual(
      payload,
    )
  })

  it('throws on invalid data', async () => {
    const data = { invalid: 'data' }

    expect.hasAssertions()
    try {
      await verifyJsonFarcasterSignature(data, verifyAppKeySuccess)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJfsDataError)
      expect(error).toHaveProperty('message', 'Error parsing data')
    }
  })

  it('throws on malformed header', async () => {
    const data = { header: 'not-base64url', payload: 'a', signature: 'a' }

    expect.hasAssertions()
    try {
      await verifyJsonFarcasterSignature(data, verifyAppKeySuccess)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJfsDataError)
      expect(error).toHaveProperty(
        'message',
        'Error decoding and parsing header',
      )
    }
  })

  it('throws on invalid header (app key does not start with 0x)', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 1,
          type: 'app_key',
          key: '1234',
        }),
      ).toString('base64url'),
      payload: 'a',
      signature: 'abcd',
    }

    expect.hasAssertions()
    try {
      await verifyJsonFarcasterSignature(data, verifyAppKeySuccess)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJfsDataError)
      expect(error).toHaveProperty('message', 'Error parsing header')
    }
  })

  it('throws on invalid signature length', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 1,
          type: 'app_key',
          key: '0x1234',
        }),
      ).toString('base64url'),
      payload: 'a',
      signature: 'abcd',
    }

    expect.hasAssertions()
    try {
      await verifyJsonFarcasterSignature(data, verifyAppKeySuccess)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJfsDataError)
      expect(error).toHaveProperty('message', 'Invalid signature length')
    }
  })

  it('throws when app key is not a public key', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 1,
          type: 'app_key',
          key: '0x1234',
        }),
      ).toString('base64url'),
      payload: 'a',
      signature:
        '9vrDlE4zISYHvOIjl7R7AzzS_nwoxMa7A9IfwTYfegyvazS6Poq_2XXpZQq3i8JGUWXzF0X-TyDuiMEGPaIlCQ',
    }

    expect.hasAssertions()
    try {
      await verifyJsonFarcasterSignature(data, verifyAppKeySuccess)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJfsDataError)
      expect(error).toHaveProperty('message', 'Error checking signature')
    }
  })

  it('throws on signature verification failure', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 1,
          type: 'app_key',
          key: '0x6bc06a1584f29d8a3133ea6b9ea17210a7a2f7d60b7dc82e770ca7b4bf241296',
        }),
      ).toString('base64url'),
      payload: 'a',
      signature:
        '9vrDlE4zISYHvOIjl7R7AzzS_nwoxMa7A9IfwTYfegyvazS6Poq_2XXpZQq3i8JGUWXzF0X-TyDuiMEGPaIlCQ',
    }

    expect.hasAssertions()
    try {
      await verifyJsonFarcasterSignature(data, verifyAppKeyFailure)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJfsDataError)
      expect(error).toHaveProperty('message', 'Invalid signature')
    }
  })

  it('throws when verifyAppKey throws', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 5448,
          type: 'app_key',
          key: '0x6bc06a1584f29d8a3133ea6b9ea17210a7a2f7d60b7dc82e770ca7b4bf241296',
        }),
      ).toString('base64url'),
      payload: 'Yg',
      signature:
        '9vrDlE4zISYHvOIjl7R7AzzS_nwoxMa7A9IfwTYfegyvazS6Poq_2XXpZQq3i8JGUWXzF0X-TyDuiMEGPaIlCQ',
    }

    expect.hasAssertions()
    try {
      await verifyJsonFarcasterSignature(data, verifyAppKeyThrows)
    } catch (error) {
      expect(error).toBeInstanceOf(VerifyAppKeyError)
      expect(error).toHaveProperty('message', 'Error verifying app key')
    }
  })

  it('throws when verifyAppKey returns false', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 5448,
          type: 'app_key',
          key: '0x6bc06a1584f29d8a3133ea6b9ea17210a7a2f7d60b7dc82e770ca7b4bf241296',
        }),
      ).toString('base64url'),
      payload: 'Yg',
      signature:
        '9vrDlE4zISYHvOIjl7R7AzzS_nwoxMa7A9IfwTYfegyvazS6Poq_2XXpZQq3i8JGUWXzF0X-TyDuiMEGPaIlCQ',
    }

    expect.hasAssertions()
    try {
      await verifyJsonFarcasterSignature(data, verifyAppKeyFailure)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJfsAppKeyError)
      expect(error).toHaveProperty('message', 'App key not valid for FID')
    }
  })
})

describe('createJsonFarcasterSignature', () => {
  it('succeeds', () => {
    const signedData = createJsonFarcasterSignature({
      fid: 1,
      type: 'app_key',
      privateKey: hexToBytes(
        '0x7b6b8945ed9e063980046b348eed0404dc8fe95d9106412400a4879865cce465',
      ),
      payload: Buffer.from(JSON.stringify({ key: 'value' })),
    })

    expect(signedData).toMatchObject({
      header:
        'eyJmaWQiOjEsInR5cGUiOiJhcHBfa2V5Iiwia2V5IjoiMHgyY2Y5MjFmNDdiNTA0NDJkNGQ5MjFkNTRkYjgxZGExNDgzYzlkYzc5MWIyYzkyZDcwMzNlYWI3OTdiODg1MzkxIn0',
      payload: 'eyJrZXkiOiJ2YWx1ZSJ9',
      signature:
        '-NAQ3_iYypw3gO_efpTLWV-b6GrBZJrBb2tXcJVTT9q6XR4orra-0tPSbA3DtUIcS0_xr6wDE8GsSTfpPo83Aw',
    })
  })
})
