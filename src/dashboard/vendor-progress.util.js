"use strict";
/**
 * Vendor dashboard progress — built dynamically from products.urnStatus + activity_log.
 * Design mockups (GreenCo labels) are not used; labels come from logged activities or URN lifecycle.
 */
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
exports.URN_ACTIVITY_NAMES = exports.CERTIFICATION_JOURNEY_STEP_COUNT = exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS = exports.URN_LIFECYCLE_MAX_STATUS = void 0;
exports.urnActivityName = urnActivityName;
exports.nextUrnActivityId = nextUrnActivityId;
exports.previousUrnActivityId = previousUrnActivityId;
exports.urnResponsibilityOwner = urnResponsibilityOwner;
exports.resolvePendingActivityId = resolvePendingActivityId;
exports.resolveJourneyStepStatuses = resolveJourneyStepStatuses;
exports.toVendorPanelResponsibility = toVendorPanelResponsibility;
exports.buildDynamicProgressSteps = buildDynamicProgressSteps;
exports.buildProgressTimeline = buildProgressTimeline;
exports.buildVendorProgressTracking = buildVendorProgressTracking;
var activity_lifecycle_constants_1 = require("../activity-log/activity-lifecycle.constants");
var activity_workflow_constants_1 = require("../activity-log/activity-workflow.constants");
exports.URN_LIFECYCLE_MAX_STATUS = activity_lifecycle_constants_1.ACTIVITY_LIFECYCLE_MAX_STATUS;
/** Canonical 11-step certification journey shown in the vendor dashboard (excludes renewal). */
exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
];
exports.CERTIFICATION_JOURNEY_STEP_COUNT = exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS.length;
exports.URN_ACTIVITY_NAMES = Object.fromEntries(Object.entries(activity_lifecycle_constants_1.ACTIVITY_LIFECYCLE_STEPS).map(function (_a) {
    var status = _a[0], step = _a[1];
    return [
        Number(status),
        step.activity,
    ];
}));
function urnActivityName(status) {
    return (0, activity_lifecycle_constants_1.activityLifecycleName)(status);
}
function nextUrnActivityId(currentStatus) {
    return (0, activity_lifecycle_constants_1.nextActivityLifecycleStatus)(currentStatus);
}
/** Previous milestone in the activity lifecycle. */
function previousUrnActivityId(currentStatus) {
    if (currentStatus <= 0)
        return 0;
    return currentStatus - 1;
}
function urnResponsibilityOwner(status) {
    return (0, activity_lifecycle_constants_1.activityLifecycleResponsibility)(status);
}
/** Pending workflow activity for a URN status, or null when the journey is complete. */
function resolvePendingActivityId(urnStatus) {
    if (urnStatus >= exports.URN_LIFECYCLE_MAX_STATUS)
        return null;
    var pending = activity_workflow_constants_1.URN_STATUS_PENDING_ACTIVITY[urnStatus];
    if (pending === undefined)
        return null;
    return pending;
}
/** Map urnStatus to completed / active / pending for each of the 12 journey steps. */
function resolveJourneyStepStatuses(urnStatus) {
    var pendingActivityId = resolvePendingActivityId(urnStatus);
    if (pendingActivityId === null && urnStatus >= exports.URN_LIFECYCLE_MAX_STATUS) {
        return exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS.map(function () { return 'completed'; });
    }
    var pendingIndex = exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS.indexOf(pendingActivityId);
    if (pendingIndex < 0) {
        return exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS.map(function () { return 'pending'; });
    }
    return exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS.map(function (_, displayIndex) {
        if (displayIndex < pendingIndex)
            return 'completed';
        if (displayIndex === pendingIndex)
            return 'active';
        return 'pending';
    });
}
/** Normalize old labels to the canonical activity-log responsibility names. */
function toVendorPanelResponsibility(owner) {
    var v = String(owner !== null && owner !== void 0 ? owner : '').trim();
    if (!v)
        return 'Manufacturer';
    if (v.toLowerCase() === 'admin' || v.toLowerCase() === 'cii') {
        return 'Admin';
    }
    if (v.toLowerCase() === 'vendor' ||
        v.toLowerCase() === 'company' ||
        v.toLowerCase() === 'manufacturer') {
        return 'Manufacturer';
    }
    return v;
}
function sortLogsChronologically(logs) {
    return __spreadArray([], logs, true).sort(function (a, b) {
        var ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        var tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return ta - tb;
    });
}
/** Latest activity_log row per activities_id (last write wins). */
function indexLogsByActivityId(logs) {
    var map = new Map();
    for (var _i = 0, _a = sortLogsChronologically(logs); _i < _a.length; _i++) {
        var log = _a[_i];
        var id = Number(log.activities_id);
        if (!Number.isFinite(id))
            continue;
        map.set(id, log);
    }
    return map;
}
function labelForActivityId(activityId, logById) {
    var _a;
    var fromLog = (_a = logById.get(activityId)) === null || _a === void 0 ? void 0 : _a.activity;
    if (fromLog && String(fromLog).trim()) {
        return String(fromLog).trim();
    }
    return urnActivityName(activityId);
}
function responsibilityForActivityId(activityId, logById) {
    var _a;
    var fromLog = (_a = logById.get(activityId)) === null || _a === void 0 ? void 0 : _a.responsibility;
    if (fromLog) {
        return toVendorPanelResponsibility(fromLog);
    }
    return toVendorPanelResponsibility(urnResponsibilityOwner(activityId));
}
function resolveLatestCompletedActivityId(urnStatus) {
    var pendingActivityId = resolvePendingActivityId(urnStatus);
    if (pendingActivityId === null && urnStatus >= exports.URN_LIFECYCLE_MAX_STATUS) {
        return exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS[exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS.length - 1];
    }
    if (pendingActivityId === null)
        return null;
    var pendingIndex = exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS.indexOf(pendingActivityId);
    if (pendingIndex <= 0)
        return null;
    return exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS[pendingIndex - 1];
}
/**
 * Always returns all 12 certification journey steps.
 * Completion is derived from products.urnStatus via URN_STATUS_PENDING_ACTIVITY.
 */
