import type { SolanaWireRequestFn } from '@farcaster/frame-core'
import { frameHost, sdk } from '@farcaster/frame-sdk'
import { base58 } from '@scure/base'
import {
  SignAndSendAllTransactions,
  type SolanaSignAndSendAllTransactionsMethod,
  SolanaSignAndSendTransaction,
  type SolanaSignAndSendTransactionInput,
  type SolanaSignAndSendTransactionMethod,
  type SolanaSignAndSendTransactionOutput,
  SolanaSignMessage,
  type SolanaSignMessageInput,
  type SolanaSignMessageMethod,
  type SolanaSignMessageOutput,
  SolanaSignTransaction,
  type SolanaSignTransactionInput,
  type SolanaSignTransactionMethod,
  type SolanaSignTransactionOutput,
} from '@solana/wallet-standard-features'
import type {
  Wallet,
  WalletAccount,
  WalletEventsWindow,
  WindowRegisterWalletEvent,
  WindowRegisterWalletEventCallback,
} from '@wallet-standard/base'
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
  type StandardEventsListeners,
  type StandardEventsNames,
  type StandardEventsOnMethod,
} from '@wallet-standard/features'

import { localStorageKey } from './constants'

const walletName = 'Farcaster'
const supportedChains = ['solana:mainnet'] as const
const supportedFeatures = [
  StandardConnect,
  SolanaSignAndSendTransaction,
  SolanaSignTransaction,
  SolanaSignMessage,
] as const

