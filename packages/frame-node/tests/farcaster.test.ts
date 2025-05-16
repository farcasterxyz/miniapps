import { expect, test } from 'vitest'
import { createVerifyAppKeyWithHub } from '../src/farcaster'

test('farcaster', async () => {
  const hubUrl = 'https://snap.farcaster.xyz:3381'
  const verifyAppKey = createVerifyAppKeyWithHub(hubUrl)
  const result = await verifyAppKey(
    5448,
    '0x5d4cd906de103d6fff5a50869164344827d338b78d887cb7d5d1ca1cf62711ee',
  )

  expect(result).toMatchObject({ valid: true, appFid: 9152 })
})
