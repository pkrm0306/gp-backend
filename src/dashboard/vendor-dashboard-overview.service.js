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
exports.VendorDashboardOverviewService = void 0;
var common_1 = require("@nestjs/common");
var product_status_constants_1 = require("../renew/constants/product-status.constants");
var vendor_dashboard_util_1 = require("./vendor-dashboard.util");
var VendorDashboardOverviewService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VendorDashboardOverviewService = _classThis = /** @class */ (function () {
        function VendorDashboardOverviewService_1(productModel, paymentDetailsModel, activityLogModel) {
            this.productModel = productModel;
            this.paymentDetailsModel = paymentDetailsModel;
            this.activityLogModel = activityLogModel;
        }
        VendorDashboardOverviewService_1.prototype.getOverview = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, year, baseMatch, _a, kpiCards, registrationCertificationTrend, productStatus, productsByCategory, recentEois, recentActivity, productOutcomesChart;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            year = now.getFullYear();
                            baseMatch = (0, vendor_dashboard_util_1.vendorActiveProductMatch)(vendorId);
                            return [4 /*yield*/, Promise.all([
                                    this.buildKpiCards(vendorId, baseMatch, now),
                                    this.buildRegistrationCertificationTrend(vendorId, baseMatch, year),
                                    this.buildProductStatusDistribution(vendorId, baseMatch, now),
                                    this.buildProductsByCategory(vendorId, baseMatch),
                                    this.buildRecentEois(vendorId, baseMatch),
                                    this.buildRecentActivity(vendorId, now, 7),
                                    this.getProductOutcomesChart(vendorId),
                                ])];
                        case 1:
                            _a = _b.sent(), kpiCards = _a[0], registrationCertificationTrend = _a[1], productStatus = _a[2], productsByCategory = _a[3], recentEois = _a[4], recentActivity = _a[5], productOutcomesChart = _a[6];
                            return [2 /*return*/, {
                                    kpiCards: kpiCards,
                                    registrationCertificationTrend: registrationCertificationTrend,
                                    productStatus: productStatus,
                                    productsByCategory: productsByCategory,
                                    recentEois: recentEois,
                                    recentActivity: recentActivity,
                                    productOutcomesChart: productOutcomesChart,
                                }];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.monthRange = function (year, month) {
            var from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
            var to = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
            return { from: from, to: to };
        };
        VendorDashboardOverviewService_1.prototype.buildKpiCards = function (vendorId, baseMatch, now) {
            return __awaiter(this, void 0, void 0, function () {
                var currentMonth, currentYear, previousMonth, previousYear, _a, totalProducts, pendingApprovals, eoisSubmitted, urnsGenerated, certifiedProducts, paymentsDue, totalCurrent, totalPrevious, pendingCurrent, pendingPrevious, eoiCurrent, eoiPrevious, urnCurrent, urnPrevious, certifiedCurrent, certifiedPrevious;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            currentMonth = now.getMonth() + 1;
                            currentYear = now.getFullYear();
                            previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
                            previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
                            return [4 /*yield*/, Promise.all([
                                    this.productModel.countDocuments(baseMatch).exec(),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, baseMatch), { productStatus: { $in: [product_status_constants_1.PRODUCT_STATUS_PENDING, product_status_constants_1.PRODUCT_STATUS_SUBMITTED] } }))
                                        .exec(),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, baseMatch), { productStatus: { $gte: product_status_constants_1.PRODUCT_STATUS_SUBMITTED } }))
                                        .exec(),
                                    this.productModel.distinct('urnNo', baseMatch).exec().then(function (r) { return r.length; }),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, $or: [
                                            { validtillDate: { $exists: false } },
                                            { validtillDate: null },
                                            { validtillDate: { $gte: now } },
                                        ] }))
                                        .exec(),
                                    this.aggregatePaymentsDue(vendorId),
                                    this.countProductsCreatedInMonth(baseMatch, currentYear, currentMonth),
                                    this.countProductsCreatedInMonth(baseMatch, previousYear, previousMonth),
                                    this.countPendingInMonth(baseMatch, currentYear, currentMonth),
                                    this.countPendingInMonth(baseMatch, previousYear, previousMonth),
                                    this.countEoiSubmittedInMonth(baseMatch, currentYear, currentMonth),
                                    this.countEoiSubmittedInMonth(baseMatch, previousYear, previousMonth),
                                    this.countUrnsInMonth(baseMatch, currentYear, currentMonth),
                                    this.countUrnsInMonth(baseMatch, previousYear, previousMonth),
                                    this.countCertifiedInMonth(baseMatch, currentYear, currentMonth, now),
                                    this.countCertifiedInMonth(baseMatch, previousYear, previousMonth, now),
                                ])];
                        case 1:
                            _a = _b.sent(), totalProducts = _a[0], pendingApprovals = _a[1], eoisSubmitted = _a[2], urnsGenerated = _a[3], certifiedProducts = _a[4], paymentsDue = _a[5], totalCurrent = _a[6], totalPrevious = _a[7], pendingCurrent = _a[8], pendingPrevious = _a[9], eoiCurrent = _a[10], eoiPrevious = _a[11], urnCurrent = _a[12], urnPrevious = _a[13], certifiedCurrent = _a[14], certifiedPrevious = _a[15];
                            return [2 /*return*/, [
                                    (0, vendor_dashboard_util_1.buildKpiCard)({
                                        key: 'totalProducts',
                                        label: 'Total Products',
                                        value: totalProducts,
                                        currentMonth: totalCurrent,
                                        previousMonth: totalPrevious,
                                    }),
                                    (0, vendor_dashboard_util_1.buildKpiCard)({
                                        key: 'pendingApprovals',
                                        label: 'Pending Approvals',
                                        value: pendingApprovals,
                                        currentMonth: pendingCurrent,
                                        previousMonth: pendingPrevious,
                                    }),
                                    (0, vendor_dashboard_util_1.buildKpiCard)({
                                        key: 'eoisSubmitted',
                                        label: 'EOIs Submitted',
                                        value: eoisSubmitted,
                                        currentMonth: eoiCurrent,
                                        previousMonth: eoiPrevious,
                                    }),
                                    (0, vendor_dashboard_util_1.buildKpiCard)({
                                        key: 'urnsGenerated',
                                        label: 'URNs Generated',
                                        value: urnsGenerated,
                                        currentMonth: urnCurrent,
                                        previousMonth: urnPrevious,
                                    }),
                                    (0, vendor_dashboard_util_1.buildKpiCard)({
                                        key: 'certifiedProducts',
                                        label: 'Certified Products',
                                        value: certifiedProducts,
                                        currentMonth: certifiedCurrent,
                                        previousMonth: certifiedPrevious,
                                    }),
                                    (0, vendor_dashboard_util_1.buildKpiCard)({
                                        key: 'paymentsDue',
                                        label: 'Payments Due',
                                        value: paymentsDue.amount,
                                        currentMonth: paymentsDue.currentMonthCount,
                                        previousMonth: paymentsDue.previousMonthCount,
                                        subLabel: paymentsDue.pendingInvoices > 0
                                            ? "".concat(paymentsDue.pendingInvoices, " pending invoice").concat(paymentsDue.pendingInvoices === 1 ? '' : 's')
                                            : undefined,
                                        format: 'currency',
                                    }),
                                ]];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.aggregatePaymentsDue = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, currentMonth, currentYear, previousMonth, previousYear, dueMatch, _a, totals, currentCount, previousCount;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            now = new Date();
                            currentMonth = now.getMonth() + 1;
                            currentYear = now.getFullYear();
                            previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
                            previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
                            dueMatch = {
                                vendorId: vendorId,
                                paymentStatus: { $in: [0, 1] },
                            };
                            return [4 /*yield*/, Promise.all([
                                    this.paymentDetailsModel
                                        .aggregate([
                                        { $match: dueMatch },
                                        {
                                            $group: {
                                                _id: null,
                                                amount: { $sum: '$quoteTotal' },
                                                count: { $sum: 1 },
                                            },
                                        },
                                    ])
                                        .exec(),
                                    this.countPaymentsCreatedInMonth(vendorId, currentYear, currentMonth),
                                    this.countPaymentsCreatedInMonth(vendorId, previousYear, previousMonth),
                                ])];
                        case 1:
                            _a = _f.sent(), totals = _a[0], currentCount = _a[1], previousCount = _a[2];
                            return [2 /*return*/, {
                                    amount: Math.round(Number((_c = (_b = totals[0]) === null || _b === void 0 ? void 0 : _b.amount) !== null && _c !== void 0 ? _c : 0)),
                                    pendingInvoices: (_e = (_d = totals[0]) === null || _d === void 0 ? void 0 : _d.count) !== null && _e !== void 0 ? _e : 0,
                                    currentMonthCount: currentCount,
                                    previousMonthCount: previousCount,
                                }];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.countPaymentsCreatedInMonth = function (vendorId, year, month) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, from, to;
                return __generator(this, function (_b) {
                    _a = this.monthRange(year, month), from = _a.from, to = _a.to;
                    return [2 /*return*/, this.paymentDetailsModel
                            .countDocuments({
                            vendorId: vendorId,
                            paymentStatus: { $in: [0, 1] },
                            createdDate: { $gte: from, $lte: to },
                        })
                            .exec()];
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.countProductsCreatedInMonth = function (baseMatch, year, month) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, from, to;
                return __generator(this, function (_b) {
                    _a = this.monthRange(year, month), from = _a.from, to = _a.to;
                    return [2 /*return*/, this.productModel
                            .countDocuments(__assign(__assign({}, baseMatch), { createdDate: { $gte: from, $lte: to } }))
                            .exec()];
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.countPendingInMonth = function (baseMatch, year, month) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, from, to;
                return __generator(this, function (_b) {
                    _a = this.monthRange(year, month), from = _a.from, to = _a.to;
                    return [2 /*return*/, this.productModel
                            .countDocuments(__assign(__assign({}, baseMatch), { productStatus: { $in: [product_status_constants_1.PRODUCT_STATUS_PENDING, product_status_constants_1.PRODUCT_STATUS_SUBMITTED] }, createdDate: { $gte: from, $lte: to } }))
                            .exec()];
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.countEoiSubmittedInMonth = function (baseMatch, year, month) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, from, to;
                return __generator(this, function (_b) {
                    _a = this.monthRange(year, month), from = _a.from, to = _a.to;
                    return [2 /*return*/, this.productModel
                            .countDocuments(__assign(__assign({}, baseMatch), { productStatus: { $gte: product_status_constants_1.PRODUCT_STATUS_SUBMITTED }, createdDate: { $gte: from, $lte: to } }))
                            .exec()];
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.countUrnsInMonth = function (baseMatch, year, month) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, from, to, urns;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.monthRange(year, month), from = _a.from, to = _a.to;
                            return [4 /*yield*/, this.productModel.distinct('urnNo', __assign(__assign({}, baseMatch), { createdDate: { $gte: from, $lte: to } }))];
                        case 1:
                            urns = _b.sent();
                            return [2 /*return*/, urns.filter(Boolean).length];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.countCertifiedInMonth = function (baseMatch, year, month, now) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, from, to;
                return __generator(this, function (_b) {
                    _a = this.monthRange(year, month), from = _a.from, to = _a.to;
                    return [2 /*return*/, this.productModel
                            .countDocuments(__assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, certifiedDate: { $gte: from, $lte: to }, $or: [
                                { validtillDate: { $exists: false } },
                                { validtillDate: null },
                                { validtillDate: { $gte: now } },
                            ] }))
                            .exec()];
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.getProductOutcomesChart = function (vendorId, requestedYears, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var baseMatch, scopedUrn, currentYear, availableYears, years;
                return __generator(this, function (_a) {
                    baseMatch = (0, vendor_dashboard_util_1.vendorActiveProductMatch)(vendorId);
                    scopedUrn = (urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim()) || null;
                    if (scopedUrn) {
                        baseMatch.urnNo = scopedUrn;
                    }
                    currentYear = new Date().getFullYear();
                    availableYears = this.listAvailableProductYears(currentYear);
                    years = this.resolveChartYears(requestedYears, availableYears, currentYear);
                    return [2 /*return*/, this.buildProductOutcomesChart(baseMatch, years, availableYears, scopedUrn)];
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.resolveChartYears = function (requestedYears, availableYears, currentYear) {
            var _a;
            var fallback = (_a = availableYears[0]) !== null && _a !== void 0 ? _a : currentYear;
            var source = (requestedYears === null || requestedYears === void 0 ? void 0 : requestedYears.length) && requestedYears.every(function (year) { return Number.isFinite(year); })
                ? requestedYears
                : [fallback];
            var valid = source.filter(function (year) { return availableYears.includes(year); });
            var resolved = valid.length > 0 ? valid : [fallback];
            return Array.from(new Set(resolved)).sort(function (a, b) { return a - b; });
        };
        VendorDashboardOverviewService_1.prototype.listAvailableProductYears = function (currentYear) {
            var years = [];
            for (var index = 0; index < VendorDashboardOverviewService.PRODUCT_OUTCOMES_YEAR_WINDOW; index += 1) {
                years.push(currentYear - index);
            }
            return years;
        };
        VendorDashboardOverviewService_1.prototype.buildProductOutcomesChart = function (baseMatch_1, years_1, availableYears_1) {
            return __awaiter(this, arguments, void 0, function (baseMatch, years, availableYears, urnNo) {
                var registered, certified, rejected, _i, years_2, year, yearMaps, month, currentYear, currentMonth, maxMonth, chart, totals, maxValue, yearLabel;
                var _a, _b, _c, _d, _e, _f;
                if (urnNo === void 0) { urnNo = null; }
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            registered = new Map();
                            certified = new Map();
                            rejected = new Map();
                            _i = 0, years_2 = years;
                            _g.label = 1;
                        case 1:
                            if (!(_i < years_2.length)) return [3 /*break*/, 4];
                            year = years_2[_i];
                            return [4 /*yield*/, this.aggregateYearOutcomeMaps(baseMatch, year)];
                        case 2:
                            yearMaps = _g.sent();
                            for (month = 1; month <= 12; month += 1) {
                                registered.set(month, ((_a = registered.get(month)) !== null && _a !== void 0 ? _a : 0) + ((_b = yearMaps.registered.get(month)) !== null && _b !== void 0 ? _b : 0));
                                certified.set(month, ((_c = certified.get(month)) !== null && _c !== void 0 ? _c : 0) + ((_d = yearMaps.certified.get(month)) !== null && _d !== void 0 ? _d : 0));
                                rejected.set(month, ((_e = rejected.get(month)) !== null && _e !== void 0 ? _e : 0) + ((_f = yearMaps.rejected.get(month)) !== null && _f !== void 0 ? _f : 0));
                            }
                            _g.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            currentYear = new Date().getFullYear();
                            currentMonth = new Date().getMonth() + 1;
                            maxMonth = years.length === 1 && years[0] === currentYear ? currentMonth : 12;
                            chart = Array.from({ length: maxMonth }, function (_, index) {
                                var _a, _b, _c;
                                var month = index + 1;
                                return {
                                    label: (0, vendor_dashboard_util_1.monthShortLabel)(month),
                                    month: month,
                                    year: years[0],
                                    registered: (_a = registered.get(month)) !== null && _a !== void 0 ? _a : 0,
                                    certified: (_b = certified.get(month)) !== null && _b !== void 0 ? _b : 0,
                                    rejected: (_c = rejected.get(month)) !== null && _c !== void 0 ? _c : 0,
                                };
                            });
                            totals = chart.reduce(function (acc, point) { return ({
                                registered: acc.registered + point.registered,
                                certified: acc.certified + point.certified,
                                rejected: acc.rejected + point.rejected,
                            }); }, { registered: 0, certified: 0, rejected: 0 });
                            maxValue = chart.reduce(function (max, point) {
                                return Math.max(max, point.registered + point.certified + point.rejected);
                            }, 0);
                            yearLabel = this.formatChartYearLabel(years);
                            return [2 /*return*/, {
                                    title: 'Product outcomes',
                                    subtitle: urnNo
                                        ? "Registered, certified, and rejected products for ".concat(urnNo, " in ").concat(yearLabel)
                                        : "Registered, certified, and rejected products across all URN batches in ".concat(yearLabel),
                                    year: years[years.length - 1],
                                    years: years,
                                    urnNo: urnNo,
                                    availableYears: availableYears,
                                    chart: chart,
                                    totals: totals,
                                    yAxis: {
                                        min: 0,
                                        suggestedMax: (0, vendor_dashboard_util_1.suggestAxisMax)(maxValue),
                                    },
                                }];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.formatChartYearLabel = function (years) {
            var _a;
            if (years.length <= 1) {
                return String((_a = years[0]) !== null && _a !== void 0 ? _a : new Date().getFullYear());
            }
            if (years.length === 2) {
                return "".concat(years[0], " and ").concat(years[1]);
            }
            return "".concat(years.slice(0, -1).join(', '), ", and ").concat(years[years.length - 1]);
        };
        VendorDashboardOverviewService_1.prototype.aggregateYearOutcomeMaps = function (baseMatch, year) {
            return __awaiter(this, void 0, void 0, function () {
                var start, end, _a, registrationRows, certificationRows, rejectionRows, registered, certified, rejected, _i, registrationRows_1, row, _b, certificationRows_1, row, _c, rejectionRows_1, row;
                var _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            start = new Date(Date.UTC(year, 0, 1));
                            end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign(__assign({}, baseMatch), { createdDate: { $gte: start, $lte: end } }),
                                        },
                                        { $group: { _id: { $month: '$createdDate' }, count: { $sum: 1 } } },
                                    ])
                                        .exec(),
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, certifiedDate: { $gte: start, $lte: end, $ne: null } }),
                                        },
                                        {
                                            $group: { _id: { $month: '$certifiedDate' }, count: { $sum: 1 } },
                                        },
                                    ])
                                        .exec(),
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED, $or: [
                                                    { rejectedAt: { $gte: start, $lte: end, $ne: null } },
                                                    {
                                                        $and: [
                                                            { $or: [{ rejectedAt: null }, { rejectedAt: { $exists: false } }] },
                                                            { createdDate: { $gte: start, $lte: end } },
                                                        ],
                                                    },
                                                ] }),
                                        },
                                        {
                                            $group: {
                                                _id: {
                                                    $month: { $ifNull: ['$rejectedAt', '$createdDate'] },
                                                },
                                                count: { $sum: 1 },
                                            },
                                        },
                                    ])
                                        .exec(),
                                ])];
                        case 1:
                            _a = _g.sent(), registrationRows = _a[0], certificationRows = _a[1], rejectionRows = _a[2];
                            registered = new Map();
                            certified = new Map();
                            rejected = new Map();
                            for (_i = 0, registrationRows_1 = registrationRows; _i < registrationRows_1.length; _i++) {
                                row = registrationRows_1[_i];
                                registered.set(Number(row._id), (_d = row.count) !== null && _d !== void 0 ? _d : 0);
                            }
                            for (_b = 0, certificationRows_1 = certificationRows; _b < certificationRows_1.length; _b++) {
                                row = certificationRows_1[_b];
                                certified.set(Number(row._id), (_e = row.count) !== null && _e !== void 0 ? _e : 0);
                            }
                            for (_c = 0, rejectionRows_1 = rejectionRows; _c < rejectionRows_1.length; _c++) {
                                row = rejectionRows_1[_c];
                                rejected.set(Number(row._id), (_f = row.count) !== null && _f !== void 0 ? _f : 0);
                            }
                            return [2 /*return*/, { registered: registered, certified: certified, rejected: rejected }];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.buildRegistrationCertificationTrend = function (vendorId, baseMatch, year) {
            return __awaiter(this, void 0, void 0, function () {
                var start, end, _a, registrationRows, certificationRows, registrations, certifications, _i, registrationRows_2, row, _b, certificationRows_2, row, chart, maxValue;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            start = new Date(Date.UTC(year, 0, 1));
                            end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign(__assign({}, baseMatch), { createdDate: { $gte: start, $lte: end } }),
                                        },
                                        { $group: { _id: { $month: '$createdDate' }, count: { $sum: 1 } } },
                                    ])
                                        .exec(),
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, certifiedDate: { $gte: start, $lte: end, $ne: null } }),
                                        },
                                        {
                                            $group: { _id: { $month: '$certifiedDate' }, count: { $sum: 1 } },
                                        },
                                    ])
                                        .exec(),
                                ])];
                        case 1:
                            _a = _e.sent(), registrationRows = _a[0], certificationRows = _a[1];
                            registrations = new Map();
                            certifications = new Map();
                            for (_i = 0, registrationRows_2 = registrationRows; _i < registrationRows_2.length; _i++) {
                                row = registrationRows_2[_i];
                                registrations.set(Number(row._id), (_c = row.count) !== null && _c !== void 0 ? _c : 0);
                            }
                            for (_b = 0, certificationRows_2 = certificationRows; _b < certificationRows_2.length; _b++) {
                                row = certificationRows_2[_b];
                                certifications.set(Number(row._id), (_d = row.count) !== null && _d !== void 0 ? _d : 0);
                            }
                            chart = Array.from({ length: 12 }, function (_, index) {
                                var _a, _b;
                                var month = index + 1;
                                return {
                                    label: (0, vendor_dashboard_util_1.monthShortLabel)(month),
                                    month: month,
                                    year: year,
                                    registrations: (_a = registrations.get(month)) !== null && _a !== void 0 ? _a : 0,
                                    certifications: (_b = certifications.get(month)) !== null && _b !== void 0 ? _b : 0,
                                };
                            });
                            maxValue = chart.reduce(function (max, point) {
                                return Math.max(max, point.registrations, point.certifications);
                            }, 0);
                            return [2 /*return*/, {
                                    title: 'Registration & Certification Trend',
                                    subtitle: 'Monthly overview for current year',
                                    year: year,
                                    chart: chart,
                                    yAxis: {
                                        min: 0,
                                        suggestedMax: (0, vendor_dashboard_util_1.suggestAxisMax)(maxValue),
                                    },
                                }];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.buildProductStatusDistribution = function (vendorId, baseMatch, now) {
            return __awaiter(this, void 0, void 0, function () {
                var renewalHorizon, _a, pending, underReview, certified, rejected, pendingRenewal, chart;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            renewalHorizon = new Date(now);
                            renewalHorizon.setMonth(renewalHorizon.getMonth() + 2);
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_PENDING }))
                                        .exec(),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_SUBMITTED }))
                                        .exec(),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, $or: [
                                            { validtillDate: { $exists: false } },
                                            { validtillDate: null },
                                            { validtillDate: { $gte: now } },
                                        ] }))
                                        .exec(),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED }))
                                        .exec(),
                                    this.productModel
                                        .countDocuments(__assign(__assign({}, baseMatch), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, validtillDate: { $gt: now, $lte: renewalHorizon } }))
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), pending = _a[0], underReview = _a[1], certified = _a[2], rejected = _a[3], pendingRenewal = _a[4];
                            chart = [
                                {
                                    key: 'certified',
                                    label: 'Certified',
                                    count: certified,
                                    color: '#22C55E',
                                },
                                {
                                    key: 'pending',
                                    label: 'Pending',
                                    count: pending,
                                    color: '#3B82F6',
                                },
                                {
                                    key: 'underReview',
                                    label: 'Under Review',
                                    count: underReview,
                                    color: '#F59E0B',
                                },
                                {
                                    key: 'rejected',
                                    label: 'Rejected',
                                    count: rejected,
                                    color: '#EF4444',
                                },
                                {
                                    key: 'pendingRenewal',
                                    label: 'Pending Renewal',
                                    count: pendingRenewal,
                                    color: '#8B5CF6',
                                },
                            ];
                            return [2 /*return*/, {
                                    title: 'Product Status',
                                    subtitle: 'Distribution overview',
                                    total: pending + underReview + certified + rejected,
                                    chart: chart,
                                }];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.buildProductsByCategory = function (vendorId, baseMatch) {
            return __awaiter(this, void 0, void 0, function () {
                var rows, maxCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .aggregate([
                                { $match: baseMatch },
                                { $group: { _id: '$categoryId', count: { $sum: 1 } } },
                                {
                                    $lookup: {
                                        from: 'categories',
                                        localField: '_id',
                                        foreignField: '_id',
                                        as: 'category',
                                    },
                                },
                                {
                                    $project: {
                                        name: {
                                            $ifNull: [
                                                { $arrayElemAt: ['$category.category_name', 0] },
                                                'Unknown',
                                            ],
                                        },
                                        count: 1,
                                    },
                                },
                                { $sort: { count: -1 } },
                                { $limit: 6 },
                            ])
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            maxCount = rows.reduce(function (max, row) { var _a; return Math.max(max, (_a = row.count) !== null && _a !== void 0 ? _a : 0); }, 0);
                            return [2 /*return*/, {
                                    title: 'Products by Category',
                                    subtitle: 'Top product categories',
                                    chart: rows.map(function (row) {
                                        var _a;
                                        return ({
                                            name: row.name,
                                            count: (_a = row.count) !== null && _a !== void 0 ? _a : 0,
                                        });
                                    }),
                                    xAxis: {
                                        min: 0,
                                        suggestedMax: (0, vendor_dashboard_util_1.suggestAxisMax)(maxCount),
                                    },
                                }];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.buildRecentEois = function (vendorId, baseMatch) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .aggregate([
                                { $match: baseMatch },
                                {
                                    $lookup: {
                                        from: 'categories',
                                        localField: 'categoryId',
                                        foreignField: '_id',
                                        as: 'category',
                                    },
                                },
                                { $sort: { createdDate: -1, productId: -1 } },
                                { $limit: 5 },
                                {
                                    $project: {
                                        productId: 1,
                                        eoiNo: 1,
                                        productName: 1,
                                        urnNo: 1,
                                        productStatus: 1,
                                        urnStatus: 1,
                                        createdDate: 1,
                                        categoryName: {
                                            $ifNull: [
                                                { $arrayElemAt: ['$category.category_name', 0] },
                                                'Unknown',
                                            ],
                                        },
                                    },
                                },
                            ])
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, {
                                    title: 'Recent EOIs',
                                    subtitle: 'Latest expression of interest submissions',
                                    viewAllPath: '/vendor/products',
                                    items: rows.map(function (row) {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        var status = (0, vendor_dashboard_util_1.mapRecentEoiStatus)(Number((_a = row.productStatus) !== null && _a !== void 0 ? _a : 0), Number((_b = row.urnStatus) !== null && _b !== void 0 ? _b : 0));
                                        return {
                                            productId: Number((_c = row.productId) !== null && _c !== void 0 ? _c : 0),
                                            eoiNo: String((_d = row.eoiNo) !== null && _d !== void 0 ? _d : ''),
                                            productName: String((_e = row.productName) !== null && _e !== void 0 ? _e : ''),
                                            categoryName: String((_f = row.categoryName) !== null && _f !== void 0 ? _f : 'Unknown'),
                                            date: row.createdDate
                                                ? new Date(row.createdDate).toISOString().slice(0, 10)
                                                : '',
                                            status: status.status,
                                            statusKey: status.statusKey,
                                            statusVariant: status.statusVariant,
                                            urnNo: String((_g = row.urnNo) !== null && _g !== void 0 ? _g : ''),
                                        };
                                    }),
                                }];
                    }
                });
            });
        };
        VendorDashboardOverviewService_1.prototype.buildRecentActivity = function (vendorId, now, days) {
            return __awaiter(this, void 0, void 0, function () {
                var from, logs, urnNos, products, _a, productByUrn, _i, products_1, product, urn, items;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            from = new Date(now);
                            from.setDate(from.getDate() - days);
                            return [4 /*yield*/, this.activityLogModel
                                    .find({
                                    vendor_id: vendorId,
                                    created_at: { $gte: from, $lte: now },
                                })
                                    .sort({ created_at: -1 })
                                    .limit(10)
                                    .lean()
                                    .exec()];
                        case 1:
                            logs = _d.sent();
                            urnNos = __spreadArray([], new Set(logs.map(function (log) { var _a; return String((_a = log.urn_no) !== null && _a !== void 0 ? _a : '').trim(); }).filter(Boolean)), true);
                            if (!urnNos.length) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.productModel
                                    .find({ vendorId: vendorId, urnNo: { $in: urnNos }, productType: 0 })
                                    .select('urnNo productName productId')
                                    .lean()
                                    .exec()];
                        case 2:
                            _a = _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = [];
                            _d.label = 4;
                        case 4:
                            products = _a;
                            productByUrn = new Map();
                            for (_i = 0, products_1 = products; _i < products_1.length; _i++) {
                                product = products_1[_i];
                                urn = String((_b = product.urnNo) !== null && _b !== void 0 ? _b : '').trim();
                                if (!urn || productByUrn.has(urn))
                                    continue;
                                productByUrn.set(urn, String((_c = product.productName) !== null && _c !== void 0 ? _c : '').trim());
                            }
                            items = logs.map(function (log) {
                                var _a, _b, _c, _d, _e;
                                return (0, vendor_dashboard_util_1.mapActivityLogToRecentItem)({
                                    id: String(log._id),
                                    activity: String((_a = log.activity) !== null && _a !== void 0 ? _a : ''),
                                    activitiesId: Number((_b = log.activities_id) !== null && _b !== void 0 ? _b : 0),
                                    urnNo: String((_c = log.urn_no) !== null && _c !== void 0 ? _c : ''),
                                    productName: (_e = productByUrn.get(String((_d = log.urn_no) !== null && _d !== void 0 ? _d : '').trim())) !== null && _e !== void 0 ? _e : null,
                                    createdAt: log.created_at ? new Date(log.created_at) : now,
                                    now: now,
                                });
                            });
                            return [2 /*return*/, {
                                    title: 'Recent Activity',
                                    subtitle: "Last ".concat(days, " days"),
                                    days: days,
                                    items: items,
                                }];
                    }
                });
            });
        };
        return VendorDashboardOverviewService_1;
    }());
    __setFunctionName(_classThis, "VendorDashboardOverviewService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorDashboardOverviewService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.PRODUCT_OUTCOMES_YEAR_WINDOW = 5;
    (function () {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorDashboardOverviewService = _classThis;
}();
exports.VendorDashboardOverviewService = VendorDashboardOverviewService;
