import {
  AddFrame,
  type FrameClientEvent,
  SignIn,
  type SolanaRequestFn,
  createSolanaWalletProvider,
} from '@farcaster/frame-core'
import { EventEmitter } from 'eventemitter3'
import { frameHost } from './frameHost'
import { provider } from './provider'
import type { Emitter, EventMap, FrameSDK } from './types'

export function createEmitter(): Emitter {
  const emitter = new EventEmitter<EventMap>()

  return {
    get eventNames() {
      return emitter.eventNames.bind(emitter)
    },
    get listenerCount() {
      return emitter.listenerCount.bind(emitter)
    },
    get listeners() {
      return emitter.listeners.bind(emitter)
    },
    addListener: emitter.addListener.bind(emitter),
    emit: emitter.emit.bind(emitter),
    off: emitter.off.bind(emitter),
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
  }
}

const emitter = createEmitter()
let cachedIsInMiniAppResult: boolean | null = null

/**
 * Determines if the current environment is a MiniApp context.
 *
 * @param timeoutMs - Optional timeout in milliseconds (default: 50)
 * @returns Promise resolving to boolean indicating if in MiniApp context
 */
async function isInMiniApp(timeoutMs = 50): Promise<boolean> {
  // Return cached result if we've already determined we are in a MiniApp
  if (cachedIsInMiniAppResult === true) {
    return true
  }

  // Check for SSR environment - definitely not a MiniApp
  if (typeof window === 'undefined') {
    return false
  }

  // Short-circuit: definitely NOT a MiniApp
  if (!window.ReactNativeWebView && window === window.parent) {
    return false
  }

  // At this point, we MIGHT be in a MiniApp (iframe or RN WebView)
  // but need to verify by checking for context communication.
  const isInMiniApp = await Promise.race([
    frameHost.context.then((context) => !!context), // Check if context resolves to truthy
    new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false), timeoutMs) // Timeout resolves to false
    }),
  ]).catch(() => {
    return false
  })

  // Cache the result ONLY if true (we are confirmed to be in a MiniApp)
  if (isInMiniApp) {
    cachedIsInMiniAppResult = true
  }

  return isInMiniApp
}

export const sdk: FrameSDK = {
  ...emitter,
  isInMiniApp,
  context: frameHost.context,
  actions: {
    setPrimaryButton: frameHost.setPrimaryButton.bind(frameHost),
    ready: frameHost.ready.bind(frameHost),
    close: frameHost.close.bind(frameHost),
    viewProfile: frameHost.viewProfile.bind(frameHost),
    signIn: async (options) => {
      const response = await frameHost.signIn(options)
      if (response.result) {
        return response.result
      }

      if (response.error.type === 'rejected_by_user') {
        throw new SignIn.RejectedByUser()
      }

      throw new Error('Unreachable')
    },
    openUrl: (urlArg: string | { url: string }) => {
      const url = typeof urlArg === 'string' ? urlArg : urlArg.url
      return frameHost.openUrl(url.trim())
    },
    addFrame: async () => {
      const response = await frameHost.addFrame()
      if (response.result) {
        return response.result
      }

      if (response.error.type === 'invalid_domain_manifest') {
        throw new AddFrame.InvalidDomainManifest()
      }

      if (response.error.type === 'rejected_by_user') {
        throw new AddFrame.RejectedByUser()
      }

      throw new Error('Unreachable')
    },
    composeCast(options = {}) {
      return frameHost.composeCast(options) as never
    },
  },
  experimental: {
    viewToken: frameHost.viewToken.bind(frameHost),
    sendToken: frameHost.sendToken.bind(frameHost),
    swapToken: frameHost.swapToken.bind(frameHost),
    solanaProvider: frameHost.solanaProviderRequest
      ? createSolanaWalletProvider(
          frameHost.solanaProviderRequest as unknown as SolanaRequestFn,
        )
      : undefined,
  },
  wallet: {
    ethProvider: provider,
  },
}

// Required to pass SSR
if (typeof document !== 'undefined') {
  // react native webview events
  document.addEventListener('FarcasterFrameEvent', (event) => {
    if (event instanceof MessageEvent) {
      const frameEvent = event.data as FrameClientEvent
      if (frameEvent.event === 'primary_button_clicked') {
        emitter.emit('primaryButtonClicked')
      } else if (frameEvent.event === 'frame_added') {
        emitter.emit('frameAdded', {
          notificationDetails: frameEvent.notificationDetails,
        })
      } else if (frameEvent.event === 'frame_add_rejected') {
        emitter.emit('frameAddRejected', { reason: frameEvent.reason })
      } else if (frameEvent.event === 'frame_removed') {
        emitter.emit('frameRemoved')
      } else if (frameEvent.event === 'notifications_enabled') {
        emitter.emit('notificationsEnabled', {
          notificationDetails: frameEvent.notificationDetails,
        })
      } else if (frameEvent.event === 'notifications_disabled') {
        emitter.emit('notificationsDisabled')
      }
    }
  })
}

// Required to pass SSR
if (typeof window !== 'undefined') {
  // web events
  window.addEventListener('message', (event) => {
    if (event instanceof MessageEvent) {
      if (event.data.type === 'frameEvent') {
        const frameEvent = event.data.event as FrameClientEvent
        if (frameEvent.event === 'primary_button_clicked') {
          emitter.emit('primaryButtonClicked')
        } else if (frameEvent.event === 'frame_added') {
          emitter.emit('frameAdded', {
            notificationDetails: frameEvent.notificationDetails,
          })
        } else if (frameEvent.event === 'frame_add_rejected') {
          emitter.emit('frameAddRejected', { reason: frameEvent.reason })
        } else if (frameEvent.event === 'frame_removed') {
          emitter.emit('frameRemoved')
        } else if (frameEvent.event === 'notifications_enabled') {
          emitter.emit('notificationsEnabled', {
            notificationDetails: frameEvent.notificationDetails,
          })
        } else if (frameEvent.event === 'notifications_disabled') {
          emitter.emit('notificationsDisabled')
        }
      }
    }
  })
}
