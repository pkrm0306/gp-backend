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
exports.CreateProcessManufacturingDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var parse_optional_number_util_1 = require("../../common/utils/parse-optional-number.util");
var CreateProcessManufacturingDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _portableWaterDemand_decorators;
    var _portableWaterDemand_initializers = [];
    var _portableWaterDemand_extraInitializers = [];
    var _rainWaterHarvesting_decorators;
    var _rainWaterHarvesting_initializers = [];
    var _rainWaterHarvesting_extraInitializers = [];
    var _beyondTheFenceInitiatives_decorators;
    var _beyondTheFenceInitiatives_initializers = [];
    var _beyondTheFenceInitiatives_extraInitializers = [];
    var _totalEnergyConsumption_decorators;
    var _totalEnergyConsumption_initializers = [];
    var _totalEnergyConsumption_extraInitializers = [];
    var _processManufacturingStatus_decorators;
    var _processManufacturingStatus_initializers = [];
    var _processManufacturingStatus_extraInitializers = [];
    var _energyConservationSupportingDocumentsFileName_decorators;
    var _energyConservationSupportingDocumentsFileName_initializers = [];
    var _energyConservationSupportingDocumentsFileName_extraInitializers = [];
    var _energyConsumptionDocumentsFileName_decorators;
    var _energyConsumptionDocumentsFileName_initializers = [];
    var _energyConsumptionDocumentsFileName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProcessManufacturingDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.portableWaterDemand = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _portableWaterDemand_initializers, void 0));
                this.rainWaterHarvesting = (__runInitializers(this, _portableWaterDemand_extraInitializers), __runInitializers(this, _rainWaterHarvesting_initializers, void 0));
                this.beyondTheFenceInitiatives = (__runInitializers(this, _rainWaterHarvesting_extraInitializers), __runInitializers(this, _beyondTheFenceInitiatives_initializers, void 0));
                this.totalEnergyConsumption = (__runInitializers(this, _beyondTheFenceInitiatives_extraInitializers), __runInitializers(this, _totalEnergyConsumption_initializers, void 0));
                this.processManufacturingStatus = (__runInitializers(this, _totalEnergyConsumption_extraInitializers), __runInitializers(this, _processManufacturingStatus_initializers, void 0));
                this.energyConservationSupportingDocumentsFileName = (__runInitializers(this, _processManufacturingStatus_extraInitializers), __runInitializers(this, _energyConservationSupportingDocumentsFileName_initializers, void 0));
                this.energyConsumptionDocumentsFileName = (__runInitializers(this, _energyConservationSupportingDocumentsFileName_extraInitializers), __runInitializers(this, _energyConsumptionDocumentsFileName_initializers, void 0));
                __runInitializers(this, _energyConsumptionDocumentsFileName_extraInitializers);
            }
            return CreateProcessManufacturingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _portableWaterDemand_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Portable water demand (text)',
                    example: 'Water demand details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rainWaterHarvesting_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Rain water harvesting (text)',
                    example: 'Rain water harvesting details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _beyondTheFenceInitiatives_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Beyond the fence initiatives (text)',
                    example: 'Beyond the fence initiatives details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _totalEnergyConsumption_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Total energy consumption',
                    example: 5000,
                    required: false,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var _c;
                    var value = _b.value;
                    return (_c = (0, parse_optional_number_util_1.parseOptionalDecimalNumber)(value)) !== null && _c !== void 0 ? _c : value;
                }), (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _processManufacturingStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Process manufacturing status (0=Pending, 1=Completed)',
                    example: 0,
                    required: false,
                    enum: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            _energyConservationSupportingDocumentsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Energy conservation supporting documents display name (required if uploading energyConservationSupportingDocumentsFile)',
                    example: 'Energy Conservation Supporting Documents - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _energyConsumptionDocumentsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Energy consumption documents display name (required if uploading energyConsumptionDocumentsFile)',
                    example: 'Energy Consumption Documents - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _portableWaterDemand_decorators, { kind: "field", name: "portableWaterDemand", static: false, private: false, access: { has: function (obj) { return "portableWaterDemand" in obj; }, get: function (obj) { return obj.portableWaterDemand; }, set: function (obj, value) { obj.portableWaterDemand = value; } }, metadata: _metadata }, _portableWaterDemand_initializers, _portableWaterDemand_extraInitializers);
            __esDecorate(null, null, _rainWaterHarvesting_decorators, { kind: "field", name: "rainWaterHarvesting", static: false, private: false, access: { has: function (obj) { return "rainWaterHarvesting" in obj; }, get: function (obj) { return obj.rainWaterHarvesting; }, set: function (obj, value) { obj.rainWaterHarvesting = value; } }, metadata: _metadata }, _rainWaterHarvesting_initializers, _rainWaterHarvesting_extraInitializers);
            __esDecorate(null, null, _beyondTheFenceInitiatives_decorators, { kind: "field", name: "beyondTheFenceInitiatives", static: false, private: false, access: { has: function (obj) { return "beyondTheFenceInitiatives" in obj; }, get: function (obj) { return obj.beyondTheFenceInitiatives; }, set: function (obj, value) { obj.beyondTheFenceInitiatives = value; } }, metadata: _metadata }, _beyondTheFenceInitiatives_initializers, _beyondTheFenceInitiatives_extraInitializers);
            __esDecorate(null, null, _totalEnergyConsumption_decorators, { kind: "field", name: "totalEnergyConsumption", static: false, private: false, access: { has: function (obj) { return "totalEnergyConsumption" in obj; }, get: function (obj) { return obj.totalEnergyConsumption; }, set: function (obj, value) { obj.totalEnergyConsumption = value; } }, metadata: _metadata }, _totalEnergyConsumption_initializers, _totalEnergyConsumption_extraInitializers);
            __esDecorate(null, null, _processManufacturingStatus_decorators, { kind: "field", name: "processManufacturingStatus", static: false, private: false, access: { has: function (obj) { return "processManufacturingStatus" in obj; }, get: function (obj) { return obj.processManufacturingStatus; }, set: function (obj, value) { obj.processManufacturingStatus = value; } }, metadata: _metadata }, _processManufacturingStatus_initializers, _processManufacturingStatus_extraInitializers);
            __esDecorate(null, null, _energyConservationSupportingDocumentsFileName_decorators, { kind: "field", name: "energyConservationSupportingDocumentsFileName", static: false, private: false, access: { has: function (obj) { return "energyConservationSupportingDocumentsFileName" in obj; }, get: function (obj) { return obj.energyConservationSupportingDocumentsFileName; }, set: function (obj, value) { obj.energyConservationSupportingDocumentsFileName = value; } }, metadata: _metadata }, _energyConservationSupportingDocumentsFileName_initializers, _energyConservationSupportingDocumentsFileName_extraInitializers);
            __esDecorate(null, null, _energyConsumptionDocumentsFileName_decorators, { kind: "field", name: "energyConsumptionDocumentsFileName", static: false, private: false, access: { has: function (obj) { return "energyConsumptionDocumentsFileName" in obj; }, get: function (obj) { return obj.energyConsumptionDocumentsFileName; }, set: function (obj, value) { obj.energyConsumptionDocumentsFileName = value; } }, metadata: _metadata }, _energyConsumptionDocumentsFileName_initializers, _energyConsumptionDocumentsFileName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProcessManufacturingDto = CreateProcessManufacturingDto;
