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
exports.CertificationExpiryQueryService = void 0;
var common_1 = require("@nestjs/common");
var active_product_filter_1 = require("../../product-registration/constants/active-product.filter");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var renewal_urn_status_constants_1 = require("../../renew/constants/renewal-urn-status.constants");
var ACTIVE_RENEWAL_URN_STATUSES = [12, 13, 14, 15, 16, 17];
var CertificationExpiryQueryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CertificationExpiryQueryService = _classThis = /** @class */ (function () {
        function CertificationExpiryQueryService_1(productModel) {
            this.productModel = productModel;
        }
        /** Legacy getEligibleProducts() + MERN renewal exclusions (notify jobs only). */
        CertificationExpiryQueryService_1.prototype.getEligibleProducts = function () {
            return __awaiter(this, arguments, void 0, function (asOf) {
                var thresholdDate;
                if (asOf === void 0) { asOf = new Date(); }
                return __generator(this, function (_a) {
                    thresholdDate = new Date(asOf);
                    thresholdDate.setDate(thresholdDate.getDate() + 60);
                    return [2 /*return*/, this.findExpiryProducts(__assign(__assign({}, (0, active_product_filter_1.matchActiveProducts)()), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.NOT_RENEWED, urnStatus: { $nin: ACTIVE_RENEWAL_URN_STATUSES }, validtillDate: { $exists: true, $ne: null, $lt: thresholdDate } }))];
                });
            });
        };
        /** Certified products past validtill — no renewal/URN exclusions (deactivation only). */
        CertificationExpiryQueryService_1.prototype.getDeactivationEligibleProducts = function () {
            return __awaiter(this, arguments, void 0, function (asOf) {
                if (asOf === void 0) { asOf = new Date(); }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.findExpiryProducts(__assign(__assign({}, (0, active_product_filter_1.matchActiveProducts)()), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, validtillDate: { $exists: true, $ne: null, $lte: asOf } }))];
                });
            });
        };
        CertificationExpiryQueryService_1.prototype.findExpiryProducts = function (match) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .aggregate([
                                { $match: match },
                                {
                                    $lookup: {
                                        from: 'vendors',
                                        localField: 'vendorId',
                                        foreignField: '_id',
                                        as: 'vendor',
                                    },
                                },
                                { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
                                {
                                    $lookup: {
                                        from: 'categories',
                                        localField: 'categoryId',
                                        foreignField: '_id',
                                        as: 'category',
                                    },
                                },
                                { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                                {
                                    $lookup: {
                                        from: 'manufacturers',
                                        localField: 'manufacturerId',
                                        foreignField: '_id',
                                        as: 'manufacturer',
                                    },
                                },
                                { $unwind: { path: '$manufacturer', preserveNullAndEmptyArrays: true } },
                                {
                                    $group: {
                                        _id: '$vendorId',
                                        vendorProductCount: { $sum: 1 },
                                        products: { $push: '$$ROOT' },
                                    },
                                },
                                { $unwind: '$products' },
                                {
                                    $replaceRoot: {
                                        newRoot: {
                                            $mergeObjects: [
                                                '$products',
                                                { vendorProductCount: '$vendorProductCount' },
                                            ],
                                        },
                                    },
                                },
                                { $sort: { createdDate: -1 } },
                            ])
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) { return _this.mapRow(row); })];
                    }
                });
            });
        };
        CertificationExpiryQueryService_1.prototype.mapRow = function (row) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            var vendor = row.vendor;
            var category = row.category;
            var manufacturer = row.manufacturer;
            return {
                productId: Number(row.productId),
                eoiNo: String((_a = row.eoiNo) !== null && _a !== void 0 ? _a : ''),
                urnNo: String((_b = row.urnNo) !== null && _b !== void 0 ? _b : ''),
                productName: String((_c = row.productName) !== null && _c !== void 0 ? _c : ''),
                productStatus: Number((_d = row.productStatus) !== null && _d !== void 0 ? _d : 0),
                productRenewStatus: Number((_e = row.productRenewStatus) !== null && _e !== void 0 ? _e : 0),
                urnStatus: Number((_f = row.urnStatus) !== null && _f !== void 0 ? _f : 0),
                renewCycleNo: row.renewCycleNo != null ? Number(row.renewCycleNo) : null,
                validtillDate: row.validtillDate,
                firstNotifyDate: (_g = row.firstNotifyDate) !== null && _g !== void 0 ? _g : null,
                secondNotifyDate: (_h = row.secondNotifyDate) !== null && _h !== void 0 ? _h : null,
                thirdNotifyDate: (_j = row.thirdNotifyDate) !== null && _j !== void 0 ? _j : null,
                vendorId: row.vendorId,
                vendorName: (_k = vendor === null || vendor === void 0 ? void 0 : vendor.vendorName) !== null && _k !== void 0 ? _k : null,
                vendorEmail: (_l = vendor === null || vendor === void 0 ? void 0 : vendor.vendorEmail) !== null && _l !== void 0 ? _l : null,
                vendorPhone: (_m = vendor === null || vendor === void 0 ? void 0 : vendor.vendorPhone) !== null && _m !== void 0 ? _m : null,
                vendorDesignation: (_o = vendor === null || vendor === void 0 ? void 0 : vendor.vendorDesignation) !== null && _o !== void 0 ? _o : null,
                vendorGst: (_p = vendor === null || vendor === void 0 ? void 0 : vendor.vendorGst) !== null && _p !== void 0 ? _p : null,
                vendorStatus: (vendor === null || vendor === void 0 ? void 0 : vendor.vendorStatus) != null ? Number(vendor.vendorStatus) : null,
                categoryName: (_r = (_q = category === null || category === void 0 ? void 0 : category.categoryName) !== null && _q !== void 0 ? _q : category === null || category === void 0 ? void 0 : category.category_name) !== null && _r !== void 0 ? _r : null,
                manufacturerName: (_s = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _s !== void 0 ? _s : null,
                vendorProductCount: Number((_t = row.vendorProductCount) !== null && _t !== void 0 ? _t : 1),
            };
        };
        return CertificationExpiryQueryService_1;
    }());
    __setFunctionName(_classThis, "CertificationExpiryQueryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CertificationExpiryQueryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CertificationExpiryQueryService = _classThis;
}();
exports.CertificationExpiryQueryService = CertificationExpiryQueryService;
