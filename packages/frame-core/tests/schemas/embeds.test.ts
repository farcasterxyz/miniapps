import { describe, expect, test } from 'vitest'
import {
  actionLaunchFrameSchema,
  actionSchema,
  frameEmbedNextSchema,
} from '../../src/schemas/embeds.ts'

describe('actionLaunchFrameSchema', () => {
  test('valid with URL', () => {
    const result = actionLaunchFrameSchema.safeParse({
      type: 'launch_frame',
      name: 'Open',
      url: 'https://www.bountycaster.xyz/bounty/0x0000000000000000000000000000000000000000/frames',
      splashImageUrl:
        'https://www.bountycaster.xyz/static/images/bounty/logo.png',
      splashBackgroundColor: '#ffffff',
    })
    expect(result.success).toBe(true)
  })

  test('valid without URL', () => {
    const result = actionLaunchFrameSchema.safeParse({
      type: 'launch_frame',
      name: 'Open',
      splashImageUrl:
        'https://www.bountycaster.xyz/static/images/bounty/logo.png',
      splashBackgroundColor: '#ffffff',
    })
    expect(result.success).toBe(true)
  })
})

describe('actionViewTokenSchema', () => {
  test('valid CAIP-19', () => {
    const VALID_CAIP_19_IDS = [
      'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      'eip155:1/slip44:60',
      'eip155:8453/native',
      'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'solana:101/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'bip122:000000000019d6689c085ae165831e93/slip44:0',
      'cosmos:cosmoshub-3/slip44:118',
      'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
      'cosmos:Binance-Chain-Tigris/slip44:714',
      'cosmos:iov-mainnet/slip44:234',
      'lip9:9ee11e9df416b18b/slip44:134',
      'eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f',
      'eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
      'eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769',
      'hedera:mainnet/nft:0.0.55492/12',
    ]

    for (const id of VALID_CAIP_19_IDS) {
      const result = actionSchema.safeParse({
        type: 'view_token',
        token: id,
      })
      expect(result.success, `Expected valid CAIP-19: ${id}`).toBe(true)
    }
  })

  test('invalid CAIP-19', () => {
    const INVALID_CAIP_19_IDS = [
      'eip155',
      'eip155:1/slip44',
      'eip155/native',
      'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'not_a_caip_19_id',
      'eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769/12345',
    ]

    for (const id of INVALID_CAIP_19_IDS) {
      const result = actionSchema.safeParse({
        type: 'view_token',
        token: id,
      })
      expect(result.success, `Expected invalid CAIP-19: ${id}`).toBe(false)
    }
  })
})

describe('frameEmbedNextSchema', () => {
  const baseEmbed = {
    imageUrl: 'https://example.com/image.png',
    button: {
      title: 'Click me',
      action: {
        type: 'launch_frame' as const,
        name: 'Test',
        url: 'https://example.com/frame',
      },
    },
  }

  test('valid with version "next"', () => {
    const result = frameEmbedNextSchema.safeParse({
      ...baseEmbed,
      version: 'next',
    })
    expect(result.success).toBe(true)
  })

  test('valid with version "1"', () => {
    const result = frameEmbedNextSchema.safeParse({
      ...baseEmbed,
      version: '1',
    })
    expect(result.success).toBe(true)
  })

  test('invalid with other version values', () => {
    const invalidVersions = ['0', '2', '0.0.1', 'v1', 'latest']

    for (const version of invalidVersions) {
      const result = frameEmbedNextSchema.safeParse({
        ...baseEmbed,
        version,
      })
      expect(result.success, `Expected invalid version: ${version}`).toBe(false)
    }
  })

  test('valid with aspectRatio', () => {
    const result = frameEmbedNextSchema.safeParse({
      ...baseEmbed,
      version: '1',
      aspectRatio: '1:1',
    })
    expect(result.success).toBe(true)
  })

  test('imageUrl must be secure URL', () => {
    const result = frameEmbedNextSchema.safeParse({
      ...baseEmbed,
      version: '1',
      imageUrl: 'http://example.com/image.png', // not https
    })
    expect(result.success).toBe(false)
  })
})
