import { http, createConfig } from '@wagmi/core'
import { numberToHex } from 'viem'
import { base, celo, mainnet } from 'viem/chains'
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'
import type { farcasterFrame } from '../src/index.ts'

type Storage = {
  key: string
  getItem: (...args: any[]) => Promise<any>
  setItem: (...args: any[]) => any
  removeItem: (...args: any[]) => any
}

const storage: Storage = {
  key: 'wagmi',
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

let connector: ReturnType<ReturnType<typeof farcasterFrameConnector>>
let config: ReturnType<typeof createConfig>
let farcasterFrameConnector: typeof farcasterFrame

const mockAccount = '0x1234567890abcdef1234567890abcdef12345678'

beforeEach(async () => {
  vi.resetModules()

  // dynamic import for frame connector so a fresh scope is created
  farcasterFrameConnector = (await import('../src/index.ts')).farcasterFrame

  config = createConfig({
    chains: [base, mainnet, celo],
    transports: {
      [base.id]: http(),
      [mainnet.id]: http(),
      [celo.id]: http(),
    },
    connectors: [farcasterFrameConnector()],
    storage,
  })

  const connectorFunction = farcasterFrameConnector()
  connector = config._internal.connectors.setup(connectorFunction)
})

// Connector Setup
describe('Setup Connector', () => {
  it('setups up correct connector properties', () => {
    expect(connector.id).toEqual('farcaster')
    expect(connector.name).toEqual('Farcaster')
    expect(connector.rdns).toEqual('xyz.farcaster.MiniAppWallet')
  })
})

// Connect function
describe('Connect', () => {
  it('connects to chain by chainID, sets event listeners and returns accounts', async () => {
    const currentChainId = base.id
    const connectChainId = mainnet.id
    const mockProvider = {
      request: vi.fn(),
      on: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    mockProvider.request.mockResolvedValueOnce([mockAccount]) // eth_requestAccounts
    mockProvider.request.mockResolvedValueOnce(currentChainId) // eth_chainId
    mockProvider.request.mockResolvedValueOnce(connectChainId) // wallet_switchEthereumChain

    const accounts = await connector.connect({ chainId: connectChainId })

    expect(accounts.accounts[0].toLowerCase()).toEqual(
      mockAccount.toLowerCase(),
    )
    expect(accounts.chainId).toEqual(connectChainId)
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts',
    })
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: numberToHex(connectChainId),
        },
      ],
    })

    // asserts sets event listeners
    expect(mockProvider.on).toHaveBeenCalledWith(
      'accountsChanged',
      expect.any(Function),
    )
    expect(mockProvider.on).toHaveBeenCalledWith(
      'chainChanged',
      expect.any(Function),
    )
    expect(mockProvider.on).toHaveBeenCalledWith(
      'disconnect',
      expect.any(Function),
    )
  })

  it('falls back to chainID in storage if none passed', async () => {
    const connectChainId = mainnet.id // chain id to connect to
    const currentChainId = base.id // chain id currently connected to

    // mock get state from storage
    ;(storage.getItem as Mock).mockResolvedValueOnce({
      chainId: connectChainId,
    })

    const mockProvider = {
      request: vi.fn(),
      on: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    mockProvider.request.mockResolvedValueOnce([mockAccount]) // eth_requestAccounts
    mockProvider.request.mockResolvedValueOnce(currentChainId) // eth_chainId
    mockProvider.request.mockResolvedValueOnce(connectChainId) // wallet_switchEthereumChain

    const accounts = await connector.connect({}) // act

    expect(accounts.accounts[0].toLowerCase()).toEqual(
      mockAccount.toLowerCase(),
    )
    expect(accounts.chainId).toEqual(connectChainId)
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts',
    })
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: numberToHex(connectChainId),
        },
      ],
    })
  })

  it('uses the first chain in config if none in storage', async () => {
    const connectChainId = config.chains[0].id
    const currentChainId = config.chains[1].id

    const mockProvider = {
      request: vi.fn(),
      on: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    mockProvider.request.mockResolvedValueOnce([mockAccount]) // eth_requestAccounts
    mockProvider.request.mockResolvedValueOnce(currentChainId) // eth_chainId
    mockProvider.request.mockResolvedValueOnce(connectChainId) // wallet_switchEthereumChain

    const accounts = await connector.connect({ chainId: connectChainId })

    expect(accounts.accounts[0].toLowerCase()).toEqual(
      mockAccount.toLowerCase(),
    )
    expect(accounts.chainId).toEqual(connectChainId)
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts',
    })
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: numberToHex(connectChainId),
        },
      ],
    })
  })

  it('throws error if no chains found', async () => {
    const emptyConfig = createConfig({
      chains: [{ id: false }],
      transports: [],
      connectors: [farcasterFrameConnector()],
      // storage,
    } as any)

    const connector = emptyConfig._internal.connectors.setup(
      farcasterFrameConnector(),
    )

    const mockProvider = {
      request: vi.fn(),
      on: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    mockProvider.request.mockResolvedValueOnce([mockAccount]) // eth_requestAccounts

    // expect the connect function to throw an error
    expect(connector.connect({})).rejects.toThrow(
      'No chains found on connector.',
    )
  })
})

