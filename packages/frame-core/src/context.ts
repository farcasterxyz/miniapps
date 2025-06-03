import type { FrameNotificationDetails } from './schemas/index.ts'

export type CastEmbedLocationContext = {
  type: 'cast_embed'
  embed: string
  cast: {
    fid: number
    hash: string
  }
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
