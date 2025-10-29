---
title: Specification
description: Specification for Farcaster Mini Apps
---

# Specification

A Mini App is a web application that renders inside a Farcaster client.


## Mini App Embed

The primary discovery points for Mini Apps are social feeds. Mini App Embeds
are an OpenGraph-inspired metadata standard that lets any page in a Mini App
be rendered as a rich object that can launch user into an application.

![mini app embed](/embed_schematic.png)

### Versioning

Mini App Embeds will follow a simple versioning scheme where non-breaking
changes can be added to the same version but a breaking change must accompany a
version bump.

### Metatags

A Mini App URL must have a MiniAppEmbed in a serialized form in the `fc:miniapp` meta tag in the HTML `<head>`. For backward compatibility of legacy Mini Apps, the `fc:frame` meta tag is also supported. When this URL is rendered in a cast, the image is displayed in a 3:2 ratio with a button underneath. Clicking the button will open a Mini App to the provided action url and use the splash page to animate the transition.

```html
<meta name="fc:miniapp" content="<stringified Embed JSON>" />
<!-- For backward compatibility of legacy Mini Apps -->
<meta name="fc:frame" content="<stringified Embed JSON>" />
```

### Schema

| Property | Type   | Required | Description             | Constraints                                   |
|----------|--------|----------|-------------------------|-----------------------------------------------|
| version  | string | Yes      | Version of the embed.   | Must be "1"                                   |
| imageUrl | string | Yes      | Image url for the embed | Max 1024 characters. Must be 3:2 aspect ratio.|
| button   | object | Yes      | Button                  |                                               |

#### Button Schema

| Property | Type   | Required | Description          | Constraints                |
|----------|--------|----------|----------------------|----------------------------|
| title    | string | Yes      | Mini App name.       | Max length 32 characters   |
| action   | object | Yes      | Action               | Max length 1024 characters. |


#### Action Schema

| Property              | Type   | Required | Description                              | Constraints                                  |
|-----------------------|--------|----------|------------------------------------------|----------------------------------------------|
| type                  | string | Yes      | The type of action.                      | One of: `launch_frame`, `view_token`         |
| url                   | string | No       | App URL to open. If not provided, defaults to full URL used to fetch the document. | Max length 1024 characters.                   |
| name                  | string | Yes      |                                          | Name of the application                      |
| splashImageUrl        | string | No       | URL of image to show on loading screen.  | Max length 32 characters. Must be 200x200px. |
| splashBackgroundColor | string | No       | Hex color code to use on loading screen. | Hex color code.                              |



##### Example

```json
{
  "version": "1",
  "imageUrl": "https://yoink.party/framesV2/opengraph-image",
  "button": {
    "title": "🚩 Start",
    "action": {
      "type": "launch_frame",
      "name": "Yoink!",
      "url": "https://yoink.party/framesV2",
      "splashImageUrl": "https://yoink.party/logo.png",
      "splashBackgroundColor": "#f5f0ec"
    }
  }
}
```


## App Surface

