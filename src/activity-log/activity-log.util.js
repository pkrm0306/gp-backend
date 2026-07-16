"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AUXILIARY_ACTIVITY_SUB_IDS = void 0;
exports.isAuxiliaryActivityLog = isAuxiliaryActivityLog;
exports.resolveCurrentWorkflowActivityLog = resolveCurrentWorkflowActivityLog;
exports.normalizeUrnNo = normalizeUrnNo;
exports.urnCandidates = urnCandidates;
exports.isAdminPortalRole = isAdminPortalRole;
exports.isVendorPortalRole = isVendorPortalRole;
exports.callerOrganizationId = callerOrganizationId;
exports.formatActivityLogRow = formatActivityLogRow;
var activity_lifecycle_constants_1 = require("./activity-lifecycle.constants");
var activity_workflow_constants_1 = require("./activity-workflow.constants");
/** Marks timeline rows that must not become Quick View "current activity". */
exports.AUXILIARY_ACTIVITY_SUB_IDS = {
    URN_SITE_VISIT: 1,
};
var SITE_VISIT_ACTIVITY_PREFIXES = [
    'Admin added site visit ',
    'Admin updated site visit ',
    'Admin deleted site visit ',
];
function isAuxiliaryActivityLog(row) {
    var _a;
    var subId = Number(row.sub_activities_id);
    if (subId === exports.AUXILIARY_ACTIVITY_SUB_IDS.URN_SITE_VISIT) {
        return true;
    }
    var activity = String((_a = row.activity) !== null && _a !== void 0 ? _a : '').trim();
    return SITE_VISIT_ACTIVITY_PREFIXES.some(function (prefix) {
        return activity.startsWith(prefix);
    });
}
function sortActivityLogsChronologically(logs) {
    return __spreadArray([], logs, true).sort(function (a, b) {
        var _a, _b, _c, _d;
        var ta = new Date((_b = (_a = a.created_at) !== null && _a !== void 0 ? _a : a.createdAt) !== null && _b !== void 0 ? _b : 0).getTime();
        var tb = new Date((_d = (_c = b.created_at) !== null && _c !== void 0 ? _c : b.createdAt) !== null && _d !== void 0 ? _d : 0).getTime();
        return ta - tb;
    });
}
/**
 * Quick View current step — last lifecycle row, skipping auxiliary admin events
 * (e.g. site visit CRUD) that must not override workflow stage.
 */
function resolveCurrentWorkflowActivityLog(logs, urnStatus) {
    var sorted = sortActivityLogsChronologically(logs);
    for (var i = sorted.length - 1; i >= 0; i -= 1) {
        var row = sorted[i];
        if (isAuxiliaryActivityLog(row)) {
            continue;
        }
        if (Number(row.status) === activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending) {
            return __assign(__assign({}, formatActivityLogRow(row)), { status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending });
        }
    }
    for (var i = sorted.length - 1; i >= 0; i -= 1) {
        var row = sorted[i];
        if (isAuxiliaryActivityLog(row)) {
            continue;
        }
        return __assign(__assign({}, formatActivityLogRow(row)), { status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending });
    }
    if (typeof urnStatus !== 'number' || !Number.isFinite(urnStatus)) {
        return null;
    }
    var status = Math.trunc(urnStatus);
    var nextId = (0, activity_lifecycle_constants_1.nextActivityLifecycleStatus)(status);
    return {
        activities_id: status,
        activity_status: status,
        activity: (0, activity_lifecycle_constants_1.activityLifecycleName)(status),
        status: 0,
        responsibility: (0, activity_lifecycle_constants_1.activityLifecycleResponsibility)(status),
        next_acitivities_id: nextId,
        next_activity: (0, activity_lifecycle_constants_1.activityLifecycleName)(nextId),
        next_responsibility: (0, activity_lifecycle_constants_1.activityLifecycleResponsibility)(nextId),
    };
}
function normalizeUrnNo(value) {
    return String(value !== null && value !== void 0 ? value : '')
        .trim()
        .replace(/\/+$/g, '');
}
function urnCandidates(urnNo) {
    var normalized = normalizeUrnNo(urnNo);
    if (!normalized)
        return [];
    return [normalized, "".concat(normalized, "/")];
}
function isAdminPortalRole(role) {
    var r = String(role !== null && role !== void 0 ? role : '').toLowerCase();
    return r === 'admin' || r === 'staff';
}
function isVendorPortalRole(role) {
    var r = String(role !== null && role !== void 0 ? role : '').toLowerCase();
    return r === 'vendor' || r === 'partner';
}
function callerOrganizationId(user) {
    var _a;
    if (!user)
        return undefined;
    var id = (_a = user.manufacturerId) !== null && _a !== void 0 ? _a : user.vendorId;
    return id !== undefined && id !== null ? String(id) : undefined;
}
function formatActivityLogRow(doc) {
    var _a, _b, _c, _d, _e;
    var plain = typeof doc.toObject === 'function'
        ? doc.toObject()
        : __assign({}, doc);
    var createdAt = (_a = plain.created_at) !== null && _a !== void 0 ? _a : plain.createdAt;
    var updatedAt = (_b = plain.updated_at) !== null && _b !== void 0 ? _b : plain.updatedAt;
    return __assign(__assign({}, plain), { _id: plain._id != null ? String(plain._id) : undefined, urnNo: (_c = plain.urn_no) !== null && _c !== void 0 ? _c : plain.urnNo, urn_no: (_d = plain.urn_no) !== null && _d !== void 0 ? _d : plain.urnNo, activity: plain.activity, status: plain.status, activity_status: (_e = plain.activity_status) !== null && _e !== void 0 ? _e : plain.status, responsibility: plain.responsibility, next_activity: plain.next_activity, next_responsibility: plain.next_responsibility, next_acitivities_id: plain.next_acitivities_id, activities_id: plain.activities_id, sub_activities_id: plain.sub_activities_id, created_at: createdAt, updated_at: updatedAt, createdAt: createdAt, updatedAt: updatedAt });
}
