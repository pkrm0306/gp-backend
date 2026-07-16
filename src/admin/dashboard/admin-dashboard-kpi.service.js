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
exports.AdminDashboardKpiService = void 0;
var common_1 = require("@nestjs/common");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var admin_dashboard_metrics_util_1 = require("../admin-dashboard-metrics.util");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
var admin_dashboard_revenue_util_1 = require("../utils/admin-dashboard-revenue.util");
var AdminDashboardKpiService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminDashboardKpiService = _classThis = /** @class */ (function () {
        function AdminDashboardKpiService_1(productModel, manufacturerModel, paymentDetailsModel, vendorProductChangeRequestModel, contactMessageModel, dashboardStatsService, certificationTimingService) {
            this.productModel = productModel;
            this.manufacturerModel = manufacturerModel;
            this.paymentDetailsModel = paymentDetailsModel;
            this.vendorProductChangeRequestModel = vendorProductChangeRequestModel;
            this.contactMessageModel = contactMessageModel;
            this.dashboardStatsService = dashboardStatsService;
            this.certificationTimingService = certificationTimingService;
        }
        AdminDashboardKpiService_1.prototype.getKpiBundle = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, cards, certificationTiming;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.getKpiCards(filters),
                                this.certificationTimingService.getCertificationTiming(filters),
                            ])];
                        case 1:
                            _a = _b.sent(), cards = _a[0], certificationTiming = _a[1];
                            return [2 /*return*/, { cards: cards, certificationTiming: certificationTiming }];
                    }
                });
            });
        };
        AdminDashboardKpiService_1.prototype.getKpiCards = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, productMatch, manufacturerMatch, paymentVendorScope, thresholdDate, monthStart, renewEoiMatch, renewQueueMatch, pendingEoiMatch, _a, productWidgets, manufacturerFacet, pendingEoiCount, pendingProductRequests, renewEoiCount, renewQueueUrnCount, paymentFacet, revenueFacet, totalInquiriesCount, inquiriesThisMonth, productInquiriesCount, productInquiriesThisMonth, manufacturers, _i, _b, row, key, certifiedActive, totalProducts, expiredCount, rejectedCount, decidedCount, successRate, pendingApplicationsTotal;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            now = new Date();
                            productMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            manufacturerMatch = (0, dashboard_metrics_filters_util_1.buildManufacturerSnapshotMatch)(filters);
                            paymentVendorScope = this.buildPaymentVendorScope(filters);
                            thresholdDate = new Date(now);
                            thresholdDate.setDate(thresholdDate.getDate() + 60);
                            monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                            renewEoiMatch = __assign(__assign({}, productMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, $or: [
                                    {
                                        validtillDate: {
                                            $exists: true,
                                            $ne: null,
                                            $lt: thresholdDate,
                                        },
                                    },
                                    { urnStatus: { $gte: 12, $lte: 17 } },
                                ] });
                            renewQueueMatch = __assign(__assign({}, productMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, urnStatus: { $gte: 12, $lte: 17 } });
                            pendingEoiMatch = __assign(__assign({}, productMatch), { productStatus: { $in: [0, 1] } });
                            return [4 /*yield*/, Promise.all([
                                    this.dashboardStatsService.getProductWidgetStats(filters),
                                    this.aggregateManufacturerFacet(manufacturerMatch),
                                    this.productModel.countDocuments(pendingEoiMatch).exec(),
                                    this.vendorProductChangeRequestModel
                                        .countDocuments({ status: 'pending' })
                                        .exec(),
                                    this.productModel.countDocuments(renewEoiMatch).exec(),
                                    this.productModel
                                        .aggregate([
                                        { $match: renewQueueMatch },
                                        { $group: { _id: '$urnNo' } },
                                        { $count: 'count' },
                                    ])
                                        .exec()
                                        .then(function (rows) { var _a, _b; return (_b = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0; }),
                                    this.aggregatePaymentFacet(paymentVendorScope),
                                    this.aggregateCompletedRevenue(paymentVendorScope),
                                    this.contactMessageModel.countDocuments({
                                        $or: [
                                            { inquiryType: 'contact' },
                                            { inquiryType: { $exists: false } },
                                            { inquiryType: null },
                                            { inquiryType: '' },
                                        ],
                                    }).exec(),
                                    this.contactMessageModel
                                        .countDocuments({
                                        createdAt: { $gte: monthStart },
                                        $or: [
                                            { inquiryType: 'contact' },
                                            { inquiryType: { $exists: false } },
                                            { inquiryType: null },
                                            { inquiryType: '' },
                                        ],
                                    })
                                        .exec(),
                                    this.contactMessageModel.countDocuments({ inquiryType: 'product' }).exec(),
                                    this.contactMessageModel
                                        .countDocuments({
                                        inquiryType: 'product',
                                        createdAt: { $gte: monthStart },
                                    })
                                        .exec(),
                                ])];
                        case 1:
                            _a = _e.sent(), productWidgets = _a[0], manufacturerFacet = _a[1], pendingEoiCount = _a[2], pendingProductRequests = _a[3], renewEoiCount = _a[4], renewQueueUrnCount = _a[5], paymentFacet = _a[6], revenueFacet = _a[7], totalInquiriesCount = _a[8], inquiriesThisMonth = _a[9], productInquiriesCount = _a[10], productInquiriesThisMonth = _a[11];
                            manufacturers = {
                                verified: 0,
                                unverified: 0,
                                inactivePending: 0,
                                verifiedActive: manufacturerFacet.verifiedActive,
                                verifiedInactive: manufacturerFacet.verifiedInactive,
                            };
                            for (_i = 0, _b = manufacturerFacet.byStatus; _i < _b.length; _i++) {
                                row = _b[_i];
                                key = (0, admin_dashboard_metrics_util_1.manufacturerStatusKey)(Number((_c = row._id) !== null && _c !== void 0 ? _c : 0));
                                manufacturers[key] += (_d = row.count) !== null && _d !== void 0 ? _d : 0;
                            }
                            certifiedActive = productWidgets.statusCounts.certified;
                            totalProducts = productWidgets.statusCounts.total;
                            expiredCount = productWidgets.statusCounts.expired;
                            rejectedCount = productWidgets.statusCounts.rejected;
                            decidedCount = certifiedActive + rejectedCount;
                            successRate = decidedCount > 0
                                ? Math.round((certifiedActive / decidedCount) * 1000) / 10
                                : 0;
                            pendingApplicationsTotal = pendingEoiCount + pendingProductRequests;
                            return [2 /*return*/, {
                                    activeManufacturers: {
                                        key: 'activeManufacturers',
                                        label: 'Total Active Manufacturers',
                                        value: manufacturers.verifiedActive,
                                        subMetrics: {
                                            registered: manufacturerFacet.total,
                                            verified: manufacturers.verified,
                                        },
                                    },
                                    certifiedProducts: {
                                        key: 'certifiedProducts',
                                        label: 'Total Certified Products',
                                        value: certifiedActive,
                                        subMetrics: {
                                            totalRecords: totalProducts,
                                            expired: expiredCount,
                                        },
                                    },
                                    pendingApplications: {
                                        key: 'pendingApplications',
                                        label: 'Total Pending Applications',
                                        value: pendingApplicationsTotal,
                                        subMetrics: {
                                            eois: pendingEoiCount,
                                            productRequests: pendingProductRequests,
                                        },
                                    },
                                    transactions: {
                                        key: 'transactions',
                                        label: 'Total Transactions',
                                        value: paymentFacet.paid + paymentFacet.overdue,
                                        subMetrics: {
                                            paid: paymentFacet.paid,
                                            pending: paymentFacet.overdue,
                                        },
                                    },
                                    certificationSuccessRate: {
                                        key: 'certificationSuccessRate',
                                        label: 'Certification Success Rate',
                                        value: successRate,
                                        subMetrics: {
                                            certified: certifiedActive,
                                            decided: decidedCount,
                                            rejected: rejectedCount,
                                        },
                                    },
                                    totalRevenue: {
                                        key: 'totalRevenue',
                                        label: 'Total Revenue',
                                        value: revenueFacet.amount,
                                        currency: 'INR',
                                        subMetrics: {
                                            completedPayments: revenueFacet.count,
                                        },
                                    },
                                    pendingRenewals: {
                                        key: 'pendingRenewals',
                                        label: 'Pending Renewals',
                                        value: renewEoiCount,
                                        subMetrics: {
                                            renewalQueueItems: renewQueueUrnCount,
                                        },
                                    },
                                    expiredCertifications: {
                                        key: 'expiredCertifications',
                                        label: 'Expired Certifications',
                                        value: expiredCount,
                                        subMetrics: {
                                            requiresRenewal: expiredCount,
                                        },
                                    },
                                    totalInquiries: {
                                        key: 'totalInquiries',
                                        label: 'Contact Inquiries',
                                        value: totalInquiriesCount,
                                        subMetrics: {
                                            thisMonth: inquiriesThisMonth,
                                        },
                                    },
                                    productInquiries: {
                                        key: 'productInquiries',
                                        label: 'Product Inquiries',
                                        value: productInquiriesCount,
                                        subMetrics: {
                                            thisMonth: productInquiriesThisMonth,
                                        },
                                    },
                                }];
                    }
                });
            });
        };
        AdminDashboardKpiService_1.prototype.buildPaymentVendorScope = function (filters) {
            var _a;
            if (!((_a = filters.manufacturerIdsForRegion) === null || _a === void 0 ? void 0 : _a.length)) {
                return {};
            }
            return { vendorId: { $in: filters.manufacturerIdsForRegion } };
        };
        AdminDashboardKpiService_1.prototype.aggregateManufacturerFacet = function (manufacturerMatch) {
            return __awaiter(this, void 0, void 0, function () {
                var pipeline, rows, payload;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            pipeline = [];
                            if (Object.keys(manufacturerMatch).length > 0) {
                                pipeline.push({ $match: manufacturerMatch });
                            }
                            pipeline.push({
                                $facet: {
                                    total: [{ $count: 'count' }],
                                    byStatus: [
                                        { $group: { _id: '$manufacturerStatus', count: { $sum: 1 } } },
                                    ],
                                    verifiedActive: [
                                        { $match: { manufacturerStatus: 1, vendor_status: 1 } },
                                        { $count: 'count' },
                                    ],
                                    verifiedInactive: [
                                        {
                                            $match: {
                                                manufacturerStatus: 1,
                                                vendor_status: { $ne: 1 },
                                            },
                                        },
                                        { $count: 'count' },
                                    ],
                                },
                            });
                            return [4 /*yield*/, this.manufacturerModel
                                    .aggregate(pipeline)
                                    .exec()];
                        case 1:
                            rows = _l.sent();
                            payload = rows[0];
                            return [2 /*return*/, {
                                    total: (_c = (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.total) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.count) !== null && _c !== void 0 ? _c : 0,
                                    byStatus: (_d = payload === null || payload === void 0 ? void 0 : payload.byStatus) !== null && _d !== void 0 ? _d : [],
                                    verifiedActive: (_g = (_f = (_e = payload === null || payload === void 0 ? void 0 : payload.verifiedActive) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.count) !== null && _g !== void 0 ? _g : 0,
                                    verifiedInactive: (_k = (_j = (_h = payload === null || payload === void 0 ? void 0 : payload.verifiedInactive) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.count) !== null && _k !== void 0 ? _k : 0,
                                }];
                    }
                });
            });
        };
        AdminDashboardKpiService_1.prototype.aggregatePaymentFacet = function (vendorScope) {
            return __awaiter(this, void 0, void 0, function () {
                var match, rows, byStatus, _i, rows_1, row, paid, overdue, created, cancelled;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            match = Object.keys(vendorScope).length > 0 ? vendorScope : undefined;
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .aggregate(__spreadArray(__spreadArray([], (match ? [{ $match: match }] : []), true), [
                                    { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
                                ], false))
                                    .exec()];
                        case 1:
                            rows = _g.sent();
                            byStatus = new Map();
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                byStatus.set(Number((_a = row._id) !== null && _a !== void 0 ? _a : 0), (_b = row.count) !== null && _b !== void 0 ? _b : 0);
                            }
                            paid = (_c = byStatus.get(2)) !== null && _c !== void 0 ? _c : 0;
                            overdue = (_d = byStatus.get(1)) !== null && _d !== void 0 ? _d : 0;
                            created = (_e = byStatus.get(0)) !== null && _e !== void 0 ? _e : 0;
                            cancelled = (_f = byStatus.get(3)) !== null && _f !== void 0 ? _f : 0;
                            return [2 /*return*/, {
                                    total: paid + overdue + created + cancelled,
                                    paid: paid,
                                    overdue: overdue,
                                    created: created,
                                }];
                    }
                });
            });
        };
        AdminDashboardKpiService_1.prototype.aggregateCompletedRevenue = function (vendorScope) {
            return __awaiter(this, void 0, void 0, function () {
                var match, rows, row;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            match = __assign({ paymentStatus: 2 }, vendorScope);
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .aggregate([
                                    { $match: match },
                                    {
                                        $group: {
                                            _id: null,
                                            amount: { $sum: '$quoteTotal' },
                                            count: { $sum: 1 },
                                        },
                                    },
                                ])
                                    .exec()];
                        case 1:
                            rows = _c.sent();
                            row = rows[0];
                            return [2 /*return*/, {
                                    amount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)((_a = row === null || row === void 0 ? void 0 : row.amount) !== null && _a !== void 0 ? _a : 0),
                                    count: (_b = row === null || row === void 0 ? void 0 : row.count) !== null && _b !== void 0 ? _b : 0,
                                }];
                    }
                });
            });
        };
        return AdminDashboardKpiService_1;
    }());
    __setFunctionName(_classThis, "AdminDashboardKpiService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDashboardKpiService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDashboardKpiService = _classThis;
}();
exports.AdminDashboardKpiService = AdminDashboardKpiService;
