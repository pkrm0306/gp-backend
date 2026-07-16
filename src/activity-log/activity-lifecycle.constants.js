"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIVITY_LIFECYCLE_STEPS = exports.ACTIVITY_LIFECYCLE_MAX_STATUS = void 0;
exports.activityLifecycleName = activityLifecycleName;
exports.activityLifecycleResponsibility = activityLifecycleResponsibility;
exports.nextActivityLifecycleStatus = nextActivityLifecycleStatus;
exports.ACTIVITY_LIFECYCLE_MAX_STATUS = 11;
exports.ACTIVITY_LIFECYCLE_STEPS = {
    0: {
        activity: 'Product Registration',
        responsibility: 'Manufacturer',
    },
    1: {
        activity: 'Product Approve/Reject',
        responsibility: 'Admin',
    },
    2: {
        activity: 'Assign Registration Fee',
        responsibility: 'Admin',
    },
    3: {
        activity: 'Approve/Reject Registration Fee Proposal & Payment',
        responsibility: 'Manufacturer',
    },
    4: {
        activity: 'Approve/Reject Registration Fee',
        responsibility: 'Admin',
    },
    5: {
        activity: 'Process Forms in Progress',
        responsibility: 'Manufacturer',
    },
    6: {
        activity: 'Process Forms Submission',
        responsibility: 'Manufacturer',
    },
    7: {
        activity: 'Review & Submit for Final Review',
        responsibility: 'Admin',
    },
    8: {
        activity: 'Assign Certification Fee',
        responsibility: 'Admin',
    },
    9: {
        activity: 'Certification Fee Payment',
        responsibility: 'Manufacturer',
    },
    10: {
        activity: 'Approve/Reject Certification Fee',
        responsibility: 'Admin',
    },
    11: {
        activity: 'Product renewal completed',
        responsibility: 'Admin',
    },
};
function activityLifecycleName(status) {
    var _a, _b;
    return (_b = (_a = exports.ACTIVITY_LIFECYCLE_STEPS[status]) === null || _a === void 0 ? void 0 : _a.activity) !== null && _b !== void 0 ? _b : 'Unknown Activity';
}
function activityLifecycleResponsibility(status) {
    var _a, _b;
    return (_b = (_a = exports.ACTIVITY_LIFECYCLE_STEPS[status]) === null || _a === void 0 ? void 0 : _a.responsibility) !== null && _b !== void 0 ? _b : 'Manufacturer';
}
function nextActivityLifecycleStatus(currentStatus) {
    if (currentStatus >= exports.ACTIVITY_LIFECYCLE_MAX_STATUS) {
        return exports.ACTIVITY_LIFECYCLE_MAX_STATUS;
    }
    return Math.min(currentStatus + 1, exports.ACTIVITY_LIFECYCLE_MAX_STATUS);
}
