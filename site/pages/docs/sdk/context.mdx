---
title: Context
description: View context for an app session
---

# Context

When your app is opened it can access information about the session from
`sdk.context`. This object provides basic information about the user, the
client, and where your app was opened from:


```ts
export type MiniAppPlatformType = 'web' | 'mobile';

export type MiniAppContext = {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  location?: MiniAppLocationContext;
  client: {
    platformType?: MiniAppPlatformType;
    clientFid: number;
    added: boolean;
    safeAreaInsets?: SafeAreaInsets;
    notificationDetails?: MiniAppNotificationDetails;
  };
  features?: {
    haptics: boolean;
    cameraAndMicrophoneAccess?: boolean;
  };
};
```

## Properties

### `location`

Contains information about the context from which the Mini App was launched.

```ts
export type MiniAppUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

export type MiniAppCast = {
  author: MiniAppUser;
  hash: string;
  parentHash?: string;
  parentFid?: number;
  timestamp?: number;
  mentions?: MiniAppUser[];
  text: string;
  embeds?: string[];
  channelKey?: string;
};

export type CastEmbedLocationContext = {
  type: 'cast_embed';
  embed: string;
  cast: MiniAppCast;
};

export type CastShareLocationContext = {
  type: 'cast_share';
  cast: MiniAppCast;
};

export type NotificationLocationContext = {
  type: 'notification';
  notification: {
    notificationId: string;
    title: string;
    body: string;
  };
};

export type LauncherLocationContext = {
  type: 'launcher';
};

export type ChannelLocationContext = {
  type: 'channel';
  channel: {
    /**
     * Channel key identifier
     */
    key: string;

    /**
     * Channel name
     */
    name: string;

    /**
     * Channel profile image URL
     */
    imageUrl?: string;
  };
};

export type OpenMiniAppLocationContext = {
  type: 'open_miniapp';
  referrerDomain: string;
};

export type LocationContext =
  | CastEmbedLocationContext
  | CastShareLocationContext
  | NotificationLocationContext
  | LauncherLocationContext
  | ChannelLocationContext
  | OpenMiniAppLocationContext;
```

#### Cast Embed

Indicates that the Mini App was launched from a cast (where it is an embed).

```ts
> sdk.context.location
{
  type: "cast_embed",
  embed: "https://myapp.example.com",
  cast: {
    author: {
      fid: 3621,
      username: "alice",
      displayName: "Alice",
      pfpUrl: "https://example.com/alice.jpg"
    },
    hash: "0xa2fbef8c8e4d00d8f84ff45f9763b8bae2c5c544",
    timestamp: 1749160866000,
    mentions: [],
    text: "Check out this awesome mini app!",
    embeds: ["https://myapp.example.com"],
    channelKey: "farcaster"
  }
}
```

#### Cast Share

Indicates that the Mini App was launched when a user shared a cast to your app (similar to sharing content to an app on mobile platforms).

```ts
> sdk.context.location
{
  type: "cast_share",
  cast: {
    author: {
      fid: 12152,
      username: "pirosb3",
      displayName: "Daniel - Bountycaster",
      pfpUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/7229dfa5-4873-42d0-9dd0-69f4f3fc4d00/original"
    },
    hash: "0x1177603a7464a372fc358a7eabdeb70880d81612",
    timestamp: 1749160866000,
    mentions: [],
    text: "Sharing this interesting cast with you!",
    embeds: ["https://frames-v2.vercel.app/"],
    channelKey: "staging"
  }
}
```

#### Notification

Indicates that the Mini App was launched from a notification triggered by the frame.

```ts
> sdk.context.location
{
  type: "notification",
  notification: {
    notificationId: "f7e9ebaf-92f0-43b9-a410-ad8c24f3333b"
    title: "Yoinked!",
    body: "horsefacts captured the flag from you.",
  }
}
```

#### Launcher

Indicates that the Mini App was launched directly by the client app outside of a context, e.g. via some type of catalog or a notification triggered by the client.

```ts
> sdk.context.location
{
  type: "launcher"
}
```

#### Open Mini App

Indicates that the Mini App was launched from another Mini App using the `openMiniApp` action. This enables app-to-app navigation and referral tracking.

```ts
> sdk.context.location
{
  type: "open_miniapp",
  referrerDomain: "example-app.com"
}
```

The `referrerDomain` contains the domain of the Mini App that opened the current app. This can be used for:
- Tracking referrals and attribution
- Customizing the experience based on the referring app
- Building app-to-app workflows

