import * as Errors from "../errors.js";
/**
 * Thrown when a sign in action was rejected.
 */
export class RejectedByUser extends Errors.BaseError {
    name = 'SignIn.RejectedByUser';
    constructor() {
        super('Sign in rejected by user');
    }
}
