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
exports.VendorPatchCertifiedProductDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function omitEmptyOptional(value) {
    if (value === '' || value === null) {
        return undefined;
    }
    return value;
}
/**
 * Vendor edit payload for certified product list popup.
 * Supports patching only fields exposed in vendor UI.
 */
var VendorPatchCertifiedProductDto = function () {
    var _a;
    var _productName_decorators;
    var _productName_initializers = [];
    var _productName_extraInitializers = [];
    var _productDetails_decorators;
    var _productDetails_initializers = [];
    var _productDetails_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VendorPatchCertifiedProductDto() {
                this.productName = __runInitializers(this, _productName_initializers, void 0);
                this.productDetails = (__runInitializers(this, _productName_extraInitializers), __runInitializers(this, _productDetails_initializers, void 0));
                __runInitializers(this, _productDetails_extraInitializers);
            }
            return VendorPatchCertifiedProductDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productName_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'UltraTech Weather Plus V5' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _productDetails_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'High-performance weather-resistant cement.' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? value : String(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _productName_decorators, { kind: "field", name: "productName", static: false, private: false, access: { has: function (obj) { return "productName" in obj; }, get: function (obj) { return obj.productName; }, set: function (obj, value) { obj.productName = value; } }, metadata: _metadata }, _productName_initializers, _productName_extraInitializers);
            __esDecorate(null, null, _productDetails_decorators, { kind: "field", name: "productDetails", static: false, private: false, access: { has: function (obj) { return "productDetails" in obj; }, get: function (obj) { return obj.productDetails; }, set: function (obj, value) { obj.productDetails = value; } }, metadata: _metadata }, _productDetails_initializers, _productDetails_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VendorPatchCertifiedProductDto = VendorPatchCertifiedProductDto;
