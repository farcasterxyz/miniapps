import {
  Transaction as SolanaTransaction,
  VersionedMessage as SolanaVersionedMessage,
  VersionedTransaction as SolanaVersionedTransaction,
} from '@solana/web3.js'

import type {
  SolanaCombinedTransaction,
  SolanaConnectRequestArguments,
  SolanaRequestFn,
  SolanaSignAndSendTransactionRequestArguments,
  SolanaSignMessageRequestArguments,
  SolanaSignTransactionRequestArguments,
  SolanaWireRequestFn,
  SolanaWireSignAndSendTransactionRequestArguments,
  SolanaWireSignTransactionRequestArguments,
} from './solana.ts'

function serializeTransaction(transaction: SolanaCombinedTransaction): string {
  return Buffer.from(
    transaction.serialize({
      verifySignatures: false,
    }),
  ).toString('base64')
}

function unserializeTransaction(
  transaction: string,
): SolanaCombinedTransaction {
  const bytes = Buffer.from(transaction, 'base64')
  const version = SolanaVersionedMessage.deserializeMessageVersion(bytes)
  return version === 'legacy'
    ? SolanaVersionedTransaction.deserialize(bytes)
    : SolanaTransaction.from(bytes)
}

export function wrapSolanaProviderRequest(
  requestFn: SolanaRequestFn,
): SolanaWireRequestFn {
  const wrappedFn = async (
    request:
      | SolanaConnectRequestArguments
      | SolanaSignMessageRequestArguments
      | SolanaWireSignAndSendTransactionRequestArguments
      | SolanaWireSignTransactionRequestArguments,
  ) => {
    if (request.method === 'connect') {
      return await requestFn(request)
    }
    if (request.method === 'signMessage') {
      return await requestFn(request)
    }
    if (request.method === 'signAndSendTransaction') {
      const { transaction, options } = request.params
      const params = {
        transaction: unserializeTransaction(transaction),
        options,
      }
      return await requestFn({
        method: 'signAndSendTransaction',
        params,
      })
    }
    if (request.method === 'signTransaction') {
      const { transaction } = request.params
      const params = {
        transaction: unserializeTransaction(transaction),
      }
      const { signedTransaction } = await requestFn({
        method: 'signTransaction',
        params,
      })
      return {
        signedTransaction: serializeTransaction(signedTransaction),
      }
    }
  }
  return wrappedFn as SolanaWireRequestFn
}

export function unwrapSolanaProviderRequest(
  wrappedRequestFn: SolanaWireRequestFn,
): SolanaRequestFn {
  const unwrappedFn = async <T extends SolanaCombinedTransaction>(
    request:
      | SolanaConnectRequestArguments
      | SolanaSignMessageRequestArguments
      | SolanaSignAndSendTransactionRequestArguments
      | SolanaSignTransactionRequestArguments<T>,
  ) => {
    if (request.method === 'connect') {
      return await wrappedRequestFn(request)
    }
    if (request.method === 'signMessage') {
      return await wrappedRequestFn(request)
    }
    if (request.method === 'signAndSendTransaction') {
      const { transaction } = request.params
      const params = {
        transaction: serializeTransaction(transaction),
      }
      return await wrappedRequestFn({
        method: 'signAndSendTransaction',
        params,
      })
    }
    if (request.method === 'signTransaction') {
      const { transaction } = request.params
      const params = {
        transaction: serializeTransaction(transaction),
      }
      const { signedTransaction } = await wrappedRequestFn({
        method: 'signTransaction',
        params,
      })
      return { signedTransaction: unserializeTransaction(signedTransaction) }
    }
  }
  return unwrappedFn as SolanaRequestFn
}
