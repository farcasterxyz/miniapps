import type {
  ImpactOccurred,
  NotificationOccurred,
  SelectionChanged,
} from './actions/Haptics.ts'
import type {
  AddMiniApp,
  ComposeCast,
  OpenMiniApp,
  Ready,
  RequestCameraAndMicrophoneAccess,
  SendToken,
  SignIn,
  SignManifest,
  SwapToken,
  ViewCast,
  ViewProfile,
  ViewToken,
} from './actions/index.ts'
import type { UpdateBackState } from './back.ts'
import type { MiniAppContext } from './context.ts'
import type {
  EventMiniAppAdded,
  EventMiniAppRemoved,
  EventNotificationsDisabled,
  EventNotificationsEnabled,
} from './schemas/index.ts'
import type { SolanaRequestFn, SolanaWireRequestFn } from './solana.ts'
import type { Ethereum } from './wallet/index.ts'

export type SetPrimaryButtonOptions = {
  text: string
  loading?: boolean
  disabled?: boolean
  hidden?: boolean
}

export { DEFAULT_READY_OPTIONS, ReadyOptions } from './actions/Ready.ts'
// start backwards compat, remove in 1.0
export * from './wallet/ethereum.ts'
export type SignInOptions = SignIn.SignInOptions
// end backwards compat

export type SetPrimaryButton = (options: SetPrimaryButtonOptions) => void

// Export haptics types
export type { ImpactOccurred, NotificationOccurred, SelectionChanged }

export const miniAppHostCapabilityList = [
  'wallet.getEthereumProvider',
  'wallet.getSolanaProvider',
  'actions.ready',
  'actions.openUrl',
  'actions.close',
  'actions.setPrimaryButton',
  'actions.addMiniApp',
  'actions.signIn',
  'actions.viewCast',
  'actions.viewProfile',
  'actions.composeCast',
  'actions.viewToken',
  'actions.sendToken',
  'actions.swapToken',
  'actions.openMiniApp',
  'actions.requestCameraAndMicrophoneAccess',
  'experimental.signManifest',
  'haptics.impactOccurred',
  'haptics.notificationOccurred',
  'haptics.selectionChanged',
  'back',
] as const

export type MiniAppHostCapability = (typeof miniAppHostCapabilityList)[number]

export type GetCapabilities = () => Promise<MiniAppHostCapability[]>

// Returns a list of CAIP-2 identifiers
export type GetChains = () => Promise<string[]>

export type WireMiniAppHost = {
  context: MiniAppContext
  close: () => void
  ready: Ready.Ready
  openUrl: (url: string) => void
  signIn: SignIn.WireSignIn
  signManifest: SignManifest.WireSignManifest
  setPrimaryButton: SetPrimaryButton
  ethProviderRequest: Ethereum.EthProvideRequest
  ethProviderRequestV2: Ethereum.RpcTransport
  eip6963RequestProvider: () => void
  solanaProviderRequest?: SolanaWireRequestFn
  addFrame: AddMiniApp.WireAddMiniApp
  addMiniApp: AddMiniApp.WireAddMiniApp
  viewCast: ViewCast.ViewCast
  viewProfile: ViewProfile.ViewProfile
  viewToken: ViewToken.ViewToken
  sendToken: SendToken.SendToken
  swapToken: SwapToken.SwapToken
  openMiniApp: OpenMiniApp.OpenMiniApp
  composeCast: <close extends boolean | undefined = undefined>(
    options: ComposeCast.Options<close>,
  ) => Promise<ComposeCast.Result<close>>
  requestCameraAndMicrophoneAccess: RequestCameraAndMicrophoneAccess.RequestCameraAndMicrophoneAccess
  impactOccurred: ImpactOccurred
  notificationOccurred: NotificationOccurred
  selectionChanged: SelectionChanged
  getCapabilities: GetCapabilities
  getChains: GetChains
  updateBackState: UpdateBackState
}

export type MiniAppHost = {
  context: MiniAppContext
  close: () => void
  ready: Ready.Ready
  openUrl: (url: string) => void
  signIn: SignIn.SignIn
  signManifest: SignManifest.SignManifest
  setPrimaryButton: SetPrimaryButton
  ethProviderRequest: Ethereum.EthProvideRequest
  ethProviderRequestV2: Ethereum.RpcTransport
  /**
   * Receive forwarded eip6963:requestProvider events from the frame document.
   * Hosts must emit an EventEip6963AnnounceProvider in response.
   */
  eip6963RequestProvider: () => void
  solanaProviderRequest?: SolanaRequestFn
  addFrame: AddMiniApp.AddMiniApp
  addMiniApp: AddMiniApp.AddMiniApp
  viewCast: ViewCast.ViewCast
  viewProfile: ViewProfile.ViewProfile
  viewToken: ViewToken.ViewToken
  sendToken: SendToken.SendToken
  swapToken: SwapToken.SwapToken
  openMiniApp: OpenMiniApp.OpenMiniApp
  composeCast: <close extends boolean | undefined = undefined>(
    options: ComposeCast.Options<close>,
  ) => Promise<ComposeCast.Result<close>>
  requestCameraAndMicrophoneAccess: RequestCameraAndMicrophoneAccess.RequestCameraAndMicrophoneAccess
  impactOccurred: ImpactOccurred
  notificationOccurred: NotificationOccurred
  selectionChanged: SelectionChanged
  getCapabilities: GetCapabilities
  getChains: GetChains
  updateBackState: UpdateBackState
}

export type EventMiniAppAddRejected = {
  event: 'miniapp_add_rejected'
  reason: AddMiniApp.AddMiniAppRejectedReason
}

export type EventPrimaryButtonClicked = {
  event: 'primary_button_clicked'
}

export type EventBackNavigationTriggered = {
  event: 'back_navigation_triggered'
}

export type MiniAppClientEvent =
  | EventMiniAppAdded
  | EventMiniAppAddRejected
  | EventMiniAppRemoved
  | EventNotificationsEnabled
  | EventNotificationsDisabled
  | EventPrimaryButtonClicked
  | EventBackNavigationTriggered
  | Ethereum.EventEip6963AnnounceProvider
