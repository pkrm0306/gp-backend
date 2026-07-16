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
var product_schema_1 = require("../../schemas/product.schema");
var product_plant_schema_1 = require("../../schemas/product-plant.schema");
var plant_merge_urn_preview_service_1 = require("./plant-merge-urn-preview.service");
var plant_merge_urn_validation_service_1 = require("./plant-merge-urn-validation.service");
var plant_merge_urn_preview_constants_1 = require("../plant-merge-urn-preview.constants");
var product_status_constants_1 = require("../../../renew/constants/product-status.constants");
var plant_merge_urn_validation_constants_1 = require("../plant-merge-urn-validation.constants");
describe('PlantMergeUrnPreviewService', function () {
    var service;
    var manufacturerId = new mongoose_2.Types.ObjectId();
    var categoryId = new mongoose_2.Types.ObjectId();
    var productModel = {
        find: jest.fn(),
    };
    var productPlantModel = {
        countDocuments: jest.fn().mockResolvedValue(2),
    };
    var plantMergeUrnValidationService = {
        validateResolvedPair: jest.fn().mockResolvedValue([]),
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    plantMergeUrnValidationService.validateResolvedPair.mockResolvedValue([]);
                    productPlantModel.countDocuments.mockResolvedValue(2);
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                plant_merge_urn_preview_service_1.PlantMergeUrnPreviewService,
                                {
                                    provide: (0, mongoose_1.getModelToken)(product_schema_1.Product.name),
                                    useValue: productModel,
                                },
                                {
                                    provide: (0, mongoose_1.getModelToken)(product_plant_schema_1.ProductPlant.name),
                                    useValue: productPlantModel,
                                },
                                {
                                    provide: plant_merge_urn_validation_service_1.PlantMergeUrnValidationService,
                                    useValue: plantMergeUrnValidationService,
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(plant_merge_urn_preview_service_1.PlantMergeUrnPreviewService);
                    return [2 /*return*/];
            }
        });
    }); });
    function mockFindChain(rows) {
        return {
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(rows),
        };
    }
    it('returns READY rows with target URN, EOI, and plant count', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceProduct, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceProduct = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productId: 10,
                        productName: 'Board',
                        eoiNo: 'GP100',
                        urnNo: 'URN-SOURCE',
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        certifiedDate: new Date('2024-01-01'),
                        createdDate: new Date('2024-01-01'),
                    };
                    productModel.find
                        .mockReturnValueOnce(mockFindChain([sourceProduct]))
                        .mockReturnValueOnce(mockFindChain([
                        {
                            _id: new mongoose_2.Types.ObjectId(),
                            productName: 'Board',
                            urnNo: 'URN-TARGET',
                            eoiNo: 'GP001',
                            manufacturerId: manufacturerId,
                            categoryId: categoryId,
                            productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                            certifiedDate: new Date('2023-01-01'),
                            createdDate: new Date('2023-01-01'),
                        },
                    ]));
                    return [4 /*yield*/, service.previewBySourceUrn('URN-SOURCE')];
                case 1:
                    result = _a.sent();
                    expect(result.items).toHaveLength(1);
                    expect(result.items[0]).toEqual({
                        productName: 'Board',
                        sourceEoi: 'GP100',
                        sourceUrn: 'URN-SOURCE',
                        targetUrn: 'URN-TARGET',
                        targetEoi: 'GP001',
                        mergeStatus: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.READY,
                        failureReason: null,
                        sourcePlantCount: 2,
                    });
                    expect(result.summary).toEqual({
                        total: 1,
                        ready: 1,
                        blocked: 0,
                        noTarget: 0,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns NO_TARGET when no external match exists', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceProduct, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sourceProduct = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productId: 11,
                        productName: 'Panel',
                        eoiNo: 'GP200',
                        urnNo: 'URN-SOURCE',
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        createdDate: new Date('2024-01-01'),
                    };
                    productModel.find
                        .mockReturnValueOnce(mockFindChain([sourceProduct]))
                        .mockReturnValueOnce(mockFindChain([]));
                    return [4 /*yield*/, service.previewBySourceUrn('URN-SOURCE')];
                case 1:
                    result = _d.sent();
                    expect((_a = result.items[0]) === null || _a === void 0 ? void 0 : _a.mergeStatus).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET);
                    expect((_b = result.items[0]) === null || _b === void 0 ? void 0 : _b.targetUrn).toBeNull();
                    expect((_c = result.items[0]) === null || _c === void 0 ? void 0 : _c.failureReason).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_FAILURE.NO_MATCHING_TARGET);
                    expect(result.summary.noTarget).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns NO_TARGET with brand-new-product reason when only newer matches exist', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceProduct, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sourceProduct = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productId: 12,
                        productName: 'Tile',
                        eoiNo: 'GP300',
                        urnNo: 'URN-SOURCE',
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        certifiedDate: new Date('2024-06-01'),
                        createdDate: new Date('2024-06-01'),
                    };
                    productModel.find
                        .mockReturnValueOnce(mockFindChain([sourceProduct]))
                        .mockReturnValueOnce(mockFindChain([
                        {
                            urnNo: 'URN-NEWER',
                            eoiNo: 'GP099',
                            productName: 'Tile',
                            manufacturerId: manufacturerId,
                            categoryId: categoryId,
                            certifiedDate: new Date('2025-01-01'),
                            createdDate: new Date('2025-01-01'),
                        },
                    ]));
                    return [4 /*yield*/, service.previewBySourceUrn('URN-SOURCE')];
                case 1:
                    result = _c.sent();
                    expect((_a = result.items[0]) === null || _a === void 0 ? void 0 : _a.mergeStatus).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET);
                    expect((_b = result.items[0]) === null || _b === void 0 ? void 0 : _b.failureReason).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_FAILURE.BRAND_NEW_PRODUCT);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns BLOCKED when source EOI has no active plants', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceProduct, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    productPlantModel.countDocuments.mockResolvedValue(0);
                    sourceProduct = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productId: 13,
                        productName: 'Glass',
                        eoiNo: 'GP400',
                        urnNo: 'URN-SOURCE',
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        createdDate: new Date('2024-01-01'),
                    };
                    productModel.find
                        .mockReturnValueOnce(mockFindChain([sourceProduct]))
                        .mockReturnValueOnce(mockFindChain([]));
                    return [4 /*yield*/, service.previewBySourceUrn('URN-SOURCE')];
                case 1:
                    result = _c.sent();
                    expect((_a = result.items[0]) === null || _a === void 0 ? void 0 : _a.mergeStatus).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED);
                    expect((_b = result.items[0]) === null || _b === void 0 ? void 0 : _b.failureReason).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_FAILURE.SOURCE_NO_PLANTS);
                    expect(result.summary.blocked).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns partial summary for multiple products with mixed statuses', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceA, sourceB, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sourceA = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productId: 20,
                        productName: 'Board',
                        eoiNo: 'GP100',
                        urnNo: 'URN-SOURCE',
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        certifiedDate: new Date('2024-01-01'),
                        createdDate: new Date('2024-01-01'),
                    };
                    sourceB = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productId: 21,
                        productName: 'Panel',
                        eoiNo: 'GP101',
                        urnNo: 'URN-SOURCE',
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        certifiedDate: new Date('2024-02-01'),
                        createdDate: new Date('2024-02-01'),
                    };
                    productModel.find
                        .mockReturnValueOnce(mockFindChain([sourceA, sourceB]))
                        .mockReturnValueOnce(mockFindChain([
                        {
                            _id: new mongoose_2.Types.ObjectId(),
                            productName: 'Board',
                            urnNo: 'URN-TARGET',
                            eoiNo: 'GP001',
                            manufacturerId: manufacturerId,
                            categoryId: categoryId,
                            productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                            certifiedDate: new Date('2023-01-01'),
                            createdDate: new Date('2023-01-01'),
                        },
                    ]));
                    return [4 /*yield*/, service.previewBySourceUrn('URN-SOURCE')];
                case 1:
                    result = _c.sent();
                    expect(result.items).toHaveLength(2);
                    expect(result.summary).toEqual({
                        total: 2,
                        ready: 1,
                        blocked: 0,
                        noTarget: 1,
                    });
                    expect((_a = result.items[0]) === null || _a === void 0 ? void 0 : _a.mergeStatus).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.READY);
                    expect((_b = result.items[1]) === null || _b === void 0 ? void 0 : _b.mergeStatus).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns BLOCKED when validation reports duplicate merge', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceProduct, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sourceProduct = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productId: 30,
                        productName: 'Board',
                        eoiNo: 'GP500',
                        urnNo: 'URN-SOURCE',
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        certifiedDate: new Date('2024-01-01'),
                        createdDate: new Date('2024-01-01'),
                    };
                    productModel.find
                        .mockReturnValueOnce(mockFindChain([sourceProduct]))
                        .mockReturnValueOnce(mockFindChain([
                        {
                            _id: new mongoose_2.Types.ObjectId(),
                            productName: 'Board',
                            urnNo: 'URN-TARGET',
                            eoiNo: 'GP001',
                            manufacturerId: manufacturerId,
                            categoryId: categoryId,
                            productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                            certifiedDate: new Date('2023-01-01'),
                            createdDate: new Date('2023-01-01'),
                        },
                    ]));
                    plantMergeUrnValidationService.validateResolvedPair.mockResolvedValue([
                        {
                            code: 'DUPLICATE_MERGE',
                            message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.DUPLICATE_MERGE,
                        },
                    ]);
                    return [4 /*yield*/, service.previewBySourceUrn('URN-SOURCE')];
                case 1:
                    result = _c.sent();
                    expect((_a = result.items[0]) === null || _a === void 0 ? void 0 : _a.mergeStatus).toBe(plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED);
                    expect((_b = result.items[0]) === null || _b === void 0 ? void 0 : _b.failureReason).toContain('already been merged');
                    expect(result.summary.blocked).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
