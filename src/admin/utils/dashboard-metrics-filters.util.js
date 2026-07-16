"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateNameMatchesRegion = stateNameMatchesRegion;
exports.parseDashboardMonth = parseDashboardMonth;
exports.parseDashboardYear = parseDashboardYear;
exports.resolveDashboardDateRange = resolveDashboardDateRange;
exports.resolvePreviousDashboardDateRange = resolvePreviousDashboardDateRange;
exports.resolveRevenueDashboardGranularity = resolveRevenueDashboardGranularity;
exports.revenuePeriodDisplayLabel = revenuePeriodDisplayLabel;
exports.buildAppliedDashboardFilters = buildAppliedDashboardFilters;
exports.resolveManufacturerScopeIds = resolveManufacturerScopeIds;
exports.buildManufacturerSnapshotMatch = buildManufacturerSnapshotMatch;
exports.buildProductSnapshotMatch = buildProductSnapshotMatch;
exports.buildProductTrendMatch = buildProductTrendMatch;
exports.buildProductBaseMatch = buildProductBaseMatch;
exports.productStatusFilterToMatch = productStatusFilterToMatch;
exports.isProductExpired = isProductExpired;
exports.bucketDateExpression = bucketDateExpression;
exports.formatBucketLabel = formatBucketLabel;
exports.emptyDashboardCharts = emptyDashboardCharts;
var common_1 = require("@nestjs/common");
var expired_product_filter_1 = require("../../product-registration/constants/expired-product.filter");
var MONTH_SHORT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
/** State name substrings mapped to dashboard regions (India). */
var REGION_STATE_KEYWORDS = {
    north: [
        'delhi',
        'punjab',
        'haryana',
        'rajasthan',
        'uttar pradesh',
        'himachal',
        'jammu',
        'kashmir',
        'chandigarh',
        'uttarakhand',
    ],
    south: [
        'karnataka',
        'kerala',
        'tamil nadu',
        'andhra',
        'telangana',
        'puducherry',
        'pondicherry',
    ],
    east: [
        'west bengal',
        'bihar',
        'odisha',
        'orissa',
        'jharkhand',
        'assam',
        'sikkim',
        'meghalaya',
        'tripura',
        'manipur',
        'nagaland',
        'mizoram',
        'arunachal',
    ],
    west: ['maharashtra', 'gujarat', 'goa', 'dadra', 'daman'],
};
function stateNameMatchesRegion(stateName, region) {
    var normalized = String(stateName !== null && stateName !== void 0 ? stateName : '').trim().toLowerCase();
    if (!normalized)
        return false;
    return REGION_STATE_KEYWORDS[region].some(function (kw) { return normalized.includes(kw); });
}
/** Parse month from 1–12, "3", or short name ("Mar", "mar"). */
function parseDashboardMonth(raw) {
    if (raw === undefined || raw === null || raw === '')
        return undefined;
    var s = String(raw).trim().toLowerCase();
    if (s === 'all' || s === 'all months')
        return undefined;
    var n = Number(s);
    if (Number.isFinite(n) && n >= 1 && n <= 12)
        return Math.floor(n);
    var byName = {
        jan: 1,
        january: 1,
        feb: 2,
        february: 2,
        mar: 3,
        march: 3,
        apr: 4,
        april: 4,
        may: 5,
        jun: 6,
        june: 6,
        jul: 7,
        july: 7,
        aug: 8,
        august: 8,
        sep: 9,
        sept: 9,
        september: 9,
        oct: 10,
        october: 10,
        nov: 11,
        november: 11,
        dec: 12,
        december: 12,
    };
    return byName[s];
}
/** Parse year; "all" / empty → undefined. */
function parseDashboardYear(raw) {
    if (raw === undefined || raw === null || raw === '')
        return undefined;
    var s = String(raw).trim().toLowerCase();
    if (s === 'all' || s === 'all years')
        return undefined;
    var n = Number(s);
    if (Number.isFinite(n) && n >= 2000 && n <= 2100)
        return Math.floor(n);
    return undefined;
}
function endOfCalendarYear(year, now) {
    if (year === now.getFullYear()) {
        return now;
    }
    return new Date(year, 11, 31, 23, 59, 59, 999);
}
/**
 * Resolves the product date window for dashboard filters.
 * Priority: explicit from/to → month → quarter → year (+ period) → period alone → no filter.
 */
