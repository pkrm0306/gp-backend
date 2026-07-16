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
exports.PlantMergeUrnExecuteDto = exports.PlantMergeUrnExecutePairDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var PlantMergeUrnExecutePairDto = function () {
    var _a;
    var _sourceEoiNo_decorators;
    var _sourceEoiNo_initializers = [];
    var _sourceEoiNo_extraInitializers = [];
    var _targetUrnNo_decorators;
    var _targetUrnNo_initializers = [];
    var _targetUrnNo_extraInitializers = [];
    var _targetEoiNo_decorators;
    var _targetEoiNo_initializers = [];
    var _targetEoiNo_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PlantMergeUrnExecutePairDto() {
                this.sourceEoiNo = __runInitializers(this, _sourceEoiNo_initializers, void 0);
                this.targetUrnNo = (__runInitializers(this, _sourceEoiNo_extraInitializers), __runInitializers(this, _targetUrnNo_initializers, void 0));
                this.targetEoiNo = (__runInitializers(this, _targetUrnNo_extraInitializers), __runInitializers(this, _targetEoiNo_initializers, void 0));
                __runInitializers(this, _targetEoiNo_extraInitializers);
            }
            return PlantMergeUrnExecutePairDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sourceEoiNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'GPCEM002' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetUrnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20250115100000' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetEoiNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'GPCEM001' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _sourceEoiNo_decorators, { kind: "field", name: "sourceEoiNo", static: false, private: false, access: { has: function (obj) { return "sourceEoiNo" in obj; }, get: function (obj) { return obj.sourceEoiNo; }, set: function (obj, value) { obj.sourceEoiNo = value; } }, metadata: _metadata }, _sourceEoiNo_initializers, _sourceEoiNo_extraInitializers);
            __esDecorate(null, null, _targetUrnNo_decorators, { kind: "field", name: "targetUrnNo", static: false, private: false, access: { has: function (obj) { return "targetUrnNo" in obj; }, get: function (obj) { return obj.targetUrnNo; }, set: function (obj, value) { obj.targetUrnNo = value; } }, metadata: _metadata }, _targetUrnNo_initializers, _targetUrnNo_extraInitializers);
            __esDecorate(null, null, _targetEoiNo_decorators, { kind: "field", name: "targetEoiNo", static: false, private: false, access: { has: function (obj) { return "targetEoiNo" in obj; }, get: function (obj) { return obj.targetEoiNo; }, set: function (obj, value) { obj.targetEoiNo = value; } }, metadata: _metadata }, _targetEoiNo_initializers, _targetEoiNo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PlantMergeUrnExecutePairDto = PlantMergeUrnExecutePairDto;
var PlantMergeUrnExecuteDto = function () {
    var _a;
    var _sourceUrnNo_decorators;
    var _sourceUrnNo_initializers = [];
    var _sourceUrnNo_extraInitializers = [];
    var _pairs_decorators;
    var _pairs_initializers = [];
    var _pairs_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PlantMergeUrnExecuteDto() {
                this.sourceUrnNo = __runInitializers(this, _sourceUrnNo_initializers, void 0);
                this.pairs = (__runInitializers(this, _sourceUrnNo_extraInitializers), __runInitializers(this, _pairs_initializers, void 0));
                __runInitializers(this, _pairs_extraInitializers);
            }
            return PlantMergeUrnExecuteDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sourceUrnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260301120000' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _pairs_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Explicit source/target EOI pairs. When omitted, all READY preview matches are executed.',
                    type: [PlantMergeUrnExecutePairDto],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return PlantMergeUrnExecutePairDto; })];
            __esDecorate(null, null, _sourceUrnNo_decorators, { kind: "field", name: "sourceUrnNo", static: false, private: false, access: { has: function (obj) { return "sourceUrnNo" in obj; }, get: function (obj) { return obj.sourceUrnNo; }, set: function (obj, value) { obj.sourceUrnNo = value; } }, metadata: _metadata }, _sourceUrnNo_initializers, _sourceUrnNo_extraInitializers);
            __esDecorate(null, null, _pairs_decorators, { kind: "field", name: "pairs", static: false, private: false, access: { has: function (obj) { return "pairs" in obj; }, get: function (obj) { return obj.pairs; }, set: function (obj, value) { obj.pairs = value; } }, metadata: _metadata }, _pairs_initializers, _pairs_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PlantMergeUrnExecuteDto = PlantMergeUrnExecuteDto;
