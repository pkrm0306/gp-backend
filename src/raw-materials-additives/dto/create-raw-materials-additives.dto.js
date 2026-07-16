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
exports.CreateRawMaterialsAdditivesDto = exports.AdditivesUnitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var AdditivesUnitDto = function () {
    var _a;
    var _unitName_decorators;
    var _unitName_initializers = [];
    var _unitName_extraInitializers = [];
    var _year1_decorators;
    var _year1_initializers = [];
    var _year1_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _year1a_decorators;
    var _year1a_initializers = [];
    var _year1a_extraInitializers = [];
    var _year1b_decorators;
    var _year1b_initializers = [];
    var _year1b_extraInitializers = [];
    var _year1c_decorators;
    var _year1c_initializers = [];
    var _year1c_extraInitializers = [];
    var _year2_decorators;
    var _year2_initializers = [];
    var _year2_extraInitializers = [];
    var _year2a_decorators;
    var _year2a_initializers = [];
    var _year2a_extraInitializers = [];
    var _year2b_decorators;
    var _year2b_initializers = [];
    var _year2b_extraInitializers = [];
    var _year2c_decorators;
    var _year2c_initializers = [];
    var _year2c_extraInitializers = [];
    var _year3_decorators;
    var _year3_initializers = [];
    var _year3_extraInitializers = [];
    var _year3a_decorators;
    var _year3a_initializers = [];
    var _year3a_extraInitializers = [];
    var _year3b_decorators;
    var _year3b_initializers = [];
    var _year3b_extraInitializers = [];
    var _year3c_decorators;
    var _year3c_initializers = [];
    var _year3c_extraInitializers = [];
    var _ppc_decorators;
    var _ppc_initializers = [];
    var _ppc_extraInitializers = [];
    var _psc_decorators;
    var _psc_initializers = [];
    var _psc_extraInitializers = [];
    var _coc_decorators;
    var _coc_initializers = [];
    var _coc_extraInitializers = [];
    var _percentcoc_decorators;
    var _percentcoc_initializers = [];
    var _percentcoc_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AdditivesUnitDto() {
                this.unitName = __runInitializers(this, _unitName_initializers, void 0);
                this.year1 = (__runInitializers(this, _unitName_extraInitializers), __runInitializers(this, _year1_initializers, void 0));
                this.year = (__runInitializers(this, _year1_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.year1a = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _year1a_initializers, void 0));
                this.year1b = (__runInitializers(this, _year1a_extraInitializers), __runInitializers(this, _year1b_initializers, void 0));
                this.year1c = (__runInitializers(this, _year1b_extraInitializers), __runInitializers(this, _year1c_initializers, void 0));
                this.year2 = (__runInitializers(this, _year1c_extraInitializers), __runInitializers(this, _year2_initializers, void 0));
                this.year2a = (__runInitializers(this, _year2_extraInitializers), __runInitializers(this, _year2a_initializers, void 0));
                this.year2b = (__runInitializers(this, _year2a_extraInitializers), __runInitializers(this, _year2b_initializers, void 0));
                this.year2c = (__runInitializers(this, _year2b_extraInitializers), __runInitializers(this, _year2c_initializers, void 0));
                this.year3 = (__runInitializers(this, _year2c_extraInitializers), __runInitializers(this, _year3_initializers, void 0));
                this.year3a = (__runInitializers(this, _year3_extraInitializers), __runInitializers(this, _year3a_initializers, void 0));
                this.year3b = (__runInitializers(this, _year3a_extraInitializers), __runInitializers(this, _year3b_initializers, void 0));
                this.year3c = (__runInitializers(this, _year3b_extraInitializers), __runInitializers(this, _year3c_initializers, void 0));
                this.ppc = (__runInitializers(this, _year3c_extraInitializers), __runInitializers(this, _ppc_initializers, void 0));
                this.psc = (__runInitializers(this, _ppc_extraInitializers), __runInitializers(this, _psc_initializers, void 0));
                this.coc = (__runInitializers(this, _psc_extraInitializers), __runInitializers(this, _coc_initializers, void 0));
                this.percentcoc = (__runInitializers(this, _coc_extraInitializers), __runInitializers(this, _percentcoc_initializers, void 0));
                __runInitializers(this, _percentcoc_extraInitializers);
            }
            return AdditivesUnitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _unitName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Unit name',
                    example: 'Manufacturing Unit - A',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _year1_decorators = [(0, swagger_1.ApiProperty)({ example: 100 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Optional legacy year field from frontend payload',
                    example: 2026,
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year1a_decorators = [(0, swagger_1.ApiProperty)({ example: 20 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year1b_decorators = [(0, swagger_1.ApiProperty)({ example: 30 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year1c_decorators = [(0, swagger_1.ApiProperty)({ example: 50 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year2_decorators = [(0, swagger_1.ApiProperty)({ example: 110 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year2a_decorators = [(0, swagger_1.ApiProperty)({ example: 25 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year2b_decorators = [(0, swagger_1.ApiProperty)({ example: 35 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year2c_decorators = [(0, swagger_1.ApiProperty)({ example: 50 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year3_decorators = [(0, swagger_1.ApiProperty)({ example: 120 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year3a_decorators = [(0, swagger_1.ApiProperty)({ example: 30 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year3b_decorators = [(0, swagger_1.ApiProperty)({ example: 40 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _year3c_decorators = [(0, swagger_1.ApiProperty)({ example: 50 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _ppc_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Optional PPC text value from frontend payload',
                    example: 'PPC description',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _psc_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'PSC text value',
                    example: 'PSC description',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _coc_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'COC text value',
                    example: 'COC description',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _percentcoc_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Percent COC text value',
                    example: '15%',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _unitName_decorators, { kind: "field", name: "unitName", static: false, private: false, access: { has: function (obj) { return "unitName" in obj; }, get: function (obj) { return obj.unitName; }, set: function (obj, value) { obj.unitName = value; } }, metadata: _metadata }, _unitName_initializers, _unitName_extraInitializers);
            __esDecorate(null, null, _year1_decorators, { kind: "field", name: "year1", static: false, private: false, access: { has: function (obj) { return "year1" in obj; }, get: function (obj) { return obj.year1; }, set: function (obj, value) { obj.year1 = value; } }, metadata: _metadata }, _year1_initializers, _year1_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _year1a_decorators, { kind: "field", name: "year1a", static: false, private: false, access: { has: function (obj) { return "year1a" in obj; }, get: function (obj) { return obj.year1a; }, set: function (obj, value) { obj.year1a = value; } }, metadata: _metadata }, _year1a_initializers, _year1a_extraInitializers);
            __esDecorate(null, null, _year1b_decorators, { kind: "field", name: "year1b", static: false, private: false, access: { has: function (obj) { return "year1b" in obj; }, get: function (obj) { return obj.year1b; }, set: function (obj, value) { obj.year1b = value; } }, metadata: _metadata }, _year1b_initializers, _year1b_extraInitializers);
            __esDecorate(null, null, _year1c_decorators, { kind: "field", name: "year1c", static: false, private: false, access: { has: function (obj) { return "year1c" in obj; }, get: function (obj) { return obj.year1c; }, set: function (obj, value) { obj.year1c = value; } }, metadata: _metadata }, _year1c_initializers, _year1c_extraInitializers);
            __esDecorate(null, null, _year2_decorators, { kind: "field", name: "year2", static: false, private: false, access: { has: function (obj) { return "year2" in obj; }, get: function (obj) { return obj.year2; }, set: function (obj, value) { obj.year2 = value; } }, metadata: _metadata }, _year2_initializers, _year2_extraInitializers);
            __esDecorate(null, null, _year2a_decorators, { kind: "field", name: "year2a", static: false, private: false, access: { has: function (obj) { return "year2a" in obj; }, get: function (obj) { return obj.year2a; }, set: function (obj, value) { obj.year2a = value; } }, metadata: _metadata }, _year2a_initializers, _year2a_extraInitializers);
            __esDecorate(null, null, _year2b_decorators, { kind: "field", name: "year2b", static: false, private: false, access: { has: function (obj) { return "year2b" in obj; }, get: function (obj) { return obj.year2b; }, set: function (obj, value) { obj.year2b = value; } }, metadata: _metadata }, _year2b_initializers, _year2b_extraInitializers);
            __esDecorate(null, null, _year2c_decorators, { kind: "field", name: "year2c", static: false, private: false, access: { has: function (obj) { return "year2c" in obj; }, get: function (obj) { return obj.year2c; }, set: function (obj, value) { obj.year2c = value; } }, metadata: _metadata }, _year2c_initializers, _year2c_extraInitializers);
            __esDecorate(null, null, _year3_decorators, { kind: "field", name: "year3", static: false, private: false, access: { has: function (obj) { return "year3" in obj; }, get: function (obj) { return obj.year3; }, set: function (obj, value) { obj.year3 = value; } }, metadata: _metadata }, _year3_initializers, _year3_extraInitializers);
            __esDecorate(null, null, _year3a_decorators, { kind: "field", name: "year3a", static: false, private: false, access: { has: function (obj) { return "year3a" in obj; }, get: function (obj) { return obj.year3a; }, set: function (obj, value) { obj.year3a = value; } }, metadata: _metadata }, _year3a_initializers, _year3a_extraInitializers);
            __esDecorate(null, null, _year3b_decorators, { kind: "field", name: "year3b", static: false, private: false, access: { has: function (obj) { return "year3b" in obj; }, get: function (obj) { return obj.year3b; }, set: function (obj, value) { obj.year3b = value; } }, metadata: _metadata }, _year3b_initializers, _year3b_extraInitializers);
            __esDecorate(null, null, _year3c_decorators, { kind: "field", name: "year3c", static: false, private: false, access: { has: function (obj) { return "year3c" in obj; }, get: function (obj) { return obj.year3c; }, set: function (obj, value) { obj.year3c = value; } }, metadata: _metadata }, _year3c_initializers, _year3c_extraInitializers);
            __esDecorate(null, null, _ppc_decorators, { kind: "field", name: "ppc", static: false, private: false, access: { has: function (obj) { return "ppc" in obj; }, get: function (obj) { return obj.ppc; }, set: function (obj, value) { obj.ppc = value; } }, metadata: _metadata }, _ppc_initializers, _ppc_extraInitializers);
            __esDecorate(null, null, _psc_decorators, { kind: "field", name: "psc", static: false, private: false, access: { has: function (obj) { return "psc" in obj; }, get: function (obj) { return obj.psc; }, set: function (obj, value) { obj.psc = value; } }, metadata: _metadata }, _psc_initializers, _psc_extraInitializers);
            __esDecorate(null, null, _coc_decorators, { kind: "field", name: "coc", static: false, private: false, access: { has: function (obj) { return "coc" in obj; }, get: function (obj) { return obj.coc; }, set: function (obj, value) { obj.coc = value; } }, metadata: _metadata }, _coc_initializers, _coc_extraInitializers);
            __esDecorate(null, null, _percentcoc_decorators, { kind: "field", name: "percentcoc", static: false, private: false, access: { has: function (obj) { return "percentcoc" in obj; }, get: function (obj) { return obj.percentcoc; }, set: function (obj, value) { obj.percentcoc = value; } }, metadata: _metadata }, _percentcoc_initializers, _percentcoc_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdditivesUnitDto = AdditivesUnitDto;
var CreateRawMaterialsAdditivesDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _additivesFileName_decorators;
    var _additivesFileName_initializers = [];
    var _additivesFileName_extraInitializers = [];
    var _units_decorators;
    var _units_initializers = [];
    var _units_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRawMaterialsAdditivesDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.additivesFileName = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _additivesFileName_initializers, void 0));
                this.units = (__runInitializers(this, _additivesFileName_extraInitializers), __runInitializers(this, _units_initializers, void 0));
                __runInitializers(this, _units_extraInitializers);
            }
            return CreateRawMaterialsAdditivesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(64)];
            _additivesFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Display name for uploaded supporting file',
                    example: 'Additives Supporting Document - 2026',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _units_decorators = [(0, swagger_1.ApiProperty)({
                    type: [AdditivesUnitDto],
                    description: 'Manufacturing unit rows to replace in one request for this URN',
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return AdditivesUnitDto; })];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _additivesFileName_decorators, { kind: "field", name: "additivesFileName", static: false, private: false, access: { has: function (obj) { return "additivesFileName" in obj; }, get: function (obj) { return obj.additivesFileName; }, set: function (obj, value) { obj.additivesFileName = value; } }, metadata: _metadata }, _additivesFileName_initializers, _additivesFileName_extraInitializers);
            __esDecorate(null, null, _units_decorators, { kind: "field", name: "units", static: false, private: false, access: { has: function (obj) { return "units" in obj; }, get: function (obj) { return obj.units; }, set: function (obj, value) { obj.units = value; } }, metadata: _metadata }, _units_initializers, _units_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRawMaterialsAdditivesDto = CreateRawMaterialsAdditivesDto;