function buildDynamicProgressSteps(urnStatus, logs) {
    var logById = indexLogsByActivityId(logs);
    var statuses = resolveJourneyStepStatuses(urnStatus);
    return exports.CERTIFICATION_JOURNEY_ACTIVITY_IDS.map(function (activityId, index) {
        var _a;
        return ({
            id: activityId,
            label: labelForActivityId(activityId, logById),
            status: (_a = statuses[index]) !== null && _a !== void 0 ? _a : 'pending',
            responsibility: responsibilityForActivityId(activityId, logById),
        });
    });
}
function buildProgressTimeline(logs) {
    return sortLogsChronologically(logs).map(function (log) {
        var _a, _b, _c;
        return ({
            activitiesId: Number((_a = log.activities_id) !== null && _a !== void 0 ? _a : 0),
            activity: String((_b = log.activity) !== null && _b !== void 0 ? _b : '').trim(),
            activityStatus: Number((_c = log.activity_status) !== null && _c !== void 0 ? _c : 0),
            responsibility: toVendorPanelResponsibility(log.responsibility),
            nextActivity: log.next_activity
                ? String(log.next_activity).trim()
                : null,
            nextResponsibility: log.next_responsibility
                ? toVendorPanelResponsibility(log.next_responsibility)
                : null,
            nextActivitiesId: typeof log.next_acitivities_id === 'number'
                ? log.next_acitivities_id
                : null,
            createdAt: log.created_at
                ? new Date(log.created_at).toISOString()
                : null,
        });
    });
}
function buildVendorProgressTracking(input) {
    var _a, _b, _c;
    var urnStatus = typeof input.urnStatus === 'number' && Number.isFinite(input.urnStatus)
        ? Math.max(0, Math.min(exports.URN_LIFECYCLE_MAX_STATUS, Math.trunc(input.urnStatus)))
        : 0;
    var sortedLogs = sortLogsChronologically((_a = input.activityLogs) !== null && _a !== void 0 ? _a : []);
    var logById = indexLogsByActivityId(sortedLogs);
    var timeline = buildProgressTimeline(sortedLogs);
    var progressSteps = input.urnNo
        ? buildDynamicProgressSteps(urnStatus, sortedLogs)
        : [];
    var activeStepIndex = progressSteps.findIndex(function (s) { return s.status === 'active'; });
    var resolvedActiveIndex = activeStepIndex >= 0 ? activeStepIndex : Math.max(0, progressSteps.length - 1);
    var latestLog = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null;
    var completedId = resolveLatestCompletedActivityId(urnStatus);
    var latestStepCompleted = input.urnNo && completedId != null
        ? {
            activity: labelForActivityId(completedId, logById),
            status: 'Done',
            responsibility: responsibilityForActivityId(completedId, logById),
            activitiesId: completedId,
            updatedAt: (latestLog === null || latestLog === void 0 ? void 0 : latestLog.created_at)
                ? new Date(latestLog.created_at).toISOString()
                : undefined,
        }
        : null;
    var pendingActivityId = resolvePendingActivityId(urnStatus);
    var nextStep = input.urnNo && pendingActivityId != null
        ? {
            activity: String(((_b = latestLog === null || latestLog === void 0 ? void 0 : latestLog.next_activity) === null || _b === void 0 ? void 0 : _b.trim()) ||
                labelForActivityId(pendingActivityId, logById)),
            status: 'Pending',
            responsibility: toVendorPanelResponsibility((_c = latestLog === null || latestLog === void 0 ? void 0 : latestLog.next_responsibility) !== null && _c !== void 0 ? _c : responsibilityForActivityId(pendingActivityId, logById)),
            activitiesId: pendingActivityId,
        }
        : null;
    var completedCount = progressSteps.filter(function (s) { return s.status === 'completed'; }).length;
    var percentComplete = progressSteps.length > 0
        ? Math.round((completedCount / progressSteps.length) * 100)
        : 0;
    return {
        urnNo: input.urnNo,
        urnStatus: input.urnNo ? urnStatus : null,
        activeStepIndex: input.urnNo ? resolvedActiveIndex : 0,
        progressSteps: progressSteps,
        greencoSteps: progressSteps,
        timeline: timeline,
        latestStepCompleted: latestStepCompleted,
        nextStep: nextStep,
        percentComplete: percentComplete,
    };
}
