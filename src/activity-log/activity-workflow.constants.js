"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.URN_STATUS_PENDING_ACTIVITY = exports.WORKFLOW_REJECT_TARGET = exports.WORKFLOW_COMPLETE_NEXT = exports.PRODUCT_REGISTRATION_WORKFLOW_STEPS = exports.PRODUCT_REGISTRATION_ACTIVITY_ID = exports.ActivityWorkflowItemStatus = void 0;
exports.workflowActivityName = workflowActivityName;
exports.workflowActivityResponsibility = workflowActivityResponsibility;
exports.workflowForwardNextActivityId = workflowForwardNextActivityId;
exports.isWorkflowActivityId = isWorkflowActivityId;
/** Each workflow activity is either Pending or Done. */
var ActivityWorkflowItemStatus;
(function (ActivityWorkflowItemStatus) {
    ActivityWorkflowItemStatus[ActivityWorkflowItemStatus["Pending"] = 0] = "Pending";
    ActivityWorkflowItemStatus[ActivityWorkflowItemStatus["Done"] = 1] = "Done";
})(ActivityWorkflowItemStatus || (exports.ActivityWorkflowItemStatus = ActivityWorkflowItemStatus = {}));
/**
 * Product registration workflow activity ids (canonical order).
 * Id `6` is reserved for legacy rows ("Process Forms Submission") and is not used in forward flow.
 */
exports.PRODUCT_REGISTRATION_ACTIVITY_ID = {
    PRODUCT_REGISTRATION: 0,
    PRODUCT_APPROVE_REJECT: 1,
    ASSIGN_REGISTRATION_FEE: 2,
    APPROVE_REJECT_REG_FEE_PROPOSAL_PAYMENT: 3,
    APPROVE_REJECT_REGISTRATION_FEE: 4,
    PROCESS_FORMS_IN_PROGRESS: 5,
    /** Legacy only — forward flow goes 5 → 7 */
    PROCESS_FORMS_SUBMISSION_LEGACY: 6,
    REVIEW_SUBMIT_FINAL_REVIEW: 7,
    ASSIGN_CERTIFICATION_FEE: 8,
    CERTIFICATION_FEE_PAYMENT: 9,
    APPROVE_REJECT_CERTIFICATION_FEE: 10,
};
exports.PRODUCT_REGISTRATION_WORKFLOW_STEPS = (_a = {},
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION] = {
        activity: 'Product Registration',
        responsibility: 'Manufacturer',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT] = {
        activity: 'Product Approve/Reject',
        responsibility: 'Admin',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE] = {
        activity: 'Assign Registration Fee',
        responsibility: 'Admin',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REG_FEE_PROPOSAL_PAYMENT] = {
        activity: 'Approve/Reject Registration Fee Proposal & Payment',
        responsibility: 'Manufacturer',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REGISTRATION_FEE] = {
        activity: 'Approve/Reject Registration Fee',
        responsibility: 'Admin',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS] = {
        activity: 'Process Forms in Progress',
        responsibility: 'Manufacturer',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_SUBMISSION_LEGACY] = {
        activity: 'Process Forms Submission',
        responsibility: 'Manufacturer',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.REVIEW_SUBMIT_FINAL_REVIEW] = {
        activity: 'Review & Submit for Final Review',
        responsibility: 'Admin',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_CERTIFICATION_FEE] = {
        activity: 'Assign Certification Fee',
        responsibility: 'Admin',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.CERTIFICATION_FEE_PAYMENT] = {
        activity: 'Certification Fee Payment',
        responsibility: 'Manufacturer',
    },
    _a[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE] = {
        activity: 'Approve/Reject Certification Fee',
        responsibility: 'Admin',
    },
    _a);
/** Forward transitions when an activity is completed successfully. */
exports.WORKFLOW_COMPLETE_NEXT = (_b = {},
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE,
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REG_FEE_PROPOSAL_PAYMENT,
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REG_FEE_PROPOSAL_PAYMENT] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REGISTRATION_FEE,
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REGISTRATION_FEE] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS,
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.REVIEW_SUBMIT_FINAL_REVIEW,
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.REVIEW_SUBMIT_FINAL_REVIEW] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_CERTIFICATION_FEE,
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_CERTIFICATION_FEE] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.CERTIFICATION_FEE_PAYMENT,
    _b[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.CERTIFICATION_FEE_PAYMENT] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE,
    _b);
/** Rollback target when an approval step is rejected. */
exports.WORKFLOW_REJECT_TARGET = (_c = {},
    _c[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION,
    _c[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REG_FEE_PROPOSAL_PAYMENT] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE,
    _c[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REGISTRATION_FEE] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REG_FEE_PROPOSAL_PAYMENT,
    _c[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.REVIEW_SUBMIT_FINAL_REVIEW] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS,
    _c[exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE] = exports.PRODUCT_REGISTRATION_ACTIVITY_ID.CERTIFICATION_FEE_PAYMENT,
    _c);
/**
 * Maps `products.urnStatus` to the activity that should be Pending.
 * Renewal statuses (12+) are managed by the renew module.
 */
exports.URN_STATUS_PENDING_ACTIVITY = {
    0: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
    1: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE,
    2: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REG_FEE_PROPOSAL_PAYMENT,
    3: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_REG_FEE_PROPOSAL_PAYMENT,
    4: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.REVIEW_SUBMIT_FINAL_REVIEW,
    5: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS,
    6: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_CERTIFICATION_FEE,
    7: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.CERTIFICATION_FEE_PAYMENT,
    8: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.CERTIFICATION_FEE_PAYMENT,
    9: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE,
    10: exports.PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE,
    11: null,
};
function workflowActivityName(activityId) {
    var _a, _b;
    return ((_b = (_a = exports.PRODUCT_REGISTRATION_WORKFLOW_STEPS[activityId]) === null || _a === void 0 ? void 0 : _a.activity) !== null && _b !== void 0 ? _b : 'Unknown Activity');
}
function workflowActivityResponsibility(activityId) {
    var _a, _b;
    return ((_b = (_a = exports.PRODUCT_REGISTRATION_WORKFLOW_STEPS[activityId]) === null || _a === void 0 ? void 0 : _a.responsibility) !== null && _b !== void 0 ? _b : 'Manufacturer');
}
function workflowForwardNextActivityId(activityId) {
    var next = exports.WORKFLOW_COMPLETE_NEXT[activityId];
    return next === undefined ? null : next;
}
function isWorkflowActivityId(value) {
    return value in exports.PRODUCT_REGISTRATION_WORKFLOW_STEPS;
}