export class FarcasterSolanaWallet implements Wallet {
  listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } = {}
  account: FarcasterSolanaAccount | undefined

  constructor() {
    void this.connect()
  }

  get version() {
    return '1.0.0' as const
  }

  get name() {
    return walletName
  }

  get icon() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiByeD0iNTYiIGZpbGw9IiM3QzY1QzEiPjwvcmVjdD48cGF0aCBkPSJNMTgzLjI5NiA3MS42OEgyMTEuOTY4TDIwNy44NzIgOTQuMjA4SDIwMC43MDRWMTgwLjIyNEwyMDEuMDIgMTgwLjIzMkMyMDQuMjY2IDE4MC4zOTYgMjA2Ljg0OCAxODMuMDgxIDIwNi44NDggMTg2LjM2OFYxOTEuNDg4TDIwNy4xNjQgMTkxLjQ5NkMyMTAuNDEgMTkxLjY2IDIxMi45OTIgMTk0LjM0NSAyMTIuOTkyIDE5Ny42MzJWMjAyLjc1MkgxNTUuNjQ4VjE5Ny42MzJDMTU1LjY0OCAxOTQuMzQ1IDE1OC4yMjkgMTkxLjY2IDE2MS40NzYgMTkxLjQ5NkwxNjEuNzkyIDE5MS40ODhWMTg2LjM2OEMxNjEuNzkyIDE4My4wODEgMTY0LjM3MyAxODAuMzk2IDE2Ny42MiAxODAuMjMyTDE2Ny45MzYgMTgwLjIyNFYxMzguMjRDMTY3LjkzNiAxMTYuMTg0IDE1MC4wNTYgOTguMzA0IDEyOCA5OC4zMDRDMTA1Ljk0NCA5OC4zMDQgODguMDYzOCAxMTYuMTg0IDg4LjA2MzggMTM4LjI0VjE4MC4yMjRMODguMzc5OCAxODAuMjMyQzkxLjYyNjIgMTgwLjM5NiA5NC4yMDc4IDE4My4wODEgOTQuMjA3OCAxODYuMzY4VjE5MS40ODhMOTQuNTIzOCAxOTEuNDk2Qzk3Ljc3MDIgMTkxLjY2IDEwMC4zNTIgMTk0LjM0NSAxMDAuMzUyIDE5Ny42MzJWMjAyLjc1Mkg0My4wMDc4VjE5Ny42MzJDNDMuMDA3OCAxOTQuMzQ1IDQ1LjU4OTQgMTkxLjY2IDQ4LjgzNTggMTkxLjQ5Nkw0OS4xNTE4IDE5MS40ODhWMTg2LjM2OEM0OS4xNTE4IDE4My4wODEgNTEuNzMzNCAxODAuMzk2IDU0Ljk3OTggMTgwLjIzMkw1NS4yOTU4IDE4MC4yMjRWOTQuMjA4SDQ4LjEyNzhMNDQuMDMxOCA3MS42OEg3Mi43MDM4VjU0LjI3MkgxODMuMjk2VjcxLjY4WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48L3N2Zz4K' as const
  }

  get chains() {
    return supportedFeatures
  }

  get features() {
    return {
      [StandardConnect]: {
        version: '1.0.0',
        connect: this.connect,
      },
      [StandardDisconnect]: {
        version: '1.0.0',
        disconnect: this.disconnect,
      },
      [StandardEvents]: {
        version: '1.0.0',
        on: this.on,
      },
      [SolanaSignMessage]: {
        version: '1.0.0',
        signMessage: this.signMessage,
      },
      [SolanaSignTransaction]: {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signTransaction: this.signTransaction,
      },
      [SolanaSignAndSendTransaction]: {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signAndSendTransaction: this.signAndSendTransaction,
      },
      [SignAndSendAllTransactions]: {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signAndSendAllTransactions: this.signAndSendAllTransactions,
      },
    }
  }

  get accounts() {
    return this.account ? [this.account] : []
  }

  connect = async () => {
    if (this.account) {
      return
    }
    const provider = await sdk.wallet.getSolanaProvider()
    if (!provider) {
      throw new Error('could not get Solana provider')
    }
    const { publicKey: address } = await provider.request({
      method: 'connect',
    })
    this.account = new FarcasterSolanaAccount(address)
    this.emit('change', { accounts: this.accounts })
    return [this.account]
  }

  disconnect = () => {
    if (this.account) {
      this.account = undefined
      this.emit('change', { accounts: this.accounts })
    }
  }

  on: StandardEventsOnMethod = (event, listener) => {
    if (this.listeners[event]) {
      this.listeners[event].push(listener)
    } else {
      this.listeners[event] = [listener]
    }
    return () => {
      this.listeners[event] = this.listeners[event]?.filter(
        (existingListener) => listener !== existingListener,
      )
    }
  }

  emit<E extends StandardEventsNames>(
    event: E,
    ...args: Parameters<StandardEventsListeners[E]>
  ) {
    const listeners = this.listeners[event] ?? []
    for (const listener of listeners) {
      listener.apply(null, args)
    }
  }

  signMessage: SolanaSignMessageMethod = async (...inputs) => {
    const outputs: SolanaSignMessageOutput[] = []
    for (const input of inputs) {
      const output = await this.signSingleMessage(input)
      outputs.push(output)
    }
    return outputs
  }

  async signSingleMessage(input: SolanaSignMessageInput) {
    const provider = await sdk.wallet.getSolanaProvider()
    if (!provider) {
      throw new Error('could not get Solana provider')
    }
    const { message } = input
    const messageStr = Buffer.from(message).toString('utf8')
    const { signature } = await provider.signMessage(messageStr)
    const signatureBytes = Buffer.from(signature, 'base64')
    return { signedMessage: message, signature: signatureBytes }
  }

  signTransaction: SolanaSignTransactionMethod = async (...inputs) => {
    const outputs: SolanaSignTransactionOutput[] = []
    for (const input of inputs) {
      const output = await this.signSingleTransaction(input)
      outputs.push(output)
    }
    return outputs
  }

  async signSingleTransaction(input: SolanaSignTransactionInput) {
    const provider = await sdk.wallet.getSolanaProvider()
    if (!provider || !frameHost.solanaProviderRequest) {
      // We check the provider to make sure that the frame host has the
      // capability, but we use the frame host directly below to avoid
      // unnecessary serialization/unserialization steps
      throw new Error('could not get Solana provider')
    }
    const solanaProviderRequest =
      frameHost.solanaProviderRequest as unknown as SolanaWireRequestFn
    const { transaction } = input
    const transactionStr = Buffer.from(transaction).toString('base64')
    const { signedTransaction } = await solanaProviderRequest({
      method: 'signTransaction',
      params: { transaction: transactionStr },
    })
    const signatureBytes = base58.decode(signedTransaction)
    return { signedTransaction: signatureBytes }
  }

  signAndSendTransaction: SolanaSignAndSendTransactionMethod = async (
    ...inputs
  ) => {
    const outputs: SolanaSignAndSendTransactionOutput[] = []
    for (const input of inputs) {
      const output = await this.signAndSendSingleTransaction(input)
      outputs.push(output)
    }
    return outputs
  }

  async signAndSendSingleTransaction(input: SolanaSignAndSendTransactionInput) {
    const provider = await sdk.wallet.getSolanaProvider()
    if (!provider || !frameHost.solanaProviderRequest) {
      // We check the provider to make sure that the frame host has the
      // capability, but we use the frame host directly below to avoid
      // unnecessary serialization/unserialization steps
      throw new Error('could not get Solana provider')
    }
    const solanaProviderRequest =
      frameHost.solanaProviderRequest as unknown as SolanaWireRequestFn
    const { transaction } = input
    const transactionStr = Buffer.from(transaction).toString('base64')
    const { signature } = await solanaProviderRequest({
      method: 'signAndSendTransaction',
      params: { transaction: transactionStr },
    })
    const signatureBytes = base58.decode(signature)
    return { signature: signatureBytes }
  }

  signAndSendAllTransactions: SolanaSignAndSendAllTransactionsMethod = async (
    inputs,
    options,
  ) => {
    if (options?.mode === 'parallel') {
      return await Promise.allSettled(
        inputs.map((input) => this.signAndSendSingleTransaction(input)),
      )
    }
    const outputs: PromiseSettledResult<SolanaSignAndSendTransactionOutput>[] =
      []
    for (const input of inputs) {
      try {
        const output = await this.signAndSendSingleTransaction(input)
        outputs.push({ status: 'fulfilled', value: output })
      } catch (e) {
        outputs.push({ status: 'rejected', reason: e })
      }
    }
    return outputs
  }
}

