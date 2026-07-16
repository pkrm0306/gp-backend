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
exports.AdminDashboardWidgetsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
var admin_dashboard_revenue_util_1 = require("../utils/admin-dashboard-revenue.util");
var PAYMENT_STATUS_PAID = 2;
var PAYMENT_STATUS_PENDING = 1;
var AdminDashboardWidgetsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminDashboardWidgetsService = _classThis = /** @class */ (function () {
        function AdminDashboardWidgetsService_1(paymentDetailsModel, productModel, manufacturerModel, dashboardKpi, dashboardStats, sustainability, visitorAnalytics) {
            this.paymentDetailsModel = paymentDetailsModel;
            this.productModel = productModel;
            this.manufacturerModel = manufacturerModel;
            this.dashboardKpi = dashboardKpi;
            this.dashboardStats = dashboardStats;
            this.sustainability = sustainability;
            this.visitorAnalytics = visitorAnalytics;
        }
        AdminDashboardWidgetsService_1.prototype.getOverview = function (filters, options) {
            return __awaiter(this, void 0, void 0, function () {
                var limit, _a, kpiBundle, paymentStatus, recentPayments, recentApplications, alerts, products, trends, rejectionTrend, sustainabilityContributions, visitorAnalytics;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            limit = Math.min(Math.max((_b = options === null || options === void 0 ? void 0 : options.recentLimit) !== null && _b !== void 0 ? _b : 5, 1), 20);
                            return [4 /*yield*/, Promise.all([
                                    this.dashboardKpi.getKpiBundle(filters),
                                    this.getPaymentStatus(filters),
                                    this.getRecentPayments(filters, limit),
                                    this.getRecentApplications(filters, limit),
                                    this.getAlerts(filters),
                                    this.dashboardStats.getProductWidgetStats(filters),
                                    this.dashboardStats.getTrendCharts(filters, filters.granularity),
                                    this.dashboardStats.getRejectionTrend(filters),
                                    this.sustainability.getSustainabilityContributions(filters),
                                    this.visitorAnalytics.getVisitorAnalytics(filters),
                                ])];
                        case 1:
                            _a = _c.sent(), kpiBundle = _a[0], paymentStatus = _a[1], recentPayments = _a[2], recentApplications = _a[3], alerts = _a[4], products = _a[5], trends = _a[6], rejectionTrend = _a[7], sustainabilityContributions = _a[8], visitorAnalytics = _a[9];
                            return [2 /*return*/, {
                                    kpiCards: kpiBundle.cards,
                                    certificationTiming: kpiBundle.certificationTiming,
                                    paymentStatus: paymentStatus,
                                    recentPayments: recentPayments,
                                    recentApplications: recentApplications,
                                    alerts: alerts,
                                    charts: { products: products, trends: trends, rejectionTrend: rejectionTrend },
                                    sustainabilityContributions: sustainabilityContributions,
                                    visitorAnalytics: visitorAnalytics,
                                }];
                    }
                });
            });
        };
        /** Paid + pending only (excludes created, cancelled, overdue). */
        AdminDashboardWidgetsService_1.prototype.getPaymentStatus = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorScope, match, rows, paid, pending, total, items;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            vendorScope = this.buildPaymentVendorScope(filters);
                            match = __assign({ paymentStatus: { $in: [PAYMENT_STATUS_PAID, PAYMENT_STATUS_PENDING] } }, vendorScope);
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .aggregate([
                                    { $match: match },
                                    { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
                                ])
                                    .exec()];
                        case 1:
                            rows = _e.sent();
                            paid = (_b = (_a = rows.find(function (r) { return Number(r._id) === PAYMENT_STATUS_PAID; })) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
                            pending = (_d = (_c = rows.find(function (r) { return Number(r._id) === PAYMENT_STATUS_PENDING; })) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
                            total = paid + pending;
                            items = [
                                this.buildPaymentStatusItem('paid', 'Paid', paid, total),
                                this.buildPaymentStatusItem('pending', 'Pending', pending, total),
                            ];
                            return [2 /*return*/, { total: total, items: items, chart: items }];
                    }
                });
            });
        };
        AdminDashboardWidgetsService_1.prototype.getRecentPayments = function (filters_1) {
            return __awaiter(this, arguments, void 0, function (filters, limit) {
                var vendorScope, match, rows, manufacturerMap;
                var _this = this;
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorScope = this.buildPaymentVendorScope(filters);
                            match = __assign({ paymentStatus: { $in: [PAYMENT_STATUS_PAID, PAYMENT_STATUS_PENDING] } }, vendorScope);
                            return [4 /*yield*/, this.paymentDetailsModel
                                    .find(match)
                                    .sort({ updatedDate: -1, createdDate: -1 })
                                    .limit(limit)
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [4 /*yield*/, this.loadManufacturerNameMap(rows.map(function (r) { return r.vendorId; }))];
                        case 2:
                            manufacturerMap = _a.sent();
                            return [2 /*return*/, rows.map(function (row) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                    var status = Number(row.paymentStatus) === PAYMENT_STATUS_PAID ? 'paid' : 'pending';
                                    var vendorKey = (_b = (_a = row.vendorId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
                                    var manufacturer = manufacturerMap.get(vendorKey);
                                    var companyName = (_d = (_c = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _c !== void 0 ? _c : manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_name) !== null && _d !== void 0 ? _d : 'Unknown';
                                    var paymentId = Number((_e = row.paymentId) !== null && _e !== void 0 ? _e : 0);
                                    var date = (_f = row.updatedDate) !== null && _f !== void 0 ? _f : row.createdDate;
                                    return {
                                        paymentId: paymentId,
                                        transactionId: ((_g = row.paymentReferenceNo) === null || _g === void 0 ? void 0 : _g.trim())
                                            ? String(row.paymentReferenceNo).trim()
                                            : "TXN-".concat(paymentId || row._id),
                                        companyName: companyName,
                                        manufacturerName: companyName,
                                        urnNo: String((_h = row.urnNo) !== null && _h !== void 0 ? _h : ''),
                                        paymentType: String((_j = row.paymentType) !== null && _j !== void 0 ? _j : ''),
                                        paymentTypeLabel: _this.formatPaymentType(row.paymentType),
                                        paymentMode: (_k = row.paymentMode) !== null && _k !== void 0 ? _k : null,
                                        paymentModeLabel: row.paymentMode
                                            ? _this.formatPaymentMode(row.paymentMode)
                                            : null,
                                        amount: (0, admin_dashboard_revenue_util_1.roundRevenueAmount)(Number((_l = row.quoteTotal) !== null && _l !== void 0 ? _l : 0)),
                                        currency: 'INR',
                                        date: date ? new Date(date).toISOString().slice(0, 10) : '',
                                        status: status,
                                        statusLabel: status === 'paid' ? 'Paid' : 'Pending',
                                    };
                                })];
                    }
                });
            });
        };
        AdminDashboardWidgetsService_1.prototype.getRecentApplications = function (filters_1) {
            return __awaiter(this, arguments, void 0, function (filters, limit) {
                var now, productMatch, thresholdDate, rows;
                var _this = this;
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            productMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            thresholdDate = new Date(now);
                            thresholdDate.setDate(thresholdDate.getDate() + 60);
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    { $match: productMatch },
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
                                    { $sort: { createdDate: -1 } },
                                    { $limit: limit },
                                    {
                                        $project: {
                                            productId: 1,
                                            eoiNo: 1,
                                            productName: 1,
                                            productStatus: 1,
                                            validtillDate: 1,
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
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) {
                                    var _a, _b, _c, _d, _e, _f;
                                    var statusInfo = _this.mapApplicationStatus(Number((_a = row.productStatus) !== null && _a !== void 0 ? _a : 0), row.validtillDate, now, thresholdDate);
                                    return {
                                        productId: Number((_b = row.productId) !== null && _b !== void 0 ? _b : 0),
                                        eoiNo: String((_c = row.eoiNo) !== null && _c !== void 0 ? _c : ''),
                                        productName: String((_d = row.productName) !== null && _d !== void 0 ? _d : ''),
                                        manufacturerName: String((_e = row.manufacturerName) !== null && _e !== void 0 ? _e : 'Unknown'),
                                        categoryName: String((_f = row.categoryName) !== null && _f !== void 0 ? _f : 'Unknown'),
                                        date: row.createdDate
                                            ? new Date(row.createdDate).toISOString().slice(0, 10)
                                            : '',
                                        status: statusInfo.key,
                                        statusLabel: statusInfo.label,
                                    };
                                })];
                    }
                });
            });
        };
        AdminDashboardWidgetsService_1.prototype.getAlerts = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, productMatch, thresholdDate, expiringSoonMatch, renewDueMatch, _a, expiringSoon, pendingApplications, rejectedProducts, renewalsDue, alerts;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            productMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            thresholdDate = new Date(now);
                            thresholdDate.setDate(thresholdDate.getDate() + 60);
                            expiringSoonMatch = __assign(__assign({}, productMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, validtillDate: {
                                    $exists: true,
                                    $ne: null,
                                    $gte: now,
                                    $lt: thresholdDate,
                                } });
                            renewDueMatch = __assign(__assign({}, productMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, $or: [
                                    {
                                        validtillDate: {
                                            $exists: true,
                                            $ne: null,
                                            $lt: thresholdDate,
                                        },
                                    },
                                    { urnStatus: { $gte: 12, $lte: 17 } },
                                ] });
                            return [4 /*yield*/, Promise.all([
                                    this.productModel.countDocuments(expiringSoonMatch).exec(),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, productMatch), { productStatus: { $in: [0, 1] } }))
                                        .exec(),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, productMatch), { productStatus: 3 }))
                                        .exec(),
                                    this.productModel
                                        .aggregate([
                                        { $match: renewDueMatch },
                                        { $group: { _id: '$urnNo' } },
                                        { $count: 'count' },
                                    ])
                                        .exec()
                                        .then(function (r) { var _a, _b; return (_b = (_a = r[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0; }),
                                ])];
                        case 1:
                            _a = _b.sent(), expiringSoon = _a[0], pendingApplications = _a[1], rejectedProducts = _a[2], renewalsDue = _a[3];
                            alerts = [];
                            if (expiringSoon > 0) {
                                alerts.push({
                                    key: 'certificationExpiringSoon',
                                    label: "".concat(expiringSoon, " certification").concat(expiringSoon === 1 ? '' : 's', " expiring soon"),
                                    count: expiringSoon,
                                    severity: 'warning',
                                });
                            }
                            if (pendingApplications > 0) {
                                alerts.push({
                                    key: 'newApplicationsPending',
                                    label: "".concat(pendingApplications, " new application").concat(pendingApplications === 1 ? '' : 's', " pending"),
                                    count: pendingApplications,
                                    severity: 'info',
                                });
                            }
                            if (rejectedProducts > 0) {
                                alerts.push({
                                    key: 'rejectedProducts',
                                    label: "".concat(rejectedProducts, " rejected product").concat(rejectedProducts === 1 ? '' : 's', " on record"),
                                    count: rejectedProducts,
                                    severity: 'danger',
                                });
                            }
                            if (renewalsDue > 0) {
                                alerts.push({
                                    key: 'renewalsDue',
                                    label: "".concat(renewalsDue, " renewal").concat(renewalsDue === 1 ? '' : 's', " due"),
                                    count: renewalsDue,
                                    severity: 'success',
                                });
                            }
                            return [2 /*return*/, alerts];
                    }
                });
            });
        };
        AdminDashboardWidgetsService_1.prototype.buildPaymentStatusItem = function (key, label, count, total) {
            var percent = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
            return { key: key, label: label, count: count, percent: percent };
        };
        AdminDashboardWidgetsService_1.prototype.buildPaymentVendorScope = function (filters) {
            var ids = (0, dashboard_metrics_filters_util_1.resolveManufacturerScopeIds)(filters);
            if (!ids)
                return {};
            return { vendorId: { $in: ids } };
        };
        AdminDashboardWidgetsService_1.prototype.loadManufacturerNameMap = function (vendorIds) {
            return __awaiter(this, void 0, void 0, function () {
                var ids, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ids = __spreadArray([], new Set(vendorIds
                                .map(function (id) { return id === null || id === void 0 ? void 0 : id.toString(); })
                                .filter(function (id) { return !!id && mongoose_1.Types.ObjectId.isValid(id); })), true).map(function (id) { return new mongoose_1.Types.ObjectId(id); });
                            if (!ids.length) {
                                return [2 /*return*/, new Map()];
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .find({ _id: { $in: ids } })
                                    .select('manufacturerName vendor_name')
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, new Map(rows.map(function (row) { return [
                                    String(row._id),
                                    {
                                        manufacturerName: row.manufacturerName,
                                        vendor_name: row.vendor_name,
                                    },
                                ]; }))];
                    }
                });
            });
        };
        AdminDashboardWidgetsService_1.prototype.formatPaymentType = function (value) {
            var key = String(value !== null && value !== void 0 ? value : '').trim().toLowerCase();
            if (key === 'certification')
                return 'Certification';
            if (key === 'renew' || key === 'renewal')
                return 'Renewal';
            if (key === 'registration')
                return 'Registration';
            return key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Payment';
        };
        AdminDashboardWidgetsService_1.prototype.formatPaymentMode = function (value) {
            var key = String(value !== null && value !== void 0 ? value : '').trim().toLowerCase();
            if (key === 'online')
                return 'UPI';
            if (key === 'cheque_or_dd')
                return 'Cheque';
            if (key === 'neft_or_rtgs')
                return 'Bank Transfer';
            return key || 'Other';
        };
        AdminDashboardWidgetsService_1.prototype.mapApplicationStatus = function (productStatus, validtillDate, now, thresholdDate) {
            if (productStatus === 3) {
                return { key: 'rejected', label: 'Rejected' };
            }
            if (productStatus === 2 && validtillDate) {
                var expiry = new Date(validtillDate);
                if (expiry >= now && expiry < thresholdDate) {
                    return { key: 'expiring_soon', label: 'Expiring Soon' };
                }
                if (expiry < now) {
                    return { key: 'expired', label: 'Expired' };
                }
                return { key: 'certified', label: 'Certified' };
            }
            if (productStatus === 2) {
                return { key: 'certified', label: 'Certified' };
            }
            if (productStatus === 1) {
                return { key: 'submitted', label: 'Submitted' };
            }
            return { key: 'pending', label: 'Pending' };
        };
        return AdminDashboardWidgetsService_1;
    }());
    __setFunctionName(_classThis, "AdminDashboardWidgetsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDashboardWidgetsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDashboardWidgetsService = _classThis;
}();
exports.AdminDashboardWidgetsService = AdminDashboardWidgetsService;
