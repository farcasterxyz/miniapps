import { z } from 'zod';
export declare const actionLaunchFrameSchema: z.ZodObject<{
    type: z.ZodLiteral<"launch_frame">;
    name: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    splashImageUrl: z.ZodOptional<z.ZodString>;
    splashBackgroundColor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "launch_frame";
    name: string;
    url?: string | undefined;
    splashImageUrl?: string | undefined;
    splashBackgroundColor?: string | undefined;
}, {
    type: "launch_frame";
    name: string;
    url?: string | undefined;
    splashImageUrl?: string | undefined;
    splashBackgroundColor?: string | undefined;
}>;
export declare const actionLaunchMiniAppSchema: z.ZodObject<{
    type: z.ZodLiteral<"launch_miniapp">;
    name: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    splashImageUrl: z.ZodOptional<z.ZodString>;
    splashBackgroundColor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "launch_miniapp";
    name: string;
    url?: string | undefined;
    splashImageUrl?: string | undefined;
    splashBackgroundColor?: string | undefined;
}, {
    type: "launch_miniapp";
    name: string;
    url?: string | undefined;
    splashImageUrl?: string | undefined;
    splashBackgroundColor?: string | undefined;
}>;
export declare const actionViewTokenSchema: z.ZodObject<{
    type: z.ZodLiteral<"view_token">;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "view_token";
    token: string;
}, {
    type: "view_token";
    token: string;
}>;
export declare const actionSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"launch_miniapp">;
    name: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    splashImageUrl: z.ZodOptional<z.ZodString>;
    splashBackgroundColor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "launch_miniapp";
    name: string;
    url?: string | undefined;
    splashImageUrl?: string | undefined;
    splashBackgroundColor?: string | undefined;
}, {
    type: "launch_miniapp";
    name: string;
    url?: string | undefined;
    splashImageUrl?: string | undefined;
    splashBackgroundColor?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"view_token">;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "view_token";
    token: string;
}, {
    type: "view_token";
    token: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"launch_frame">;
    name: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    splashImageUrl: z.ZodOptional<z.ZodString>;
    splashBackgroundColor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "launch_frame";
    name: string;
    url?: string | undefined;
    splashImageUrl?: string | undefined;
    splashBackgroundColor?: string | undefined;
}, {
    type: "launch_frame";
    name: string;
    url?: string | undefined;
    splashImageUrl?: string | undefined;
    splashBackgroundColor?: string | undefined;
}>]>;
export declare const buttonSchema: z.ZodObject<{
    title: z.ZodString;
    action: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"launch_miniapp">;
        name: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        splashImageUrl: z.ZodOptional<z.ZodString>;
        splashBackgroundColor: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "launch_miniapp";
        name: string;
        url?: string | undefined;
        splashImageUrl?: string | undefined;
        splashBackgroundColor?: string | undefined;
    }, {
        type: "launch_miniapp";
        name: string;
        url?: string | undefined;
        splashImageUrl?: string | undefined;
        splashBackgroundColor?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"view_token">;
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "view_token";
        token: string;
    }, {
        type: "view_token";
        token: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"launch_frame">;
        name: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        splashImageUrl: z.ZodOptional<z.ZodString>;
        splashBackgroundColor: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "launch_frame";
        name: string;
        url?: string | undefined;
        splashImageUrl?: string | undefined;
        splashBackgroundColor?: string | undefined;
    }, {
        type: "launch_frame";
        name: string;
        url?: string | undefined;
        splashImageUrl?: string | undefined;
        splashBackgroundColor?: string | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    title: string;
    action: {
        type: "launch_frame";
        name: string;
        url?: string | undefined;
        splashImageUrl?: string | undefined;
        splashBackgroundColor?: string | undefined;
    } | {
        type: "launch_miniapp";
        name: string;
        url?: string | undefined;
        splashImageUrl?: string | undefined;
        splashBackgroundColor?: string | undefined;
    } | {
        type: "view_token";
        token: string;
    };
}, {
    title: string;
    action: {
        type: "launch_frame";
        name: string;
        url?: string | undefined;
        splashImageUrl?: string | undefined;
        splashBackgroundColor?: string | undefined;
    } | {
        type: "launch_miniapp";
        name: string;
        url?: string | undefined;
        splashImageUrl?: string | undefined;
        splashBackgroundColor?: string | undefined;
    } | {
        type: "view_token";
        token: string;
    };
}>;
export declare const miniAppEmbedNextSchema: z.ZodObject<{
    version: z.ZodLiteral<"next">;
    imageUrl: z.ZodString;
    aspectRatio: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"1:1">, z.ZodLiteral<"3:2">]>>;
    button: z.ZodObject<{
        title: z.ZodString;
        action: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"launch_miniapp">;
            name: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            splashImageUrl: z.ZodOptional<z.ZodString>;
            splashBackgroundColor: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        }, {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"view_token">;
            token: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "view_token";
            token: string;
        }, {
            type: "view_token";
            token: string;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"launch_frame">;
            name: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            splashImageUrl: z.ZodOptional<z.ZodString>;
            splashBackgroundColor: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        }, {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        action: {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "view_token";
            token: string;
        };
    }, {
        title: string;
        action: {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "view_token";
            token: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    version: "next";
    imageUrl: string;
    button: {
        title: string;
        action: {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "view_token";
            token: string;
        };
    };
    aspectRatio?: "1:1" | "3:2" | undefined;
}, {
    version: "next";
    imageUrl: string;
    button: {
        title: string;
        action: {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "view_token";
            token: string;
        };
    };
    aspectRatio?: "1:1" | "3:2" | undefined;
}>;
export declare const safeParseMiniAppEmbed: (rawResponse: unknown) => z.SafeParseReturnType<{
    version: "next";
    imageUrl: string;
    button: {
        title: string;
        action: {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "view_token";
            token: string;
        };
    };
    aspectRatio?: "1:1" | "3:2" | undefined;
}, {
    version: "next";
    imageUrl: string;
    button: {
        title: string;
        action: {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "view_token";
            token: string;
        };
    };
    aspectRatio?: "1:1" | "3:2" | undefined;
}>;
export declare const safeParseFrameEmbed: (rawResponse: unknown) => z.SafeParseReturnType<{
    version: "next";
    imageUrl: string;
    button: {
        title: string;
        action: {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "view_token";
            token: string;
        };
    };
    aspectRatio?: "1:1" | "3:2" | undefined;
}, {
    version: "next";
    imageUrl: string;
    button: {
        title: string;
        action: {
            type: "launch_frame";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "launch_miniapp";
            name: string;
            url?: string | undefined;
            splashImageUrl?: string | undefined;
            splashBackgroundColor?: string | undefined;
        } | {
            type: "view_token";
            token: string;
        };
    };
    aspectRatio?: "1:1" | "3:2" | undefined;
}>;
export type MiniAppEmbedNext = z.infer<typeof miniAppEmbedNextSchema>;
export type FrameEmbedNext = MiniAppEmbedNext;
