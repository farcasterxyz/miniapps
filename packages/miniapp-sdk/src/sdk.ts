import {
  AddMiniApp,
  type MiniAppClientEvent,
  SignIn,
  SignManifest,
} from '@farcaster/miniapp-core'
import { createBack } from './back.ts'
import { ethereumProvider, getEthereumProvider } from './ethereumProvider.ts'
import { miniAppHost } from './miniAppHost.ts'
import { quickAuth } from './quickAuth.ts'
import { emitter } from './sdkEmitter.ts'
import { getSolanaProvider } from './solanaProvider.ts'
import type { MiniAppSDK } from './types.ts'

let cachedIsInMiniAppResult: boolean | null = null

/**
 * Determines if the current environment is a MiniApp context.
 *
 * @param timeoutMs - Optional timeout in milliseconds (default: 1000)
 * @returns Promise resolving to boolean indicating if in MiniApp context
 */
async function isInMiniApp(timeoutMs = 1000): Promise<boolean> {
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
    miniAppHost.context.then((context) => !!context), // Check if context resolves to truthy
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

const addMiniApp = async () => {
  // Use the existing message overcomlink for backwards compat until
  // hosts are all upgraded.
  const response = await miniAppHost.addFrame()
  if (response.result) {
    return response.result
  }

  if (response.error.type === 'invalid_domain_manifest') {
    throw new AddMiniApp.InvalidDomainManifest()
  }

  if (response.error.type === 'rejected_by_user') {
    throw new AddMiniApp.RejectedByUser()
  }

  throw new Error('Unreachable')
}

export const sdk: MiniAppSDK = {
  ...emitter,
  getCapabilities: miniAppHost.getCapabilities,
  getChains: miniAppHost.getChains,
  isInMiniApp,
  context: miniAppHost.context,
  back: createBack({ miniAppHost, emitter }),
  quickAuth,
  actions: {
    setPrimaryButton: miniAppHost.setPrimaryButton.bind(miniAppHost),
    ready: async (options = {}) => {
      return await miniAppHost.ready(options)
    },
    close: miniAppHost.close.bind(miniAppHost),
    viewCast: miniAppHost.viewCast.bind(miniAppHost),
    viewProfile: miniAppHost.viewProfile.bind(miniAppHost),
    openMiniApp: miniAppHost.openMiniApp.bind(miniAppHost),
    signIn: async (options) => {
      const response = await miniAppHost.signIn({
        ...options,
        acceptAuthAddress: options.acceptAuthAddress ?? true,
      })
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
      return miniAppHost.openUrl(url.trim())
    },
    addFrame: addMiniApp,
    addMiniApp,
    composeCast(options = {}) {
      return miniAppHost.composeCast(options) as never
    },
    viewToken: miniAppHost.viewToken.bind(miniAppHost),
    sendToken: miniAppHost.sendToken.bind(miniAppHost),
    swapToken: miniAppHost.swapToken.bind(miniAppHost),
    requestCameraAndMicrophoneAccess:
      miniAppHost.requestCameraAndMicrophoneAccess.bind(miniAppHost),
  },
  experimental: {
    getSolanaProvider,
    signManifest: async (options) => {
      const response = await miniAppHost.signManifest(options)
      if (response.result) {
        return response.result
      }

      if (response.error.type === 'rejected_by_user') {
        throw new SignManifest.RejectedByUser()
      }

      if (response.error.type === 'invalid_domain') {
        throw new SignManifest.InvalidDomain()
      }

      if (response.error.type === 'generic_error') {
        throw new SignManifest.GenericError(response.error.message)
      }

      throw new Error('Unreachable')
    },
    quickAuth(options) {
      return quickAuth.getToken(options)
    },
  },
  wallet: {
    ethProvider: ethereumProvider,
    getEthereumProvider,
    getSolanaProvider,
  },
  haptics: {
    impactOccurred: miniAppHost.impactOccurred.bind(miniAppHost),
    notificationOccurred: miniAppHost.notificationOccurred.bind(miniAppHost),
    selectionChanged: miniAppHost.selectionChanged.bind(miniAppHost),
  },
}

// Required to pass SSR
if (typeof document !== 'undefined') {
  // react native webview events
  document.addEventListener('FarcasterFrameEvent', (event) => {
    if (event instanceof MessageEvent) {
      const miniAppEvent = event.data as MiniAppClientEvent
      if (miniAppEvent.event === 'primary_button_clicked') {
        emitter.emit('primaryButtonClicked')
      } else if (miniAppEvent.event === 'miniapp_added') {
        emitter.emit('miniAppAdded', {
          notificationDetails: miniAppEvent.notificationDetails,
        })
      } else if (miniAppEvent.event === 'miniapp_add_rejected') {
        emitter.emit('miniAppAddRejected', { reason: miniAppEvent.reason })
      } else if (miniAppEvent.event === 'miniapp_removed') {
        emitter.emit('miniAppRemoved')
      } else if (miniAppEvent.event === 'notifications_enabled') {
        emitter.emit('notificationsEnabled', {
          notificationDetails: miniAppEvent.notificationDetails,
        })
      } else if (miniAppEvent.event === 'notifications_disabled') {
        emitter.emit('notificationsDisabled')
      } else if (miniAppEvent.event === 'back_navigation_triggered') {
        emitter.emit('backNavigationTriggered')
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
        const miniAppEvent = event.data.event as MiniAppClientEvent
        if (miniAppEvent.event === 'primary_button_clicked') {
          emitter.emit('primaryButtonClicked')
        } else if (miniAppEvent.event === 'miniapp_added') {
          emitter.emit('miniAppAdded', {
            notificationDetails: miniAppEvent.notificationDetails,
          })
        } else if (miniAppEvent.event === 'miniapp_add_rejected') {
          emitter.emit('miniAppAddRejected', { reason: miniAppEvent.reason })
        } else if (miniAppEvent.event === 'miniapp_removed') {
          emitter.emit('miniAppRemoved')
        } else if (miniAppEvent.event === 'notifications_enabled') {
          emitter.emit('notificationsEnabled', {
            notificationDetails: miniAppEvent.notificationDetails,
          })
        } else if (miniAppEvent.event === 'notifications_disabled') {
          emitter.emit('notificationsDisabled')
        } else if (miniAppEvent.event === 'back_navigation_triggered') {
          emitter.emit('backNavigationTriggered')
        }
      }
    }
  })
}
