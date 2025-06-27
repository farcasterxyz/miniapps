import { z } from 'zod';
import { aspectRatioSchema, buttonTitleSchema, caip19TokenSchema, miniAppNameSchema, hexColorSchema, secureUrlSchema, } from "./shared.js";
export const actionLaunchFrameSchema = z.object({
    type: z.literal('launch_frame'),
    name: miniAppNameSchema,
    url: secureUrlSchema.optional(),
    splashImageUrl: secureUrlSchema.optional(),
    splashBackgroundColor: hexColorSchema.optional(),
});
export const actionLaunchMiniAppSchema = z.object({
    type: z.literal('launch_miniapp'),
    name: miniAppNameSchema,
    url: secureUrlSchema.optional(),
    splashImageUrl: secureUrlSchema.optional(),
    splashBackgroundColor: hexColorSchema.optional(),
});
export const actionViewTokenSchema = z.object({
    type: z.literal('view_token'),
    token: caip19TokenSchema,
});
export const actionSchema = z.discriminatedUnion('type', [
    actionLaunchMiniAppSchema,
    actionViewTokenSchema,
    // Remove after compatibility period
    actionLaunchFrameSchema,
]);
export const buttonSchema = z.object({
    title: buttonTitleSchema,
    action: actionSchema,
});
export const miniAppEmbedNextSchema = z.object({
    version: z.literal('next'),
    imageUrl: secureUrlSchema,
    aspectRatio: aspectRatioSchema.optional(),
    button: buttonSchema,
});
export const safeParseMiniAppEmbed = (rawResponse) => miniAppEmbedNextSchema.safeParse(rawResponse);
// Backward compatibility - also parse fc:frame meta tags
export const safeParseFrameEmbed = safeParseMiniAppEmbed;
