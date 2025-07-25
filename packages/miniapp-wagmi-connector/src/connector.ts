import MiniAppSDK from '@farcaster/miniapp-sdk'
import {
  ChainNotConfiguredError,
  type Connector,
  createConnector,
} from '@wagmi/core'
import { fromHex, getAddress, numberToHex, SwitchChainError } from 'viem'

farcasterMiniApp.type = 'farcasterMiniApp'

let accountsChanged: Connector['onAccountsChanged'] | undefined
let chainChanged: Connector['onChainChanged'] | undefined
let disconnect: Connector['onDisconnect'] | undefined

export function farcasterMiniApp() {
  return createConnector<typeof MiniAppSDK.wallet.ethProvider>((config) => ({
    id: 'farcaster',
    name: 'Farcaster',
    rdns: 'xyz.farcaster.MiniAppWallet',
    icon: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/055c25d6-7fe7-4a49-abf9-49772021cf00/original',
    type: farcasterMiniApp.type,

    async connect({ chainId } = {}) {
      const provider = await this.getProvider()
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })

      let targetChainId = chainId
      if (!targetChainId) {
        const state = (await config.storage?.getItem('state')) ?? {}
        const isChainSupported = config.chains.some(
          (x) => x.id === state.chainId,
        )
        if (isChainSupported) targetChainId = state.chainId
        else targetChainId = config.chains[0]?.id
      }
      if (!targetChainId) throw new Error('No chains found on connector.')

      if (!accountsChanged) {
        accountsChanged = this.onAccountsChanged.bind(this)
        // @ts-expect-error - provider type is stricter
        provider.on('accountsChanged', accountsChanged)
      }
      if (!chainChanged) {
        chainChanged = this.onChainChanged.bind(this)
        provider.on('chainChanged', chainChanged)
      }
      if (!disconnect) {
        disconnect = this.onDisconnect.bind(this)
        provider.on('disconnect', disconnect)
      }

      let currentChainId = await this.getChainId()
      if (targetChainId && currentChainId !== targetChainId) {
        const chain = await this.switchChain!({ chainId: targetChainId })
        currentChainId = chain.id
      }

      return {
        accounts: accounts.map((x) => getAddress(x)),
        chainId: currentChainId,
      }
    },
    async disconnect() {
      const provider = await this.getProvider()

      if (accountsChanged) {
        // @ts-expect-error - provider type is stricter
        provider.removeListener('accountsChanged', accountsChanged)
        accountsChanged = undefined
      }

      if (chainChanged) {
        provider.removeListener('chainChanged', chainChanged)
        chainChanged = undefined
      }

      if (disconnect) {
        provider.removeListener('disconnect', disconnect)
        disconnect = undefined
      }
    },
    async getAccounts() {
      const provider = await this.getProvider()
      const accounts = await provider.request({
        method: 'eth_accounts',
      })
      return accounts.map((x) => getAddress(x))
    },
    async getChainId() {
      const provider = await this.getProvider()
      const hexChainId = await provider.request({ method: 'eth_chainId' })
      return fromHex(hexChainId, 'number')
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts()
        return !!accounts.length
      } catch {
        return false
      }
    },
    async switchChain({ chainId }) {
      const provider = await this.getProvider()
      const chain = config.chains.find((x) => x.id === chainId)
      if (!chain) {
        throw new SwitchChainError(new ChainNotConfiguredError())
      }

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: numberToHex(chainId) }],
      })

      // providers should start emitting these events - remove when hosts have upgraded
      //
      // explicitly emit this event as a workaround for ethereum provider not
      // emitting events, can remove once events are flowing
      config.emitter.emit('change', { chainId })

      return chain
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        this.onDisconnect()
      } else {
        config.emitter.emit('change', {
          accounts: accounts.map((x) => getAddress(x)),
        })
      }
    },
    onChainChanged(chain) {
      const chainId = Number(chain)
      config.emitter.emit('change', { chainId })
    },
    async onDisconnect() {
      config.emitter.emit('disconnect')
    },
    async getProvider() {
      return MiniAppSDK.wallet.ethProvider
    },
  }))
}

// Backward compatibility
export const farcasterFrame = farcasterMiniApp
farcasterFrame.type = 'farcasterFrame' as const
