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
exports.CreateRawMaterialsReduceEnvironmentalDto = exports.ReduceEnvironmentalUnitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var ReduceEnvironmentalUnitDto = function () {
    var _a;
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _enhancementOfMinesLife_decorators;
    var _enhancementOfMinesLife_initializers = [];
    var _enhancementOfMinesLife_extraInitializers = [];
    var _topsoilConservation_decorators;
    var _topsoilConservation_initializers = [];
    var _topsoilConservation_extraInitializers = [];
    var _waterTableManagement_decorators;
    var _waterTableManagement_initializers = [];
    var _waterTableManagement_extraInitializers = [];
    var _restorationOfSpentMines_decorators;
    var _restorationOfSpentMines_initializers = [];
    var _restorationOfSpentMines_extraInitializers = [];
    var _greenBeltDevelopmentAndBioDiversity_decorators;
    var _greenBeltDevelopmentAndBioDiversity_initializers = [];
    var _greenBeltDevelopmentAndBioDiversity_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReduceEnvironmentalUnitDto() {
                this.location = __runInitializers(this, _location_initializers, void 0);
                this.enhancementOfMinesLife = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _enhancementOfMinesLife_initializers, void 0));
                this.topsoilConservation = (__runInitializers(this, _enhancementOfMinesLife_extraInitializers), __runInitializers(this, _topsoilConservation_initializers, void 0));
                this.waterTableManagement = (__runInitializers(this, _topsoilConservation_extraInitializers), __runInitializers(this, _waterTableManagement_initializers, void 0));
                this.restorationOfSpentMines = (__runInitializers(this, _waterTableManagement_extraInitializers), __runInitializers(this, _restorationOfSpentMines_initializers, void 0));
                this.greenBeltDevelopmentAndBioDiversity = (__runInitializers(this, _restorationOfSpentMines_extraInitializers), __runInitializers(this, _greenBeltDevelopmentAndBioDiversity_initializers, void 0));
                __runInitializers(this, _greenBeltDevelopmentAndBioDiversity_extraInitializers);
            }
            return ReduceEnvironmentalUnitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _location_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Location',
                    example: 'Mine site location details',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _enhancementOfMinesLife_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Enhancement of mines life',
                    example: 'Measures for enhancement of mines life',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _topsoilConservation_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Topsoil conservation',
                    example: 'Topsoil conservation measures',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _waterTableManagement_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Water table management',
                    example: 'Water table management measures',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _restorationOfSpentMines_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Restoration of spent mines',
                    example: 'Restoration plan details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _greenBeltDevelopmentAndBioDiversity_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Green belt development and biodiversity',
                    example: 'Green belt development and biodiversity initiatives',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _enhancementOfMinesLife_decorators, { kind: "field", name: "enhancementOfMinesLife", static: false, private: false, access: { has: function (obj) { return "enhancementOfMinesLife" in obj; }, get: function (obj) { return obj.enhancementOfMinesLife; }, set: function (obj, value) { obj.enhancementOfMinesLife = value; } }, metadata: _metadata }, _enhancementOfMinesLife_initializers, _enhancementOfMinesLife_extraInitializers);
            __esDecorate(null, null, _topsoilConservation_decorators, { kind: "field", name: "topsoilConservation", static: false, private: false, access: { has: function (obj) { return "topsoilConservation" in obj; }, get: function (obj) { return obj.topsoilConservation; }, set: function (obj, value) { obj.topsoilConservation = value; } }, metadata: _metadata }, _topsoilConservation_initializers, _topsoilConservation_extraInitializers);
            __esDecorate(null, null, _waterTableManagement_decorators, { kind: "field", name: "waterTableManagement", static: false, private: false, access: { has: function (obj) { return "waterTableManagement" in obj; }, get: function (obj) { return obj.waterTableManagement; }, set: function (obj, value) { obj.waterTableManagement = value; } }, metadata: _metadata }, _waterTableManagement_initializers, _waterTableManagement_extraInitializers);
            __esDecorate(null, null, _restorationOfSpentMines_decorators, { kind: "field", name: "restorationOfSpentMines", static: false, private: false, access: { has: function (obj) { return "restorationOfSpentMines" in obj; }, get: function (obj) { return obj.restorationOfSpentMines; }, set: function (obj, value) { obj.restorationOfSpentMines = value; } }, metadata: _metadata }, _restorationOfSpentMines_initializers, _restorationOfSpentMines_extraInitializers);
            __esDecorate(null, null, _greenBeltDevelopmentAndBioDiversity_decorators, { kind: "field", name: "greenBeltDevelopmentAndBioDiversity", static: false, private: false, access: { has: function (obj) { return "greenBeltDevelopmentAndBioDiversity" in obj; }, get: function (obj) { return obj.greenBeltDevelopmentAndBioDiversity; }, set: function (obj, value) { obj.greenBeltDevelopmentAndBioDiversity = value; } }, metadata: _metadata }, _greenBeltDevelopmentAndBioDiversity_initializers, _greenBeltDevelopmentAndBioDiversity_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReduceEnvironmentalUnitDto = ReduceEnvironmentalUnitDto;
var CreateRawMaterialsReduceEnvironmentalDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _units_decorators;
    var _units_initializers = [];
    var _units_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _enhancementOfMinesLife_decorators;
    var _enhancementOfMinesLife_initializers = [];
    var _enhancementOfMinesLife_extraInitializers = [];
    var _topsoilConservation_decorators;
    var _topsoilConservation_initializers = [];
    var _topsoilConservation_extraInitializers = [];
    var _waterTableManagement_decorators;
    var _waterTableManagement_initializers = [];
    var _waterTableManagement_extraInitializers = [];
    var _restorationOfSpentMines_decorators;
    var _restorationOfSpentMines_initializers = [];
    var _restorationOfSpentMines_extraInitializers = [];
    var _greenBeltDevelopmentAndBioDiversity_decorators;
    var _greenBeltDevelopmentAndBioDiversity_initializers = [];
    var _greenBeltDevelopmentAndBioDiversity_extraInitializers = [];
    var _reduceEnvironmentalFileName_decorators;
    var _reduceEnvironmentalFileName_initializers = [];
    var _reduceEnvironmentalFileName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRawMaterialsReduceEnvironmentalDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.units = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _units_initializers, void 0));
                this.location = (__runInitializers(this, _units_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.enhancementOfMinesLife = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _enhancementOfMinesLife_initializers, void 0));
                this.topsoilConservation = (__runInitializers(this, _enhancementOfMinesLife_extraInitializers), __runInitializers(this, _topsoilConservation_initializers, void 0));
                this.waterTableManagement = (__runInitializers(this, _topsoilConservation_extraInitializers), __runInitializers(this, _waterTableManagement_initializers, void 0));
                this.restorationOfSpentMines = (__runInitializers(this, _waterTableManagement_extraInitializers), __runInitializers(this, _restorationOfSpentMines_initializers, void 0));
                this.greenBeltDevelopmentAndBioDiversity = (__runInitializers(this, _restorationOfSpentMines_extraInitializers), __runInitializers(this, _greenBeltDevelopmentAndBioDiversity_initializers, void 0));
                this.reduceEnvironmentalFileName = (__runInitializers(this, _greenBeltDevelopmentAndBioDiversity_extraInitializers), __runInitializers(this, _reduceEnvironmentalFileName_initializers, void 0));
                __runInitializers(this, _reduceEnvironmentalFileName_extraInitializers);
            }
            return CreateRawMaterialsReduceEnvironmentalDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(64)];
            _units_decorators = [(0, swagger_1.ApiProperty)({
                    type: [ReduceEnvironmentalUnitDto],
                    description: 'Rows to replace for this URN. If provided, all existing rows are replaced with this array.',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return ReduceEnvironmentalUnitDto; })];
            _location_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Location (legacy single-row mode)',
                    example: 'Mine site location details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _enhancementOfMinesLife_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Enhancement of mines life (legacy single-row mode)',
                    example: 'Measures for enhancement of mines life',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _topsoilConservation_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Topsoil conservation (legacy single-row mode)',
                    example: 'Topsoil conservation measures',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _waterTableManagement_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Water table management (legacy single-row mode)',
                    example: 'Water table management measures',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _restorationOfSpentMines_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Restoration of spent mines (legacy single-row mode)',
                    example: 'Restoration plan details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _greenBeltDevelopmentAndBioDiversity_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Green belt development and biodiversity (legacy single-row mode)',
                    example: 'Green belt development and biodiversity initiatives',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _reduceEnvironmentalFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Display name for uploaded supporting file',
                    example: 'Reduce Environmental Supporting Document - 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _units_decorators, { kind: "field", name: "units", static: false, private: false, access: { has: function (obj) { return "units" in obj; }, get: function (obj) { return obj.units; }, set: function (obj, value) { obj.units = value; } }, metadata: _metadata }, _units_initializers, _units_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _enhancementOfMinesLife_decorators, { kind: "field", name: "enhancementOfMinesLife", static: false, private: false, access: { has: function (obj) { return "enhancementOfMinesLife" in obj; }, get: function (obj) { return obj.enhancementOfMinesLife; }, set: function (obj, value) { obj.enhancementOfMinesLife = value; } }, metadata: _metadata }, _enhancementOfMinesLife_initializers, _enhancementOfMinesLife_extraInitializers);
            __esDecorate(null, null, _topsoilConservation_decorators, { kind: "field", name: "topsoilConservation", static: false, private: false, access: { has: function (obj) { return "topsoilConservation" in obj; }, get: function (obj) { return obj.topsoilConservation; }, set: function (obj, value) { obj.topsoilConservation = value; } }, metadata: _metadata }, _topsoilConservation_initializers, _topsoilConservation_extraInitializers);
            __esDecorate(null, null, _waterTableManagement_decorators, { kind: "field", name: "waterTableManagement", static: false, private: false, access: { has: function (obj) { return "waterTableManagement" in obj; }, get: function (obj) { return obj.waterTableManagement; }, set: function (obj, value) { obj.waterTableManagement = value; } }, metadata: _metadata }, _waterTableManagement_initializers, _waterTableManagement_extraInitializers);
            __esDecorate(null, null, _restorationOfSpentMines_decorators, { kind: "field", name: "restorationOfSpentMines", static: false, private: false, access: { has: function (obj) { return "restorationOfSpentMines" in obj; }, get: function (obj) { return obj.restorationOfSpentMines; }, set: function (obj, value) { obj.restorationOfSpentMines = value; } }, metadata: _metadata }, _restorationOfSpentMines_initializers, _restorationOfSpentMines_extraInitializers);
            __esDecorate(null, null, _greenBeltDevelopmentAndBioDiversity_decorators, { kind: "field", name: "greenBeltDevelopmentAndBioDiversity", static: false, private: false, access: { has: function (obj) { return "greenBeltDevelopmentAndBioDiversity" in obj; }, get: function (obj) { return obj.greenBeltDevelopmentAndBioDiversity; }, set: function (obj, value) { obj.greenBeltDevelopmentAndBioDiversity = value; } }, metadata: _metadata }, _greenBeltDevelopmentAndBioDiversity_initializers, _greenBeltDevelopmentAndBioDiversity_extraInitializers);
            __esDecorate(null, null, _reduceEnvironmentalFileName_decorators, { kind: "field", name: "reduceEnvironmentalFileName", static: false, private: false, access: { has: function (obj) { return "reduceEnvironmentalFileName" in obj; }, get: function (obj) { return obj.reduceEnvironmentalFileName; }, set: function (obj, value) { obj.reduceEnvironmentalFileName = value; } }, metadata: _metadata }, _reduceEnvironmentalFileName_initializers, _reduceEnvironmentalFileName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRawMaterialsReduceEnvironmentalDto = CreateRawMaterialsReduceEnvironmentalDto;
