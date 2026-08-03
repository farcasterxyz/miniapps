import {
  Keypair,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { describe, expect, it } from 'vitest'

import type { SolanaRequestFn, SolanaWireRequestFn } from '../src/solana.ts'
import {
  SolanaConnection,
  unwrapSolanaProviderRequest,
  wrapSolanaProviderRequest,
} from '../src/solanaWire.ts'

const payer = Keypair.generate()
const to = Keypair.generate()
const blockhash = Keypair.generate().publicKey.toBase58()

function makeLegacyTransaction() {
  const tx = new Transaction({
    feePayer: payer.publicKey,
    blockhash,
    lastValidBlockHeight: 1,
  })
  tx.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: to.publicKey,
      lamports: 1000,
    }),
  )
  return tx
}

function makeVersionedTransaction() {
  const message = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: blockhash,
    instructions: [
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: to.publicKey,
        lamports: 2000,
      }),
    ],
  }).compileToV0Message()
  return new VersionedTransaction(message)
}

const cases = [
  ['legacy', makeLegacyTransaction()],
  ['versioned', makeVersionedTransaction()],
] as const

describe('solana wire serialization', () => {
  it('re-exports the web3.js Connection from the /solana subpath', () => {
    expect(typeof SolanaConnection).toBe('function')
  })

  for (const [name, tx] of cases) {
    const wireIn = Buffer.from(
      tx.serialize({ verifySignatures: false }),
    ).toString('base64')

    it(`wraps a rich request into a wire request (${name})`, async () => {
      const richFn: SolanaRequestFn = (async (request: {
        method: string
        params: { transaction: unknown }
      }) => {
        if (request.method === 'signTransaction') {
          // Echo the (unserialized) web3.js transaction back.
          return { signedTransaction: request.params.transaction }
        }
        throw new Error(`unexpected method ${request.method}`)
      }) as unknown as SolanaRequestFn

      const wireFn = wrapSolanaProviderRequest(richFn)
      const { signedTransaction } = await wireFn({
        method: 'signTransaction',
        params: { transaction: wireIn },
      })
      expect(signedTransaction).toBe(wireIn)
    })

    it(`unwraps a wire request into a rich request (${name})`, async () => {
      const wireEcho: SolanaWireRequestFn = (async (request: {
        method: string
        params: { transaction: string }
      }) => {
        if (request.method === 'signTransaction') {
          return { signedTransaction: request.params.transaction }
        }
        throw new Error(`unexpected method ${request.method}`)
      }) as unknown as SolanaWireRequestFn

      const richFn = unwrapSolanaProviderRequest(wireEcho)
      const { signedTransaction } = await richFn({
        method: 'signTransaction',
        params: { transaction: tx },
      })
      const roundTripped = Buffer.from(
        signedTransaction.serialize({ verifySignatures: false }),
      ).toString('base64')
      expect(roundTripped).toBe(wireIn)
    })
  }
})
