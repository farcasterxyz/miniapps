import { afterAll, beforeAll, vi } from 'vitest'

beforeAll(() => {
  vi.mock('../src/internal/errors.ts', async () => ({
    ...(await vi.importActual('../src/internal/errors.ts')),
    getVersion: vi.fn().mockReturnValue('x.y.z'),
    getUrl: vi.fn().mockReturnValue('https://miniapps.xyz'),
  }))
})

afterAll(async () => {
  vi.restoreAllMocks()
})
