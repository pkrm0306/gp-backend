"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENEW_VENDOR_PROCESS_LOCK_STATUSES = exports.PRODUCT_RENEW_STATUS = exports.RENEWAL_URN_STATUS_LABELS = exports.RENEWAL_URN_STATUS_ALLOWED_VALUES = exports.RENEWAL_URN_STATUS = void 0;
exports.isRenewalUrnStatus = isRenewalUrnStatus;
exports.shouldUseRenewWorkflowForUrn = shouldUseRenewWorkflowForUrn;
exports.getRenewalUrnStatusLabel = getRenewalUrnStatusLabel;
exports.RENEWAL_URN_STATUS = {
    COMPLETED: 11,
    PAYMENT_PENDING: 12,
    PAYMENT_SUBMITTED: 13,
    PAYMENT_APPROVED: 14,
    CHECK_PROCESS_FORMS: 15,
    VENDOR_RESPONSE_PENDING: 16,
    FINAL_VERIFICATION_PENDING: 17,
};
/** Valid `updateStatusTo` values for PATCH /renew/urn-status only. */
exports.RENEWAL_URN_STATUS_ALLOWED_VALUES = [
    11, 12, 13, 14, 15, 16, 17,
];
exports.RENEWAL_URN_STATUS_LABELS = {
    11: 'Renewal Completed',
    12: 'Renewal Payment Pending',
    13: 'Renewal Payment Submitted',
    14: 'Renewal Payment Approved',
    15: 'Check Process Forms',
    16: 'Vendor Response Pending',
    17: 'Final Verification Pending',
};
exports.PRODUCT_RENEW_STATUS = {
    NOT_RENEWED: 0,
    IN_PROGRESS: 1,
    RENEWED: 2,
};
function isRenewalUrnStatus(status) {
    return status === exports.RENEWAL_URN_STATUS.COMPLETED || (status >= 12 && status <= 17);
}
/**
 * Certified complete (`urnStatus` 11, `productRenewStatus` 0) shares code 11 with renewal
 * complete — route renew APIs only when the URN is actually in renewal workflow.
 */
function shouldUseRenewWorkflowForUrn(params) {
    var _a, _b;
    var urnStatus = Number((_a = params.urnStatus) !== null && _a !== void 0 ? _a : 0);
    var productRenewStatus = Number((_b = params.productRenewStatus) !== null && _b !== void 0 ? _b : 0);
    if (urnStatus >= 12 && urnStatus <= 17) {
        return true;
    }
    if (urnStatus === exports.RENEWAL_URN_STATUS.COMPLETED) {
        return (productRenewStatus === exports.PRODUCT_RENEW_STATUS.IN_PROGRESS ||
            productRenewStatus === exports.PRODUCT_RENEW_STATUS.RENEWED);
    }
    return false;
}
/** Vendor cannot edit renew process tabs when URN is in these statuses. */
exports.RENEW_VENDOR_PROCESS_LOCK_STATUSES = new Set([
    exports.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
    exports.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
    exports.RENEWAL_URN_STATUS.COMPLETED,
]);
function getRenewalUrnStatusLabel(status) {
    var _a;
    return (_a = exports.RENEWAL_URN_STATUS_LABELS[status]) !== null && _a !== void 0 ? _a : "Unknown renewal status (".concat(status, ")");
}
