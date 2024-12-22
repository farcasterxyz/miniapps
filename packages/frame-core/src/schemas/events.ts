import { z } from "zod";
import { notificationDetailsSchema } from "./notifications";

export const eventFrameAddedSchema = z.object({
  event: z.literal("frame_added"),
  notificationDetails: notificationDetailsSchema.optional(),
});

export type EventFrameAdded = z.infer<typeof eventFrameAddedSchema>;

export const eventFrameRemovedSchema = z.object({
  event: z.literal("frame_removed"),
});

export type EventFrameRemoved = z.infer<typeof eventFrameRemovedSchema>;

export const eventNotificationsEnabledSchema = z.object({
  event: z.literal("notifications_enabled"),
  notificationDetails: notificationDetailsSchema.required(),
});

export type EventNotificationsEnabled = z.infer<
  typeof eventNotificationsEnabledSchema
>;

export const notificationsDisabledSchema = z.object({
  event: z.literal("notifications_disabled"),
});

export type EventNotificationsDisabled = z.infer<
  typeof notificationsDisabledSchema
>;

export const serverEventSchema = z.discriminatedUnion("event", [
  eventFrameAddedSchema,
  eventFrameRemovedSchema,
  eventNotificationsEnabledSchema,
  notificationsDisabledSchema,
]);

export type FrameServerEvent = z.infer<typeof serverEventSchema>;
