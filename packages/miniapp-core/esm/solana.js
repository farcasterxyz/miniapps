import { Connection as SolanaConnection, } from '@solana/web3.js';
export { SolanaConnection };
export const createSolanaWalletProvider = (request) => ({
    request,
    signMessage: (msg) => request({ method: 'signMessage', params: { message: msg } }),
    signTransaction: (transaction) => request({ method: 'signTransaction', params: { transaction } }),
    signAndSendTransaction: (input) => request({
        method: 'signAndSendTransaction',
        params: input,
    }),
});
