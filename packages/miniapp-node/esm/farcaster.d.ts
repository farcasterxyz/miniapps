import { type VerifyAppKey } from './types.ts';
export declare const signedKeyRequestAbi: readonly [{
    readonly components: readonly [{
        readonly name: "requestFid";
        readonly type: "uint256";
    }, {
        readonly name: "requestSigner";
        readonly type: "address";
    }, {
        readonly name: "signature";
        readonly type: "bytes";
    }, {
        readonly name: "deadline";
        readonly type: "uint256";
    }];
    readonly name: "SignedKeyRequest";
    readonly type: "tuple";
}];
export declare const createVerifyAppKeyWithHub: (hubUrl: string, requestOptions?: RequestInit) => VerifyAppKey;
