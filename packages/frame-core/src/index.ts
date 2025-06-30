// Deprecation warning
if (typeof console !== 'undefined' && console.warn) {
  console.warn(
    '[DEPRECATION WARNING] @farcaster/frame-core is deprecated. Please migrate to @farcaster/miniapp-core. ' +
      'See https://github.com/farcasterxyz/frames/blob/main/MIGRATION.md for migration guide.',
  )
}

// Re-export everything from miniapp-core
export * from '@farcaster/miniapp-core'

// Import types for aliasing
import {
  type EventFrameAddRejected as _EventFrameAddRejected,
  type EventFrameAdded as _EventFrameAdded,
  type EventFrameRemoved as _EventFrameRemoved,
  type MiniAppClientEvent as _MiniAppClientEvent,
  type MiniAppEmbedNext as _MiniAppEmbedNext,
  type MiniAppHost as _MiniAppHost,
  type MiniAppNotificationDetails as _MiniAppNotificationDetails,
  type MiniAppServerEvent as _MiniAppServerEvent,
  type WireMiniAppHost as _WireMiniAppHost,
  actionLaunchFrameSchema as _actionLaunchFrameSchema,
  domainMiniAppConfigSchema as _domainMiniAppConfigSchema,
  eventFrameAddedSchema as _eventFrameAddedSchema,
  eventFrameRemovedSchema as _eventFrameRemovedSchema,
  miniAppEmbedNextSchema as _miniAppEmbedNextSchema,
  miniAppNameSchema as _miniAppNameSchema,
  safeParseMiniAppEmbed as _safeParseMiniAppEmbed,
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
