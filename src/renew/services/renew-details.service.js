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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewDetailsService = void 0;
var common_1 = require("@nestjs/common");
var mp_manufacturing_weighted_totals_util_1 = require("../../process-mp-manufacturing-units/utils/mp-manufacturing-weighted-totals.util");
var consolidate_urn_detail_items_util_1 = require("../../product-registration/utils/consolidate-urn-detail-items.util");
var renew_plant_state_util_1 = require("../utils/renew-plant-state.util");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renew_details_format_util_1 = require("../utils/renew-details-format.util");
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
var renew_cycle_scope_util_1 = require("../helpers/renew-cycle-scope.util");
var renew_wm_units_read_util_1 = require("../helpers/renew-wm-units-read.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
function dedupePlantsById(rows) {
    var _a, _b, _c;
    var seen = new Set();
    var out = [];
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        for (var _d = 0, _e = (_a = row.plants) !== null && _a !== void 0 ? _a : []; _d < _e.length; _d++) {
            var plant = _e[_d];
            var key = String((_c = (_b = plant._id) !== null && _b !== void 0 ? _b : plant.productPlantId) !== null && _c !== void 0 ? _c : "".concat(plant.eoiNo, "|").concat(plant.plantName));
            if (!key || seen.has(key))
                continue;
            seen.add(key);
            out.push(plant);
        }
    }
    return out;
}
function buildRenewProductsSummary(rows) {
    return rows.map(function (row) {
        var _a, _b, _c, _d, _e;
        return ({
            product_details: (_a = row.product_details) !== null && _a !== void 0 ? _a : null,
            category: (_b = row.category) !== null && _b !== void 0 ? _b : null,
            plants: (_c = row.plants) !== null && _c !== void 0 ? _c : [],
            manufacturer: (_d = row.manufacturer) !== null && _d !== void 0 ? _d : null,
            vendor: (_e = row.vendor) !== null && _e !== void 0 ? _e : null,
        });
    });
}
var RenewDetailsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewDetailsService = _classThis = /** @class */ (function () {
        function RenewDetailsService_1(productRegistrationService, processRenewProductPerformanceService, renewManufacturingModel, renewInnovationModel, renewWasteModel, renewStewardshipModel, renewStakeholderModel, renewCommentsModel, renewMpUnitModel, renewWmUnitModel, certWmUnitModel, renewDocumentModel, renewalCycleModel, productModel, paymentModel, renewUrnTabReviewService, processRenewCommentsService) {
            this.productRegistrationService = productRegistrationService;
            this.processRenewProductPerformanceService = processRenewProductPerformanceService;
            this.renewManufacturingModel = renewManufacturingModel;
            this.renewInnovationModel = renewInnovationModel;
            this.renewWasteModel = renewWasteModel;
            this.renewStewardshipModel = renewStewardshipModel;
            this.renewStakeholderModel = renewStakeholderModel;
            this.renewCommentsModel = renewCommentsModel;
            this.renewMpUnitModel = renewMpUnitModel;
            this.renewWmUnitModel = renewWmUnitModel;
            this.certWmUnitModel = certWmUnitModel;
            this.renewDocumentModel = renewDocumentModel;
            this.renewalCycleModel = renewalCycleModel;
            this.productModel = productModel;
            this.paymentModel = paymentModel;
            this.renewUrnTabReviewService = renewUrnTabReviewService;
            this.processRenewCommentsService = processRenewCommentsService;
        }
        RenewDetailsService_1.prototype.buildCompactProductDetailsList = function (rows) {
            return rows.map(function (row) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                var productDetails = ((_a = row.product_details) !== null && _a !== void 0 ? _a : {});
                var plants = (_b = row.plants) !== null && _b !== void 0 ? _b : [];
                var eoiNo = String((_d = (_c = productDetails.eoiNo) !== null && _c !== void 0 ? _c : row.eoiNo) !== null && _d !== void 0 ? _d : '').trim();
                var plantsForEoi = eoiNo
                    ? plants.filter(function (plant) { var _a; return String((_a = plant.eoiNo) !== null && _a !== void 0 ? _a : '').trim() === eoiNo; })
                    : plants;
                var unitCount = Number((_g = (_f = (_e = productDetails.plantCount) !== null && _e !== void 0 ? _e : productDetails.hpUnits) !== null && _f !== void 0 ? _f : plantsForEoi.length) !== null && _g !== void 0 ? _g : 0);
                return {
                    eoiNo: (_j = (_h = productDetails.eoiNo) !== null && _h !== void 0 ? _h : row.eoiNo) !== null && _j !== void 0 ? _j : null,
                    productName: (_l = (_k = productDetails.productName) !== null && _k !== void 0 ? _k : row.productName) !== null && _l !== void 0 ? _l : null,
                    productStatus: (_o = (_m = productDetails.productStatus) !== null && _m !== void 0 ? _m : row.productStatus) !== null && _o !== void 0 ? _o : null,
                    hpUnits: unitCount,
                    plantCount: unitCount,
                    product_details: productDetails,
                };
            });
        };
        RenewDetailsService_1.prototype.buildVendorSummary = function (first) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var vendor = first.vendor;
            if (!vendor) {
                return null;
            }
            var manufacturer = first.manufacturer;
            var company = (_d = (_c = (_b = (_a = vendor.companyName) !== null && _a !== void 0 ? _a : vendor.manufacturerName) !== null && _b !== void 0 ? _b : vendor.vendor_name) !== null && _c !== void 0 ? _c : manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _d !== void 0 ? _d : null;
            return {
                _id: (_e = vendor._id) !== null && _e !== void 0 ? _e : null,
                company: company,
                contact: (_f = vendor.contactName) !== null && _f !== void 0 ? _f : company,
                email: (_h = (_g = vendor.vendor_email) !== null && _g !== void 0 ? _g : vendor.email) !== null && _h !== void 0 ? _h : null,
                phone: (_k = (_j = vendor.vendor_phone) !== null && _j !== void 0 ? _j : vendor.phone) !== null && _k !== void 0 ? _k : null,
            };
        };
        RenewDetailsService_1.prototype.resolveActiveCycle = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var cycle, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findById(renewalCycleId.trim())
                                    .exec()];
                        case 2:
                            cycle = _b.sent();
                            if (cycle && cycle.urnNo === urnNo) {
                                return [2 /*return*/, cycle];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.renewalCycleModel
                                .findOne({ urnNo: urnNo, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                                .sort({ cycleNo: -1 })
                                .exec()];
                    }
                });
            });
        };
        RenewDetailsService_1.prototype.emptyPerformanceReadPayload = function (renewalCycleId) {
            return {
                renewalCycleId: (renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim()) || null,
                product_performance: null,
                product_performance_test_reports: [],
                product_performance_documents: [],
            };
        };
        RenewDetailsService_1.prototype.loadRenewBundle = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var cycle, cycleIdForRead, performanceRead, _a, headerFilter, strictDocs, documentCycleId, _b, manufacturing, innovation, waste, stewardship, stakeholders, comments, allDocuments, unitFilter, mpUnits, wmUnits, documentRows, manufacturingSection, innovationSection, wasteSection, stewardshipSection, unifiedDocuments, certifiedEoiNos, renewDocumentsOnly;
                var _this = this;
                var _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.resolveActiveCycle(urnNo, renewalCycleId)];
                        case 1:
                            cycle = _f.sent();
                            cycleIdForRead = (_c = renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim()) !== null && _c !== void 0 ? _c : ((cycle === null || cycle === void 0 ? void 0 : cycle._id) ? String(cycle._id) : undefined);
                            _f.label = 2;
                        case 2:
                            _f.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.processRenewProductPerformanceService.loadRenewProductPerformanceReadPayload(urnNo, cycleIdForRead)];
                        case 3:
                            performanceRead =
                                _f.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = _f.sent();
                            performanceRead = this.emptyPerformanceReadPayload(cycleIdForRead);
                            return [3 /*break*/, 5];
                        case 5:
                            headerFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(urnNo, cycle);
                            strictDocs = Number((_d = cycle === null || cycle === void 0 ? void 0 : cycle.cycleNo) !== null && _d !== void 0 ? _d : 1) > 1;
                            documentCycleId = (_e = cycle === null || cycle === void 0 ? void 0 : cycle._id) !== null && _e !== void 0 ? _e : performanceRead.renewalCycleId;
                            return [4 /*yield*/, Promise.all([
                                    this.renewManufacturingModel.findOne(headerFilter).lean().exec(),
                                    this.renewInnovationModel.findOne(headerFilter).lean().exec(),
                                    this.renewWasteModel.findOne(headerFilter).lean().exec(),
                                    this.renewStewardshipModel.findOne(headerFilter).lean().exec(),
                                    this.renewStakeholderModel
                                        .find({ urnNo: urnNo, isDeleted: { $ne: true } })
                                        .lean()
                                        .exec(),
                                    this.renewCommentsModel
                                        .findOne((cycle === null || cycle === void 0 ? void 0 : cycle._id)
                                        ? Number(cycle.cycleNo) > 1
                                            ? { urnNo: urnNo, renewalCycleId: cycle._id }
                                            : {
                                                urnNo: urnNo,
                                                $or: [
                                                    { renewalCycleId: cycle._id },
                                                    { renewalCycleId: null },
                                                    { renewalCycleId: { $exists: false } },
                                                ],
                                            }
                                        : { urnNo: urnNo })
                                        .lean()
                                        .exec()
                                        .then(function (scoped) { return __awaiter(_this, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            if (scoped || Number((_a = cycle === null || cycle === void 0 ? void 0 : cycle.cycleNo) !== null && _a !== void 0 ? _a : 0) > 1) {
                                                return [2 /*return*/, scoped];
                                            }
                                            return [2 /*return*/, this.renewCommentsModel.findOne({ urnNo: urnNo }).lean().exec()];
                                        });
                                    }); }),
                                    this.renewDocumentModel
                                        .find((0, renew_details_format_util_1.buildRenewDocumentsQueryFilter)(urnNo, documentCycleId, {
                                        strictCycleOnly: strictDocs,
                                    }))
                                        .sort({ productDocumentId: -1 })
                                        .lean()
                                        .exec(),
                                ])];
                        case 6:
                            _b = _f.sent(), manufacturing = _b[0], innovation = _b[1], waste = _b[2], stewardship = _b[3], stakeholders = _b[4], comments = _b[5], allDocuments = _b[6];
                            unitFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(urnNo, cycle);
                            return [4 /*yield*/, this.renewMpUnitModel.find(unitFilter).lean().exec()];
                        case 7:
                            mpUnits = _f.sent();
                            return [4 /*yield*/, (0, renew_wm_units_read_util_1.findRenewWmUnitsForRead)(this.renewWmUnitModel, this.certWmUnitModel, urnNo, cycle)];
                        case 8:
                            wmUnits = _f.sent();
                            documentRows = allDocuments;
                            manufacturingSection = (0, renew_details_format_util_1.buildManufacturingSection)(manufacturing, documentRows);
                            innovationSection = (0, renew_details_format_util_1.buildInnovationSection)(innovation, documentRows);
                            wasteSection = (0, renew_details_format_util_1.buildWasteSection)(waste, documentRows);
                            stewardshipSection = (0, renew_details_format_util_1.buildStewardshipSection)(stewardship, stakeholders, documentRows);
                            unifiedDocuments = (0, renew_details_format_util_1.mergeRenewDocumentSources)(documentRows, performanceRead.product_performance_documents, manufacturingSection.process_manufacturing_documents, wasteSection.process_waste_management_documents, innovationSection.process_innovation_documents, stewardshipSection.process_product_stewardship_documents);
                            return [4 /*yield*/, (0, renew_eligible_product_util_1.fetchRenewCertifiedEoiSet)(this.productModel, urnNo)];
                        case 9:
                            certifiedEoiNos = _f.sent();
                            renewDocumentsOnly = (0, renew_eligible_product_util_1.filterRenewRowsByCertifiedEoi)(unifiedDocuments, certifiedEoiNos);
                            return [2 /*return*/, {
                                    cycle: cycle,
                                    performanceCycleId: performanceRead.renewalCycleId,
                                    processSections: __assign(__assign(__assign(__assign(__assign({ product_performance: performanceRead.product_performance, product_performance_test_reports: performanceRead.product_performance_test_reports, product_performance_documents: performanceRead.product_performance_documents }, manufacturingSection), innovationSection), wasteSection), stewardshipSection), { process_comments: (0, renew_details_format_util_1.formatRenewComments)(comments), process_mp_manufacturing_units: mpUnits.map(renew_details_format_util_1.formatRenewMpManufacturingUnitForDetails), process_wm_manufacturing_units: wmUnits, all_renew_product_documents: renewDocumentsOnly, all_urn_product_documents: renewDocumentsOnly, documents: renewDocumentsOnly }),
                                }];
                    }
                });
            });
        };
        RenewDetailsService_1.prototype.getRenewDetailsByUrn = function (urnNo, renewalCycleId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, include, _a, allDetailRows, bundle, joinedRows, baseRows, siteVisits, renewMpUnits, renewWmUnits, baseRowsWithoutCertUnits, renewManufacturingWeightedTotals, mergedRows, enriched, data, first, productDetails, category, activeCycle, products, manufacturer, manufacturing_details, plants, plant_details, allRenewDocuments, documents, cyclePayments, cyclePayment, payRows, paymentPayload, productSnapshot, contextCycle, cycleScopedUrnStatus, dataWithDocuments, renewContext, urnContext, baseResult, cycleIdForExtras, fullExtras, _b, tabReviewsRaw, processComments;
                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21;
                return __generator(this, function (_22) {
                    switch (_22.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            include = (_c = options === null || options === void 0 ? void 0 : options.include) !== null && _c !== void 0 ? _c : 'summary';
                            if (!((options === null || options === void 0 ? void 0 : options.role) === 'vendor' && options.actorVendorOrManufacturerId)) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, renew_common_util_1.assertRenewActorCanReadUrn)(this.productModel, trimmedUrn, options.actorVendorOrManufacturerId)];
                        case 1:
                            _22.sent();
                            _22.label = 2;
                        case 2: return [4 /*yield*/, Promise.all([
                                this.productRegistrationService.getRenewProductDetailsByUrn(trimmedUrn),
                                this.loadRenewBundle(trimmedUrn, renewalCycleId),
                            ])];
                        case 3:
                            _a = _22.sent(), allDetailRows = _a[0], bundle = _a[1];
                            return [4 /*yield*/, this.productRegistrationService.enrichUrnDetailRowsWithManufacturerAndPlants(trimmedUrn, allDetailRows)];
                        case 4:
                            joinedRows = _22.sent();
                            baseRows = (0, renew_eligible_product_util_1.filterRenewDetailsRows)(joinedRows);
                            if (baseRows.length === 0) {
                                throw new common_1.NotFoundException("No certified products found for URN ".concat(trimmedUrn, " (rejected EOIs are excluded from renewal)"));
                            }
                            siteVisits = (_e = (_d = baseRows[0]) === null || _d === void 0 ? void 0 : _d.siteVisits) !== null && _e !== void 0 ? _e : [];
                            renewMpUnits = bundle.processSections.process_mp_manufacturing_units;
                            renewWmUnits = bundle.processSections.process_wm_manufacturing_units;
                            baseRowsWithoutCertUnits = baseRows.map(function (row) {
                                var _a = row, _mp = _a.process_mp_manufacturing_units, _wm = _a.process_wm_manufacturing_units, rest = __rest(_a, ["process_mp_manufacturing_units", "process_wm_manufacturing_units"]);
                                return rest;
                            });
                            renewManufacturingWeightedTotals = (0, mp_manufacturing_weighted_totals_util_1.buildManufacturingWeightedTotals)(renewMpUnits);
                            mergedRows = baseRowsWithoutCertUnits.map(function (row) { return (__assign(__assign(__assign(__assign({}, row), renew_details_format_util_1.RENEW_CLEARED_CERT_SECTIONS), bundle.processSections), { process_mp_manufacturing_units: renewMpUnits, process_wm_manufacturing_units: renewWmUnits, manufacturing_weighted_totals: renewManufacturingWeightedTotals, manufacturingWeightedTotals: renewManufacturingWeightedTotals })); });
                            enriched = (0, consolidate_urn_detail_items_util_1.enrichUrnDetailRowsWithSharedProcessData)(mergedRows.map(function (row) { return (__assign(__assign({}, row), { siteVisits: siteVisits })); }));
                            data = enriched.map(function (row) {
                                var next = __assign(__assign({}, row), { process_mp_manufacturing_units: renewMpUnits, process_wm_manufacturing_units: renewWmUnits });
                                if (!next.product_performance) {
                                    (0, renew_details_format_util_1.spreadProductPerformanceToDetailRows)([next], bundle.processSections.product_performance);
                                }
                                return next;
                            });
                            first = ((_f = data[0]) !== null && _f !== void 0 ? _f : {});
                            productDetails = first.product_details;
                            category = first.category;
                            activeCycle = bundle.cycle;
                            products = buildRenewProductsSummary(data);
                            manufacturer = (_g = first.manufacturer) !== null && _g !== void 0 ? _g : null;
                            manufacturing_details = (_h = first.manufacturing_details) !== null && _h !== void 0 ? _h : manufacturer;
                            plants = (0, renew_plant_state_util_1.withRenewPlantsStateAliases)(dedupePlantsById(data));
                            plant_details = plants;
                            allRenewDocuments = (_j = bundle.processSections.all_renew_product_documents) !== null && _j !== void 0 ? _j : [];
                            documents = allRenewDocuments;
                            cyclePayments = [];
                            cyclePayment = null;
                            if (!bundle.cycle) return [3 /*break*/, 6];
                            return [4 /*yield*/, (0, renew_cycle_scope_util_1.findRenewPaymentsForCycle)(this.paymentModel, trimmedUrn, bundle.cycle)];
                        case 5:
                            payRows = _22.sent();
                            paymentPayload = (0, renew_cycle_scope_util_1.buildRenewPaymentsPayload)(payRows);
                            cyclePayments = paymentPayload.payments;
                            cyclePayment = paymentPayload.payment;
                            _22.label = 6;
                        case 6: return [4 /*yield*/, this.productModel
                                .findOne(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                .select('urnStatus renewCycleNo productRenewStatus')
                                .lean()
                                .exec()];
                        case 7:
                            productSnapshot = _22.sent();
                            contextCycle = bundle.cycle;
                            cycleScopedUrnStatus = (0, renew_cycle_scope_util_1.resolveCycleScopedUrnStatus)(contextCycle, {
                                urnStatus: Number((_m = (_l = (_k = productSnapshot === null || productSnapshot === void 0 ? void 0 : productSnapshot.urnStatus) !== null && _k !== void 0 ? _k : productDetails === null || productDetails === void 0 ? void 0 : productDetails.urnStatus) !== null && _l !== void 0 ? _l : first.urnStatus) !== null && _m !== void 0 ? _m : 0),
                                renewCycleNo: Number((_q = (_p = (_o = productSnapshot === null || productSnapshot === void 0 ? void 0 : productSnapshot.renewCycleNo) !== null && _o !== void 0 ? _o : productDetails === null || productDetails === void 0 ? void 0 : productDetails.renewCycleNo) !== null && _p !== void 0 ? _p : first.renewCycleNo) !== null && _q !== void 0 ? _q : 0),
                            }, cyclePayment);
                            dataWithDocuments = data.map(function (row) { return (__assign(__assign({}, row), { all_renew_product_documents: allRenewDocuments, all_urn_product_documents: allRenewDocuments, documents: allRenewDocuments, payments: cyclePayments, payment: cyclePayment })); });
                            renewContext = {
                                urnNo: trimmedUrn,
                                urnStatus: cycleScopedUrnStatus,
                                urn_status: cycleScopedUrnStatus,
                                productRenewStatus: (_t = (_s = (_r = productSnapshot === null || productSnapshot === void 0 ? void 0 : productSnapshot.productRenewStatus) !== null && _r !== void 0 ? _r : productDetails === null || productDetails === void 0 ? void 0 : productDetails.productRenewStatus) !== null && _s !== void 0 ? _s : first.productRenewStatus) !== null && _t !== void 0 ? _t : null,
                                renewCycleNo: (_w = (_v = (_u = productSnapshot === null || productSnapshot === void 0 ? void 0 : productSnapshot.renewCycleNo) !== null && _u !== void 0 ? _u : productDetails === null || productDetails === void 0 ? void 0 : productDetails.renewCycleNo) !== null && _v !== void 0 ? _v : first.renewCycleNo) !== null && _w !== void 0 ? _w : null,
                                category: category !== null && category !== void 0 ? category : null,
                                categoryName: (_y = (_x = category === null || category === void 0 ? void 0 : category.categoryName) !== null && _x !== void 0 ? _x : category === null || category === void 0 ? void 0 : category.category_name) !== null && _y !== void 0 ? _y : null,
                                vendorId: (_1 = (_z = first.vendorId) !== null && _z !== void 0 ? _z : (_0 = first.vendor) === null || _0 === void 0 ? void 0 : _0._id) !== null && _1 !== void 0 ? _1 : null,
                                manufacturerId: (_4 = (_2 = first.manufacturerId) !== null && _2 !== void 0 ? _2 : (_3 = first.manufacturer) === null || _3 === void 0 ? void 0 : _3._id) !== null && _4 !== void 0 ? _4 : null,
                                renewalCycleId: String((_7 = (_6 = (_5 = activeCycle === null || activeCycle === void 0 ? void 0 : activeCycle._id) !== null && _5 !== void 0 ? _5 : bundle.performanceCycleId) !== null && _6 !== void 0 ? _6 : renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim()) !== null && _7 !== void 0 ? _7 : ''),
                                activeRenewalCycle: activeCycle
                                    ? {
                                        id: String(activeCycle._id),
                                        cycleNo: activeCycle.cycleNo,
                                        status: activeCycle.status,
                                        paymentId: (_8 = activeCycle.paymentId) !== null && _8 !== void 0 ? _8 : null,
                                    }
                                    : null,
                                renewalCycle: activeCycle
                                    ? {
                                        id: String(activeCycle._id),
                                        cycleNo: activeCycle.cycleNo,
                                        status: activeCycle.status,
                                        paymentId: (_9 = activeCycle.paymentId) !== null && _9 !== void 0 ? _9 : null,
                                    }
                                    : null,
                            };
                            urnContext = {
                                urnNo: trimmedUrn,
                                urnStatus: cycleScopedUrnStatus,
                                productRenewStatus: (_12 = (_11 = (_10 = productSnapshot === null || productSnapshot === void 0 ? void 0 : productSnapshot.productRenewStatus) !== null && _10 !== void 0 ? _10 : productDetails === null || productDetails === void 0 ? void 0 : productDetails.productRenewStatus) !== null && _11 !== void 0 ? _11 : first.productRenewStatus) !== null && _12 !== void 0 ? _12 : null,
                                product_renew_status: (_15 = (_14 = (_13 = productSnapshot === null || productSnapshot === void 0 ? void 0 : productSnapshot.productRenewStatus) !== null && _13 !== void 0 ? _13 : productDetails === null || productDetails === void 0 ? void 0 : productDetails.productRenewStatus) !== null && _14 !== void 0 ? _14 : first.productRenewStatus) !== null && _15 !== void 0 ? _15 : null,
                                renewCycleNo: (_18 = (_17 = (_16 = productSnapshot === null || productSnapshot === void 0 ? void 0 : productSnapshot.renewCycleNo) !== null && _16 !== void 0 ? _16 : productDetails === null || productDetails === void 0 ? void 0 : productDetails.renewCycleNo) !== null && _17 !== void 0 ? _17 : first.renewCycleNo) !== null && _18 !== void 0 ? _18 : null,
                                vendorId: renewContext.vendorId,
                                manufacturerId: renewContext.manufacturerId,
                                renewalCycleId: renewContext.renewalCycleId,
                            };
                            baseResult = {
                                data: dataWithDocuments,
                                products: products,
                                manufacturer: manufacturer,
                                manufacturing_details: manufacturing_details,
                                plants: plants,
                                plant_details: plant_details,
                                all_renew_product_documents: allRenewDocuments,
                                all_urn_product_documents: allRenewDocuments,
                                documents: documents,
                                siteVisits: siteVisits,
                                renewContext: renewContext,
                                urnContext: urnContext,
                            };
                            if (include !== 'full') {
                                return [2 /*return*/, baseResult];
                            }
                            cycleIdForExtras = String((_20 = (_19 = activeCycle === null || activeCycle === void 0 ? void 0 : activeCycle._id) !== null && _19 !== void 0 ? _19 : renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim()) !== null && _20 !== void 0 ? _20 : '');
                            fullExtras = {
                                product_details_list: this.buildCompactProductDetailsList(dataWithDocuments),
                                payment: cyclePayment,
                                payments: cyclePayments,
                                category: (_21 = category) !== null && _21 !== void 0 ? _21 : null,
                                vendor: this.buildVendorSummary(first),
                            };
                            if (!((options === null || options === void 0 ? void 0 : options.role) === 'admin' && cycleIdForExtras)) return [3 /*break*/, 9];
                            return [4 /*yield*/, Promise.all([
                                    this.renewUrnTabReviewService.getUrnTabReviews(trimmedUrn, cycleIdForExtras),
                                    this.processRenewCommentsService.adminGetCommentsPayload(trimmedUrn, cycleIdForExtras),
                                ])];
                        case 8:
                            _b = _22.sent(), tabReviewsRaw = _b[0], processComments = _b[1];
                            fullExtras.tabReviews = __assign(__assign({}, tabReviewsRaw), { urnStatus: cycleScopedUrnStatus, canReview: cycleScopedUrnStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS });
                            fullExtras.processComments = processComments;
                            _22.label = 9;
                        case 9: return [2 /*return*/, __assign(__assign({}, baseResult), fullExtras)];
                    }
                });
            });
        };
        /** Renew MP/WM/Innovation document buckets for certified vendor URN details merge. */
        RenewDetailsService_1.prototype.loadRenewProcessDocumentsReadPayload = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, emptyPayload, cycle, _a, strictDocs, documentRows, manufacturingSection, wasteSection, innovationSection, certifiedEoiNos, scopedRenewDocuments;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            emptyPayload = {
                                process_manufacturing_documents: [],
                                process_waste_management_documents: [],
                                process_innovation_documents: [],
                                all_renew_product_documents: [],
                            };
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.processRenewProductPerformanceService.resolveRenewalCycleForRead(trimmedUrn, renewalCycleId)];
                        case 2:
                            cycle =
                                _f.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _f.sent();
                            return [2 /*return*/, emptyPayload];
                        case 4:
                            strictDocs = Number((_b = cycle.cycleNo) !== null && _b !== void 0 ? _b : 1) > 1;
                            return [4 /*yield*/, this.renewDocumentModel
                                    .find((0, renew_details_format_util_1.buildRenewDocumentsQueryFilter)(trimmedUrn, cycle._id, {
                                    strictCycleOnly: strictDocs,
                                }))
                                    .sort({ productDocumentId: -1 })
                                    .lean()
                                    .exec()];
                        case 5:
                            documentRows = (_f.sent());
                            manufacturingSection = (0, renew_details_format_util_1.buildManufacturingSection)(null, documentRows);
                            wasteSection = (0, renew_details_format_util_1.buildWasteSection)(null, documentRows);
                            innovationSection = (0, renew_details_format_util_1.buildInnovationSection)(null, documentRows);
                            return [4 /*yield*/, (0, renew_eligible_product_util_1.fetchRenewCertifiedEoiSet)(this.productModel, trimmedUrn)];
                        case 6:
                            certifiedEoiNos = _f.sent();
                            scopedRenewDocuments = (0, renew_eligible_product_util_1.filterRenewRowsByCertifiedEoi)(documentRows, certifiedEoiNos);
                            return [2 /*return*/, {
                                    process_manufacturing_documents: (_c = manufacturingSection.process_manufacturing_documents) !== null && _c !== void 0 ? _c : [],
                                    process_waste_management_documents: (_d = wasteSection.process_waste_management_documents) !== null && _d !== void 0 ? _d : [],
                                    process_innovation_documents: (_e = innovationSection.process_innovation_documents) !== null && _e !== void 0 ? _e : [],
                                    all_renew_product_documents: scopedRenewDocuments,
                                }];
                    }
                });
            });
        };
        RenewDetailsService_1.prototype.getManufacturingByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadRenewBundle(urnNo.trim(), renewalCycleId)];
                        case 1:
                            bundle = _a.sent();
                            return [2 /*return*/, {
                                    process_manufacturing: bundle.processSections.process_manufacturing,
                                    process_manufacturing_documents: bundle.processSections.process_manufacturing_documents,
                                    process_mp_manufacturing_units: bundle.processSections.process_mp_manufacturing_units,
                                }];
                    }
                });
            });
        };
        RenewDetailsService_1.prototype.getInnovationByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadRenewBundle(urnNo.trim(), renewalCycleId)];
                        case 1:
                            bundle = _a.sent();
                            return [2 /*return*/, {
                                    process_innovation: bundle.processSections.process_innovation,
                                    process_innovation_documents: bundle.processSections.process_innovation_documents,
                                }];
                    }
                });
            });
        };
        RenewDetailsService_1.prototype.getWasteByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadRenewBundle(urnNo.trim(), renewalCycleId)];
                        case 1:
                            bundle = _a.sent();
                            return [2 /*return*/, {
                                    process_waste_management: bundle.processSections.process_waste_management,
                                    process_waste_management_documents: bundle.processSections.process_waste_management_documents,
                                    process_wm_manufacturing_units: bundle.processSections.process_wm_manufacturing_units,
                                }];
                    }
                });
            });
        };
        RenewDetailsService_1.prototype.getStewardshipByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadRenewBundle(urnNo.trim(), renewalCycleId)];
                        case 1:
                            bundle = _a.sent();
                            return [2 /*return*/, {
                                    process_product_stewardship: bundle.processSections.process_product_stewardship,
                                    process_ps_stakeholder_edu_awarness: bundle.processSections.process_ps_stakeholder_edu_awarness,
                                    process_product_stewardship_documents: bundle.processSections.process_product_stewardship_documents,
                                }];
                    }
                });
            });
        };
        RenewDetailsService_1.prototype.getCommentsByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadRenewBundle(urnNo.trim(), renewalCycleId)];
                        case 1:
                            bundle = _a.sent();
                            return [2 /*return*/, { process_comments: bundle.processSections.process_comments }];
                    }
                });
            });
        };
        RenewDetailsService_1.prototype.getProductPerformanceByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.processRenewProductPerformanceService.getFormPayloadByUrn(urnNo.trim(), renewalCycleId)];
                });
            });
        };
        return RenewDetailsService_1;
    }());
    __setFunctionName(_classThis, "RenewDetailsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewDetailsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewDetailsService = _classThis;
}();
exports.RenewDetailsService = RenewDetailsService;
