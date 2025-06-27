import type * as Address from 'ox/Address';
import type * as Provider from 'ox/Provider';
import type * as RpcRequest from 'ox/RpcRequest';
import type * as RpcResponse from 'ox/RpcResponse';
import type * as RpcSchema from 'ox/RpcSchema';
export type EthProvideRequest<schema extends RpcSchema.Generic = RpcSchema.Default> = Provider.RequestFn<schema>;
export type FrameEthProviderEventData = {
    type: 'frame_eth_provider_event';
} & EthProviderWireEvent;
export type RpcTransport = (request: RpcRequest.RpcRequest) => Promise<RpcResponse.RpcResponse>;
export type ProviderRpcError = {
    code: number;
    details?: string;
    message?: string;
};
export type EthProviderWireEvent = {
    event: 'accountsChanged';
    params: [readonly Address.Address[]];
} | {
    event: 'chainChanged';
    params: [string];
} | {
    event: 'connect';
    params: [Provider.ConnectInfo];
} | {
    event: 'disconnect';
    params: [ProviderRpcError];
} | {
    event: 'message';
    params: [Provider.Message];
};
export type EmitEthProvider = <event extends EthProviderWireEvent['event']>(event: event, params: Extract<EthProviderWireEvent, {
    event: event;
}>['params']) => void;
/**
 * Metadata of the EIP-1193 Provider.
 */
export interface EIP6963ProviderInfo {
    icon: `data:image/${string}`;
    name: string;
    rdns: string;
    uuid: string;
}
export type EventEip6963AnnounceProvider = {
    event: 'eip6963:announceProvider';
    info: EIP6963ProviderInfo;
};
