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
var common_1 = require("@nestjs/common");
var testing_1 = require("@nestjs/testing");
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var product_schema_1 = require("../../schemas/product.schema");
var product_plant_schema_1 = require("../../schemas/product-plant.schema");
var plant_merge_audit_schema_1 = require("../schemas/plant-merge-audit.schema");
var plant_merge_urn_execute_service_1 = require("./plant-merge-urn-execute.service");
var plant_merge_urn_validation_service_1 = require("./plant-merge-urn-validation.service");
var plant_merge_urn_preview_service_1 = require("./plant-merge-urn-preview.service");
var sequence_helper_1 = require("../../helpers/sequence.helper");
var activity_log_service_1 = require("../../../activity-log/activity-log.service");
var redis_service_1 = require("../../../common/redis/redis.service");
var lifecycle_notification_service_1 = require("../../../notifications/lifecycle-notification.service");
var plant_merge_urn_preview_constants_1 = require("../plant-merge-urn-preview.constants");
var plant_merge_constants_1 = require("../plant-merge.constants");
jest.mock('../../../renew/helpers/mongo-session.util', function () { return ({
    runInTransactionIfSupported: jest.fn(function (_connection, work) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, work({})];
    }); }); }),
}); });
var mongo_session_util_1 = require("../../../renew/helpers/mongo-session.util");
jest.mock('../helpers/copy-product-plants.util', function () { return ({
    copyActivePlantsToTargetProduct: jest.fn(),
}); });
var copy_product_plants_util_1 = require("../helpers/copy-product-plants.util");
describe('PlantMergeUrnExecuteService', function () {
    var service;
    var sourceProductId = new mongoose_2.Types.ObjectId();
    var targetProductId = new mongoose_2.Types.ObjectId();
    var copiedPlantId = new mongoose_2.Types.ObjectId();
    var sourcePlantId = new mongoose_2.Types.ObjectId();
    var vendorId = new mongoose_2.Types.ObjectId();
    var manufacturerId = new mongoose_2.Types.ObjectId();
    var categoryId = new mongoose_2.Types.ObjectId();
    var adminUserId = new mongoose_2.Types.ObjectId().toHexString();
    var productModel = {
        findOne: jest.fn(),
        updateOne: jest.fn(),
    };
    var productPlantModel = {
        countDocuments: jest.fn(),
        create: jest.fn(),
    };
    var plantMergeAuditModel = {
        create: jest.fn(),
    };
    var plantMergeUrnValidationService = {
        validate: jest.fn(),
    };
    var plantMergeUrnPreviewService = {
        previewBySourceUrn: jest.fn(),
    };
    var sequenceHelper = {
        reserveSequenceValues: jest.fn(),
        getProductPlantId: jest.fn(),
    };
    var redisService = {
        buildKey: jest.fn(function () {
            var parts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parts[_i] = arguments[_i];
            }
            return parts.join(':');
        }),
        deleteByPattern: jest.fn().mockResolvedValue(undefined),
    };
    var activityLogService = {
        logActivity: jest.fn().mockResolvedValue(undefined),
    };
    var sourceProduct = {
        _id: sourceProductId,
        productId: 101,
        productName: 'Board',
        eoiNo: 'GP100',
        urnNo: 'URN-SOURCE',
        vendorId: vendorId,
        manufacturerId: manufacturerId,
        categoryId: categoryId,
    };
    var targetProduct = {
        _id: targetProductId,
        productId: 50,
        productName: 'Board',
        eoiNo: 'GP001',
        urnNo: 'URN-TARGET',
        vendorId: vendorId,
        manufacturerId: manufacturerId,
        categoryId: categoryId,
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    plantMergeUrnValidationService.validate.mockResolvedValue({
                        success: true,
                        canMerge: true,
                        sourceUrnNo: 'URN-SOURCE',
                        targetUrnNo: 'URN-TARGET',
                        sourceEoiNo: 'GP100',
                        targetEoiNo: 'GP001',
                        productName: 'Board',
                        blockers: [],
                    });
                    productModel.findOne
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(sourceProduct),
                    })
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(targetProduct),
                    });
                    productPlantModel.countDocuments.mockResolvedValue(2);
                    productModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
                    copy_product_plants_util_1.copyActivePlantsToTargetProduct.mockResolvedValue({
                        sourcePlantIds: [sourcePlantId],
                        sourceProductPlantIds: [9001],
                        copiedPlantIds: [copiedPlantId],
                        copiedProductPlantIds: [9002],
                        skippedSourcePlantIds: [],
                        skippedProductPlantIds: [],
                        manufacturingUnitsSkipped: [],
                    });
                    plantMergeAuditModel.create.mockResolvedValue([
                        { _id: new mongoose_2.Types.ObjectId() },
                    ]);
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                plant_merge_urn_execute_service_1.PlantMergeUrnExecuteService,
                                { provide: (0, mongoose_1.getModelToken)(product_schema_1.Product.name), useValue: productModel },
                                { provide: (0, mongoose_1.getModelToken)(product_plant_schema_1.ProductPlant.name), useValue: productPlantModel },
                                {
                                    provide: (0, mongoose_1.getModelToken)(plant_merge_audit_schema_1.PlantMergeAudit.name),
                                    useValue: plantMergeAuditModel,
                                },
                                { provide: (0, mongoose_1.getConnectionToken)(), useValue: {} },
                                {
                                    provide: plant_merge_urn_validation_service_1.PlantMergeUrnValidationService,
                                    useValue: plantMergeUrnValidationService,
                                },
                                {
                                    provide: plant_merge_urn_preview_service_1.PlantMergeUrnPreviewService,
                                    useValue: plantMergeUrnPreviewService,
                                },
                                { provide: sequence_helper_1.SequenceHelper, useValue: sequenceHelper },
                                { provide: activity_log_service_1.ActivityLogService, useValue: activityLogService },
                                { provide: redis_service_1.RedisService, useValue: redisService },
                                {
                                    provide: lifecycle_notification_service_1.LifecycleNotificationService,
                                    useValue: {
                                        notifyPlantMerged: jest.fn().mockResolvedValue(undefined),
                                    },
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(plant_merge_urn_execute_service_1.PlantMergeUrnExecuteService);
                    return [2 /*return*/];
            }
        });
    }); });
    it('executes explicit pair: copies plants, writes audit, does not touch source product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, service.execute({
                        sourceUrnNo: 'URN-SOURCE',
                        pairs: [
                            {
                                sourceEoiNo: 'GP100',
                                targetUrnNo: 'URN-TARGET',
                                targetEoiNo: 'GP001',
                            },
                        ],
                    }, adminUserId)];
                case 1:
                    result = _d.sent();
                    expect(plantMergeUrnValidationService.validate).toHaveBeenCalledWith({
                        sourceUrnNo: 'URN-SOURCE',
                        targetUrnNo: 'URN-TARGET',
                        sourceEoiNo: 'GP100',
                        targetEoiNo: 'GP001',
                    });
                    expect(copy_product_plants_util_1.copyActivePlantsToTargetProduct).toHaveBeenCalledWith(productPlantModel, sequenceHelper, sourceProductId, expect.objectContaining({
                        _id: targetProductId,
                        urnNo: 'URN-TARGET',
                        eoiNo: 'GP001',
                    }), expect.any(Date), expect.any(Object));
                    expect(plantMergeAuditModel.create).toHaveBeenCalledWith([
                        expect.objectContaining({
                            productId: sourceProductId,
                            targetProductId: targetProductId,
                            urnNo: 'URN-SOURCE',
                            eoiNo: 'GP100',
                            targetUrnNo: 'URN-TARGET',
                            targetEoiNo: 'GP001',
                            mergeStrategy: plant_merge_constants_1.PLANT_MERGE_STRATEGY_URN_COPY,
                            mergeStatus: plant_merge_constants_1.PLANT_MERGE_STATUS.COMPLETED,
                            sourcePlantIds: [sourcePlantId],
                            copiedPlantIds: [copiedPlantId],
                            manufacturingUnitsSkipped: [],
                        }),
                    ], { session: expect.any(Object) });
                    expect(result.pairsExecuted).toBe(1);
                    expect((_a = result.results[0]) === null || _a === void 0 ? void 0 : _a.plantsCopied).toBe(1);
                    expect((_b = result.results[0]) === null || _b === void 0 ? void 0 : _b.plantsSkipped).toBe(0);
                    expect((_c = result.results[0]) === null || _c === void 0 ? void 0 : _c.mergeStatus).toBe(plant_merge_constants_1.PLANT_MERGE_STATUS.COMPLETED);
                    expect(activityLogService.logActivity).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('auto-resolves READY preview pairs when pairs omitted', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plantMergeUrnPreviewService.previewBySourceUrn.mockResolvedValue({
                        success: true,
                        sourceUrnNo: 'URN-SOURCE',
                        items: [
                            {
                                productName: 'Board',
                                sourceEoi: 'GP100',
                                sourceUrn: 'URN-SOURCE',
                                targetUrn: 'URN-TARGET',
                                targetEoi: 'GP001',
                                mergeStatus: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.READY,
                                failureReason: null,
                                sourcePlantCount: 2,
                            },
                        ],
                        summary: { total: 1, ready: 1, blocked: 0, noTarget: 0 },
                    });
                    productModel.findOne.mockReset();
                    productModel.findOne
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(sourceProduct),
                    })
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(targetProduct),
                    });
                    return [4 /*yield*/, service.execute({ sourceUrnNo: 'URN-SOURCE' }, adminUserId)];
                case 1:
                    _a.sent();
                    expect(plantMergeUrnPreviewService.previewBySourceUrn).toHaveBeenCalledWith('URN-SOURCE');
                    expect(copy_product_plants_util_1.copyActivePlantsToTargetProduct).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects when validation fails before transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plantMergeUrnValidationService.validate.mockResolvedValue({
                        success: true,
                        canMerge: false,
                        blockers: [{ code: 'DUPLICATE_MERGE', message: 'Already merged' }],
                    });
                    return [4 /*yield*/, expect(service.execute({
                            sourceUrnNo: 'URN-SOURCE',
                            pairs: [
                                {
                                    sourceEoiNo: 'GP100',
                                    targetUrnNo: 'URN-TARGET',
                                    targetEoiNo: 'GP001',
                                },
                            ],
                        }, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    expect(copy_product_plants_util_1.copyActivePlantsToTargetProduct).not.toHaveBeenCalled();
                    expect(plantMergeAuditModel.create).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects when no eligible pairs exist', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plantMergeUrnPreviewService.previewBySourceUrn.mockResolvedValue({
                        success: true,
                        sourceUrnNo: 'URN-SOURCE',
                        items: [],
                        summary: { total: 0, ready: 0, blocked: 0, noTarget: 0 },
                    });
                    return [4 /*yield*/, expect(service.execute({ sourceUrnNo: 'URN-SOURCE' }, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('executes only READY pairs when preview has partial matches', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plantMergeUrnPreviewService.previewBySourceUrn.mockResolvedValue({
                        success: true,
                        sourceUrnNo: 'URN-SOURCE',
                        items: [
                            {
                                productName: 'Board',
                                sourceEoi: 'GP100',
                                sourceUrn: 'URN-SOURCE',
                                targetUrn: 'URN-TARGET',
                                targetEoi: 'GP001',
                                mergeStatus: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.READY,
                                failureReason: null,
                                sourcePlantCount: 2,
                            },
                            {
                                productName: 'Panel',
                                sourceEoi: 'GP101',
                                sourceUrn: 'URN-SOURCE',
                                targetUrn: null,
                                targetEoi: null,
                                mergeStatus: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET,
                                failureReason: 'No match',
                                sourcePlantCount: 1,
                            },
                        ],
                        summary: { total: 2, ready: 1, blocked: 0, noTarget: 1 },
                    });
                    productModel.findOne.mockReset();
                    productModel.findOne
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(sourceProduct),
                    })
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(targetProduct),
                    });
                    return [4 /*yield*/, service.execute({ sourceUrnNo: 'URN-SOURCE' }, adminUserId)];
                case 1:
                    result = _a.sent();
                    expect(result.pairsExecuted).toBe(1);
                    expect(copy_product_plants_util_1.copyActivePlantsToTargetProduct).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('records skipped duplicate plants in audit and result', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    copy_product_plants_util_1.copyActivePlantsToTargetProduct.mockResolvedValue({
                        sourcePlantIds: [],
                        sourceProductPlantIds: [],
                        copiedPlantIds: [],
                        copiedProductPlantIds: [],
                        skippedSourcePlantIds: [sourcePlantId],
                        skippedProductPlantIds: [9001],
                        manufacturingUnitsSkipped: ['Mumbai'],
                    });
                    return [4 /*yield*/, service.execute({
                            sourceUrnNo: 'URN-SOURCE',
                            pairs: [
                                {
                                    sourceEoiNo: 'GP100',
                                    targetUrnNo: 'URN-TARGET',
                                    targetEoiNo: 'GP001',
                                },
                            ],
                        }, adminUserId)];
                case 1:
                    result = _d.sent();
                    expect(plantMergeAuditModel.create).toHaveBeenCalledWith([
                        expect.objectContaining({
                            manufacturingUnitsSkipped: ['Mumbai'],
                            copiedPlantIds: [],
                        }),
                    ], expect.any(Object));
                    expect((_a = result.results[0]) === null || _a === void 0 ? void 0 : _a.plantsCopied).toBe(0);
                    expect((_b = result.results[0]) === null || _b === void 0 ? void 0 : _b.plantsSkipped).toBe(1);
                    expect((_c = result.results[0]) === null || _c === void 0 ? void 0 : _c.skippedPlantNames).toEqual(['Mumbai']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('re-validates pairs inside the transaction before copying', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plantMergeUrnValidationService.validate
                        .mockResolvedValueOnce({
                        success: true,
                        canMerge: true,
                        blockers: [],
                    })
                        .mockResolvedValueOnce({
                        success: true,
                        canMerge: false,
                        blockers: [{ code: 'DUPLICATE_MERGE', message: 'Already merged' }],
                    });
                    return [4 /*yield*/, expect(service.execute({
                            sourceUrnNo: 'URN-SOURCE',
                            pairs: [
                                {
                                    sourceEoiNo: 'GP100',
                                    targetUrnNo: 'URN-TARGET',
                                    targetEoiNo: 'GP001',
                                },
                            ],
                        }, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    expect(copy_product_plants_util_1.copyActivePlantsToTargetProduct).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('propagates failure and does not commit when a later pair fails in the transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var secondSourceProductId, secondSourceProduct;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    secondSourceProductId = new mongoose_2.Types.ObjectId();
                    secondSourceProduct = __assign(__assign({}, sourceProduct), { _id: secondSourceProductId, eoiNo: 'GP102', productName: 'Panel' });
                    productModel.findOne.mockReset();
                    productModel.findOne
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(sourceProduct),
                    })
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(targetProduct),
                    })
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(secondSourceProduct),
                    })
                        .mockReturnValueOnce({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue(targetProduct),
                    });
                    plantMergeAuditModel.create
                        .mockResolvedValueOnce([{ _id: new mongoose_2.Types.ObjectId() }])
                        .mockRejectedValueOnce(new Error('audit write failed'));
                    return [4 /*yield*/, expect(service.execute({
                            sourceUrnNo: 'URN-SOURCE',
                            pairs: [
                                {
                                    sourceEoiNo: 'GP100',
                                    targetUrnNo: 'URN-TARGET',
                                    targetEoiNo: 'GP001',
                                },
                                {
                                    sourceEoiNo: 'GP102',
                                    targetUrnNo: 'URN-TARGET',
                                    targetEoiNo: 'GP001',
                                },
                            ],
                        }, adminUserId)).rejects.toThrow('audit write failed')];
                case 1:
                    _a.sent();
                    expect(copy_product_plants_util_1.copyActivePlantsToTargetProduct).toHaveBeenCalledTimes(2);
                    expect(plantMergeAuditModel.create).toHaveBeenCalledTimes(2);
                    expect(mongo_session_util_1.runInTransactionIfSupported).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
