---
title: composeCast
description: Open the cast composer with a suggested cast
---

import { Caption } from '../../../../components/Caption.tsx';

# composeCast

Open the cast composer with a suggested cast. The user will be able to modify
the cast before posting it.

![composing a cast](/compose_cast_action.png)

<Caption>
  An app prompts the user to cast and includes an embed.
</Caption>

## Usage

```ts twoslash
/**
 * Cryptographically secure nonce generated on the server and associated with
 * the user's session.
 */ 
const text = "I just learned how to compose a cast";
const embeds = ["https://miniapps.farcaster.xyz/docs/sdk/actions/compose-cast"] as [string];

// ---cut---
import { sdk } from '@farcaster/miniapp-sdk'

await sdk.actions.composeCast({ 
  text,
  embeds,
})
```

## Parameters

### text (optional)

- **Type:** `string`

Suggested text for the body of the cast.
  
Mentions can be included using the human-writeable form (e.g. @farcaster).


### embeds (optional)

- **Type:** `[] | [string] | [string, string]`

Suggested embeds. Max two.


### parent (optional)

- **Type:** `{ type: 'cast'; hash: string }`

Suggested parent of the cast.


### close (optional)

- **Type:** `boolean`

Whether the app should be closed when this action is called. If true the app
will be closed and the action will resolve with no result.


### channelKey (optional)

- **Type:** `string`

Whether the cast should be posted to a channel.


## Return Value

The cast posted by the user, or `undefined` if set to close.

**Note:** The `cast` property in the result can be `null` if the user decides not to create the cast.

```ts twoslash
import { sdk } from "@farcaster/miniapp-sdk";

// ---cut---
const result = await sdk.actions.composeCast({ 
//    ^?  
  text: "I just learned how to compose a cast",
  embeds: ["https://miniapps.farcaster.xyz/docs/sdk/actions/compose-cast"],
  channelKey: "farcaster" // optional channel
})

// result.cast can be null if user cancels
if (result?.cast) {
  console.log(result.cast.hash)
  console.log(result.cast.channelKey) // includes channel if posted to one
}
```
