import { wrap } from "comlink";
import { endpoint } from "./endpoint";
import { WireFrameHost } from "@farcaster/frame-core";

export const frameHost = wrap<WireFrameHost>(endpoint);
