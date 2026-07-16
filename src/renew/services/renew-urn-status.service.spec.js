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
var renew_urn_status_service_1 = require("./renew-urn-status.service");
var product_schema_1 = require("../../product-registration/schemas/product.schema");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var payment_details_schema_1 = require("../../payments/schemas/payment-details.schema");
var process_renew_manufacturing_schema_1 = require("../schemas/process-renew-manufacturing.schema");
var process_renew_waste_management_schema_1 = require("../schemas/process-renew-waste-management.schema");
var process_renew_innovation_schema_1 = require("../schemas/process-renew-innovation.schema");
var process_renew_product_performance_schema_1 = require("../schemas/process-renew-product-performance.schema");
var activity_log_service_1 = require("../../activity-log/activity-log.service");
var renewal_orchestration_service_1 = require("./renewal-orchestration.service");
var renew_urn_tab_review_service_1 = require("./renew-urn-tab-review.service");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
describe('RenewUrnStatusService — submit for final review (17)', function () {
    var service;
    var completeRenewal = jest.fn();
    var cycleId = '6a1edd713ec5008b997aca94';
    var urnNo = 'URN-20260528142848';
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    completeRenewal.mockReset();
                    completeRenewal.mockResolvedValue({
                        urnNo: urnNo,
                        renewalCycleId: cycleId,
                        renewCycleNo: 1,
                        urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED,
                        productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.RENEWED,
                        renewedDate: new Date('2026-06-02'),
                        validtillDate: new Date('2028-12-31'),
                    });
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                renew_urn_status_service_1.RenewUrnStatusService,
                                {
                                    provide: (0, mongoose_1.getModelToken)(product_schema_1.Product.name),
                                    useValue: {
                                        findOne: jest.fn().mockReturnValue({
                                            select: jest.fn().mockReturnValue({
                                                lean: jest.fn().mockReturnValue({
                                                    exec: jest.fn().mockResolvedValue({
                                                        urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
                                                        productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.IN_PROGRESS,
                                                        vendorId: 'v1',
                                                        manufacturerId: 'm1',
                                                    }),
                                                }),
                                            }),
                                        }),
                                        updateMany: jest.fn(),
                                    },
                                },
                                {
                                    provide: (0, mongoose_1.getModelToken)(renewal_cycle_schema_1.RenewalCycle.name),
                                    useValue: {
                                        findById: jest.fn().mockReturnValue({
                                            exec: jest.fn().mockResolvedValue({ _id: cycleId, urnNo: urnNo }),
                                        }),
                                        findOne: jest.fn().mockReturnValue({
                                            sort: jest.fn().mockReturnValue({
                                                exec: jest.fn().mockResolvedValue({ _id: cycleId, urnNo: urnNo }),
                                            }),
                                        }),
                                    },
                                },
                                { provide: (0, mongoose_1.getModelToken)(payment_details_schema_1.PaymentDetails.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(process_renew_manufacturing_schema_1.ProcessRenewManufacturing.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(process_renew_waste_management_schema_1.ProcessRenewWasteManagement.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(process_renew_innovation_schema_1.ProcessRenewInnovation.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(process_renew_product_performance_schema_1.ProcessRenewProductPerformance.name), useValue: {} },
                                {
                                    provide: (0, mongoose_1.getConnectionToken)(),
                                    useValue: { startSession: jest.fn() },
                                },
                                { provide: activity_log_service_1.ActivityLogService, useValue: { logActivity: jest.fn() } },
                                {
                                    provide: renewal_orchestration_service_1.RenewalOrchestrationService,
                                    useValue: { completeRenewal: completeRenewal },
                                },
                                {
                                    provide: renew_urn_tab_review_service_1.RenewUrnTabReviewService,
                                    useValue: {
                                        assertAdminQuickViewTransitionAllowed: jest.fn().mockResolvedValue(undefined),
                                    },
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(renew_urn_status_service_1.RenewUrnStatusService);
                    return [2 /*return*/];
            }
        });
    }); });
    it('completes renewal on admin 15→17 without persisting urn_status 17', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, productModel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.updateRenewUrnStatus({
                        urnNo: urnNo,
                        renewalCycleId: cycleId,
                        updateStatusType: 'urn_status',
                        updateStatusTo: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
                    }, { actor: 'admin', userId: 'admin-1' })];
                case 1:
                    result = _a.sent();
                    expect(completeRenewal).toHaveBeenCalledWith(urnNo, 'admin-1', cycleId);
                    productModel = service
                        .productModel;
                    expect(productModel.updateMany).not.toHaveBeenCalled();
                    expect(result.urnStatus).toBe(renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED);
                    expect(result.productRenewStatus).toBe(renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.RENEWED);
                    expect(result.renewalCycleId).toBe(cycleId);
                    expect(result.message).toContain('Renewal completed');
                    return [2 /*return*/];
            }
        });
    }); });
    it('requires renewalCycleId for completion', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(service.updateRenewUrnStatus({
                        urnNo: urnNo,
                        updateStatusType: 'urn_status',
                        updateStatusTo: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
                    }, { actor: 'admin', userId: 'admin-1' })).rejects.toThrow(/renewalCycleId is required/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
