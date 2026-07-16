"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VENDOR_URN_FINAL_REVIEW_PROCESS_LOCK_MESSAGE = exports.VENDOR_PROCESS_TAB_KEYS = exports.VENDOR_ALWAYS_ENABLED_TAB_KEYS = exports.VENDOR_CERTIFICATION_FEE_APPROVED_URN_STATUS = void 0;
exports.isVendorFinalReviewProcessLock = isVendorFinalReviewProcessLock;
exports.resolveVendorProcessEditBlockReason = resolveVendorProcessEditBlockReason;
exports.isVendorProcessTabNavigationLocked = isVendorProcessTabNavigationLocked;
exports.buildVendorUrnTabAccess = buildVendorUrnTabAccess;
var category_change_constants_1 = require("../../product-registration/constants/category-change.constants");
var urn_tab_review_constants_1 = require("../../product-registration/constants/urn-tab-review.constants");
var renewal_urn_status_constants_1 = require("../../renew/constants/renewal-urn-status.constants");
/** Certification fee approved — vendor process tabs may open again (read-only when certified). */
exports.VENDOR_CERTIFICATION_FEE_APPROVED_URN_STATUS = 11;
exports.VENDOR_ALWAYS_ENABLED_TAB_KEYS = [
    'quick_view',
    'payment',
];
exports.VENDOR_PROCESS_TAB_KEYS = [
    'product_design',
    'product_performance',
    'manufacturing_process',
    'waste_management',
    'life_cycle_approach',
    'product_stewardship',
    'innovation',
    'raw_materials',
];
exports.VENDOR_URN_FINAL_REVIEW_PROCESS_LOCK_MESSAGE = 'Process forms are locked while admin completes final review and certification fee approval.';
function isVendorFinalReviewProcessLock(urnStatus, productRenewStatus) {
    if ((0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
        urnStatus: urnStatus,
        productRenewStatus: productRenewStatus,
    })) {
        return false;
    }
    return (urnStatus >= category_change_constants_1.ADMIN_FINAL_SUBMIT_URN_STATUS &&
        urnStatus < exports.VENDOR_CERTIFICATION_FEE_APPROVED_URN_STATUS);
}
function resolveVendorProcessEditBlockReason(params) {
    var _a;
    var urnStatus = Number((_a = params.urnStatus) !== null && _a !== void 0 ? _a : 0);
    var productRenewStatus = params.productRenewStatus;
    if ((0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
        urnStatus: urnStatus,
        productRenewStatus: productRenewStatus,
    })) {
        return null;
    }
    if (urnStatus === urn_tab_review_constants_1.ADMIN_REVIEW_URN_STATUS) {
        return 'This URN is submitted for review and cannot be edited.';
    }
    if (isVendorFinalReviewProcessLock(urnStatus, productRenewStatus)) {
        return exports.VENDOR_URN_FINAL_REVIEW_PROCESS_LOCK_MESSAGE;
    }
    return null;
}
function isVendorProcessTabNavigationLocked(params) {
    var _a;
    var urnStatus = Number((_a = params.urnStatus) !== null && _a !== void 0 ? _a : 0);
    if ((0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
        urnStatus: urnStatus,
        productRenewStatus: params.productRenewStatus,
    })) {
        return false;
    }
    if (urnStatus === urn_tab_review_constants_1.VENDOR_RESUBMIT_URN_STATUS) {
        return false;
    }
    return (urnStatus === urn_tab_review_constants_1.ADMIN_REVIEW_URN_STATUS ||
        isVendorFinalReviewProcessLock(urnStatus, params.productRenewStatus));
}
function buildVendorUrnTabAccess(params) {
    var _a;
    var urnNo = params.urnNo;
    var urnStatus = Number((_a = params.urnStatus) !== null && _a !== void 0 ? _a : 0);
    var productRenewStatus = params.productRenewStatus;
    var lockReason = resolveVendorProcessEditBlockReason({
        urnStatus: urnStatus,
        productRenewStatus: productRenewStatus,
    });
    var processTabsLocked = isVendorProcessTabNavigationLocked({
        urnStatus: urnStatus,
        productRenewStatus: productRenewStatus,
    });
    var enabledTabs = __spreadArray([], exports.VENDOR_ALWAYS_ENABLED_TAB_KEYS, true);
    var disabledTabs = [];
    var tabs = {};
    for (var _i = 0, VENDOR_ALWAYS_ENABLED_TAB_KEYS_1 = exports.VENDOR_ALWAYS_ENABLED_TAB_KEYS; _i < VENDOR_ALWAYS_ENABLED_TAB_KEYS_1.length; _i++) {
        var key = VENDOR_ALWAYS_ENABLED_TAB_KEYS_1[_i];
        tabs[key] = { enabled: true, readOnly: false };
    }
    for (var _b = 0, VENDOR_PROCESS_TAB_KEYS_1 = exports.VENDOR_PROCESS_TAB_KEYS; _b < VENDOR_PROCESS_TAB_KEYS_1.length; _b++) {
        var key = VENDOR_PROCESS_TAB_KEYS_1[_b];
        var enabled = !processTabsLocked;
        tabs[key] = { enabled: enabled, readOnly: !enabled };
        if (enabled) {
            enabledTabs.push(key);
        }
        else {
            disabledTabs.push(key);
        }
    }
    return {
        urnNo: urnNo,
        urnStatus: urnStatus,
        quickViewEnabled: true,
        paymentEnabled: true,
        processTabsLocked: processTabsLocked,
        restrictProcessTabs: processTabsLocked,
        lockReason: lockReason,
        enabledTabs: enabledTabs,
        disabledTabs: disabledTabs,
        tabs: tabs,
    };
}
