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
exports.AdminListProductsFilterOptionsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var admin_list_products_dto_1 = require("./admin-list-products.dto");
var AdminListProductsFilterOptionsDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _productStatus_decorators;
    var _productStatus_initializers = [];
    var _productStatus_extraInitializers = [];
    var _product_status_decorators;
    var _product_status_initializers = [];
    var _product_status_extraInitializers = [];
    var _countryId_decorators;
    var _countryId_initializers = [];
    var _countryId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AdminListProductsFilterOptionsDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.productStatus = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _productStatus_initializers, void 0));
                this.product_status = (__runInitializers(this, _productStatus_extraInitializers), __runInitializers(this, _product_status_initializers, void 0));
                this.countryId = (__runInitializers(this, _product_status_extraInitializers), __runInitializers(this, _countryId_initializers, void 0));
                __runInitializers(this, _countryId_extraInitializers);
            }
            return AdminListProductsFilterOptionsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'EOI productStatus scope for dropdown values. Default `[2]` (certified).',
                    type: [Number],
                    example: [2],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, admin_list_products_dto_1.normalizeNumberArray)(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4], { each: true })];
            _productStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `status`.',
                    type: [Number],
                    example: [2],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, admin_list_products_dto_1.normalizeNumberArray)(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4], { each: true })];
            _product_status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `status`.',
                    type: [Number],
                    example: [2],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, admin_list_products_dto_1.normalizeNumberArray)(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4], { each: true })];
            _countryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Optional plant country scope (reserved; city filter is free text on the list body, not loaded from this endpoint).',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsMongoId)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _productStatus_decorators, { kind: "field", name: "productStatus", static: false, private: false, access: { has: function (obj) { return "productStatus" in obj; }, get: function (obj) { return obj.productStatus; }, set: function (obj, value) { obj.productStatus = value; } }, metadata: _metadata }, _productStatus_initializers, _productStatus_extraInitializers);
            __esDecorate(null, null, _product_status_decorators, { kind: "field", name: "product_status", static: false, private: false, access: { has: function (obj) { return "product_status" in obj; }, get: function (obj) { return obj.product_status; }, set: function (obj, value) { obj.product_status = value; } }, metadata: _metadata }, _product_status_initializers, _product_status_extraInitializers);
            __esDecorate(null, null, _countryId_decorators, { kind: "field", name: "countryId", static: false, private: false, access: { has: function (obj) { return "countryId" in obj; }, get: function (obj) { return obj.countryId; }, set: function (obj, value) { obj.countryId = value; } }, metadata: _metadata }, _countryId_initializers, _countryId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdminListProductsFilterOptionsDto = AdminListProductsFilterOptionsDto;
