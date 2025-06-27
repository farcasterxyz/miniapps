import { z } from 'zod';
export declare const createSimpleStringSchema: ({ max, noSpaces, }?: {
    max?: number;
    noSpaces?: boolean;
}) => z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>;
export declare const secureUrlSchema: z.ZodString;
export declare const miniAppNameSchema: z.ZodString;
export declare const buttonTitleSchema: z.ZodString;
export declare const caip19TokenSchema: z.ZodString;
export declare const hexColorSchema: z.ZodString;
export declare const domainSchema: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>;
export declare const aspectRatioSchema: z.ZodUnion<[z.ZodLiteral<"1:1">, z.ZodLiteral<"3:2">]>;
export declare const encodedJsonFarcasterSignatureSchema: z.ZodObject<{
    header: z.ZodString;
    payload: z.ZodString;
    signature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    header: string;
    payload: string;
    signature: string;
}, {
    header: string;
    payload: string;
    signature: string;
}>;
export type EncodedJsonFarcasterSignatureSchema = z.infer<typeof encodedJsonFarcasterSignatureSchema>;
export declare const jsonFarcasterSignatureHeaderSchema: z.ZodObject<{
    fid: z.ZodNumber;
    type: z.ZodLiteral<"app_key">;
    key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "app_key";
    fid: number;
    key: string;
}, {
    type: "app_key";
    fid: number;
    key: string;
}>;
export type JsonFarcasterSignatureHeaderSchema = z.infer<typeof jsonFarcasterSignatureHeaderSchema>;
