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
exports.UrnMergeService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var renewal_cycle_schema_1 = require("../../renew/schemas/renewal-cycle.schema");
var active_product_filter_1 = require("../constants/active-product.filter");
var active_product_filter_2 = require("../constants/active-product.filter");
var mongo_session_util_1 = require("../../renew/helpers/mongo-session.util");
var urn_merge_constants_1 = require("./urn-merge.constants");
var urn_merge_eligibility_util_1 = require("./helpers/urn-merge-eligibility.util");
var UrnMergeService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UrnMergeService = _classThis = /** @class */ (function () {
        function UrnMergeService_1(productModel, productPlantModel, allProductDocumentModel, categoryModel, renewalCycleModel, urnMergeAuditModel, connection, activityLogService, lifecycleNotification) {
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.categoryModel = categoryModel;
            this.renewalCycleModel = renewalCycleModel;
            this.urnMergeAuditModel = urnMergeAuditModel;
            this.connection = connection;
            this.activityLogService = activityLogService;
            this.lifecycleNotification = lifecycleNotification;
            this.logger = new common_1.Logger(UrnMergeService.name);
        }
        UrnMergeService_1.prototype.preview = function (sourceUrnNo, targetUrnNo, options) {
            return __awaiter(this, void 0, void 0, function () {
                var context, _a, urnLevelConflicts, urnLevelMoves;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.buildMergeContext(sourceUrnNo, targetUrnNo, options)];
                        case 1:
                            context = _b.sent();
                            return [4 /*yield*/, this.planUrnLevelSections(context.sourceUrnNo, context.targetUrnNo, context.vendorId)];
                        case 2:
                            _a = _b.sent(), urnLevelConflicts = _a.urnLevelConflicts, urnLevelMoves = _a.urnLevelMoves;
                            return [2 /*return*/, {
                                    success: true,
                                    canMerge: context.blockers.length === 0,
                                    sourceUrnNo: context.sourceUrnNo,
                                    targetUrnNo: context.targetUrnNo,
                                    categoryId: context.categoryId,
                                    categoryName: context.categoryName,
                                    blockers: context.blockers,
                                    eoisToMove: context.eoisToMove.map(function (row) { return ({
                                        productId: row.productId,
                                        eoiNo: row.eoiNo,
                                        productName: row.productName,
                                        productStatus: row.productStatus,
                                    }); }),
                                    urnLevelConflicts: urnLevelConflicts,
                                    urnLevelMoves: urnLevelMoves,
                                    warnings: context.warnings,
                                }];
                    }
                });
            });
        };
        UrnMergeService_1.prototype.execute = function (dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var strategy, preview, firstBlockerMessage, context, adminObjectId, now, targetSample, alignment, productObjectIds, movedProductIds, movedEoiNos, movedEoiSet, urnSectionsRekeyed, urnSectionsSkipped, mergeId, logError_1;
                var _this = this;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            strategy = String((_a = dto.urnLevelStrategy) !== null && _a !== void 0 ? _a : urn_merge_constants_1.URN_MERGE_STRATEGY_FILL_GAPS);
                            if (strategy !== urn_merge_constants_1.URN_MERGE_STRATEGY_FILL_GAPS) {
                                throw new common_1.BadRequestException("Unsupported urnLevelStrategy: ".concat(strategy));
                            }
                            return [4 /*yield*/, this.preview(dto.sourceUrnNo, dto.targetUrnNo, {
                                    moveAllCertifiedEois: dto.moveAllCertifiedEois,
                                    productIds: dto.productIds,
                                })];
                        case 1:
                            preview = _g.sent();
                            if (!preview.canMerge) {
                                firstBlockerMessage = String((_d = (_c = (_b = preview.blockers) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : '').trim();
                                throw new common_1.BadRequestException(firstBlockerMessage || 'Merge cannot be completed due to validation rules.');
                            }
                            return [4 /*yield*/, this.buildMergeContext(dto.sourceUrnNo, dto.targetUrnNo, {
                                    moveAllCertifiedEois: dto.moveAllCertifiedEois,
                                    productIds: dto.productIds,
                                })];
                        case 2:
                            context = _g.sent();
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            now = new Date();
                            targetSample = context.targetProducts[0];
                            alignment = {
                                urnStatus: Number((_e = targetSample === null || targetSample === void 0 ? void 0 : targetSample.urnStatus) !== null && _e !== void 0 ? _e : 0),
                                productRenewStatus: Number((_f = targetSample === null || targetSample === void 0 ? void 0 : targetSample.productRenewStatus) !== null && _f !== void 0 ? _f : 0),
                                validtillDate: targetSample === null || targetSample === void 0 ? void 0 : targetSample.validtillDate,
                                firstNotifyDate: targetSample === null || targetSample === void 0 ? void 0 : targetSample.firstNotifyDate,
                                secondNotifyDate: targetSample === null || targetSample === void 0 ? void 0 : targetSample.secondNotifyDate,
                                thirdNotifyDate: targetSample === null || targetSample === void 0 ? void 0 : targetSample.thirdNotifyDate,
                                renewCycleNo: targetSample === null || targetSample === void 0 ? void 0 : targetSample.renewCycleNo,
                                updatedDate: now,
                            };
                            productObjectIds = context.eoisToMove.map(function (p) { return p._id; });
                            movedProductIds = context.eoisToMove.map(function (p) { return p.productId; });
                            movedEoiNos = context.eoisToMove.map(function (p) { return p.eoiNo; });
                            movedEoiSet = new Set(movedEoiNos);
                            urnSectionsRekeyed = [];
                            urnSectionsSkipped = [];
                            return [4 /*yield*/, (0, mongo_session_util_1.runInTransactionIfSupported)(this.connection, function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var sessionOpts, sectionResult, audit;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                sessionOpts = session ? { session: session } : {};
                                                return [4 /*yield*/, this.productModel.updateMany({ _id: { $in: productObjectIds } }, {
                                                        $set: __assign({ urnNo: context.targetUrnNo, mergedFromUrnNo: context.sourceUrnNo }, alignment),
                                                    }, sessionOpts)];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, this.productPlantModel.updateMany((0, active_product_filter_2.matchActiveProductPlants)({ productId: { $in: productObjectIds } }), { $set: { urnNo: context.targetUrnNo } }, sessionOpts)];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, this.allProductDocumentModel.updateMany({
                                                        urnNo: context.sourceUrnNo,
                                                        isDeleted: { $ne: true },
                                                        $or: [
                                                            { eoiNo: { $in: __spreadArray([], movedEoiSet, true) } },
                                                            { eoiNo: { $exists: false } },
                                                            { eoiNo: null },
                                                            { eoiNo: '' },
                                                        ],
                                                    }, { $set: { urnNo: context.targetUrnNo } }, sessionOpts)];
                                            case 3:
                                                _a.sent();
                                                return [4 /*yield*/, this.applyUrnLevelRekeys(context.sourceUrnNo, context.targetUrnNo, context.vendorId, session)];
                                            case 4:
                                                sectionResult = _a.sent();
                                                urnSectionsRekeyed = sectionResult.rekeyed;
                                                urnSectionsSkipped = sectionResult.skipped;
                                                return [4 /*yield*/, this.urnMergeAuditModel.create([
                                                        {
                                                            sourceUrnNo: context.sourceUrnNo,
                                                            targetUrnNo: context.targetUrnNo,
                                                            categoryId: new mongoose_1.Types.ObjectId(context.categoryId),
                                                            vendorId: new mongoose_1.Types.ObjectId(context.vendorId),
                                                            manufacturerId: new mongoose_1.Types.ObjectId(context.manufacturerId),
                                                            movedProductIds: movedProductIds,
                                                            movedEoiNos: movedEoiNos,
                                                            urnSectionsRekeyed: urnSectionsRekeyed,
                                                            urnSectionsSkipped: urnSectionsSkipped,
                                                            urnLevelStrategy: strategy,
                                                            mergedBy: adminObjectId,
                                                            mergedAt: now,
                                                        },
                                                    ], sessionOpts)];
                                            case 5:
                                                audit = _a.sent();
                                                return [2 /*return*/, String(audit[0]._id)];
                                        }
                                    });
                                }); })];
                        case 3:
                            mergeId = _g.sent();
                            _g.label = 4;
                        case 4:
                            _g.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.activityLogService.logActivity({
                                    vendor_id: context.vendorId,
                                    manufacturer_id: context.manufacturerId,
                                    urn_no: context.targetUrnNo,
                                    activities_id: 0,
                                    activity: "Admin merged URN ".concat(context.sourceUrnNo, " into ").concat(context.targetUrnNo, " \u2014 ").concat(movedProductIds.length, " EOIs moved"),
                                    activity_status: 1,
                                    responsibility: 'Admin',
                                })];
                        case 5:
                            _g.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            logError_1 = _g.sent();
                            this.logger.warn("Activity log failed after URN merge ".concat(context.sourceUrnNo, " \u2192 ").concat(context.targetUrnNo), logError_1 instanceof Error ? logError_1.stack : String(logError_1));
                            return [3 /*break*/, 7];
                        case 7:
                            this.lifecycleNotification
                                .notifyUrnMerged({
                                manufacturerId: String(context.manufacturerId),
                                sourceUrnNo: context.sourceUrnNo,
                                targetUrnNo: context.targetUrnNo,
                                movedCount: movedProductIds.length,
                            })
                                .catch(function (err) {
                                return _this.logger.warn("URN merge notification failed: ".concat(err.message));
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    mergeId: mergeId,
                                    sourceUrnNo: context.sourceUrnNo,
                                    targetUrnNo: context.targetUrnNo,
                                    movedProductIds: movedProductIds,
                                    movedEoiNos: movedEoiNos,
                                    urnSectionsRekeyed: urnSectionsRekeyed,
                                    urnSectionsSkipped: urnSectionsSkipped,
                                    targetDetailsUrl: "/api/admin/products/details/".concat(context.targetUrnNo),
                                }];
                    }
                });
            });
        };
        UrnMergeService_1.prototype.fetchUrnProducts = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .find(__assign({ urnNo: urnNo }, (0, active_product_filter_1.matchActiveProducts)()))
                                .select('_id productId eoiNo productName productStatus categoryId vendorId manufacturerId urnStatus productRenewStatus validtillDate firstNotifyDate secondNotifyDate thirdNotifyDate renewCycleNo')
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows];
                    }
                });
            });
        };
        UrnMergeService_1.prototype.hasInProgressRenewalCycle = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.renewalCycleModel.countDocuments({
                                urnNo: urnNo,
                                status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                            })];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count > 0];
                    }
                });
            });
        };
        UrnMergeService_1.prototype.countCollectionRows = function (collection, urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var filter;
                return __generator(this, function (_a) {
                    filter = { urnNo: urnNo };
                    if (vendorId) {
                        filter.vendorId = vendorId;
                    }
                    return [2 /*return*/, this.connection.db.collection(collection).countDocuments(filter)];
                });
            });
        };
        UrnMergeService_1.prototype.planUrnLevelSections = function (sourceUrnNo, targetUrnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnLevelConflicts, urnLevelMoves, _i, URN_MERGE_SINGLETON_COLLECTIONS_1, entry, vendorScope, sourceCount, targetCount, sourceHasData, targetHasData, _a, URN_MERGE_MULTI_ROW_COLLECTIONS_1, collection, sourceCount, _b, _c;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            urnLevelConflicts = [];
                            urnLevelMoves = [];
                            _i = 0, URN_MERGE_SINGLETON_COLLECTIONS_1 = urn_merge_constants_1.URN_MERGE_SINGLETON_COLLECTIONS;
                            _e.label = 1;
                        case 1:
                            if (!(_i < URN_MERGE_SINGLETON_COLLECTIONS_1.length)) return [3 /*break*/, 5];
                            entry = URN_MERGE_SINGLETON_COLLECTIONS_1[_i];
                            vendorScope = entry.scopeVendor ? vendorId : undefined;
                            return [4 /*yield*/, this.countCollectionRows(entry.collection, sourceUrnNo, vendorScope)];
                        case 2:
                            sourceCount = _e.sent();
                            return [4 /*yield*/, this.countCollectionRows(entry.collection, targetUrnNo, vendorScope)];
                        case 3:
                            targetCount = _e.sent();
                            sourceHasData = sourceCount > 0;
                            targetHasData = targetCount > 0;
                            if (!sourceHasData) {
                                return [3 /*break*/, 4];
                            }
                            if (targetHasData) {
                                urnLevelConflicts.push({
                                    collection: entry.collection,
                                    sourceHasData: true,
                                    targetHasData: true,
                                    action: 'keep_target_skip_source',
                                });
                            }
                            else {
                                urnLevelMoves.push({
                                    collection: entry.collection,
                                    sourceHasData: true,
                                    targetHasData: false,
                                    action: 'rekey_source_to_target',
                                });
                            }
                            _e.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5:
                            _a = 0, URN_MERGE_MULTI_ROW_COLLECTIONS_1 = urn_merge_constants_1.URN_MERGE_MULTI_ROW_COLLECTIONS;
                            _e.label = 6;
                        case 6:
                            if (!(_a < URN_MERGE_MULTI_ROW_COLLECTIONS_1.length)) return [3 /*break*/, 10];
                            collection = URN_MERGE_MULTI_ROW_COLLECTIONS_1[_a];
                            return [4 /*yield*/, this.countCollectionRows(collection, sourceUrnNo)];
                        case 7:
                            sourceCount = _e.sent();
                            if (!(sourceCount > 0)) return [3 /*break*/, 9];
                            _c = (_b = urnLevelMoves).push;
                            _d = {
                                collection: collection,
                                sourceHasData: true
                            };
                            return [4 /*yield*/, this.countCollectionRows(collection, targetUrnNo)];
                        case 8:
                            _c.apply(_b, [(_d.targetHasData = (_e.sent()) > 0,
                                    _d.action = 'rekey_source_to_target',
                                    _d)]);
                            _e.label = 9;
                        case 9:
                            _a++;
                            return [3 /*break*/, 6];
                        case 10: return [2 /*return*/, { urnLevelConflicts: urnLevelConflicts, urnLevelMoves: urnLevelMoves }];
                    }
                });
            });
        };
        UrnMergeService_1.prototype.applyUrnLevelRekeys = function (sourceUrnNo, targetUrnNo, vendorId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var rekeyed, skipped, sessionOpts, _i, URN_MERGE_SINGLETON_COLLECTIONS_2, entry, vendorScope, sourceCount, targetCount, filter, _a, URN_MERGE_MULTI_ROW_COLLECTIONS_2, collection, sourceCount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            rekeyed = [];
                            skipped = [];
                            sessionOpts = session ? { session: session } : {};
                            _i = 0, URN_MERGE_SINGLETON_COLLECTIONS_2 = urn_merge_constants_1.URN_MERGE_SINGLETON_COLLECTIONS;
                            _b.label = 1;
                        case 1:
                            if (!(_i < URN_MERGE_SINGLETON_COLLECTIONS_2.length)) return [3 /*break*/, 6];
                            entry = URN_MERGE_SINGLETON_COLLECTIONS_2[_i];
                            vendorScope = entry.scopeVendor ? vendorId : undefined;
                            return [4 /*yield*/, this.countCollectionRows(entry.collection, sourceUrnNo, vendorScope)];
                        case 2:
                            sourceCount = _b.sent();
                            if (sourceCount === 0) {
                                return [3 /*break*/, 5];
                            }
                            return [4 /*yield*/, this.countCollectionRows(entry.collection, targetUrnNo, vendorScope)];
                        case 3:
                            targetCount = _b.sent();
                            if (targetCount > 0) {
                                skipped.push(entry.collection);
                                return [3 /*break*/, 5];
                            }
                            filter = { urnNo: sourceUrnNo };
                            if (vendorScope) {
                                filter.vendorId = vendorScope;
                            }
                            return [4 /*yield*/, this.connection.db
                                    .collection(entry.collection)
                                    .updateMany(filter, { $set: { urnNo: targetUrnNo } }, sessionOpts)];
                        case 4:
                            _b.sent();
                            rekeyed.push(entry.collection);
                            _b.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6:
                            _a = 0, URN_MERGE_MULTI_ROW_COLLECTIONS_2 = urn_merge_constants_1.URN_MERGE_MULTI_ROW_COLLECTIONS;
                            _b.label = 7;
                        case 7:
                            if (!(_a < URN_MERGE_MULTI_ROW_COLLECTIONS_2.length)) return [3 /*break*/, 11];
                            collection = URN_MERGE_MULTI_ROW_COLLECTIONS_2[_a];
                            return [4 /*yield*/, this.countCollectionRows(collection, sourceUrnNo)];
                        case 8:
                            sourceCount = _b.sent();
                            if (sourceCount === 0) {
                                return [3 /*break*/, 10];
                            }
                            return [4 /*yield*/, this.connection.db
                                    .collection(collection)
                                    .updateMany({ urnNo: sourceUrnNo }, { $set: { urnNo: targetUrnNo } }, sessionOpts)];
                        case 9:
                            _b.sent();
                            rekeyed.push(collection);
                            _b.label = 10;
                        case 10:
                            _a++;
                            return [3 /*break*/, 7];
                        case 11: return [2 /*return*/, { rekeyed: rekeyed, skipped: skipped }];
                    }
                });
            });
        };
        UrnMergeService_1.prototype.buildMergeContext = function (sourceUrnNo, targetUrnNo, options) {
            return __awaiter(this, void 0, void 0, function () {
                var source, target, blockers, warnings, sourceProducts, targetProducts, sourceCertified, targetCertified, eoisToMove, sourceRep, targetRep, targetEoiSet, categoryName, categoryId, category;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            source = (0, urn_merge_eligibility_util_1.normalizeUrnMergeNo)(sourceUrnNo);
                            target = (0, urn_merge_eligibility_util_1.normalizeUrnMergeNo)(targetUrnNo);
                            blockers = [];
                            warnings = [];
                            if (!source || !target) {
                                throw new common_1.BadRequestException('sourceUrnNo and targetUrnNo are required');
                            }
                            if (source === target) {
                                blockers.push({
                                    code: 'SAME_URN',
                                    message: 'Source and target URN must be different',
                                });
                            }
                            return [4 /*yield*/, this.fetchUrnProducts(source)];
                        case 1:
                            sourceProducts = _c.sent();
                            return [4 /*yield*/, this.fetchUrnProducts(target)];
                        case 2:
                            targetProducts = _c.sent();
                            sourceCertified = sourceProducts.filter(function (p) { return Number(p.productStatus) === 2; });
                            targetCertified = targetProducts.filter(function (p) { return Number(p.productStatus) === 2; });
                            if (sourceProducts.length === 0) {
                                blockers.push({
                                    code: 'SOURCE_URN_NOT_FOUND',
                                    message: "No active products found for source URN ".concat(source),
                                });
                            }
                            else if (sourceCertified.length === 0) {
                                blockers.push({
                                    code: 'NO_CERTIFIED_ON_SOURCE',
                                    message: "Source URN ".concat(source, " has no certified products to move"),
                                });
                            }
                            if (targetProducts.length === 0) {
                                blockers.push({
                                    code: 'TARGET_URN_NOT_FOUND',
                                    message: "No active products found for target URN ".concat(target),
                                });
                            }
                            else if (targetCertified.length === 0) {
                                blockers.push({
                                    code: 'NO_CERTIFIED_ON_TARGET',
                                    message: "Target URN ".concat(target, " has no certified products"),
                                });
                            }
                            eoisToMove = (0, urn_merge_eligibility_util_1.selectCertifiedProductsToMove)(sourceProducts, options === null || options === void 0 ? void 0 : options.moveAllCertifiedEois, options === null || options === void 0 ? void 0 : options.productIds);
                            if (sourceCertified.length > 0 &&
                                eoisToMove.length === 0 &&
                                (options === null || options === void 0 ? void 0 : options.moveAllCertifiedEois) === false) {
                                blockers.push({
                                    code: 'NO_PRODUCTS_SELECTED',
                                    message: 'No certified productIds selected to move',
                                });
                            }
                            sourceRep = (_a = sourceCertified[0]) !== null && _a !== void 0 ? _a : sourceProducts[0];
                            targetRep = (_b = targetCertified[0]) !== null && _b !== void 0 ? _b : targetProducts[0];
                            if (sourceRep && targetRep) {
                                if ((0, urn_merge_eligibility_util_1.categoryIdKey)(sourceRep.categoryId) !==
                                    (0, urn_merge_eligibility_util_1.categoryIdKey)(targetRep.categoryId)) {
                                    blockers.push({
                                        code: 'CATEGORY_MISMATCH',
                                        message: 'Source and target must belong to the same category',
                                    });
                                }
                                blockers.push.apply(blockers, (0, urn_merge_eligibility_util_1.buildOwnershipMismatchBlocker)(sourceRep, targetRep));
                            }
                            blockers.push.apply(blockers, __spreadArray(__spreadArray([], (0, urn_merge_eligibility_util_1.buildRenewalBlockers)('Source URN', sourceProducts), false), (0, urn_merge_eligibility_util_1.buildRenewalBlockers)('Target URN', targetProducts), false));
                            return [4 /*yield*/, this.hasInProgressRenewalCycle(source)];
                        case 3:
                            if (_c.sent()) {
                                blockers.push({
                                    code: 'RENEWAL_CYCLE_IN_PROGRESS',
                                    message: "Source URN ".concat(source, " has an in-progress renewal cycle"),
                                });
                            }
                            return [4 /*yield*/, this.hasInProgressRenewalCycle(target)];
                        case 4:
                            if (_c.sent()) {
                                blockers.push({
                                    code: 'RENEWAL_CYCLE_IN_PROGRESS',
                                    message: "Target URN ".concat(target, " has an in-progress renewal cycle"),
                                });
                            }
                            targetEoiSet = new Set(targetProducts.map(function (p) { var _a; return String((_a = p.eoiNo) !== null && _a !== void 0 ? _a : '').trim(); }).filter(Boolean));
                            blockers.push.apply(blockers, (0, urn_merge_eligibility_util_1.findEoiCollisions)(targetEoiSet, eoisToMove));
                            categoryId = sourceRep
                                ? (0, urn_merge_eligibility_util_1.categoryIdKey)(sourceRep.categoryId)
                                : undefined;
                            if (!(sourceRep === null || sourceRep === void 0 ? void 0 : sourceRep.categoryId)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.categoryModel
                                    .findById(sourceRep.categoryId)
                                    .select('category_name')
                                    .lean()
                                    .exec()];
                        case 5:
                            category = _c.sent();
                            categoryName = category === null || category === void 0 ? void 0 : category.category_name;
                            _c.label = 6;
                        case 6: return [2 /*return*/, {
                                sourceUrnNo: source,
                                targetUrnNo: target,
                                blockers: blockers,
                                warnings: warnings,
                                eoisToMove: eoisToMove,
                                sourceProducts: sourceProducts,
                                targetProducts: targetProducts,
                                categoryId: categoryId,
                                categoryName: categoryName,
                                vendorId: sourceRep === null || sourceRep === void 0 ? void 0 : sourceRep.vendorId,
                                manufacturerId: sourceRep === null || sourceRep === void 0 ? void 0 : sourceRep.manufacturerId,
                            }];
                    }
                });
            });
        };
        return UrnMergeService_1;
    }());
    __setFunctionName(_classThis, "UrnMergeService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UrnMergeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UrnMergeService = _classThis;
}();
exports.UrnMergeService = UrnMergeService;
