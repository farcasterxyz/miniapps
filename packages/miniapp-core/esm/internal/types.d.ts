type Compute<type> = {
    [key in keyof type]: type[key];
} & unknown;
type KeyofUnion<type> = type extends type ? keyof type : never;
export type OneOf<union extends object, fallback extends object | undefined = undefined, keys extends KeyofUnion<union> = KeyofUnion<union>> = union extends infer item ? Compute<item & {
    [key in Exclude<keys, keyof item>]?: fallback extends object ? key extends keyof fallback ? fallback[key] : undefined : undefined;
}> : never;
export {};
