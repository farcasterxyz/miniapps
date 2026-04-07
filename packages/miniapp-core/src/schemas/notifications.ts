import { z } from 'zod'
import { secureUrlSchema } from './shared.ts'

export const notificationDetailsSchema = z.object({
  url: z.string(),
  token: z.string(),
})

export type MiniAppNotificationDetails = z.infer<
  typeof notificationDetailsSchema
>

export const sendNotificationRequestSchema = z.object({
  notificationId: z.string().max(128),
  title: z.string().max(32),
  body: z.string().max(128),
  targetUrl: secureUrlSchema,
  tokens: z.string().array().max(100),
})

export type SendNotificationRequest = z.infer<
  typeof sendNotificationRequestSchema
>

export const sendNotificationFailedTokenReasonSchema = z.enum([
  'domain_mismatch',
  'target_url_mismatch',
  'no_webhook_url',
  'unknown',
])

export type SendNotificationFailedTokenReason = z.infer<
  typeof sendNotificationFailedTokenReasonSchema
>

export const sendNotificationFailedTokenSchema = z.object({
  token: z.string(),
  fid: z.number().int().positive().optional(),
  reason: sendNotificationFailedTokenReasonSchema,
})

export type SendNotificationFailedToken = z.infer<
  typeof sendNotificationFailedTokenSchema
>

export const sendNotificationResponseSchema = z.object({
  result: z.object({
    successfulTokens: z.array(z.string()),
    invalidTokens: z.array(z.string()),
    rateLimitedTokens: z.array(z.string()),
    failedTokens: z.array(sendNotificationFailedTokenSchema).optional(),
  }),
})

export type SendNotificationResponse = z.infer<
  typeof sendNotificationResponseSchema
>
