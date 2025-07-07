---
title: Share Extensions
description: Enable your Mini App to receive shared casts through the system share sheet
---

import { Caption } from '../../../components/Caption';

# Share Extensions

Share extensions allow your Mini App to appear in the Farcaster share sheet, enabling users to share casts directly to your app. When a user shares a cast to your Mini App, it opens with the cast context, allowing you to provide rich, cast-specific experiences.

![Mini app share extension](/share_extension_preview.png)

<Caption>
  Mini Apps can receive shared casts through the system share sheet
</Caption>

## How it works

When a user views a cast in any Farcaster client, they can tap the share button and select your Mini App from the share sheet. Your app will open with information about the shared cast, including the cast hash, author FID, and the viewer's FID.

The entire flow takes just two taps:
1. User taps share on a cast
2. User selects your Mini App from the share sheet

Your Mini App then opens with full context about the shared cast, ready to provide a tailored experience.

## Setting up share extensions

To enable your Mini App to receive shared casts, add a `castShareUrl` to your manifest:

```json
{
  "appUrl": "https://your-app.com",
  "icon": "https://your-app.com/icon.png",
  "castShareUrl": "https://your-app.com/share"
}
```

The `castShareUrl` must:
- Use HTTPS
- Match the domain of your registered Mini App
- Be an absolute URL

After updating your manifest, refresh your manifest and the share extension will be available to all users who have added your Mini App.

## Receiving shared casts

When your Mini App is opened via a share extension, it receives the cast information in two ways:

### 1. URL Parameters (Available immediately)

Your `castShareUrl` receives these query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `castHash` | string | The hex-encoded hash of the shared cast |
| `castFid` | number | The FID of the cast author |
| `viewerFid` | number | The FID of the user sharing the cast (if logged in) |

Example URL:
```
https://your-app.com/share?castHash=0x5415e243853e...&castFid=2417&viewerFid=12152
```

These parameters are available immediately, even during server-side rendering, allowing you to begin fetching cast data right away.

### 2. SDK Context (Available after initialization)

Once your Mini App initializes, the SDK provides enriched cast data through the location context:

```typescript
import sdk from '@farcaster/miniapp-sdk';

if (sdk.context.location.type === 'cast_share') {
  const cast = sdk.context.location.cast;
  
  // Access enriched cast data
  console.log(cast.author.username);
  console.log(cast.hash);
  console.log(cast.timestamp);
  
  // Access optional fields if available
  if (cast.channelKey) {
    console.log(`Shared from /${cast.channelKey}`);
  }
}
```

The cast object includes:

```typescript
type MiniAppCast = {
  author: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  hash: string;
  parentHash?: string;
  parentFid?: number;
  timestamp?: number;
  mentions?: MiniAppUser[];
  text: string;
  embeds?: string[];
  channelKey?: string;
};
```

## Implementation example

Here's a complete example showing how to handle shared casts in your Mini App:

```typescript
import { useEffect, useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';

function App() {
  const [sharedCast, setSharedCast] = useState(null);
  const [isShareContext, setIsShareContext] = useState(false);

  useEffect(() => {
    // Check if we're in a share context
    if (sdk.context.location.type === 'cast_share') {
      setIsShareContext(true);
      setSharedCast(sdk.context.location.cast);
    }
  }, []);

  if (isShareContext && sharedCast) {
    return (
      <div>
        <h1>Cast from @{sharedCast.author.username}</h1>
        <p>Analyzing cast {sharedCast.hash}...</p>
        {/* Your cast-specific UI here */}
      </div>
    );
  }

  // Default app experience
  return <div>Your regular app UI</div>;
}
```

## Real-world example: Degen Stats

[Degen Stats](https://farcaster.xyz/miniapps/jrth1IniizBC/degen) demonstrates the power of share extensions. Originally designed to show viewers their own stats, it was quickly upgraded to support share extensions. Now when users share a cast to Degen Stats, it seamlessly displays stats for the cast's author instead of the viewer - a simple but powerful enhancement that took minimal implementation effort.

## Best practices

1. **Handle both contexts**: Design your app to work both as a standalone Mini App and when receiving shared casts.

2. **Fast loading**: Users expect immediate feedback when sharing. Show a loading state while fetching additional cast data.

3. **Graceful fallbacks**: Not all cast fields are guaranteed. Handle missing data gracefully.

4. **Clear value**: Make it obvious why sharing a cast to your app provides value. Users should understand what your app does with the shared cast.

5. **Server-side rendering**: Take advantage of URL parameters for faster initial loads by starting data fetches on the server.

## Testing share extensions

During development, you can test share extensions by:

1. Adding your development URL to your manifest
2. Refreshing your manifest
3. Sharing any cast to your Mini App from a Farcaster client
4. Verifying your app receives the correct parameters and context

## Next steps

- Learn about [SDK Context](/docs/sdk/context) to understand all available location types
- Explore [Compose Cast](/docs/sdk/actions/compose-cast) to let users create casts from your Mini App
- Check out [View Cast](/docs/sdk/actions/view-cast) to navigate users to specific casts