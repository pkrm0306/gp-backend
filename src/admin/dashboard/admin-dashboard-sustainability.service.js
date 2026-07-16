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
exports.AdminDashboardSustainabilityService = void 0;
var common_1 = require("@nestjs/common");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
var admin_dashboard_sustainability_util_1 = require("../utils/admin-dashboard-sustainability.util");
var AdminDashboardSustainabilityService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminDashboardSustainabilityService = _classThis = /** @class */ (function () {
        function AdminDashboardSustainabilityService_1(productModel, mpManufacturingUnitModel, recycledContentModel, recoveryModel, rapidlyRenewableModel, utilizationRmcModel) {
            this.productModel = productModel;
            this.mpManufacturingUnitModel = mpManufacturingUnitModel;
            this.recycledContentModel = recycledContentModel;
            this.recoveryModel = recoveryModel;
            this.rapidlyRenewableModel = rapidlyRenewableModel;
            this.utilizationRmcModel = utilizationRmcModel;
        }
        AdminDashboardSustainabilityService_1.prototype.getSustainabilityContributions = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, certifiedMatch, certifiedProducts, urnNos, urnFilter, _a, mpUnits, recycledRows, recoveryRows, rapidlyRenewableRows, utilizationRmcRows, energySamples, waterSamples, recyclabilitySamples, carbonSamples, _i, mpUnits_1, unit, sec, stec, swc, carbonScore, _b, recycledRows_1, row, value, _c, recoveryRows_1, row, value, _d, utilizationRmcRows_1, row, value, _e, rapidlyRenewableRows_1, row, value, metrics;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            now = new Date();
                            certifiedMatch = __assign(__assign({}, (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now)), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, $or: [
                                    { validtillDate: { $exists: false } },
                                    { validtillDate: null },
                                    { validtillDate: { $gte: now } },
                                ] });
                            return [4 /*yield*/, this.productModel
                                    .find(certifiedMatch)
                                    .select('urnNo')
                                    .lean()
                                    .exec()];
                        case 1:
                            certifiedProducts = _f.sent();
                            urnNos = __spreadArray([], new Set(certifiedProducts
                                .map(function (p) { var _a; return String((_a = p.urnNo) !== null && _a !== void 0 ? _a : '').trim(); })
                                .filter(Boolean)), true);
                            if (!urnNos.length) {
                                return [2 /*return*/, this.emptyContributions(0, 0)];
                            }
                            urnFilter = { urnNo: { $in: urnNos } };
                            return [4 /*yield*/, Promise.all([
                                    this.mpManufacturingUnitModel.find(urnFilter).lean().exec(),
                                    this.recycledContentModel.find(urnFilter).lean().exec(),
                                    this.recoveryModel.find(urnFilter).lean().exec(),
                                    this.rapidlyRenewableModel.find(urnFilter).lean().exec(),
                                    this.utilizationRmcModel.find(urnFilter).lean().exec(),
                                ])];
                        case 2:
                            _a = _f.sent(), mpUnits = _a[0], recycledRows = _a[1], recoveryRows = _a[2], rapidlyRenewableRows = _a[3], utilizationRmcRows = _a[4];
                            energySamples = [];
                            waterSamples = [];
                            recyclabilitySamples = [];
                            carbonSamples = [];
                            for (_i = 0, mpUnits_1 = mpUnits; _i < mpUnits_1.length; _i++) {
                                unit = mpUnits_1[_i];
                                sec = Number(unit.calculateBulkSec);
                                stec = Number(unit.calculateBulkStec);
                                if (Number.isFinite(sec) && sec > 0)
                                    energySamples.push(sec);
                                if (Number.isFinite(stec) && stec > 0)
                                    energySamples.push(stec);
                                swc = Number(unit.calculateBulkSwc);
                                if (Number.isFinite(swc) && swc > 0)
                                    waterSamples.push(swc);
                                carbonScore = (0, admin_dashboard_sustainability_util_1.renewableCarbonScore)(unit);
                                if (carbonScore !== null)
                                    carbonSamples.push(carbonScore);
                            }
                            for (_b = 0, recycledRows_1 = recycledRows; _b < recycledRows_1.length; _b++) {
                                row = recycledRows_1[_b];
                                value = Number(row.yeardata3);
                                if (Number.isFinite(value) && value > 0)
                                    recyclabilitySamples.push(value);
                            }
                            for (_c = 0, recoveryRows_1 = recoveryRows; _c < recoveryRows_1.length; _c++) {
                                row = recoveryRows_1[_c];
                                value = Number(row.yeardata3);
                                if (Number.isFinite(value) && value > 0)
                                    recyclabilitySamples.push(value);
                            }
                            for (_d = 0, utilizationRmcRows_1 = utilizationRmcRows; _d < utilizationRmcRows_1.length; _d++) {
                                row = utilizationRmcRows_1[_d];
                                value = (0, admin_dashboard_sustainability_util_1.maxRecycledPercentFromRmcRow)(row);
                                if (value !== null)
                                    recyclabilitySamples.push(value);
                            }
                            for (_e = 0, rapidlyRenewableRows_1 = rapidlyRenewableRows; _e < rapidlyRenewableRows_1.length; _e++) {
                                row = rapidlyRenewableRows_1[_e];
                                value = Number(row.yeardata3);
                                if (Number.isFinite(value) && value > 0)
                                    carbonSamples.push(value);
                            }
                            metrics = {
                                energySaved: {
                                    percent: (0, admin_dashboard_sustainability_util_1.averagePositivePercent)(energySamples),
                                    sampleCount: energySamples.length,
                                },
                                waterSaved: {
                                    percent: (0, admin_dashboard_sustainability_util_1.averagePositivePercent)(waterSamples),
                                    sampleCount: waterSamples.length,
                                },
                                recyclability: {
                                    percent: (0, admin_dashboard_sustainability_util_1.averagePositivePercent)(recyclabilitySamples),
                                    sampleCount: recyclabilitySamples.length,
                                },
                                carbonOffset: {
                                    percent: (0, admin_dashboard_sustainability_util_1.averagePositivePercent)(carbonSamples),
                                    sampleCount: carbonSamples.length,
                                },
                            };
                            return [2 /*return*/, {
                                    title: 'Sustainability Contributions',
                                    subtitle: 'Environmental impact from certified products',
                                    unit: 'percent',
                                    totals: {
                                        certifiedUrns: urnNos.length,
                                        certifiedProducts: certifiedProducts.length,
                                    },
                                    items: admin_dashboard_sustainability_util_1.SUSTAINABILITY_CONTRIBUTION_DEFS.map(function (def) { return ({
                                        key: def.key,
                                        label: def.label,
                                        order: def.order,
                                        color: def.color,
                                        percent: (0, admin_dashboard_sustainability_util_1.roundContributionPercent)(metrics[def.key].percent),
                                        sampleCount: metrics[def.key].sampleCount,
                                    }); }),
                                }];
                    }
                });
            });
        };
        AdminDashboardSustainabilityService_1.prototype.emptyContributions = function (certifiedUrns, certifiedProducts) {
            return {
                title: 'Sustainability Contributions',
                subtitle: 'Environmental impact from certified products',
                unit: 'percent',
                totals: { certifiedUrns: certifiedUrns, certifiedProducts: certifiedProducts },
                items: admin_dashboard_sustainability_util_1.SUSTAINABILITY_CONTRIBUTION_DEFS.map(function (def) { return ({
                    key: def.key,
                    label: def.label,
                    order: def.order,
                    color: def.color,
                    percent: 0,
                    sampleCount: 0,
                }); }),
            };
        };
        return AdminDashboardSustainabilityService_1;
    }());
    __setFunctionName(_classThis, "AdminDashboardSustainabilityService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDashboardSustainabilityService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDashboardSustainabilityService = _classThis;
}();
exports.AdminDashboardSustainabilityService = AdminDashboardSustainabilityService;
