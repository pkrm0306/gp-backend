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
exports.RenewAdminTestValidityService = void 0;
var common_1 = require("@nestjs/common");
var certification_dates_util_1 = require("../../product-registration/helpers/certification-dates.util");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var renewal_activity_constants_1 = require("../constants/renewal-activity.constants");
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
var mongo_session_util_1 = require("../helpers/mongo-session.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var RenewAdminTestValidityService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewAdminTestValidityService = _classThis = /** @class */ (function () {
        function RenewAdminTestValidityService_1(productModel, connection, renewalCycleService, activityLogService) {
            this.productModel = productModel;
            this.connection = connection;
            this.renewalCycleService = renewalCycleService;
            this.activityLogService = activityLogService;
            this.logger = new common_1.Logger(RenewAdminTestValidityService.name);
        }
        RenewAdminTestValidityService_1.prototype.applyTestValidity = function (dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var startNewCycle, urnNo, parsed, normalizedDate, validTillDate, notifyDates, now, userObjectId, context, ownership, certifiedCount, newCycle, logError_1, sample, urnStatus, productRenewStatus, error_1;
                var _this = this;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            startNewCycle = dto.startNewRenewalCycle !== false;
                            if (!startNewCycle) {
                                throw new common_1.BadRequestException('startNewRenewalCycle must be true for test renewal; use renew-validity without a new cycle for validity-only updates');
                            }
                            urnNo = String((_a = dto.urnNo) !== null && _a !== void 0 ? _a : '').trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            parsed = new Date(dto.validTillDate);
                            if (Number.isNaN(parsed.getTime())) {
                                throw new common_1.BadRequestException('validTillDate must be a valid date (YYYY-MM-DD or ISO)');
                            }
                            normalizedDate = parsed.toISOString().slice(0, 10);
                            validTillDate = new Date("".concat(normalizedDate, "T00:00:00.000Z"));
                            notifyDates = (0, certification_dates_util_1.computeNotifyDates)(validTillDate);
                            now = new Date();
                            userObjectId = (0, renew_common_util_1.toRenewObjectId)(userId, 'userId');
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, urnNo)];
                        case 1:
                            context = _e.sent();
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            return [4 /*yield*/, this.productModel.countDocuments(__assign({ urnNo: urnNo }, (0, renew_eligible_product_util_1.matchRenewUrnStatusUpdateProducts)()))];
                        case 2:
                            certifiedCount = _e.sent();
                            if (certifiedCount === 0) {
                                throw new common_1.NotFoundException("No certified products found for URN ".concat(urnNo, " (rejected EOIs are excluded)"));
                            }
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 10, , 11]);
                            return [4 /*yield*/, (0, mongo_session_util_1.runInTransactionIfSupported)(this.connection, function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var cycle;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.renewalCycleService.closeInProgressAndCreateNextCycle({
                                                    urnNo: urnNo,
                                                    vendorId: ownership.vendorId,
                                                    manufacturerId: ownership.manufacturerId,
                                                    urnStatusAtStart: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                                                    userId: userObjectId,
                                                    session: session,
                                                })];
                                            case 1:
                                                cycle = _a.sent();
                                                return [4 /*yield*/, this.productModel.updateMany(__assign({ urnNo: urnNo }, (0, renew_eligible_product_util_1.matchRenewUrnStatusUpdateProducts)()), {
                                                        $set: {
                                                            validtillDate: validTillDate,
                                                            urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                                                            productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.NOT_RENEWED,
                                                            renewCycleNo: cycle.cycleNo,
                                                            firstNotifyDate: notifyDates.firstNotifyDate,
                                                            secondNotifyDate: notifyDates.secondNotifyDate,
                                                            thirdNotifyDate: notifyDates.thirdNotifyDate,
                                                            updatedDate: now,
                                                        },
                                                        $unset: { renewedDate: '' },
                                                    }, session ? { session: session } : {})];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/, cycle];
                                        }
                                    });
                                }); })];
                        case 4:
                            newCycle = _e.sent();
                            _e.label = 5;
                        case 5:
                            _e.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.activityLogService.logActivity({
                                    vendor_id: ownership.vendorId,
                                    manufacturer_id: ownership.manufacturerId,
                                    urn_no: urnNo,
                                    activities_id: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                                    activity: 'Test renewal cycle started',
                                    activity_status: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                                    responsibility: 'Admin',
                                    next_activity: renewal_activity_constants_1.RENEWAL_NEXT_ACTIVITY.VENDOR_SUBMIT_PAYMENT,
                                    next_responsibility: 'Vendor',
                                })];
                        case 6:
                            _e.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            logError_1 = _e.sent();
                            this.logger.warn("Activity log failed after test renewal for URN ".concat(urnNo), logError_1 instanceof Error ? logError_1.stack : String(logError_1));
                            return [3 /*break*/, 8];
                        case 8: return [4 /*yield*/, this.productModel
                                .findOne(__assign({ urnNo: urnNo }, (0, renew_eligible_product_util_1.matchRenewUrnStatusUpdateProducts)()))
                                .select('urnStatus productRenewStatus renewCycleNo')
                                .lean()
                                .exec()];
                        case 9:
                            sample = _e.sent();
                            urnStatus = Number((_b = sample === null || sample === void 0 ? void 0 : sample.urnStatus) !== null && _b !== void 0 ? _b : renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING);
                            productRenewStatus = Number((_c = sample === null || sample === void 0 ? void 0 : sample.productRenewStatus) !== null && _c !== void 0 ? _c : renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.NOT_RENEWED);
                            return [2 /*return*/, {
                                    success: true,
                                    urnNo: urnNo,
                                    validTillDate: normalizedDate,
                                    urnStatus: urnStatus,
                                    productRenewStatus: productRenewStatus,
                                    renewCycleNo: newCycle.cycleNo,
                                    renewContext: this.buildRenewContext(urnNo, newCycle, urnStatus, productRenewStatus, (_d = sample === null || sample === void 0 ? void 0 : sample.renewCycleNo) !== null && _d !== void 0 ? _d : newCycle.cycleNo, ownership),
                                }];
                        case 10:
                            error_1 = _e.sent();
                            if (error_1 instanceof common_1.HttpException) {
                                throw error_1;
                            }
                            this.logger.error("Test renewal validity failed for URN ".concat(urnNo), error_1 instanceof Error ? error_1.stack : String(error_1));
                            throw new common_1.InternalServerErrorException(error_1 instanceof Error
                                ? error_1.message || 'Failed to apply test renewal validity'
                                : 'Failed to apply test renewal validity');
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        RenewAdminTestValidityService_1.prototype.buildRenewContext = function (urnNo, cycle, urnStatus, productRenewStatus, renewCycleNo, ownership) {
            var _a;
            var cyclePayload = {
                id: String(cycle._id),
                cycleNo: cycle.cycleNo,
                status: cycle.status,
                paymentId: (_a = cycle.paymentId) !== null && _a !== void 0 ? _a : null,
            };
            return {
                urnNo: urnNo,
                urnStatus: urnStatus,
                productRenewStatus: productRenewStatus,
                renewCycleNo: renewCycleNo,
                renewalCycleId: String(cycle._id),
                vendorId: String(ownership.vendorId),
                manufacturerId: String(ownership.manufacturerId),
                activeRenewalCycle: cyclePayload,
                renewalCycle: cyclePayload,
            };
        };
        return RenewAdminTestValidityService_1;
    }());
    __setFunctionName(_classThis, "RenewAdminTestValidityService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewAdminTestValidityService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewAdminTestValidityService = _classThis;
}();
exports.RenewAdminTestValidityService = RenewAdminTestValidityService;
