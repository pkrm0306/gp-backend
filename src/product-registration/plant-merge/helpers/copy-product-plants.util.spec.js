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
var mongoose_1 = require("mongoose");
var copy_product_plants_util_1 = require("./copy-product-plants.util");
describe('copyActivePlantsToTargetProduct', function () {
    var sourceProductId = new mongoose_1.Types.ObjectId();
    var targetProductId = new mongoose_1.Types.ObjectId();
    var vendorId = new mongoose_1.Types.ObjectId();
    var categoryId = new mongoose_1.Types.ObjectId();
    var manufacturerId = new mongoose_1.Types.ObjectId();
    var now = new Date('2024-06-01');
    var targetProduct = {
        _id: targetProductId,
        urnNo: 'URN-TARGET',
        eoiNo: 'GP001',
        vendorId: vendorId,
        categoryId: categoryId,
        manufacturerId: manufacturerId,
    };
    var sequenceHelper = {
        reserveSequenceValues: jest.fn(),
    };
    function buildProductPlantModel(options) {
        var _this = this;
        var _a, _b;
        var sourcePlants = (_a = options.sourcePlants) !== null && _a !== void 0 ? _a : [];
        var targetPlants = (_b = options.targetPlants) !== null && _b !== void 0 ? _b : [];
        return {
            find: jest.fn(function (filter) {
                var rows = String(filter.productId) === String(sourceProductId)
                    ? sourcePlants
                    : targetPlants;
                return {
                    sort: jest.fn().mockReturnThis(),
                    lean: jest.fn().mockReturnThis(),
                    exec: jest.fn().mockResolvedValue(rows),
                };
            }),
            create: jest.fn(function (rows) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, [
                            __assign({ _id: new mongoose_1.Types.ObjectId() }, rows[0]),
                        ]];
                });
            }); }),
        };
    }
    beforeEach(function () {
        jest.clearAllMocks();
        sequenceHelper.reserveSequenceValues.mockResolvedValue([9001, 9002, 9003]);
    });
    it('copies multiple source plants to the target product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plantA, plantB, plantC, productPlantModel, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plantA = new mongoose_1.Types.ObjectId();
                    plantB = new mongoose_1.Types.ObjectId();
                    plantC = new mongoose_1.Types.ObjectId();
                    productPlantModel = buildProductPlantModel({
                        sourcePlants: [
                            {
                                _id: plantA,
                                productPlantId: 1,
                                plantName: 'Mumbai',
                                plantLocation: 'Andheri',
                                city: 'Mumbai',
                            },
                            {
                                _id: plantB,
                                productPlantId: 2,
                                plantName: 'Pune',
                                plantLocation: 'Hinjewadi',
                                city: 'Pune',
                            },
                            {
                                _id: plantC,
                                productPlantId: 3,
                                plantName: 'Delhi',
                                plantLocation: 'Noida',
                                city: 'Delhi',
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, copy_product_plants_util_1.copyActivePlantsToTargetProduct)(productPlantModel, sequenceHelper, sourceProductId, targetProduct, now)];
                case 1:
                    result = _a.sent();
                    expect(sequenceHelper.reserveSequenceValues).toHaveBeenCalledWith('product_plant_id', 3);
                    expect(productPlantModel.create).toHaveBeenCalledTimes(3);
                    expect(result.copiedPlantIds).toHaveLength(3);
                    expect(result.sourcePlantIds).toEqual([plantA, plantB, plantC]);
                    expect(result.manufacturingUnitsSkipped).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips duplicate plants already present on the target', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourcePlantA, sourcePlantB, productPlantModel, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourcePlantA = new mongoose_1.Types.ObjectId();
                    sourcePlantB = new mongoose_1.Types.ObjectId();
                    productPlantModel = buildProductPlantModel({
                        sourcePlants: [
                            {
                                _id: sourcePlantA,
                                productPlantId: 10,
                                plantName: 'Mumbai',
                                plantLocation: 'Andheri',
                                city: 'Mumbai',
                            },
                            {
                                _id: sourcePlantB,
                                productPlantId: 11,
                                plantName: 'Pune',
                                plantLocation: 'Hinjewadi',
                                city: 'Pune',
                            },
                        ],
                        targetPlants: [
                            {
                                _id: new mongoose_1.Types.ObjectId(),
                                plantName: 'Mumbai',
                                plantLocation: 'Andheri',
                                city: 'Mumbai',
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, copy_product_plants_util_1.copyActivePlantsToTargetProduct)(productPlantModel, sequenceHelper, sourceProductId, targetProduct, now)];
                case 1:
                    result = _a.sent();
                    expect(sequenceHelper.reserveSequenceValues).toHaveBeenCalledWith('product_plant_id', 1);
                    expect(productPlantModel.create).toHaveBeenCalledTimes(1);
                    expect(result.copiedPlantIds).toHaveLength(1);
                    expect(result.skippedSourcePlantIds).toEqual([sourcePlantA]);
                    expect(result.manufacturingUnitsSkipped).toEqual(['Mumbai']);
                    expect(result.sourcePlantIds).toEqual([sourcePlantB]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns empty copy result when source has no active plants', function () { return __awaiter(void 0, void 0, void 0, function () {
        var productPlantModel, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productPlantModel = buildProductPlantModel({ sourcePlants: [] });
                    return [4 /*yield*/, (0, copy_product_plants_util_1.copyActivePlantsToTargetProduct)(productPlantModel, sequenceHelper, sourceProductId, targetProduct, now)];
                case 1:
                    result = _a.sent();
                    expect(sequenceHelper.reserveSequenceValues).not.toHaveBeenCalled();
                    expect(productPlantModel.create).not.toHaveBeenCalled();
                    expect(result.copiedPlantIds).toEqual([]);
                    expect(result.manufacturingUnitsSkipped).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips all plants when every source plant already exists on target', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourcePlant, productPlantModel, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourcePlant = new mongoose_1.Types.ObjectId();
                    productPlantModel = buildProductPlantModel({
                        sourcePlants: [
                            {
                                _id: sourcePlant,
                                productPlantId: 20,
                                plantName: 'Chennai',
                                plantLocation: 'OMR',
                                city: 'Chennai',
                            },
                        ],
                        targetPlants: [
                            {
                                _id: new mongoose_1.Types.ObjectId(),
                                plantName: 'Chennai',
                                plantLocation: 'OMR',
                                city: 'Chennai',
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, copy_product_plants_util_1.copyActivePlantsToTargetProduct)(productPlantModel, sequenceHelper, sourceProductId, targetProduct, now)];
                case 1:
                    result = _a.sent();
                    expect(sequenceHelper.reserveSequenceValues).not.toHaveBeenCalled();
                    expect(productPlantModel.create).not.toHaveBeenCalled();
                    expect(result.copiedPlantIds).toEqual([]);
                    expect(result.skippedSourcePlantIds).toEqual([sourcePlant]);
                    expect(result.manufacturingUnitsSkipped).toEqual(['Chennai']);
                    return [2 /*return*/];
            }
        });
    }); });
});
