import type {
  AddMiniApp,
  ComposeCast,
  Haptics,
  Ready,
  SendToken,
  SignIn,
  SwapToken,
  ViewCast,
  ViewProfile,
  ViewToken,
} from './actions/index.ts'
import type { FrameContext } from './context.ts'
import type {
  EventFrameAdded,
  EventFrameRemoved,
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

// start backwards compat, remove in 1.0
export * from './wallet/ethereum.ts'
export { DEFAULT_READY_OPTIONS, ReadyOptions } from './actions/Ready.ts'
export type SignInOptions = SignIn.SignInOptions
// end backwards compat

export type SetPrimaryButton = (options: SetPrimaryButtonOptions) => void

export const miniAppHostCapabilityList: [string, ...string[]] = [
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
  'actions.haptics.impactOccurred',
  'actions.haptics.notificationOccurred',
  'actions.haptics.selectionChanged',
]

export type MiniAppHostCapability =
  | 'wallet.getEthereumProvider'
  | 'wallet.getSolanaProvider'
  | 'actions.ready'
  | 'actions.openUrl'
  | 'actions.close'
  | 'actions.setPrimaryButton'
  | 'actions.addMiniApp'
  | 'actions.signIn'
  | 'actions.viewCast'
  | 'actions.viewProfile'
  | 'actions.composeCast'
  | 'actions.viewToken'
  | 'actions.sendToken'
  | 'actions.swapToken'
  | 'actions.haptics.impactOccurred'
  | 'actions.haptics.notificationOccurred'
  | 'actions.haptics.selectionChanged'

export type GetCapabilities = () => Promise<MiniAppHostCapability[]>

// Returns a list of CAIP-2 identifiers
export type GetChains = () => Promise<string[]>

export type WireFrameHost = {
  context: FrameContext
  close: () => void
  ready: Ready.Ready
  openUrl: (url: string) => void
  signIn: SignIn.WireSignIn
  setPrimaryButton: SetPrimaryButton
  ethProviderRequest: Ethereum.EthProvideRequest
  ethProviderRequestV2: Ethereum.RpcTransport
  eip6963RequestProvider: () => void
  solanaProviderRequest?: SolanaWireRequestFn
  addFrame: AddMiniApp.WireAddMiniApp
  viewCast: ViewCast.ViewCast
  viewProfile: ViewProfile.ViewProfile
  viewToken: ViewToken.ViewToken
  sendToken: SendToken.SendToken
  swapToken: SwapToken.SwapToken
  composeCast: <close extends boolean | undefined = undefined>(
    options: ComposeCast.Options<close>,
  ) => Promise<ComposeCast.Result<close>>
  impactOccurred: Haptics.ImpactOccurred
  notificationOccurred: Haptics.NotificationOccurred
  selectionChanged: Haptics.SelectionChanged
  getCapabilities: GetCapabilities
  getChains: GetChains
}

export type FrameHost = {
  context: FrameContext
  close: () => void
  ready: Ready.Ready
  openUrl: (url: string) => void
  signIn: SignIn.SignIn
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
  viewCast: ViewCast.ViewCast
  viewProfile: ViewProfile.ViewProfile
  viewToken: ViewToken.ViewToken
  sendToken: SendToken.SendToken
  swapToken: SwapToken.SwapToken
  composeCast: <close extends boolean | undefined = undefined>(
    options: ComposeCast.Options<close>,
  ) => Promise<ComposeCast.Result<close>>
  impactOccurred: Haptics.ImpactOccurred
  notificationOccurred: Haptics.NotificationOccurred
  selectionChanged: Haptics.SelectionChanged
  getCapabilities: GetCapabilities
  getChains: GetChains
}

export type EventFrameAddRejected = {
  event: 'frame_add_rejected'
  reason: AddMiniApp.AddMiniAppRejectedReason
}

export type EventPrimaryButtonClicked = {
  event: 'primary_button_clicked'
}

export type FrameClientEvent =
  | EventFrameAdded
  | EventFrameAddRejected
  | EventFrameRemoved
  | EventNotificationsEnabled
  | EventNotificationsDisabled
  | EventPrimaryButtonClicked
  | Ethereum.EventEip6963AnnounceProvider
