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
exports.AdminRenewProductDiscontinueService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var active_product_filter_1 = require("../../product-registration/constants/active-product.filter");
var product_status_constants_1 = require("../constants/product-status.constants");
var audit_actions_1 = require("../../audit-log/audit-actions");
var audit_friendlies_1 = require("../../audit-log/audit-friendlies");
var invalidate_product_listings_cache_util_1 = require("../../product-registration/helpers/invalidate-product-listings-cache.util");
var common_2 = require("@nestjs/common");
var AdminRenewProductDiscontinueService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminRenewProductDiscontinueService = _classThis = /** @class */ (function () {
        function AdminRenewProductDiscontinueService_1(productModel, auditModel, connection, productSoftDeleteService, auditLogService, redisService) {
            this.productModel = productModel;
            this.auditModel = auditModel;
            this.connection = connection;
            this.productSoftDeleteService = productSoftDeleteService;
            this.auditLogService = auditLogService;
            this.redisService = redisService;
            this.logger = new common_2.Logger(AdminRenewProductDiscontinueService.name);
        }
        AdminRenewProductDiscontinueService_1.prototype.listProducts = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, this.productModel
                                    .find(__assign({ urnNo: trimmedUrn, productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED }, (0, active_product_filter_1.matchActiveProducts)()))
                                    .select('_id eoiNo eoiSequence productName productStatus createdDate')
                                    .sort({ eoiSequence: 1, createdDate: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) {
                                    var _a;
                                    return ({
                                        _id: String(row._id),
                                        eoiNo: row.eoiNo,
                                        eoiSequence: row.eoiSequence != null && Number.isFinite(Number(row.eoiSequence))
                                            ? Number(row.eoiSequence)
                                            : undefined,
                                        productName: row.productName,
                                        productStatus: Number((_a = row.productStatus) !== null && _a !== void 0 ? _a : 0),
                                        productStatusLabel: 'Certified',
                                        createdAt: row.createdDate,
                                    });
                                })];
                    }
                });
            });
        };
        AdminRenewProductDiscontinueService_1.prototype.discontinueProduct = function (urnNo, productId, adminUserId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, productObjectId, adminObjectId, now, product, manufacturerId, session, updatedSequenceCount, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(productId)) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            trimmedUrn = urnNo.trim();
                            productObjectId = new mongoose_1.Types.ObjectId(productId);
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            now = new Date();
                            return [4 /*yield*/, this.productModel
                                    .findOne(__assign({ _id: productObjectId, urnNo: trimmedUrn, productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED }, (0, active_product_filter_1.matchActiveProducts)()))
                                    .exec()];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            manufacturerId = String((_a = product.manufacturerId) !== null && _a !== void 0 ? _a : '').trim();
                            if (!manufacturerId) {
                                throw new common_1.BadRequestException('Product manufacturer is missing');
                            }
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _b.sent();
                            session.startTransaction();
                            updatedSequenceCount = 0;
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 8, 10, 11]);
                            return [4 /*yield*/, this.productModel.updateOne({ _id: productObjectId }, {
                                    $set: {
                                        is_deleted: true,
                                        deleted_at: now,
                                        deleted_by: adminObjectId,
                                        discontinuedAt: now,
                                        discontinuedBy: adminObjectId,
                                        discontinueReason: (reason === null || reason === void 0 ? void 0 : reason.trim()) || null,
                                        updatedDate: now,
                                    },
                                }, { session: session })];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, this.productSoftDeleteService.resequenceForManufacturerInSession(manufacturerId, session)];
                        case 5:
                            updatedSequenceCount =
                                _b.sent();
                            return [4 /*yield*/, this.auditModel.create([
                                    {
                                        productId: productObjectId,
                                        urnNo: trimmedUrn,
                                        fromStatus: Number(product.productStatus),
                                        toStatus: Number(product.productStatus),
                                        reason: (reason === null || reason === void 0 ? void 0 : reason.trim()) || 'Renewal discontinue (soft-delete)',
                                        changedBy: adminObjectId,
                                        changedAt: now,
                                    },
                                ], { session: session })];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 7:
                            _b.sent();
                            return [3 /*break*/, 11];
                        case 8:
                            error_1 = _b.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 9:
                            _b.sent();
                            throw error_1;
                        case 10:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 11: return [4 /*yield*/, this.auditLogService.record({
                                occurred_at: now,
                                action: audit_actions_1.AUDIT_ACTION.PRODUCT_DISCONTINUED,
                                outcome: 'success',
                                module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
                                action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
                                entity_name: String(product.eoiNo),
                                description: 'Product discontinued during renewal (soft-delete)',
                                performed_by: { user_id: adminUserId },
                                old_values: {
                                    is_deleted: false,
                                    productStatus: Number(product.productStatus),
                                    eoiNo: product.eoiNo,
                                },
                                new_values: {
                                    is_deleted: true,
                                    productStatus: Number(product.productStatus),
                                    productStatusLabel: 'Certified',
                                    discontinueStatus: 'discontinued',
                                    discontinueStatusLabel: 'Discontinued',
                                    eoiNo: product.eoiNo,
                                    urnNo: trimmedUrn,
                                    discontinuedAt: now.toISOString(),
                                    updatedSequenceCount: updatedSequenceCount,
                                },
                                http_method: 'PATCH',
                                route: '/api/admin/renewals/:urnNo/product-discontinue/products/:productId',
                                status_code: 200,
                            })];
                        case 12:
                            _b.sent();
                            return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 13:
                            _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    productId: String(productObjectId),
                                    eoiNo: String(product.eoiNo),
                                    productStatus: Number(product.productStatus),
                                    productStatusLabel: 'Certified',
                                    discontinueStatus: 'discontinued',
                                    discontinueStatusLabel: 'Discontinued',
                                    discontinuedAt: now,
                                    isDeleted: true,
                                    updatedAt: now,
                                    updatedSequenceCount: updatedSequenceCount,
                                    resequenceApplied: updatedSequenceCount > 0,
                                }];
                    }
                });
            });
        };
        /** @deprecated Renewal discontinue is one-way; use a dedicated restore flow if needed. */
        AdminRenewProductDiscontinueService_1.prototype.bulkReactivate = function (_urnNo, _productIds, _adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new common_1.BadRequestException('Bulk reactivate is not supported for renewal discontinue. Discontinued products are soft-deleted and require a separate restore flow.');
                });
            });
        };
        /** @deprecated Use discontinueProduct — status 4 toggle removed. */
        AdminRenewProductDiscontinueService_1.prototype.toggleProductStatus = function (urnNo, productId, currentStatus, adminUserId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, productObjectId, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (currentStatus !== product_status_constants_1.PRODUCT_STATUS_CERTIFIED) {
                                throw new common_1.BadRequestException('Only certified (2) products can be discontinued. productStatus is not changed on discontinue.');
                            }
                            trimmedUrn = urnNo.trim();
                            productObjectId = new mongoose_1.Types.ObjectId(productId);
                            return [4 /*yield*/, this.productModel
                                    .findOne({ _id: productObjectId, urnNo: trimmedUrn })
                                    .select('is_deleted productStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _a.sent();
                            if ((existing === null || existing === void 0 ? void 0 : existing.is_deleted) === true) {
                                throw new common_1.ConflictException('Product is already discontinued or deleted');
                            }
                            return [2 /*return*/, this.discontinueProduct(trimmedUrn, productId, adminUserId, reason)];
                    }
                });
            });
        };
        return AdminRenewProductDiscontinueService_1;
    }());
    __setFunctionName(_classThis, "AdminRenewProductDiscontinueService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminRenewProductDiscontinueService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminRenewProductDiscontinueService = _classThis;
}();
exports.AdminRenewProductDiscontinueService = AdminRenewProductDiscontinueService;
