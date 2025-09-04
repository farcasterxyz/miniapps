import type {
  AddMiniApp,
  ComposeCast,
  Context,
  GetCapabilities,
  GetChains,
  ImpactOccurred,
  MiniAppNotificationDetails,
  NotificationOccurred,
  OpenMiniApp,
  Ready,
  RequestCameraAndMicrophoneAccess,
  SelectionChanged,
  SendToken,
  SetPrimaryButtonOptions,
  SignIn,
  SignManifest,
  SolanaWalletProvider,
  SwapToken,
  ViewCast,
  ViewProfile,
  ViewToken,
} from '@farcaster/miniapp-core'
import type { EventEmitter } from 'eventemitter3'
import type * as Provider from 'ox/Provider'
import type { Back } from './back.ts'
import type { QuickAuth } from './quickAuth.ts'

declare global {
  interface Window {
    // Exposed by react-native-webview
    ReactNativeWebView: {
      postMessage: (message: string) => void
    }
  }
}

/** Combines members of an intersection into a readable type. */
// https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=v01xkqU3KO0Mg
type Compute<type> = { [key in keyof type]: type[key] } & unknown

export type EventMap = {
  primaryButtonClicked: () => void
  miniAppAdded: ({
    notificationDetails,
  }: {
    notificationDetails?: MiniAppNotificationDetails
  }) => void
  miniAppAddRejected: ({
    reason,
  }: {
    reason: AddMiniApp.AddMiniAppRejectedReason
  }) => void
  miniAppRemoved: () => void
  notificationsEnabled: ({
    notificationDetails,
  }: {
    notificationDetails: MiniAppNotificationDetails
  }) => void
  notificationsDisabled: () => void
  backNavigationTriggered: () => void
}

export type Emitter = Compute<EventEmitter<EventMap>>

type SetPrimaryButton = (options: SetPrimaryButtonOptions) => Promise<void>

export type MiniAppSDK = {
  getCapabilities: GetCapabilities
  getChains: GetChains
  isInMiniApp: () => Promise<boolean>
  context: Promise<Context.MiniAppContext>
  back: Back
  quickAuth: QuickAuth
  actions: {
    ready: (options?: Partial<Ready.ReadyOptions>) => Promise<void>
    openUrl: (url: string | { url: string }) => Promise<void>
    close: () => Promise<void>
    setPrimaryButton: SetPrimaryButton
    // Deprecated in favor of addMiniApp
    addFrame: AddMiniApp.AddMiniApp
    addMiniApp: AddMiniApp.AddMiniApp
    signIn: SignIn.SignIn
    viewCast: ViewCast.ViewCast
    viewProfile: ViewProfile.ViewProfile
    composeCast: <close extends boolean | undefined = undefined>(
      options?: ComposeCast.Options<close>,
    ) => Promise<ComposeCast.Result<close>>
    viewToken: ViewToken.ViewToken
    sendToken: SendToken.SendToken
    swapToken: SwapToken.SwapToken
    openMiniApp: OpenMiniApp.OpenMiniApp
    requestCameraAndMicrophoneAccess: RequestCameraAndMicrophoneAccess.RequestCameraAndMicrophoneAccess
  }
  experimental: {
    getSolanaProvider: () => Promise<SolanaWalletProvider | undefined>
    signManifest: SignManifest.SignManifest

    /**
     * @deprecated - use `sdk.quickAuth.getToken`
     */
    quickAuth: QuickAuth['getToken']
  }
  wallet: {
    // Deprecated in favor of getEthereumProvider
    ethProvider: Provider.Provider
    getEthereumProvider: () => Promise<Provider.Provider | undefined>
    getSolanaProvider: () => Promise<SolanaWalletProvider | undefined>
  }
  haptics: {
    impactOccurred: ImpactOccurred
    notificationOccurred: NotificationOccurred
    selectionChanged: SelectionChanged
  }
} & Emitter
