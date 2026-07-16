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
exports.buildValidTillCalendarExpr = exports.resolveAdminListValidTillCalendarFilter = void 0;
exports.normalizeAdminListFilterYearMonth = normalizeAdminListFilterYearMonth;
exports.buildYearMonthFromParts = buildYearMonthFromParts;
exports.resolveAdminListValidTillMonthYearFilter = resolveAdminListValidTillMonthYearFilter;
exports.buildValidTillMonthYearExpr = buildValidTillMonthYearExpr;
exports.buildValidTillYearsExpr = buildValidTillYearsExpr;
exports.mergeMongoExpr = mergeMongoExpr;
var cron_date_util_1 = require("../../cron/utils/cron-date.util");
var YEAR_MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;
var YEAR_MONTH_DAY_RE = /^(\d{4})-(0[1-9]|1[0-2])-\d{2}/;
/** Normalize filter input to `YYYY-MM` (business calendar in Asia/Kolkata). */
function normalizeAdminListFilterYearMonth(value) {
    var _a, _b;
    var trimmed = String(value !== null && value !== void 0 ? value : '').trim();
    if (!trimmed) {
        return null;
    }
    var yearMonth = YEAR_MONTH_RE.exec(trimmed);
    if (yearMonth) {
        return yearMonth[0];
    }
    var yearMonthDay = YEAR_MONTH_DAY_RE.exec(trimmed);
    if (yearMonthDay) {
        return "".concat(yearMonthDay[1], "-").concat(yearMonthDay[2]);
    }
    var d = new Date(trimmed.includes('T') ? trimmed : "".concat(trimmed, "T12:00:00.000Z"));
    if (!Number.isFinite(d.getTime())) {
        return null;
    }
    var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: cron_date_util_1.CRON_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
    }).formatToParts(d);
    var year = (_a = parts.find(function (p) { return p.type === 'year'; })) === null || _a === void 0 ? void 0 : _a.value;
    var month = (_b = parts.find(function (p) { return p.type === 'month'; })) === null || _b === void 0 ? void 0 : _b.value;
    return year && month ? "".concat(year, "-").concat(month) : null;
}
function buildYearMonthFromParts(year, month) {
    var y = Number(year);
    var m = Number(month);
    if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) {
        return null;
    }
    return "".concat(y, "-").concat(String(m).padStart(2, '0'));
}
function resolveAdminListValidTillMonthYearFilter(input) {
    var _a, _b, _c, _d;
    var fromRaw = (_a = input.validTillFrom) !== null && _a !== void 0 ? _a : input.valid_till_from;
    var toRaw = (_b = input.validTillTo) !== null && _b !== void 0 ? _b : input.valid_till_to;
    if (fromRaw || toRaw) {
        var from = fromRaw ? normalizeAdminListFilterYearMonth(fromRaw) : undefined;
        var to = toRaw ? normalizeAdminListFilterYearMonth(toRaw) : undefined;
        if (!from && !to) {
            return null;
        }
        return { kind: 'range', from: from, to: to };
    }
    var singleRaw = [
        input.validTillMonthYear,
        input.valid_till_month_year,
        input.validTillDate,
        input.validTill,
        input.valid_till,
        input.valid_till_date,
        input.validtillDate,
        input.validtill_date,
    ]
        .map(function (value) { return (value != null ? String(value).trim() : ''); })
        .find(function (text) { return text.length > 0; });
    if (singleRaw) {
        var yearMonth = normalizeAdminListFilterYearMonth(singleRaw);
        if (yearMonth) {
            return { kind: 'single', yearMonth: yearMonth };
        }
    }
    var month = (_c = input.validTillMonth) !== null && _c !== void 0 ? _c : input.valid_till_month;
    var year = (_d = input.validTillYear) !== null && _d !== void 0 ? _d : input.valid_till_year;
    if (month != null) {
        var yearMonth = buildYearMonthFromParts(year, month);
        if (yearMonth) {
            return { kind: 'single', yearMonth: yearMonth };
        }
    }
    return null;
}
/** @deprecated Use resolveAdminListValidTillMonthYearFilter */
exports.resolveAdminListValidTillCalendarFilter = resolveAdminListValidTillMonthYearFilter;
function validTillYearMonthStringExpr(timeZone) {
    return {
        $dateToString: {
            format: '%Y-%m',
            date: '$validtillDate',
            timezone: timeZone,
        },
    };
}
/** Mongo `$expr` matching valid-till by calendar month+year in the business timezone. */
function buildValidTillMonthYearExpr(filter, timeZone) {
    if (timeZone === void 0) { timeZone = cron_date_util_1.CRON_TIMEZONE; }
    var yearMonthStr = validTillYearMonthStringExpr(timeZone);
    var base = [{ $ne: ['$validtillDate', null] }];
    if (filter.kind === 'single') {
        return { $and: __spreadArray(__spreadArray([], base, true), [{ $eq: [yearMonthStr, filter.yearMonth] }], false) };
    }
    var conditions = __spreadArray([], base, true);
    if (filter.from) {
        conditions.push({ $gte: [yearMonthStr, filter.from] });
    }
    if (filter.to) {
        conditions.push({ $lte: [yearMonthStr, filter.to] });
    }
    return { $and: conditions };
}
/** @deprecated Use buildValidTillMonthYearExpr */
exports.buildValidTillCalendarExpr = buildValidTillMonthYearExpr;
function buildValidTillYearsExpr(years, timeZone) {
    if (timeZone === void 0) { timeZone = cron_date_util_1.CRON_TIMEZONE; }
    return {
        $and: [
            { $ne: ['$validtillDate', null] },
            {
                $in: [{ $year: { date: '$validtillDate', timezone: timeZone } }, years],
            },
        ],
    };
}
function mergeMongoExpr(nativeMatch, expr) {
    var existing = nativeMatch.$expr;
    if (!existing) {
        nativeMatch.$expr = expr;
        return;
    }
    if (existing.$and && Array.isArray(existing.$and)) {
        var add_1 = expr.$and && Array.isArray(expr.$and) ? expr.$and : [expr];
        nativeMatch.$expr = { $and: __spreadArray(__spreadArray([], existing.$and, true), add_1, true) };
        return;
    }
    var add = expr.$and && Array.isArray(expr.$and) ? expr.$and : [expr];
    nativeMatch.$expr = { $and: __spreadArray([existing], add, true) };
}
