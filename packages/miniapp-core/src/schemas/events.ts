import { z } from 'zod'
import { notificationDetailsSchema } from './notifications.ts'

export const eventMiniAppAddedSchema = z.object({
  event: z.literal('miniapp_added'),
  notificationDetails: notificationDetailsSchema.optional(),
})

export type EventMiniAppAdded = z.infer<typeof eventMiniAppAddedSchema>

export const eventMiniAppRemovedSchema = z.object({
  event: z.literal('miniapp_removed'),
})

export type EventMiniAppRemoved = z.infer<typeof eventMiniAppRemovedSchema>

export const eventNotificationsEnabledSchema = z.object({
  event: z.literal('notifications_enabled'),
  notificationDetails: notificationDetailsSchema.required(),
})

export type EventNotificationsEnabled = z.infer<
  typeof eventNotificationsEnabledSchema
>

export const notificationsDisabledSchema = z.object({
  event: z.literal('notifications_disabled'),
})

export type EventNotificationsDisabled = z.infer<
  typeof notificationsDisabledSchema
>

export const serverEventSchema = z.discriminatedUnion('event', [
  eventMiniAppAddedSchema,
  eventMiniAppRemovedSchema,
  eventNotificationsEnabledSchema,
  notificationsDisabledSchema,
])

export type MiniAppServerEvent = z.infer<typeof serverEventSchema>
