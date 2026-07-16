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
exports.AdminDashboardCertificationTimingService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
var admin_dashboard_certification_timing_util_1 = require("../utils/admin-dashboard-certification-timing.util");
var AdminDashboardCertificationTimingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminDashboardCertificationTimingService = _classThis = /** @class */ (function () {
        function AdminDashboardCertificationTimingService_1(productModel, activityLogModel, manufacturerModel) {
            this.productModel = productModel;
            this.activityLogModel = activityLogModel;
            this.manufacturerModel = manufacturerModel;
        }
        AdminDashboardCertificationTimingService_1.prototype.getCertificationTiming = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, productMatch, certifiedProducts, urnMap, _i, certifiedProducts_1, product, urnNo, certifiedDate, existing, urnNos, activityLogs, logsByUrn, _a, activityLogs_1, log, urn, bucket, manufacturerIds, manufacturers, _b, manufacturerCreatedAt, _c, manufacturers_1, manufacturer, created, stageTotals, breakdownTotals, profileTotals, profileManufacturers, endToEndTotals, _d, _e, _f, urnNo, urnMeta, logs, milestones, stageDurations, _g, _h, _j, stage, days, acc, breakdownDurations, _k, _l, _m, bucket, days, acc, endToEnd, manufacturerId, manufacturerStart, firstRegistration, profileDays;
                var _o, _p, _q, _r, _s, _t, _u, _v, _w;
                return __generator(this, function (_x) {
                    switch (_x.label) {
                        case 0:
                            now = new Date();
                            productMatch = __assign(__assign({}, (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now)), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, certifiedDate: { $exists: true, $ne: null }, $or: [
                                    { validtillDate: { $exists: false } },
                                    { validtillDate: null },
                                    { validtillDate: { $gte: now } },
                                ] });
                            return [4 /*yield*/, this.productModel
                                    .find(productMatch)
                                    .select('urnNo manufacturerId certifiedDate createdDate')
                                    .lean()
                                    .exec()];
                        case 1:
                            certifiedProducts = _x.sent();
                            if (!certifiedProducts.length) {
                                return [2 /*return*/, this.emptyTiming()];
                            }
                            urnMap = new Map();
                            for (_i = 0, certifiedProducts_1 = certifiedProducts; _i < certifiedProducts_1.length; _i++) {
                                product = certifiedProducts_1[_i];
                                urnNo = String((_o = product.urnNo) !== null && _o !== void 0 ? _o : '').trim();
                                if (!urnNo)
                                    continue;
                                certifiedDate = product.certifiedDate
                                    ? new Date(product.certifiedDate)
                                    : null;
                                if (!certifiedDate || Number.isNaN(certifiedDate.getTime()))
                                    continue;
                                existing = urnMap.get(urnNo);
                                if (!existing || certifiedDate.getTime() < existing.certifiedDate.getTime()) {
                                    urnMap.set(urnNo, {
                                        manufacturerId: String(product.manufacturerId),
                                        certifiedDate: certifiedDate,
                                        createdDate: product.createdDate
                                            ? new Date(product.createdDate)
                                            : certifiedDate,
                                    });
                                }
                            }
                            urnNos = __spreadArray([], urnMap.keys(), true);
                            if (!urnNos.length) {
                                return [2 /*return*/, this.emptyTiming()];
                            }
                            return [4 /*yield*/, this.activityLogModel
                                    .find({ urn_no: { $in: urnNos } })
                                    .select('urn_no activities_id created_at manufacturer_id')
                                    .sort({ created_at: 1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            activityLogs = _x.sent();
                            logsByUrn = new Map();
                            for (_a = 0, activityLogs_1 = activityLogs; _a < activityLogs_1.length; _a++) {
                                log = activityLogs_1[_a];
                                urn = String((_p = log.urn_no) !== null && _p !== void 0 ? _p : '').trim();
                                if (!urn)
                                    continue;
                                bucket = (_q = logsByUrn.get(urn)) !== null && _q !== void 0 ? _q : [];
                                bucket.push(log);
                                logsByUrn.set(urn, bucket);
                            }
                            manufacturerIds = __spreadArray([], new Set(__spreadArray([], urnMap.values(), true).map(function (v) { return v.manufacturerId; })), true).filter(function (id) { return mongoose_1.Types.ObjectId.isValid(id); })
                                .map(function (id) { return new mongoose_1.Types.ObjectId(id); });
                            if (!manufacturerIds.length) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.manufacturerModel
                                    .find({ _id: { $in: manufacturerIds } })
                                    .select('createdAt updatedAt')
                                    .lean()
                                    .exec()];
                        case 3:
                            _b = _x.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _b = [];
                            _x.label = 5;
                        case 5:
                            manufacturers = _b;
                            manufacturerCreatedAt = new Map();
                            for (_c = 0, manufacturers_1 = manufacturers; _c < manufacturers_1.length; _c++) {
                                manufacturer = manufacturers_1[_c];
                                created = (_r = manufacturer.createdAt) !== null && _r !== void 0 ? _r : manufacturer.updatedAt;
                                if (created) {
                                    manufacturerCreatedAt.set(String(manufacturer._id), new Date(created));
                                }
                            }
                            stageTotals = this.initStageAccumulators();
                            breakdownTotals = this.initBreakdownAccumulators();
                            profileTotals = { totalDays: 0, sampleCount: 0 };
                            profileManufacturers = new Set();
                            endToEndTotals = { totalDays: 0, sampleCount: 0 };
                            for (_d = 0, _e = urnMap.entries(); _d < _e.length; _d++) {
                                _f = _e[_d], urnNo = _f[0], urnMeta = _f[1];
                                logs = (_s = logsByUrn.get(urnNo)) !== null && _s !== void 0 ? _s : [];
                                milestones = (0, admin_dashboard_certification_timing_util_1.buildUrnMilestones)(logs, urnMeta.certifiedDate);
                                stageDurations = (0, admin_dashboard_certification_timing_util_1.computeStageDurationsFromMilestones)(milestones);
                                for (_g = 0, _h = stageDurations.entries(); _g < _h.length; _g++) {
                                    _j = _h[_g], stage = _j[0], days = _j[1];
                                    acc = stageTotals.get(stage);
                                    if (!acc)
                                        continue;
                                    acc.totalDays += days;
                                    acc.sampleCount += 1;
                                }
                                breakdownDurations = (0, admin_dashboard_certification_timing_util_1.computeBreakdownDurationsFromMilestones)(milestones);
                                for (_k = 0, _l = breakdownDurations.entries(); _k < _l.length; _k++) {
                                    _m = _l[_k], bucket = _m[0], days = _m[1];
                                    acc = breakdownTotals.get(bucket);
                                    if (!acc)
                                        continue;
                                    acc.totalDays += days;
                                    acc.sampleCount += 1;
                                }
                                endToEnd = (0, admin_dashboard_certification_timing_util_1.computeEndToEndDays)(milestones, urnMeta.certifiedDate);
                                if (endToEnd !== null && endToEnd > 0) {
                                    endToEndTotals.totalDays += endToEnd;
                                    endToEndTotals.sampleCount += 1;
                                }
                                manufacturerId = urnMeta.manufacturerId;
                                if (!profileManufacturers.has(manufacturerId)) {
                                    manufacturerStart = manufacturerCreatedAt.get(manufacturerId);
                                    firstRegistration = (_w = (_u = (_t = milestones.find(function (m) { return m.activityId === 0; })) === null || _t === void 0 ? void 0 : _t.at) !== null && _u !== void 0 ? _u : (_v = logs.find(function (l) { return Number(l.activities_id) === 0; })) === null || _v === void 0 ? void 0 : _v.created_at) !== null && _w !== void 0 ? _w : urnMeta.createdDate;
                                    if (manufacturerStart && firstRegistration) {
                                        profileDays = (0, admin_dashboard_certification_timing_util_1.daysBetween)(manufacturerStart, new Date(firstRegistration));
                                        if (profileDays > 0) {
                                            profileTotals.totalDays += profileDays;
                                            profileTotals.sampleCount += 1;
                                        }
                                    }
                                    profileManufacturers.add(manufacturerId);
                                }
                            }
                            if (profileTotals.sampleCount > 0) {
                                stageTotals.set('profile', profileTotals);
                            }
                            return [2 /*return*/, {
                                    timeAtStage: {
                                        title: 'Time at Stage',
                                        subtitle: 'Average days spent at each stage',
                                        unit: 'days',
                                        stages: admin_dashboard_certification_timing_util_1.CERTIFICATION_TIMING_STAGE_DEFS.map(function (stage) {
                                            var _a;
                                            var acc = (_a = stageTotals.get(stage.key)) !== null && _a !== void 0 ? _a : {
                                                totalDays: 0,
                                                sampleCount: 0,
                                            };
                                            return {
                                                key: stage.key,
                                                label: stage.label,
                                                order: stage.order,
                                                avgDays: (0, admin_dashboard_certification_timing_util_1.averageDays)(acc.totalDays, acc.sampleCount),
                                                sampleCount: acc.sampleCount,
                                            };
                                        }),
                                    },
                                    avgTimeToCertification: {
                                        title: 'Avg. Time to Certification',
                                        subtitle: 'End-to-end processing duration',
                                        unit: 'days',
                                        avgDays: (0, admin_dashboard_certification_timing_util_1.averageDays)(endToEndTotals.totalDays, endToEndTotals.sampleCount),
                                        sampleCount: endToEndTotals.sampleCount,
                                        breakdown: admin_dashboard_certification_timing_util_1.CERTIFICATION_TIMING_BREAKDOWN_DEFS.map(function (item) {
                                            var _a;
                                            var acc = (_a = breakdownTotals.get(item.key)) !== null && _a !== void 0 ? _a : {
                                                totalDays: 0,
                                                sampleCount: 0,
                                            };
                                            return {
                                                key: item.key,
                                                label: item.label,
                                                order: item.order,
                                                avgDays: (0, admin_dashboard_certification_timing_util_1.averageDays)(acc.totalDays, acc.sampleCount),
                                                sampleCount: acc.sampleCount,
                                            };
                                        }),
                                    },
                                }];
                    }
                });
            });
        };
        AdminDashboardCertificationTimingService_1.prototype.initStageAccumulators = function () {
            var map = new Map();
            for (var _i = 0, CERTIFICATION_TIMING_STAGE_DEFS_1 = admin_dashboard_certification_timing_util_1.CERTIFICATION_TIMING_STAGE_DEFS; _i < CERTIFICATION_TIMING_STAGE_DEFS_1.length; _i++) {
                var stage = CERTIFICATION_TIMING_STAGE_DEFS_1[_i];
                map.set(stage.key, { totalDays: 0, sampleCount: 0 });
            }
            return map;
        };
        AdminDashboardCertificationTimingService_1.prototype.initBreakdownAccumulators = function () {
            var map = new Map();
            for (var _i = 0, CERTIFICATION_TIMING_BREAKDOWN_DEFS_1 = admin_dashboard_certification_timing_util_1.CERTIFICATION_TIMING_BREAKDOWN_DEFS; _i < CERTIFICATION_TIMING_BREAKDOWN_DEFS_1.length; _i++) {
                var item = CERTIFICATION_TIMING_BREAKDOWN_DEFS_1[_i];
                map.set(item.key, { totalDays: 0, sampleCount: 0 });
            }
            return map;
        };
        AdminDashboardCertificationTimingService_1.prototype.emptyTiming = function () {
            return {
                timeAtStage: {
                    title: 'Time at Stage',
                    subtitle: 'Average days spent at each stage',
                    unit: 'days',
                    stages: admin_dashboard_certification_timing_util_1.CERTIFICATION_TIMING_STAGE_DEFS.map(function (stage) { return ({
                        key: stage.key,
                        label: stage.label,
                        order: stage.order,
                        avgDays: 0,
                        sampleCount: 0,
                    }); }),
                },
                avgTimeToCertification: {
                    title: 'Avg. Time to Certification',
                    subtitle: 'End-to-end processing duration',
                    unit: 'days',
                    avgDays: 0,
                    sampleCount: 0,
                    breakdown: admin_dashboard_certification_timing_util_1.CERTIFICATION_TIMING_BREAKDOWN_DEFS.map(function (item) { return ({
                        key: item.key,
                        label: item.label,
                        order: item.order,
                        avgDays: 0,
                        sampleCount: 0,
                    }); }),
                },
            };
        };
        return AdminDashboardCertificationTimingService_1;
    }());
    __setFunctionName(_classThis, "AdminDashboardCertificationTimingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDashboardCertificationTimingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDashboardCertificationTimingService = _classThis;
}();
exports.AdminDashboardCertificationTimingService = AdminDashboardCertificationTimingService;
