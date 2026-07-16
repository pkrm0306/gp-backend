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
exports.AdminAddProductToUrnDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var plant_dto_1 = require("./plant.dto");
var AdminAddProductToUrnDto = function () {
    var _a;
    var _productName_decorators;
    var _productName_initializers = [];
    var _productName_extraInitializers = [];
    var _productDetails_decorators;
    var _productDetails_initializers = [];
    var _productDetails_extraInitializers = [];
    var _plants_decorators;
    var _plants_initializers = [];
    var _plants_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _productImage_decorators;
    var _productImage_initializers = [];
    var _productImage_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AdminAddProductToUrnDto() {
                this.productName = __runInitializers(this, _productName_initializers, void 0);
                this.productDetails = (__runInitializers(this, _productName_extraInitializers), __runInitializers(this, _productDetails_initializers, void 0));
                this.plants = (__runInitializers(this, _productDetails_extraInitializers), __runInitializers(this, _plants_initializers, void 0));
                this.categoryId = (__runInitializers(this, _plants_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.productImage = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _productImage_initializers, void 0));
                __runInitializers(this, _productImage_extraInitializers);
            }
            return AdminAddProductToUrnDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productName_decorators = [(0, swagger_1.ApiProperty)({ example: 'New solar panel model' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _productDetails_decorators = [(0, swagger_1.ApiProperty)({ example: 'Product description text' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _plants_decorators = [(0, swagger_1.ApiProperty)({ type: [plant_dto_1.PlantDto] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return plant_dto_1.PlantDto; }), (0, class_validator_1.IsNotEmpty)()];
            _categoryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Must match URN locked category when provided',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsMongoId)()];
            _productImage_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _productName_decorators, { kind: "field", name: "productName", static: false, private: false, access: { has: function (obj) { return "productName" in obj; }, get: function (obj) { return obj.productName; }, set: function (obj, value) { obj.productName = value; } }, metadata: _metadata }, _productName_initializers, _productName_extraInitializers);
            __esDecorate(null, null, _productDetails_decorators, { kind: "field", name: "productDetails", static: false, private: false, access: { has: function (obj) { return "productDetails" in obj; }, get: function (obj) { return obj.productDetails; }, set: function (obj, value) { obj.productDetails = value; } }, metadata: _metadata }, _productDetails_initializers, _productDetails_extraInitializers);
            __esDecorate(null, null, _plants_decorators, { kind: "field", name: "plants", static: false, private: false, access: { has: function (obj) { return "plants" in obj; }, get: function (obj) { return obj.plants; }, set: function (obj, value) { obj.plants = value; } }, metadata: _metadata }, _plants_initializers, _plants_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _productImage_decorators, { kind: "field", name: "productImage", static: false, private: false, access: { has: function (obj) { return "productImage" in obj; }, get: function (obj) { return obj.productImage; }, set: function (obj, value) { obj.productImage = value; } }, metadata: _metadata }, _productImage_initializers, _productImage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdminAddProductToUrnDto = AdminAddProductToUrnDto;
