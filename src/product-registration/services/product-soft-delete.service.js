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
exports.ProductSoftDeleteService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var active_product_filter_1 = require("../constants/active-product.filter");
var eoi_sequence_helper_1 = require("../helpers/eoi-sequence.helper");
var eoi_sequence_active_filter_1 = require("../constants/eoi-sequence-active.filter");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var eoi_number_service_1 = require("./eoi-number.service");
var invalidate_product_listings_cache_util_1 = require("../helpers/invalidate-product-listings-cache.util");
var MAX_TRANSACTION_RETRIES = 5;
var MANUFACTURER_LOCK_TTL_MS = 180000;
var TXN_MAX_COMMIT_MS = 120000;
var ProductSoftDeleteService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductSoftDeleteService = _classThis = /** @class */ (function () {
        function ProductSoftDeleteService_1(productModel, productPlantModel, connection, manufacturersService, eoiNumberService, redisService) {
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.connection = connection;
            this.manufacturersService = manufacturersService;
            this.eoiNumberService = eoiNumberService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(ProductSoftDeleteService.name);
            /** In-process manufacturer locks (supplements MongoDB transactions for same-instance races). */
            this.manufacturerLocks = new Map();
        }
        /**
         * Soft-delete one EOI product and cascade to plants.
         * Deleting an uncertified product (pending/submitted) re-sequences active EOIs
         * (status 0/1/2) for the manufacturer. Rejected, discontinued, and soft-deleted
         * rows keep their stored eoiNo.
         */
        ProductSoftDeleteService_1.prototype.softDeleteProduct = function (productId, deletedByUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var productObjectId, lastError, attempt, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!deletedByUserId) {
                                throw new common_1.BadRequestException('User ID not found in token');
                            }
                            productObjectId = this.toObjectId(productId, 'productId');
                            attempt = 1;
                            _a.label = 1;
                        case 1:
                            if (!(attempt <= MAX_TRANSACTION_RETRIES)) return [3 /*break*/, 8];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 7]);
                            return [4 /*yield*/, this.runSoftDeleteWithManufacturerLock(productObjectId, deletedByUserId)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            error_1 = _a.sent();
                            lastError = error_1;
                            if (!(this.isTransientTransactionError(error_1) &&
                                attempt < MAX_TRANSACTION_RETRIES)) return [3 /*break*/, 6];
                            this.logger.warn("Soft delete retry ".concat(attempt, "/").concat(MAX_TRANSACTION_RETRIES, " for product ").concat(productId, ": ").concat(lastError.message));
                            return [4 /*yield*/, this.delay(50 * attempt)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6: throw error_1;
                        case 7:
                            attempt++;
                            return [3 /*break*/, 1];
                        case 8: throw lastError !== null && lastError !== void 0 ? lastError : new common_1.ConflictException('Soft delete failed after retries');
                    }
                });
            });
        };
        ProductSoftDeleteService_1.prototype.runSoftDeleteWithManufacturerLock = function (productObjectId, deletedByUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var product, productManufacturerId, manufacturer;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .findById(productObjectId)
                                .lean()
                                .exec()];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if (product.is_deleted === true) {
                                throw new common_1.BadRequestException('Product is already deleted');
                            }
                            productManufacturerId = String(product.manufacturerId);
                            return [4 /*yield*/, this.manufacturersService.findById(productManufacturerId)];
                        case 2:
                            manufacturer = _a.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            return [2 /*return*/, this.withManufacturerLock(productManufacturerId, function () {
                                    return _this.executeSoftDeleteTransaction(productObjectId, productManufacturerId, deletedByUserId);
                                })];
                    }
                });
            });
        };
        ProductSoftDeleteService_1.prototype.executeSoftDeleteTransaction = function (productObjectId, manufacturerId, deletedByUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, now, deletedByObjectId, manufacturerObjectId, product, plantSoftDeleteResult, deletedStatus, shouldResequence, updatedSequenceCount, _a, error_2;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _c.sent();
                            session.startTransaction({ maxCommitTimeMS: TXN_MAX_COMMIT_MS });
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 11, 13, 14]);
                            now = new Date();
                            deletedByObjectId = this.toObjectId(deletedByUserId, 'deletedBy');
                            manufacturerObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({
                                    _id: productObjectId,
                                    manufacturerId: manufacturerObjectId,
                                }))
                                    .session(session)
                                    .exec()];
                        case 3:
                            product = _c.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found, already deleted, or no longer active');
                            }
                            return [4 /*yield*/, this.productPlantModel
                                    .updateMany((0, active_product_filter_1.matchActiveProductPlants)({ productId: productObjectId }), {
                                    $set: {
                                        is_deleted: true,
                                        deleted_at: now,
                                        deleted_by: deletedByObjectId,
                                    },
                                }, { session: session })
                                    .exec()];
                        case 4:
                            plantSoftDeleteResult = _c.sent();
                            return [4 /*yield*/, this.productModel
                                    .updateOne(__assign({ _id: productObjectId }, (0, active_product_filter_1.matchActiveProducts)()), {
                                    $set: {
                                        is_deleted: true,
                                        deleted_at: now,
                                        deleted_by: deletedByObjectId,
                                        updatedDate: now,
                                    },
                                }, { session: session })
                                    .exec()];
                        case 5:
                            _c.sent();
                            deletedStatus = Number(product.productStatus);
                            shouldResequence = deletedStatus === product_status_constants_1.PRODUCT_STATUS_PENDING ||
                                deletedStatus === product_status_constants_1.PRODUCT_STATUS_SUBMITTED;
                            if (!shouldResequence) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.resequenceActiveEoisForManufacturer(manufacturerId, session)];
                        case 6:
                            _a = _c.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            _a = 0;
                            _c.label = 8;
                        case 8:
                            updatedSequenceCount = _a;
                            return [4 /*yield*/, session.commitTransaction()];
                        case 9:
                            _c.sent();
                            return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 10:
                            _c.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: shouldResequence
                                        ? 'EOI deleted and sequences rearranged successfully'
                                        : 'EOI deleted successfully',
                                    deleted_product_id: String(productObjectId),
                                    deleted_plant_count: (_b = plantSoftDeleteResult.modifiedCount) !== null && _b !== void 0 ? _b : 0,
                                    updated_sequence_count: updatedSequenceCount,
                                    manufacturer_id: manufacturerId,
                                }];
                        case 11:
                            error_2 = _c.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 12:
                            _c.sent();
                            throw error_2;
                        case 13:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Re-number active EOIs 1..n for the manufacturer; sync eoiNo on all active plants per product.
         */
        ProductSoftDeleteService_1.prototype.resequenceActiveEoisForManufacturer = function (manufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, activeProducts, sorted, duplicates, manufacturerProfile, updatedSequenceCount, productBulkOps, plantBulkOps, now, index, sequenceNumber, newEoiNo, productResult, plantResult;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            manufacturerObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            return [4 /*yield*/, this.productModel
                                    .find((0, eoi_sequence_active_filter_1.matchEoiSequenceActiveProducts)({
                                    manufacturerId: manufacturerObjectId,
                                }), { _id: 1, eoiNo: 1, createdDate: 1, productId: 1 })
                                    .sort({ createdDate: 1, productId: 1 })
                                    .session(session)
                                    .lean()
                                    .exec()];
                        case 1:
                            activeProducts = _c.sent();
                            if (activeProducts.length === 0) {
                                return [2 /*return*/, 0];
                            }
                            sorted = __spreadArray([], activeProducts, true).sort(eoi_sequence_helper_1.compareProductsForResequence);
                            duplicates = (0, eoi_sequence_helper_1.findDuplicateEoiSequenceSuffixes)(sorted);
                            if (duplicates.length > 0) {
                                this.logger.warn("Duplicate EOI sequence suffixes detected for manufacturer ".concat(manufacturerId, ": [").concat(duplicates.join(', '), "]. Re-sequencing will normalize order."));
                            }
                            return [4 /*yield*/, this.eoiNumberService.loadManufacturerEoiProfile(manufacturerId)];
                        case 2:
                            manufacturerProfile = _c.sent();
                            updatedSequenceCount = 0;
                            productBulkOps = [];
                            plantBulkOps = [];
                            now = new Date();
                            for (index = 0; index < sorted.length; index++) {
                                sequenceNumber = index + 1;
                                newEoiNo = (0, eoi_number_service_1.buildEoiNoFromManufacturerProfile)(manufacturerProfile, sequenceNumber);
                                if (sorted[index].eoiNo === newEoiNo) {
                                    continue;
                                }
                                productBulkOps.push({
                                    updateOne: {
                                        filter: { _id: sorted[index]._id },
                                        update: {
                                            $set: {
                                                eoiNo: newEoiNo,
                                                eoiSequence: sequenceNumber,
                                                updatedDate: now,
                                            },
                                        },
                                    },
                                });
                                plantBulkOps.push({
                                    updateMany: {
                                        filter: (0, active_product_filter_1.matchActiveProductPlants)({ productId: sorted[index]._id }),
                                        update: { $set: { eoiNo: newEoiNo } },
                                    },
                                });
                            }
                            if (!(productBulkOps.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.productModel.bulkWrite(productBulkOps, {
                                    session: session,
                                    ordered: false,
                                })];
                        case 3:
                            productResult = _c.sent();
                            updatedSequenceCount += (_a = productResult.modifiedCount) !== null && _a !== void 0 ? _a : 0;
                            _c.label = 4;
                        case 4:
                            if (!(plantBulkOps.length > 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.productPlantModel.bulkWrite(plantBulkOps, {
                                    session: session,
                                    ordered: false,
                                })];
                        case 5:
                            plantResult = _c.sent();
                            updatedSequenceCount += (_b = plantResult.modifiedCount) !== null && _b !== void 0 ? _b : 0;
                            _c.label = 6;
                        case 6: return [2 /*return*/, updatedSequenceCount];
                    }
                });
            });
        };
        /**
         * Re-sequence helper reused by non-delete flows that already run in a transaction.
         * Uses the exact same algorithm as delete flow.
         */
        ProductSoftDeleteService_1.prototype.resequenceForManufacturerInSession = function (manufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.resequenceActiveEoisForManufacturer(manufacturerId, session)];
                });
            });
        };
        /**
         * Serialize delete/re-sequence operations per manufacturer (same Node process).
         * MongoDB transactions handle cross-document atomicity; this reduces write conflicts.
         */
        ProductSoftDeleteService_1.prototype.withManufacturerLock = function (manufacturerId, operation) {
            return __awaiter(this, void 0, void 0, function () {
                var previous, releaseLock, current, chained;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    previous = (_a = this.manufacturerLocks.get(manufacturerId)) !== null && _a !== void 0 ? _a : Promise.resolve();
                    current = new Promise(function (resolve) {
                        releaseLock = resolve;
                    });
                    chained = previous
                        .catch(function () { return undefined; })
                        .then(function () {
                        return Promise.race([
                            operation(),
                            _this.delay(MANUFACTURER_LOCK_TTL_MS).then(function () {
                                throw new common_1.ConflictException('EOI delete operation timed out while waiting for manufacturer lock');
                            }),
                        ]);
                    })
                        .finally(function () {
                        releaseLock();
                        if (_this.manufacturerLocks.get(manufacturerId) === current) {
                            _this.manufacturerLocks.delete(manufacturerId);
                        }
                    });
                    this.manufacturerLocks.set(manufacturerId, current);
                    return [2 /*return*/, chained];
                });
            });
        };
        ProductSoftDeleteService_1.prototype.invalidateProductListingsCache = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductSoftDeleteService_1.prototype.toObjectId = function (id, fieldName) {
            if (!id) {
                throw new common_1.BadRequestException("".concat(fieldName, " is required"));
            }
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            var idString = String(id).trim();
            if (!/^[0-9a-fA-F]{24}$/.test(idString)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format. Must be a valid 24-character MongoDB ObjectId."));
            }
            return new mongoose_1.Types.ObjectId(idString);
        };
        ProductSoftDeleteService_1.prototype.isTransientTransactionError = function (error) {
            var _a;
            if (!error || typeof error !== 'object') {
                return false;
            }
            var err = error;
            if (err.code === 112) {
                return true;
            }
            if (Array.isArray(err.errorLabels) && err.errorLabels.includes('TransientTransactionError')) {
                return true;
            }
            var message = String((_a = err.message) !== null && _a !== void 0 ? _a : '');
            return (message.includes('WriteConflict') ||
                message.includes('TransientTransactionError'));
        };
        ProductSoftDeleteService_1.prototype.delay = function (ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        };
        return ProductSoftDeleteService_1;
    }());
    __setFunctionName(_classThis, "ProductSoftDeleteService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductSoftDeleteService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductSoftDeleteService = _classThis;
}();
exports.ProductSoftDeleteService = ProductSoftDeleteService;
