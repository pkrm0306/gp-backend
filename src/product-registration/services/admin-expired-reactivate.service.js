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
exports.AdminExpiredReactivateService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var audit_actions_1 = require("../../audit-log/audit-actions");
var audit_friendlies_1 = require("../../audit-log/audit-friendlies");
var active_product_filter_1 = require("../constants/active-product.filter");
var expired_product_filter_1 = require("../constants/expired-product.filter");
var certification_dates_util_1 = require("../helpers/certification-dates.util");
var invalidate_product_listings_cache_util_1 = require("../helpers/invalidate-product-listings-cache.util");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var renewal_urn_status_constants_1 = require("../../renew/constants/renewal-urn-status.constants");
var AdminExpiredReactivateService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminExpiredReactivateService = _classThis = /** @class */ (function () {
        function AdminExpiredReactivateService_1(productModel, productStatusAuditModel, auditLogService, redisService) {
            this.productModel = productModel;
            this.productStatusAuditModel = productStatusAuditModel;
            this.auditLogService = auditLogService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(AdminExpiredReactivateService.name);
        }
        AdminExpiredReactivateService_1.prototype.reactivateProduct = function (urnNo, productId, adminUserId, eoiNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, product, now, fromStatus, adminObjectId, _a, update, validityExtended, description;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.resolveProduct(trimmedUrn, productId.trim())];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if ((eoiNo === null || eoiNo === void 0 ? void 0 : eoiNo.trim()) && String(product.eoiNo) !== eoiNo.trim()) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            now = new Date();
                            fromStatus = Number(product.productStatus);
                            if (!(0, expired_product_filter_1.isExpiredProduct)(fromStatus, product.validtillDate, now)) {
                                throw new common_1.ConflictException('Product is not expired');
                            }
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            _a = this.buildReactivationUpdate(product.validtillDate, now), update = _a.update, validityExtended = _a.validityExtended;
                            description = validityExtended
                                ? 'Reactivated expired product to certified; validtillDate extended by 1 year'
                                : 'Reactivated expired product to certified; existing validtillDate retained';
                            return [4 /*yield*/, this.productModel.updateOne({ _id: product._id }, { $set: update })];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, this.writeAudits({
                                    productObjectId: product._id,
                                    urnNo: trimmedUrn,
                                    eoiNo: String(product.eoiNo),
                                    adminUserId: adminUserId,
                                    adminObjectId: adminObjectId,
                                    now: now,
                                    validtillDate: update.validtillDate,
                                    fromStatus: fromStatus,
                                    route: '/api/admin/products/expired-reactivate/product',
                                    auditAction: audit_actions_1.AUDIT_ACTION.EXPIRED_REACTIVATE_PRODUCT,
                                    description: description,
                                })];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 4:
                            _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    urnNo: trimmedUrn,
                                    productId: String(product._id),
                                    eoiNo: String(product.eoiNo),
                                    fromStatus: fromStatus,
                                    toStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                    validtillDate: update.validtillDate.toISOString(),
                                    message: validityExtended
                                        ? 'Product reactivated; validtillDate extended by 1 year from reactivation date'
                                        : 'Product reactivated; existing validtillDate retained',
                                    updatedAt: now,
                                }];
                    }
                });
            });
        };
        AdminExpiredReactivateService_1.prototype.reactivateUrn = function (urnNo, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, now, products, adminObjectId, plans, extendedAny, bulkResult, modifiedCount;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            now = new Date();
                            return [4 /*yield*/, this.productModel
                                    .find(__assign(__assign({ urnNo: trimmedUrn }, (0, expired_product_filter_1.matchExpiredProducts)(now)), (0, active_product_filter_1.matchActiveProducts)()))
                                    .select('_id eoiNo validtillDate productStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            products = _b.sent();
                            if (!products.length) {
                                throw new common_1.NotFoundException('No expired products on this URN');
                            }
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            plans = this.buildUrnReactivationPlans(products, now);
                            extendedAny = plans.some(function (plan) { return plan.validityExtended; });
                            return [4 /*yield*/, this.productModel.bulkWrite(plans.map(function (plan) { return ({
                                    updateOne: {
                                        filter: { _id: plan.product._id },
                                        update: { $set: plan.update },
                                    },
                                }); }), { ordered: false })];
                        case 2:
                            bulkResult = _b.sent();
                            return [4 /*yield*/, this.productStatusAuditModel.insertMany(plans.map(function (plan) { return ({
                                    productId: plan.product._id,
                                    urnNo: trimmedUrn,
                                    fromStatus: plan.fromStatus,
                                    toStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                    reason: 'Reactivated expired product to certified via URN bulk action',
                                    changedBy: adminObjectId,
                                    changedAt: now,
                                }); }), { ordered: false })];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, this.auditLogService.recordMany(plans.map(function (plan) { return ({
                                    occurred_at: now,
                                    action: audit_actions_1.AUDIT_ACTION.EXPIRED_REACTIVATE_URN,
                                    outcome: 'success',
                                    module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
                                    action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
                                    entity_name: String(plan.product.eoiNo),
                                    description: 'Reactivated expired product to certified via URN bulk action',
                                    performed_by: { user_id: adminUserId },
                                    old_values: { productStatus: plan.fromStatus },
                                    new_values: {
                                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                        validtillDate: plan.update.validtillDate.toISOString(),
                                        urnNo: trimmedUrn,
                                        eoiNo: String(plan.product.eoiNo),
                                    },
                                    http_method: 'PATCH',
                                    route: '/api/admin/products/expired-reactivate/urn',
                                    status_code: 200,
                                }); }))];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 5:
                            _b.sent();
                            modifiedCount = (_a = bulkResult.modifiedCount) !== null && _a !== void 0 ? _a : products.length;
                            this.logger.log("[reactivateUrn] urnNo=".concat(trimmedUrn, " planned=").concat(products.length, " modified=").concat(modifiedCount));
                            return [2 /*return*/, {
                                    success: true,
                                    urnNo: trimmedUrn,
                                    updatedProductIds: products.map(function (p) { return String(p._id); }),
                                    updatedEoiNos: products.map(function (p) { return String(p.eoiNo); }),
                                    updatedCount: products.length,
                                    modifiedCount: modifiedCount,
                                    message: extendedAny
                                        ? 'URN reactivated; validtillDate extended by 1 year where past expiry'
                                        : 'URN reactivated; existing validtillDate retained for all products',
                                }];
                    }
                });
            });
        };
        AdminExpiredReactivateService_1.prototype.buildUrnReactivationPlans = function (products, now) {
            var _this = this;
            return products.map(function (product) {
                var _a = _this.buildReactivationUpdate(product.validtillDate, now), update = _a.update, validityExtended = _a.validityExtended;
                return {
                    product: product,
                    fromStatus: Number(product.productStatus),
                    update: update,
                    validityExtended: validityExtended,
                };
            });
        };
        AdminExpiredReactivateService_1.prototype.resolveProduct = function (urnNo, productId) {
            return __awaiter(this, void 0, void 0, function () {
                var baseFilter, numericId;
                return __generator(this, function (_a) {
                    if (!urnNo || !productId) {
                        return [2 /*return*/, null];
                    }
                    baseFilter = __assign({ urnNo: urnNo }, (0, active_product_filter_1.matchActiveProducts)());
                    if (mongoose_1.Types.ObjectId.isValid(productId)) {
                        return [2 /*return*/, this.productModel
                                .findOne(__assign(__assign({}, baseFilter), { _id: new mongoose_1.Types.ObjectId(productId) }))
                                .exec()];
                    }
                    numericId = Number(productId);
                    if (Number.isFinite(numericId)) {
                        return [2 /*return*/, this.productModel
                                .findOne(__assign(__assign({}, baseFilter), { productId: numericId }))
                                .exec()];
                    }
                    return [2 /*return*/, null];
                });
            });
        };
        AdminExpiredReactivateService_1.prototype.buildReactivationUpdate = function (existingValidTill, now) {
            var _a = this.resolveReactivatedValidTill(existingValidTill, now), validtillDate = _a.validtillDate, validityExtended = _a.validityExtended;
            var notifyDates = (0, certification_dates_util_1.computeNotifyDates)(validtillDate);
            return {
                validityExtended: validityExtended,
                update: {
                    productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                    productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.NOT_RENEWED,
                    updatedDate: now,
                    validtillDate: validtillDate,
                    firstNotifyDate: notifyDates.firstNotifyDate,
                    secondNotifyDate: notifyDates.secondNotifyDate,
                    thirdNotifyDate: notifyDates.thirdNotifyDate,
                    discontinuedAt: null,
                    discontinuedBy: null,
                },
            };
        };
        /** Keep future validtill; otherwise extend 1 calendar year from reactivation date. */
        AdminExpiredReactivateService_1.prototype.resolveReactivatedValidTill = function (existingValidTill, now) {
            var existing = existingValidTill != null ? new Date(existingValidTill) : null;
            if (existing && !Number.isNaN(existing.getTime()) && existing > now) {
                return { validtillDate: existing, validityExtended: false };
            }
            var extended = new Date(now);
            extended.setFullYear(extended.getFullYear() + 1);
            extended.setHours(0, 0, 0, 0);
            return { validtillDate: extended, validityExtended: true };
        };
        AdminExpiredReactivateService_1.prototype.writeAudits = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productStatusAuditModel.create({
                                productId: input.productObjectId,
                                urnNo: input.urnNo,
                                fromStatus: input.fromStatus,
                                toStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                reason: input.description,
                                changedBy: input.adminObjectId,
                                changedAt: input.now,
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.auditLogService.record({
                                    occurred_at: input.now,
                                    action: input.auditAction,
                                    outcome: 'success',
                                    module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
                                    action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
                                    entity_name: input.eoiNo,
                                    description: input.description,
                                    performed_by: { user_id: input.adminUserId },
                                    old_values: { productStatus: input.fromStatus },
                                    new_values: {
                                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                        validtillDate: input.validtillDate.toISOString(),
                                        urnNo: input.urnNo,
                                        eoiNo: input.eoiNo,
                                    },
                                    http_method: 'PATCH',
                                    route: input.route,
                                    status_code: 200,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AdminExpiredReactivateService_1;
    }());
    __setFunctionName(_classThis, "AdminExpiredReactivateService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminExpiredReactivateService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminExpiredReactivateService = _classThis;
}();
exports.AdminExpiredReactivateService = AdminExpiredReactivateService;
