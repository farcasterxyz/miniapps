import {
  Connection as SolanaConnection,
  type SendOptions as SolanaSendOptions,
  type Transaction as SolanaTransaction,
  type VersionedTransaction as SolanaVersionedTransaction,
} from '@solana/web3.js'

export { SolanaConnection }
export type { SolanaSendOptions }

export type SolanaCombinedTransaction =
  | SolanaTransaction
  | SolanaVersionedTransaction

export type SolanaConnectRequestArguments = {
  method: 'connect'
}
export type SolanaSignMessageRequestArguments = {
  method: 'signMessage'
  params: {
    message: string
  }
}
export type SolanaSignAndSendTransactionRequestArguments = {
  method: 'signAndSendTransaction'
  params: {
    transaction: SolanaCombinedTransaction
    options?: SolanaSendOptions
  }
}
export type SolanaSignTransactionRequestArguments<
  T extends SolanaCombinedTransaction = SolanaTransaction,
> = {
  method: 'signTransaction'
  params: {
    transaction: T
  }
}

export type SolanaRequestFn = ((
  request: SolanaConnectRequestArguments,
) => Promise<{ publicKey: string }>) &
  ((request: SolanaSignMessageRequestArguments) => Promise<{
    signature: string
  }>) &
  ((request: SolanaSignAndSendTransactionRequestArguments) => Promise<{
    signature: string
  }>) &
  (<T extends SolanaCombinedTransaction>(
    request: SolanaSignTransactionRequestArguments<T>,
  ) => Promise<{ signedTransaction: T }>)

export interface SolanaWalletProvider {
  request: SolanaRequestFn

  signMessage(message: string): Promise<{ signature: string }>
  signTransaction<T extends SolanaCombinedTransaction>(
    transaction: T,
  ): Promise<{ signedTransaction: T }>
  signAndSendTransaction(input: {
    transaction: SolanaCombinedTransaction
  }): Promise<{ signature: string }>
}

export const createSolanaWalletProvider = (
  request: SolanaRequestFn,
): SolanaWalletProvider => ({
  request,
  signMessage: (msg: string) =>
    request({ method: 'signMessage', params: { message: msg } }),
  signTransaction: <T extends SolanaCombinedTransaction>(transaction: T) =>
    request({ method: 'signTransaction', params: { transaction } }),
  signAndSendTransaction: (input: { transaction: SolanaCombinedTransaction }) =>
    request({
      method: 'signAndSendTransaction',
      params: input,
    }),
})

export type SolanaWireSignAndSendTransactionRequestArguments = {
  method: 'signAndSendTransaction'
  params: {
    transaction: string
    options?: SolanaSendOptions
  }
}

export type SolanaWireSignTransactionRequestArguments = {
  method: 'signTransaction'
  params: {
    transaction: string
  }
}

export type SolanaWireRequestFn = ((
  request: SolanaConnectRequestArguments,
) => Promise<{ publicKey: string }>) &
  ((request: SolanaSignMessageRequestArguments) => Promise<{
    signature: string
  }>) &
  ((request: SolanaWireSignAndSendTransactionRequestArguments) => Promise<{
    signature: string
  }>) &
  ((
    request: SolanaWireSignTransactionRequestArguments,
  ) => Promise<{ signedTransaction: string }>)
