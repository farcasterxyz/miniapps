import type { FrameHost, WireFrameHost } from "@farcaster/frame-core";
import { SignIn } from "@farcaster/frame-core";

export function wrapHandlers(host: FrameHost): WireFrameHost {
  return {
    ...host,
    signIn: async (options) => {
      try {
        const result = await host.signIn(options);
        return { result };
      } catch (e) {
        if (e instanceof SignIn.RejectedByUser) {
          return {
            error: {
              type: 'rejected_by_user' 
            }
          }
        }

        throw e;
      }
    }
  }
}
