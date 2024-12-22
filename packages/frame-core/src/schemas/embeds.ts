import { z } from "zod";
import {
  hexColorSchema,
  frameNameSchema,
  secureUrlSchema,
  buttonTitleSchema,
} from "./shared";

export const actionLaunchFrameSchema = z.object({
  type: z.literal("launch_frame"),
  name: frameNameSchema,
  url: secureUrlSchema,
  splashImageUrl: secureUrlSchema.optional(),
  splashBackgroundColor: hexColorSchema.optional(),
});

export const actionSchema = z.discriminatedUnion("type", [
  actionLaunchFrameSchema,
]);

export const buttonSchema = z.object({
  title: buttonTitleSchema,
  action: actionSchema,
});

export const frameEmbedNextSchema = z.object({
  version: z.literal("next"),
  imageUrl: secureUrlSchema,
  button: buttonSchema,
});

export const safeParseFrameEmbed = (rawResponse: unknown) =>
  frameEmbedNextSchema.safeParse(rawResponse);

export type FrameEmbedNext = z.infer<typeof frameEmbedNextSchema>;
