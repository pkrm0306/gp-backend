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
exports.RenewUrnStatusService = void 0;
var common_1 = require("@nestjs/common");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var renewal_activity_constants_1 = require("../constants/renewal-activity.constants");
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
var renew_urn_status_transitions_util_1 = require("../helpers/renew-urn-status-transitions.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_cycle_scope_util_1 = require("../helpers/renew-cycle-scope.util");
var RenewUrnStatusService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewUrnStatusService = _classThis = /** @class */ (function () {
        function RenewUrnStatusService_1(productModel, renewalCycleModel, paymentModel, renewManufacturingModel, renewWasteModel, renewInnovationModel, renewPerformanceModel, connection, activityLogService, renewalOrchestrationService, renewUrnTabReviewService, lifecycleNotification) {
            this.productModel = productModel;
            this.renewalCycleModel = renewalCycleModel;
            this.paymentModel = paymentModel;
            this.renewManufacturingModel = renewManufacturingModel;
            this.renewWasteModel = renewWasteModel;
            this.renewInnovationModel = renewInnovationModel;
            this.renewPerformanceModel = renewPerformanceModel;
            this.connection = connection;
            this.activityLogService = activityLogService;
            this.renewalOrchestrationService = renewalOrchestrationService;
            this.renewUrnTabReviewService = renewUrnTabReviewService;
            this.lifecycleNotification = lifecycleNotification;
        }
        RenewUrnStatusService_1.prototype.resolveRenewalCycle = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var cycle_1, cycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.renewalCycleModel.findById(renewalCycleId.trim()).exec()];
                        case 1:
                            cycle_1 = _a.sent();
                            if (!cycle_1 || cycle_1.urnNo !== urnNo) {
                                throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                            }
                            return [2 /*return*/, cycle_1];
                        case 2: return [4 /*yield*/, this.renewalCycleModel
                                .findOne({ urnNo: urnNo, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                                .sort({ cycleNo: -1 })
                                .exec()];
                        case 3:
                            cycle = _a.sent();
                            if (!cycle) {
                                throw new common_1.NotFoundException('No active renewal cycle found for this URN');
                            }
                            return [2 /*return*/, cycle];
                    }
                });
            });
        };
        RenewUrnStatusService_1.prototype.assertVendorOwnsUrn = function (urnNo, actorVendorOrManufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var context, actorId, owns;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, urnNo)];
                        case 1:
                            context = _a.sent();
                            actorId = actorVendorOrManufacturerId.trim();
                            owns = String(context.vendorId) === actorId ||
                                String(context.manufacturerId) === actorId;
                            if (!owns) {
                                throw new common_1.ForbiddenException('Authenticated user does not own this URN');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        RenewUrnStatusService_1.prototype.assertInRenewalFlow = function (urnNo, currentStatus) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (currentStatus < renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING &&
                        currentStatus !== renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED) {
                        throw new common_1.BadRequestException('URN is not in renewal workflow (expected urnStatus 12–17 or completed 11)');
                    }
                    return [2 /*return*/];
                });
            });
        };
        RenewUrnStatusService_1.prototype.assertProcessFormsReadyForSubmit = function (urnNo, cycle) {
            return __awaiter(this, void 0, void 0, function () {
                var certifiedCount, renewPayment, headerFilter, _a, manufacturing, waste, innovation, performance, missing, perfReports, perfFiles;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.productModel.countDocuments(__assign({ urnNo: urnNo }, (0, renew_eligible_product_util_1.matchRenewUrnStatusUpdateProducts)()))];
                        case 1:
                            certifiedCount = _c.sent();
                            if (certifiedCount === 0) {
                                throw new common_1.BadRequestException('No certified products on this URN — cannot submit renewal for review');
                            }
                            return [4 /*yield*/, this.paymentModel
                                    .findOne(__assign(__assign({}, (0, renew_cycle_scope_util_1.buildRenewPaymentFindFilter)(urnNo, cycle)), { paymentStatus: 2 }))
                                    .sort({ paymentId: -1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            renewPayment = _c.sent();
                            if (!renewPayment) {
                                throw new common_1.BadRequestException('Renewal payment must be approved before submitting process forms for review');
                            }
                            headerFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(urnNo, cycle);
                            return [4 /*yield*/, Promise.all([
                                    this.renewManufacturingModel.findOne(headerFilter).lean().exec(),
                                    this.renewWasteModel.findOne(headerFilter).lean().exec(),
                                    this.renewInnovationModel.findOne(headerFilter).lean().exec(),
                                    this.renewPerformanceModel
                                        .findOne({ urnNo: urnNo, renewalCycleId: cycle._id })
                                        .lean()
                                        .exec(),
                                ])];
                        case 3:
                            _a = _c.sent(), manufacturing = _a[0], waste = _a[1], innovation = _a[2], performance = _a[3];
                            missing = [];
                            if (!manufacturing) {
                                missing.push('Manufacturing Process');
                            }
                            if (!waste) {
                                missing.push('Waste Management');
                            }
                            if (!innovation) {
                                missing.push('Innovation');
                            }
                            perfReports = Array.isArray(performance === null || performance === void 0 ? void 0 : performance.testReports) && performance.testReports.length > 0;
                            perfFiles = Number((_b = performance === null || performance === void 0 ? void 0 : performance.testReportFiles) !== null && _b !== void 0 ? _b : 0) > 0;
                            if (!performance || (!perfReports && !perfFiles)) {
                                missing.push('Product Performance (test reports)');
                            }
                            if (missing.length > 0) {
                                throw new common_1.BadRequestException("Complete all renewal process sections before submit for review: ".concat(missing.join(', ')));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        RenewUrnStatusService_1.prototype.logRenewUrnStatusChange = function (urnNo, vendorId, manufacturerId, newStatus, responsibility, activity, nextActivity, nextResponsibility, nextActivitiesId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.activityLogService.logActivity({
                                vendor_id: vendorId,
                                manufacturer_id: manufacturerId,
                                urn_no: urnNo,
                                activities_id: newStatus,
                                activity: activity,
                                activity_status: newStatus,
                                responsibility: responsibility,
                                next_activity: nextActivity,
                                next_responsibility: nextResponsibility,
                                next_acitivities_id: nextActivitiesId,
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RenewUrnStatusService_1.prototype.isAdminRenewalCompletionRequest = function (actor, currentStatus, targetStatus) {
            if (actor !== 'admin') {
                return false;
            }
            if (targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED &&
                currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING) {
                return true;
            }
            if (targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING) {
                return (currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS ||
                    currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING);
            }
            return false;
        };
        RenewUrnStatusService_1.prototype.toStatusUpdateResult = function (completion, message) {
            if (message === void 0) { message = 'Renewal completed'; }
            return {
                urnNo: completion.urnNo,
                renewalCycleId: completion.renewalCycleId,
                renewCycleNo: completion.renewCycleNo,
                urnStatus: completion.urnStatus,
                productRenewStatus: completion.productRenewStatus,
                renewedDate: completion.renewedDate,
                validtillDate: completion.validtillDate,
                message: message,
            };
        };
        RenewUrnStatusService_1.prototype.finishRenewalCompletion = function (trimmedUrn, dto, actorContext, cycle, currentStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var completion, ownership, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!((_b = dto.renewalCycleId) === null || _b === void 0 ? void 0 : _b.trim())) {
                                throw new common_1.BadRequestException('renewalCycleId is required to complete renewal (submit for final review)');
                            }
                            if (!(currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.renewUrnTabReviewService.assertAdminQuickViewTransitionAllowed(trimmedUrn, cycle._id, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING)];
                        case 1:
                            _c.sent();
                            _c.label = 2;
                        case 2: return [4 /*yield*/, this.renewalOrchestrationService.completeRenewal(trimmedUrn, actorContext.userId, dto.renewalCycleId.trim())];
                        case 3:
                            completion = _c.sent();
                            _a = renew_common_util_1.renewOwnershipFields;
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, trimmedUrn)];
                        case 4:
                            ownership = _a.apply(void 0, [_c.sent()]);
                            this.lifecycleNotification
                                .notifyRenewalCompleted({
                                manufacturerId: String(ownership.manufacturerId),
                                urnNo: trimmedUrn,
                            })
                                .catch(function () { return undefined; });
                            return [2 /*return*/, this.toStatusUpdateResult(completion, 'Renewal completed — final review approved')];
                    }
                });
            });
        };
        RenewUrnStatusService_1.prototype.updateRenewUrnStatus = function (dto, actorContext) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, targetStatus, cycle, sampleProduct, currentStatus, productRenewStatus, ownership, _a, now, cycleId, renewPayment, paymentId, userObjectId, session, error_1;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            trimmedUrn = dto.urnNo.trim();
                            if (dto.updateStatusType !== 'urn_status') {
                                throw new common_1.BadRequestException('updateStatusType must be urn_status');
                            }
                            targetStatus = Number(dto.updateStatusTo);
                            return [4 /*yield*/, this.resolveRenewalCycle(trimmedUrn, dto.renewalCycleId)];
                        case 1:
                            cycle = _e.sent();
                            return [4 /*yield*/, this.productModel
                                    .findOne(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewUrnStatusUpdateProducts)()))
                                    .select('urnStatus vendorId manufacturerId productRenewStatus')
                                    .lean()
                                    .exec()];
                        case 2:
                            sampleProduct = _e.sent();
                            if (!sampleProduct) {
                                throw new common_1.NotFoundException("No certified products found for URN ".concat(trimmedUrn));
                            }
                            currentStatus = Number((_b = sampleProduct.urnStatus) !== null && _b !== void 0 ? _b : 0);
                            productRenewStatus = Number((_c = sampleProduct.productRenewStatus) !== null && _c !== void 0 ? _c : 0);
                            return [4 /*yield*/, this.assertInRenewalFlow(trimmedUrn, currentStatus)];
                        case 3:
                            _e.sent();
                            if (currentStatus === targetStatus) {
                                if (this.isAdminRenewalCompletionRequest(actorContext.actor, currentStatus, targetStatus) &&
                                    productRenewStatus !== renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.RENEWED) {
                                    return [2 /*return*/, this.finishRenewalCompletion(trimmedUrn, dto, actorContext, cycle, currentStatus)];
                                }
                                return [2 /*return*/, {
                                        urnNo: trimmedUrn,
                                        urnStatus: currentStatus,
                                        renewalCycleId: String(cycle._id),
                                        message: 'URN status unchanged',
                                    }];
                            }
                            if (!(actorContext.actor === 'vendor')) return [3 /*break*/, 5];
                            if (!actorContext.vendorOrManufacturerId) {
                                throw new common_1.ForbiddenException('Vendor organization ID not found in token');
                            }
                            return [4 /*yield*/, this.assertVendorOwnsUrn(trimmedUrn, actorContext.vendorOrManufacturerId)];
                        case 4:
                            _e.sent();
                            (0, renew_urn_status_transitions_util_1.assertVendorCannotSetRenewStatus)(targetStatus);
                            _e.label = 5;
                        case 5:
                            (0, renew_urn_status_transitions_util_1.assertRenewUrnStatusTransition)(actorContext.actor, currentStatus, targetStatus);
                            if (!(actorContext.actor === 'admin' &&
                                currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS &&
                                targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.renewUrnTabReviewService.assertAdminQuickViewTransitionAllowed(trimmedUrn, cycle._id, targetStatus)];
                        case 6:
                            _e.sent();
                            _e.label = 7;
                        case 7:
                            if (!(targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS &&
                                (currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED ||
                                    currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING))) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.assertProcessFormsReadyForSubmit(trimmedUrn, cycle)];
                        case 8:
                            _e.sent();
                            _e.label = 9;
                        case 9:
                            if (this.isAdminRenewalCompletionRequest(actorContext.actor, currentStatus, targetStatus)) {
                                return [2 /*return*/, this.finishRenewalCompletion(trimmedUrn, dto, actorContext, cycle, currentStatus)];
                            }
                            _a = renew_common_util_1.renewOwnershipFields;
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, trimmedUrn)];
                        case 10:
                            ownership = _a.apply(void 0, [_e.sent()]);
                            now = new Date();
                            return [4 /*yield*/, this.productModel.updateMany(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewUrnStatusUpdateProducts)()), { $set: { urnStatus: targetStatus, updatedDate: now } })];
                        case 11:
                            _e.sent();
                            if (!(targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS)) return [3 /*break*/, 16];
                            cycleId = cycle._id;
                            return [4 /*yield*/, this.renewUrnTabReviewService.ensurePendingReviewsForCycle(trimmedUrn, cycleId)];
                        case 12:
                            _e.sent();
                            if (!(currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING)) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.renewUrnTabReviewService.resetRejectedReviewsToPendingForCycle(trimmedUrn, cycleId)];
                        case 13:
                            _e.sent();
                            _e.label = 14;
                        case 14: return [4 /*yield*/, this.logRenewUrnStatusChange(trimmedUrn, ownership.vendorId, ownership.manufacturerId, targetStatus, 'Vendor', renewal_activity_constants_1.RENEWAL_ACTIVITY.PROCESS_FORMS_SUBMITTED, renewal_activity_constants_1.RENEWAL_NEXT_ACTIVITY.ADMIN_REVIEW_FORMS, 'Admin', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS)];
                        case 15:
                            _e.sent();
                            this.lifecycleNotification
                                .notifyRenewalSubmitted({
                                manufacturerId: String(ownership.manufacturerId),
                                urnNo: trimmedUrn,
                            })
                                .catch(function () { return undefined; });
                            return [3 /*break*/, 29];
                        case 16:
                            if (!(targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING)) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.logRenewUrnStatusChange(trimmedUrn, ownership.vendorId, ownership.manufacturerId, targetStatus, 'Admin', 'Renewal process forms sent back to vendor', renewal_activity_constants_1.RENEWAL_NEXT_ACTIVITY.VENDOR_COMPLETE_FORMS, 'Vendor', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING)];
                        case 17:
                            _e.sent();
                            this.lifecycleNotification
                                .notifyRenewalDecision({
                                manufacturerId: String(ownership.manufacturerId),
                                urnNo: trimmedUrn,
                                decision: 'sent_back',
                            })
                                .catch(function () { return undefined; });
                            return [3 /*break*/, 29];
                        case 18:
                            if (!(targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED &&
                                currentStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED)) return [3 /*break*/, 29];
                            return [4 /*yield*/, this.paymentModel
                                    .findOne((0, renew_cycle_scope_util_1.buildRenewPaymentFindFilter)(trimmedUrn, cycle))
                                    .sort({ paymentId: -1 })
                                    .exec()];
                        case 19:
                            renewPayment = _e.sent();
                            paymentId = (_d = cycle.paymentId) !== null && _d !== void 0 ? _d : renewPayment === null || renewPayment === void 0 ? void 0 : renewPayment.paymentId;
                            if (!paymentId) {
                                throw new common_1.BadRequestException('Renewal payment record not found — cannot approve payment for this URN');
                            }
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(actorContext.userId, 'userId');
                            return [4 /*yield*/, this.connection.startSession()];
                        case 20:
                            session = _e.sent();
                            session.startTransaction();
                            _e.label = 21;
                        case 21:
                            _e.trys.push([21, 24, 26, 27]);
                            return [4 /*yield*/, this.renewalOrchestrationService.onRenewPaymentApproved({
                                    urnNo: trimmedUrn,
                                    paymentId: paymentId,
                                    renewalCycleId: String(cycle._id),
                                    vendorId: ownership.vendorId,
                                    userId: userObjectId,
                                    session: session,
                                })];
                        case 22:
                            _e.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 23:
                            _e.sent();
                            return [3 /*break*/, 27];
                        case 24:
                            error_1 = _e.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 25:
                            _e.sent();
                            throw error_1;
                        case 26:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 27: return [4 /*yield*/, this.logRenewUrnStatusChange(trimmedUrn, ownership.vendorId, ownership.manufacturerId, targetStatus, 'Admin', renewal_activity_constants_1.RENEWAL_ACTIVITY.PAYMENT_APPROVED, renewal_activity_constants_1.RENEWAL_NEXT_ACTIVITY.VENDOR_COMPLETE_FORMS, 'Vendor', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED)];
                        case 28:
                            _e.sent();
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    urnStatus: targetStatus,
                                    renewalCycleId: String(cycle._id),
                                    message: 'URN status updated',
                                }];
                        case 29: return [2 /*return*/, {
                                urnNo: trimmedUrn,
                                urnStatus: targetStatus,
                                renewalCycleId: String(cycle._id),
                                message: 'URN status updated',
                            }];
                    }
                });
            });
        };
        return RenewUrnStatusService_1;
    }());
    __setFunctionName(_classThis, "RenewUrnStatusService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewUrnStatusService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewUrnStatusService = _classThis;
}();
exports.RenewUrnStatusService = RenewUrnStatusService;
