import type { z } from 'zod'
import type { sharedStateSchema } from './schemas/funcs'

/**
 * State used by the host when constructing the mini app URL to be shared.
 *
 * path: The path to be added to the mini app URL when shared. Added either to
 * the `homeUrl` specified in the manifest or the URL of an mini app embed
 * shared on the feed.
 *
 * e.g. `'/specific/miniapp/screen'` (can set `window.location.pathname` directly).
 *
 * params: Query parms to be added to the mini app URL when shared. Compatible with
 * URLSearchParams constructor parameters.
 *
 * Either a key-value pair e.g. `{ foo: 'bar' }`, a string e.g. `'foo=bar'`,
 * or an array of arrays e.g. `[['foo', 'bar'], ['baz', 'qux']]`
 * (can set `window.location.search` directly).
 */
export type ShareState = z.infer<typeof sharedStateSchema>

export type ShareStateProvider = () => ShareState | Promise<ShareState>
