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
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeValidTillFromCertified = computeValidTillFromCertified;
exports.computeNotifyDates = computeNotifyDates;
exports.computeGraceEndDate = computeGraceEndDate;
exports.computeCertificationDates = computeCertificationDates;
function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}
/** Calendar month add/subtract; clamp day to last day of target month (e.g. Dec 31 − 1 mo → Nov 30). */
function addMonths(date, months) {
    var d = new Date(date);
    var day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDayOfMonth));
    return d;
}
function subMonths(date, months) {
    return addMonths(date, -months);
}
/**
 * Validity end for a newly certified product:
 * last calendar day of the month that is exactly 2 years after the
 * certification month (e.g. 2026-09-24 → 2028-09-30).
 *
 * Not “same calendar day + 2 years” — always month-end.
 */
function computeValidTillFromCertified(certifiedDate) {
    var base = startOfDay(certifiedDate);
    return startOfDay(new Date(base.getFullYear() + 2, base.getMonth() + 1, 0));
}
/**
 * Notify offsets from validtill (calendar months), stored at start of day.
 *
 * | Field | Offset |
 * |-------|--------|
 * | firstNotifyDate | validtill − 3 months (first expiry reminder) |
 * | secondNotifyDate | validtill − 2 months (second / weekly window start) |
 * | thirdNotifyDate | validtill + 3 months (grace end / deactivation) |
 */
function computeNotifyDates(validtillDate) {
    var vt = startOfDay(validtillDate);
    return {
        firstNotifyDate: startOfDay(subMonths(vt, 3)),
        secondNotifyDate: startOfDay(subMonths(vt, 2)),
        thirdNotifyDate: computeGraceEndDate(validtillDate),
    };
}
/** End of the 3-month grace period after validtillDate. */
function computeGraceEndDate(validtillDate) {
    return startOfDay(addMonths(startOfDay(validtillDate), 3));
}
/** Full bundle when admin approves certification payment. */
function computeCertificationDates(approvedAt) {
    var certifiedDate = approvedAt;
    var validtillDate = computeValidTillFromCertified(certifiedDate);
    var notify = computeNotifyDates(validtillDate);
    return __assign({ certifiedDate: certifiedDate, validtillDate: validtillDate }, notify);
}
