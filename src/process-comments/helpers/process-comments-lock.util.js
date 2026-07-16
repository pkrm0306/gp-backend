"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROCESS_COMMENTS_LOCKED_MESSAGE = exports.PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS = void 0;
exports.canAdminSaveUncertifiedProcessComments = canAdminSaveUncertifiedProcessComments;
exports.resolveProcessCommentsBlockReason = resolveProcessCommentsBlockReason;
/** Vendor submitted certification payment for admin review (`urnStatus` 8). */
exports.PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS = 8;
exports.PROCESS_COMMENTS_LOCKED_MESSAGE = 'Admin technical/final advise cannot be saved after the vendor has submitted certification payment for review (urnStatus >= 8)';
/**
 * Uncertified URN process tabs: admin may save technical/final advise only before
 * the vendor submits certification payment for review.
 */
function canAdminSaveUncertifiedProcessComments(params) {
    var _a, _b;
    var urnStatus = Number((_a = params.urnStatus) !== null && _a !== void 0 ? _a : 0);
    var productStatus = Number((_b = params.productStatus) !== null && _b !== void 0 ? _b : 0);
    if (productStatus === 2) {
        return false;
    }
    return urnStatus < exports.PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS;
}
function resolveProcessCommentsBlockReason(params) {
    var _a;
    if (canAdminSaveUncertifiedProcessComments(params)) {
        return null;
    }
    var productStatus = Number((_a = params.productStatus) !== null && _a !== void 0 ? _a : 0);
    if (productStatus === 2) {
        return 'Process comments are read-only for certified products on this screen';
    }
    return exports.PROCESS_COMMENTS_LOCKED_MESSAGE;
}
