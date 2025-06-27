export class BaseError extends Error {
    name = 'BaseError';
    cause;
    constructor(message, options = {}) {
        super(message, options.cause ? { cause: options.cause } : undefined);
        this.cause = options.cause;
    }
}
