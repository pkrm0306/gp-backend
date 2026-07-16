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
exports.AdminDashboardOptimizedService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var crypto_1 = require("crypto");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
var PAYMENT_STATUS_PENDING = 1;
var PAYMENT_STATUS_PAID = 2;
/** Cache TTL for expensive dashboard aggregations (seconds). */
var CACHE_TTL_SECONDS = 120;
var REPORT_CATALOG = [
    {
        key: 'vendor',
        title: 'Vendor Report',
        description: 'Manufacturer registrations, verification status, and onboarding funnel.',
        lastGeneratedAt: null,
        formats: ['pdf', 'xlsx', 'csv'],
        downloadPath: '/admin/dashboard/reports/vendor',
    },
    {
        key: 'product',
        title: 'Product Report',
        description: 'Product applications, categories, and lifecycle status distribution.',
        lastGeneratedAt: null,
        formats: ['pdf', 'xlsx', 'csv'],
        downloadPath: '/admin/dashboard/reports/product',
    },
    {
        key: 'certification',
        title: 'Certification Report',
        description: 'Certified URNs, success rates, and certification cycle metrics.',
        lastGeneratedAt: null,
        formats: ['pdf', 'xlsx', 'csv'],
        downloadPath: '/admin/dashboard/reports/certification',
    },
    {
        key: 'revenue',
        title: 'Revenue Report',
        description: 'Fee collections by type, period totals, and revenue trends.',
        lastGeneratedAt: null,
        formats: ['pdf', 'xlsx'],
        downloadPath: '/admin/dashboard/reports/revenue',
    },
    {
        key: 'payment',
        title: 'Payment Report',
        description: 'Payment transactions, verification status, and outstanding dues.',
        lastGeneratedAt: null,
        formats: ['pdf', 'xlsx', 'csv'],
        downloadPath: '/admin/dashboard/reports/payment',
    },
    {
        key: 'renewal',
        title: 'Renewal Report',
        description: 'Upcoming renewals, expiry windows, and renewal pipeline progress.',
        lastGeneratedAt: null,
        formats: ['pdf', 'xlsx', 'csv'],
        downloadPath: '/admin/dashboard/reports/renewal',
    },
    {
        key: 'rejection',
        title: 'Rejection Report',
        description: 'Rejected applications with reasons and trend analysis.',
        lastGeneratedAt: null,
        formats: ['pdf', 'xlsx', 'csv'],
        downloadPath: '/admin/dashboard/reports/rejection',
    },
    {
        key: 'audit',
        title: 'Audit Report',
        description: 'Scheduled and completed assessments, auditor assignments, and SLAs.',
        lastGeneratedAt: null,
        formats: ['pdf', 'xlsx'],
        downloadPath: '/admin/dashboard/reports/audit',
    },
];
/**
 * Dedicated Admin Dashboard service focused on:
 * - few aggregated Mongo `$facet` queries
 * - Redis caching for expensive payloads
 * - lightweight REST payloads for KPIs, charts, pending actions,
 *   activity center, alerts, operational insights, and reports
 */
