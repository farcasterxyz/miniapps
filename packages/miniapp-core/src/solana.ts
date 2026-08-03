/**
 * Minimal structural mirror of `@solana/web3.js` `SendOptions`.
 *
 * Declared locally (rather than re-exported from `@solana/web3.js`) so that
 * importing this type from the package root never forces resolution of
 * `@solana/web3.js`. `@solana/web3.js` is an optional peer dependency; the
 * web3.js-backed helpers live in the `@farcaster/miniapp-core/solana`
 * subpath.
 */
export type SolanaSendOptions = {
  skipPreflight?: boolean
  preflightCommitment?: string
  maxRetries?: number
  minContextSlot?: number
}

/**
 * Minimal structural mirror of a serializable Solana transaction
 * (`@solana/web3.js` `Transaction | VersionedTransaction`). Both expose a
 * `serialize()` method, which is the only surface this package needs to treat
 * them generically.
 *
 * Declared locally so that importing this type from the package root never
 * forces resolution of `@solana/web3.js`. Concrete web3.js `Transaction` /
 * `VersionedTransaction` instances are structurally assignable to this type.
 */
export type SolanaCombinedTransaction = {
  serialize(config?: { verifySignatures?: boolean }): Uint8Array
}

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
  T extends SolanaCombinedTransaction = SolanaCombinedTransaction,
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

/**
 * Wraps a {@link SolanaRequestFn} into a {@link SolanaWalletProvider}.
 *
 * This helper does not use any `@solana/web3.js` runtime values, so it is safe
 * to import from the package root without `@solana/web3.js` installed.
 */
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