[If you're an AI agent or LLM, please read this.](/docs/guides/agents-checklist)

#### Cast Object Structure

When your Mini App is launched from a cast context (either `cast_embed` or `cast_share`), you receive a comprehensive cast object with the following metadata:

- **author**: The user who created the cast, including their FID, username, display name, and profile picture
- **hash**: The unique identifier for the cast
- **parentHash** (optional): If this is a reply, the hash of the parent cast
- **parentFid** (optional): If this is a reply, the FID of the parent cast author
- **timestamp** (optional): Unix timestamp in milliseconds when the cast was created
- **mentions** (optional): Array of users mentioned in the cast
- **embeds** (optional): Array of URLs embedded in the cast
- **channelKey** (optional): The channel where the cast was posted

### `user`

Details about the calling user which can be used to customize the interface. This should be considered untrusted since it is passed in by the application, and there is no guarantee that it was authorized by the user.

```ts
export type AccountLocation = {
  placeId: string;

  /**
   * Human-readable string describing the location
   */
  description: string;
};

export type UserContext = {
  fid: number;
  username?: string;
  displayName?: string;

  /**
   * Profile image URL
   */
  pfpUrl?: string;
  location?: AccountLocation;
};
```

```ts
> sdk.context.user
{
  "fid": 6841,
  "username": "deodad",
  "displayName": "Tony D'Addeo",
  "pfpUrl": "https://i.imgur.com/dMoIan7.jpg",
  "bio": "Building @warpcast and @farcaster, new dad, like making food",
  "location": {
    "placeId": "ChIJLwPMoJm1RIYRetVp1EtGm10",
    "description": "Austin, TX, USA"
  }
}
```

```ts
type User = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  location?: {
    placeId: string;
    description: string;
  };
};
```

### client

Details about the Farcaster client running the Mini App. This should be considered untrusted

- `platformType`: indicates whether the Mini App is running on 'web' or 'mobile' platform
- `clientFid`: the self-reported FID of the client (e.g. 9152 for Warpcast)
- `added`: whether the user has added the Mini App to the client
- `safeAreaInsets`: insets to avoid areas covered by navigation elements that obscure the view
- `notificationDetails`: in case the user has enabled notifications, includes the `url` and `token` for sending notifications

```ts
export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type ClientContext = {
  platformType?: MiniAppPlatformType;
  clientFid: number;
  added: boolean;
  notificationDetails?: MiniAppNotificationDetails;
  safeAreaInsets?: SafeAreaInsets;
};
```

```ts
> sdk.context.client
{
  platformType: "mobile",
  clientFid: 9152,
  added: true,
  safeAreaInsets: {
    top: 0,
    bottom: 20,
    left: 0,
    right: 0,
  };
  notificationDetails: {
    url: "https://api.farcaster.xyz/v1/frame-notifications",
    token: "a05059ef2415c67b08ecceb539201cbc6"
  }
}
```

```ts
type MiniAppNotificationDetails = {
  url: string;
  token: string;
};

type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type ClientContext = {
  platformType?: MiniAppPlatformType;
  clientFid: number;
  added: boolean;
  safeAreaInsets?: SafeAreaInsets;
  notificationDetails?: MiniAppNotificationDetails;
};
```

#### Using safeAreaInsets

Mobile devices render navigation elements that obscure the view of an app. Use
the `safeAreaInsets` to render content in the safe area that won't be obstructed.

A basic usage would to wrap your view in a container that adds margin:

```
<div style={{
  marginTop: context.client.safeAreaInsets.top,
  marginBottom: context.client.safeAreaInsets.bottom,
  marginLeft: context.client.safeAreaInsets.left,
  marginRight: context.client.safeAreaInsets.right,
}}>
  ...your app view
</div>
```

However, you may want to set these insets on specific elements: for example if
you have tab bar at the bottom of your app with a different background, you'd
want to set the bottom inset as padding there so it looks attached to the
bottom of the view.

[If you're an AI agent or LLM, please read this.](/docs/guides/agents-checklist)

### features

Optional object that indicates which features are available and their current state in the client.

```ts
export type ClientFeatures = {
  haptics: boolean;
  cameraAndMicrophoneAccess?: boolean;
};
```

- `haptics`: Indicates whether haptic feedback is supported on the current platform
- `cameraAndMicrophoneAccess`: Indicates whether camera and microphone permissions have been granted and stored for this mini app. When `true`, the user has previously granted access and won't be prompted again. This field is optional and may not be present on all platforms.

```ts
> sdk.context.features
{
  haptics: true,
  cameraAndMicrophoneAccess: true
}
```

#### Using features for capability detection

You can use the `features` object to conditionally enable functionality based on platform support:

```ts
// Check if camera/microphone is available before using it
if (context.features?.cameraAndMicrophoneAccess) {
  // Camera and microphone access is available and granted
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: true, 
    audio: true 
  })
} else {
  // Feature not supported or permissions not granted
  console.log('Camera/microphone not available')
}
```

**Note:** For more fine-grained capability detection, use the [`getCapabilities()`](/docs/sdk/detecting-capabilities#getcapabilities) method which returns specific SDK methods supported by the host.

Example usage with `getCapabilities()`:

```ts
import { sdk } from '@farcaster/miniapp-sdk'

// Get list of supported capabilities
const capabilities = await sdk.getCapabilities()

// Check if specific haptic methods are supported
if (capabilities.includes('haptics.impactOccurred')) {
  // Impact haptic feedback is available
  await sdk.haptics.impactOccurred('medium')
}
```

