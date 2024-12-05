import { Provider, RpcRequest, RpcResponse } from "ox";
import { WebViewEndpoint } from "../endpoint";
import { EventMap } from "ox/Provider";

export function forwardProviderEvents(
  provider: Provider.Provider, 
  endpoint: WebViewEndpoint
) {
  let accountsChanged: EventMap['accountsChanged'] = (accounts) => {
    endpoint.emitEthProvider('accountsChanged', [accounts]);
  };
  let chainChanged: EventMap['chainChanged'] = (chainId) => {
    endpoint.emitEthProvider('chainChanged', [chainId]);
  };
  let connect: EventMap['connect'] = (connectInfo) => {
    endpoint.emitEthProvider('connect', [connectInfo]);
  };
  let disconnect: EventMap['disconnect'] = (providerRpcError) => {
    endpoint.emitEthProvider('disconnect', [providerRpcError]);
  };
  let message: EventMap['message'] = (message) => {
    endpoint.emitEthProvider('message', [message]);
  };

  provider.on("accountsChanged", accountsChanged);
  provider.on("chainChanged", chainChanged);
  provider.on("connect", connect);
  provider.on("disconnect", disconnect);
  provider.on("message", message);

  return () => {
    provider.removeListener("accountsChanged", accountsChanged);
    provider.removeListener("chainChanged", chainChanged);
    provider.removeListener("connect", connect);
    provider.removeListener("disconnect", disconnect);
    provider.removeListener("message", message);
  }
}

// export type FrameTransport<
//   raw extends boolean = false,
//   schema extends RpcSchema.Generic = RpcSchema.Default,
// > = RP RpcTransport<raw, {}, schema>

/**
  * Wraps a provider's request function with a result format that can transfer
  * errors across scripting boundaries.
  */
export const wrapProviderRequest = (provider: Provider.Provider) => 
 async (request: RpcRequest.RpcRequest) => {
  try {
    const result = await provider.request(request);

    return RpcResponse.from(
      { result }, 
      { request }
    );
  } catch (e) {
    if (e instanceof Provider.ProviderRpcError) {
      return RpcResponse.from(
        {
          error: {
            message: e.message,
            code: e.code,
            details: e.details,
          }
        }, 
        { request }
      );
    }

    if (e !== null 
      && typeof e === 'object' 
      && 'message' in e 
      && typeof e.message === 'string' 
      && 'code' in e
      && typeof e.code === 'number' 
    ) {
      return RpcResponse.from(
        {
          error: {
            message: e.message,
            code: e.code,
            details: 'details' in e && typeof e.details === 'string' ? e.details : undefined
          }
        }, 
        { request }
      );
    }

    const errorMessage = e instanceof Error ? e.message : "Unknown";
    return RpcResponse.from(
      {
        error: {
          message: errorMessage,
          code: 1000,
        }
      }, 
      { request }
    );
  }
}
