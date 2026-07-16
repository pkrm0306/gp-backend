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
exports.AdminDashboardStatsService = void 0;
var common_1 = require("@nestjs/common");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
var admin_dashboard_pipeline_util_1 = require("../utils/admin-dashboard-pipeline.util");
var admin_dashboard_product_status_util_1 = require("../utils/admin-dashboard-product-status.util");
var AdminDashboardStatsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminDashboardStatsService = _classThis = /** @class */ (function () {
        function AdminDashboardStatsService_1(productModel) {
            this.productModel = productModel;
        }
        AdminDashboardStatsService_1.prototype.buildAppliedFilters = function (query, filters) {
            return (0, dashboard_metrics_filters_util_1.buildAppliedDashboardFilters)(query, filters);
        };
        AdminDashboardStatsService_1.prototype.certifiedActiveExpr = function (now) {
            return {
                $and: [
                    { $eq: ['$productStatus', 2] },
                    {
                        $or: [
                            { $eq: [{ $ifNull: ['$validtillDate', null] }, null] },
                            { $gte: ['$validtillDate', now] },
                        ],
                    },
                ],
            };
        };
        AdminDashboardStatsService_1.prototype.expiredExpr = function (now) {
            return {
                $or: [
                    { $eq: ['$productStatus', product_status_constants_1.PRODUCT_STATUS_DISCONTINUED] },
                    {
                        $and: [
                            { $eq: ['$productStatus', 2] },
                            { $ne: [{ $ifNull: ['$validtillDate', null] }, null] },
                            { $lt: ['$validtillDate', now] },
                        ],
                    },
                ],
            };
        };
        AdminDashboardStatsService_1.prototype.renewedExpr = function () {
            return {
                $or: [
                    { $gte: ['$productRenewStatus', 1] },
                    { $ne: [{ $ifNull: ['$renewedDate', null] }, null] },
                ],
            };
        };
        AdminDashboardStatsService_1.prototype.compareChartBuckets = function (a, b, granularity) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var ay = (_a = a.year) !== null && _a !== void 0 ? _a : 0;
            var by = (_b = b.year) !== null && _b !== void 0 ? _b : 0;
            if (ay !== by)
                return ay - by;
            if (granularity === 'weekly')
                return ((_c = a.week) !== null && _c !== void 0 ? _c : 0) - ((_d = b.week) !== null && _d !== void 0 ? _d : 0);
            if (granularity === 'quarterly') {
                return ((_e = a.quarter) !== null && _e !== void 0 ? _e : 0) - ((_f = b.quarter) !== null && _f !== void 0 ? _f : 0);
            }
            return ((_g = a.month) !== null && _g !== void 0 ? _g : 0) - ((_h = b.month) !== null && _h !== void 0 ? _h : 0);
        };
        /**
         * Accurate widget counts — active products only, same rules as admin product list.
         * Period/year filters do **not** change these totals (only trend charts).
         */
        AdminDashboardStatsService_1.prototype.getProductWidgetStats = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, snapshotMatch, certifiedActive, expired, renewed, baseStages, _a, statusFacet, urnRows, categoryRows, totalRow, row, certified, uncertified, expiredCount, renewedCount, rejected, pending, approved, productStatusBreakdown, totalProducts, uncertifiedForPie, categoryCertified;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            now = new Date();
                            snapshotMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            certifiedActive = this.certifiedActiveExpr(now);
                            expired = this.expiredExpr(now);
                            renewed = this.renewedExpr();
                            baseStages = [{ $match: snapshotMatch }];
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate(__spreadArray(__spreadArray([], baseStages, true), [
                                        {
                                            $facet: {
                                                statusCounts: [
                                                    {
                                                        $group: {
                                                            _id: null,
                                                            certified: { $sum: { $cond: [certifiedActive, 1, 0] } },
                                                            uncertified: {
                                                                $sum: {
                                                                    $cond: [{ $in: ['$productStatus', [0, 1]] }, 1, 0],
                                                                },
                                                            },
                                                            expired: { $sum: { $cond: [expired, 1, 0] } },
                                                            renewed: { $sum: { $cond: [renewed, 1, 0] } },
                                                            rejected: {
                                                                $sum: {
                                                                    $cond: [{ $eq: ['$productStatus', 3] }, 1, 0],
                                                                },
                                                            },
                                                            pending: {
                                                                $sum: {
                                                                    $cond: [{ $eq: ['$productStatus', 0] }, 1, 0],
                                                                },
                                                            },
                                                            approved: {
                                                                $sum: {
                                                                    $cond: [{ $eq: ['$productStatus', 1] }, 1, 0],
                                                                },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ], false))
                                        .exec(),
                                    this.productModel
                                        .aggregate(__spreadArray(__spreadArray([], baseStages, true), [
                                        {
                                            $group: {
                                                _id: '$urnNo',
                                                urnStatus: { $max: '$urnStatus' },
                                            },
                                        },
                                        { $group: { _id: '$urnStatus', count: { $sum: 1 } } },
                                    ], false))
                                        .exec(),
                                    this.productModel
                                        .aggregate(__spreadArray(__spreadArray([], baseStages, true), [
                                        { $match: { $expr: certifiedActive } },
                                        { $group: { _id: '$categoryId', certifiedProducts: { $sum: 1 } } },
                                        {
                                            $lookup: {
                                                from: 'categories',
                                                localField: '_id',
                                                foreignField: '_id',
                                                as: 'cat',
                                            },
                                        },
                                        {
                                            $project: {
                                                name: {
                                                    $ifNull: [
                                                        { $arrayElemAt: ['$cat.category_name', 0] },
                                                        'Unknown',
                                                    ],
                                                },
                                                certifiedProducts: 1,
                                            },
                                        },
                                        { $match: { certifiedProducts: { $gt: 0 } } },
                                        { $sort: { certifiedProducts: -1 } },
                                    ], false))
                                        .exec(),
                                    this.productModel.countDocuments(snapshotMatch).exec(),
                                ])];
                        case 1:
                            _a = _l.sent(), statusFacet = _a[0], urnRows = _a[1], categoryRows = _a[2], totalRow = _a[3];
                            row = (_c = (_b = statusFacet[0]) === null || _b === void 0 ? void 0 : _b.statusCounts) === null || _c === void 0 ? void 0 : _c[0];
                            certified = (_d = row === null || row === void 0 ? void 0 : row.certified) !== null && _d !== void 0 ? _d : 0;
                            uncertified = (_e = row === null || row === void 0 ? void 0 : row.uncertified) !== null && _e !== void 0 ? _e : 0;
                            expiredCount = (_f = row === null || row === void 0 ? void 0 : row.expired) !== null && _f !== void 0 ? _f : 0;
                            renewedCount = (_g = row === null || row === void 0 ? void 0 : row.renewed) !== null && _g !== void 0 ? _g : 0;
                            rejected = (_h = row === null || row === void 0 ? void 0 : row.rejected) !== null && _h !== void 0 ? _h : 0;
                            pending = (_j = row === null || row === void 0 ? void 0 : row.pending) !== null && _j !== void 0 ? _j : 0;
                            approved = (_k = row === null || row === void 0 ? void 0 : row.approved) !== null && _k !== void 0 ? _k : 0;
                            productStatusBreakdown = row
                                ? (0, admin_dashboard_product_status_util_1.buildProductStatusBreakdownFromCounts)({
                                    certified: certified,
                                    uncertified: uncertified,
                                    expired: expiredCount,
                                    renewed: renewedCount,
                                    rejected: rejected,
                                })
                                : (0, admin_dashboard_product_status_util_1.emptyProductStatusBreakdown)();
                            totalProducts = totalRow !== null && totalRow !== void 0 ? totalRow : 0;
                            uncertifiedForPie = Math.max(0, totalProducts - certified);
                            categoryCertified = categoryRows.map(function (r) { return ({
                                name: r.name,
                                certifiedProducts: r.certifiedProducts,
                                products: r.certifiedProducts,
                            }); });
                            return [2 /*return*/, {
                                    statusBreakdown: productStatusBreakdown,
                                    certifiedVsUncertified: {
                                        totals: {
                                            totalProducts: totalProducts,
                                            certifiedProducts: certified,
                                            uncertifiedProducts: uncertifiedForPie,
                                        },
                                        chart: [
                                            { key: 'certified', label: 'Certified', count: certified },
                                            { key: 'uncertified', label: 'Uncertified', count: uncertifiedForPie },
                                        ],
                                    },
                                    urnPipeline: (0, admin_dashboard_pipeline_util_1.buildUrnPipelineChart)(urnRows.map(function (r) {
                                        var _a, _b;
                                        return ({
                                            status: Number((_a = r._id) !== null && _a !== void 0 ? _a : 0),
                                            count: (_b = r.count) !== null && _b !== void 0 ? _b : 0,
                                        });
                                    })),
                                    categoryCertified: categoryCertified,
                                    statusCounts: {
                                        pending: pending,
                                        approved: approved,
                                        certified: certified,
                                        rejected: rejected,
                                        expired: expiredCount,
                                        total: totalProducts,
                                    },
                                }];
                    }
                });
            });
        };
        AdminDashboardStatsService_1.prototype.getTrendCharts = function (filters, granularity) {
            return __awaiter(this, void 0, void 0, function () {
                var now, trendMatch, bucketId, certifiedCond, baseStages, _a, submissionRows, certifiedRows, onlineOfflineRows, sortBuckets;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            trendMatch = (0, dashboard_metrics_filters_util_1.buildProductTrendMatch)(filters, now);
                            bucketId = (0, dashboard_metrics_filters_util_1.bucketDateExpression)(granularity, 'createdDate');
                            certifiedCond = this.certifiedActiveExpr(now);
                            baseStages = [{ $match: trendMatch }];
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate(__spreadArray(__spreadArray([], baseStages, true), [
                                        { $group: { _id: bucketId, count: { $sum: 1 } } },
                                    ], false))
                                        .exec(),
                                    this.productModel
                                        .aggregate(__spreadArray(__spreadArray([], baseStages, true), [
                                        {
                                            $group: {
                                                _id: bucketId,
                                                certified: { $sum: { $cond: [certifiedCond, 1, 0] } },
                                                uncertified: {
                                                    $sum: {
                                                        $cond: [{ $in: ['$productStatus', [0, 1]] }, 1, 0],
                                                    },
                                                },
                                            },
                                        },
                                    ], false))
                                        .exec(),
                                    this.productModel
                                        .aggregate(__spreadArray(__spreadArray([], baseStages, true), [
                                        {
                                            $group: {
                                                _id: bucketId,
                                                online: {
                                                    $sum: { $cond: [{ $eq: ['$productType', 0] }, 1, 0] },
                                                },
                                                offline: {
                                                    $sum: { $cond: [{ $eq: ['$productType', 1] }, 1, 0] },
                                                },
                                            },
                                        },
                                    ], false))
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), submissionRows = _a[0], certifiedRows = _a[1], onlineOfflineRows = _a[2];
                            sortBuckets = function (rows) {
                                return __spreadArray([], rows, true).sort(function (a, b) {
                                    return _this.compareChartBuckets(a._id, b._id, granularity);
                                });
                            };
                            return [2 /*return*/, {
                                    monthlySubmissions: sortBuckets(submissionRows).map(function (r) { return ({
                                        month: (0, dashboard_metrics_filters_util_1.formatBucketLabel)(granularity, r._id),
                                        count: r.count,
                                    }); }),
                                    monthlyCertified: sortBuckets(certifiedRows).map(function (r) { return ({
                                        month: (0, dashboard_metrics_filters_util_1.formatBucketLabel)(granularity, r._id),
                                        certified: r.certified,
                                        uncertified: r.uncertified,
                                    }); }),
                                    onlineOffline: sortBuckets(onlineOfflineRows).map(function (r) { return ({
                                        month: (0, dashboard_metrics_filters_util_1.formatBucketLabel)(granularity, r._id),
                                        online: r.online,
                                        offline: r.offline,
                                    }); }),
                                }];
                    }
                });
            });
        };
        AdminDashboardStatsService_1.prototype.getCharts = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, widgets, trends;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.getProductWidgetStats(filters),
                                this.getTrendCharts(filters, filters.granularity),
                            ])];
                        case 1:
                            _a = _b.sent(), widgets = _a[0], trends = _a[1];
                            return [2 /*return*/, __assign({ categoryDistribution: widgets.categoryCertified.map(function (r) { return ({
                                        name: r.name,
                                        products: r.certifiedProducts,
                                        sales: 0,
                                    }); }), categoryCertified: widgets.categoryCertified, productStatusBreakdown: widgets.statusBreakdown, certifiedVsUncertified: widgets.certifiedVsUncertified, urnPipeline: widgets.urnPipeline }, trends)];
                    }
                });
            });
        };
        /**
         * Monthly (or weekly/quarterly) rejected product volume for the Rejection Trend area chart.
         * Buckets by `rejectedAt`, falling back to `updatedDate` for legacy rows.
         */
        AdminDashboardStatsService_1.prototype.getRejectionTrend = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, granularity, snapshotMatch, rejectedMatch, dateMatch, bucketId, _a, trendRows, rejectedInRange, totalRejected, sortedRows, chart, maxCount, suggestedMax, subtitle;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            now = new Date();
                            granularity = (_b = filters.granularity) !== null && _b !== void 0 ? _b : 'monthly';
                            snapshotMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            rejectedMatch = __assign(__assign({}, snapshotMatch), { productStatus: 3 });
                            dateMatch = __assign({}, rejectedMatch);
                            if (filters.dateRange) {
                                dateMatch.$expr = {
                                    $and: [
                                        {
                                            $gte: [
                                                { $ifNull: ['$rejectedAt', '$updatedDate'] },
                                                filters.dateRange.from,
                                            ],
                                        },
                                        {
                                            $lte: [
                                                { $ifNull: ['$rejectedAt', '$updatedDate'] },
                                                filters.dateRange.to,
                                            ],
                                        },
                                    ],
                                };
                            }
                            bucketId = (0, dashboard_metrics_filters_util_1.bucketDateExpression)(granularity, 'rejectionDate');
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate([
                                        { $match: dateMatch },
                                        {
                                            $addFields: {
                                                rejectionDate: { $ifNull: ['$rejectedAt', '$updatedDate'] },
                                            },
                                        },
                                        { $group: { _id: bucketId, count: { $sum: 1 } } },
                                    ])
                                        .exec(),
                                    this.productModel.countDocuments(dateMatch).exec(),
                                    this.productModel.countDocuments(rejectedMatch).exec(),
                                ])];
                        case 1:
                            _a = _c.sent(), trendRows = _a[0], rejectedInRange = _a[1], totalRejected = _a[2];
                            sortedRows = __spreadArray([], trendRows, true).sort(function (a, b) {
                                return _this.compareChartBuckets(a._id, b._id, granularity);
                            });
                            chart = sortedRows.map(function (row) {
                                var _a, _b;
                                return ({
                                    label: (0, dashboard_metrics_filters_util_1.formatBucketLabel)(granularity, row._id),
                                    year: (_a = row._id.year) !== null && _a !== void 0 ? _a : 0,
                                    month: row._id.month,
                                    quarter: row._id.quarter,
                                    week: row._id.week,
                                    count: (_b = row.count) !== null && _b !== void 0 ? _b : 0,
                                });
                            });
                            maxCount = chart.reduce(function (max, point) { return Math.max(max, point.count); }, 0);
                            suggestedMax = this.suggestRejectionTrendYMax(maxCount);
                            subtitle = granularity === 'weekly'
                                ? 'Weekly rejected product volume'
                                : granularity === 'quarterly'
                                    ? 'Quarterly rejected product volume'
                                    : 'Monthly rejected product volume';
                            return [2 /*return*/, {
                                    title: 'Rejection Trend',
                                    subtitle: subtitle,
                                    unit: 'products',
                                    granularity: granularity,
                                    totals: {
                                        rejectedInRange: rejectedInRange,
                                        totalRejected: totalRejected,
                                    },
                                    chart: chart,
                                    yAxis: {
                                        min: 0,
                                        suggestedMax: suggestedMax,
                                    },
                                }];
                    }
                });
            });
        };
        AdminDashboardStatsService_1.prototype.suggestRejectionTrendYMax = function (maxCount) {
            if (maxCount <= 0)
                return 1;
            if (maxCount <= 1)
                return 1;
            if (maxCount <= 4)
                return 4;
            var magnitude = Math.pow(10, Math.floor(Math.log10(maxCount)));
            var normalized = maxCount / magnitude;
            var nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
            return nice * magnitude;
        };
        return AdminDashboardStatsService_1;
    }());
    __setFunctionName(_classThis, "AdminDashboardStatsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDashboardStatsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDashboardStatsService = _classThis;
}();
exports.AdminDashboardStatsService = AdminDashboardStatsService;
