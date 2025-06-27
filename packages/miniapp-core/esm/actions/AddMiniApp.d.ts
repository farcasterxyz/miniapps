import * as Errors from '../errors.ts';
import type { OneOf } from '../internal/types.ts';
import type { MiniAppNotificationDetails } from '../schemas/index.ts';
export type AddMiniAppResult = {
    notificationDetails?: MiniAppNotificationDetails;
};
export type AddMiniApp = () => Promise<AddMiniAppResult>;
type InvalidDomainManifestJsonError = {
    type: 'invalid_domain_manifest';
};
type RejectedByUserJsonError = {
    type: 'rejected_by_user';
};
export type AddMiniAppJsonError = InvalidDomainManifestJsonError | RejectedByUserJsonError;
export type AddMiniAppRejectedReason = AddMiniAppJsonError['type'];
export type AddMiniAppJsonResult = OneOf<{
    result: AddMiniAppResult;
} | {
    error: AddMiniAppJsonError;
}>;
export type WireAddMiniApp = () => Promise<AddMiniAppJsonResult>;
/**
 * Thrown when the miniapp does not have a valid domain manifest.
 */
export declare class InvalidDomainManifest extends Errors.BaseError {
    readonly name = "AddMiniApp.InvalidDomainManifest";
    constructor();
}
/**
 * Thrown when add miniapp action was rejected by the user.
 */
export declare class RejectedByUser extends Errors.BaseError {
    readonly name = "AddMiniApp.RejectedByUser";
    constructor();
}
export {};