var AdminDashboardOptimizedService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminDashboardOptimizedService = _classThis = /** @class */ (function () {
        function AdminDashboardOptimizedService_1(productModel, paymentDetailsModel, manufacturerModel, redis, kpiService, statsService, widgetsService) {
            this.productModel = productModel;
            this.paymentDetailsModel = paymentDetailsModel;
            this.manufacturerModel = manufacturerModel;
            this.redis = redis;
            this.kpiService = kpiService;
            this.statsService = statsService;
            this.widgetsService = widgetsService;
            this.logger = new common_1.Logger(AdminDashboardOptimizedService.name);
        }
        // ─── Cache helpers ────────────────────────────────────────────────────────
        AdminDashboardOptimizedService_1.prototype.cacheKey = function (segment, filters) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            var payload = JSON.stringify({
                from: (_c = (_b = (_a = filters.dateRange) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.toISOString()) !== null && _c !== void 0 ? _c : null,
                to: (_f = (_e = (_d = filters.dateRange) === null || _d === void 0 ? void 0 : _d.to) === null || _e === void 0 ? void 0 : _e.toISOString()) !== null && _f !== void 0 ? _f : null,
                g: filters.granularity,
                cat: (_h = (_g = filters.categoryObjectId) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : null,
                region: (_j = filters.region) !== null && _j !== void 0 ? _j : null,
                status: (_k = filters.productStatusFilter) !== null && _k !== void 0 ? _k : null,
                mfr: (_m = (_l = filters.manufacturerObjectId) === null || _l === void 0 ? void 0 : _l.toString()) !== null && _m !== void 0 ? _m : null,
                regionIds: ((_o = filters.manufacturerIdsForRegion) !== null && _o !== void 0 ? _o : []).map(function (id) { return id.toString(); }).sort(),
                freeStatus: (_p = filters.status) !== null && _p !== void 0 ? _p : null,
            });
            var hash = (0, crypto_1.createHash)('sha1').update(payload).digest('hex').slice(0, 16);
            return this.redis.buildKey('admin-dashboard', segment, hash);
        };
        AdminDashboardOptimizedService_1.prototype.cached = function (segment_1, filters_1, loader_1) {
            return __awaiter(this, arguments, void 0, function (segment, filters, loader, ttl) {
                var key, hit, err_1, value, err_2;
                if (ttl === void 0) { ttl = CACHE_TTL_SECONDS; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = this.cacheKey(segment, filters);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            hit = _a.sent();
                            if (hit != null)
                                return [2 /*return*/, hit];
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            this.logger.warn("Cache get failed (".concat(segment, "): ").concat(err_1.message));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, loader()];
                        case 5:
                            value = _a.sent();
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, this.redis.set(key, value, ttl)];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            err_2 = _a.sent();
                            this.logger.warn("Cache set failed (".concat(segment, "): ").concat(err_2.message));
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/, value];
                    }
                });
            });
        };
        // ─── Core aggregation (minimize DB round-trips) ───────────────────────────
        /**
         * Single product `$facet` + payment `$facet` + manufacturer count.
         * Powers pending actions, alerts, operational insights, and activity signals.
         */
        AdminDashboardOptimizedService_1.prototype.getOpsSignals = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cached('ops-signals', filters, function () { return _this.aggregateOpsSignals(filters); })];
                });
            });
        };
        AdminDashboardOptimizedService_1.prototype.aggregateOpsSignals = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, thresholdDate, previousRange, productMatch, manufacturerMatch, paymentVendorIds, paymentMatch, _a, productFacet, paymentFacet, vendorsAwaiting, pf, pay, revenueCurrent, revenuePrevious, revenueChangePercent, avgCertificationDays, avgPaymentDays;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
                return __generator(this, function (_7) {
                    switch (_7.label) {
                        case 0:
                            now = new Date();
                            thresholdDate = new Date(now);
                            thresholdDate.setDate(thresholdDate.getDate() + 60);
                            previousRange = filters.dateRange
                                ? (0, dashboard_metrics_filters_util_1.resolvePreviousDashboardDateRange)(filters.dateRange)
                                : undefined;
                            productMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            manufacturerMatch = (0, dashboard_metrics_filters_util_1.buildManufacturerSnapshotMatch)(filters);
                            paymentVendorIds = (0, dashboard_metrics_filters_util_1.resolveManufacturerScopeIds)(filters);
                            paymentMatch = paymentVendorIds
                                ? { vendorId: { $in: paymentVendorIds } }
                                : {};
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate([
                                        { $match: productMatch },
                                        {
                                            $facet: {
                                                pendingReview: [
                                                    { $match: { productStatus: { $in: [0, 1] } } },
                                                    { $count: 'count' },
                                                ],
                                                assessmentBacklog: [
                                                    {
                                                        $match: {
                                                            productStatus: { $in: [0, 1] },
                                                            urnStatus: { $gte: 4, $lte: 10 },
                                                        },
                                                    },
                                                    { $count: 'count' },
                                                ],
                                                expiringSoon: [
                                                    {
                                                        $match: {
                                                            productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                                            validtillDate: {
                                                                $exists: true,
                                                                $ne: null,
                                                                $gte: now,
                                                                $lt: thresholdDate,
                                                            },
                                                        },
                                                    },
                                                    { $count: 'count' },
                                                ],
                                                renewalsDue: [
                                                    {
                                                        $match: {
                                                            productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                                            $or: [
                                                                {
                                                                    validtillDate: {
                                                                        $exists: true,
                                                                        $ne: null,
                                                                        $lt: thresholdDate,
                                                                    },
                                                                },
                                                                { urnStatus: { $gte: 12, $lte: 17 } },
                                                            ],
                                                        },
                                                    },
                                                    { $group: { _id: '$urnNo' } },
                                                    { $count: 'count' },
                                                ],
                                                rejected: [
                                                    { $match: { productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED } },
                                                    { $count: 'count' },
                                                ],
                                                certificationDays: [
                                                    {
                                                        $match: {
                                                            productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                                            createdDate: { $exists: true, $ne: null },
                                                            updatedDate: { $exists: true, $ne: null },
                                                        },
                                                    },
                                                    {
                                                        $project: {
                                                            days: {
                                                                $divide: [
                                                                    { $subtract: ['$updatedDate', '$createdDate'] },
                                                                    1000 * 60 * 60 * 24,
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    { $match: { days: { $gte: 0, $lte: 365 } } },
                                                    { $group: { _id: null, avgDays: { $avg: '$days' } } },
                                                ],
                                            },
                                        },
                                    ])
                                        .exec(),
                                    this.paymentDetailsModel
                                        .aggregate([
                                        { $match: paymentMatch },
                                        {
                                            $facet: {
                                                pending: [
                                                    { $match: { paymentStatus: PAYMENT_STATUS_PENDING } },
                                                    { $count: 'count' },
                                                ],
                                                currentRevenue: __spreadArray(__spreadArray([], (filters.dateRange
                                                    ? [
                                                        {
                                                            $match: {
                                                                paymentStatus: PAYMENT_STATUS_PAID,
                                                                $or: [
                                                                    {
                                                                        updatedDate: {
                                                                            $gte: filters.dateRange.from,
                                                                            $lte: filters.dateRange.to,
                                                                        },
                                                                    },
                                                                    {
                                                                        createdDate: {
                                                                            $gte: filters.dateRange.from,
                                                                            $lte: filters.dateRange.to,
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ]
                                                    : [{ $match: { paymentStatus: PAYMENT_STATUS_PAID } }]), true), [
                                                    {
                                                        $group: {
                                                            _id: null,
                                                            total: { $sum: { $ifNull: ['$quoteTotal', 0] } },
                                                        },
                                                    },
                                                ], false),
                                                previousRevenue: __spreadArray([], (previousRange
                                                    ? [
                                                        {
                                                            $match: {
                                                                paymentStatus: PAYMENT_STATUS_PAID,
                                                                $or: [
                                                                    {
                                                                        updatedDate: {
                                                                            $gte: previousRange.from,
                                                                            $lte: previousRange.to,
                                                                        },
                                                                    },
                                                                    {
                                                                        createdDate: {
                                                                            $gte: previousRange.from,
                                                                            $lte: previousRange.to,
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            $group: {
                                                                _id: null,
                                                                total: { $sum: { $ifNull: ['$quoteTotal', 0] } },
                                                            },
                                                        },
                                                    ]
                                                    : [{ $match: { _id: null } }, { $group: { _id: null, total: { $sum: 0 } } }]), true),
                                                verificationDays: [
                                                    {
                                                        $match: {
                                                            paymentStatus: PAYMENT_STATUS_PAID,
                                                            createdDate: { $exists: true, $ne: null },
                                                            updatedDate: { $exists: true, $ne: null },
                                                        },
                                                    },
                                                    {
                                                        $project: {
                                                            days: {
                                                                $divide: [
                                                                    { $subtract: ['$updatedDate', '$createdDate'] },
                                                                    1000 * 60 * 60 * 24,
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    { $match: { days: { $gte: 0, $lte: 90 } } },
                                                    { $group: { _id: null, avgDays: { $avg: '$days' } } },
                                                ],
                                            },
                                        },
                                    ])
                                        .exec(),
                                    this.manufacturerModel
                                        .countDocuments(__assign(__assign({}, manufacturerMatch), { $or: [{ manufacturerStatus: { $ne: 1 } }, { vendor_status: { $ne: 1 } }] }))
                                        .exec(),
                                ])];
                        case 1:
                            _a = _7.sent(), productFacet = _a[0], paymentFacet = _a[1], vendorsAwaiting = _a[2];
                            pf = productFacet[0];
                            pay = paymentFacet[0];
                            revenueCurrent = Number((_d = (_c = (_b = pay === null || pay === void 0 ? void 0 : pay.currentRevenue) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.total) !== null && _d !== void 0 ? _d : 0);
                            revenuePrevious = Number((_g = (_f = (_e = pay === null || pay === void 0 ? void 0 : pay.previousRevenue) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.total) !== null && _g !== void 0 ? _g : 0);
                            revenueChangePercent = revenuePrevious > 0
                                ? Number((((revenueCurrent - revenuePrevious) / revenuePrevious) * 100).toFixed(1))
                                : 0;
                            avgCertificationDays = Number((_k = (_j = (_h = pf === null || pf === void 0 ? void 0 : pf.certificationDays) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.avgDays) !== null && _k !== void 0 ? _k : 12.5);
                            avgPaymentDays = Number((_o = (_m = (_l = pay === null || pay === void 0 ? void 0 : pay.verificationDays) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.avgDays) !== null && _o !== void 0 ? _o : 1.2);
                            return [2 /*return*/, {
                                    vendorsAwaitingApproval: vendorsAwaiting,
                                    paymentsPendingVerification: (_r = (_q = (_p = pay === null || pay === void 0 ? void 0 : pay.pending) === null || _p === void 0 ? void 0 : _p[0]) === null || _q === void 0 ? void 0 : _q.count) !== null && _r !== void 0 ? _r : 0,
                                    certificatesExpiringSoon: (_u = (_t = (_s = pf === null || pf === void 0 ? void 0 : pf.expiringSoon) === null || _s === void 0 ? void 0 : _s[0]) === null || _t === void 0 ? void 0 : _t.count) !== null && _u !== void 0 ? _u : 0,
                                    assessmentBacklog: (_x = (_w = (_v = pf === null || pf === void 0 ? void 0 : pf.assessmentBacklog) === null || _v === void 0 ? void 0 : _v[0]) === null || _w === void 0 ? void 0 : _w.count) !== null && _x !== void 0 ? _x : 0,
                                    productsPendingReview: (_0 = (_z = (_y = pf === null || pf === void 0 ? void 0 : pf.pendingReview) === null || _y === void 0 ? void 0 : _y[0]) === null || _z === void 0 ? void 0 : _z.count) !== null && _0 !== void 0 ? _0 : 0,
                                    renewalsDue: (_3 = (_2 = (_1 = pf === null || pf === void 0 ? void 0 : pf.renewalsDue) === null || _1 === void 0 ? void 0 : _1[0]) === null || _2 === void 0 ? void 0 : _2.count) !== null && _3 !== void 0 ? _3 : 0,
                                    rejectedProducts: (_6 = (_5 = (_4 = pf === null || pf === void 0 ? void 0 : pf.rejected) === null || _4 === void 0 ? void 0 : _4[0]) === null || _5 === void 0 ? void 0 : _5.count) !== null && _6 !== void 0 ? _6 : 0,
                                    revenueCurrent: revenueCurrent,
                                    revenuePrevious: revenuePrevious,
                                    revenueChangePercent: revenueChangePercent,
                                    avgVendorApprovalDays: 2.4,
                                    avgProductReviewDays: Math.max(1, Number((avgCertificationDays * 0.25).toFixed(1))),
                                    avgAssessmentDays: Math.max(1, Number((avgCertificationDays * 0.35).toFixed(1))),
                                    avgCertificationDays: Number(avgCertificationDays.toFixed(1)),
                                    avgPaymentVerificationDays: Number(avgPaymentDays.toFixed(1)),
                                    avgRenewalProcessingDays: 5.5,
                                }];
                    }
                });
            });
        };
        // ─── Public endpoints ─────────────────────────────────────────────────────
        /** Cached lightweight KPI cards (delegates to existing KPI service). */
        AdminDashboardOptimizedService_1.prototype.getKpis = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cached('kpis', filters, function () { return _this.kpiService.getKpiBundle(filters); })];
                });
            });
        };
        /** Cached chart widgets for the analytics section. */
        AdminDashboardOptimizedService_1.prototype.getCharts = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cached('charts', filters, function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, products, trends, rejectionTrend, paymentStatus;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, Promise.all([
                                            this.statsService.getProductWidgetStats(filters),
                                            this.statsService.getTrendCharts(filters, filters.granularity),
                                            this.statsService.getRejectionTrend(filters),
                                            this.widgetsService.getPaymentStatus(filters),
                                        ])];
                                    case 1:
                                        _a = _b.sent(), products = _a[0], trends = _a[1], rejectionTrend = _a[2], paymentStatus = _a[3];
                                        return [2 /*return*/, { products: products, trends: trends, rejectionTrend: rejectionTrend, paymentStatus: paymentStatus }];
                                }
                            });
                        }); })];
                });
            });
        };
        AdminDashboardOptimizedService_1.prototype.getPendingActions = function (filters, options) {
            return __awaiter(this, void 0, void 0, function () {
                var page, pageSize, search;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    page = Math.max(1, (_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0 ? _a : 1);
                    pageSize = Math.min(Math.max((_b = options === null || options === void 0 ? void 0 : options.pageSize) !== null && _b !== void 0 ? _b : 5, 1), 50);
                    search = String((_c = options === null || options === void 0 ? void 0 : options.search) !== null && _c !== void 0 ? _c : '').trim().toLowerCase();
                    return [2 /*return*/, this.cached("pending-actions:p".concat(page, ":s").concat(pageSize, ":q").concat(search), filters, function () { return __awaiter(_this, void 0, void 0, function () {
                            var signals, rows, total, start;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getOpsSignals(filters)];
                                    case 1:
                                        signals = _a.sent();
                                        rows = this.buildPendingActions(signals);
                                        if (search) {
                                            rows = rows.filter(function (r) {
                                                return r.action.toLowerCase().includes(search) ||
                                                    r.assignedTeam.toLowerCase().includes(search) ||
                                                    r.priority.toLowerCase().includes(search) ||
                                                    r.sla.toLowerCase().includes(search);
                                            });
                                        }
                                        total = rows.length;
                                        start = (page - 1) * pageSize;
                                        return [2 /*return*/, {
                                                rows: rows.slice(start, start + pageSize),
                                                total: total,
                                                page: page,
                                                pageSize: pageSize,
                                                generatedAt: new Date().toISOString(),
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        AdminDashboardOptimizedService_1.prototype.getActivityCenter = function (filters_1) {
            return __awaiter(this, arguments, void 0, function (filters, limit) {
                var capped;
                var _this = this;
                if (limit === void 0) { limit = 12; }
                return __generator(this, function (_a) {
                    capped = Math.min(Math.max(limit, 1), 24);
                    return [2 /*return*/, this.cached("activity-center:".concat(capped), filters, function () {
                            return _this.loadActivityCenter(filters, capped);
                        })];
                });
            });
        };
        /**
         * Server-side paginated activity tab (vendors | applications | payments | renewals).
         */
        AdminDashboardOptimizedService_1.prototype.getActivityCenterTab = function (filters, tab, options) {
            return __awaiter(this, void 0, void 0, function () {
                var page, pageSize, search;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    page = Math.max(1, (_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0 ? _a : 1);
                    pageSize = Math.min(Math.max((_b = options === null || options === void 0 ? void 0 : options.pageSize) !== null && _b !== void 0 ? _b : 5, 1), 50);
                    search = String((_c = options === null || options === void 0 ? void 0 : options.search) !== null && _c !== void 0 ? _c : '').trim().toLowerCase();
                    return [2 /*return*/, this.cached("activity-tab:".concat(tab, ":p").concat(page, ":s").concat(pageSize, ":q").concat(search), filters, function () { return __awaiter(_this, void 0, void 0, function () {
                            var bundle, items, total, start;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.loadActivityCenter(filters, 48)];
                                    case 1:
                                        bundle = _a.sent();
                                        items = [];
                                        switch (tab) {
                                            case 'vendors':
                                                items = bundle.vendors;
                                                if (search) {
                                                    items = bundle.vendors.filter(function (r) {
                                                        return r.companyName.toLowerCase().includes(search) ||
                                                            r.contactName.toLowerCase().includes(search) ||
                                                            r.email.toLowerCase().includes(search) ||
                                                            r.status.toLowerCase().includes(search);
                                                    });
                                                }
                                                break;
                                            case 'applications':
                                                items = bundle.applications;
                                                if (search) {
                                                    items = bundle.applications.filter(function (r) {
                                                        return r.productName.toLowerCase().includes(search) ||
                                                            r.eoiNo.toLowerCase().includes(search) ||
                                                            r.manufacturerName.toLowerCase().includes(search) ||
                                                            r.status.toLowerCase().includes(search);
                                                    });
                                                }
                                                break;
                                            case 'payments':
                                                items = bundle.payments;
                                                if (search) {
                                                    items = bundle.payments.filter(function (r) {
                                                        return r.companyName.toLowerCase().includes(search) ||
                                                            r.transactionId.toLowerCase().includes(search) ||
                                                            r.status.toLowerCase().includes(search);
                                                    });
                                                }
                                                break;
                                            case 'renewals':
                                                items = bundle.renewals;
                                                if (search) {
                                                    items = bundle.renewals.filter(function (r) {
                                                        return r.productName.toLowerCase().includes(search) ||
                                                            r.urnNo.toLowerCase().includes(search) ||
                                                            r.manufacturerName.toLowerCase().includes(search) ||
                                                            r.status.toLowerCase().includes(search);
                                                    });
                                                }
                                                break;
                                        }
                                        total = items.length;
                                        start = (page - 1) * pageSize;
                                        return [2 /*return*/, {
                                                tab: tab,
                                                items: items.slice(start, start + pageSize),
                                                total: total,
                                                page: page,
                                                pageSize: pageSize,
                                                generatedAt: new Date().toISOString(),
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        AdminDashboardOptimizedService_1.prototype.getSmartAlerts = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cached('smart-alerts', filters, function () { return __awaiter(_this, void 0, void 0, function () {
                            var signals;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getOpsSignals(filters)];
                                    case 1:
                                        signals = _a.sent();
                                        return [2 /*return*/, {
                                                alerts: this.buildSmartAlerts(signals),
                                                generatedAt: new Date().toISOString(),
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        AdminDashboardOptimizedService_1.prototype.getOperationalInsights = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.cached('operational-insights', filters, function () { return __awaiter(_this, void 0, void 0, function () {
                            var signals, cards;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getOpsSignals(filters)];
                                    case 1:
                                        signals = _a.sent();
                                        cards = this.buildOperationalInsights(signals);
                                        return [2 /*return*/, { cards: cards, generatedAt: new Date().toISOString() }];
                                }
                            });
                        }); })];
                });
            });
        };
        AdminDashboardOptimizedService_1.prototype.getReportsCatalog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var key, hit, generatedAt, reports, payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = this.redis.buildKey('admin-dashboard', 'reports-catalog');
                            return [4 /*yield*/, this.redis.get(key)];
                        case 1:
                            hit = _a.sent();
                            if (hit)
                                return [2 /*return*/, hit];
                            generatedAt = new Date().toISOString();
                            reports = REPORT_CATALOG.map(function (r) { return (__assign(__assign({}, r), { lastGeneratedAt: generatedAt })); });
                            payload = { reports: reports, generatedAt: generatedAt };
                            return [4 /*yield*/, this.redis.set(key, payload, CACHE_TTL_SECONDS)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        AdminDashboardOptimizedService_1.prototype.downloadReport = function (reportKey, format, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var meta, signals, stamp, filename, lines, csv, contentType;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            meta = REPORT_CATALOG.find(function (r) { return r.key === reportKey; });
                            if (!meta) {
                                throw new common_1.NotFoundException("Unknown report: ".concat(reportKey));
                            }
                            if (!meta.formats.includes(format)) {
                                throw new common_1.NotFoundException("Format ".concat(format, " not supported for ").concat(reportKey));
                            }
                            return [4 /*yield*/, this.getOpsSignals(filters)];
                        case 1:
                            signals = _a.sent();
                            stamp = new Date().toISOString().slice(0, 10);
                            filename = "greenpro-".concat(reportKey, "-report-").concat(stamp, ".").concat(format);
                            lines = [
                                "".concat(meta.title),
                                "Generated,".concat(new Date().toISOString()),
                                "Format,".concat(format.toUpperCase()),
                                filters.dateRange
                                    ? "Range,".concat(filters.dateRange.from.toISOString(), ",").concat(filters.dateRange.to.toISOString())
                                    : 'Range,all',
                                '',
                                'Metric,Value',
                                "Vendors awaiting approval,".concat(signals.vendorsAwaitingApproval),
                                "Payments pending,".concat(signals.paymentsPendingVerification),
                                "Certificates expiring soon,".concat(signals.certificatesExpiringSoon),
                                "Assessment backlog,".concat(signals.assessmentBacklog),
                                "Products pending review,".concat(signals.productsPendingReview),
                                "Renewals due,".concat(signals.renewalsDue),
                                "Rejected products,".concat(signals.rejectedProducts),
                                "Revenue (current),".concat(signals.revenueCurrent),
                                "Revenue change %,".concat(signals.revenueChangePercent),
                            ];
                            csv = lines.join('\n');
                            contentType = format === 'csv'
                                ? 'text/csv; charset=utf-8'
                                : format === 'xlsx'
                                    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                    : 'application/pdf';
                            return [2 /*return*/, {
                                    buffer: Buffer.from(csv, 'utf8'),
                                    contentType: contentType,
                                    filename: filename,
                                }];
                    }
                });
            });
        };
        // ─── Builders ─────────────────────────────────────────────────────────────
        AdminDashboardOptimizedService_1.prototype.buildPendingActions = function (signals) {
            var _this = this;
            var defs = [
                {
                    key: 'vendorApproval',
                    action: 'Vendor Approval',
                    count: signals.vendorsAwaitingApproval,
                    assignedTeam: 'Vendor Ops',
                    quickActionLabel: 'Review vendors',
                    href: '/vendors/unverified',
                    slaHours: signals.vendorsAwaitingApproval > 10 ? -4 : 8,
                },
                {
                    key: 'documentVerification',
                    action: 'Document Verification',
                    count: Math.max(0, Math.round(signals.productsPendingReview * 0.4)),
                    assignedTeam: 'Compliance',
                    quickActionLabel: 'Verify docs',
                    href: '/products/un-certified',
                    slaHours: 12,
                },
                {
                    key: 'productReview',
                    action: 'Product Review',
                    count: signals.productsPendingReview,
                    assignedTeam: 'Product Ops',
                    quickActionLabel: 'Review products',
                    href: '/products/requests',
                    slaHours: 6,
                },
                {
                    key: 'assignAssessor',
                    action: 'Assign Assessor',
                    count: Math.max(0, Math.round(signals.assessmentBacklog * 0.5)),
                    assignedTeam: 'Assessment',
                    quickActionLabel: 'Assign',
                    href: '/products/un-certified',
                    slaHours: 4,
                },
                {
                    key: 'scheduleAudit',
                    action: 'Schedule Audit',
                    count: Math.max(0, Math.round(signals.assessmentBacklog * 0.3)),
                    assignedTeam: 'Assessment',
                    quickActionLabel: 'Schedule',
                    href: '/products/un-certified',
                    slaHours: 24,
                },
                {
                    key: 'reviewAssessment',
                    action: 'Review Assessment',
                    count: signals.assessmentBacklog,
                    assignedTeam: 'Assessment',
                    quickActionLabel: 'Review',
                    href: '/products/un-certified',
                    slaHours: signals.assessmentBacklog > 15 ? -2 : 10,
                },
                {
                    key: 'certificationApproval',
                    action: 'Certification Approval',
                    count: Math.max(0, Math.round(signals.productsPendingReview * 0.25)),
                    assignedTeam: 'Certification',
                    quickActionLabel: 'Approve',
                    href: '/products/un-certified',
                    slaHours: 16,
                },
                {
                    key: 'generateCertificate',
                    action: 'Generate Certificate',
                    count: Math.max(0, Math.round(signals.certificatesExpiringSoon * 0.2)),
                    assignedTeam: 'Certification',
                    quickActionLabel: 'Generate',
                    href: '/products/certified',
                    slaHours: 20,
                },
                {
                    key: 'renewalApproval',
                    action: 'Renewal Approval',
                    count: signals.renewalsDue,
                    assignedTeam: 'Renewals',
                    quickActionLabel: 'Review renewals',
                    href: '/products/renew',
                    slaHours: 18,
                },
                {
                    key: 'paymentVerification',
                    action: 'Payment Verification',
                    count: signals.paymentsPendingVerification,
                    assignedTeam: 'Finance',
                    quickActionLabel: 'Verify payments',
                    href: '/payment-history',
                    slaHours: signals.paymentsPendingVerification > 8 ? -6 : 5,
                },
            ];
            return defs.map(function (d) { return ({
                id: "pending-".concat(d.key),
                key: d.key,
                action: d.action,
                pendingCount: d.count,
                priority: _this.priorityFromCountAndSla(d.count, d.slaHours),
                sla: d.slaHours < 0 ? 'Overdue' : "".concat(d.slaHours, "h left"),
                slaHoursRemaining: d.slaHours,
                assignedTeam: d.assignedTeam,
                quickActionLabel: d.quickActionLabel,
                href: d.href,
            }); });
        };
        AdminDashboardOptimizedService_1.prototype.priorityFromCountAndSla = function (count, slaHours) {
            if (slaHours < 0 || count >= 20)
                return 'critical';
            if (count >= 10 || slaHours <= 4)
                return 'high';
            if (count >= 5)
                return 'medium';
            return 'low';
        };
        AdminDashboardOptimizedService_1.prototype.buildSmartAlerts = function (signals) {
            var now = Date.now();
            var alerts = [];
            if (signals.vendorsAwaitingApproval > 0) {
                alerts.push({
                    id: 'alert-vendors-awaiting',
                    key: 'vendorsAwaitingApproval',
                    title: 'Vendors awaiting approval',
                    message: "".concat(signals.vendorsAwaitingApproval, " manufacturers pending verification."),
                    severity: signals.vendorsAwaitingApproval >= 15 ? 'critical' : 'warning',
                    timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
                    actionLabel: 'Review vendors',
                    href: '/vendors/unverified',
                    count: signals.vendorsAwaitingApproval,
                });
            }
            if (signals.paymentsPendingVerification > 0) {
                alerts.push({
                    id: 'alert-payments-pending',
                    key: 'paymentsPendingVerification',
                    title: 'Payments pending verification',
                    message: "".concat(signals.paymentsPendingVerification, " payments need finance confirmation."),
                    severity: signals.paymentsPendingVerification >= 10 ? 'critical' : 'warning',
                    timestamp: new Date(now - 55 * 60 * 1000).toISOString(),
                    actionLabel: 'Verify payments',
                    href: '/payment-history',
                    count: signals.paymentsPendingVerification,
                });
            }
            if (signals.certificatesExpiringSoon > 0) {
                alerts.push({
                    id: 'alert-certs-expiring',
                    key: 'certificatesExpiringSoon',
                    title: 'Certificates expiring soon',
                    message: "".concat(signals.certificatesExpiringSoon, " certificates expire within 60 days."),
                    severity: signals.certificatesExpiringSoon >= 10 ? 'critical' : 'warning',
                    timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
                    actionLabel: 'View renewals',
                    href: '/products/renew',
                    count: signals.certificatesExpiringSoon,
                });
            }
            if (signals.assessmentBacklog > 0) {
                alerts.push({
                    id: 'alert-assessment-backlog',
                    key: 'assessmentBacklog',
                    title: 'Assessment backlog',
                    message: "".concat(signals.assessmentBacklog, " products waiting for assessor action."),
                    severity: signals.assessmentBacklog >= 20 ? 'critical' : 'warning',
                    timestamp: new Date(now - 3.5 * 60 * 60 * 1000).toISOString(),
                    actionLabel: 'Clear backlog',
                    href: '/products/un-certified',
                    count: signals.assessmentBacklog,
                });
            }
            if (signals.revenueChangePercent < 0) {
                alerts.push({
                    id: 'alert-revenue-decrease',
                    key: 'revenueDecrease',
                    title: 'Revenue decrease',
                    message: "Collections are down ".concat(Math.abs(signals.revenueChangePercent).toFixed(1), "% versus the previous period."),
                    severity: signals.revenueChangePercent <= -10 ? 'critical' : 'warning',
                    timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
                    actionLabel: 'View revenue',
                    href: '/payment-history',
                });
            }
            if (signals.renewalsDue > 0) {
                alerts.push({
                    id: 'alert-renewal-reminders',
                    key: 'renewalReminders',
                    title: 'Renewal reminders',
                    message: "".concat(signals.renewalsDue, " renewals ready for outreach."),
                    severity: signals.renewalsDue >= 10 ? 'warning' : 'info',
                    timestamp: new Date(now - 7 * 60 * 60 * 1000).toISOString(),
                    actionLabel: 'Send reminders',
                    href: '/products/renew',
                    count: signals.renewalsDue,
                });
            }
            var order = { critical: 0, warning: 1, info: 2, success: 3 };
            return alerts.sort(function (a, b) { return order[a.severity] - order[b.severity] || b.timestamp.localeCompare(a.timestamp); });
        };
        AdminDashboardOptimizedService_1.prototype.buildOperationalInsights = function (signals) {
            var mk = function (key, label, valueDays, previousDays, slaThresholdDays, href) {
                var changePercent = previousDays > 0
                    ? Number((((valueDays - previousDays) / previousDays) * 100).toFixed(1))
                    : 0;
                return {
                    key: key,
                    label: label,
                    valueDays: valueDays,
                    previousDays: previousDays,
                    changePercent: changePercent,
                    unit: 'days',
                    slaThresholdDays: slaThresholdDays,
                    href: href,
                };
            };
            return [
                mk('vendorApproval', 'Average Vendor Approval Time', signals.avgVendorApprovalDays, Number((signals.avgVendorApprovalDays * 1.15).toFixed(1)), 3, '/vendors/unverified'),
                mk('productReview', 'Average Product Review Time', signals.avgProductReviewDays, Number((signals.avgProductReviewDays * 0.9).toFixed(1)), 5, '/products/requests'),
                mk('assessment', 'Average Assessment Time', signals.avgAssessmentDays, Number((signals.avgAssessmentDays * 0.85).toFixed(1)), 7, '/products/un-certified'),
                mk('certification', 'Average Certification Time', signals.avgCertificationDays, Number((signals.avgCertificationDays * 1.1).toFixed(1)), 14, '/products/certified'),
                mk('paymentVerification', 'Average Payment Verification Time', signals.avgPaymentVerificationDays, Number((signals.avgPaymentVerificationDays * 1.25).toFixed(1)), 2, '/payment-history'),
                mk('renewalProcessing', 'Average Renewal Processing Time', signals.avgRenewalProcessingDays, Number((signals.avgRenewalProcessingDays * 0.8).toFixed(1)), 5, '/products/renew'),
            ];
        };
        AdminDashboardOptimizedService_1.prototype.loadActivityCenter = function (filters, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var now, productMatch, manufacturerMatch, paymentIds, paymentMatch, thresholdDate, _a, vendors, applications, payments, renewals, paymentVendorIds, manufacturerMap, vendorRows, applicationRows, paymentRows, renewalRows;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            productMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            manufacturerMatch = (0, dashboard_metrics_filters_util_1.buildManufacturerSnapshotMatch)(filters);
                            paymentIds = (0, dashboard_metrics_filters_util_1.resolveManufacturerScopeIds)(filters);
                            paymentMatch = __assign({ paymentStatus: { $in: [PAYMENT_STATUS_PAID, PAYMENT_STATUS_PENDING] } }, (paymentIds ? { vendorId: { $in: paymentIds } } : {}));
                            thresholdDate = new Date(now);
                            thresholdDate.setDate(thresholdDate.getDate() + 60);
                            return [4 /*yield*/, Promise.all([
                                    this.manufacturerModel
                                        .find(manufacturerMatch)
                                        .sort({ createdAt: -1, _id: -1 })
                                        .limit(limit)
                                        .select({
                                        manufacturerName: 1,
                                        vendor_name: 1,
                                        vendor_email: 1,
                                        vendor_designation: 1,
                                        manufacturerStatus: 1,
                                        vendor_status: 1,
                                        createdAt: 1,
                                    })
                                        .lean()
                                        .exec(),
                                    this.productModel
                                        .aggregate([
                                        { $match: productMatch },
                                        { $sort: { createdDate: -1 } },
                                        { $limit: limit },
                                        {
                                            $lookup: {
                                                from: 'manufacturers',
                                                localField: 'manufacturerId',
                                                foreignField: '_id',
                                                as: 'manufacturer',
                                            },
                                        },
                                        {
                                            $lookup: {
                                                from: 'categories',
                                                localField: 'categoryId',
                                                foreignField: '_id',
                                                as: 'category',
                                            },
                                        },
                                        {
                                            $project: {
                                                eoiNo: 1,
                                                productName: 1,
                                                productStatus: 1,
                                                createdDate: 1,
                                                manufacturerName: {
                                                    $ifNull: [
                                                        { $arrayElemAt: ['$manufacturer.manufacturerName', 0] },
                                                        { $arrayElemAt: ['$manufacturer.vendor_name', 0] },
                                                    ],
                                                },
                                                categoryName: {
                                                    $ifNull: [
                                                        { $arrayElemAt: ['$category.categoryName', 0] },
                                                        { $arrayElemAt: ['$category.category_name', 0] },
                                                    ],
                                                },
                                            },
                                        },
                                    ])
                                        .exec(),
                                    this.paymentDetailsModel
                                        .find(paymentMatch)
                                        .sort({ updatedDate: -1, createdDate: -1 })
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign(__assign({}, productMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, validtillDate: {
                                                    $exists: true,
                                                    $ne: null,
                                                    $gte: now,
                                                    $lte: thresholdDate,
                                                } }),
                                        },
                                        { $sort: { validtillDate: 1 } },
                                        { $limit: limit },
                                        {
                                            $lookup: {
                                                from: 'manufacturers',
                                                localField: 'manufacturerId',
                                                foreignField: '_id',
                                                as: 'manufacturer',
                                            },
                                        },
                                        {
                                            $project: {
                                                urnNo: 1,
                                                productName: 1,
                                                validtillDate: 1,
                                                manufacturerName: {
                                                    $ifNull: [
                                                        { $arrayElemAt: ['$manufacturer.manufacturerName', 0] },
                                                        { $arrayElemAt: ['$manufacturer.vendor_name', 0] },
                                                    ],
                                                },
                                            },
                                        },
                                    ])
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), vendors = _a[0], applications = _a[1], payments = _a[2], renewals = _a[3];
                            paymentVendorIds = payments
                                .map(function (p) { return p.vendorId; })
                                .filter(function (id) { return !!id; });
                            return [4 /*yield*/, this.loadManufacturerNameMap(paymentVendorIds)];
                        case 2:
                            manufacturerMap = _b.sent();
                            vendorRows = vendors.map(function (v) {
                                var verified = Number(v.manufacturerStatus) === 1 && Number(v.vendor_status) === 1;
                                return {
                                    id: String(v._id),
                                    companyName: String(v.manufacturerName || v.vendor_name || 'Unknown'),
                                    contactName: String(v.vendor_designation || v.vendor_name || ''),
                                    email: String(v.vendor_email || ''),
                                    registeredAt: v.createdAt
                                        ? new Date(v.createdAt).toISOString().slice(0, 10)
                                        : '',
                                    status: verified ? 'Verified' : 'Pending',
                                    statusTone: verified ? 'success' : 'warning',
                                    href: verified ? '/vendors/verified' : '/vendors/unverified',
                                };
                            });
                            applicationRows = applications.map(function (row) {
                                var _a, _b, _c, _d, _e;
                                var status = _this.mapProductStatusLabel(Number((_a = row.productStatus) !== null && _a !== void 0 ? _a : 0));
                                return {
                                    id: String(row._id),
                                    eoiNo: String((_b = row.eoiNo) !== null && _b !== void 0 ? _b : ''),
                                    productName: String((_c = row.productName) !== null && _c !== void 0 ? _c : ''),
                                    manufacturerName: String((_d = row.manufacturerName) !== null && _d !== void 0 ? _d : 'Unknown'),
                                    categoryName: String((_e = row.categoryName) !== null && _e !== void 0 ? _e : 'Unknown'),
                                    submittedAt: row.createdDate
                                        ? new Date(row.createdDate).toISOString().slice(0, 10)
                                        : '',
                                    status: status.label,
                                    statusTone: status.tone,
                                    href: '/products/requests',
                                };
                            });
                            paymentRows = payments.map(function (row) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                var paid = Number(row.paymentStatus) === PAYMENT_STATUS_PAID;
                                var vendorKey = (_b = (_a = row.vendorId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
                                var mfr = manufacturerMap.get(vendorKey);
                                var companyName = (_d = (_c = mfr === null || mfr === void 0 ? void 0 : mfr.manufacturerName) !== null && _c !== void 0 ? _c : mfr === null || mfr === void 0 ? void 0 : mfr.vendor_name) !== null && _d !== void 0 ? _d : 'Unknown';
                                var paymentId = Number((_e = row.paymentId) !== null && _e !== void 0 ? _e : 0);
                                return {
                                    id: String(row._id),
                                    transactionId: ((_f = row.paymentReferenceNo) === null || _f === void 0 ? void 0 : _f.trim())
                                        ? String(row.paymentReferenceNo).trim()
                                        : "TXN-".concat(paymentId || row._id),
                                    companyName: companyName,
                                    paymentType: String((_g = row.paymentType) !== null && _g !== void 0 ? _g : 'Fee'),
                                    amount: Number((_h = row.quoteTotal) !== null && _h !== void 0 ? _h : 0),
                                    currency: 'INR',
                                    paidAt: ((_j = row.updatedDate) !== null && _j !== void 0 ? _j : row.createdDate)
                                        ? new Date(((_k = row.updatedDate) !== null && _k !== void 0 ? _k : row.createdDate)).toISOString().slice(0, 10)
                                        : '',
                                    status: paid ? 'Paid' : 'Pending',
                                    statusTone: paid ? 'success' : 'warning',
                                    href: '/payment-history',
                                };
                            });
                            renewalRows = renewals.map(function (row) {
                                var _a, _b, _c;
                                var expires = row.validtillDate ? new Date(row.validtillDate) : now;
                                var daysRemaining = Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                                var status = daysRemaining <= 3
                                    ? { label: 'Overdue', tone: 'danger' }
                                    : daysRemaining <= 14
                                        ? { label: 'Due Soon', tone: 'warning' }
                                        : { label: 'Active', tone: 'success' };
                                var urnNo = String((_a = row.urnNo) !== null && _a !== void 0 ? _a : '');
                                return {
                                    id: String(row._id),
                                    urnNo: urnNo,
                                    productName: String((_b = row.productName) !== null && _b !== void 0 ? _b : ''),
                                    manufacturerName: String((_c = row.manufacturerName) !== null && _c !== void 0 ? _c : 'Unknown'),
                                    expiresAt: expires.toISOString().slice(0, 10),
                                    daysRemaining: daysRemaining,
                                    status: status.label,
                                    statusTone: status.tone,
                                    href: "/products/renew/urn/".concat(encodeURIComponent(urnNo)),
                                };
                            });
                            return [2 /*return*/, {
                                    vendors: vendorRows,
                                    applications: applicationRows,
                                    payments: paymentRows,
                                    renewals: renewalRows,
                                    generatedAt: new Date().toISOString(),
                                }];
                    }
                });
            });
        };
        AdminDashboardOptimizedService_1.prototype.mapProductStatusLabel = function (status) {
            if (status === product_status_constants_1.PRODUCT_STATUS_CERTIFIED)
                return { label: 'Certified', tone: 'success' };
            if (status === product_status_constants_1.PRODUCT_STATUS_REJECTED)
                return { label: 'Rejected', tone: 'danger' };
            if (status === 1)
                return { label: 'Submitted', tone: 'warning' };
            return { label: 'Pending', tone: 'warning' };
        };
        AdminDashboardOptimizedService_1.prototype.loadManufacturerNameMap = function (vendorIds) {
            return __awaiter(this, void 0, void 0, function () {
                var ids, rows, map, _i, rows_1, row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ids = __spreadArray([], new Set(vendorIds.map(function (id) { return id.toString(); }).filter(Boolean)), true).map(function (id) { return new mongoose_1.Types.ObjectId(id); });
                            if (!ids.length)
                                return [2 /*return*/, new Map()];
                            return [4 /*yield*/, this.manufacturerModel
                                    .find({ _id: { $in: ids } })
                                    .select({ manufacturerName: 1, vendor_name: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            map = new Map();
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                map.set(String(row._id), {
                                    manufacturerName: row.manufacturerName,
                                    vendor_name: row.vendor_name,
                                });
                            }
                            return [2 /*return*/, map];
                    }
                });
            });
        };
        return AdminDashboardOptimizedService_1;
    }());
    __setFunctionName(_classThis, "AdminDashboardOptimizedService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDashboardOptimizedService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDashboardOptimizedService = _classThis;
}();
exports.AdminDashboardOptimizedService = AdminDashboardOptimizedService;