export class FarcasterSolanaAccount implements WalletAccount {
  address: string
  publicKey: Uint8Array

  constructor(address: string) {
    this.address = address
    this.publicKey = base58.decode(address)
  }

  get chains() {
    return supportedChains
  }

  get features() {
    return supportedFeatures
  }
}

class RegisterWalletEvent extends Event implements WindowRegisterWalletEvent {
  detail: WindowRegisterWalletEventCallback

  get type() {
    return 'wallet-standard:register-wallet' as const
  }

  constructor(callback: WindowRegisterWalletEventCallback) {
    super('wallet-standard:register-wallet', {
      bubbles: false,
      cancelable: false,
      composed: false,
    })
    this.detail = callback
  }

  preventDefault(): never {
    throw new Error('preventDefault cannot be called')
  }

  stopImmediatePropagation(): never {
    throw new Error('stopImmediatePropagation cannot be called')
  }

  stopPropagation(): never {
    throw new Error('stopPropagation cannot be called')
  }
}
;(async () => {
  if (typeof window === 'undefined') {
    return
  }

  const provider = await sdk.wallet.getSolanaProvider()
  if (!provider) {
    return
  }

  localStorage.setItem(localStorageKey, `"${walletName}"`)

  const wallet = new FarcasterSolanaWallet()
  const callback: WindowRegisterWalletEventCallback = ({ register }) =>
    register(wallet)
  try {
    window.dispatchEvent(new RegisterWalletEvent(callback))
  } catch (error) {
    console.error(
      'wallet-standard:register-wallet event could not be dispatched',
      error,
    )
  }

  try {
    ;(window as WalletEventsWindow).addEventListener(
      'wallet-standard:app-ready',
      ({ detail }) => callback(detail),
    )
  } catch (error) {
    console.error(
      'wallet-standard:app-ready event listener could not be added',
      error,
    )
  }
})()
