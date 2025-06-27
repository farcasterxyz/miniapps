// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '[DEPRECATION WARNING] @farcaster/frame-core is deprecated. Please migrate to @farcaster/miniapp-core. ' +
    'See https://github.com/farcasterxyz/frames/blob/main/MIGRATION.md for migration guide.'
  )
}

// Re-export everything from miniapp-core
export * from '@farcaster/miniapp-core'

// Import types for aliasing
import {
  type MiniAppHost as _MiniAppHost,
  type WireMiniAppHost as _WireMiniAppHost,
  type MiniAppClientEvent as _MiniAppClientEvent,
  type MiniAppServerEvent as _MiniAppServerEvent,
  type EventFrameAdded as _EventFrameAdded,
  type EventFrameRemoved as _EventFrameRemoved,
  type EventFrameAddRejected as _EventFrameAddRejected,
  type MiniAppNotificationDetails as _MiniAppNotificationDetails,
  type MiniAppEmbedNext as _MiniAppEmbedNext,
  miniAppNameSchema as _miniAppNameSchema,
  eventFrameAddedSchema as _eventFrameAddedSchema,
  eventFrameRemovedSchema as _eventFrameRemovedSchema,
  domainMiniAppConfigSchema as _domainMiniAppConfigSchema,
  miniAppEmbedNextSchema as _miniAppEmbedNextSchema,
  safeParseMiniAppEmbed as _safeParseMiniAppEmbed,
  actionLaunchFrameSchema as _actionLaunchFrameSchema,
} from '@farcaster/miniapp-core'

// Backward compatibility type aliases
export type FrameHost = _MiniAppHost
export type WireFrameHost = _WireMiniAppHost
export type FrameClientEvent = _MiniAppClientEvent
export type FrameServerEvent = _MiniAppServerEvent
export type EventFrameAdded = _EventFrameAdded
export type EventFrameRemoved = _EventFrameRemoved
export type EventFrameAddRejected = _EventFrameAddRejected
export type FrameNotificationDetails = _MiniAppNotificationDetails
export type FrameEmbedNext = _MiniAppEmbedNext

// Backward compatibility schema aliases
export const frameNameSchema = _miniAppNameSchema
export const eventFrameAddedSchema = _eventFrameAddedSchema
export const eventFrameRemovedSchema = _eventFrameRemovedSchema
export const domainFrameConfigSchema = _domainMiniAppConfigSchema
export const frameEmbedNextSchema = _miniAppEmbedNextSchema
export const safeParseFrameEmbed = _safeParseMiniAppEmbed
export const actionLaunchFrameSchema = _actionLaunchFrameSchema
