export class BaseError extends Error {
    name = 'BaseError';
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
    }
}
