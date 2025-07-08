---
title: openMiniApp
description: Opens another Mini App
---

import { Caption } from '../../../../components/Caption.tsx';

# openMiniApp

Opens another Mini App, providing a seamless way to navigate between Mini Apps within the Farcaster ecosystem.

When you open another Mini App using this method, your current Mini App will close after successful navigation. The target Mini App will receive information about your app as the referrer, enabling referral tracking and app-to-app flows.

## Usage

```ts twoslash
const options = {
  url: 'https://www.bountycaster.xyz/bounty/0x983ad3e340fbfef785e0705ff87c0e63c22bebc4'
};

//---cut---
import { sdk } from '@farcaster/miniapp-sdk'

// Open a Mini App using an embed URL
await sdk.actions.openMiniApp({
  url: 'https://www.bountycaster.xyz/bounty/0x983ad3e340fbfef785e0705ff87c0e63c22bebc4'
})

// Open a Mini App using a launch URL
await sdk.actions.openMiniApp({
  url: 'https://farcaster.xyz/miniapps/WoLihpyQDh7w/farville'
})
```

## Options

```ts
type OpenMiniAppOptions = {
  url: string
}
```

- `url`: The URL of the Mini App to open. This can be either:
  - A Mini App embed URL (e.g., `https://example.com/specific-page`)
  - A Mini App launch URL (e.g., `https://farcaster.xyz/miniapps/[id]/[name]`)

## Return Value

`Promise<void>` - The promise resolves when navigation is successful. If navigation fails, the promise will be rejected with an error.

## Error Handling

Always await the `openMiniApp` call and handle potential errors:

```ts
import { sdk } from '@farcaster/miniapp-sdk'

try {
  await sdk.actions.openMiniApp({
    url: 'https://example.com/miniapp'
  })
  // Navigation successful - your app will close
} catch (error) {
  console.error('Failed to open Mini App:', error)
  // Handle the error - your app remains open
}
```

## Referrer Information

When a Mini App is opened using `openMiniApp`, the target app receives a special location context with referrer information:

```ts
// In the target Mini App:
if (sdk.context.location?.type === 'open_miniapp') {
  console.log('Referred by:', sdk.context.location.referrerDomain)
  // e.g., "Referred by: yourminiapp.com"
}
```

## Use Cases

### Hub or Portfolio Apps

Create a central hub that showcases multiple Mini Apps:

```ts
const miniApps = [
  { name: 'Farville', url: 'https://farcaster.xyz/miniapps/WoLihpyQDh7w/farville' },
  { name: 'Bountycaster', url: 'https://www.bountycaster.xyz' },
  { name: 'Yoink', url: 'https://yoink.party/framesV2/' }
]

function MiniAppHub() {
  const handleOpenApp = async (url: string) => {
    try {
      await sdk.actions.openMiniApp({ url })
    } catch (error) {
      console.error('Failed to open app:', error)
    }
  }

  return (
    <div>
      {miniApps.map(app => (
        <button key={app.name} onClick={() => handleOpenApp(app.url)}>
          Open {app.name}
        </button>
      ))}
    </div>
  )
}
```

### Referral Systems

Implement referral tracking between Mini Apps:

```ts
// In the source Mini App
const referralUrl = 'https://partner-app.com/campaign?ref=myapp'
await sdk.actions.openMiniApp({ url: referralUrl })

// In the target Mini App
if (sdk.context.location?.type === 'open_miniapp') {
  // Track the referral
  analytics.track('referral_received', {
    referrer: sdk.context.location.referrerDomain,
    campaign: new URL(window.location.href).searchParams.get('ref')
  })
}
```

## Important Notes

- Your Mini App will close after successful navigation
- The action works the same way on both web and mobile platforms
- The target app must be a valid Mini App with a proper manifest
- Always handle errors as navigation may fail for various reasons