function resolveDashboardDateRange(query, now) {
    var _a, _b, _c, _d;
    if (now === void 0) { now = new Date(); }
    var fromRaw = query.from ? String(query.from).trim() : '';
    var toRaw = query.to ? String(query.to).trim() : '';
    if (fromRaw && toRaw) {
        var from = new Date(fromRaw);
        var to = new Date(toRaw);
        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
            throw new common_1.BadRequestException('from/to must be valid ISO dates');
        }
        if (from > to) {
            throw new common_1.BadRequestException('from must be before or equal to to');
        }
        // Inclusive end-of-day when date-only (no time component)
        if (/^\d{4}-\d{2}-\d{2}$/.test(toRaw)) {
            to.setHours(23, 59, 59, 999);
        }
        return { from: from, to: to };
    }
    var selectedYear = (_a = query.year) !== null && _a !== void 0 ? _a : now.getFullYear();
    if (query.month !== undefined) {
        var m = query.month - 1;
        var y_1 = (_b = query.year) !== null && _b !== void 0 ? _b : now.getFullYear();
        return {
            from: new Date(y_1, m, 1, 0, 0, 0, 0),
            to: new Date(y_1, m + 1, 0, 23, 59, 59, 999),
        };
    }
    if (query.quarter !== undefined) {
        var q = query.quarter;
        if (q < 1 || q > 4) {
            throw new common_1.BadRequestException('quarter must be between 1 and 4');
        }
        var y_2 = (_c = query.year) !== null && _c !== void 0 ? _c : now.getFullYear();
        var startMonth = (q - 1) * 3;
        return {
            from: new Date(y_2, startMonth, 1, 0, 0, 0, 0),
            to: new Date(y_2, startMonth + 3, 0, 23, 59, 59, 999),
        };
    }
    if (query.year !== undefined) {
        var y_3 = query.year;
        if (!query.period || query.period === 'this_year') {
            return {
                from: new Date(y_3, 0, 1, 0, 0, 0, 0),
                to: endOfCalendarYear(y_3, now),
            };
        }
        if (query.period === 'this_month') {
            var monthIndex = now.getMonth();
            return {
                from: new Date(y_3, monthIndex, 1, 0, 0, 0, 0),
                to: new Date(y_3, monthIndex + 1, 0, 23, 59, 59, 999),
            };
        }
        if (query.period === 'this_quarter') {
            var qStart = Math.floor(now.getMonth() / 3) * 3;
            return {
                from: new Date(y_3, qStart, 1, 0, 0, 0, 0),
                to: new Date(y_3, qStart + 3, 0, 23, 59, 59, 999),
            };
        }
        if (query.period === 'this_week') {
            if (y_3 !== now.getFullYear()) {
                throw new common_1.BadRequestException('this_week is only valid for the current calendar year');
            }
        }
    }
    if (!query.period) {
        return undefined;
    }
    var startOfDay = function (d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    };
    var endOfDay = now;
    var y = (_d = query.year) !== null && _d !== void 0 ? _d : now.getFullYear();
    switch (query.period) {
        case 'last_week': {
            var day = now.getDay();
            var diff = day === 0 ? 6 : day - 1;
            var thisWeekStart = new Date(now);
            thisWeekStart.setDate(now.getDate() - diff);
            var from = new Date(thisWeekStart);
            from.setDate(from.getDate() - 7);
            var to = new Date(thisWeekStart);
            to.setMilliseconds(-1);
            return { from: startOfDay(from), to: to };
        }
        case 'last_month': {
            var monthIndex = now.getMonth() - 1;
            var year = monthIndex < 0 ? now.getFullYear() - 1 : now.getFullYear();
            var m = monthIndex < 0 ? 11 : monthIndex;
            return {
                from: new Date(year, m, 1, 0, 0, 0, 0),
                to: new Date(year, m + 1, 0, 23, 59, 59, 999),
            };
        }
        case 'last_year': {
            var year = now.getFullYear() - 1;
            return {
                from: new Date(year, 0, 1, 0, 0, 0, 0),
                to: new Date(year, 11, 31, 23, 59, 59, 999),
            };
        }
        case 'this_week': {
            var day = now.getDay();
            var diff = day === 0 ? 6 : day - 1;
            var from = new Date(now);
            from.setDate(now.getDate() - diff);
            return { from: startOfDay(from), to: endOfDay };
        }
        case 'this_month':
            return {
                from: new Date(y, now.getMonth(), 1, 0, 0, 0, 0),
                to: query.year !== undefined && query.year !== now.getFullYear()
                    ? new Date(y, now.getMonth() + 1, 0, 23, 59, 59, 999)
                    : endOfDay,
            };
        case 'this_quarter': {
            var qStart = Math.floor(now.getMonth() / 3) * 3;
            return {
                from: new Date(y, qStart, 1, 0, 0, 0, 0),
                to: query.year !== undefined && query.year !== now.getFullYear()
                    ? new Date(y, qStart + 3, 0, 23, 59, 59, 999)
                    : endOfDay,
            };
        }
        case 'this_year':
            return {
                from: new Date(y, 0, 1, 0, 0, 0, 0),
                to: endOfCalendarYear(y, now),
            };
        default:
            return undefined;
    }
}
/** Calendar period immediately before `current` (same duration). */
function resolvePreviousDashboardDateRange(current) {
    var durationMs = current.to.getTime() - current.from.getTime();
    var to = new Date(current.from.getTime() - 1);
    var from = new Date(to.getTime() - durationMs);
    return { from: from, to: to };
}
function resolveRevenueDashboardGranularity(period, explicit) {
    if (explicit)
        return explicit;
    switch (period) {
        case 'this_week':
        case 'last_week':
            return 'weekly';
        case 'this_month':
        case 'last_month':
            return 'weekly';
        case 'this_quarter':
            return 'quarterly';
        default:
            return 'monthly';
    }
}
function revenuePeriodDisplayLabel(period) {
    switch (period) {
        case 'this_week':
            return 'This Week';
        case 'last_week':
            return 'Last Week';
        case 'this_month':
            return 'This Month';
        case 'last_month':
            return 'Last Month';
        case 'this_quarter':
            return 'This Quarter';
        case 'this_year':
            return 'This Year';
        case 'last_year':
            return 'Last Year';
        default:
            return 'All Time';
    }
}
/** Human-readable summary of applied filters (for API + frontend). */
function buildAppliedDashboardFilters(query, resolved) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    return {
        period: (_a = query.period) !== null && _a !== void 0 ? _a : null,
        year: (_b = query.year) !== null && _b !== void 0 ? _b : null,
        month: (_c = query.month) !== null && _c !== void 0 ? _c : null,
        quarter: (_d = query.quarter) !== null && _d !== void 0 ? _d : null,
        productStatus: (_e = query.productStatus) !== null && _e !== void 0 ? _e : null,
        categoryId: (_f = query.categoryId) !== null && _f !== void 0 ? _f : null,
        region: (_g = query.region) !== null && _g !== void 0 ? _g : null,
        manufacturerId: (_l = (_j = (_h = query.manufacturerId) !== null && _h !== void 0 ? _h : query.vendorId) !== null && _j !== void 0 ? _j : (_k = resolved.manufacturerObjectId) === null || _k === void 0 ? void 0 : _k.toString()) !== null && _l !== void 0 ? _l : null,
        vendorId: (_o = (_m = query.vendorId) !== null && _m !== void 0 ? _m : query.manufacturerId) !== null && _o !== void 0 ? _o : null,
        status: (_q = (_p = query.status) !== null && _p !== void 0 ? _p : resolved.status) !== null && _q !== void 0 ? _q : null,
        from: (_r = query.from) !== null && _r !== void 0 ? _r : null,
        to: (_s = query.to) !== null && _s !== void 0 ? _s : null,
        granularity: resolved.granularity,
        dateRange: resolved.dateRange
            ? {
                from: resolved.dateRange.from.toISOString(),
                to: resolved.dateRange.to.toISOString(),
            }
            : null,
        manufacturersScope: 'snapshot (current platform totals; not limited by product date range)',
        productsScope: resolved.dateRange
            ? 'time-series charts only: createdDate within dateRange'
            : 'all time for trend charts',
        countsScope: 'current active products (non-deleted); not limited by period/year filters',
    };
}
/** Resolve manufacturer ObjectId list for product/payment/manufacturer scoping. */
function resolveManufacturerScopeIds(filters) {
    var _a;
    if (filters.manufacturerObjectId) {
        if ((_a = filters.manufacturerIdsForRegion) === null || _a === void 0 ? void 0 : _a.length) {
            var allowed = filters.manufacturerIdsForRegion.some(function (id) { return id.toString() === filters.manufacturerObjectId.toString(); });
            return allowed ? [filters.manufacturerObjectId] : [];
        }
        return [filters.manufacturerObjectId];
    }
    return filters.manufacturerIdsForRegion;
}
/**
 * Manufacturer KPI cards use current platform snapshot (status counts),
 * optionally scoped by region / manufacturer — not by registration date.
 */
