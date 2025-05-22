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
    return 'Farcaster' as const
  }

  get icon() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAxMjYwIDEyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzFfMikiPjxwYXRoIGQ9Ik05NDcuNzQ3IDEyNTkuNjFIMzExLjg2MUMxMzkuOTAxIDEyNTkuNjEgMCAxMTE5LjcyIDAgOTQ3Ljc1MlYzMTEuODcxQzAgMTM5LjkwNyAxMzkuOTAxIDAuMDA1NDEzNjIgMzExLjg2MSAwLjAwNTQxMzYySDk0Ny43NDdDMTExOS43MSAwLjAwNTQxMzYyIDEyNTkuNjEgMTM5LjkwNyAxMjU5LjYxIDMxMS44NzFWOTQ3Ljc1MkMxMjU5LjYxIDExMTkuNzIgMTExOS43MSAxMjU5LjYxIDk0Ny43NDcgMTI1OS42MVoiIGZpbGw9IiM0NzJBOTEiPjwvcGF0aD48cGF0aCBkPSJNODI2LjUxMyAzOTguNjMzTDc2NC40MDQgNjMxLjg4OUw3MDIuMDkzIDM5OC42MzNINTU4LjY5N0w0OTUuNzg5IDYzMy42MDdMNDMzLjA4NyAzOTguNjMzSDI2OS43NjRMNDIxLjUyOCA5MTQuMzZINTYyLjQzMUw2MjkuODA3IDY3NC44NzZMNjk3LjE4MSA5MTQuMzZIODM4LjM4OEw5ODkuODE5IDM5OC42MzNIODI2LjUxM1oiIGZpbGw9IndoaXRlIj48L3BhdGg+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDBfMV8yIj48cmVjdCB3aWR0aD0iMTI1OS42MSIgaGVpZ2h0PSIxMjU5LjYxIiBmaWxsPSJ3aGl0ZSI+PC9yZWN0PjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPgo=' as const
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
  if (!window) {
    return
  }

  const provider = await sdk.wallet.getSolanaProvider()
  if (!provider) {
    return
  }

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
