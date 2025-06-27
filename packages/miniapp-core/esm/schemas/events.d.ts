import { z } from 'zod';
export declare const eventMiniAppAddedSchema: z.ZodObject<{
    event: z.ZodLiteral<"miniapp_added">;
    notificationDetails: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
    }, {
        url: string;
        token: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    event: "miniapp_added";
    notificationDetails?: {
        url: string;
        token: string;
    } | undefined;
}, {
    event: "miniapp_added";
    notificationDetails?: {
        url: string;
        token: string;
    } | undefined;
}>;
export type EventMiniAppAdded = z.infer<typeof eventMiniAppAddedSchema>;
export declare const eventFrameAddedSchema: z.ZodObject<{
    event: z.ZodLiteral<"frame_added">;
    notificationDetails: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
    }, {
        url: string;
        token: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    event: "frame_added";
    notificationDetails?: {
        url: string;
        token: string;
    } | undefined;
}, {
    event: "frame_added";
    notificationDetails?: {
        url: string;
        token: string;
    } | undefined;
}>;
export type EventFrameAdded = z.infer<typeof eventFrameAddedSchema>;
export declare const eventMiniAppRemovedSchema: z.ZodObject<{
    event: z.ZodLiteral<"miniapp_removed">;
}, "strip", z.ZodTypeAny, {
    event: "miniapp_removed";
}, {
    event: "miniapp_removed";
}>;
export type EventMiniAppRemoved = z.infer<typeof eventMiniAppRemovedSchema>;
export declare const eventFrameRemovedSchema: z.ZodObject<{
    event: z.ZodLiteral<"frame_removed">;
}, "strip", z.ZodTypeAny, {
    event: "frame_removed";
}, {
    event: "frame_removed";
}>;
export type EventFrameRemoved = z.infer<typeof eventFrameRemovedSchema>;
export declare const eventNotificationsEnabledSchema: z.ZodObject<{
    event: z.ZodLiteral<"notifications_enabled">;
    notificationDetails: z.ZodObject<{
        url: z.ZodString;
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
    }, {
        url: string;
        token: string;
    }>;
}, "strip", z.ZodTypeAny, {
    event: "notifications_enabled";
    notificationDetails: {
        url: string;
        token: string;
    };
}, {
    event: "notifications_enabled";
    notificationDetails: {
        url: string;
        token: string;
    };
}>;
export type EventNotificationsEnabled = z.infer<typeof eventNotificationsEnabledSchema>;
export declare const notificationsDisabledSchema: z.ZodObject<{
    event: z.ZodLiteral<"notifications_disabled">;
}, "strip", z.ZodTypeAny, {
    event: "notifications_disabled";
}, {
    event: "notifications_disabled";
}>;
export type EventNotificationsDisabled = z.infer<typeof notificationsDisabledSchema>;
export declare const serverEventSchema: z.ZodDiscriminatedUnion<"event", [z.ZodObject<{
    event: z.ZodLiteral<"miniapp_added">;
    notificationDetails: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
    }, {
        url: string;
        token: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    event: "miniapp_added";
    notificationDetails?: {
        url: string;
        token: string;
    } | undefined;
}, {
    event: "miniapp_added";
    notificationDetails?: {
        url: string;
        token: string;
    } | undefined;
}>, z.ZodObject<{
    event: z.ZodLiteral<"miniapp_removed">;
}, "strip", z.ZodTypeAny, {
    event: "miniapp_removed";
}, {
    event: "miniapp_removed";
}>, z.ZodObject<{
    event: z.ZodLiteral<"notifications_enabled">;
    notificationDetails: z.ZodObject<{
        url: z.ZodString;
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
    }, {
        url: string;
        token: string;
    }>;
}, "strip", z.ZodTypeAny, {
    event: "notifications_enabled";
    notificationDetails: {
        url: string;
        token: string;
    };
}, {
    event: "notifications_enabled";
    notificationDetails: {
        url: string;
        token: string;
    };
}>, z.ZodObject<{
    event: z.ZodLiteral<"notifications_disabled">;
}, "strip", z.ZodTypeAny, {
    event: "notifications_disabled";
}, {
    event: "notifications_disabled";
}>, z.ZodObject<{
    event: z.ZodLiteral<"frame_added">;
    notificationDetails: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
    }, {
        url: string;
        token: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    event: "frame_added";
    notificationDetails?: {
        url: string;
        token: string;
    } | undefined;
}, {
    event: "frame_added";
    notificationDetails?: {
        url: string;
        token: string;
    } | undefined;
}>, z.ZodObject<{
    event: z.ZodLiteral<"frame_removed">;
}, "strip", z.ZodTypeAny, {
    event: "frame_removed";
}, {
    event: "frame_removed";
}>]>;
export type MiniAppServerEvent = z.infer<typeof serverEventSchema>;
