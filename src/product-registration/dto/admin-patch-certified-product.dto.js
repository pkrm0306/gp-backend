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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPatchCertifiedProductDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function omitEmptyOptional(value) {
    if (value === '' || value === null) {
        return undefined;
    }
    return value;
}
/** Multipart or JSON body for admin certified product edit (PATCH). */
var AdminPatchCertifiedProductDto = function () {
    var _a;
    var _productName_decorators;
    var _productName_initializers = [];
    var _productName_extraInitializers = [];
    var _productDetails_decorators;
    var _productDetails_initializers = [];
    var _productDetails_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _validtillDate_decorators;
    var _validtillDate_initializers = [];
    var _validtillDate_extraInitializers = [];
    var _validTillDate_decorators;
    var _validTillDate_initializers = [];
    var _validTillDate_extraInitializers = [];
    var _remove_image_decorators;
    var _remove_image_initializers = [];
    var _remove_image_extraInitializers = [];
    var _delete_image_decorators;
    var _delete_image_initializers = [];
    var _delete_image_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AdminPatchCertifiedProductDto() {
                this.productName = __runInitializers(this, _productName_initializers, void 0);
                this.productDetails = (__runInitializers(this, _productName_extraInitializers), __runInitializers(this, _productDetails_initializers, void 0));
                this.urnNo = (__runInitializers(this, _productDetails_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
                this.eoiNo = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
                this.categoryId = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.validtillDate = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _validtillDate_initializers, void 0));
                this.validTillDate = (__runInitializers(this, _validtillDate_extraInitializers), __runInitializers(this, _validTillDate_initializers, void 0));
                /** Multipart: `1` / `true` clears the stored product image. */
                this.remove_image = (__runInitializers(this, _validTillDate_extraInitializers), __runInitializers(this, _remove_image_initializers, void 0));
                this.delete_image = (__runInitializers(this, _remove_image_extraInitializers), __runInitializers(this, _delete_image_initializers, void 0));
                __runInitializers(this, _delete_image_extraInitializers);
            }
            return AdminPatchCertifiedProductDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productName_decorators = [(0, swagger_1.ApiProperty)({ example: 'UltraTech Weather Plus V5' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _productDetails_decorators = [(0, swagger_1.ApiProperty)({ example: 'High-performance weather-resistant cement.' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? '' : String(value);
                }), (0, class_validator_1.IsString)()];
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260527122016' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _eoiNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'GPABC001001' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _categoryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Read-only on certified edit — omit or send the unchanged category id. Category cannot be modified for certified products.',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.IsMongoId)()];
            _validtillDate_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Valid till date (ISO 8601 date or datetime)',
                    example: '2028-12-31',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value, obj = _b.obj;
                    return omitEmptyOptional(value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.validTillDate);
                }), (0, class_validator_1.IsNotEmpty)({ message: 'validtillDate is required' }), (0, class_validator_1.IsDateString)()];
            _validTillDate_decorators = [(0, class_validator_1.Allow)()];
            _remove_image_decorators = [(0, class_validator_1.Allow)()];
            _delete_image_decorators = [(0, class_validator_1.Allow)()];
            __esDecorate(null, null, _productName_decorators, { kind: "field", name: "productName", static: false, private: false, access: { has: function (obj) { return "productName" in obj; }, get: function (obj) { return obj.productName; }, set: function (obj, value) { obj.productName = value; } }, metadata: _metadata }, _productName_initializers, _productName_extraInitializers);
            __esDecorate(null, null, _productDetails_decorators, { kind: "field", name: "productDetails", static: false, private: false, access: { has: function (obj) { return "productDetails" in obj; }, get: function (obj) { return obj.productDetails; }, set: function (obj, value) { obj.productDetails = value; } }, metadata: _metadata }, _productDetails_initializers, _productDetails_extraInitializers);
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _validtillDate_decorators, { kind: "field", name: "validtillDate", static: false, private: false, access: { has: function (obj) { return "validtillDate" in obj; }, get: function (obj) { return obj.validtillDate; }, set: function (obj, value) { obj.validtillDate = value; } }, metadata: _metadata }, _validtillDate_initializers, _validtillDate_extraInitializers);
            __esDecorate(null, null, _validTillDate_decorators, { kind: "field", name: "validTillDate", static: false, private: false, access: { has: function (obj) { return "validTillDate" in obj; }, get: function (obj) { return obj.validTillDate; }, set: function (obj, value) { obj.validTillDate = value; } }, metadata: _metadata }, _validTillDate_initializers, _validTillDate_extraInitializers);
            __esDecorate(null, null, _remove_image_decorators, { kind: "field", name: "remove_image", static: false, private: false, access: { has: function (obj) { return "remove_image" in obj; }, get: function (obj) { return obj.remove_image; }, set: function (obj, value) { obj.remove_image = value; } }, metadata: _metadata }, _remove_image_initializers, _remove_image_extraInitializers);
            __esDecorate(null, null, _delete_image_decorators, { kind: "field", name: "delete_image", static: false, private: false, access: { has: function (obj) { return "delete_image" in obj; }, get: function (obj) { return obj.delete_image; }, set: function (obj, value) { obj.delete_image = value; } }, metadata: _metadata }, _delete_image_initializers, _delete_image_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdminPatchCertifiedProductDto = AdminPatchCertifiedProductDto;
