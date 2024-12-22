import type { EventEmitter } from "eventemitter3";
import type { Provider } from "ox";
import type {
  FrameContext,
  AddFrame,
  ReadyOptions,
  SignIn,
  FrameNotificationDetails,
  AddFrameRejectedReason,
} from "@farcaster/frame-core";

declare global {
  interface Window {
    // Exposed by react-native-webview
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}

/** Combines members of an intersection into a readable type. */
// https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=v01xkqU3KO0Mg
export type Compute<type> = { [key in keyof type]: type[key] } & unknown;

export type EventMap = {
  primaryButtonClicked: () => void;
  frameAdded: ({
    notificationDetails,
  }: {
    notificationDetails?: FrameNotificationDetails;
  }) => void;
  frameAddRejected: ({ reason }: { reason: AddFrameRejectedReason }) => void;
  frameRemoved: () => void;
  notificationsEnabled: ({
    notificationDetails,
  }: {
    notificationDetails: FrameNotificationDetails;
  }) => void;
  notificationsDisabled: () => void;
};

export type Emitter = Compute<EventEmitter<EventMap>>;

export type SetPrimaryButton = (options: {
  text: string;
  loading?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}) => Promise<void>;

export type FrameSDK = {
  context: Promise<FrameContext>;
  actions: {
    ready: (options?: Partial<ReadyOptions>) => Promise<void>;
    openUrl: (url: string) => Promise<void>;
    signIn: SignIn.SignIn;
    close: () => Promise<void>;
    setPrimaryButton: SetPrimaryButton;
    addFrame: AddFrame;
  };
  wallet: {
    ethProvider: Provider.Provider;
  };
} & Emitter;
