"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URN_STATUS_LABELS = void 0;
exports.urnStatusLabel = urnStatusLabel;
exports.manufacturerStatusKey = manufacturerStatusKey;
var activity_lifecycle_constants_1 = require("../activity-log/activity-lifecycle.constants");
/** URN lifecycle labels (matches activity log lifecycle). */
exports.URN_STATUS_LABELS = Object.fromEntries(Object.entries(activity_lifecycle_constants_1.ACTIVITY_LIFECYCLE_STEPS).map(function (_a) {
    var status = _a[0], step = _a[1];
    return [
        Number(status),
        step.activity,
    ];
}));
function urnStatusLabel(status) {
    var _a;
    return (_a = exports.URN_STATUS_LABELS[status]) !== null && _a !== void 0 ? _a : "Unknown (".concat(status, ")");
}
function manufacturerStatusKey(status) {
    switch (status) {
        case 1:
            return 'verified';
        case 2:
            return 'unverified';
        default:
            return 'inactivePending';
    }
}
