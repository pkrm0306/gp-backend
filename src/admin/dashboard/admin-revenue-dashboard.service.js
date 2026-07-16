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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
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
exports.AdminRevenueDashboardService = void 0;
var common_1 = require("@nestjs/common");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
var admin_dashboard_revenue_util_1 = require("../utils/admin-dashboard-revenue.util");
var AdminRevenueDashboardService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminRevenueDashboardService = _classThis = /** @class */ (function () {
        function AdminRevenueDashboardService_1(paymentDetailsModel) {
            this.paymentDetailsModel = paymentDetailsModel;
        }
        AdminRevenueDashboardService_1.prototype.getRevenueAnalytics = function (filters, query, appliedFilters, scopeUrns, scopedByProducts) {
            return __awaiter(this, void 0, void 0, function () {
                var paymentMatch, granularity, useWeekOfMonth, bucketId, _a, facetResult, weeklyComparison, byTypeRows, seriesRows, totalsByType, allTotals, byTypeChart, _b, timeSeries, weeklyByType, periodTotals, distribution;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            paymentMatch = (0, admin_dashboard_revenue_util_1.buildPaymentRevenueBaseMatch)(filters, scopeUrns);
                            granularity = filters.granularity;
                            useWeekOfMonth = query.period === 'this_month' ||
                                query.period === 'last_month' ||
                                (!query.period && !query.year && query.month === undefined);
                            bucketId = useWeekOfMonth
                                ? (0, admin_dashboard_revenue_util_1.revenueWeekOfMonthBucketExpr)('revenueDate')
                                : (0, dashboard_metrics_filters_util_1.bucketDateExpression)(granularity, 'revenueDate');
                            return [4 /*yield*/, Promise.all([
                                    this.aggregateRevenueFacet(paymentMatch, bucketId),
                                    this.buildWeeklyComparison(filters, scopeUrns, query.period),
                                ])];
                        case 1:
                            _a = _e.sent(), facetResult = _a[0], weeklyComparison = _a[1];
                            byTypeRows = (_c = facetResult === null || facetResult === void 0 ? void 0 : facetResult.byType) !== null && _c !== void 0 ? _c : [];
                            seriesRows = (_d = facetResult === null || facetResult === void 0 ? void 0 : facetResult.timeSeries) !== null && _d !== void 0 ? _d : [];
                            totalsByType = this.mapTotalsByType(byTypeRows);
                            allTotals = this.sumAllTotals(totalsByType);
                            byTypeChart = (0, admin_dashboard_revenue_util_1.buildRevenueDistribution)(totalsByType, allTotals.amount);
                            _b = this.buildTimeSeries(seriesRows, granularity, useWeekOfMonth), timeSeries = _b.timeSeries, weeklyByType = _b.weeklyByType;
                            periodTotals = {
                                registration: totalsByType.registration,
                                certification: totalsByType.certification,
                                renewal: totalsByType.renew,
                                all: allTotals,
                            };
                            distribution = {
                                totalRevenue: allTotals.amount,
                                totalCount: allTotals.count,
                                currency: 'INR',
                                centerLabel: 'Total Revenue',
                                segments: byTypeChart,
                            };
                            return [2 /*return*/, {
                                    appliedFilters: __assign(__assign({}, appliedFilters), { revenueScope: (0, admin_dashboard_revenue_util_1.revenueScopeDescription)(filters, scopedByProducts) }),
                                    totals: periodTotals,
                                    periodTotals: periodTotals,
                                    charts: {
                                        granularity: granularity,
                                        byType: byTypeChart,
                                        timeSeries: timeSeries,
                                        weeklyByType: weeklyByType,
                                    },
                                    distribution: distribution,
                                    weeklyComparison: weeklyComparison,
                                }];
                    }
                });
            });
        };
        AdminRevenueDashboardService_1.prototype.mapTotalsByType = function (byTypeRows) {
            var _a, _b, _c, _d, _e;
            var totalsByType = {
                registration: (0, admin_dashboard_revenue_util_1.emptyRevenueTypeTotals)(),
                certification: (0, admin_dashboard_revenue_util_1.emptyRevenueTypeTotals)(),
                renew: (0, admin_dashboard_revenue_util_1.emptyRevenueTypeTotals)(),
            };
            for (var _i = 0, byTypeRows_1 = byTypeRows; _i < byTypeRows_1.length; _i++) {
                var row = byTypeRows_1[_i];
                var key = String((_a = row._id) !== null && _a !== void 0 ? _a : '').trim();
                if (!admin_dashboard_revenue_util_1.REVENUE_PAYMENT_TYPE_KEYS.includes(key))
                    continue;
                totalsByType[key] = {
                    amount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)((_b = row.amount) !== null && _b !== void 0 ? _b : 0),
                    gstAmount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)((_c = row.gstAmount) !== null && _c !== void 0 ? _c : 0),
                    tdsAmount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)((_d = row.tdsAmount) !== null && _d !== void 0 ? _d : 0),
                    count: (_e = row.count) !== null && _e !== void 0 ? _e : 0,
                };
            }
            return totalsByType;
        };
        AdminRevenueDashboardService_1.prototype.sumAllTotals = function (totalsByType) {
            return {
                amount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)(admin_dashboard_revenue_util_1.REVENUE_PAYMENT_TYPE_KEYS.reduce(function (sum, k) { return sum + totalsByType[k].amount; }, 0)),
                gstAmount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)(admin_dashboard_revenue_util_1.REVENUE_PAYMENT_TYPE_KEYS.reduce(function (sum, k) { return sum + totalsByType[k].gstAmount; }, 0)),
                tdsAmount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)(admin_dashboard_revenue_util_1.REVENUE_PAYMENT_TYPE_KEYS.reduce(function (sum, k) { return sum + totalsByType[k].tdsAmount; }, 0)),
                count: admin_dashboard_revenue_util_1.REVENUE_PAYMENT_TYPE_KEYS.reduce(function (sum, k) { return sum + totalsByType[k].count; }, 0),
            };
        };
        AdminRevenueDashboardService_1.prototype.aggregateRevenueFacet = function (paymentMatch, bucketId) {
            return __awaiter(this, void 0, void 0, function () {
                var facetResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.paymentDetailsModel
                                .aggregate([
                                { $match: paymentMatch },
                                {
                                    $addFields: {
                                        revenueDate: (0, admin_dashboard_revenue_util_1.paymentRevenueRecognitionDateExpr)(),
                                        revenuePaymentType: (0, admin_dashboard_revenue_util_1.normalizeRevenuePaymentTypeExpr)(),
                                    },
                                },
                                {
                                    $facet: {
                                        byType: [
                                            {
                                                $group: {
                                                    _id: '$revenuePaymentType',
                                                    amount: { $sum: '$quoteTotal' },
                                                    gstAmount: { $sum: '$quoteGstAmount' },
                                                    tdsAmount: { $sum: '$quoteTdsAmount' },
                                                    count: { $sum: 1 },
                                                },
                                            },
                                        ],
                                        timeSeries: [
                                            {
                                                $group: {
                                                    _id: { bucket: bucketId, paymentType: '$revenuePaymentType' },
                                                    amount: { $sum: '$quoteTotal' },
                                                    count: { $sum: 1 },
                                                },
                                            },
                                        ],
                                    },
                                },
                            ])
                                .exec()];
                        case 1:
                            facetResult = (_a.sent())[0];
                            return [2 /*return*/, facetResult];
                    }
                });
            });
        };
        AdminRevenueDashboardService_1.prototype.buildTimeSeries = function (seriesRows, granularity, useWeekOfMonth) {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var bucketByType = new Map();
            var bucketTotals = new Map();
            for (var _i = 0, seriesRows_1 = seriesRows; _i < seriesRows_1.length; _i++) {
                var row = seriesRows_1[_i];
                var paymentType = String((_b = (_a = row._id) === null || _a === void 0 ? void 0 : _a.paymentType) !== null && _b !== void 0 ? _b : '').trim();
                if (!admin_dashboard_revenue_util_1.REVENUE_PAYMENT_TYPE_KEYS.includes(paymentType)) {
                    continue;
                }
                var typedPaymentType = paymentType;
                var bucketLabel = useWeekOfMonth
                    ? (0, admin_dashboard_revenue_util_1.formatWeekOfMonthBucketLabel)((_d = (_c = row._id) === null || _c === void 0 ? void 0 : _c.bucket) !== null && _d !== void 0 ? _d : {})
                    : (0, dashboard_metrics_filters_util_1.formatBucketLabel)(granularity, (_f = (_e = row._id) === null || _e === void 0 ? void 0 : _e.bucket) !== null && _f !== void 0 ? _f : {});
                var bucketKey = JSON.stringify((_h = (_g = row._id) === null || _g === void 0 ? void 0 : _g.bucket) !== null && _h !== void 0 ? _h : {});
                var amount = (0, admin_dashboard_revenue_util_1.roundRevenueAmount)((_j = row.amount) !== null && _j !== void 0 ? _j : 0);
                var count = (_k = row.count) !== null && _k !== void 0 ? _k : 0;
                var existingTotal = (_l = bucketTotals.get(bucketKey)) !== null && _l !== void 0 ? _l : {
                    bucket: bucketLabel,
                    amount: 0,
                    count: 0,
                };
                existingTotal.amount = (0, admin_dashboard_revenue_util_1.roundRevenueAmount)(existingTotal.amount + amount);
                existingTotal.count += count;
                bucketTotals.set(bucketKey, existingTotal);
                var perType = (_m = bucketByType.get(bucketKey)) !== null && _m !== void 0 ? _m : {
                    registration: { amount: 0, count: 0 },
                    certification: { amount: 0, count: 0 },
                    renew: { amount: 0, count: 0 },
                };
                perType[typedPaymentType].amount = (0, admin_dashboard_revenue_util_1.roundRevenueAmount)(perType[typedPaymentType].amount + amount);
                perType[typedPaymentType].count += count;
                bucketByType.set(bucketKey, perType);
            }
            var sortedBucketKeys = __spreadArray([], bucketByType.keys(), true).sort(function (a, b) {
                return _this.compareBucketKeys(JSON.parse(a), JSON.parse(b), useWeekOfMonth);
            });
            var buildPoints = function (picker) {
                return sortedBucketKeys.map(function (bucketKey) {
                    var perType = bucketByType.get(bucketKey);
                    var picked = picker(perType);
                    return {
                        bucket: bucketTotals.get(bucketKey).bucket,
                        amount: picked.amount,
                        count: picked.count,
                    };
                });
            };
            var timeSeries = __spreadArray(__spreadArray([], admin_dashboard_revenue_util_1.REVENUE_PAYMENT_TYPE_KEYS.map(function (key) { return ({
                key: key,
                label: admin_dashboard_revenue_util_1.REVENUE_PAYMENT_TYPE_LABELS[key],
                points: buildPoints(function (perType) { return perType[key]; }),
            }); }), true), [
                {
                    key: 'total',
                    label: 'Total Revenue',
                    points: sortedBucketKeys.map(function (bucketKey) {
                        var total = bucketTotals.get(bucketKey);
                        return {
                            bucket: total.bucket,
                            amount: total.amount,
                            count: total.count,
                        };
                    }),
                },
            ], false);
            var weeklyByType = sortedBucketKeys.map(function (bucketKey) {
                var perType = bucketByType.get(bucketKey);
                var total = bucketTotals.get(bucketKey);
                return {
                    bucket: total.bucket,
                    registration: perType.registration.amount,
                    certification: perType.certification.amount,
                    renewal: perType.renew.amount,
                    total: total.amount,
                };
            });
            return { timeSeries: timeSeries, weeklyByType: weeklyByType };
        };
        AdminRevenueDashboardService_1.prototype.compareBucketKeys = function (a, b, useWeekOfMonth) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (((_a = a.year) !== null && _a !== void 0 ? _a : 0) !== ((_b = b.year) !== null && _b !== void 0 ? _b : 0))
                return ((_c = a.year) !== null && _c !== void 0 ? _c : 0) - ((_d = b.year) !== null && _d !== void 0 ? _d : 0);
            if (useWeekOfMonth) {
                return ((_e = a.month) !== null && _e !== void 0 ? _e : 0) - ((_f = b.month) !== null && _f !== void 0 ? _f : 0) || ((_g = a.weekOfMonth) !== null && _g !== void 0 ? _g : 0) - ((_h = b.weekOfMonth) !== null && _h !== void 0 ? _h : 0);
            }
            if (a.month && b.month)
                return a.month - b.month;
            if (a.week && b.week)
                return a.week - b.week;
            if (a.quarter && b.quarter)
                return a.quarter - b.quarter;
            return 0;
        };
        AdminRevenueDashboardService_1.prototype.buildWeeklyComparison = function (filters, scopeUrns, period) {
            return __awaiter(this, void 0, void 0, function () {
                var now, currentRange, previousRange, currentMatch, previousMatch, bucketId, _a, currentRows, previousRows, currentMap, previousMap, weeks, buckets, currentLabel, previousLabel;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            now = new Date();
                            currentRange = (_b = filters.dateRange) !== null && _b !== void 0 ? _b : (0, admin_dashboard_revenue_util_1.getDefaultRevenueChartMonthRange)(now);
                            previousRange = (0, dashboard_metrics_filters_util_1.resolvePreviousDashboardDateRange)(currentRange);
                            currentMatch = (0, admin_dashboard_revenue_util_1.buildPaymentRevenueBaseMatch)(__assign(__assign({}, filters), { dateRange: currentRange }), scopeUrns);
                            previousMatch = (0, admin_dashboard_revenue_util_1.buildPaymentRevenueBaseMatch)(__assign(__assign({}, filters), { dateRange: previousRange }), scopeUrns);
                            bucketId = (0, admin_dashboard_revenue_util_1.revenueWeekOfMonthBucketExpr)('revenueDate');
                            return [4 /*yield*/, Promise.all([
                                    this.aggregateWeeklyTotals(currentMatch, bucketId),
                                    this.aggregateWeeklyTotals(previousMatch, bucketId),
                                ])];
                        case 1:
                            _a = _c.sent(), currentRows = _a[0], previousRows = _a[1];
                            currentMap = new Map(currentRows.map(function (r) { return [
                                (0, admin_dashboard_revenue_util_1.formatWeekOfMonthBucketLabel)(r._id),
                                { amount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)(r.amount), count: r.count },
                            ]; }));
                            previousMap = new Map(previousRows.map(function (r) { return [
                                (0, admin_dashboard_revenue_util_1.formatWeekOfMonthBucketLabel)(r._id),
                                { amount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)(r.amount), count: r.count },
                            ]; }));
                            weeks = ['W1', 'W2', 'W3', 'W4', 'W5'];
                            buckets = weeks.map(function (week) {
                                var _a, _b, _c, _d, _e, _f, _g, _h;
                                return ({
                                    week: week,
                                    currentAmount: (_b = (_a = currentMap.get(week)) === null || _a === void 0 ? void 0 : _a.amount) !== null && _b !== void 0 ? _b : 0,
                                    previousAmount: (_d = (_c = previousMap.get(week)) === null || _c === void 0 ? void 0 : _c.amount) !== null && _d !== void 0 ? _d : 0,
                                    currentCount: (_f = (_e = currentMap.get(week)) === null || _e === void 0 ? void 0 : _e.count) !== null && _f !== void 0 ? _f : 0,
                                    previousCount: (_h = (_g = previousMap.get(week)) === null || _g === void 0 ? void 0 : _g.count) !== null && _h !== void 0 ? _h : 0,
                                });
                            });
                            currentLabel = (0, dashboard_metrics_filters_util_1.revenuePeriodDisplayLabel)(period !== null && period !== void 0 ? period : 'this_month');
                            previousLabel = period === 'last_month' ? 'Month Before Last' : "Previous ".concat(currentLabel);
                            return [2 /*return*/, {
                                    currentPeriodLabel: currentLabel,
                                    previousPeriodLabel: previousLabel,
                                    buckets: buckets,
                                }];
                    }
                });
            });
        };
        AdminRevenueDashboardService_1.prototype.aggregateWeeklyTotals = function (paymentMatch, bucketId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentDetailsModel
                            .aggregate([
                            { $match: paymentMatch },
                            {
                                $addFields: {
                                    revenueDate: (0, admin_dashboard_revenue_util_1.paymentRevenueRecognitionDateExpr)(),
                                },
                            },
                            {
                                $group: {
                                    _id: bucketId,
                                    amount: { $sum: '$quoteTotal' },
                                    count: { $sum: 1 },
                                },
                            },
                        ])
                            .exec()];
                });
            });
        };
        AdminRevenueDashboardService_1.resolveGranularity = function (query) {
            return (0, dashboard_metrics_filters_util_1.resolveRevenueDashboardGranularity)(query.period, query.granularity);
        };
        return AdminRevenueDashboardService_1;
    }());
    __setFunctionName(_classThis, "AdminRevenueDashboardService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminRevenueDashboardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminRevenueDashboardService = _classThis;
}();
exports.AdminRevenueDashboardService = AdminRevenueDashboardService;