// Disconnect function
describe('Disconnect', () => {
  it('removes listeners for accountsChanged, chainChanged, and disconnect', async () => {
    // connect first
    const currentChainId = base.id
    const connectChainId = mainnet.id
    const mockProvider = {
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    mockProvider.request.mockResolvedValueOnce([mockAccount]) // eth_requestAccounts
    mockProvider.request.mockResolvedValueOnce(currentChainId) // eth_chainId
    mockProvider.request.mockResolvedValueOnce(connectChainId) // wallet_switchEthereumChain

    const accounts = await connector.connect({ chainId: connectChainId })

    // then disconnect
    await connector.disconnect()

    expect(mockProvider.removeListener).toHaveBeenCalledWith(
      'accountsChanged',
      expect.any(Function),
    )
    expect(mockProvider.removeListener).toHaveBeenCalledWith(
      'chainChanged',
      expect.any(Function),
    )
    expect(mockProvider.removeListener).toHaveBeenCalledWith(
      'disconnect',
      expect.any(Function),
    )
  })
})

// getAccounts function
describe('Get Accounts', () => {
  it('returns accounts from provider', async () => {
    const mockProvider = {
      request: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    mockProvider.request.mockResolvedValueOnce([mockAccount]) // eth_accounts

    const accounts = await connector.getAccounts()

    expect(accounts[0].toLowerCase()).toEqual(mockAccount.toLowerCase())
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'eth_accounts',
    })
  })
})

// getChainId function
describe('Get Chain ID', () => {
  it('returns chain ID from provider', async () => {
    const mockProvider = {
      request: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    const chainId = base.id
    mockProvider.request.mockResolvedValueOnce(chainId) // eth_chainId

    const resultChainId = await connector.getChainId()

    expect(resultChainId).toEqual(chainId)
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'eth_chainId',
    })
  })
})

// isAuthorized function
describe('Is Authorized', () => {
  it('returns true if accounts are available', async () => {
    const mockProvider = {
      request: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    mockProvider.request.mockResolvedValueOnce([mockAccount]) // eth_accounts

    const isAuthorized = await connector.isAuthorized()

    expect(isAuthorized).toBe(true)

    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'eth_accounts',
    })
  })
  it('returns false if no accounts are available', async () => {
    const mockProvider = {
      request: vi.fn(),
    }
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)
    mockProvider.request.mockResolvedValueOnce([]) // eth_accounts

    const isAuthorized = await connector.isAuthorized()

    expect(isAuthorized).toBe(false)

    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'eth_accounts',
    })
  })
})

// switchChain function
describe('Switch Chain', () => {
  it('switches to the specified chain', async () => {
    const mockProvider = {
      request: vi.fn(),
    }
    const switchChainId = base.id
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)

    await connector.switchChain({ chainId: switchChainId })

    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: numberToHex(switchChainId) }],
    })
  })

  it('throws error if chain is not supported', async () => {
    const mockProvider = {
      request: vi.fn(),
    }
    const switchChainId = 404
    connector.getProvider = vi.fn().mockResolvedValue(mockProvider)

    expect(connector.switchChain({ chainId: switchChainId })).rejects.toThrow(
      'Chain not configured.',
    )
  })
})
