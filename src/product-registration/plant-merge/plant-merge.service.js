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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantMergeService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var active_product_filter_1 = require("../constants/active-product.filter");
var active_product_filter_2 = require("../constants/active-product.filter");
var mongo_session_util_1 = require("../../renew/helpers/mongo-session.util");
var plant_merge_constants_1 = require("./plant-merge.constants");
var plant_merge_eligibility_util_1 = require("./helpers/plant-merge-eligibility.util");
var merge_eligibility_shared_1 = require("../helpers/merge-eligibility.shared");
var renewal_cycle_eligibility_util_1 = require("../helpers/renewal-cycle-eligibility.util");
var sync_product_plant_count_util_1 = require("../helpers/sync-product-plant-count.util");
var PlantMergeService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlantMergeService = _classThis = /** @class */ (function () {
        function PlantMergeService_1(productModel, productPlantModel, renewalCycleModel, plantMergeAuditModel, connection, activityLogService, lifecycleNotification) {
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.renewalCycleModel = renewalCycleModel;
            this.plantMergeAuditModel = plantMergeAuditModel;
            this.connection = connection;
            this.activityLogService = activityLogService;
            this.lifecycleNotification = lifecycleNotification;
            this.logger = new common_1.Logger(PlantMergeService.name);
        }
        PlantMergeService_1.prototype.preview = function (productId, targetPlantId, sourcePlantIds) {
            return __awaiter(this, void 0, void 0, function () {
                var context, hasValidPlants, _a, manufacturingUnitRemovals, manufacturingUnitConflicts, _b, emptyPlant;
                var _this = this;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.buildMergeContext(productId, targetPlantId, sourcePlantIds)];
                        case 1:
                            context = _d.sent();
                            hasValidPlants = Boolean((_c = context.targetPlant) === null || _c === void 0 ? void 0 : _c._id) && context.sourcePlants.length > 0;
                            if (!hasValidPlants) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.planManufacturingUnitChanges(context.product.urnNo, context.targetPlant, context.sourcePlants)];
                        case 2:
                            _b = _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _b = {
                                manufacturingUnitRemovals: [],
                                manufacturingUnitConflicts: [],
                            };
                            _d.label = 4;
                        case 4:
                            _a = _b, manufacturingUnitRemovals = _a.manufacturingUnitRemovals, manufacturingUnitConflicts = _a.manufacturingUnitConflicts;
                            emptyPlant = {
                                plantId: '',
                                productPlantId: 0,
                                plantName: '',
                                location: '',
                            };
                            return [2 /*return*/, {
                                    success: true,
                                    canMerge: context.blockers.length === 0,
                                    urnNo: context.product.urnNo,
                                    eoiNo: context.product.eoiNo,
                                    productId: String(context.product._id),
                                    productIdNumeric: context.product.productId,
                                    productName: context.product.productName,
                                    targetPlant: hasValidPlants
                                        ? this.toPreviewPlant(context.targetPlant)
                                        : emptyPlant,
                                    sourcePlants: context.sourcePlants.map(function (plant) {
                                        return _this.toPreviewPlant(plant);
                                    }),
                                    plantCountBefore: context.plantCountBefore,
                                    plantCountAfter: context.plantCountAfter,
                                    blockers: context.blockers,
                                    manufacturingUnitRemovals: manufacturingUnitRemovals,
                                    manufacturingUnitConflicts: manufacturingUnitConflicts,
                                    warnings: context.warnings,
                                }];
                    }
                });
            });
        };
        PlantMergeService_1.prototype.execute = function (dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var strategy, preview, firstBlockerMessage, context, adminObjectId, now, sourceObjectIds, sourceProductPlantIds, manufacturingUnitsRemoved, manufacturingUnitsSkipped, plantCountAfter, mergeId, targetPlantName, logError_1;
                var _this = this;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            strategy = String((_a = dto.mergeStrategy) !== null && _a !== void 0 ? _a : plant_merge_constants_1.PLANT_MERGE_STRATEGY_ABSORB);
                            if (strategy !== plant_merge_constants_1.PLANT_MERGE_STRATEGY_ABSORB) {
                                throw new common_1.BadRequestException("Unsupported mergeStrategy: ".concat(strategy));
                            }
                            return [4 /*yield*/, this.preview(dto.productId, dto.targetPlantId, dto.sourcePlantIds)];
                        case 1:
                            preview = _e.sent();
                            if (!preview.canMerge) {
                                firstBlockerMessage = String((_d = (_c = (_b = preview.blockers) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : '').trim();
                                throw new common_1.BadRequestException(firstBlockerMessage || 'Merge cannot be completed due to validation rules.');
                            }
                            return [4 /*yield*/, this.buildMergeContext(dto.productId, dto.targetPlantId, dto.sourcePlantIds)];
                        case 2:
                            context = _e.sent();
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            now = new Date();
                            sourceObjectIds = context.sourcePlants.map(function (plant) { return plant._id; });
                            sourceProductPlantIds = context.sourcePlants.map(function (plant) { return plant.productPlantId; });
                            manufacturingUnitsRemoved = [];
                            manufacturingUnitsSkipped = [];
                            plantCountAfter = context.plantCountAfter;
                            return [4 /*yield*/, (0, mongo_session_util_1.runInTransactionIfSupported)(this.connection, function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var sessionOpts, unitResult, audit;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                sessionOpts = session ? { session: session } : {};
                                                return [4 /*yield*/, this.productPlantModel.updateMany((0, active_product_filter_2.matchActiveProductPlants)({ _id: { $in: sourceObjectIds } }), {
                                                        $set: {
                                                            is_deleted: true,
                                                            deleted_at: now,
                                                            deleted_by: adminObjectId,
                                                            mergedIntoPlantId: context.targetPlant._id,
                                                            mergedAt: now,
                                                        },
                                                    }, sessionOpts)];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, (0, sync_product_plant_count_util_1.syncProductPlantCount)(this.productModel, this.productPlantModel, context.product._id, now, session)];
                                            case 2:
                                                plantCountAfter = _a.sent();
                                                return [4 /*yield*/, this.applyManufacturingUnitChanges(context.product.urnNo, context.targetPlant, context.sourcePlants, session)];
                                            case 3:
                                                unitResult = _a.sent();
                                                manufacturingUnitsRemoved = unitResult.removed;
                                                manufacturingUnitsSkipped = unitResult.skipped;
                                                return [4 /*yield*/, this.plantMergeAuditModel.create([
                                                        {
                                                            sourcePlantIds: sourceObjectIds,
                                                            sourceProductPlantIds: sourceProductPlantIds,
                                                            targetPlantId: context.targetPlant._id,
                                                            targetProductPlantId: context.targetPlant.productPlantId,
                                                            productId: context.product._id,
                                                            productIdNumeric: context.product.productId,
                                                            eoiNo: context.product.eoiNo,
                                                            urnNo: context.product.urnNo,
                                                            categoryId: context.product.categoryId,
                                                            vendorId: context.product.vendorId,
                                                            manufacturerId: context.product.manufacturerId,
                                                            manufacturingUnitsRemoved: manufacturingUnitsRemoved,
                                                            manufacturingUnitsSkipped: manufacturingUnitsSkipped,
                                                            plantCountBefore: context.plantCountBefore,
                                                            plantCountAfter: plantCountAfter,
                                                            mergeStrategy: strategy,
                                                            mergeStatus: plant_merge_constants_1.PLANT_MERGE_STATUS.COMPLETED,
                                                            mergedBy: adminObjectId,
                                                            mergedAt: now,
                                                        },
                                                    ], sessionOpts)];
                                            case 4:
                                                audit = _a.sent();
                                                return [2 /*return*/, String(audit[0]._id)];
                                        }
                                    });
                                }); })];
                        case 3:
                            mergeId = _e.sent();
                            targetPlantName = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(context.targetPlant.plantName);
                            _e.label = 4;
                        case 4:
                            _e.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.activityLogService.logActivity({
                                    vendor_id: context.product.vendorId,
                                    manufacturer_id: context.product.manufacturerId,
                                    urn_no: context.product.urnNo,
                                    activities_id: 0,
                                    activity: "Admin merged ".concat(sourceObjectIds.length, " plant(s) into \"").concat(targetPlantName, "\" for EOI ").concat(context.product.eoiNo, " (URN ").concat(context.product.urnNo, ")"),
                                    activity_status: 1,
                                    responsibility: 'Admin',
                                })];
                        case 5:
                            _e.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            logError_1 = _e.sent();
                            this.logger.warn("Activity log failed after plant merge on EOI ".concat(context.product.eoiNo), logError_1 instanceof Error ? logError_1.stack : String(logError_1));
                            return [3 /*break*/, 7];
                        case 7:
                            this.lifecycleNotification
                                .notifyPlantMerged({
                                manufacturerId: String(context.product.manufacturerId),
                                urnNo: context.product.urnNo,
                                eoiNo: context.product.eoiNo,
                                productName: context.product.productName,
                                mergeSummary: "".concat(sourceObjectIds.length, " plant(s) were merged into \"").concat(targetPlantName, "\"."),
                            })
                                .catch(function (err) {
                                return _this.logger.warn("Plant merge notification failed: ".concat(err.message));
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    mergeId: mergeId,
                                    urnNo: context.product.urnNo,
                                    eoiNo: context.product.eoiNo,
                                    targetPlantId: String(context.targetPlant._id),
                                    absorbedPlantIds: sourceObjectIds.map(function (id) { return String(id); }),
                                    plantCountAfter: plantCountAfter,
                                    manufacturingUnitsRemoved: manufacturingUnitsRemoved,
                                    manufacturingUnitsSkipped: manufacturingUnitsSkipped,
                                    targetDetailsUrl: "/api/admin/products/details/".concat(context.product.urnNo),
                                }];
                    }
                });
            });
        };
        PlantMergeService_1.prototype.toPreviewPlant = function (plant) {
            return {
                plantId: String(plant._id),
                productPlantId: plant.productPlantId,
                plantName: plant.plantName,
                location: (0, plant_merge_eligibility_util_1.derivePlantLocationLabel)(plant),
            };
        };
        PlantMergeService_1.prototype.fetchProduct = function (productObjectId) {
            return __awaiter(this, void 0, void 0, function () {
                var row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .findOne(__assign({ _id: productObjectId }, (0, active_product_filter_1.matchActiveProducts)()))
                                .select('_id productId eoiNo productName productStatus urnNo plantCount categoryId vendorId manufacturerId urnStatus productRenewStatus')
                                .lean()
                                .exec()];
                        case 1:
                            row = _a.sent();
                            return [2 /*return*/, row];
                    }
                });
            });
        };
        PlantMergeService_1.prototype.fetchActivePlantsForProduct = function (productObjectId) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productPlantModel
                                .aggregate([
                                {
                                    $match: (0, active_product_filter_2.matchActiveProductPlants)({ productId: productObjectId }),
                                },
                                {
                                    $lookup: {
                                        from: 'states',
                                        localField: 'stateId',
                                        foreignField: '_id',
                                        as: 'state',
                                    },
                                },
                                { $sort: { createdDate: 1 } },
                            ])
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h;
                                    var stateDoc = Array.isArray(row.state)
                                        ? row.state[0]
                                        : undefined;
                                    return {
                                        _id: row._id,
                                        productPlantId: Number((_a = row.productPlantId) !== null && _a !== void 0 ? _a : 0),
                                        productId: row.productId,
                                        urnNo: String((_b = row.urnNo) !== null && _b !== void 0 ? _b : ''),
                                        eoiNo: String((_c = row.eoiNo) !== null && _c !== void 0 ? _c : ''),
                                        plantName: String((_d = row.plantName) !== null && _d !== void 0 ? _d : ''),
                                        plantLocation: String((_e = row.plantLocation) !== null && _e !== void 0 ? _e : ''),
                                        city: String((_f = row.city) !== null && _f !== void 0 ? _f : ''),
                                        stateId: row.stateId,
                                        vendorId: row.vendorId,
                                        manufacturerId: row.manufacturerId,
                                        categoryId: row.categoryId,
                                        stateName: (_h = (_g = stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.stateName) !== null && _g !== void 0 ? _g : stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.name) !== null && _h !== void 0 ? _h : null,
                                    };
                                })];
                    }
                });
            });
        };
        PlantMergeService_1.prototype.resolvePlantById = function (plants, plantId) {
            var key = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(plantId);
            return plants.find(function (plant) { return String(plant._id) === key; });
        };
        PlantMergeService_1.prototype.resolvePlantsByIds = function (plants, plantIds) {
            var found = [];
            var missing = [];
            for (var _i = 0, plantIds_1 = plantIds; _i < plantIds_1.length; _i++) {
                var plantId = plantIds_1[_i];
                var row = this.resolvePlantById(plants, plantId);
                if (row) {
                    found.push(row);
                }
                else {
                    missing.push(plantId);
                }
            }
            return { found: found, missing: missing };
        };
        PlantMergeService_1.prototype.buildMergeContext = function (productId, targetPlantId, sourcePlantIds) {
            return __awaiter(this, void 0, void 0, function () {
                var blockers, warnings, productObjectId, normalizedTargetId, normalizedSourceIds, product, activePlants, plantCountBefore, targetPlant, _a, sourcePlants, missing, _i, sourcePlants_1, source, plantCountAfter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            blockers = [];
                            warnings = [];
                            productObjectId = (0, merge_eligibility_shared_1.parseObjectId)(productId, 'productId');
                            if (!productObjectId) {
                                throw new common_1.BadRequestException('Invalid productId');
                            }
                            normalizedTargetId = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(targetPlantId);
                            normalizedSourceIds = sourcePlantIds
                                .map(function (id) { return (0, merge_eligibility_shared_1.normalizeTrimmedValue)(id); })
                                .filter(Boolean);
                            blockers.push.apply(blockers, (0, plant_merge_eligibility_util_1.validateSourcePlantSelection)(normalizedTargetId, normalizedSourceIds));
                            return [4 /*yield*/, this.fetchProduct(productObjectId)];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                blockers.push({
                                    code: 'PRODUCT_NOT_FOUND',
                                    message: 'Active product not found for plant merge',
                                });
                                return [2 /*return*/, this.emptyContext(blockers, warnings)];
                            }
                            if (!(0, plant_merge_eligibility_util_1.isCertifiedProduct)(product)) {
                                blockers.push({
                                    code: 'PRODUCT_NOT_CERTIFIED',
                                    message: 'Plant merge is only allowed for certified products',
                                });
                            }
                            blockers.push.apply(blockers, (0, plant_merge_eligibility_util_1.buildProductRenewalBlockers)('Product', product));
                            return [4 /*yield*/, (0, renewal_cycle_eligibility_util_1.hasInProgressRenewalCycle)(this.renewalCycleModel, product.urnNo)];
                        case 2:
                            if (_b.sent()) {
                                blockers.push({
                                    code: 'RENEWAL_CYCLE_IN_PROGRESS',
                                    message: "URN ".concat(product.urnNo, " has an in-progress renewal cycle"),
                                });
                            }
                            return [4 /*yield*/, this.fetchActivePlantsForProduct(productObjectId)];
                        case 3:
                            activePlants = _b.sent();
                            plantCountBefore = activePlants.length;
                            if (plantCountBefore < 2) {
                                blockers.push({
                                    code: 'MIN_PLANTS_REQUIRED',
                                    message: 'At least two active plants are required to perform a plant merge',
                                });
                            }
                            targetPlant = this.resolvePlantById(activePlants, normalizedTargetId);
                            if (!targetPlant) {
                                blockers.push({
                                    code: 'TARGET_PLANT_NOT_FOUND',
                                    message: 'Target plant not found on this product',
                                });
                            }
                            _a = this.resolvePlantsByIds(activePlants, normalizedSourceIds), sourcePlants = _a.found, missing = _a.missing;
                            if (missing.length > 0) {
                                blockers.push({
                                    code: 'SOURCE_PLANTS_NOT_FOUND',
                                    message: "Source plant(s) not found: ".concat(missing.join(', ')),
                                });
                            }
                            if (targetPlant) {
                                for (_i = 0, sourcePlants_1 = sourcePlants; _i < sourcePlants_1.length; _i++) {
                                    source = sourcePlants_1[_i];
                                    if (!(0, plant_merge_eligibility_util_1.plantBelongsToProduct)(source, productObjectId)) {
                                        blockers.push({
                                            code: 'PLANT_PRODUCT_MISMATCH',
                                            message: 'All plants must belong to the same product',
                                        });
                                        break;
                                    }
                                }
                            }
                            blockers.push.apply(blockers, (0, plant_merge_eligibility_util_1.validateRemainingPlantCount)(plantCountBefore, sourcePlants.length));
                            if (Number(product.plantCount) !== plantCountBefore) {
                                warnings.push("Product plantCount (".concat(product.plantCount, ") differs from active plant rows (").concat(plantCountBefore, "); count will be reconciled on merge"));
                            }
                            plantCountAfter = plantCountBefore - sourcePlants.length;
                            return [2 /*return*/, {
                                    blockers: blockers,
                                    warnings: warnings,
                                    product: product,
                                    targetPlant: targetPlant,
                                    sourcePlants: sourcePlants,
                                    plantCountBefore: plantCountBefore,
                                    plantCountAfter: plantCountAfter,
                                }];
                    }
                });
            });
        };
        PlantMergeService_1.prototype.emptyContext = function (blockers, warnings) {
            return {
                blockers: blockers,
                warnings: warnings,
                product: {
                    _id: new mongoose_1.Types.ObjectId(),
                    productId: 0,
                    eoiNo: '',
                    productName: '',
                    productStatus: 0,
                    urnNo: '',
                    plantCount: 0,
                    categoryId: new mongoose_1.Types.ObjectId(),
                    vendorId: new mongoose_1.Types.ObjectId(),
                    manufacturerId: new mongoose_1.Types.ObjectId(),
                    urnStatus: 0,
                    productRenewStatus: 0,
                },
                targetPlant: {
                    _id: new mongoose_1.Types.ObjectId(),
                    productPlantId: 0,
                    productId: new mongoose_1.Types.ObjectId(),
                    urnNo: '',
                    eoiNo: '',
                    plantName: '',
                    plantLocation: '',
                    city: '',
                    vendorId: new mongoose_1.Types.ObjectId(),
                    manufacturerId: new mongoose_1.Types.ObjectId(),
                    categoryId: new mongoose_1.Types.ObjectId(),
                },
                sourcePlants: [],
                plantCountBefore: 0,
                plantCountAfter: 0,
            };
        };
        PlantMergeService_1.prototype.unitNameFromPlant = function (plant) {
            return (0, merge_eligibility_shared_1.normalizeTrimmedValue)(plant.plantName);
        };
        PlantMergeService_1.prototype.planManufacturingUnitChanges = function (urnNo, targetPlant, sourcePlants) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturingUnitRemovals, manufacturingUnitConflicts, targetUnitName, _i, PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS_1, collection, _a, sourcePlants_2, source, unitName, sourceRows, sameNameAsTarget;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            manufacturingUnitRemovals = [];
                            manufacturingUnitConflicts = [];
                            targetUnitName = (0, plant_merge_eligibility_util_1.normalizePlantNameKey)(targetPlant.plantName);
                            _i = 0, PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS_1 = plant_merge_constants_1.PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS;
                            _b.label = 1;
                        case 1:
                            if (!(_i < PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS_1.length)) return [3 /*break*/, 6];
                            collection = PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS_1[_i];
                            _a = 0, sourcePlants_2 = sourcePlants;
                            _b.label = 2;
                        case 2:
                            if (!(_a < sourcePlants_2.length)) return [3 /*break*/, 5];
                            source = sourcePlants_2[_a];
                            unitName = this.unitNameFromPlant(source);
                            if (!unitName)
                                return [3 /*break*/, 4];
                            return [4 /*yield*/, this.connection.db
                                    .collection(collection)
                                    .find({ urnNo: urnNo, unitName: unitName })
                                    .toArray()];
                        case 3:
                            sourceRows = _b.sent();
                            if (sourceRows.length === 0) {
                                return [3 /*break*/, 4];
                            }
                            sameNameAsTarget = (0, plant_merge_eligibility_util_1.normalizePlantNameKey)(source.plantName) === targetUnitName;
                            if (sameNameAsTarget) {
                                manufacturingUnitConflicts.push({
                                    collection: collection,
                                    unitName: unitName,
                                    action: 'keep_target_unit_rows',
                                });
                            }
                            else {
                                manufacturingUnitRemovals.push({
                                    collection: collection,
                                    unitName: unitName,
                                    action: 'remove_source_unit_rows',
                                });
                            }
                            _b.label = 4;
                        case 4:
                            _a++;
                            return [3 /*break*/, 2];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, { manufacturingUnitRemovals: manufacturingUnitRemovals, manufacturingUnitConflicts: manufacturingUnitConflicts }];
                    }
                });
            });
        };
        PlantMergeService_1.prototype.applyManufacturingUnitChanges = function (urnNo, targetPlant, sourcePlants, session) {
            return __awaiter(this, void 0, void 0, function () {
                var removed, skipped, sessionOpts, targetUnitName, _i, PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS_2, collection, _a, sourcePlants_3, source, unitName, sameNameAsTarget, deleteResult;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            removed = [];
                            skipped = [];
                            sessionOpts = session ? { session: session } : {};
                            targetUnitName = (0, plant_merge_eligibility_util_1.normalizePlantNameKey)(targetPlant.plantName);
                            _i = 0, PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS_2 = plant_merge_constants_1.PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS;
                            _b.label = 1;
                        case 1:
                            if (!(_i < PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS_2.length)) return [3 /*break*/, 6];
                            collection = PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS_2[_i];
                            _a = 0, sourcePlants_3 = sourcePlants;
                            _b.label = 2;
                        case 2:
                            if (!(_a < sourcePlants_3.length)) return [3 /*break*/, 5];
                            source = sourcePlants_3[_a];
                            unitName = this.unitNameFromPlant(source);
                            if (!unitName)
                                return [3 /*break*/, 4];
                            sameNameAsTarget = (0, plant_merge_eligibility_util_1.normalizePlantNameKey)(source.plantName) === targetUnitName;
                            if (sameNameAsTarget) {
                                skipped.push("".concat(collection, ":").concat(unitName));
                                return [3 /*break*/, 4];
                            }
                            return [4 /*yield*/, this.connection.db
                                    .collection(collection)
                                    .deleteMany({ urnNo: urnNo, unitName: unitName }, sessionOpts)];
                        case 3:
                            deleteResult = _b.sent();
                            if (deleteResult.deletedCount > 0) {
                                removed.push("".concat(collection, ":").concat(unitName));
                            }
                            _b.label = 4;
                        case 4:
                            _a++;
                            return [3 /*break*/, 2];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, { removed: removed, skipped: skipped }];
                    }
                });
            });
        };
        return PlantMergeService_1;
    }());
    __setFunctionName(_classThis, "PlantMergeService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlantMergeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlantMergeService = _classThis;
}();
exports.PlantMergeService = PlantMergeService;
