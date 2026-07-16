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
exports.VendorProductChangeRequestDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function trimString(value) {
    return String(value !== null && value !== void 0 ? value : '').trim();
}
var VendorProductChangeRequestDto = function () {
    var _a;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _currentName_decorators;
    var _currentName_initializers = [];
    var _currentName_extraInitializers = [];
    var _requestedName_decorators;
    var _requestedName_initializers = [];
    var _requestedName_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VendorProductChangeRequestDto() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.urnNo = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
                this.eoiNo = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
                this.currentName = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _currentName_initializers, void 0));
                this.requestedName = (__runInitializers(this, _currentName_extraInitializers), __runInitializers(this, _requestedName_initializers, void 0));
                this.reason = (__runInitializers(this, _requestedName_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return VendorProductChangeRequestDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'MongoDB product _id from certified products list',
                    example: '66545c2f3d4f04cc8ec2ab11',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimString(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsMongoId)()];
            _urnNo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'URN number (optional; server falls back to product URN)',
                    example: 'URN-20260527122016',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : trimString(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _eoiNo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'EOI number (optional; server falls back to product EOI)',
                    example: 'GPPM1003016',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : trimString(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _currentName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Current product name shown in vendor certified list',
                    example: 'new product m2',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimString(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _requestedName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Requested new product name (required)',
                    example: 'new product m2 updated',
                    required: true,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimString(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'New Product Name is required.' }), (0, class_validator_1.MinLength)(1, { message: 'New Product Name is required.' }), (0, class_validator_1.MaxLength)(500, {
                    message: 'New Product Name must not exceed 500 characters.',
                })];
            _reason_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Reason for product name change request (required)',
                    example: 'Brand naming correction required after compliance review.',
                    required: true,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimString(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'Reason is required.' }), (0, class_validator_1.MinLength)(1, { message: 'Reason is required.' })];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
            __esDecorate(null, null, _currentName_decorators, { kind: "field", name: "currentName", static: false, private: false, access: { has: function (obj) { return "currentName" in obj; }, get: function (obj) { return obj.currentName; }, set: function (obj, value) { obj.currentName = value; } }, metadata: _metadata }, _currentName_initializers, _currentName_extraInitializers);
            __esDecorate(null, null, _requestedName_decorators, { kind: "field", name: "requestedName", static: false, private: false, access: { has: function (obj) { return "requestedName" in obj; }, get: function (obj) { return obj.requestedName; }, set: function (obj, value) { obj.requestedName = value; } }, metadata: _metadata }, _requestedName_initializers, _requestedName_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VendorProductChangeRequestDto = VendorProductChangeRequestDto;
