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
exports.PlantMergeUrnPreviewService = void 0;
var common_1 = require("@nestjs/common");
var active_product_filter_1 = require("../../constants/active-product.filter");
var product_status_constants_1 = require("../../../renew/constants/product-status.constants");
var merge_eligibility_shared_1 = require("../../helpers/merge-eligibility.shared");
var plant_merge_urn_preview_constants_1 = require("../plant-merge-urn-preview.constants");
var plant_merge_urn_target_util_1 = require("../helpers/plant-merge-urn-target.util");
var sync_product_plant_count_util_1 = require("../../helpers/sync-product-plant-count.util");
var PlantMergeUrnPreviewService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlantMergeUrnPreviewService = _classThis = /** @class */ (function () {
        function PlantMergeUrnPreviewService_1(productModel, productPlantModel, plantMergeUrnValidationService) {
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.plantMergeUrnValidationService = plantMergeUrnValidationService;
        }
        /**
         * Read-only preview: for each certified EOI on the source URN, resolve the oldest
         * certified matching product on a different URN (same name, manufacturer, category).
         */
        PlantMergeUrnPreviewService_1.prototype.previewBySourceUrn = function (sourceUrnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var sourceUrn, sourceProducts, candidates, items;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sourceUrn = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(sourceUrnNo);
                            if (!sourceUrn) {
                                throw new common_1.BadRequestException('sourceUrnNo is required');
                            }
                            return [4 /*yield*/, this.fetchCertifiedProductsOnUrn(sourceUrn)];
                        case 1:
                            sourceProducts = _a.sent();
                            if (sourceProducts.length === 0) {
                                return [2 /*return*/, {
                                        success: true,
                                        sourceUrnNo: sourceUrn,
                                        items: [],
                                        summary: { total: 0, ready: 0, blocked: 0, noTarget: 0 },
                                    }];
                            }
                            return [4 /*yield*/, this.fetchCertifiedTargetCandidates(sourceProducts)];
                        case 2:
                            candidates = _a.sent();
                            return [4 /*yield*/, Promise.all(sourceProducts.map(function (source) {
                                    return _this.buildPreviewItem(source, candidates, sourceUrn);
                                }))];
                        case 3:
                            items = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    sourceUrnNo: sourceUrn,
                                    items: items,
                                    summary: this.buildSummary(items),
                                }];
                    }
                });
            });
        };
        PlantMergeUrnPreviewService_1.prototype.buildSummary = function (items) {
            return {
                total: items.length,
                ready: items.filter(function (item) { return item.mergeStatus === plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.READY; }).length,
                blocked: items.filter(function (item) { return item.mergeStatus === plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED; }).length,
                noTarget: items.filter(function (item) { return item.mergeStatus === plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET; }).length,
            };
        };
        PlantMergeUrnPreviewService_1.prototype.fetchCertifiedProductsOnUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .find((0, active_product_filter_1.matchActiveProducts)({
                                urnNo: urnNo,
                                productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                            }))
                                .select('_id productId productName eoiNo urnNo categoryId manufacturerId productStatus certifiedDate createdDate')
                                .sort({ eoiNo: 1 })
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows];
                    }
                });
            });
        };
        PlantMergeUrnPreviewService_1.prototype.fetchCertifiedTargetCandidates = function (sourceProducts) {
            return __awaiter(this, void 0, void 0, function () {
                var nameKeys, manufacturerIds, categoryIds, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            nameKeys = new Set(sourceProducts
                                .map(function (product) { return (0, plant_merge_urn_target_util_1.exactProductNameKey)(product.productName); })
                                .filter(Boolean));
                            manufacturerIds = __spreadArray([], new Map(sourceProducts.map(function (product) { return [
                                String(product.manufacturerId),
                                product.manufacturerId,
                            ]; })).values(), true);
                            categoryIds = __spreadArray([], new Map(sourceProducts.map(function (product) { return [
                                String(product.categoryId),
                                product.categoryId,
                            ]; })).values(), true);
                            if (nameKeys.size === 0 || manufacturerIds.length === 0 || categoryIds.length === 0) {
                                return [2 /*return*/, []];
                            }
                            return [4 /*yield*/, this.productModel
                                    .find((0, active_product_filter_1.matchActiveProducts)({
                                    productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                    manufacturerId: { $in: manufacturerIds },
                                    categoryId: { $in: categoryIds },
                                }))
                                    .select('_id productName urnNo eoiNo categoryId manufacturerId productStatus certifiedDate createdDate')
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.filter(function (row) {
                                    return nameKeys.has((0, plant_merge_urn_target_util_1.exactProductNameKey)(row.productName));
                                })];
                    }
                });
            });
        };
        PlantMergeUrnPreviewService_1.prototype.buildPreviewItem = function (source, candidates, sourceUrn) {
            return __awaiter(this, void 0, void 0, function () {
                var sourcePlantCount, target, failureReason, blockers;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, sync_product_plant_count_util_1.countActivePlantsForProduct)(this.productPlantModel, source._id)];
                        case 1:
                            sourcePlantCount = _b.sent();
                            if (sourcePlantCount === 0) {
                                return [2 /*return*/, {
                                        productName: source.productName,
                                        sourceEoi: source.eoiNo,
                                        sourceUrn: sourceUrn,
                                        targetUrn: null,
                                        targetEoi: null,
                                        mergeStatus: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED,
                                        failureReason: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_FAILURE.SOURCE_NO_PLANTS,
                                        sourcePlantCount: sourcePlantCount,
                                    }];
                            }
                            target = (0, plant_merge_urn_target_util_1.findOldestMatchingCertifiedTarget)(source, candidates, sourceUrn);
                            if (!target) {
                                failureReason = (0, plant_merge_urn_target_util_1.hasNewerMatchingCertifiedCandidate)(source, candidates, sourceUrn)
                                    ? plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_FAILURE.BRAND_NEW_PRODUCT
                                    : plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_FAILURE.NO_MATCHING_TARGET;
                                return [2 /*return*/, {
                                        productName: source.productName,
                                        sourceEoi: source.eoiNo,
                                        sourceUrn: sourceUrn,
                                        targetUrn: null,
                                        targetEoi: null,
                                        mergeStatus: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET,
                                        failureReason: failureReason,
                                        sourcePlantCount: sourcePlantCount,
                                    }];
                            }
                            return [4 /*yield*/, this.plantMergeUrnValidationService.validateResolvedPair(this.toValidationProduct(source), this.toValidationProduct(__assign(__assign({}, target), { productStatus: (_a = target.productStatus) !== null && _a !== void 0 ? _a : product_status_constants_1.PRODUCT_STATUS_CERTIFIED })), sourceUrn)];
                        case 2:
                            blockers = _b.sent();
                            if (blockers.length > 0) {
                                return [2 /*return*/, {
                                        productName: source.productName,
                                        sourceEoi: source.eoiNo,
                                        sourceUrn: sourceUrn,
                                        targetUrn: target.urnNo,
                                        targetEoi: target.eoiNo,
                                        mergeStatus: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED,
                                        failureReason: blockers.map(function (blocker) { return blocker.message; }).join('; '),
                                        sourcePlantCount: sourcePlantCount,
                                    }];
                            }
                            return [2 /*return*/, {
                                    productName: source.productName,
                                    sourceEoi: source.eoiNo,
                                    sourceUrn: sourceUrn,
                                    targetUrn: target.urnNo,
                                    targetEoi: target.eoiNo,
                                    mergeStatus: plant_merge_urn_preview_constants_1.PLANT_MERGE_URN_PREVIEW_STATUS.READY,
                                    failureReason: null,
                                    sourcePlantCount: sourcePlantCount,
                                }];
                    }
                });
            });
        };
        PlantMergeUrnPreviewService_1.prototype.toValidationProduct = function (product) {
            var _a;
            if (!product._id) {
                throw new Error('Product row is missing _id for plant merge validation');
            }
            return {
                _id: product._id,
                productName: product.productName,
                eoiNo: product.eoiNo,
                urnNo: product.urnNo,
                productStatus: Number((_a = product.productStatus) !== null && _a !== void 0 ? _a : product_status_constants_1.PRODUCT_STATUS_CERTIFIED),
                categoryId: product.categoryId,
                manufacturerId: product.manufacturerId,
                certifiedDate: product.certifiedDate,
                createdDate: product.createdDate,
            };
        };
        return PlantMergeUrnPreviewService_1;
    }());
    __setFunctionName(_classThis, "PlantMergeUrnPreviewService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlantMergeUrnPreviewService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlantMergeUrnPreviewService = _classThis;
}();
exports.PlantMergeUrnPreviewService = PlantMergeUrnPreviewService;
