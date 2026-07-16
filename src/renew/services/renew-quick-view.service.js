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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewQuickViewService = void 0;
var common_1 = require("@nestjs/common");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
var renew_details_format_util_1 = require("../utils/renew-details-format.util");
var renew_cycle_scope_util_1 = require("../helpers/renew-cycle-scope.util");
var renew_plant_state_util_1 = require("../utils/renew-plant-state.util");
var RenewQuickViewService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewQuickViewService = _classThis = /** @class */ (function () {
        function RenewQuickViewService_1(productRegistrationService, processRenewProductPerformanceService, productModel, paymentModel, categoryModel, renewDocumentModel, renewalCycleModel, renewMpUnitModel, renewManufacturingModel, docStreamModel) {
            this.productRegistrationService = productRegistrationService;
            this.processRenewProductPerformanceService = processRenewProductPerformanceService;
            this.productModel = productModel;
            this.paymentModel = paymentModel;
            this.categoryModel = categoryModel;
            this.renewDocumentModel = renewDocumentModel;
            this.renewalCycleModel = renewalCycleModel;
            this.renewMpUnitModel = renewMpUnitModel;
            this.renewManufacturingModel = renewManufacturingModel;
            this.docStreamModel = docStreamModel;
        }
        RenewQuickViewService_1.prototype.buildQuickView = function (urnNo, vendorId, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, productFilter, products, first, productList, category, _a, activeCycle, _b, cycleDoc, _c, renewPaymentRows, _d, _e, cyclePayments, cyclePayment, performanceCycle, performanceRead, _f, strictDocs, documentRows, certifiedEoiNos, documents, streamCycleCandidates, renewalStreams, streamByLiveRefId, strictCycle, mpHeaderFilter, manufacturingHeader, _g, mpUnits, _h, _j, manufacturer, plants, renewPlants, manufacturerName, contextCycle, cycleScopedUrnStatus;
                var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                return __generator(this, function (_w) {
                    switch (_w.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            productFilter = __assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)());
                            if (vendorId) {
                                productFilter.vendorId = (0, renew_common_util_1.toRenewObjectId)(vendorId, 'vendorId');
                            }
                            return [4 /*yield*/, this.productModel
                                    .find(productFilter)
                                    .select('productId eoiNo urnNo productName productStatus productRenewStatus renewCycleNo urnStatus validtillDate renewedDate categoryId vendorId manufacturerId')
                                    .lean()
                                    .exec()];
                        case 1:
                            products = _w.sent();
                            if (products.length === 0) {
                                throw new common_1.NotFoundException("No certified products found for URN ".concat(trimmedUrn, " (rejected EOIs are excluded from renewal)"));
                            }
                            first = products[0];
                            productList = products.map(function (p) {
                                var _a;
                                return ({
                                    productId: p.productId,
                                    eoiNo: p.eoiNo,
                                    productName: p.productName,
                                    productStatus: p.productStatus,
                                    renewCycleNo: (_a = p.renewCycleNo) !== null && _a !== void 0 ? _a : null,
                                    validtillDate: p.validtillDate,
                                    renewedDate: p.renewedDate,
                                });
                            });
                            if (!first.categoryId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.categoryModel
                                    .findById(first.categoryId)
                                    .select('categoryName category_name')
                                    .lean()
                                    .exec()];
                        case 2:
                            _a = _w.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = null;
                            _w.label = 4;
                        case 4:
                            category = _a;
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findById(renewalCycleId.trim())
                                    .lean()
                                    .exec()
                                    .catch(function () { return null; })];
                        case 5:
                            _b = _w.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            _b = null;
                            _w.label = 7;
                        case 7:
                            activeCycle = _b;
                            if (activeCycle && activeCycle.urnNo !== trimmedUrn) {
                                activeCycle = null;
                            }
                            if (!!activeCycle) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findOne({
                                    urnNo: trimmedUrn,
                                    status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                                })
                                    .sort({ cycleNo: -1 })
                                    .lean()
                                    .exec()];
                        case 8:
                            activeCycle = _w.sent();
                            _w.label = 9;
                        case 9:
                            if (!activeCycle) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.renewalCycleModel.findById(activeCycle._id).exec()];
                        case 10:
                            _c = _w.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            _c = null;
                            _w.label = 12;
                        case 12:
                            cycleDoc = _c;
                            if (!cycleDoc) return [3 /*break*/, 14];
                            return [4 /*yield*/, (0, renew_cycle_scope_util_1.findRenewPaymentsForCycle)(this.paymentModel, trimmedUrn, cycleDoc, vendorId)];
                        case 13:
                            _d = _w.sent();
                            return [3 /*break*/, 15];
                        case 14:
                            _d = [];
                            _w.label = 15;
                        case 15:
                            renewPaymentRows = _d;
                            _e = (0, renew_cycle_scope_util_1.buildRenewPaymentsPayload)(renewPaymentRows), cyclePayments = _e.payments, cyclePayment = _e.payment;
                            performanceCycle = null;
                            performanceRead = {
                                product_performance_documents: [],
                            };
                            _w.label = 16;
                        case 16:
                            _w.trys.push([16, 19, , 20]);
                            return [4 /*yield*/, this.processRenewProductPerformanceService.resolveRenewalCycleForRead(trimmedUrn, renewalCycleId !== null && renewalCycleId !== void 0 ? renewalCycleId : ((activeCycle === null || activeCycle === void 0 ? void 0 : activeCycle._id) ? String(activeCycle._id) : undefined))];
                        case 17:
                            performanceCycle =
                                _w.sent();
                            return [4 /*yield*/, this.processRenewProductPerformanceService.loadRenewProductPerformanceReadPayload(trimmedUrn, String(performanceCycle._id))];
                        case 18:
                            performanceRead =
                                _w.sent();
                            return [3 /*break*/, 20];
                        case 19:
                            _f = _w.sent();
                            performanceCycle = null;
                            performanceRead = { product_performance_documents: [] };
                            return [3 /*break*/, 20];
                        case 20:
                            strictDocs = Number((_k = performanceCycle === null || performanceCycle === void 0 ? void 0 : performanceCycle.cycleNo) !== null && _k !== void 0 ? _k : 0) > 1;
                            return [4 /*yield*/, this.renewDocumentModel
                                    .find((0, renew_details_format_util_1.buildRenewDocumentsQueryFilter)(trimmedUrn, (_l = performanceCycle === null || performanceCycle === void 0 ? void 0 : performanceCycle._id) !== null && _l !== void 0 ? _l : activeCycle === null || activeCycle === void 0 ? void 0 : activeCycle._id, { strictCycleOnly: strictDocs }))
                                    .sort({ productDocumentId: -1 })
                                    .lean()
                                    .exec()];
                        case 21:
                            documentRows = _w.sent();
                            certifiedEoiNos = new Set(products.map(function (p) { var _a; return String((_a = p.eoiNo) !== null && _a !== void 0 ? _a : '').trim(); }).filter(Boolean));
                            documents = (0, renew_eligible_product_util_1.filterRenewRowsByCertifiedEoi)((0, renew_details_format_util_1.mergeRenewDocumentSources)(documentRows, performanceRead.product_performance_documents), certifiedEoiNos);
                            streamCycleCandidates = strictDocs
                                ? (performanceCycle === null || performanceCycle === void 0 ? void 0 : performanceCycle._id)
                                    ? [performanceCycle._id]
                                    : [null]
                                : (activeCycle === null || activeCycle === void 0 ? void 0 : activeCycle._id)
                                    ? [activeCycle._id, null]
                                    : [null];
                            return [4 /*yield*/, this.docStreamModel
                                    .find({
                                    urnNo: trimmedUrn,
                                    processType: 'renewal',
                                    renewalCycleId: { $in: streamCycleCandidates },
                                })
                                    .select('liveRef latestVersionNo latestVersionId isDeleted')
                                    .lean()
                                    .exec()];
                        case 22:
                            renewalStreams = _w.sent();
                            streamByLiveRefId = new Map(renewalStreams
                                .filter(function (stream) { var _a; return (_a = stream === null || stream === void 0 ? void 0 : stream.liveRef) === null || _a === void 0 ? void 0 : _a.id; })
                                .map(function (stream) { return [String(stream.liveRef.id), stream]; }));
                            strictCycle = Number((_m = activeCycle === null || activeCycle === void 0 ? void 0 : activeCycle.cycleNo) !== null && _m !== void 0 ? _m : 1) > 1;
                            mpHeaderFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(trimmedUrn, cycleDoc);
                            if (!cycleDoc) return [3 /*break*/, 24];
                            return [4 /*yield*/, this.renewManufacturingModel
                                    .findOne(mpHeaderFilter)
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 23:
                            _g = _w.sent();
                            return [3 /*break*/, 25];
                        case 24:
                            _g = null;
                            _w.label = 25;
                        case 25:
                            manufacturingHeader = _g;
                            if (!(strictCycle && !manufacturingHeader)) return [3 /*break*/, 26];
                            _h = [];
                            return [3 /*break*/, 28];
                        case 26: return [4 /*yield*/, this.renewMpUnitModel
                                .find(cycleDoc ? mpHeaderFilter : { urnNo: trimmedUrn })
                                .select('processRenewMpManufacturingUnitId unitName processMpManufacturingUnitStatus')
                                .lean()
                                .exec()];
                        case 27:
                            _h = _w.sent();
                            _w.label = 28;
                        case 28:
                            mpUnits = _h;
                            return [4 /*yield*/, this.productRegistrationService.getManufacturerAndPlantsForUrn(trimmedUrn)];
                        case 29:
                            _j = _w.sent(), manufacturer = _j.manufacturer, plants = _j.plants;
                            renewPlants = (0, renew_plant_state_util_1.withRenewPlantsStateAliases)(plants);
                            manufacturerName = (manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) != null
                                ? String(manufacturer.manufacturerName).trim()
                                : '';
                            contextCycle = activeCycle !== null && activeCycle !== void 0 ? activeCycle : performanceCycle;
                            cycleScopedUrnStatus = (0, renew_cycle_scope_util_1.resolveCycleScopedUrnStatus)(contextCycle, {
                                urnStatus: first.urnStatus,
                                renewCycleNo: first.renewCycleNo,
                            }, cyclePayment);
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    urnStatus: cycleScopedUrnStatus,
                                    urn_status: cycleScopedUrnStatus,
                                    urnStatusLabel: (0, renewal_urn_status_constants_1.getRenewalUrnStatusLabel)(cycleScopedUrnStatus),
                                    productRenewStatus: first.productRenewStatus,
                                    renewCycleNo: (_o = first.renewCycleNo) !== null && _o !== void 0 ? _o : null,
                                    vendorId: first.vendorId ? String(first.vendorId) : null,
                                    manufacturerId: first.manufacturerId
                                        ? String(first.manufacturerId)
                                        : null,
                                    manufacturerName: manufacturerName || null,
                                    manufacturer: manufacturer !== null && manufacturer !== void 0 ? manufacturer : null,
                                    manufacturing_details: manufacturer !== null && manufacturer !== void 0 ? manufacturer : null,
                                    plants: renewPlants,
                                    plant_details: renewPlants,
                                    category: category
                                        ? {
                                            id: category._id,
                                            name: (_q = (_p = category.categoryName) !== null && _p !== void 0 ? _p : category.category_name) !== null && _q !== void 0 ? _q : null,
                                        }
                                        : null,
                                    activeRenewalCycle: activeCycle
                                        ? {
                                            id: activeCycle._id,
                                            cycleNo: activeCycle.cycleNo,
                                            status: activeCycle.status,
                                            paymentId: (_r = activeCycle.paymentId) !== null && _r !== void 0 ? _r : null,
                                            startedAt: activeCycle.startedAt,
                                        }
                                        : null,
                                    renewalCycle: activeCycle
                                        ? {
                                            id: activeCycle._id,
                                            cycleNo: activeCycle.cycleNo,
                                            status: activeCycle.status,
                                            paymentId: (_s = activeCycle.paymentId) !== null && _s !== void 0 ? _s : null,
                                            startedAt: activeCycle.startedAt,
                                        }
                                        : null,
                                    payments: cyclePayments,
                                    payment: cyclePayment,
                                    renewContext: {
                                        renewalCycleId: (contextCycle === null || contextCycle === void 0 ? void 0 : contextCycle._id) ? String(contextCycle._id) : null,
                                        urnStatus: cycleScopedUrnStatus,
                                        urn_status: cycleScopedUrnStatus,
                                        productRenewStatus: first.productRenewStatus,
                                        renewCycleNo: (_t = first.renewCycleNo) !== null && _t !== void 0 ? _t : null,
                                        activeRenewalCycle: activeCycle
                                            ? {
                                                id: String(activeCycle._id),
                                                cycleNo: activeCycle.cycleNo,
                                                status: activeCycle.status,
                                                paymentId: (_u = activeCycle.paymentId) !== null && _u !== void 0 ? _u : null,
                                            }
                                            : null,
                                        renewalCycle: contextCycle
                                            ? {
                                                id: String(contextCycle._id),
                                                cycleNo: contextCycle.cycleNo,
                                                status: contextCycle.status,
                                                paymentId: (_v = contextCycle.paymentId) !== null && _v !== void 0 ? _v : null,
                                            }
                                            : null,
                                    },
                                    products: productList,
                                    eois: productList,
                                    productList: productList,
                                    documents: documents.map(function (doc) {
                                        var _a, _b, _c;
                                        var stream = streamByLiveRefId.get(String(doc._id));
                                        return __assign(__assign({}, doc), { latestVersionNo: (_a = stream === null || stream === void 0 ? void 0 : stream.latestVersionNo) !== null && _a !== void 0 ? _a : null, latestVersionId: (_b = stream === null || stream === void 0 ? void 0 : stream.latestVersionId) !== null && _b !== void 0 ? _b : null, streamDeleted: (_c = stream === null || stream === void 0 ? void 0 : stream.isDeleted) !== null && _c !== void 0 ? _c : null });
                                    }),
                                    all_renew_product_documents: documents,
                                    all_urn_product_documents: documents,
                                    manufacturingUnitsSummary: renewPlants.length > 0
                                        ? renewPlants.map(function (plant) { return ({
                                            plantName: plant.plantName,
                                            plant_name: plant.plantName,
                                            plantLocation: plant.plantLocation,
                                            plant_location: plant.plantLocation,
                                            eoiNo: plant.eoiNo,
                                            city: plant.city,
                                            stateName: plant.stateName,
                                            state: (0, renew_plant_state_util_1.resolveRenewPlantState)(plant),
                                            State: (0, renew_plant_state_util_1.resolveRenewPlantState)(plant),
                                            countryName: plant.countryName,
                                        }); })
                                        : mpUnits.map(function (u) {
                                            var _a, _b;
                                            return ({
                                                id: u.processRenewMpManufacturingUnitId,
                                                unitName: (_a = u.unitName) !== null && _a !== void 0 ? _a : null,
                                                status: (_b = u.processMpManufacturingUnitStatus) !== null && _b !== void 0 ? _b : 0,
                                            });
                                        }),
                                }];
                    }
                });
            });
        };
        return RenewQuickViewService_1;
    }());
    __setFunctionName(_classThis, "RenewQuickViewService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewQuickViewService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewQuickViewService = _classThis;
}();
exports.RenewQuickViewService = RenewQuickViewService;
