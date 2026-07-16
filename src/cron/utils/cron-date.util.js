"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRON_TIMEZONE = void 0;
exports.toIsoDateInTimeZone = toIsoDateInTimeZone;
exports.todayIsoInTimeZone = todayIsoInTimeZone;
exports.isSameCalendarDayInTimeZone = isSameCalendarDayInTimeZone;
exports.calendarDaysBetween = calendarDaysBetween;
exports.addCalendarDays = addCalendarDays;
exports.yearMonthsAgoInTimeZone = yearMonthsAgoInTimeZone;
exports.CRON_TIMEZONE = 'Asia/Kolkata';
/** Calendar YYYY-MM-DD in the given IANA timezone. */
function toIsoDateInTimeZone(date, timeZone) {
    if (timeZone === void 0) { timeZone = exports.CRON_TIMEZONE; }
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}
function todayIsoInTimeZone(timeZone) {
    if (timeZone === void 0) { timeZone = exports.CRON_TIMEZONE; }
    return toIsoDateInTimeZone(new Date(), timeZone);
}
function isSameCalendarDayInTimeZone(a, b, timeZone) {
    if (timeZone === void 0) { timeZone = exports.CRON_TIMEZONE; }
    if (!a || !b)
        return false;
    var da = a instanceof Date ? a : new Date(a);
    var db = b instanceof Date ? b : new Date(b);
    if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime()))
        return false;
    return toIsoDateInTimeZone(da, timeZone) === toIsoDateInTimeZone(db, timeZone);
}
/** Whole calendar days from earlier → later (legacy PHP daysBetween-style). */
function calendarDaysBetween(earlier, later, timeZone) {
    if (timeZone === void 0) { timeZone = exports.CRON_TIMEZONE; }
    var startIso = toIsoDateInTimeZone(earlier instanceof Date ? earlier : new Date(earlier), timeZone);
    var endIso = toIsoDateInTimeZone(later instanceof Date ? later : new Date(later), timeZone);
    var startMs = Date.parse("".concat(startIso, "T00:00:00.000Z"));
    var endMs = Date.parse("".concat(endIso, "T00:00:00.000Z"));
    return Math.round((endMs - startMs) / 86400000);
}
function addCalendarDays(isoDate, days, timeZone) {
    if (timeZone === void 0) { timeZone = exports.CRON_TIMEZONE; }
    var base = new Date("".concat(isoDate, "T12:00:00.000Z"));
    base.setUTCDate(base.getUTCDate() + days);
    return toIsoDateInTimeZone(base, timeZone);
}
/** Year of (today − months) in IST — used for deactivation template. */
function yearMonthsAgoInTimeZone(months, timeZone) {
    if (timeZone === void 0) { timeZone = exports.CRON_TIMEZONE; }
    var now = new Date();
    var iso = toIsoDateInTimeZone(now, timeZone);
    var _a = iso.split('-').map(Number), y = _a[0], m = _a[1], d = _a[2];
    var dt = new Date(Date.UTC(y, m - 1 - months, d, 12));
    return dt.getUTCFullYear();
}
