"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUMMIT_STATUS_LABELS = void 0;
exports.normalizeSummitStatus = normalizeSummitStatus;
exports.isSummitActiveStatus = isSummitActiveStatus;
exports.summitStatusDbMatch = summitStatusDbMatch;
/** API + UI values */
exports.SUMMIT_STATUS_LABELS = {
    active: 'Active',
    inactive: 'Inactive',
};
/** Normalize stored/API values (supports legacy draft / published). */
function normalizeSummitStatus(raw) {
    var s = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .toLowerCase();
    if (s === 'active' || s === 'published')
        return 'active';
    if (s === 'inactive' || s === 'draft')
        return 'inactive';
    return 'inactive';
}
function isSummitActiveStatus(raw) {
    return normalizeSummitStatus(raw) === 'active';
}
/** Mongo filter for list/public when UI sends active | inactive. */
function summitStatusDbMatch(status) {
    if (status === 'active') {
        return { status: { $in: ['active', 'published'] } };
    }
    return { status: { $in: ['inactive', 'draft'] } };
}
