import type { FrameNotificationDetails } from './schemas/index.ts'

export type MiniappUser = {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
}

export interface MiniappCast {
  author: MiniappUser
  hash: string
  parentHash?: string
  parentFid?: number
  timestamp?: number
  mentions?: MiniappUser[]
  text: string
  embeds?: string[]
  channelKey?: string
}

export type CastEmbedLocationContext = {
  type: 'cast_embed'
  embed: string
  cast: MiniappCast
}

export type CastShareLocationContext = {
  type: 'cast_share'
  cast: MiniappCast
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

export type LocationContext =
  | CastEmbedLocationContext
  | CastShareLocationContext
  | NotificationLocationContext
  | LauncherLocationContext
  | ChannelLocationContext

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
  clientFid: number
  added: boolean
  notificationDetails?: FrameNotificationDetails
  safeAreaInsets?: SafeAreaInsets
}

export type ClientFeatures = {
  haptics: boolean
}

export type FrameContext = {
  client: ClientContext
  user: UserContext
  location?: LocationContext
  features?: ClientFeatures
}
