"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENEW_PROCESS_TAB_STEP_ID = exports.RENEW_PROCESS_TAB_LABELS = exports.RENEW_PROCESS_TAB_REVIEW_KEYS = exports.RENEW_ADMIN_REVIEW_URN_STATUS = exports.RENEW_VENDOR_RESUBMIT_URN_STATUS = exports.RENEW_TAB_REVIEW_STATUS = void 0;
exports.isRenewProcessTabKey = isRenewProcessTabKey;
exports.buildRenewRequiredReviewSlots = buildRenewRequiredReviewSlots;
/** Admin renewal section review: `0` pending, `1` approved, `2` rejected */
exports.RENEW_TAB_REVIEW_STATUS = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
};
/** Vendor may re-edit rejected tabs only. */
exports.RENEW_VENDOR_RESUBMIT_URN_STATUS = 16;
/** Admin section review enabled. */
exports.RENEW_ADMIN_REVIEW_URN_STATUS = 15;
exports.RENEW_PROCESS_TAB_REVIEW_KEYS = [
    'product-performance',
    'manufacturing-process',
    'waste-management',
    'innovation',
];
exports.RENEW_PROCESS_TAB_LABELS = {
    'product-performance': 'Product Performance',
    'manufacturing-process': 'Manufacturing Process',
    'waste-management': 'Waste Management',
    innovation: 'Innovation',
};
exports.RENEW_PROCESS_TAB_STEP_ID = 0;
function isRenewProcessTabKey(tabKey) {
    return exports.RENEW_PROCESS_TAB_REVIEW_KEYS.includes(tabKey);
}
function buildRenewRequiredReviewSlots() {
    return exports.RENEW_PROCESS_TAB_REVIEW_KEYS.map(function (tabKey) { return ({
        tabKey: tabKey,
        stepId: null,
        label: exports.RENEW_PROCESS_TAB_LABELS[tabKey],
    }); });
}
