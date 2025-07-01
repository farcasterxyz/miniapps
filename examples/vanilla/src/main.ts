import { exposeToIframe, type MiniAppHost } from '@farcaster/miniapp-host'
import './style.css'

declare global {
  interface Window {
    ethereum: any
  }
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="header">
      <button id="back">back</button>
    </div>
    <div id="container">
      <div id="splash"></div>
      <iframe 
        src="/frame/" 
        allow="microphone; camera; clipboard-write 'src'"
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        id="iframe" 
        height="695" 
        width="424" 
        style="border:none;" 
        />
      <iframe src="/frame/" id="iframe" height="695" width="424" style="border:none;" />
    </div>
  </div>
`

const announceProvider = () => {
  endpoint.emit({
    event: 'eip6963:announceProvider',
    info: {
      name: 'Vanilla Frame',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      rdns: 'com.example.VanillaFrameHost',
      uuid: '1395b549-854c-48c4-96af-5a58012196e5',
    },
  })
}

const frameHost: MiniAppHost = {
  ready: () => {
    document.querySelector<HTMLDivElement>('#splash')!.hidden = true
  },
  context: {
    user: {
      fid: 0,
    },
  },
  eip6963RequestProvider: () => {
    announceProvider()
  },
  async composeCast(options) {
    if (options.close) {
      return undefined
    }

    throw new Error('Not supported')
  },
  close() {
    document.querySelector<HTMLDivElement>('#splash')!.hidden = false
  },
  updateBackState(state) {
    const btn = document.querySelector<HTMLButtonElement>('#back')
    if (state.visible) {
      btn!.hidden = false
      btn!.onclick = () => {
        endpoint.emit({ event: 'back_navigation_triggered' })
      }
    } else {
      btn!.hidden = true
    }
  },
} as MiniAppHost

const { endpoint } = exposeToIframe({
  iframe: document.querySelector<HTMLIFrameElement>('#iframe')!,
  sdk: frameHost,
  ethProvider: window.ethereum,
  miniAppOrigin: window.origin,
})
