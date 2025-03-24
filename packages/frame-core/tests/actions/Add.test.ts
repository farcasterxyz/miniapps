import { describe, expect, test, vi } from 'vitest'
import { add } from '../../src/actions/Add'
import { createTransport } from '../../src/jsonRpc'

describe('add', () => {
  test('default', async () => {
    const mockTransport = createTransport({
      request: vi.fn().mockResolvedValue({ result: undefined }),
    })

    await expect(add(mockTransport)).resolves.toBeUndefined()
  })

  test('errors: invalid manifest', async () => {
    const mockTransport = createTransport({
      request: vi.fn().mockResolvedValue({
        error: {
          code: -32000,
          message: 'Invalid manifest',
          data: { name: 'Add.InvalidFarcasterJsonError' },
        },
      }),
    })

    await expect(add(mockTransport)).rejects.toThrow('Invalid farcaster.json')
  })

  test('errors: rejected', async () => {
    const mockTransport = createTransport({
      request: vi.fn().mockResolvedValue({
        error: {
          code: -32000,
          message: 'Add rejected by user',
          data: { name: 'Add.RejectedByUserError' },
        },
      }),
    })

    await expect(add(mockTransport)).rejects.toThrow('Add rejected by user')
  })
})
