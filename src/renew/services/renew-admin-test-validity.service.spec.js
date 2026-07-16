"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@nestjs/testing");
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var common_1 = require("@nestjs/common");
var renew_admin_test_validity_service_1 = require("./renew-admin-test-validity.service");
var product_schema_1 = require("../../product-registration/schemas/product.schema");
var renewal_cycle_service_1 = require("./renewal-cycle.service");
var activity_log_service_1 = require("../../activity-log/activity-log.service");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
describe('RenewAdminTestValidityService', function () {
    var service;
    var closeInProgressAndCreateNextCycle = jest.fn();
    var logActivity = jest.fn();
    var urnNo = 'URN-20260528142848';
    var vendorId = new mongoose_2.Types.ObjectId();
    var manufacturerId = new mongoose_2.Types.ObjectId();
    var newCycleId = new mongoose_2.Types.ObjectId();
    var countDocuments;
    var updateMany;
    var findOneLean;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    closeInProgressAndCreateNextCycle.mockReset();
                    logActivity.mockReset().mockResolvedValue(undefined);
                    closeInProgressAndCreateNextCycle.mockResolvedValue({
                        _id: newCycleId,
                        cycleNo: 2,
                        status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                        paymentId: null,
                    });
                    countDocuments = jest.fn().mockResolvedValue(1);
                    updateMany = jest.fn().mockResolvedValue({ modifiedCount: 1 });
                    findOneLean = jest
                        .fn()
                        .mockResolvedValueOnce({
                        vendorId: vendorId,
                        manufacturerId: manufacturerId,
                    })
                        .mockResolvedValue({
                        urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                        productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.NOT_RENEWED,
                        renewCycleNo: 2,
                    });
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                renew_admin_test_validity_service_1.RenewAdminTestValidityService,
                                {
                                    provide: (0, mongoose_1.getModelToken)(product_schema_1.Product.name),
                                    useValue: {
                                        countDocuments: countDocuments,
                                        updateMany: updateMany,
                                        findOne: jest.fn().mockReturnValue({
                                            select: jest.fn().mockReturnValue({
                                                lean: jest.fn().mockReturnValue({
                                                    exec: findOneLean,
                                                }),
                                            }),
                                        }),
                                    },
                                },
                                {
                                    provide: (0, mongoose_1.getConnectionToken)(),
                                    useValue: {
                                        startSession: jest.fn().mockResolvedValue({
                                            startTransaction: jest.fn(function () {
                                                throw new Error('Transaction numbers are only allowed on a replica set member or mongos');
                                            }),
                                            commitTransaction: jest.fn(),
                                            abortTransaction: jest.fn().mockResolvedValue(undefined),
                                            endSession: jest.fn(),
                                        }),
                                    },
                                },
                                {
                                    provide: renewal_cycle_service_1.RenewalCycleService,
                                    useValue: { closeInProgressAndCreateNextCycle: closeInProgressAndCreateNextCycle },
                                },
                                {
                                    provide: activity_log_service_1.ActivityLogService,
                                    useValue: { logActivity: logActivity },
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(renew_admin_test_validity_service_1.RenewAdminTestValidityService);
                    return [2 /*return*/];
            }
        });
    }); });
    it('starts a new cycle, sets urn_status 12 and product_renew_status 0', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.applyTestValidity({
                        urnNo: urnNo,
                        validTillDate: '2026-03-01',
                        startNewRenewalCycle: true,
                    }, String(new mongoose_2.Types.ObjectId()))];
                case 1:
                    result = _a.sent();
                    expect(closeInProgressAndCreateNextCycle).toHaveBeenCalledWith(expect.objectContaining({
                        urnNo: urnNo,
                        urnStatusAtStart: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                    }));
                    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({ urnNo: urnNo }), expect.objectContaining({
                        $set: expect.objectContaining({
                            urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
                            productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.NOT_RENEWED,
                            renewCycleNo: 2,
                        }),
                        $unset: { renewedDate: '' },
                    }), expect.any(Object));
                    expect(result.success).toBe(true);
                    expect(result.urnStatus).toBe(12);
                    expect(result.productRenewStatus).toBe(0);
                    expect(result.renewCycleNo).toBe(2);
                    expect(result.renewContext).toMatchObject({
                        renewalCycleId: String(newCycleId),
                        urnStatus: 12,
                        productRenewStatus: 0,
                        activeRenewalCycle: {
                            id: String(newCycleId),
                            cycleNo: 2,
                            status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                        },
                    });
                    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ activity: 'Test renewal cycle started' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects when startNewRenewalCycle is false', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(service.applyTestValidity({ urnNo: urnNo, validTillDate: '2026-03-01', startNewRenewalCycle: false }, 'admin-id')).rejects.toThrow(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    expect(closeInProgressAndCreateNextCycle).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
