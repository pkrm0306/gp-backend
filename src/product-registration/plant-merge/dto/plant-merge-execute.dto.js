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
exports.PlantMergeExecuteDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var PlantMergeExecuteDto = function () {
    var _a;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _targetPlantId_decorators;
    var _targetPlantId_initializers = [];
    var _targetPlantId_extraInitializers = [];
    var _sourcePlantIds_decorators;
    var _sourcePlantIds_initializers = [];
    var _sourcePlantIds_extraInitializers = [];
    var _mergeStrategy_decorators;
    var _mergeStrategy_initializers = [];
    var _mergeStrategy_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PlantMergeExecuteDto() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.targetPlantId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _targetPlantId_initializers, void 0));
                this.sourcePlantIds = (__runInitializers(this, _targetPlantId_extraInitializers), __runInitializers(this, _sourcePlantIds_initializers, void 0));
                this.mergeStrategy = (__runInitializers(this, _sourcePlantIds_extraInitializers), __runInitializers(this, _mergeStrategy_initializers, void 0));
                __runInitializers(this, _mergeStrategy_extraInitializers);
            }
            return PlantMergeExecuteDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'MongoDB product _id' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetPlantId_decorators = [(0, swagger_1.ApiProperty)({ description: 'MongoDB _id of surviving plant' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _sourcePlantIds_decorators = [(0, swagger_1.ApiProperty)({ type: [String], description: 'MongoDB _ids of plants to absorb' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayNotEmpty)(), (0, class_validator_1.IsString)({ each: true })];
            _mergeStrategy_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 'absorb_soft_delete_source' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _targetPlantId_decorators, { kind: "field", name: "targetPlantId", static: false, private: false, access: { has: function (obj) { return "targetPlantId" in obj; }, get: function (obj) { return obj.targetPlantId; }, set: function (obj, value) { obj.targetPlantId = value; } }, metadata: _metadata }, _targetPlantId_initializers, _targetPlantId_extraInitializers);
            __esDecorate(null, null, _sourcePlantIds_decorators, { kind: "field", name: "sourcePlantIds", static: false, private: false, access: { has: function (obj) { return "sourcePlantIds" in obj; }, get: function (obj) { return obj.sourcePlantIds; }, set: function (obj, value) { obj.sourcePlantIds = value; } }, metadata: _metadata }, _sourcePlantIds_initializers, _sourcePlantIds_extraInitializers);
            __esDecorate(null, null, _mergeStrategy_decorators, { kind: "field", name: "mergeStrategy", static: false, private: false, access: { has: function (obj) { return "mergeStrategy" in obj; }, get: function (obj) { return obj.mergeStrategy; }, set: function (obj, value) { obj.mergeStrategy = value; } }, metadata: _metadata }, _mergeStrategy_initializers, _mergeStrategy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PlantMergeExecuteDto = PlantMergeExecuteDto;
