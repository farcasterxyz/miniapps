import type { ImpactOccurred, NotificationOccurred, SelectionChanged } from './actions/Haptics.ts';
import type { AddMiniApp, ComposeCast, Ready, SendToken, SignIn, SwapToken, ViewCast, ViewProfile, ViewToken } from './actions/index.ts';
import type { UpdateBackState } from './back.ts';
import type { MiniAppContext } from './context.ts';
import type { EventFrameAdded, EventFrameRemoved, EventMiniAppAdded, EventMiniAppRemoved, EventNotificationsDisabled, EventNotificationsEnabled } from './schemas/index.ts';
import type { SolanaRequestFn, SolanaWireRequestFn } from './solana.ts';
import type { Ethereum } from './wallet/index.ts';
export type SetPrimaryButtonOptions = {
    text: string;
    loading?: boolean;
    disabled?: boolean;
    hidden?: boolean;
};
export * from './wallet/ethereum.ts';
export { DEFAULT_READY_OPTIONS, ReadyOptions } from './actions/Ready.ts';
export type SignInOptions = SignIn.SignInOptions;
export type SetPrimaryButton = (options: SetPrimaryButtonOptions) => void;
export type { ImpactOccurred, NotificationOccurred, SelectionChanged };
export declare const miniAppHostCapabilityList: readonly ["wallet.getEthereumProvider", "wallet.getSolanaProvider", "actions.ready", "actions.openUrl", "actions.close", "actions.setPrimaryButton", "actions.addMiniApp", "actions.signIn", "actions.viewCast", "actions.viewProfile", "actions.composeCast", "actions.viewToken", "actions.sendToken", "actions.swapToken", "haptics.impactOccurred", "haptics.notificationOccurred", "haptics.selectionChanged", "back"];
export type MiniAppHostCapability = (typeof miniAppHostCapabilityList)[number];
export type GetCapabilities = () => Promise<MiniAppHostCapability[]>;
export type GetChains = () => Promise<string[]>;
export type WireMiniAppHost = {
    context: MiniAppContext;
    close: () => void;
    ready: Ready.Ready;
    openUrl: (url: string) => void;
    signIn: SignIn.WireSignIn;
    setPrimaryButton: SetPrimaryButton;
    ethProviderRequest: Ethereum.EthProvideRequest;
    ethProviderRequestV2: Ethereum.RpcTransport;
    eip6963RequestProvider: () => void;
    solanaProviderRequest?: SolanaWireRequestFn;
    addMiniApp: AddMiniApp.WireAddMiniApp;
    viewCast: ViewCast.ViewCast;
    viewProfile: ViewProfile.ViewProfile;
    viewToken: ViewToken.ViewToken;
    sendToken: SendToken.SendToken;
    swapToken: SwapToken.SwapToken;
    composeCast: <close extends boolean | undefined = undefined>(options: ComposeCast.Options<close>) => Promise<ComposeCast.Result<close>>;
    impactOccurred: ImpactOccurred;
    notificationOccurred: NotificationOccurred;
    selectionChanged: SelectionChanged;
    getCapabilities: GetCapabilities;
    getChains: GetChains;
    updateBackState: UpdateBackState;
};
export type MiniAppHost = {
    context: MiniAppContext;
    close: () => void;
    ready: Ready.Ready;
    openUrl: (url: string) => void;
    signIn: SignIn.SignIn;
    setPrimaryButton: SetPrimaryButton;
    ethProviderRequest: Ethereum.EthProvideRequest;
    ethProviderRequestV2: Ethereum.RpcTransport;
    /**
     * Receive forwarded eip6963:requestProvider events from the frame document.
     * Hosts must emit an EventEip6963AnnounceProvider in response.
     */
    eip6963RequestProvider: () => void;
    solanaProviderRequest?: SolanaRequestFn;
    addMiniApp: AddMiniApp.AddMiniApp;
    viewCast: ViewCast.ViewCast;
    viewProfile: ViewProfile.ViewProfile;
    viewToken: ViewToken.ViewToken;
    sendToken: SendToken.SendToken;
    swapToken: SwapToken.SwapToken;
    composeCast: <close extends boolean | undefined = undefined>(options: ComposeCast.Options<close>) => Promise<ComposeCast.Result<close>>;
    impactOccurred: ImpactOccurred;
    notificationOccurred: NotificationOccurred;
    selectionChanged: SelectionChanged;
    getCapabilities: GetCapabilities;
    getChains: GetChains;
    updateBackState: UpdateBackState;
};
export type EventFrameAddRejected = {
    event: 'frame_add_rejected';
    reason: AddMiniApp.AddMiniAppRejectedReason;
};
export type EventMiniAppAddRejected = {
    event: 'miniapp_add_rejected';
    reason: AddMiniApp.AddMiniAppRejectedReason;
};
export type EventPrimaryButtonClicked = {
    event: 'primary_button_clicked';
};
export type EventBackNavigationTriggered = {
    event: 'back_navigation_triggered';
};
export type MiniAppClientEvent = EventMiniAppAdded | EventMiniAppAddRejected | EventMiniAppRemoved | EventNotificationsEnabled | EventNotificationsDisabled | EventPrimaryButtonClicked | EventBackNavigationTriggered | Ethereum.EventEip6963AnnounceProvider | EventFrameAdded | EventFrameAddRejected | EventFrameRemoved;
