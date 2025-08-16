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
  actionLaunchFrameSchema as _actionLaunchFrameSchema,
  domainMiniAppConfigSchema as _domainMiniAppConfigSchema,
  type MiniAppClientEvent as _MiniAppClientEvent,
  type MiniAppEmbedNext as _MiniAppEmbedNext,
  type MiniAppHost as _MiniAppHost,
  type MiniAppNotificationDetails as _MiniAppNotificationDetails,
  type MiniAppServerEvent as _MiniAppServerEvent,
  miniAppEmbedNextSchema as _miniAppEmbedNextSchema,
  miniAppNameSchema as _miniAppNameSchema,
  safeParseMiniAppEmbed as _safeParseMiniAppEmbed,
  type WireMiniAppHost as _WireMiniAppHost,
} from '@farcaster/miniapp-core'

// Backward compatibility type aliases
export type FrameHost = _MiniAppHost
export type WireFrameHost = _WireMiniAppHost
export type FrameClientEvent = _MiniAppClientEvent
export type FrameServerEvent = _MiniAppServerEvent
export type FrameNotificationDetails = _MiniAppNotificationDetails
export type FrameEmbedNext = _MiniAppEmbedNext

// Backward compatibility schema aliases
export const frameNameSchema = _miniAppNameSchema
export const domainFrameConfigSchema = _domainMiniAppConfigSchema
export const frameEmbedNextSchema = _miniAppEmbedNextSchema
export const safeParseFrameEmbed = _safeParseMiniAppEmbed
export const actionLaunchFrameSchema = _actionLaunchFrameSchema
