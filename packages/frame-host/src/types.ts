import type { Endpoint } from "./comlink";
import type { EmitEthProvider, FrameClientEvent } from "@farcaster/frame-core";

export type HostEndpoint = Endpoint & {
  emit: (event: FrameClientEvent) => void;
  emitEthProvider: EmitEthProvider;
};