function buildManufacturerSnapshotMatch(filters) {
    var match = {};
    var ids = resolveManufacturerScopeIds(filters);
    if (ids) {
        match._id = { $in: ids };
    }
    return match;
}
/**
 * Current platform product counts (matches admin product list).
 * Uses active (non-deleted) products only. Does **not** filter by registration date.
 */
function buildProductSnapshotMatch(filters, now) {
    var match = {
        $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
    };
    if (filters.categoryObjectId) {
        match.categoryId = filters.categoryObjectId;
    }
    var manufacturerIds = resolveManufacturerScopeIds(filters);
    if (manufacturerIds) {
        match.manufacturerId = { $in: manufacturerIds };
    }
    var statusFilter = filters.productStatusFilter;
    if (statusFilter) {
        Object.assign(match, productStatusFilterToMatch(statusFilter, now));
    }
    return match;
}
/** Time-series charts: snapshot filters + optional createdDate window. */
function buildProductTrendMatch(filters, now) {
    var match = buildProductSnapshotMatch(filters, now);
    if (filters.dateRange) {
        match.createdDate = {
            $gte: filters.dateRange.from,
            $lte: filters.dateRange.to,
        };
    }
    return match;
}
/** @deprecated Prefer buildProductSnapshotMatch or buildProductTrendMatch */
function buildProductBaseMatch(filters, now) {
    return buildProductTrendMatch(filters, now);
}
/**
 * UI productStatus filter → Mongo match (aligned with admin product list tabs).
 */
