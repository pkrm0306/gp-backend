"use strict";
/**
 * Maps `activity_log.activities_id` (0–11) into admin dashboard timing buckets.
 * Labels align with the dashboard "Time at Stage" and "Avg. Time to Certification" widgets.
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
exports.CERTIFICATION_TIMING_BREAKDOWN_DEFS = exports.CERTIFICATION_TIMING_STAGE_DEFS = void 0;
exports.mapActivityIdToTimingStage = mapActivityIdToTimingStage;
exports.mapActivityIdToBreakdownKey = mapActivityIdToBreakdownKey;
exports.daysBetween = daysBetween;
exports.roundTimingDays = roundTimingDays;
exports.averageDays = averageDays;
exports.buildUrnMilestones = buildUrnMilestones;
exports.computeStageDurationsFromMilestones = computeStageDurationsFromMilestones;
exports.computeBreakdownDurationsFromMilestones = computeBreakdownDurationsFromMilestones;
exports.computeEndToEndDays = computeEndToEndDays;
exports.CERTIFICATION_TIMING_STAGE_DEFS = [
    { key: 'profile', label: 'Profile', order: 1 },
    { key: 'urn', label: 'URN', order: 2 },
    { key: 'eoi', label: 'EOI', order: 3 },
    { key: 'payment', label: 'Payment', order: 4 },
    { key: 'review', label: 'Review', order: 5 },
    { key: 'verified', label: 'Verified', order: 6 },
    { key: 'certified', label: 'Certified', order: 7 },
];
exports.CERTIFICATION_TIMING_BREAKDOWN_DEFS = [
    { key: 'technical', label: 'Technical', order: 1 },
    { key: 'audit', label: 'Audit', order: 2 },
    { key: 'review', label: 'Review', order: 3 },
];
function mapActivityIdToTimingStage(activityId) {
    if (activityId === 0)
        return 'urn';
    if (activityId === 1)
        return 'eoi';
    if (activityId >= 2 && activityId <= 4)
        return 'payment';
    if (activityId >= 5 && activityId <= 6)
        return 'review';
    if (activityId === 7)
        return 'verified';
    if (activityId >= 8 && activityId <= 11)
        return 'certified';
    return null;
}
function mapActivityIdToBreakdownKey(activityId) {
    if (activityId >= 5 && activityId <= 6)
        return 'technical';
    if (activityId === 7)
        return 'audit';
    if (activityId >= 8 && activityId <= 10)
        return 'review';
    return null;
}
function daysBetween(start, end) {
    var ms = end.getTime() - start.getTime();
    if (!Number.isFinite(ms) || ms <= 0)
        return 0;
    return Math.round(ms / (1000 * 60 * 60 * 24));
}
function roundTimingDays(value) {
    return Math.round(value * 10) / 10;
}
function averageDays(total, count) {
    if (count <= 0)
        return 0;
    return roundTimingDays(total / count);
}
/** Earliest `created_at` per activities_id for one URN timeline. */
function buildUrnMilestones(logs, certifiedDate) {
    var byId = new Map();
    for (var _i = 0, logs_1 = logs; _i < logs_1.length; _i++) {
        var log = logs_1[_i];
        var activityId = Number(log.activities_id);
        if (!Number.isFinite(activityId))
            continue;
        var at = log.created_at ? new Date(log.created_at) : null;
        if (!at || Number.isNaN(at.getTime()))
            continue;
        var existing = byId.get(activityId);
        if (!existing || at.getTime() < existing.getTime()) {
            byId.set(activityId, at);
        }
    }
    var milestones = __spreadArray([], byId.entries(), true).map(function (_a) {
        var activityId = _a[0], at = _a[1];
        return ({ activityId: activityId, at: at });
    })
        .sort(function (a, b) { return a.at.getTime() - b.at.getTime(); });
    if (certifiedDate) {
        var certifiedAt = new Date(certifiedDate);
        if (!Number.isNaN(certifiedAt.getTime())) {
            var last = milestones[milestones.length - 1];
            if (!last || certifiedAt.getTime() > last.at.getTime()) {
                milestones.push({ activityId: 11, at: certifiedAt });
            }
        }
    }
    return milestones;
}
function computeStageDurationsFromMilestones(milestones) {
    var _a;
    var durations = new Map();
    for (var i = 0; i < milestones.length - 1; i += 1) {
        var current = milestones[i];
        var next = milestones[i + 1];
        var stage = mapActivityIdToTimingStage(current.activityId);
        if (!stage)
            continue;
        var days = daysBetween(current.at, next.at);
        durations.set(stage, ((_a = durations.get(stage)) !== null && _a !== void 0 ? _a : 0) + days);
    }
    return durations;
}
function computeBreakdownDurationsFromMilestones(milestones) {
    var _a;
    var durations = new Map();
    for (var i = 0; i < milestones.length - 1; i += 1) {
        var current = milestones[i];
        var next = milestones[i + 1];
        var bucket = mapActivityIdToBreakdownKey(current.activityId);
        if (!bucket)
            continue;
        var days = daysBetween(current.at, next.at);
        durations.set(bucket, ((_a = durations.get(bucket)) !== null && _a !== void 0 ? _a : 0) + days);
    }
    return durations;
}
function computeEndToEndDays(milestones, certifiedDate) {
    var _a, _b, _c, _d;
    var start = (_b = (_a = milestones.find(function (m) { return m.activityId === 0; })) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : (_c = milestones[0]) === null || _c === void 0 ? void 0 : _c.at;
    if (!start)
        return null;
    var end = certifiedDate && !Number.isNaN(new Date(certifiedDate).getTime())
        ? new Date(certifiedDate)
        : (_d = milestones[milestones.length - 1]) === null || _d === void 0 ? void 0 : _d.at;
    if (!end)
        return null;
    return daysBetween(start, end);
}
