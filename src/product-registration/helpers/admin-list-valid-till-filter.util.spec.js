"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin_list_valid_till_filter_util_1 = require("./admin-list-valid-till-filter.util");
describe('admin-list-valid-till-filter.util', function () {
    it('normalizes YYYY-MM filter input', function () {
        expect((0, admin_list_valid_till_filter_util_1.normalizeAdminListFilterYearMonth)('2027-12')).toBe('2027-12');
        expect((0, admin_list_valid_till_filter_util_1.normalizeAdminListFilterYearMonth)('2027-12-31')).toBe('2027-12');
    });
    it('resolves single valid-till month+year from aliases', function () {
        expect((0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)({
            validtillDate: '2026-12',
        })).toEqual({ kind: 'single', yearMonth: '2026-12' });
        expect((0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)({
            valid_till: '2026-12',
        })).toEqual({ kind: 'single', yearMonth: '2026-12' });
    });
    it('resolves month+year from snake_case month and year pickers', function () {
        expect((0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)({
            valid_till_month: 12,
            valid_till_year: 2026,
        })).toEqual({ kind: 'single', yearMonth: '2026-12' });
    });
    it('resolves month+year from separate month and year pickers', function () {
        expect((0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)({
            validTillMonth: 12,
            validTillYear: 2026,
        })).toEqual({ kind: 'single', yearMonth: '2026-12' });
    });
    it('resolves inclusive valid-till month/year range', function () {
        expect((0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)({
            validTillFrom: '2026-01',
            validTillTo: '2026-12',
        })).toEqual({
            kind: 'range',
            from: '2026-01',
            to: '2026-12',
        });
    });
    it('builds month+year $expr using Asia/Kolkata', function () {
        var expr = (0, admin_list_valid_till_filter_util_1.buildValidTillMonthYearExpr)({
            kind: 'single',
            yearMonth: '2027-12',
        });
        expect(expr).toEqual({
            $and: [
                { $ne: ['$validtillDate', null] },
                {
                    $eq: [
                        {
                            $dateToString: {
                                format: '%Y-%m',
                                date: '$validtillDate',
                                timezone: 'Asia/Kolkata',
                            },
                        },
                        '2027-12',
                    ],
                },
            ],
        });
    });
    it('maps local-midnight Dec 31 storage to December year-month', function () {
        var stored = new Date(2027, 11, 31, 0, 0, 0, 0);
        var yearMonth = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
        })
            .formatToParts(stored)
            .reduce(function (acc, part) {
            if (part.type === 'year')
                acc.year = part.value;
            if (part.type === 'month')
                acc.month = part.value;
            return acc;
        }, { year: '', month: '' });
        expect("".concat(yearMonth.year, "-").concat(yearMonth.month)).toBe('2027-12');
        expect((0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)({
            validTillMonthYear: '2027-12',
        })).toEqual({ kind: 'single', yearMonth: '2027-12' });
    });
});
