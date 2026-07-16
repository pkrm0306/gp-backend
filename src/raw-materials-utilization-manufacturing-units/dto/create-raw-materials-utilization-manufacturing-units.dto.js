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
exports.CreateRawMaterialsUtilizationManufacturingUnitsDto = exports.UtilizationManufacturingUnitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var UtilizationManufacturingUnitDto = function () {
    var _a;
    var _unitName_decorators;
    var _unitName_initializers = [];
    var _unitName_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _yeardata1_decorators;
    var _yeardata1_initializers = [];
    var _yeardata1_extraInitializers = [];
    var _yeardata2_decorators;
    var _yeardata2_initializers = [];
    var _yeardata2_extraInitializers = [];
    var _yeardata3_decorators;
    var _yeardata3_initializers = [];
    var _yeardata3_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UtilizationManufacturingUnitDto() {
                this.unitName = __runInitializers(this, _unitName_initializers, void 0);
                this.year = (__runInitializers(this, _unitName_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.yeardata1 = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _yeardata1_initializers, void 0));
                this.yeardata2 = (__runInitializers(this, _yeardata1_extraInitializers), __runInitializers(this, _yeardata2_initializers, void 0));
                this.yeardata3 = (__runInitializers(this, _yeardata2_extraInitializers), __runInitializers(this, _yeardata3_initializers, void 0));
                __runInitializers(this, _yeardata3_extraInitializers);
            }
            return UtilizationManufacturingUnitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _unitName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Unit name',
                    example: 'Manufacturing Unit A',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _year_decorators = [(0, swagger_1.ApiProperty)({ example: 2026 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _yeardata1_decorators = [(0, swagger_1.ApiProperty)({ example: 10 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _yeardata2_decorators = [(0, swagger_1.ApiProperty)({ example: 20 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _yeardata3_decorators = [(0, swagger_1.ApiProperty)({ example: 30 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _unitName_decorators, { kind: "field", name: "unitName", static: false, private: false, access: { has: function (obj) { return "unitName" in obj; }, get: function (obj) { return obj.unitName; }, set: function (obj, value) { obj.unitName = value; } }, metadata: _metadata }, _unitName_initializers, _unitName_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _yeardata1_decorators, { kind: "field", name: "yeardata1", static: false, private: false, access: { has: function (obj) { return "yeardata1" in obj; }, get: function (obj) { return obj.yeardata1; }, set: function (obj, value) { obj.yeardata1 = value; } }, metadata: _metadata }, _yeardata1_initializers, _yeardata1_extraInitializers);
            __esDecorate(null, null, _yeardata2_decorators, { kind: "field", name: "yeardata2", static: false, private: false, access: { has: function (obj) { return "yeardata2" in obj; }, get: function (obj) { return obj.yeardata2; }, set: function (obj, value) { obj.yeardata2 = value; } }, metadata: _metadata }, _yeardata2_initializers, _yeardata2_extraInitializers);
            __esDecorate(null, null, _yeardata3_decorators, { kind: "field", name: "yeardata3", static: false, private: false, access: { has: function (obj) { return "yeardata3" in obj; }, get: function (obj) { return obj.yeardata3; }, set: function (obj, value) { obj.yeardata3 = value; } }, metadata: _metadata }, _yeardata3_initializers, _yeardata3_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UtilizationManufacturingUnitDto = UtilizationManufacturingUnitDto;
var CreateRawMaterialsUtilizationManufacturingUnitsDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _units_decorators;
    var _units_initializers = [];
    var _units_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRawMaterialsUtilizationManufacturingUnitsDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.units = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _units_initializers, void 0));
                __runInitializers(this, _units_extraInitializers);
            }
            return CreateRawMaterialsUtilizationManufacturingUnitsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(64)];
            _units_decorators = [(0, swagger_1.ApiProperty)({
                    type: [UtilizationManufacturingUnitDto],
                    description: 'Manufacturing unit rows to create in one request. Preferred over legacy single-row fields.',
                    required: true,
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return UtilizationManufacturingUnitDto; })];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _units_decorators, { kind: "field", name: "units", static: false, private: false, access: { has: function (obj) { return "units" in obj; }, get: function (obj) { return obj.units; }, set: function (obj, value) { obj.units = value; } }, metadata: _metadata }, _units_initializers, _units_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRawMaterialsUtilizationManufacturingUnitsDto = CreateRawMaterialsUtilizationManufacturingUnitsDto;
