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
exports.copyActivePlantsToTargetProduct = copyActivePlantsToTargetProduct;
var active_product_filter_1 = require("../../constants/active-product.filter");
var plant_merge_eligibility_util_1 = require("./plant-merge-eligibility.util");
/**
 * Copies active manufacturing plants from a source product onto a target product.
 * Plants already present on the target (same name + location) are skipped.
 * Source plants are left unchanged.
 */
function copyActivePlantsToTargetProduct(productPlantModel, sequenceHelper, sourceProductId, targetProduct, now, session) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionOpts, sourcePlants, targetPlants, targetIdentityKeys, sourcePlantIds, sourceProductPlantIds, copiedPlantIds, copiedProductPlantIds, skippedSourcePlantIds, skippedProductPlantIds, manufacturingUnitsSkipped, plantsToCopy, _i, _a, sourcePlant, identityKey, productPlantIds, index, sourcePlant, productPlantId, created;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    sessionOpts = session ? { session: session } : {};
                    return [4 /*yield*/, productPlantModel
                            .find((0, active_product_filter_1.matchActiveProductPlants)({ productId: sourceProductId }))
                            .sort({ createdDate: 1 })
                            .lean()
                            .exec()];
                case 1:
                    sourcePlants = _f.sent();
                    return [4 /*yield*/, productPlantModel
                            .find((0, active_product_filter_1.matchActiveProductPlants)({ productId: targetProduct._id }))
                            .lean()
                            .exec()];
                case 2:
                    targetPlants = _f.sent();
                    targetIdentityKeys = new Set(targetPlants.map(function (plant) {
                        return (0, plant_merge_eligibility_util_1.buildPlantIdentityKey)({
                            plantName: plant.plantName,
                            plantLocation: plant.plantLocation,
                            city: plant.city,
                        });
                    }));
                    sourcePlantIds = [];
                    sourceProductPlantIds = [];
                    copiedPlantIds = [];
                    copiedProductPlantIds = [];
                    skippedSourcePlantIds = [];
                    skippedProductPlantIds = [];
                    manufacturingUnitsSkipped = [];
                    plantsToCopy = [];
                    for (_i = 0, _a = sourcePlants; _i < _a.length; _i++) {
                        sourcePlant = _a[_i];
                        identityKey = (0, plant_merge_eligibility_util_1.buildPlantIdentityKey)({
                            plantName: sourcePlant.plantName,
                            plantLocation: sourcePlant.plantLocation,
                            city: sourcePlant.city,
                        });
                        if (targetIdentityKeys.has(identityKey)) {
                            skippedSourcePlantIds.push(sourcePlant._id);
                            skippedProductPlantIds.push(Number((_b = sourcePlant.productPlantId) !== null && _b !== void 0 ? _b : 0));
                            manufacturingUnitsSkipped.push(String((_c = sourcePlant.plantName) !== null && _c !== void 0 ? _c : '').trim());
                            continue;
                        }
                        targetIdentityKeys.add(identityKey);
                        plantsToCopy.push(sourcePlant);
                    }
                    if (plantsToCopy.length === 0) {
                        return [2 /*return*/, {
                                sourcePlantIds: sourcePlantIds,
                                sourceProductPlantIds: sourceProductPlantIds,
                                copiedPlantIds: copiedPlantIds,
                                copiedProductPlantIds: copiedProductPlantIds,
                                skippedSourcePlantIds: skippedSourcePlantIds,
                                skippedProductPlantIds: skippedProductPlantIds,
                                manufacturingUnitsSkipped: manufacturingUnitsSkipped,
                            }];
                    }
                    return [4 /*yield*/, sequenceHelper.reserveSequenceValues('product_plant_id', plantsToCopy.length)];
                case 3:
                    productPlantIds = _f.sent();
                    index = 0;
                    _f.label = 4;
                case 4:
                    if (!(index < plantsToCopy.length)) return [3 /*break*/, 7];
                    sourcePlant = plantsToCopy[index];
                    productPlantId = productPlantIds[index];
                    return [4 /*yield*/, productPlantModel.create([
                            {
                                productPlantId: productPlantId,
                                productId: targetProduct._id,
                                vendorId: targetProduct.vendorId,
                                categoryId: targetProduct.categoryId,
                                manufacturerId: targetProduct.manufacturerId,
                                countryId: sourcePlant.countryId,
                                stateId: sourcePlant.stateId,
                                urnNo: targetProduct.urnNo,
                                eoiNo: targetProduct.eoiNo,
                                plantName: sourcePlant.plantName,
                                plantLocation: sourcePlant.plantLocation,
                                city: sourcePlant.city,
                                plantStatus: (_d = sourcePlant.plantStatus) !== null && _d !== void 0 ? _d : 1,
                                createdDate: now,
                            },
                        ], sessionOpts)];
                case 5:
                    created = _f.sent();
                    sourcePlantIds.push(sourcePlant._id);
                    sourceProductPlantIds.push(Number((_e = sourcePlant.productPlantId) !== null && _e !== void 0 ? _e : 0));
                    copiedPlantIds.push(created[0]._id);
                    copiedProductPlantIds.push(productPlantId);
                    _f.label = 6;
                case 6:
                    index += 1;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/, {
                        sourcePlantIds: sourcePlantIds,
                        sourceProductPlantIds: sourceProductPlantIds,
                        copiedPlantIds: copiedPlantIds,
                        copiedProductPlantIds: copiedProductPlantIds,
                        skippedSourcePlantIds: skippedSourcePlantIds,
                        skippedProductPlantIds: skippedProductPlantIds,
                        manufacturingUnitsSkipped: manufacturingUnitsSkipped,
                    }];
            }
        });
    });
}
