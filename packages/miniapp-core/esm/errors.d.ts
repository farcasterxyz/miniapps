export type GlobalErrorType<name extends string = 'Error'> = Error & {
    name: name;
};
export declare class BaseError<cause extends Error | undefined = undefined> extends Error {
    name: string;
    cause: cause;
    constructor(message: string, options?: BaseError.Options<cause>);
}
export declare namespace BaseError {
    type Options<cause extends Error | undefined = Error | undefined> = {
        cause?: cause | undefined;
    };
}
