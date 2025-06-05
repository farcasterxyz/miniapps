import type {
  AddMiniApp,
  ComposeCast,
  Context,
  FrameNotificationDetails,
  GetCapabilities,
  GetChains,
  ImpactOccurred,
  NotificationOccurred,
  Ready,
  SelectionChanged,
  SendToken,
  SetPrimaryButtonOptions,
  SignIn,
  SolanaWalletProvider,
  SwapToken,
  ViewCast,
  ViewProfile,
  ViewToken,
} from '@farcaster/frame-core'
import type { EventEmitter } from 'eventemitter3'
import type * as Provider from 'ox/Provider'
import type { Back } from './back.ts'

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
  frameAdded: ({
    notificationDetails,
  }: {
    notificationDetails?: FrameNotificationDetails
  }) => void
  frameAddRejected: ({
    reason,
  }: { reason: AddMiniApp.AddMiniAppRejectedReason }) => void
  frameRemoved: () => void
  notificationsEnabled: ({
    notificationDetails,
  }: {
    notificationDetails: FrameNotificationDetails
  }) => void
  notificationsDisabled: () => void
  backNavigationTriggered: () => void
}

export type Emitter = Compute<EventEmitter<EventMap>>

type SetPrimaryButton = (options: SetPrimaryButtonOptions) => Promise<void>
type QuickAuth = (options?: {
  /**
   * Use a custom Quick Auth server, otherwise defaults to the public
   * instance provided by Farcaster.
   *
   * @default https://auth.farcaster.xyz
   */
  quickAuthServerOrigin?: string
}) => Promise<{
  token: string
}>

export type FrameSDK = {
  getCapabilities: GetCapabilities
  getChains: GetChains
  isInMiniApp: () => Promise<boolean>
  context: Promise<Context.FrameContext>
  back: Back
  actions: {
    ready: (options?: Partial<Ready.ReadyOptions>) => Promise<void>
    openUrl: (url: string) => Promise<void>
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
    quickAuth: QuickAuth
  }
  experimental: {
    getSolanaProvider: () => Promise<SolanaWalletProvider | undefined>

    /**
     * @deprecated - use `sdk.actions.quickAuth`
     */
    quickAuth: QuickAuth
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
