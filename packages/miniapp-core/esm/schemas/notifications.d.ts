import { z } from 'zod';
export declare const notificationDetailsSchema: z.ZodObject<{
    url: z.ZodString;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    token: string;
}, {
    url: string;
    token: string;
}>;
export type MiniAppNotificationDetails = z.infer<typeof notificationDetailsSchema>;
export declare const sendNotificationRequestSchema: z.ZodObject<{
    notificationId: z.ZodString;
    title: z.ZodString;
    body: z.ZodString;
    targetUrl: z.ZodString;
    tokens: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    notificationId: string;
    body: string;
    targetUrl: string;
    tokens: string[];
}, {
    title: string;
    notificationId: string;
    body: string;
    targetUrl: string;
    tokens: string[];
}>;
export type SendNotificationRequest = z.infer<typeof sendNotificationRequestSchema>;
export declare const sendNotificationResponseSchema: z.ZodObject<{
    result: z.ZodObject<{
        successfulTokens: z.ZodArray<z.ZodString, "many">;
        invalidTokens: z.ZodArray<z.ZodString, "many">;
        rateLimitedTokens: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        successfulTokens: string[];
        invalidTokens: string[];
        rateLimitedTokens: string[];
    }, {
        successfulTokens: string[];
        invalidTokens: string[];
        rateLimitedTokens: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    result: {
        successfulTokens: string[];
        invalidTokens: string[];
        rateLimitedTokens: string[];
    };
}, {
    result: {
        successfulTokens: string[];
        invalidTokens: string[];
        rateLimitedTokens: string[];
    };
}>;
export type SendNotificationResponse = z.infer<typeof sendNotificationResponseSchema>;