![https://github.com/user-attachments/assets/66cba3ca-8337-4644-a3ac-ddc625358390](https://github.com/user-attachments/assets/66cba3ca-8337-4644-a3ac-ddc625358390)


### Header

Hosts should render a header above the Mini App that includes the name and
author specified in the manifest. Clients should show the header whenever the
Mini App is launched.


### Splash Screen

Hosts should show a splash screen as soon as the app is launched. The icon
and background must be specified in the Mini App manifest or embed meta tags.
The Mini App can hide the splash screen once loading is complete.

![splash schematic](/splash_screen_schematic.png)


### Size & Orientation

A Mini App should be rendered in a vertical modal. Mobile Mini App sizes should
be dictated by device dimensions while web Mini App sizes should be set to
424x695px.



## SDK

Mini Apps can communicate with their Host using a JavaScript SDK. At this time
there is no formal specification for the message passing format, Hosts and Apps
should use the open-source NPM packages that can be found in the
[farcasterxyz/miniapps](https://github.com/farcasterxyz/miniapps) repo.

This SDK facilitates communication over a `postMessage` channel available in
iframes and mobile WebViews.


### Versioning

The SDK is versioned using [Semantic Versioning](https://semver.org/). A
[What's New page](/docs/sdk/changelog) is maintained to communicate developer
impacting changes. A [lower level
changelog](https://github.com/farcasterxyz/miniapps/blob/main/packages/miniapp-sdk/CHANGELOG.md)
is maintained within the code base to document all changes.


### API

- [context](/docs/sdk/context) - provides information about the context the Mini App is running in

#### Actions
- [addMiniApp](/docs/sdk/actions/add-miniapp) - Prompts the user to add the Mini App
- [close](/docs/sdk/actions/close) - Closes the Mini App
- [composeCast](/docs/sdk/actions/compose-cast) - Prompt the user to cast
- [ready](/docs/sdk/actions/ready) - Hides the Splash Screen
- [signin](/docs/sdk/actions/sign-in) - Prompts the user to Sign In with Farcaster
- [openUrl](/docs/sdk/actions/open-url) - Open an external URL
- [viewProfile](/docs/sdk/actions/view-profile) - View a Farcaster profile
- [viewCast](/docs/sdk/actions/view-cast) - View a specific cast
- [swapToken](/docs/sdk/actions/swap-token) - Prompt the user to swap tokens
- [sendToken](/docs/sdk/actions/send-token) - Prompt the user to send tokens
- [viewToken](/docs/sdk/actions/view-token) - View a token

#### Wallet
- [getEthereumProvider](/docs/sdk/wallet) - [EIP-1193 Ethereum Provider](https://eips.ethereum.org/EIPS/eip-1193)
- [getSolanaProvider](/docs/sdk/solana) - Experimental Solana provider

### Events

The SDK allows Mini Apps to [subscribe to events](/docs/sdk/events) emitted by the Host.


## Manifest

Mini Apps can publish metadata that allows Farcaster clients to more deeply
integrate with their Mini App. This file is published at
`/.well-known/farcaster.json` and the [Fully Qualified Domain
Name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) where it is
hosted uniquely identifies the Mini App. The Manifest contains data that allows
Farcaster clients to verify the author of the app, present the Mini App in
discovery surfaces like app stores, and allows the Mini App to send
notifications.

### Versioning

Manifests will follow a simple versioning scheme where non-breaking
changes can be added to the same version but a breaking change must accompany a
version bump.


### Schema

| Property           | Type   | Required | Description                                      |
|--------------------|--------|----------|--------------------------------------------------|
| accountAssociation | object | ✅ **Yes** | Verifies domain ownership to a Farcaster account |
| miniapp (or frame) | object | ✅ **Yes** | Metadata about the Mini App                      |

#### accountAssociation

The account association verifies authorship of this domain to a Farcaster
account.

The value is set to the JSON representation of a [JSON Farcaster
Signature](https://github.com/farcasterxyz/protocol/discussions/208) from the
account's custody address or a valid auth address with the following payload:

```json
{
  domain: string;
}
```

The `domain` value must exactly match the FQDN of where it is hosted.

The `header.type` must be `"custody"` or `"auth"`.

##### Schema

| Property  | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| header    | string | Yes      | base64 encoded JFS header |
| payload   | string | Yes      | base64 encoded payload    |
| signature | string | Yes      | base64 encoded signature  |


##### Example

```json
{
  "header": "eyJmaWQiOjM2MjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgyY2Q4NWEwOTMyNjFmNTkyNzA4MDRBNkVBNjk3Q2VBNENlQkVjYWZFIn0",
  "payload": "eyJkb21haW4iOiJ5b2luay5wYXJ0eSJ9",
  "signature": "D7urCIelYBtFc12UkEw/VOE1rkGKMdmDqAP/6s7sLWNfjhyug8pQCTM68XVJ8Gal6eBZxvtFE4RpVwqDtnLrzhs="
}
```

#### frame

Metadata needed to by Hosts to distribute the Mini App.

import ManifestAppConfigSchema from "../../snippets/manifestAppConfigSchema.mdx"

<ManifestAppConfigSchema />


##### Example

import ManifestAppConfigExample from "../../snippets/manifestAppConfigExample.mdx"

<ManifestAppConfigExample />


### Example

Example of a valid farcaster.json manifest:

```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjM2MjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgyY2Q4NWEwOTMyNjFmNTkyNzA4MDRBNkVBNjk3Q2VBNENlQkVjYWZFIn0",
    "payload": "eyJkb21haW4iOiJ5b2luay5wYXJ0eSJ9",
    "signature": "MHgwZmJiYWIwODg3YTU2MDFiNDU3MzVkOTQ5MDRjM2Y1NGUxMzVhZTQxOGEzMWQ5ODNhODAzZmZlYWNlZWMyZDYzNWY4ZTFjYWU4M2NhNTAwOTMzM2FmMTc1NDlmMDY2YTVlOWUwNTljNmZiNDUxMzg0Njk1NzBhODNiNjcyZWJjZTFi"
  },
  "miniapp": {
    "version": "1",
    "name": "Yoink!",
    "iconUrl": "https://yoink.party/logo.png",
    "homeUrl": "https://yoink.party/framesV2/",
    "imageUrl": "https://yoink.party/framesV2/opengraph-image",
    "buttonTitle": "🚩 Start",
    "splashImageUrl": "https://yoink.party/logo.png",
    "splashBackgroundColor": "#f5f0ec",
    "webhookUrl": "https://yoink.party/api/webhook"
  }
}
```


### Caching

Farcaster clients may cache the manifest for a Mini App but should provide a
way for refreshing the manifest file.


## Adding Mini Apps

Mini Apps can be added to their Farcaster client by users. This enables the user
to quickly navigate back to the app and the app to send notifications to the
user.

Mini Apps can prompt the user to add the app during an interaction with the
[addMiniApp](/docs/sdk/actions/add-miniapp) action. Hosts may also let users add Mini
Apps from discovery surfaces like app stores or featured notifications.

Before a user adds a Mini App the Host should display information about the app
and a reminder that the app will be able to notify the user.

When a user adds a Mini App the Host must generate the appropriate Server
Events and send them to the Mini App's `webhookUrl` if one was provided.

After a user adds a Mini App, the Host should make it easy to find and launch
the Mini App by providing a top-level interface where users can browse and open
added apps.


### Server Events

The Host server POSTs 4 types of events to the Mini App server at the
`webhookUrl` specified in its Mini App manifest:

- `miniapp_added`
- `miniapp_removed`
- `notifications_enabled`
- `notifications_disabled`

The body looks like this:

Events use the [JSON Farcaster
Signature](https://github.com/farcasterxyz/protocol/discussions/208) format and
are signed with the app key of the user. The final format is:

```
{
  header: string;
  payload: string;
  signature: string;
}
```

All 3 values are `base64url` encoded. The payload and header can be decoded to
JSON, where the payload is different per event.

#### miniapp_added

This event may happen when an open frame calls `actions.addMiniApp` to prompt the
user to favorite it, or when the frame is closed and the user adds the frame
elsewhere in the client application (e.g. from a catalog).

Adding a frame includes enabling notifications.

The Host server generates a unique `notificationToken` and sends it
together with the `notificationUrl` that the frame must call, to both the
Host client and the frame server. Client apps must generate unique
tokens for each user.

Webhook payload:

```json
{
  "event": "miniapp_added",
  "notificationDetails": {
    "url": "https://api.farcaster.xyz/v1/frame-notifications",
    "token": "a05059ef2415c67b08ecceb539201cbc6"
  }
}
```

```ts
type EventMiniAppAddedPayload = {
  event: 'miniapp_added';
  notificationDetails?: MiniAppNotificationDetails;
};
```

#### miniapp_removed

A user can remove a frame, which means that any notification tokens for that
fid and client app (based on signer requester) should be considered invalid:

Webhook payload:

```json
{
  "event": "miniapp_removed"
}
```

#### notifications_disabled

A user can disable frame notifications from e.g. a settings panel in the client
app. Any notification tokens for that fid and client app (based on signer
requester) should be considered invalid:

Webhook payload:

```json
{
  "event": "notifications_disabled"
}
```

#### notifications_enabled

A user can enable frame notifications (e.g. after disabling them). The client
backend again sends a `notificationUrl` and a `token`, with a backend-only
flow:

Webhook payload:

```json
{
  "event": "notifications_enabled",
  "notificationDetails": {
    "url": "https://api.farcaster.xyz/v1/frame-notifications",
    "token": "a05059ef2415c67b08ecceb539201cbc6"
  }
}
```

```ts
type EventNotificationsEnabledPayload = {
  event: 'notifications_enabled';
  notificationDetails: MiniAppNotificationDetails;
};
```

### Notifications

A Mini App server can send notifications to one or more users who have enabled
them.

The Mini App server is given an authentication token and a URL which they can
use to push a notification to the specific Farcaster app that invoked the Mini
App. This is private and must be done separately for each Farcaster client that
a user may use.

The Mini App server calls the `notificationUrl` with the following JSON body:

import SendNotificationRequestSchema from '../../snippets/sendNotificationRequestSchema.mdx'

<SendNotificationRequestSchema />

The response from the client server must be an HTTP 200 OK with the following JSON body:

import SendNotificationResponseSchema from '../../snippets/sendNotificationResponseSchema.mdx'

<SendNotificationResponseSchema />

Once a user has been notified, when clicking the notification the client app will:

- Open `targetUrl`
- Set the context to the notification, see `NotificationLaunchContext`


#### Idempotency

A host MUST deduplicate notification requests using `(FID, notificationId)` as
an idempotency that is valid 24 hours. This allows Apps to safely retry
notification requests.


#### Rate Limits

Host servers should impose rate limits per `token` to prevent intentional or accidentally abuse. The recommended rate limits are:
- 1 notification per 30 seconds per `token`
- 100 notifications per day per `token`


#### Displaying notifications

Hosts should display a user's Mini App notifications from their UI as follows:

![notifications schematic](/notification_schematic.png)


#### Controls

Hosts should provide controls for the user to toggle their notification
settings for their apps.

- Users should be able to navigate to settings for any Mini App they've added
  and be able to enable or disable notifications from this menu
- Users should be able to disable notifications for a Mini App directly from a
  notification from that Mini App

