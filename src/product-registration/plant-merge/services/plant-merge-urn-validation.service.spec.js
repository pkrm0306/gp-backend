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
var plant_merge_audit_schema_1 = require("../schemas/plant-merge-audit.schema");
var plant_merge_urn_validation_service_1 = require("./plant-merge-urn-validation.service");
var product_status_constants_1 = require("../../../renew/constants/product-status.constants");
var plant_merge_urn_validation_constants_1 = require("../plant-merge-urn-validation.constants");
describe('PlantMergeUrnValidationService', function () {
    var service;
    var manufacturerId = new mongoose_2.Types.ObjectId();
    var categoryId = new mongoose_2.Types.ObjectId();
    var productModel = {
        countDocuments: jest.fn(),
        findOne: jest.fn(),
    };
    var plantMergeAuditModel = {
        countDocuments: jest.fn(),
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                plant_merge_urn_validation_service_1.PlantMergeUrnValidationService,
                                { provide: (0, mongoose_1.getModelToken)(product_schema_1.Product.name), useValue: productModel },
                                { provide: (0, mongoose_1.getModelToken)(plant_merge_audit_schema_1.PlantMergeAudit.name), useValue: plantMergeAuditModel },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(plant_merge_urn_validation_service_1.PlantMergeUrnValidationService);
                    return [2 /*return*/];
            }
        });
    }); });
    function mockFindOneChain(row) {
        return {
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(row),
        };
    }
    it('returns canMerge true when all rules pass', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceProduct, targetProduct, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceProduct = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productName: 'Board',
                        eoiNo: 'GP100',
                        urnNo: 'URN-SOURCE',
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        certifiedDate: new Date('2024-01-01'),
                        createdDate: new Date('2024-01-01'),
                    };
                    targetProduct = {
                        _id: new mongoose_2.Types.ObjectId(),
                        productName: 'Board',
                        eoiNo: 'GP001',
                        urnNo: 'URN-TARGET',
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        certifiedDate: new Date('2023-01-01'),
                        createdDate: new Date('2023-01-01'),
                    };
                    productModel.countDocuments.mockResolvedValue(1);
                    productModel.findOne
                        .mockReturnValueOnce(mockFindOneChain(sourceProduct))
                        .mockReturnValueOnce(mockFindOneChain(targetProduct));
                    plantMergeAuditModel.countDocuments.mockResolvedValue(0);
                    return [4 /*yield*/, service.validate({
                            sourceUrnNo: 'URN-SOURCE',
                            targetUrnNo: 'URN-TARGET',
                            sourceEoiNo: 'GP100',
                            targetEoiNo: 'GP001',
                        })];
                case 1:
                    result = _a.sent();
                    expect(result.canMerge).toBe(true);
                    expect(result.blockers).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns duplicate merge blocker', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productModel.countDocuments.mockResolvedValue(1);
                    productModel.findOne
                        .mockReturnValueOnce(mockFindOneChain({
                        _id: new mongoose_2.Types.ObjectId(),
                        productName: 'Board',
                        eoiNo: 'GP100',
                        urnNo: 'URN-SOURCE',
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        certifiedDate: new Date('2024-01-01'),
                        createdDate: new Date('2024-01-01'),
                    }))
                        .mockReturnValueOnce(mockFindOneChain({
                        _id: new mongoose_2.Types.ObjectId(),
                        productName: 'Board',
                        eoiNo: 'GP001',
                        urnNo: 'URN-TARGET',
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        manufacturerId: manufacturerId,
                        categoryId: categoryId,
                        certifiedDate: new Date('2023-01-01'),
                        createdDate: new Date('2023-01-01'),
                    }));
                    plantMergeAuditModel.countDocuments.mockResolvedValue(1);
                    return [4 /*yield*/, service.validate({
                            sourceUrnNo: 'URN-SOURCE',
                            targetUrnNo: 'URN-TARGET',
                            sourceEoiNo: 'GP100',
                            targetEoiNo: 'GP001',
                        })];
                case 1:
                    result = _a.sent();
                    expect(result.canMerge).toBe(false);
                    expect(result.blockers.some(function (b) { return b.code === plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.DUPLICATE_MERGE; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
