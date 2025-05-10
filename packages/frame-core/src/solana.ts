import type {
  Connection as SolanaConnection,
  SendOptions as SolanaSendOptions,
  Transaction as SolanaTransaction,
  VersionedTransaction as SolanaVersionedTransaction,
} from '@solana/web3.js'

export type { SolanaConnection }

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
    connection: SolanaConnection
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
    connection: SolanaConnection
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
  signAndSendTransaction: (input: {
    transaction: SolanaCombinedTransaction
    connection: SolanaConnection
  }) =>
    request({
      method: 'signAndSendTransaction',
      params: input,
    }),
})
