import { describe, expect, it } from 'vitest'
import { InvalidJfsDataError } from '../src/jfs.ts'
import type { VerifyAppKey } from '../src/types.ts'
import { InvalidEventDataError, parseWebhookEvent } from '../src/webhook.ts'

describe('parseWebhookEvent', () => {
  const verifyAppKeySuccess: VerifyAppKey = async (
    fid: number,
    appKey: string,
  ) => ({ valid: true, appFid: 100 })

  it('succeeds when data is correct', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 5448,
          type: 'app_key',
          key: '0x6bc06a1584f29d8a3133ea6b9ea17210a7a2f7d60b7dc82e770ca7b4bf241296',
        }),
      ).toString('base64url'),
      payload: Buffer.from(JSON.stringify({ event: 'frame_removed' })).toString(
        'base64url',
      ),
      signature:
        'GjGm5UwW6nkOxP6wfjiFL09qGdP-Z2Od6C8ul5Yqlis6e9hrQCjy4OHeig6A4AWDXMvTALA26rPWleC7x0NoCw',
    }

    await expect(
      parseWebhookEvent(data, verifyAppKeySuccess),
    ).resolves.toMatchObject({ fid: 5448, event: { event: 'frame_removed' } })
  })

  it('throws on invalid JFS data', async () => {
    const data = { invalid: 'data' }

    expect.hasAssertions()
    try {
      await parseWebhookEvent(data, verifyAppKeySuccess)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJfsDataError)
      expect(error).toHaveProperty('message', 'Error parsing data')
    }
  })

  it('throws on non-JSON payload', async () => {
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
      await parseWebhookEvent(data, verifyAppKeySuccess)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidEventDataError)
      expect(error).toHaveProperty(
        'message',
        'Error decoding and parsing payload',
      )
    }
  })

  it('throws on invalid event payload', async () => {
    const data = {
      header: Buffer.from(
        JSON.stringify({
          fid: 5448,
          type: 'app_key',
          key: '0x6bc06a1584f29d8a3133ea6b9ea17210a7a2f7d60b7dc82e770ca7b4bf241296',
        }),
      ).toString('base64url'),
      payload: Buffer.from(JSON.stringify({ event: 'invalid' })).toString(
        'base64url',
      ),
      signature:
        '2gFJEqtV9nYXbfrcfqhTp7r9EwHkO4o0_g5FCzTQncFSOfKzE1jgRl4GbdQaJ1KVvgvWQfOAd0eSyb9XvwWjBw',
    }

    expect.hasAssertions()
    try {
      await parseWebhookEvent(data, verifyAppKeySuccess)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidEventDataError)
      expect(error).toHaveProperty('message', 'Invalid event payload')
    }
  })
})
