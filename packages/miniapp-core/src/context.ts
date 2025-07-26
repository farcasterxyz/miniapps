import type { MiniAppNotificationDetails } from './schemas/index.ts'

export type MiniAppPlatformType = 'web' | 'mobile'

export type MiniAppUser = {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
}

export interface MiniAppCast {
  author: MiniAppUser
  hash: string
  parentHash?: string
  parentFid?: number
  timestamp?: number
  mentions?: MiniAppUser[]
  text: string
  embeds?: string[]
  channelKey?: string
}

export type CastEmbedLocationContext = {
  type: 'cast_embed'
  embed: string
  cast: MiniAppCast
}

export type CastShareLocationContext = {
  type: 'cast_share'
  cast: MiniAppCast
}

export type NotificationLocationContext = {
  type: 'notification'
  notification: {
    notificationId: string
    title: string
    body: string
  }
}

export type LauncherLocationContext = {
  type: 'launcher'
}

export type ChannelLocationContext = {
  type: 'channel'
  channel: {
    /**
     * Channel key identifier
     */
    key: string

    /**
     * Channel name
     */
    name: string

    /**
     * Channel profile image URL
     */
    imageUrl?: string
  }
}

export type OpenMiniAppLocationContext = {
  type: 'open_miniapp'
  referrerDomain: string
}

export type LocationContext =
  | CastEmbedLocationContext
  | CastShareLocationContext
  | NotificationLocationContext
  | LauncherLocationContext
  | ChannelLocationContext
  | OpenMiniAppLocationContext

export type AccountLocation = {
  placeId: string

  /**
   * Human-readable string describing the location
   */
  description: string
}

export type UserContext = {
  fid: number
  username?: string
  displayName?: string

  /**
   * Profile image URL
   */
  pfpUrl?: string
  location?: AccountLocation
}

export type SafeAreaInsets = {
  top: number
  bottom: number
  left: number
  right: number
}

export type ClientContext = {
  platformType?: MiniAppPlatformType
  clientFid: number
  added: boolean
  notificationDetails?: MiniAppNotificationDetails
  safeAreaInsets?: SafeAreaInsets
}

export type ClientFeatures = {
  haptics: boolean
  cameraAndMicrophoneAccess?: boolean
}

export type MiniAppContext = {
  client: ClientContext
  user: UserContext
  location?: LocationContext
  features?: ClientFeatures
}
