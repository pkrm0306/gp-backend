"use strict";
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
exports.PlantMergeUrnValidationService = void 0;
var common_1 = require("@nestjs/common");
var active_product_filter_1 = require("../../constants/active-product.filter");
var product_status_constants_1 = require("../../../renew/constants/product-status.constants");
var merge_eligibility_shared_1 = require("../../helpers/merge-eligibility.shared");
var plant_merge_urn_validation_constants_1 = require("../plant-merge-urn-validation.constants");
var plant_merge_urn_validation_util_1 = require("../helpers/plant-merge-urn-validation.util");
var plant_merge_product_lookup_util_1 = require("../helpers/plant-merge-product-lookup.util");
var PlantMergeUrnValidationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlantMergeUrnValidationService = _classThis = /** @class */ (function () {
        function PlantMergeUrnValidationService_1(productModel, plantMergeAuditModel) {
            this.productModel = productModel;
            this.plantMergeAuditModel = plantMergeAuditModel;
        }
        PlantMergeUrnValidationService_1.prototype.validate = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var sourceUrnNo, targetUrnNo, sourceEoiNo, targetEoiNo, blockers, sourceProduct, targetProduct, uniqueBlockers;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sourceUrnNo = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(dto.sourceUrnNo);
                            targetUrnNo = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(dto.targetUrnNo);
                            sourceEoiNo = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(dto.sourceEoiNo);
                            targetEoiNo = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(dto.targetEoiNo);
                            blockers = [];
                            if ((0, plant_merge_urn_validation_util_1.isSameSourceAndTargetPair)({
                                sourceUrnNo: sourceUrnNo,
                                targetUrnNo: targetUrnNo,
                                sourceEoiNo: sourceEoiNo,
                                targetEoiNo: targetEoiNo,
                            })) {
                                blockers.push({
                                    code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.SAME_SOURCE_TARGET,
                                    message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.SAME_SOURCE_TARGET,
                                });
                            }
                            return [4 /*yield*/, this.appendSourceUrnCertifiedBlocker(sourceUrnNo, blockers)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, this.findProductOnUrn(sourceUrnNo, sourceEoiNo)];
                        case 2:
                            sourceProduct = _b.sent();
                            if (!sourceProduct) {
                                blockers.push({
                                    code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.SOURCE_EOI_NOT_FOUND,
                                    message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.SOURCE_EOI_NOT_FOUND,
                                });
                            }
                            return [4 /*yield*/, this.findProductOnUrn(targetUrnNo, targetEoiNo)];
                        case 3:
                            targetProduct = _b.sent();
                            if (!targetProduct) {
                                blockers.push({
                                    code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.TARGET_EOI_NOT_FOUND,
                                    message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.TARGET_EOI_NOT_FOUND,
                                });
                            }
                            if (!(sourceProduct && targetProduct)) return [3 /*break*/, 5];
                            blockers.push.apply(blockers, (0, plant_merge_urn_validation_util_1.buildPlantMergeUrnPairValidationBlockers)(sourceProduct, targetProduct));
                            return [4 /*yield*/, this.appendDuplicateMergeBlocker(sourceUrnNo, sourceEoiNo, targetUrnNo, targetEoiNo, blockers)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            uniqueBlockers = this.deduplicateBlockers(blockers);
                            return [2 /*return*/, {
                                    success: true,
                                    canMerge: uniqueBlockers.length === 0,
                                    sourceUrnNo: sourceUrnNo,
                                    targetUrnNo: targetUrnNo,
                                    sourceEoiNo: sourceEoiNo,
                                    targetEoiNo: targetEoiNo,
                                    productName: (_a = sourceProduct === null || sourceProduct === void 0 ? void 0 : sourceProduct.productName) !== null && _a !== void 0 ? _a : targetProduct === null || targetProduct === void 0 ? void 0 : targetProduct.productName,
                                    blockers: uniqueBlockers,
                                }];
                    }
                });
            });
        };
        PlantMergeUrnValidationService_1.prototype.validateResolvedPair = function (source, target, sourceUrnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var blockers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            blockers = [];
                            return [4 /*yield*/, this.appendSourceUrnCertifiedBlocker(sourceUrnNo, blockers)];
                        case 1:
                            _a.sent();
                            blockers.push.apply(blockers, (0, plant_merge_urn_validation_util_1.buildPlantMergeUrnPairValidationBlockers)(source, target));
                            return [4 /*yield*/, this.appendDuplicateMergeBlocker(source.urnNo, source.eoiNo, target.urnNo, target.eoiNo, blockers)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.deduplicateBlockers(blockers)];
                    }
                });
            });
        };
        PlantMergeUrnValidationService_1.prototype.findProductOnUrn = function (urnNo, eoiNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, plant_merge_product_lookup_util_1.findActiveProductOnUrn)(this.productModel, urnNo, eoiNo, plant_merge_product_lookup_util_1.PLANT_MERGE_URN_VALIDATION_PRODUCT_SELECT)];
                });
            });
        };
        PlantMergeUrnValidationService_1.prototype.appendSourceUrnCertifiedBlocker = function (sourceUrnNo, blockers) {
            return __awaiter(this, void 0, void 0, function () {
                var sourceUrnCertifiedCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel.countDocuments((0, active_product_filter_1.matchActiveProducts)({
                                urnNo: sourceUrnNo,
                                productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                            }))];
                        case 1:
                            sourceUrnCertifiedCount = _a.sent();
                            if (sourceUrnCertifiedCount === 0) {
                                blockers.push({
                                    code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.SOURCE_URN_NOT_CERTIFIED,
                                    message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.SOURCE_URN_NOT_CERTIFIED,
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PlantMergeUrnValidationService_1.prototype.appendDuplicateMergeBlocker = function (sourceUrnNo, sourceEoiNo, targetUrnNo, targetEoiNo, blockers) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.hasDuplicateMerge(sourceUrnNo, sourceEoiNo, targetUrnNo, targetEoiNo)];
                        case 1:
                            if (_a.sent()) {
                                blockers.push({
                                    code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.DUPLICATE_MERGE,
                                    message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.DUPLICATE_MERGE,
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PlantMergeUrnValidationService_1.prototype.hasDuplicateMerge = function (sourceUrnNo, sourceEoiNo, targetUrnNo, targetEoiNo) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.plantMergeAuditModel.countDocuments({
                                urnNo: sourceUrnNo,
                                eoiNo: sourceEoiNo,
                                targetUrnNo: targetUrnNo,
                                targetEoiNo: targetEoiNo,
                            })];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count > 0];
                    }
                });
            });
        };
        PlantMergeUrnValidationService_1.prototype.deduplicateBlockers = function (blockers) {
            var seen = new Set();
            var out = [];
            for (var _i = 0, blockers_1 = blockers; _i < blockers_1.length; _i++) {
                var blocker = blockers_1[_i];
                var key = "".concat(blocker.code, ":").concat(blocker.message);
                if (seen.has(key))
                    continue;
                seen.add(key);
                out.push(blocker);
            }
            return out;
        };
        return PlantMergeUrnValidationService_1;
    }());
    __setFunctionName(_classThis, "PlantMergeUrnValidationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlantMergeUrnValidationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlantMergeUrnValidationService = _classThis;
}();
exports.PlantMergeUrnValidationService = PlantMergeUrnValidationService;
