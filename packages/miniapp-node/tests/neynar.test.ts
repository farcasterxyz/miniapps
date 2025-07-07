import { expect, test } from 'vitest'
import { verifyAppKeyWithNeynar } from '../src/neynar.ts'

test('neynar', async ({ skip }) => {
  if (!process.env.NEYNAR_API_KEY) {
    skip()
  }

  const result = await verifyAppKeyWithNeynar(
    5448,
    '0x5d4cd906de103d6fff5a50869164344827d338b78d887cb7d5d1ca1cf62711ee',
  )

  expect(result).toMatchObject({ valid: true, appFid: 9152 })
})
