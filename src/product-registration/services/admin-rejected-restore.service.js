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
exports.AdminRejectedRestoreService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var audit_actions_1 = require("../../audit-log/audit-actions");
var audit_friendlies_1 = require("../../audit-log/audit-friendlies");
var active_product_filter_1 = require("../constants/active-product.filter");
var certification_dates_util_1 = require("../helpers/certification-dates.util");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var invalidate_product_listings_cache_util_1 = require("../helpers/invalidate-product-listings-cache.util");
var AdminRejectedRestoreService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminRejectedRestoreService = _classThis = /** @class */ (function () {
        function AdminRejectedRestoreService_1(productModel, productStatusAuditModel, connection, eoiNumberService, auditLogService, redisService) {
            this.productModel = productModel;
            this.productStatusAuditModel = productStatusAuditModel;
            this.connection = connection;
            this.eoiNumberService = eoiNumberService;
            this.auditLogService = auditLogService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(AdminRejectedRestoreService.name);
        }
        AdminRejectedRestoreService_1.prototype.getRestoreOptions = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, _a, gate, rejectedProductCount, allowedTargets;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmedUrn = urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.loadUrnCertifiedGate(trimmedUrn),
                                    this.productModel
                                        .countDocuments(__assign({ urnNo: trimmedUrn, productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED }, (0, active_product_filter_1.matchActiveProducts)()))
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), gate = _a[0], rejectedProductCount = _a[1];
                            allowedTargets = gate.hasCertifiedOnUrn
                                ? ['certified']
                                : ['uncertified'];
                            return [2 /*return*/, {
                                    success: true,
                                    urnNo: trimmedUrn,
                                    hasCertifiedProducts: gate.hasCertifiedOnUrn,
                                    certifiedProductCount: gate.certifiedProductCount,
                                    rejectedProductCount: rejectedProductCount,
                                    allowedTargets: __spreadArray([], allowedTargets, true),
                                    targetStatusMap: {
                                        uncertified: product_status_constants_1.PRODUCT_STATUS_PENDING,
                                        certified: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                                    },
                                }];
                    }
                });
            });
        };
        AdminRejectedRestoreService_1.prototype.restoreProduct = function (urnNo, productId, targetStatus, adminUserId, eoiNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, product, gate, now, adminObjectId, manufacturerId, previousEoiNo, restored;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            this.assertValidTargetStatus(targetStatus);
                            return [4 /*yield*/, this.resolveProduct(trimmedUrn, productId.trim())];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if ((eoiNo === null || eoiNo === void 0 ? void 0 : eoiNo.trim()) && String(product.eoiNo) !== eoiNo.trim()) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if (Number(product.productStatus) !== product_status_constants_1.PRODUCT_STATUS_REJECTED) {
                                throw new common_1.ConflictException('Product is not rejected');
                            }
                            return [4 /*yield*/, this.loadUrnCertifiedGate(trimmedUrn)];
                        case 2:
                            gate = _a.sent();
                            this.assertRestoreGate(targetStatus, gate);
                            now = new Date();
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            manufacturerId = String(product.manufacturerId);
                            previousEoiNo = String(product.eoiNo);
                            return [4 /*yield*/, this.runInTransaction(function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.restoreOneProductInSession(product._id, manufacturerId, previousEoiNo, targetStatus, product.validtillDate, now, session)];
                                            case 1:
                                                restored = _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.writeAudits({
                                    productObjectId: product._id,
                                    urnNo: trimmedUrn,
                                    previousEoiNo: previousEoiNo,
                                    eoiNo: restored.eoiNo,
                                    adminUserId: adminUserId,
                                    adminObjectId: adminObjectId,
                                    now: now,
                                    fromStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED,
                                    toStatus: targetStatus,
                                    hasCertifiedOnUrn: gate.hasCertifiedOnUrn,
                                    route: '/api/admin/products/rejected-restore/product',
                                    auditAction: audit_actions_1.AUDIT_ACTION.REJECTED_RESTORE_PRODUCT,
                                    description: "Rejected product restored to ".concat(this.restoreTargetLabel(targetStatus)),
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    urnNo: trimmedUrn,
                                    productId: String(product._id),
                                    previousEoiNo: previousEoiNo,
                                    eoiNo: restored.eoiNo,
                                    fromStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED,
                                    toStatus: targetStatus,
                                    hasCertifiedOnUrn: gate.hasCertifiedOnUrn,
                                    updatedAt: now,
                                }];
                    }
                });
            });
        };
        AdminRejectedRestoreService_1.prototype.restoreUrn = function (urnNo, targetStatus, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, products, gate, now, adminObjectId, restoredRows, i, product, restored;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            this.assertValidTargetStatus(targetStatus);
                            return [4 /*yield*/, this.productModel
                                    .find(__assign({ urnNo: trimmedUrn, productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED }, (0, active_product_filter_1.matchActiveProducts)()))
                                    .select('_id eoiNo manufacturerId validtillDate')
                                    .sort({ createdDate: 1, productId: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            products = _a.sent();
                            if (!products.length) {
                                throw new common_1.NotFoundException('No rejected products on this URN');
                            }
                            return [4 /*yield*/, this.loadUrnCertifiedGate(trimmedUrn)];
                        case 2:
                            gate = _a.sent();
                            this.assertRestoreGate(targetStatus, gate);
                            now = new Date();
                            adminObjectId = new mongoose_1.Types.ObjectId(adminUserId);
                            restoredRows = [];
                            return [4 /*yield*/, this.runInTransaction(function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var runningMaxByManufacturer, _i, products_1, product, manufacturerId, runningMax, previousEoiNo, assignment;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                runningMaxByManufacturer = new Map();
                                                _i = 0, products_1 = products;
                                                _a.label = 1;
                                            case 1:
                                                if (!(_i < products_1.length)) return [3 /*break*/, 8];
                                                product = products_1[_i];
                                                manufacturerId = String(product.manufacturerId);
                                                runningMax = runningMaxByManufacturer.get(manufacturerId);
                                                if (!(runningMax == null)) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.eoiNumberService.getMaxActiveSequenceSuffix(manufacturerId, session)];
                                            case 2:
                                                runningMax = _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                previousEoiNo = String(product.eoiNo);
                                                return [4 /*yield*/, this.eoiNumberService.assignNextActiveEoiNo(manufacturerId, session, { runningMaxSuffix: runningMax, previousEoiNo: previousEoiNo })];
                                            case 4:
                                                assignment = _a.sent();
                                                runningMaxByManufacturer.set(manufacturerId, assignment.eoiSequence);
                                                return [4 /*yield*/, this.applyStatusRestoreUpdate(product._id, targetStatus, product.validtillDate, now, session)];
                                            case 5:
                                                _a.sent();
                                                return [4 /*yield*/, this.eoiNumberService.applyEoiReassignment(product._id, assignment, now, session)];
                                            case 6:
                                                _a.sent();
                                                restoredRows.push({
                                                    productId: String(product._id),
                                                    previousEoiNo: previousEoiNo,
                                                    eoiNo: assignment.eoiNo,
                                                });
                                                _a.label = 7;
                                            case 7:
                                                _i++;
                                                return [3 /*break*/, 1];
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 4:
                            _a.sent();
                            i = 0;
                            _a.label = 5;
                        case 5:
                            if (!(i < products.length)) return [3 /*break*/, 8];
                            product = products[i];
                            restored = restoredRows[i];
                            return [4 /*yield*/, this.writeAudits({
                                    productObjectId: product._id,
                                    urnNo: trimmedUrn,
                                    previousEoiNo: restored.previousEoiNo,
                                    eoiNo: restored.eoiNo,
                                    adminUserId: adminUserId,
                                    adminObjectId: adminObjectId,
                                    now: now,
                                    fromStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED,
                                    toStatus: targetStatus,
                                    hasCertifiedOnUrn: gate.hasCertifiedOnUrn,
                                    route: '/api/admin/products/rejected-restore/urn',
                                    auditAction: audit_actions_1.AUDIT_ACTION.REJECTED_RESTORE_URN,
                                    description: "Rejected product restored to ".concat(this.restoreTargetLabel(targetStatus), " via URN bulk action"),
                                })];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            i++;
                            return [3 /*break*/, 5];
                        case 8: return [2 /*return*/, {
                                success: true,
                                urnNo: trimmedUrn,
                                targetStatus: targetStatus,
                                hasCertifiedOnUrn: gate.hasCertifiedOnUrn,
                                updatedProductIds: restoredRows.map(function (r) { return r.productId; }),
                                previousEoiNos: restoredRows.map(function (r) { return r.previousEoiNo; }),
                                updatedEoiNos: restoredRows.map(function (r) { return r.eoiNo; }),
                                updatedCount: restoredRows.length,
                            }];
                    }
                });
            });
        };
        AdminRejectedRestoreService_1.prototype.restoreOneProductInSession = function (productObjectId, manufacturerId, previousEoiNo, targetStatus, existingValidTill, now, session) {
            return __awaiter(this, void 0, void 0, function () {
                var assignment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.eoiNumberService.assignNextActiveEoiNo(manufacturerId, session, { previousEoiNo: previousEoiNo })];
                        case 1:
                            assignment = _a.sent();
                            return [4 /*yield*/, this.applyStatusRestoreUpdate(productObjectId, targetStatus, existingValidTill, now, session)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.eoiNumberService.applyEoiReassignment(productObjectId, assignment, now, session)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {
                                    productId: String(productObjectId),
                                    previousEoiNo: previousEoiNo,
                                    eoiNo: assignment.eoiNo,
                                }];
                    }
                });
            });
        };
        AdminRejectedRestoreService_1.prototype.assertValidTargetStatus = function (targetStatus) {
            if (targetStatus !== product_status_constants_1.PRODUCT_STATUS_PENDING &&
                targetStatus !== product_status_constants_1.PRODUCT_STATUS_CERTIFIED) {
                throw new common_1.BadRequestException('targetStatus must be 0 (Un-certified) or 2 (Certified)');
            }
        };
        AdminRejectedRestoreService_1.prototype.assertRestoreGate = function (targetStatus, gate) {
            if (targetStatus === product_status_constants_1.PRODUCT_STATUS_CERTIFIED && !gate.hasCertifiedOnUrn) {
                throw new common_1.BadRequestException('This URN has no certified products. Restore to Un-certified Products only.');
            }
            if (targetStatus === product_status_constants_1.PRODUCT_STATUS_PENDING && gate.hasCertifiedOnUrn) {
                throw new common_1.BadRequestException('This URN already has certified products. Restore to Certified only.');
            }
        };
        AdminRejectedRestoreService_1.prototype.restoreTargetLabel = function (targetStatus) {
            return targetStatus === product_status_constants_1.PRODUCT_STATUS_CERTIFIED ? 'certified' : 'uncertified';
        };
        AdminRejectedRestoreService_1.prototype.loadUrnCertifiedGate = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var certifiedProductCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .countDocuments(__assign({ urnNo: urnNo, productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED }, (0, active_product_filter_1.matchActiveProducts)()))
                                .exec()];
                        case 1:
                            certifiedProductCount = _a.sent();
                            return [2 /*return*/, {
                                    hasCertifiedOnUrn: certifiedProductCount > 0,
                                    certifiedProductCount: certifiedProductCount,
                                }];
                    }
                });
            });
        };
        AdminRejectedRestoreService_1.prototype.resolveProduct = function (urnNo, productId) {
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
        AdminRejectedRestoreService_1.prototype.buildStatusRestoreFields = function (targetStatus, existingValidTill, now) {
            var update = {
                productStatus: targetStatus,
                updatedDate: now,
                rejectedDetails: null,
                rejectedAt: null,
                discontinuedAt: null,
                discontinuedBy: null,
            };
            if (targetStatus === product_status_constants_1.PRODUCT_STATUS_CERTIFIED) {
                var existing = existingValidTill != null ? new Date(existingValidTill) : null;
                if (existing && !Number.isNaN(existing.getTime()) && existing > now) {
                    var notifyDates = (0, certification_dates_util_1.computeNotifyDates)(existing);
                    update.validtillDate = existing;
                    update.firstNotifyDate = notifyDates.firstNotifyDate;
                    update.secondNotifyDate = notifyDates.secondNotifyDate;
                    update.thirdNotifyDate = notifyDates.thirdNotifyDate;
                }
                else {
                    var certDates = (0, certification_dates_util_1.computeCertificationDates)(now);
                    update.certifiedDate = certDates.certifiedDate;
                    update.validtillDate = certDates.validtillDate;
                    update.firstNotifyDate = certDates.firstNotifyDate;
                    update.secondNotifyDate = certDates.secondNotifyDate;
                    update.thirdNotifyDate = certDates.thirdNotifyDate;
                }
            }
            return update;
        };
        AdminRejectedRestoreService_1.prototype.applyStatusRestoreUpdate = function (productObjectId, targetStatus, existingValidTill, now, session) {
            return __awaiter(this, void 0, void 0, function () {
                var update, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            update = this.buildStatusRestoreFields(targetStatus, existingValidTill, now);
                            return [4 /*yield*/, this.productModel
                                    .updateOne({ _id: productObjectId, productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED }, { $set: update }, { session: session })
                                    .exec()];
                        case 1:
                            result = _b.sent();
                            if (((_a = result.modifiedCount) !== null && _a !== void 0 ? _a : 0) === 0) {
                                throw new common_1.ConflictException('Product is not rejected');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AdminRejectedRestoreService_1.prototype.runInTransaction = function (operation) {
            return __awaiter(this, void 0, void 0, function () {
                var session, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _a.sent();
                            session.startTransaction();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, 7, 8]);
                            return [4 /*yield*/, operation(session)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 5:
                            error_1 = _a.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 6:
                            _a.sent();
                            throw error_1;
                        case 7:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        AdminRejectedRestoreService_1.prototype.writeAudits = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productStatusAuditModel.create({
                                productId: input.productObjectId,
                                urnNo: input.urnNo,
                                fromStatus: input.fromStatus,
                                toStatus: input.toStatus,
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
                                    old_values: {
                                        productStatus: input.fromStatus,
                                        eoiNo: input.previousEoiNo,
                                    },
                                    new_values: {
                                        productStatus: input.toStatus,
                                        urnNo: input.urnNo,
                                        previousEoiNo: input.previousEoiNo,
                                        eoiNo: input.eoiNo,
                                        hasCertifiedOnUrn: input.hasCertifiedOnUrn,
                                        restoreTarget: input.toStatus === product_status_constants_1.PRODUCT_STATUS_CERTIFIED ? 'certified' : 'uncertified',
                                    },
                                    http_method: 'PATCH',
                                    route: input.route,
                                    status_code: 200,
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.auditLogService.record({
                                    occurred_at: input.now,
                                    action: audit_actions_1.AUDIT_ACTION.EOI_REASSIGNED_ON_RESTORE,
                                    outcome: 'success',
                                    module: audit_friendlies_1.AUDIT_MODULE.PRODUCT,
                                    action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.UPDATE,
                                    entity_name: input.eoiNo,
                                    description: 'EOI reassigned on rejected product restore',
                                    performed_by: { user_id: input.adminUserId },
                                    old_values: { eoiNo: input.previousEoiNo },
                                    new_values: {
                                        eoiNo: input.eoiNo,
                                        urnNo: input.urnNo,
                                        productId: String(input.productObjectId),
                                    },
                                    http_method: 'PATCH',
                                    route: input.route,
                                    status_code: 200,
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AdminRejectedRestoreService_1;
    }());
    __setFunctionName(_classThis, "AdminRejectedRestoreService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminRejectedRestoreService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminRejectedRestoreService = _classThis;
}();
exports.AdminRejectedRestoreService = AdminRejectedRestoreService;
