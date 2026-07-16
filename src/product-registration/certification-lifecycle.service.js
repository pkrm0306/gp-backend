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
exports.CertificationLifecycleService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var active_product_filter_1 = require("./constants/active-product.filter");
var certification_dates_util_1 = require("./helpers/certification-dates.util");
var parse_products_to_be_certified_util_1 = require("./helpers/parse-products-to-be-certified.util");
var URN_STATUS_VERIFICATION_COMPLETED = 11;
var PRODUCT_STATUS_CERTIFIED = 2;
var PRODUCT_STATUS_REJECTED = 3;
var CertificationLifecycleService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CertificationLifecycleService = _classThis = /** @class */ (function () {
        function CertificationLifecycleService_1(productModel) {
            this.productModel = productModel;
        }
        CertificationLifecycleService_1.prototype.applyCertificationApproval = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNoOptions, vendorId, productsToBeCertifiedRaw, _a, approvedAt, session, vendorObjectId, rawTrim, products, selectedProductIds, urnProductIds, missing, dates, now, validityFields, baseFilter, updateOpts, selectedList, selectedSubmittedList, skippedCount, certifyResult, rejectResult;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            urnNoOptions = params.urnNoOptions, vendorId = params.vendorId, productsToBeCertifiedRaw = params.productsToBeCertifiedRaw, _a = params.approvedAt, approvedAt = _a === void 0 ? new Date() : _a, session = params.session;
                            if (!urnNoOptions.length) {
                                throw new common_1.BadRequestException('URN number is required for certification');
                            }
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            rawTrim = String(productsToBeCertifiedRaw !== null && productsToBeCertifiedRaw !== void 0 ? productsToBeCertifiedRaw : '').trim();
                            if (!rawTrim) {
                                throw new common_1.BadRequestException('productsToBeCertified is required when approving certification payment');
                            }
                            return [4 /*yield*/, this.productModel
                                    .find((0, active_product_filter_1.matchActiveProducts)({
                                    urnNo: { $in: urnNoOptions },
                                    vendorId: vendorObjectId,
                                }))
                                    .select('productId _id productStatus')
                                    .session(session !== null && session !== void 0 ? session : null)
                                    .lean()
                                    .exec()];
                        case 1:
                            products = _b.sent();
                            if (!products.length) {
                                throw new common_1.NotFoundException('No active products found for this URN');
                            }
                            selectedProductIds = new Set((0, parse_products_to_be_certified_util_1.resolveProductIdsFromCertifiedField)(productsToBeCertifiedRaw, products));
                            if (!selectedProductIds.size) {
                                throw new common_1.BadRequestException("productsToBeCertified must contain numeric productId values for this URN (e.g. \"[101,102]\"). " +
                                    "Received: \"".concat(rawTrim, "\""));
                            }
                            urnProductIds = new Set(products.map(function (p) { return p.productId; }));
                            missing = __spreadArray([], selectedProductIds, true).filter(function (id) { return !urnProductIds.has(id); });
                            if (missing.length) {
                                throw new common_1.BadRequestException("productsToBeCertified includes unknown productId(s) for this URN: ".concat(missing.join(', ')));
                            }
                            dates = (0, certification_dates_util_1.computeCertificationDates)(approvedAt);
                            now = new Date();
                            validityFields = {
                                validtillDate: dates.validtillDate,
                                firstNotifyDate: dates.firstNotifyDate,
                                secondNotifyDate: dates.secondNotifyDate,
                                thirdNotifyDate: dates.thirdNotifyDate,
                            };
                            baseFilter = (0, active_product_filter_1.matchActiveProducts)({
                                urnNo: { $in: urnNoOptions },
                                vendorId: vendorObjectId,
                            });
                            updateOpts = session ? { session: session } : {};
                            selectedList = __spreadArray([], selectedProductIds, true);
                            selectedSubmittedList = products
                                .filter(function (p) {
                                var _a;
                                return selectedProductIds.has(Number(p.productId)) &&
                                    Number((_a = p.productStatus) !== null && _a !== void 0 ? _a : 0) === 1;
                            })
                                .map(function (p) { return Number(p.productId); })
                                .filter(function (id) { return Number.isFinite(id); });
                            skippedCount = Math.max(selectedList.length - selectedSubmittedList.length, 0);
                            return [4 /*yield*/, this.productModel.updateMany(__assign(__assign({}, baseFilter), { productId: { $in: selectedSubmittedList }, 
                                    // Only submitted EOIs move to certified on approval.
                                    productStatus: 1 }), {
                                    $set: __assign(__assign({ urnStatus: URN_STATUS_VERIFICATION_COMPLETED }, validityFields), { productStatus: PRODUCT_STATUS_CERTIFIED, certifiedDate: dates.certifiedDate, updatedDate: now }),
                                }, updateOpts)];
                        case 2:
                            certifyResult = _b.sent();
                            return [4 /*yield*/, this.productModel.updateMany(__assign(__assign({}, baseFilter), { productId: { $nin: selectedList }, productStatus: { $in: [0, 1] } }), {
                                    $set: {
                                        urnStatus: URN_STATUS_VERIFICATION_COMPLETED,
                                        productStatus: PRODUCT_STATUS_REJECTED,
                                        updatedDate: now,
                                    },
                                }, updateOpts)];
                        case 3:
                            rejectResult = _b.sent();
                            return [2 /*return*/, {
                                    certifiedCount: certifyResult.modifiedCount,
                                    rejectedCount: rejectResult.modifiedCount,
                                    skippedCount: skippedCount,
                                }];
                    }
                });
            });
        };
        CertificationLifecycleService_1.prototype.toObjectId = function (value, label) {
            if (value instanceof mongoose_1.Types.ObjectId) {
                return value;
            }
            var trimmed = String(value !== null && value !== void 0 ? value : '').trim();
            if (!mongoose_1.Types.ObjectId.isValid(trimmed)) {
                throw new common_1.BadRequestException("Invalid ".concat(label));
            }
            return new mongoose_1.Types.ObjectId(trimmed);
        };
        return CertificationLifecycleService_1;
    }());
    __setFunctionName(_classThis, "CertificationLifecycleService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CertificationLifecycleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CertificationLifecycleService = _classThis;
}();
exports.CertificationLifecycleService = CertificationLifecycleService;
