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
exports.RenewalOrchestrationService = void 0;
var common_1 = require("@nestjs/common");
var certification_dates_util_1 = require("../../product-registration/helpers/certification-dates.util");
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renew_cycle_scope_util_1 = require("../helpers/renew-cycle-scope.util");
var mongo_session_util_1 = require("../helpers/mongo-session.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var renewal_activity_constants_1 = require("../constants/renewal-activity.constants");
var RenewalOrchestrationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewalOrchestrationService = _classThis = /** @class */ (function () {
        function RenewalOrchestrationService_1(productModel, paymentModel, renewCommentsModel, renewManufacturingModel, renewWasteModel, renewInnovationModel, renewStewardshipModel, renewPerformanceModel, connection, sequenceHelper, renewalCycleService, activityLogService, renewDocumentPromotionService) {
            this.productModel = productModel;
            this.paymentModel = paymentModel;
            this.renewCommentsModel = renewCommentsModel;
            this.renewManufacturingModel = renewManufacturingModel;
            this.renewWasteModel = renewWasteModel;
            this.renewInnovationModel = renewInnovationModel;
            this.renewStewardshipModel = renewStewardshipModel;
            this.renewPerformanceModel = renewPerformanceModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.renewalCycleService = renewalCycleService;
            this.activityLogService = activityLogService;
            this.renewDocumentPromotionService = renewDocumentPromotionService;
            this.logger = new common_1.Logger(RenewalOrchestrationService.name);
        }
        RenewalOrchestrationService_1.prototype.seedAllRenewHeaders = function (context, session, cycle) {
            return __awaiter(this, void 0, void 0, function () {
                var ownership, trimmedUrn, now, headerFilter, cycleId, seedHeaderIfMissing;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            trimmedUrn = ownership.urnNo;
                            now = new Date();
                            headerFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(trimmedUrn, cycle !== null && cycle !== void 0 ? cycle : null);
                            cycleId = cycle === null || cycle === void 0 ? void 0 : cycle._id;
                            seedHeaderIfMissing = function (findExisting, createRow) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, findExisting()];
                                        case 1:
                                            if (_a.sent()) {
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, createRow()];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            if (!cycleId) return [3 /*break*/, 2];
                            return [4 /*yield*/, seedHeaderIfMissing(function () {
                                    return _this.renewCommentsModel
                                        .findOne({ urnNo: trimmedUrn, renewalCycleId: cycleId })
                                        .session(session)
                                        .exec();
                                }, function () { return __awaiter(_this, void 0, void 0, function () {
                                    var processRenewCommentsId;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.sequenceHelper.getProcessRenewCommentsId()];
                                            case 1:
                                                processRenewCommentsId = _a.sent();
                                                return [4 /*yield*/, this.renewCommentsModel.create([
                                                        {
                                                            processRenewCommentsId: processRenewCommentsId,
                                                            urnNo: trimmedUrn,
                                                            renewalCycleId: cycleId,
                                                            vendorId: ownership.vendorId,
                                                            manufacturerId: ownership.manufacturerId,
                                                            updatedDate: now,
                                                        },
                                                    ], { session: session })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, seedHeaderIfMissing(function () {
                                return _this.renewManufacturingModel
                                    .findOne(headerFilter)
                                    .session(session)
                                    .exec();
                            }, function () { return __awaiter(_this, void 0, void 0, function () {
                                var processRenewManufacturingId;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.sequenceHelper.getProcessRenewManufacturingId()];
                                        case 1:
                                            processRenewManufacturingId = _a.sent();
                                            return [4 /*yield*/, this.renewManufacturingModel.findOneAndUpdate(headerFilter, {
                                                    $setOnInsert: __assign(__assign({ processRenewManufacturingId: processRenewManufacturingId, urnNo: trimmedUrn }, (cycleId ? { renewalCycleId: cycleId } : {})), { vendorId: ownership.vendorId, manufacturerId: ownership.manufacturerId, energyConservationSupportingDocuments: 0, energyConsumptionDocuments: 0, processManufacturingStatus: 0, createdDate: now, updatedDate: now }),
                                                }, { upsert: true, session: session, new: true })];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, seedHeaderIfMissing(function () {
                                    return _this.renewWasteModel.findOne(headerFilter).session(session).exec();
                                }, function () { return __awaiter(_this, void 0, void 0, function () {
                                    var processRenewWasteManagementId;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.sequenceHelper.getProcessRenewWasteManagementId()];
                                            case 1:
                                                processRenewWasteManagementId = _a.sent();
                                                return [4 /*yield*/, this.renewWasteModel.findOneAndUpdate(headerFilter, {
                                                        $setOnInsert: __assign(__assign({ processRenewWasteManagementId: processRenewWasteManagementId, urnNo: trimmedUrn }, (cycleId ? { renewalCycleId: cycleId } : {})), { vendorId: ownership.vendorId, manufacturerId: ownership.manufacturerId, wmSupportingDocuments: 0, processWasteManagementStatus: 0, createdDate: now, updatedDate: now }),
                                                    }, { upsert: true, session: session, new: true })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, seedHeaderIfMissing(function () {
                                    return _this.renewInnovationModel.findOne(headerFilter).session(session).exec();
                                }, function () { return __awaiter(_this, void 0, void 0, function () {
                                    var processRenewInnovationId;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.sequenceHelper.getProcessRenewInnovationId()];
                                            case 1:
                                                processRenewInnovationId = _a.sent();
                                                return [4 /*yield*/, this.renewInnovationModel.findOneAndUpdate(headerFilter, {
                                                        $setOnInsert: __assign(__assign({ processRenewInnovationId: processRenewInnovationId, urnNo: trimmedUrn }, (cycleId ? { renewalCycleId: cycleId } : {})), { vendorId: ownership.vendorId, manufacturerId: ownership.manufacturerId, innovationImplementationDocuments: 0, processInnovationStatus: 0, createdDate: now, updatedDate: now }),
                                                    }, { upsert: true, session: session, new: true })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, seedHeaderIfMissing(function () {
                                    return _this.renewStewardshipModel
                                        .findOne(headerFilter)
                                        .session(session)
                                        .exec();
                                }, function () { return __awaiter(_this, void 0, void 0, function () {
                                    var processRenewProductStewardshipId;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.sequenceHelper.getProcessRenewProductStewardshipId()];
                                            case 1:
                                                processRenewProductStewardshipId = _a.sent();
                                                return [4 /*yield*/, this.renewStewardshipModel.findOneAndUpdate(headerFilter, {
                                                        $setOnInsert: __assign(__assign({ processRenewProductStewardshipId: processRenewProductStewardshipId, urnNo: trimmedUrn }, (cycleId ? { renewalCycleId: cycleId } : {})), { vendorId: ownership.vendorId, manufacturerId: ownership.manufacturerId, seaSupportingDocuments: 0, qmSupportingDocuments: 0, eprSupportingDocuments: 0, productStewardshipStatus: 0, createdDate: now, updatedDate: now }),
                                                    }, { upsert: true, session: session, new: true })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 6:
                            _a.sent();
                            if (!cycleId) {
                                throw new common_1.BadRequestException('renewalCycleId is required to seed renew process headers (including product performance)');
                            }
                            return [4 /*yield*/, seedHeaderIfMissing(function () {
                                    return _this.renewPerformanceModel
                                        .findOne(headerFilter)
                                        .session(session)
                                        .exec();
                                }, function () { return __awaiter(_this, void 0, void 0, function () {
                                    var processRenewProductPerformanceId;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.sequenceHelper.getProcessRenewProductPerformanceId()];
                                            case 1:
                                                processRenewProductPerformanceId = _a.sent();
                                                return [4 /*yield*/, this.renewPerformanceModel.findOneAndUpdate(headerFilter, {
                                                        $setOnInsert: {
                                                            processRenewProductPerformanceId: processRenewProductPerformanceId,
                                                            urnNo: trimmedUrn,
                                                            renewalCycleId: cycleId,
                                                            vendorId: ownership.vendorId,
                                                            manufacturerId: ownership.manufacturerId,
                                                            testReportFiles: 0,
                                                            renewalType: 0,
                                                            productPerformanceStatus: 0,
                                                            createdDate: now,
                                                            updatedDate: now,
                                                        },
                                                    }, { upsert: true, session: session, new: true })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RenewalOrchestrationService_1.prototype.onRenewPaymentApproved = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, context, ownership, userObjectId, now, anyProduct, cycle, cycleIdRaw, productRenewStatus;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmedUrn = input.urnNo.trim();
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, trimmedUrn)];
                        case 1:
                            context = _b.sent();
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(input.userId, 'userId');
                            now = new Date();
                            return [4 /*yield*/, this.productModel
                                    .findOne(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                    .session(input.session)
                                    .exec()];
                        case 2:
                            anyProduct = _b.sent();
                            if (!anyProduct) {
                                throw new common_1.NotFoundException("No products found for URN ".concat(trimmedUrn));
                            }
                            cycle = null;
                            cycleIdRaw = String((_a = input.renewalCycleId) !== null && _a !== void 0 ? _a : '').trim();
                            if (!cycleIdRaw) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.renewalCycleService.resolveCycleForProductUpdate(trimmedUrn, cycleIdRaw, input.session)];
                        case 3:
                            cycle = _b.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.renewalCycleService.getActiveInProgressCycle(trimmedUrn, input.session)];
                        case 5:
                            cycle = _b.sent();
                            _b.label = 6;
                        case 6:
                            productRenewStatus = Number(anyProduct.productRenewStatus);
                            if (productRenewStatus === renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.RENEWED) {
                                if (!cycle || cycle.status !== renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS) {
                                    throw new common_1.BadRequestException('URN renewal is already completed');
                                }
                            }
                            if (!!cycle) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.openNextRenewalCycle(trimmedUrn, ownership, userObjectId, anyProduct.urnStatus, input.paymentId, input.session)];
                        case 7:
                            cycle = _b.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            if (!(input.paymentId && !cycle.paymentId)) return [3 /*break*/, 10];
                            cycle.paymentId = input.paymentId;
                            cycle.updatedAt = now;
                            cycle.updatedBy = userObjectId;
                            return [4 /*yield*/, cycle.save({ session: input.session })];
                        case 9:
                            _b.sent();
                            _b.label = 10;
                        case 10:
                            if (!(cycle === null || cycle === void 0 ? void 0 : cycle._id)) {
                                throw new common_1.BadRequestException('renewalCycleId is required for renew payment approval');
                            }
                            return [4 /*yield*/, this.seedAllRenewHeaders(context, input.session, cycle)];
                        case 11:
                            _b.sent();
                            return [4 /*yield*/, this.productModel.updateMany(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()), {
                                    $set: {
                                        urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED,
                                        productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.IN_PROGRESS,
                                        renewCycleNo: cycle.cycleNo,
                                        updatedDate: now,
                                    },
                                }, { session: input.session })];
                        case 12:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Open the next renewal cycle for a URN (cycle 1 or N+1 after prior completion).
         * Resets product renew state so payment / process tabs can run again.
         */
        RenewalOrchestrationService_1.prototype.openNextRenewalCycle = function (urnNo, ownership, userId, urnStatusAtStart, paymentId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, now, cycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            now = new Date();
                            return [4 /*yield*/, this.renewalCycleService.closeInProgressAndCreateNextCycle({
                                    urnNo: trimmedUrn,
                                    vendorId: ownership.vendorId,
                                    manufacturerId: ownership.manufacturerId,
                                    paymentId: paymentId,
                                    urnStatusAtStart: urnStatusAtStart !== null && urnStatusAtStart !== void 0 ? urnStatusAtStart : renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                                    userId: userId,
                                    session: session,
                                })];
                        case 1:
                            cycle = _a.sent();
                            return [4 /*yield*/, this.productModel.updateMany(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()), {
                                    $set: {
                                        urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                                        productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.NOT_RENEWED,
                                        renewCycleNo: cycle.cycleNo,
                                        updatedDate: now,
                                    },
                                    $unset: { renewedDate: '' },
                                }, session ? { session: session } : {})];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, cycle];
                    }
                });
            });
        };
        /** Return active cycle or open the next one — used when creating renew payments. */
        RenewalOrchestrationService_1.prototype.resolveInProgressRenewalCycleForPayment = function (urnNo, userId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, active, context, ownership, userObjectId, anyProduct, _a, productRenewStatus;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.renewalCycleService.getActiveInProgressCycle(trimmedUrn, session)];
                        case 1:
                            active = _b.sent();
                            if (active) {
                                return [2 /*return*/, active];
                            }
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, trimmedUrn)];
                        case 2:
                            context = _b.sent();
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(userId, 'userId');
                            if (!session) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.productModel
                                    .findOne(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                    .session(session)
                                    .exec()];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.productModel
                                .findOne(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                .exec()];
                        case 5:
                            _a = _b.sent();
                            _b.label = 6;
                        case 6:
                            anyProduct = _a;
                            if (!anyProduct) {
                                throw new common_1.NotFoundException("No products found for URN ".concat(trimmedUrn));
                            }
                            if (Number(anyProduct.productStatus) !== renew_eligible_product_util_1.RENEW_ELIGIBLE_PRODUCT_STATUS) {
                                throw new common_1.BadRequestException('Only certified products can be renewed');
                            }
                            productRenewStatus = Number(anyProduct.productRenewStatus);
                            if (productRenewStatus === renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.IN_PROGRESS) {
                                throw new common_1.BadRequestException('Renewal is already in progress');
                            }
                            return [2 /*return*/, this.openNextRenewalCycle(trimmedUrn, ownership, userObjectId, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING, undefined, session)];
                    }
                });
            });
        };
        RenewalOrchestrationService_1.prototype.startRenewalCycle = function (urnNo, userId, paymentId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, context, ownership, userObjectId, now, anyProduct, productRenewStatus, existingActive, session, cycle, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, trimmedUrn)];
                        case 1:
                            context = _a.sent();
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(userId, 'userId');
                            now = new Date();
                            return [4 /*yield*/, this.productModel
                                    .findOne(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                    .exec()];
                        case 2:
                            anyProduct = _a.sent();
                            if (!anyProduct) {
                                throw new common_1.NotFoundException("No products found for URN ".concat(trimmedUrn));
                            }
                            if (Number(anyProduct.productStatus) !== renew_eligible_product_util_1.RENEW_ELIGIBLE_PRODUCT_STATUS) {
                                throw new common_1.BadRequestException('Only certified products can be renewed');
                            }
                            productRenewStatus = Number(anyProduct.productRenewStatus);
                            if (productRenewStatus === renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.IN_PROGRESS) {
                                throw new common_1.BadRequestException('Renewal is already in progress');
                            }
                            return [4 /*yield*/, this.renewalCycleService.getActiveInProgressCycle(trimmedUrn)];
                        case 3:
                            existingActive = _a.sent();
                            if (existingActive) {
                                throw new common_1.BadRequestException("An in-progress renewal cycle already exists for URN ".concat(trimmedUrn));
                            }
                            return [4 /*yield*/, this.connection.startSession()];
                        case 4:
                            session = _a.sent();
                            session.startTransaction();
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 9, , 11]);
                            return [4 /*yield*/, this.openNextRenewalCycle(trimmedUrn, ownership, userObjectId, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING, paymentId, session)];
                        case 6:
                            cycle = _a.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 7:
                            _a.sent();
                            session.endSession();
                            return [4 /*yield*/, this.activityLogService.logActivity({
                                    vendor_id: ownership.vendorId,
                                    manufacturer_id: ownership.manufacturerId,
                                    urn_no: trimmedUrn,
                                    activities_id: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                                    activity: renewal_activity_constants_1.RENEWAL_ACTIVITY.CYCLE_STARTED,
                                    activity_status: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                                    responsibility: 'Admin',
                                    next_activity: renewal_activity_constants_1.RENEWAL_NEXT_ACTIVITY.VENDOR_SUBMIT_PAYMENT,
                                    next_responsibility: 'Vendor',
                                    next_acitivities_id: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,
                                })];
                        case 8:
                            _a.sent();
                            return [3 /*break*/, 11];
                        case 9:
                            error_1 = _a.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 10:
                            _a.sent();
                            session.endSession();
                            throw error_1;
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        RenewalOrchestrationService_1.prototype.completeRenewal = function (urnNo, userId, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, userObjectId, now, products, completedCycle, promotionCycleId, promotionError_1, anyProduct, logError_1, refreshed, error_2;
                var _this = this;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(userId, 'userId');
                            now = new Date();
                            return [4 /*yield*/, this.productModel
                                    .find(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                    .exec()];
                        case 1:
                            products = _g.sent();
                            if (products.length === 0) {
                                throw new common_1.NotFoundException("No products found for URN ".concat(trimmedUrn));
                            }
                            _g.label = 2;
                        case 2:
                            _g.trys.push([2, 13, , 14]);
                            return [4 /*yield*/, (0, mongo_session_util_1.runInTransactionIfSupported)(this.connection, function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var cycleForUpdate, _i, products_1, product, currentValidTill, newValidTill, notifyDates, _a;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, this.renewalCycleService.resolveCycleForProductUpdate(trimmedUrn, renewalCycleId, session)];
                                            case 1:
                                                cycleForUpdate = _c.sent();
                                                _i = 0, products_1 = products;
                                                _c.label = 2;
                                            case 2:
                                                if (!(_i < products_1.length)) return [3 /*break*/, 5];
                                                product = products_1[_i];
                                                currentValidTill = (_b = product.validtillDate) !== null && _b !== void 0 ? _b : now;
                                                newValidTill = (0, renew_common_util_1.extendValidityForRenewal)(currentValidTill);
                                                notifyDates = (0, certification_dates_util_1.computeNotifyDates)(newValidTill);
                                                return [4 /*yield*/, this.productModel.updateOne({ _id: product._id }, {
                                                        $set: {
                                                            urnStatus: 11,
                                                            productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.RENEWED,
                                                            renewCycleNo: cycleForUpdate.cycleNo,
                                                            renewedDate: now,
                                                            validtillDate: newValidTill,
                                                            firstNotifyDate: notifyDates.firstNotifyDate,
                                                            secondNotifyDate: notifyDates.secondNotifyDate,
                                                            thirdNotifyDate: notifyDates.thirdNotifyDate,
                                                            updatedDate: now,
                                                        },
                                                    }, session ? { session: session } : {})];
                                            case 3:
                                                _c.sent();
                                                _c.label = 4;
                                            case 4:
                                                _i++;
                                                return [3 /*break*/, 2];
                                            case 5:
                                                if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 7];
                                                return [4 /*yield*/, this.renewalCycleService.completeCycleById(trimmedUrn, renewalCycleId.trim(), userObjectId, session)];
                                            case 6:
                                                _a = _c.sent();
                                                return [3 /*break*/, 9];
                                            case 7: return [4 /*yield*/, this.renewalCycleService.completeCycle(trimmedUrn, userObjectId, session)];
                                            case 8:
                                                _a = _c.sent();
                                                _c.label = 9;
                                            case 9: return [2 /*return*/, _a];
                                        }
                                    });
                                }); })];
                        case 3:
                            completedCycle = _g.sent();
                            if (!((renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim()) || (completedCycle === null || completedCycle === void 0 ? void 0 : completedCycle._id))) return [3 /*break*/, 7];
                            promotionCycleId = (renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())
                                ? renewalCycleId.trim()
                                : String(completedCycle._id);
                            _g.label = 4;
                        case 4:
                            _g.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.renewDocumentPromotionService.promoteRenewDocumentsForCompletedCycle(trimmedUrn, promotionCycleId, userObjectId)];
                        case 5:
                            _g.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            promotionError_1 = _g.sent();
                            this.logger.warn("Renew document promotion failed for URN ".concat(trimmedUrn, " (renewal still completed)"), promotionError_1 instanceof Error ? promotionError_1.stack : String(promotionError_1));
                            return [3 /*break*/, 7];
                        case 7:
                            anyProduct = products[0];
                            _g.label = 8;
                        case 8:
                            _g.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, this.activityLogService.logActivity({
                                    vendor_id: anyProduct.vendorId,
                                    manufacturer_id: anyProduct.manufacturerId,
                                    urn_no: trimmedUrn,
                                    activities_id: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED,
                                    activity: renewal_activity_constants_1.RENEWAL_ACTIVITY.RENEWAL_COMPLETED,
                                    activity_status: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED,
                                    responsibility: 'Admin',
                                    next_activity: renewal_activity_constants_1.RENEWAL_NEXT_ACTIVITY.CERTIFICATE_PUBLISHED,
                                    next_responsibility: 'Admin',
                                })];
                        case 9:
                            _g.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            logError_1 = _g.sent();
                            this.logger.warn("Activity log failed after renewal completion for URN ".concat(trimmedUrn), logError_1 instanceof Error ? logError_1.stack : String(logError_1));
                            return [3 /*break*/, 11];
                        case 11: return [4 /*yield*/, this.productModel
                                .findOne({ _id: anyProduct._id })
                                .select('urnStatus productRenewStatus renewCycleNo renewedDate validtillDate')
                                .lean()
                                .exec()];
                        case 12:
                            refreshed = _g.sent();
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    renewalCycleId: String(completedCycle._id),
                                    renewCycleNo: Number((_b = (_a = refreshed === null || refreshed === void 0 ? void 0 : refreshed.renewCycleNo) !== null && _a !== void 0 ? _a : completedCycle.cycleNo) !== null && _b !== void 0 ? _b : 0),
                                    urnStatus: Number((_c = refreshed === null || refreshed === void 0 ? void 0 : refreshed.urnStatus) !== null && _c !== void 0 ? _c : renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED),
                                    productRenewStatus: Number((_d = refreshed === null || refreshed === void 0 ? void 0 : refreshed.productRenewStatus) !== null && _d !== void 0 ? _d : renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.RENEWED),
                                    renewedDate: (_e = refreshed === null || refreshed === void 0 ? void 0 : refreshed.renewedDate) !== null && _e !== void 0 ? _e : now,
                                    validtillDate: (_f = refreshed === null || refreshed === void 0 ? void 0 : refreshed.validtillDate) !== null && _f !== void 0 ? _f : null,
                                }];
                        case 13:
                            error_2 = _g.sent();
                            if (error_2 instanceof common_1.HttpException) {
                                throw error_2;
                            }
                            this.logger.error("Failed to complete renewal for URN ".concat(trimmedUrn), error_2 instanceof Error ? error_2.stack : String(error_2));
                            throw new common_1.InternalServerErrorException(error_2 instanceof Error
                                ? error_2.message || 'Failed to complete renewal'
                                : 'Failed to complete renewal');
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        return RenewalOrchestrationService_1;
    }());
    __setFunctionName(_classThis, "RenewalOrchestrationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewalOrchestrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewalOrchestrationService = _classThis;
}();
exports.RenewalOrchestrationService = RenewalOrchestrationService;
