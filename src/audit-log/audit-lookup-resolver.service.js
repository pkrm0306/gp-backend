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
exports.AuditLookupResolver = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var parse_products_to_be_certified_util_1 = require("../product-registration/helpers/parse-products-to-be-certified.util");
var LOOKUP_FIELD_MODEL = {
    product: 'product',
    categoryid: 'category',
    category_id: 'category',
    sector: 'sector',
    sectorid: 'sector',
    sector_id: 'sector',
    manufacturerid: 'manufacturer',
    manufacturer_id: 'manufacturer',
    vendorid: 'manufacturer',
    vendor_id: 'manufacturer',
    countryid: 'country',
    country_id: 'country',
    stateid: 'state',
    state_id: 'state',
    standardid: 'standard',
    standard_id: 'standard',
    productid: 'product',
    product_id: 'product',
    productids: 'product',
    product_ids: 'product',
    productstobecertified: 'product',
    products_to_be_certified: 'product',
    productsid: 'product',
    products_id: 'product',
    productsids: 'product',
    products_ids: 'product',
    roleid: 'role',
    role_id: 'role',
    userid: 'user',
    user_id: 'user',
    createdby: 'user',
    created_by: 'user',
    updatedby: 'user',
    updated_by: 'user',
    deletedby: 'user',
    deleted_by: 'user',
};
/** Payment certification field stores JSON productId array as a string. */
var PRODUCT_ID_LIST_FIELDS = new Set(['productstobecertified']);
var AuditLookupResolver = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditLookupResolver = _classThis = /** @class */ (function () {
        function AuditLookupResolver_1(statusResolver, categoryModel, sectorModel, manufacturerModel, countryModel, stateModel, standardModel, productModel, roleModel, vendorUserModel) {
            this.statusResolver = statusResolver;
            this.categoryModel = categoryModel;
            this.sectorModel = sectorModel;
            this.manufacturerModel = manufacturerModel;
            this.countryModel = countryModel;
            this.stateModel = stateModel;
            this.standardModel = standardModel;
            this.productModel = productModel;
            this.roleModel = roleModel;
            this.vendorUserModel = vendorUserModel;
        }
        AuditLookupResolver_1.prototype.collectValues = function (values) {
            var valuesByModel = new Map();
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var valueSet = values_1[_i];
                this.collectRecordValues(valueSet, valuesByModel);
            }
            return valuesByModel;
        };
        AuditLookupResolver_1.prototype.onlyModels = function (valuesByModel, modelNames) {
            var allowed = new Set(modelNames);
            return new Map(Array.from(valuesByModel.entries()).filter(function (_a) {
                var modelName = _a[0];
                return allowed.has(modelName);
            }));
        };
        AuditLookupResolver_1.prototype.resolveLookupLabels = function (valuesByModel) {
            return __awaiter(this, void 0, void 0, function () {
                var configs, out;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            configs = this.lookupModels();
                            out = new Map();
                            return [4 /*yield*/, Promise.all(Array.from(valuesByModel.entries()).map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                    var config, rawValues, objectIds, numericValues, or, docs, _i, docs_1, doc, label;
                                    var _c;
                                    var modelName = _b[0], values = _b[1];
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                config = configs[modelName];
                                                rawValues = Array.from(values);
                                                objectIds = rawValues
                                                    .filter(function (v) { return mongoose_1.Types.ObjectId.isValid(v); })
                                                    .map(function (v) { return new mongoose_1.Types.ObjectId(v); });
                                                numericValues = rawValues
                                                    .map(function (v) { return Number(v); })
                                                    .filter(function (v) { return Number.isInteger(v); });
                                                or = [];
                                                if (objectIds.length) {
                                                    or.push({ _id: { $in: objectIds } });
                                                }
                                                if (config.numericField && numericValues.length) {
                                                    or.push((_c = {}, _c[config.numericField] = { $in: numericValues }, _c));
                                                }
                                                if (!or.length) {
                                                    return [2 /*return*/];
                                                }
                                                return [4 /*yield*/, config.model
                                                        .find({ $or: or })
                                                        .lean()
                                                        .exec()];
                                            case 1:
                                                docs = (_d.sent());
                                                for (_i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
                                                    doc = docs_1[_i];
                                                    label = this.pickLabel(doc, config.labelFields);
                                                    if (!label) {
                                                        continue;
                                                    }
                                                    if (doc['_id']) {
                                                        out.set(this.lookupCacheKey(modelName, String(doc['_id'])), label);
                                                    }
                                                    if (config.numericField && doc[config.numericField] !== undefined) {
                                                        out.set(this.lookupCacheKey(modelName, String(doc[config.numericField])), label);
                                                    }
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, out];
                    }
                });
            });
        };
        AuditLookupResolver_1.prototype.resolveLabel = function (labels, key, value) {
            var _a;
            var modelName = LOOKUP_FIELD_MODEL[this.statusResolver.normalizeKey(key)];
            if (!modelName) {
                return undefined;
            }
            if (this.isProductIdListField(key)) {
                return this.resolveProductIdListLabel(labels, value);
            }
            if (!this.canLookupValue(value)) {
                return undefined;
            }
            return ((_a = labels.get(this.lookupCacheKey(modelName, String(value)))) !== null && _a !== void 0 ? _a : this.fallbackLabel(modelName, value));
        };
        AuditLookupResolver_1.prototype.collectRecordValues = function (valueSet, valuesByModel) {
            var _a;
            if (!valueSet || typeof valueSet !== 'object') {
                return;
            }
            if (Array.isArray(valueSet)) {
                for (var _i = 0, valueSet_1 = valueSet; _i < valueSet_1.length; _i++) {
                    var item = valueSet_1[_i];
                    this.collectRecordValues(item, valuesByModel);
                }
                return;
            }
            for (var _b = 0, _c = Object.entries(valueSet); _b < _c.length; _b++) {
                var _d = _c[_b], key = _d[0], value = _d[1];
                var modelName = LOOKUP_FIELD_MODEL[this.statusResolver.normalizeKey(key)];
                if (modelName) {
                    var lookupValues = this.lookupValues(key, value);
                    if (!lookupValues.length) {
                        this.collectRecordValues(value, valuesByModel);
                        continue;
                    }
                    var bucket = (_a = valuesByModel.get(modelName)) !== null && _a !== void 0 ? _a : new Set();
                    for (var _e = 0, lookupValues_1 = lookupValues; _e < lookupValues_1.length; _e++) {
                        var lookupValue = lookupValues_1[_e];
                        bucket.add(String(lookupValue));
                    }
                    valuesByModel.set(modelName, bucket);
                    continue;
                }
                this.collectRecordValues(value, valuesByModel);
            }
        };
        AuditLookupResolver_1.prototype.lookupModels = function () {
            return {
                category: {
                    model: this.categoryModel,
                    numericField: 'category_id',
                    labelFields: ['category_name'],
                },
                sector: {
                    model: this.sectorModel,
                    numericField: 'id',
                    labelFields: ['name'],
                },
                manufacturer: {
                    model: this.manufacturerModel,
                    labelFields: ['manufacturerName', 'vendor_name', 'vendor_email'],
                },
                country: {
                    model: this.countryModel,
                    numericField: 'id',
                    labelFields: ['countryName', 'countryCode', 'country_code'],
                },
                state: {
                    model: this.stateModel,
                    labelFields: ['stateName', 'stateCode'],
                },
                standard: {
                    model: this.standardModel,
                    numericField: 'id',
                    labelFields: ['name'],
                },
                product: {
                    model: this.productModel,
                    numericField: 'productId',
                    labelFields: ['productName', 'urnNo', 'eoiNo'],
                },
                role: {
                    model: this.roleModel,
                    labelFields: ['name'],
                },
                user: {
                    model: this.vendorUserModel,
                    labelFields: ['name', 'email'],
                },
            };
        };
        AuditLookupResolver_1.prototype.canLookupValue = function (value) {
            return ((typeof value === 'string' && value.trim() !== '') ||
                (typeof value === 'number' && Number.isFinite(value)));
        };
        AuditLookupResolver_1.prototype.isProductIdListField = function (key) {
            return PRODUCT_ID_LIST_FIELDS.has(this.statusResolver.normalizeKey(key));
        };
        AuditLookupResolver_1.prototype.productIdsFromListValue = function (value) {
            if (typeof value === 'string') {
                var parsed = (0, parse_products_to_be_certified_util_1.parseProductsToBeCertified)(value);
                return {
                    productIds: parsed.productIds,
                    mongoIds: parsed.mongoIds.map(function (id) { return String(id); }),
                };
            }
            if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
                return { productIds: [Math.trunc(value)], mongoIds: [] };
            }
            if (Array.isArray(value)) {
                var productIds = [];
                var mongoIds = [];
                for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                    var item = value_1[_i];
                    if (typeof item === 'number' && Number.isFinite(item) && item > 0) {
                        productIds.push(Math.trunc(item));
                        continue;
                    }
                    if (typeof item === 'string' && item.trim()) {
                        var nested = (0, parse_products_to_be_certified_util_1.parseProductsToBeCertified)(item);
                        productIds.push.apply(productIds, nested.productIds);
                        mongoIds.push.apply(mongoIds, nested.mongoIds.map(function (id) { return String(id); }));
                    }
                }
                return {
                    productIds: __spreadArray([], new Set(productIds), true),
                    mongoIds: __spreadArray([], new Set(mongoIds), true),
                };
            }
            return { productIds: [], mongoIds: [] };
        };
        AuditLookupResolver_1.prototype.resolveProductIdListLabel = function (labels, value) {
            var _this = this;
            var _a = this.productIdsFromListValue(value), productIds = _a.productIds, mongoIds = _a.mongoIds;
            var lookupKeys = __spreadArray(__spreadArray([], productIds.map(function (id) { return String(id); }), true), mongoIds, true);
            if (!lookupKeys.length) {
                return undefined;
            }
            var names = lookupKeys.map(function (id) {
                var _a, _b;
                return (_b = (_a = labels.get(_this.lookupCacheKey('product', id))) !== null && _a !== void 0 ? _a : _this.fallbackLabel('product', id)) !== null && _b !== void 0 ? _b : id;
            });
            return names.join(', ');
        };
        AuditLookupResolver_1.prototype.lookupValues = function (key, value) {
            var _this = this;
            if (this.isProductIdListField(key)) {
                var _a = this.productIdsFromListValue(value), productIds = _a.productIds, mongoIds = _a.mongoIds;
                return __spreadArray(__spreadArray([], productIds, true), mongoIds, true);
            }
            if (this.canLookupValue(value)) {
                return [value];
            }
            if (Array.isArray(value)) {
                return value.filter(function (item) {
                    return _this.canLookupValue(item);
                });
            }
            return [];
        };
        AuditLookupResolver_1.prototype.lookupCacheKey = function (modelName, value) {
            return "".concat(modelName, ":").concat(value);
        };
        AuditLookupResolver_1.prototype.fallbackLabel = function (modelName, value) {
            if (modelName !== 'product') {
                return undefined;
            }
            return "Deleted product (".concat(String(value), ")");
        };
        AuditLookupResolver_1.prototype.pickLabel = function (doc, fields) {
            for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                var field = fields_1[_i];
                var value = doc[field];
                if (typeof value === 'string' && value.trim()) {
                    return value.trim();
                }
                if (typeof value === 'number') {
                    return String(value);
                }
            }
            return undefined;
        };
        return AuditLookupResolver_1;
    }());
    __setFunctionName(_classThis, "AuditLookupResolver");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditLookupResolver = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditLookupResolver = _classThis;
}();
exports.AuditLookupResolver = AuditLookupResolver;
