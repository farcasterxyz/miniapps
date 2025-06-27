---
title: Back Navigation
description: Support back navigation in your mini app
---

# Back Navigation

Integrate with a back navigation control provided by the Farcaster client.

## Usage

If your application is already using [browser-based navigation](#web-navigation-integration), you can
integrate in one line with:

```ts
await sdk.back.enableWebNavigation();
```

That's it! When there is a page to go back to a [back control](#back-control) will be made
available to the user.

Otherwise, you can set a custom back handler and show the back control:

```ts
sdk.back.onback = () => {
  // trigger back in your app
}

await sdk.back.show();
```

## Back control

The back control will vary depending on the user's device and platform but will
generally follow:
- a clickable button in the header on web
- a horizontal swipe left gesture on iOS
- the Android native back control on Android which could be a swipe left
  gesture combined with a virtual or physical button depending on the device


## Web Navigation integration

The SDK can automatically integrate with web navigation APIs.

### `enableWebNavigation()`

Enables automatic integration with the browser's navigation system. This will:
- Use the modern Navigation API when available; the back button will automatically
  be shown and hidden based on the value of `canGoBack`.
- Fall back to the History API in browsers where Navigation is [not
  supported](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API#browser_compatibility)
  ; the back button will always be shown.

```ts
await sdk.back.enableWebNavigation();
```

### `disableWebNavigation()`

Disables web navigation integration.

```ts
await sdk.back.disableWebNavigation();
```


## Properties

### `enabled`
- **Type**: `boolean`
- **Description**: Whether back navigation is currently enabled

### `onback`
- **Type**: `() => unknown`
- **Description**: Function to call when a back event is triggered. You don't need to
  set this when using `enableWebNavigation`.

## Methods

### `show()`
Makes the back button visible.

```ts
await sdk.back.show();
```

### `hide()`
Hides the back button.

```ts
await sdk.back.hide();
```

## Events

When a user triggers the back control the SDK will emit an
`backNavigationTriggered` event. You can add an event listener on `sdk` or use
`sdk.back.onback` to respond to these events.

If you are using `enableWebNavigation` this event will automatically be
listened to and trigger the browser to navigate. Otherwise you should listen
for this event and respond to it as appropriate for your application.


## Availability

You can check whether the Farcaster client rendering your app supports a back control:

```ts twoslash
import { sdk } from '@farcaster/miniapp-sdk'

const capabilities = await sdk.getCapabilities()

if (capabilities.includes('back')) {
  await sdk.back.enableWebNavigation();
} else {
  // show a back button within your app
}
```

## Example: Web Navigation 

```ts
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Enable web navigation integration
    sdk.back.enableWebNavigation();
  }, []);

  return (
    <div>
      {/* Your app content */}
    </div>
  );
}
```

## Example: Manual

```ts
function NavigationExample() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Update back button based on current page
    if (currentPage === 'home') {
      sdk.back.show();
    } else {
      sdk.back.hide();
    }
  }, [currentPage]);

  const handleBack = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
  };

  // Listen for back navigation events
  useEffect(() => {
    sdk.on('backNavigationTriggered', handleBack);
    return () => sdk.off('backNavigationTriggered', handleBack);
  }, [currentPage]);

  return (
    <div>
      {currentPage === 'home' ? (
        <HomePage onNavigate={setCurrentPage} />
      ) : (
        <SubPage />
      )}
    </div>
  );
}
