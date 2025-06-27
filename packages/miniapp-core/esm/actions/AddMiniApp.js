import * as Errors from "../errors.js";
/**
 * Thrown when the miniapp does not have a valid domain manifest.
 */
export class InvalidDomainManifest extends Errors.BaseError {
    name = 'AddMiniApp.InvalidDomainManifest';
    constructor() {
        super('Invalid domain manifest');
    }
}
/**
 * Thrown when add miniapp action was rejected by the user.
 */
export class RejectedByUser extends Errors.BaseError {
    name = 'AddMiniApp.RejectedByUser';
    constructor() {
        super('Add miniapp rejected by user');
    }
}
