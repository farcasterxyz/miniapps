import { exposeToIframe, FrameHost } from "@farcaster/frame-host";
import "./style.css";

declare global {
  interface Window {
    ethereum: any;
  }
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="container">
    <div id="splash"></div>
    <iframe src="/frame/" id="iframe" height="695" width="424" style="border:none;" />
  </div>
`;

const frameHost: FrameHost = {
  ready: (_options) => {
    document.querySelector<HTMLDivElement>("#splash")!.hidden = true;
  },
} as FrameHost;

exposeToIframe({
  iframe: document.querySelector<HTMLIFrameElement>("#iframe")!,
  sdk: frameHost,
  ethProvider: window.ethereum,
  frameOrigin: window.origin,
});