function productStatusFilterToMatch(filter, now) {
    switch (filter) {
        case 'pending':
            return { productStatus: { $in: [0, 1] } };
        case 'completed':
            return {
                productStatus: 2,
                $or: [
                    { validtillDate: { $exists: false } },
                    { validtillDate: null },
                    { validtillDate: { $gte: now } },
                ],
            };
        case 'overdue':
            return (0, expired_product_filter_1.matchExpiredProducts)(now);
        case 'active':
            return {
                $or: [
                    { productStatus: 1 },
                    { urnStatus: { $gte: 1, $lte: 10 } },
                ],
            };
        default:
            return {};
    }
}
function isProductExpired(productStatus, validtillDate, now) {
    return (0, expired_product_filter_1.isExpiredProduct)(productStatus, validtillDate, now);
}
function bucketDateExpression(granularity, dateField) {
    switch (granularity) {
        case 'weekly':
            return {
                year: { $isoWeekYear: "$".concat(dateField) },
                week: { $isoWeek: "$".concat(dateField) },
            };
        case 'quarterly':
            return {
                year: { $year: "$".concat(dateField) },
                quarter: {
                    $ceil: { $divide: [{ $add: [{ $month: "$".concat(dateField) }, 0] }, 3] },
                },
            };
        default:
            return {
                year: { $year: "$".concat(dateField) },
                month: { $month: "$".concat(dateField) },
            };
    }
}
function formatBucketLabel(granularity, bucket) {
    var _a, _b;
    var year = (_a = bucket.year) !== null && _a !== void 0 ? _a : 0;
    if (granularity === 'weekly' && bucket.week) {
        return "W".concat(bucket.week, " ").concat(year);
    }
    if (granularity === 'quarterly' && bucket.quarter) {
        return "Q".concat(bucket.quarter, " ").concat(year);
    }
    if (bucket.month && bucket.month >= 1 && bucket.month <= 12) {
        return (_b = MONTH_SHORT[bucket.month - 1]) !== null && _b !== void 0 ? _b : "M".concat(bucket.month);
    }
    return String(year);
}
function emptyDashboardCharts() {
    return {
        categoryDistribution: [],
        categoryCertified: [],
        productStatusBreakdown: {
            totals: {
                certified: 0,
                uncertified: 0,
                expired: 0,
                renewed: 0,
                rejected: 0,
                total: 0,
            },
            chart: [],
        },
        certifiedVsUncertified: {
            totals: {
                totalProducts: 0,
                certifiedProducts: 0,
                uncertifiedProducts: 0,
            },
            chart: [],
        },
        urnPipeline: [],
        monthlyCertified: [],
        monthlySubmissions: [],
        onlineOffline: [],
    };
}
