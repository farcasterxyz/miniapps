import { sdk } from '@farcaster/frame-sdk'
import { createStore } from 'mipd'

const store = createStore()

let providers = store.getProviders()
store.subscribe((providerDetails) => {
  providers = providerDetails
  console.debug('updated providers', providers)
})

setTimeout(() => {
  sdk.actions.ready()

  sdk.setShareStateProvider(() => {
    return {
      path: 'https://www.youtube.com/watch',
      params: 'v=dQw4w9WgXcQ',
    }
  })

  Promise.race([sdk.context])
    .then((ctx) => {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(ctx)
    })
    .catch((e) => {
      console.warn(e.message)
    })

  document.querySelector<HTMLDivElement>('#sign')!.onclick = () => {
    sdk.wallet.ethProvider
      .request({ method: 'eth_requestAccounts' })
      .then((addresses) => {
        return sdk.wallet.ethProvider.request({
          method: 'personal_sign',
          params: [
            '0x48656c6c6f2066726f6d2056616e696c6c61204672616d65',
            addresses[0],
          ],
        })
      })
      .then((signature) => {
        alert('You signed:\n' + signature)
      })
  }
}, 750)
