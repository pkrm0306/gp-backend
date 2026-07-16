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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantMergeUrnExecuteService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var mongo_session_util_1 = require("../../../renew/helpers/mongo-session.util");
var invalidate_product_listings_cache_util_1 = require("../../helpers/invalidate-product-listings-cache.util");
var merge_eligibility_shared_1 = require("../../helpers/merge-eligibility.shared");
var sync_product_plant_count_util_1 = require("../../helpers/sync-product-plant-count.util");
var plant_merge_constants_1 = require("../plant-merge.constants");
var plant_merge_urn_preview_constants_1 = require("../plant-merge-urn-preview.constants");
var copy_product_plants_util_1 = require("../helpers/copy-product-plants.util");
var plant_merge_product_lookup_util_1 = require("../helpers/plant-merge-product-lookup.util");
var PlantMergeUrnExecuteService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlantMergeUrnExecuteService = _classThis = /** @class */ (function () {
        function PlantMergeUrnExecuteService_1(productModel, productPlantModel, plantMergeAuditModel, connection, plantMergeUrnValidationService, plantMergeUrnPreviewService, sequenceHelper, activityLogService, redisService, lifecycleNotification) {
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.plantMergeAuditModel = plantMergeAuditModel;
            this.connection = connection;
            this.plantMergeUrnValidationService = plantMergeUrnValidationService;
            this.plantMergeUrnPreviewService = plantMergeUrnPreviewService;
            this.sequenceHelper = sequenceHelper;
            this.activityLogService = activityLogService;
            this.redisService = redisService;
            this.lifecycleNotification = lifecycleNotification;
            this.logger = new common_1.Logger(PlantMergeUrnExecuteService.name);
        }
        PlantMergeUrnExecuteService_1.prototype.execute = function (dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var sourceUrnNo, pairs, pairContexts, adminObjectId, now, results, _loop_1, this_1, _i, results_1, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sourceUrnNo = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(dto.sourceUrnNo);
                            if (!sourceUrnNo) {
                                throw new common_1.BadRequestException('sourceUrnNo is required');
                            }
                            return [4 /*yield*/, this.resolveExecutePairs(sourceUrnNo, dto.pairs)];
                        case 1:
                            pairs = _a.sent();
                            if (pairs.length === 0) {
                                throw new common_1.BadRequestException('No eligible product pairs found for plant merge execution');
                            }
                            return [4 /*yield*/, this.assertAllPairsValid(sourceUrnNo, pairs)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, Promise.all(pairs.map(function (pair) { return _this.loadPairContext(sourceUrnNo, pair); }))];
                        case 3:
                            pairContexts = _a.sent();
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            now = new Date();
                            return [4 /*yield*/, (0, mongo_session_util_1.runInTransactionIfSupported)(this.connection, function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var sessionOpts, executed, _i, pairContexts_1, context, plantCountBefore, copyResult, plantCountAfter, audit;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                sessionOpts = session ? { session: session } : {};
                                                executed = [];
                                                _i = 0, pairContexts_1 = pairContexts;
                                                _a.label = 1;
                                            case 1:
                                                if (!(_i < pairContexts_1.length)) return [3 /*break*/, 8];
                                                context = pairContexts_1[_i];
                                                return [4 /*yield*/, this.assertPairValidInTransaction(sourceUrnNo, context.pair)];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, (0, sync_product_plant_count_util_1.countActivePlantsForProduct)(this.productPlantModel, context.targetProduct._id, session)];
                                            case 3:
                                                plantCountBefore = _a.sent();
                                                return [4 /*yield*/, (0, copy_product_plants_util_1.copyActivePlantsToTargetProduct)(this.productPlantModel, this.sequenceHelper, context.sourceProduct._id, context.targetProduct, now, session)];
                                            case 4:
                                                copyResult = _a.sent();
                                                return [4 /*yield*/, (0, sync_product_plant_count_util_1.syncProductPlantCount)(this.productModel, this.productPlantModel, context.targetProduct._id, now, session)];
                                            case 5:
                                                plantCountAfter = _a.sent();
                                                return [4 /*yield*/, this.plantMergeAuditModel.create([
                                                        {
                                                            sourcePlantIds: copyResult.sourcePlantIds,
                                                            sourceProductPlantIds: copyResult.sourceProductPlantIds,
                                                            copiedPlantIds: copyResult.copiedPlantIds,
                                                            copiedProductPlantIds: copyResult.copiedProductPlantIds,
                                                            productId: context.sourceProduct._id,
                                                            targetProductId: context.targetProduct._id,
                                                            productIdNumeric: context.sourceProduct.productId,
                                                            eoiNo: context.sourceProduct.eoiNo,
                                                            urnNo: context.sourceProduct.urnNo,
                                                            targetUrnNo: context.targetProduct.urnNo,
                                                            targetEoiNo: context.targetProduct.eoiNo,
                                                            categoryId: context.sourceProduct.categoryId,
                                                            vendorId: context.sourceProduct.vendorId,
                                                            manufacturerId: context.sourceProduct.manufacturerId,
                                                            manufacturingUnitsRemoved: [],
                                                            manufacturingUnitsSkipped: copyResult.manufacturingUnitsSkipped,
                                                            plantCountBefore: plantCountBefore,
                                                            plantCountAfter: plantCountAfter,
                                                            mergeStrategy: plant_merge_constants_1.PLANT_MERGE_STRATEGY_URN_COPY,
                                                            mergeStatus: plant_merge_constants_1.PLANT_MERGE_STATUS.COMPLETED,
                                                            mergedBy: adminObjectId,
                                                            mergedAt: now,
                                                        },
                                                    ], sessionOpts)];
                                            case 6:
                                                audit = _a.sent();
                                                executed.push({
                                                    sourceEoiNo: context.pair.sourceEoiNo,
                                                    targetUrnNo: context.pair.targetUrnNo,
                                                    targetEoiNo: context.pair.targetEoiNo,
                                                    productName: context.pair.productName,
                                                    mergeId: String(audit[0]._id),
                                                    mergeStatus: plant_merge_constants_1.PLANT_MERGE_STATUS.COMPLETED,
                                                    plantsCopied: copyResult.copiedPlantIds.length,
                                                    plantsSkipped: copyResult.manufacturingUnitsSkipped.length,
                                                    plantCountBefore: plantCountBefore,
                                                    plantCountAfter: plantCountAfter,
                                                    sourcePlantIds: copyResult.sourcePlantIds.map(function (id) { return String(id); }),
                                                    copiedPlantIds: copyResult.copiedPlantIds.map(function (id) { return String(id); }),
                                                    skippedPlantNames: __spreadArray([], copyResult.manufacturingUnitsSkipped, true),
                                                });
                                                _a.label = 7;
                                            case 7:
                                                _i++;
                                                return [3 /*break*/, 1];
                                            case 8: return [2 /*return*/, executed];
                                        }
                                    });
                                }); })];
                        case 4:
                            results = _a.sent();
                            _loop_1 = function (result) {
                                var context, logError_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            context = pairContexts.find(function (row) { return row.pair.sourceEoiNo === result.sourceEoiNo; });
                                            if (!context)
                                                return [2 /*return*/, "continue"];
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this_1.activityLogService.logActivity({
                                                    vendor_id: context.sourceProduct.vendorId,
                                                    manufacturer_id: context.sourceProduct.manufacturerId,
                                                    urn_no: context.sourceProduct.urnNo,
                                                    activities_id: 0,
                                                    activity: "Admin copied ".concat(result.plantsCopied, " plant(s) from EOI ").concat(result.sourceEoiNo, " (URN ").concat(sourceUrnNo, ") to EOI ").concat(result.targetEoiNo, " (URN ").concat(result.targetUrnNo, ")"),
                                                    activity_status: 1,
                                                    responsibility: 'Admin',
                                                })];
                                        case 2:
                                            _b.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            logError_1 = _b.sent();
                                            this_1.logger.warn("Activity log failed after URN plant merge for EOI ".concat(result.sourceEoiNo), logError_1 instanceof Error ? logError_1.stack : String(logError_1));
                                            return [3 /*break*/, 4];
                                        case 4:
                                            this_1.lifecycleNotification
                                                .notifyPlantMerged({
                                                manufacturerId: String(context.targetProduct.manufacturerId),
                                                urnNo: result.targetUrnNo,
                                                eoiNo: result.targetEoiNo,
                                                productName: result.productName,
                                                mergeSummary: "".concat(result.plantsCopied, " plant(s) were copied from URN ").concat(sourceUrnNo, " / EOI ").concat(result.sourceEoiNo, " into URN ").concat(result.targetUrnNo, " / EOI ").concat(result.targetEoiNo, "."),
                                            })
                                                .catch(function (err) {
                                                return _this.logger.warn("Plant merge notification failed for EOI ".concat(result.sourceEoiNo, ": ").concat(err.message));
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, results_1 = results;
                            _a.label = 5;
                        case 5:
                            if (!(_i < results_1.length)) return [3 /*break*/, 8];
                            result = results_1[_i];
                            return [5 /*yield**/, _loop_1(result)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 5];
                        case 8: return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 9:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    sourceUrnNo: sourceUrnNo,
                                    pairsExecuted: results.length,
                                    results: results,
                                }];
                    }
                });
            });
        };
        PlantMergeUrnExecuteService_1.prototype.resolveExecutePairs = function (sourceUrnNo, explicitPairs) {
            return __awaiter(this, void 0, void 0, function () {
                var preview;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (explicitPairs && explicitPairs.length > 0) {
                                return [2 /*return*/, explicitPairs.map(function (pair) { return ({
                                        sourceEoiNo: (0, merge_eligibility_shared_1.normalizeTrimmedValue)(pair.sourceEoiNo),
                                        targetUrnNo: (0, merge_eligibility_shared_1.normalizeTrimmedValue)(pair.targetUrnNo),
                                        targetEoiNo: (0, merge_eligibility_shared_1.normalizeTrimmedValue)(pair.targetEoiNo),
                                        productName: '',
                                    }); })];
                            }
                            return [4 /*yield*/, this.plantMergeUrnPreviewService.previewBySourceUrn(sourceUrnNo)];
                        case 1:
                            preview = _a.sent();
                            return [2 /*return*/, preview.items
                                    .filter(function (item) {
                                    return item.mergeStatus === plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.READY &&
                                        item.targetUrn &&
                                        item.targetEoi;
                                })
                                    .map(function (item) { return ({
                                    sourceEoiNo: item.sourceEoi,
                                    targetUrnNo: String(item.targetUrn),
                                    targetEoiNo: String(item.targetEoi),
                                    productName: item.productName,
                                }); })];
                    }
                });
            });
        };
        PlantMergeUrnExecuteService_1.prototype.assertAllPairsValid = function (sourceUrnNo, pairs) {
            return __awaiter(this, void 0, void 0, function () {
                var blockers, _i, pairs_1, pair, validation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            blockers = [];
                            _i = 0, pairs_1 = pairs;
                            _a.label = 1;
                        case 1:
                            if (!(_i < pairs_1.length)) return [3 /*break*/, 4];
                            pair = pairs_1[_i];
                            return [4 /*yield*/, this.validatePair(sourceUrnNo, pair)];
                        case 2:
                            validation = _a.sent();
                            if (!validation.canMerge) {
                                blockers.push(this.formatPairValidationError(pair, validation));
                            }
                            else if (!pair.productName && validation.productName) {
                                pair.productName = validation.productName;
                            }
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            if (blockers.length > 0) {
                                throw new common_1.BadRequestException(blockers.join(' | '));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PlantMergeUrnExecuteService_1.prototype.assertPairValidInTransaction = function (sourceUrnNo, pair) {
            return __awaiter(this, void 0, void 0, function () {
                var validation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.validatePair(sourceUrnNo, pair)];
                        case 1:
                            validation = _a.sent();
                            if (!validation.canMerge) {
                                throw new common_1.BadRequestException(this.formatPairValidationError(pair, validation));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PlantMergeUrnExecuteService_1.prototype.validatePair = function (sourceUrnNo, pair) {
            return this.plantMergeUrnValidationService.validate({
                sourceUrnNo: sourceUrnNo,
                targetUrnNo: pair.targetUrnNo,
                sourceEoiNo: pair.sourceEoiNo,
                targetEoiNo: pair.targetEoiNo,
            });
        };
        PlantMergeUrnExecuteService_1.prototype.formatPairValidationError = function (pair, validation) {
            var messages = validation.blockers.map(function (blocker) { return blocker.message; });
            return "EOI ".concat(pair.sourceEoiNo, " \u2192 ").concat(pair.targetUrnNo, "/").concat(pair.targetEoiNo, ": ").concat(messages.join('; '));
        };
        PlantMergeUrnExecuteService_1.prototype.loadPairContext = function (sourceUrnNo, pair) {
            return __awaiter(this, void 0, void 0, function () {
                var sourceProduct, targetProduct;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findProduct(sourceUrnNo, pair.sourceEoiNo)];
                        case 1:
                            sourceProduct = _a.sent();
                            return [4 /*yield*/, this.findProduct(pair.targetUrnNo, pair.targetEoiNo)];
                        case 2:
                            targetProduct = _a.sent();
                            if (!sourceProduct || !targetProduct) {
                                throw new common_1.BadRequestException("Product not found for plant merge pair EOI ".concat(pair.sourceEoiNo));
                            }
                            if (!pair.productName) {
                                pair.productName = sourceProduct.productName;
                            }
                            return [2 /*return*/, { pair: pair, sourceProduct: sourceProduct, targetProduct: targetProduct }];
                    }
                });
            });
        };
        PlantMergeUrnExecuteService_1.prototype.findProduct = function (urnNo, eoiNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, plant_merge_product_lookup_util_1.findActiveProductOnUrn)(this.productModel, urnNo, eoiNo, plant_merge_product_lookup_util_1.PLANT_MERGE_URN_EXECUTE_PRODUCT_SELECT)];
                });
            });
        };
        return PlantMergeUrnExecuteService_1;
    }());
    __setFunctionName(_classThis, "PlantMergeUrnExecuteService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlantMergeUrnExecuteService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlantMergeUrnExecuteService = _classThis;
}();
exports.PlantMergeUrnExecuteService = PlantMergeUrnExecuteService;
