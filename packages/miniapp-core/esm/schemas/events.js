import { z } from 'zod';
import { notificationDetailsSchema } from "./notifications.js";
export const eventMiniAppAddedSchema = z.object({
    event: z.literal('miniapp_added'),
    notificationDetails: notificationDetailsSchema.optional(),
});
export const eventFrameAddedSchema = z.object({
    event: z.literal('frame_added'),
    notificationDetails: notificationDetailsSchema.optional(),
});
export const eventMiniAppRemovedSchema = z.object({
    event: z.literal('miniapp_removed'),
});
export const eventFrameRemovedSchema = z.object({
    event: z.literal('frame_removed'),
});
export const eventNotificationsEnabledSchema = z.object({
    event: z.literal('notifications_enabled'),
    notificationDetails: notificationDetailsSchema.required(),
});
export const notificationsDisabledSchema = z.object({
    event: z.literal('notifications_disabled'),
});
export const serverEventSchema = z.discriminatedUnion('event', [
    eventMiniAppAddedSchema,
    eventMiniAppRemovedSchema,
    eventNotificationsEnabledSchema,
    notificationsDisabledSchema,
    // Remove after compatibility period
    eventFrameAddedSchema,
    eventFrameRemovedSchema,
]);
