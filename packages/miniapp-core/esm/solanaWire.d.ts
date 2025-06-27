import type { SolanaRequestFn, SolanaWireRequestFn } from './solana.ts';
export declare function wrapSolanaProviderRequest(requestFn: SolanaRequestFn): SolanaWireRequestFn;
export declare function unwrapSolanaProviderRequest(wrappedRequestFn: SolanaWireRequestFn): SolanaRequestFn;
