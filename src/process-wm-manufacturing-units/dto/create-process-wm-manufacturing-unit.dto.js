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
exports.CreateProcessWmManufacturingUnitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var optional_non_negative_number_decorator_1 = require("../../process-mp-manufacturing-units/validators/optional-non-negative-number.decorator");
var optional_number_decorator_1 = require("../../process-mp-manufacturing-units/validators/optional-number.decorator");
var CreateProcessWmManufacturingUnitDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _processWmManufacturingUnitId_decorators;
    var _processWmManufacturingUnitId_initializers = [];
    var _processWmManufacturingUnitId_extraInitializers = [];
    var _processWasteManagementId_decorators;
    var _processWasteManagementId_initializers = [];
    var _processWasteManagementId_extraInitializers = [];
    var _unitName_decorators;
    var _unitName_initializers = [];
    var _unitName_extraInitializers = [];
    var _hazardousWasteYear1_decorators;
    var _hazardousWasteYear1_initializers = [];
    var _hazardousWasteYear1_extraInitializers = [];
    var _hazardousWasteYear2_decorators;
    var _hazardousWasteYear2_initializers = [];
    var _hazardousWasteYear2_extraInitializers = [];
    var _hazardousWasteYear3_decorators;
    var _hazardousWasteYear3_initializers = [];
    var _hazardousWasteYear3_extraInitializers = [];
    var _hazardousWasteProductionUnit_decorators;
    var _hazardousWasteProductionUnit_initializers = [];
    var _hazardousWasteProductionUnit_extraInitializers = [];
    var _hazardousWasteQuantityUnit_decorators;
    var _hazardousWasteQuantityUnit_initializers = [];
    var _hazardousWasteQuantityUnit_extraInitializers = [];
    var _hazardousWasteProductionYear1_decorators;
    var _hazardousWasteProductionYear1_initializers = [];
    var _hazardousWasteProductionYear1_extraInitializers = [];
    var _hazardousWasteProductionYear2_decorators;
    var _hazardousWasteProductionYear2_initializers = [];
    var _hazardousWasteProductionYear2_extraInitializers = [];
    var _hazardousWasteProductionYear3_decorators;
    var _hazardousWasteProductionYear3_initializers = [];
    var _hazardousWasteProductionYear3_extraInitializers = [];
    var _hazardousWasteQuantityYear1_decorators;
    var _hazardousWasteQuantityYear1_initializers = [];
    var _hazardousWasteQuantityYear1_extraInitializers = [];
    var _hazardousWasteQuantityYear2_decorators;
    var _hazardousWasteQuantityYear2_initializers = [];
    var _hazardousWasteQuantityYear2_extraInitializers = [];
    var _hazardousWasteQuantityYear3_decorators;
    var _hazardousWasteQuantityYear3_initializers = [];
    var _hazardousWasteQuantityYear3_extraInitializers = [];
    var _nonHazardousWasteYear1_decorators;
    var _nonHazardousWasteYear1_initializers = [];
    var _nonHazardousWasteYear1_extraInitializers = [];
    var _nonHazardousWasteYear2_decorators;
    var _nonHazardousWasteYear2_initializers = [];
    var _nonHazardousWasteYear2_extraInitializers = [];
    var _nonHazardousWasteYear3_decorators;
    var _nonHazardousWasteYear3_initializers = [];
    var _nonHazardousWasteYear3_extraInitializers = [];
    var _nonHazardousWasteProductionUnit_decorators;
    var _nonHazardousWasteProductionUnit_initializers = [];
    var _nonHazardousWasteProductionUnit_extraInitializers = [];
    var _nonHazardousWasteWaterUnit_decorators;
    var _nonHazardousWasteWaterUnit_initializers = [];
    var _nonHazardousWasteWaterUnit_extraInitializers = [];
    var _nonHazardousWasteProductionYear1_decorators;
    var _nonHazardousWasteProductionYear1_initializers = [];
    var _nonHazardousWasteProductionYear1_extraInitializers = [];
    var _nonHazardousWasteProductionYear2_decorators;
    var _nonHazardousWasteProductionYear2_initializers = [];
    var _nonHazardousWasteProductionYear2_extraInitializers = [];
    var _nonHazardousWasteProductionYear3_decorators;
    var _nonHazardousWasteProductionYear3_initializers = [];
    var _nonHazardousWasteProductionYear3_extraInitializers = [];
    var _nonHazardousWasteWaterYear1_decorators;
    var _nonHazardousWasteWaterYear1_initializers = [];
    var _nonHazardousWasteWaterYear1_extraInitializers = [];
    var _nonHazardousWasteWaterYear2_decorators;
    var _nonHazardousWasteWaterYear2_initializers = [];
    var _nonHazardousWasteWaterYear2_extraInitializers = [];
    var _nonHazardousWasteWaterYear3_decorators;
    var _nonHazardousWasteWaterYear3_initializers = [];
    var _nonHazardousWasteWaterYear3_extraInitializers = [];
    var _calculateBulkRshwd_decorators;
    var _calculateBulkRshwd_initializers = [];
    var _calculateBulkRshwd_extraInitializers = [];
    var _calculateBulkRsnhwd_decorators;
    var _calculateBulkRsnhwd_initializers = [];
    var _calculateBulkRsnhwd_extraInitializers = [];
    var _calculateBulkRshwdMultipled_decorators;
    var _calculateBulkRshwdMultipled_initializers = [];
    var _calculateBulkRshwdMultipled_extraInitializers = [];
    var _calculateBulkRsnhwdMultipled_decorators;
    var _calculateBulkRsnhwdMultipled_initializers = [];
    var _calculateBulkRsnhwdMultipled_extraInitializers = [];
    var _wmImplementationDetailsWmUnits_decorators;
    var _wmImplementationDetailsWmUnits_initializers = [];
    var _wmImplementationDetailsWmUnits_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProcessWmManufacturingUnitDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.processWmManufacturingUnitId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _processWmManufacturingUnitId_initializers, void 0));
                this.processWasteManagementId = (__runInitializers(this, _processWmManufacturingUnitId_extraInitializers), __runInitializers(this, _processWasteManagementId_initializers, void 0));
                this.unitName = (__runInitializers(this, _processWasteManagementId_extraInitializers), __runInitializers(this, _unitName_initializers, void 0));
                this.hazardousWasteYear1 = (__runInitializers(this, _unitName_extraInitializers), __runInitializers(this, _hazardousWasteYear1_initializers, void 0));
                this.hazardousWasteYear2 = (__runInitializers(this, _hazardousWasteYear1_extraInitializers), __runInitializers(this, _hazardousWasteYear2_initializers, void 0));
                this.hazardousWasteYear3 = (__runInitializers(this, _hazardousWasteYear2_extraInitializers), __runInitializers(this, _hazardousWasteYear3_initializers, void 0));
                this.hazardousWasteProductionUnit = (__runInitializers(this, _hazardousWasteYear3_extraInitializers), __runInitializers(this, _hazardousWasteProductionUnit_initializers, void 0));
                this.hazardousWasteQuantityUnit = (__runInitializers(this, _hazardousWasteProductionUnit_extraInitializers), __runInitializers(this, _hazardousWasteQuantityUnit_initializers, void 0));
                this.hazardousWasteProductionYear1 = (__runInitializers(this, _hazardousWasteQuantityUnit_extraInitializers), __runInitializers(this, _hazardousWasteProductionYear1_initializers, void 0));
                this.hazardousWasteProductionYear2 = (__runInitializers(this, _hazardousWasteProductionYear1_extraInitializers), __runInitializers(this, _hazardousWasteProductionYear2_initializers, void 0));
                this.hazardousWasteProductionYear3 = (__runInitializers(this, _hazardousWasteProductionYear2_extraInitializers), __runInitializers(this, _hazardousWasteProductionYear3_initializers, void 0));
                this.hazardousWasteQuantityYear1 = (__runInitializers(this, _hazardousWasteProductionYear3_extraInitializers), __runInitializers(this, _hazardousWasteQuantityYear1_initializers, void 0));
                this.hazardousWasteQuantityYear2 = (__runInitializers(this, _hazardousWasteQuantityYear1_extraInitializers), __runInitializers(this, _hazardousWasteQuantityYear2_initializers, void 0));
                this.hazardousWasteQuantityYear3 = (__runInitializers(this, _hazardousWasteQuantityYear2_extraInitializers), __runInitializers(this, _hazardousWasteQuantityYear3_initializers, void 0));
                this.nonHazardousWasteYear1 = (__runInitializers(this, _hazardousWasteQuantityYear3_extraInitializers), __runInitializers(this, _nonHazardousWasteYear1_initializers, void 0));
                this.nonHazardousWasteYear2 = (__runInitializers(this, _nonHazardousWasteYear1_extraInitializers), __runInitializers(this, _nonHazardousWasteYear2_initializers, void 0));
                this.nonHazardousWasteYear3 = (__runInitializers(this, _nonHazardousWasteYear2_extraInitializers), __runInitializers(this, _nonHazardousWasteYear3_initializers, void 0));
                this.nonHazardousWasteProductionUnit = (__runInitializers(this, _nonHazardousWasteYear3_extraInitializers), __runInitializers(this, _nonHazardousWasteProductionUnit_initializers, void 0));
                this.nonHazardousWasteWaterUnit = (__runInitializers(this, _nonHazardousWasteProductionUnit_extraInitializers), __runInitializers(this, _nonHazardousWasteWaterUnit_initializers, void 0));
                this.nonHazardousWasteProductionYear1 = (__runInitializers(this, _nonHazardousWasteWaterUnit_extraInitializers), __runInitializers(this, _nonHazardousWasteProductionYear1_initializers, void 0));
                this.nonHazardousWasteProductionYear2 = (__runInitializers(this, _nonHazardousWasteProductionYear1_extraInitializers), __runInitializers(this, _nonHazardousWasteProductionYear2_initializers, void 0));
                this.nonHazardousWasteProductionYear3 = (__runInitializers(this, _nonHazardousWasteProductionYear2_extraInitializers), __runInitializers(this, _nonHazardousWasteProductionYear3_initializers, void 0));
                this.nonHazardousWasteWaterYear1 = (__runInitializers(this, _nonHazardousWasteProductionYear3_extraInitializers), __runInitializers(this, _nonHazardousWasteWaterYear1_initializers, void 0));
                this.nonHazardousWasteWaterYear2 = (__runInitializers(this, _nonHazardousWasteWaterYear1_extraInitializers), __runInitializers(this, _nonHazardousWasteWaterYear2_initializers, void 0));
                this.nonHazardousWasteWaterYear3 = (__runInitializers(this, _nonHazardousWasteWaterYear2_extraInitializers), __runInitializers(this, _nonHazardousWasteWaterYear3_initializers, void 0));
                this.calculateBulkRshwd = (__runInitializers(this, _nonHazardousWasteWaterYear3_extraInitializers), __runInitializers(this, _calculateBulkRshwd_initializers, void 0));
                this.calculateBulkRsnhwd = (__runInitializers(this, _calculateBulkRshwd_extraInitializers), __runInitializers(this, _calculateBulkRsnhwd_initializers, void 0));
                this.calculateBulkRshwdMultipled = (__runInitializers(this, _calculateBulkRsnhwd_extraInitializers), __runInitializers(this, _calculateBulkRshwdMultipled_initializers, void 0));
                this.calculateBulkRsnhwdMultipled = (__runInitializers(this, _calculateBulkRshwdMultipled_extraInitializers), __runInitializers(this, _calculateBulkRsnhwdMultipled_initializers, void 0));
                this.wmImplementationDetailsWmUnits = (__runInitializers(this, _calculateBulkRsnhwdMultipled_extraInitializers), __runInitializers(this, _wmImplementationDetailsWmUnits_initializers, void 0));
                __runInitializers(this, _wmImplementationDetailsWmUnits_extraInitializers);
            }
            return CreateProcessWmManufacturingUnitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _processWmManufacturingUnitId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Existing unit id — when provided, updates that row instead of creating',
                    required: false,
                    example: 58,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '')
                        return undefined;
                    var n = Number(value);
                    return Number.isFinite(n) ? n : value;
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _processWasteManagementId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Process waste management ID', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _unitName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit name', required: false, example: 'Unit A' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _hazardousWasteYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _hazardousWasteYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _hazardousWasteYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _hazardousWasteProductionUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _hazardousWasteQuantityUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _hazardousWasteProductionYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _hazardousWasteProductionYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _hazardousWasteProductionYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _hazardousWasteQuantityYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _hazardousWasteQuantityYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _hazardousWasteQuantityYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _nonHazardousWasteYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _nonHazardousWasteYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _nonHazardousWasteYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _nonHazardousWasteProductionUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _nonHazardousWasteWaterUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _nonHazardousWasteProductionYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _nonHazardousWasteProductionYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _nonHazardousWasteProductionYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _nonHazardousWasteWaterYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _nonHazardousWasteWaterYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _nonHazardousWasteWaterYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _calculateBulkRshwd_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_number_decorator_1.IsOptionalNumber)()];
            _calculateBulkRsnhwd_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_number_decorator_1.IsOptionalNumber)()];
            _calculateBulkRshwdMultipled_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _calculateBulkRsnhwdMultipled_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wmImplementationDetailsWmUnits_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _processWmManufacturingUnitId_decorators, { kind: "field", name: "processWmManufacturingUnitId", static: false, private: false, access: { has: function (obj) { return "processWmManufacturingUnitId" in obj; }, get: function (obj) { return obj.processWmManufacturingUnitId; }, set: function (obj, value) { obj.processWmManufacturingUnitId = value; } }, metadata: _metadata }, _processWmManufacturingUnitId_initializers, _processWmManufacturingUnitId_extraInitializers);
            __esDecorate(null, null, _processWasteManagementId_decorators, { kind: "field", name: "processWasteManagementId", static: false, private: false, access: { has: function (obj) { return "processWasteManagementId" in obj; }, get: function (obj) { return obj.processWasteManagementId; }, set: function (obj, value) { obj.processWasteManagementId = value; } }, metadata: _metadata }, _processWasteManagementId_initializers, _processWasteManagementId_extraInitializers);
            __esDecorate(null, null, _unitName_decorators, { kind: "field", name: "unitName", static: false, private: false, access: { has: function (obj) { return "unitName" in obj; }, get: function (obj) { return obj.unitName; }, set: function (obj, value) { obj.unitName = value; } }, metadata: _metadata }, _unitName_initializers, _unitName_extraInitializers);
            __esDecorate(null, null, _hazardousWasteYear1_decorators, { kind: "field", name: "hazardousWasteYear1", static: false, private: false, access: { has: function (obj) { return "hazardousWasteYear1" in obj; }, get: function (obj) { return obj.hazardousWasteYear1; }, set: function (obj, value) { obj.hazardousWasteYear1 = value; } }, metadata: _metadata }, _hazardousWasteYear1_initializers, _hazardousWasteYear1_extraInitializers);
            __esDecorate(null, null, _hazardousWasteYear2_decorators, { kind: "field", name: "hazardousWasteYear2", static: false, private: false, access: { has: function (obj) { return "hazardousWasteYear2" in obj; }, get: function (obj) { return obj.hazardousWasteYear2; }, set: function (obj, value) { obj.hazardousWasteYear2 = value; } }, metadata: _metadata }, _hazardousWasteYear2_initializers, _hazardousWasteYear2_extraInitializers);
            __esDecorate(null, null, _hazardousWasteYear3_decorators, { kind: "field", name: "hazardousWasteYear3", static: false, private: false, access: { has: function (obj) { return "hazardousWasteYear3" in obj; }, get: function (obj) { return obj.hazardousWasteYear3; }, set: function (obj, value) { obj.hazardousWasteYear3 = value; } }, metadata: _metadata }, _hazardousWasteYear3_initializers, _hazardousWasteYear3_extraInitializers);
            __esDecorate(null, null, _hazardousWasteProductionUnit_decorators, { kind: "field", name: "hazardousWasteProductionUnit", static: false, private: false, access: { has: function (obj) { return "hazardousWasteProductionUnit" in obj; }, get: function (obj) { return obj.hazardousWasteProductionUnit; }, set: function (obj, value) { obj.hazardousWasteProductionUnit = value; } }, metadata: _metadata }, _hazardousWasteProductionUnit_initializers, _hazardousWasteProductionUnit_extraInitializers);
            __esDecorate(null, null, _hazardousWasteQuantityUnit_decorators, { kind: "field", name: "hazardousWasteQuantityUnit", static: false, private: false, access: { has: function (obj) { return "hazardousWasteQuantityUnit" in obj; }, get: function (obj) { return obj.hazardousWasteQuantityUnit; }, set: function (obj, value) { obj.hazardousWasteQuantityUnit = value; } }, metadata: _metadata }, _hazardousWasteQuantityUnit_initializers, _hazardousWasteQuantityUnit_extraInitializers);
            __esDecorate(null, null, _hazardousWasteProductionYear1_decorators, { kind: "field", name: "hazardousWasteProductionYear1", static: false, private: false, access: { has: function (obj) { return "hazardousWasteProductionYear1" in obj; }, get: function (obj) { return obj.hazardousWasteProductionYear1; }, set: function (obj, value) { obj.hazardousWasteProductionYear1 = value; } }, metadata: _metadata }, _hazardousWasteProductionYear1_initializers, _hazardousWasteProductionYear1_extraInitializers);
            __esDecorate(null, null, _hazardousWasteProductionYear2_decorators, { kind: "field", name: "hazardousWasteProductionYear2", static: false, private: false, access: { has: function (obj) { return "hazardousWasteProductionYear2" in obj; }, get: function (obj) { return obj.hazardousWasteProductionYear2; }, set: function (obj, value) { obj.hazardousWasteProductionYear2 = value; } }, metadata: _metadata }, _hazardousWasteProductionYear2_initializers, _hazardousWasteProductionYear2_extraInitializers);
            __esDecorate(null, null, _hazardousWasteProductionYear3_decorators, { kind: "field", name: "hazardousWasteProductionYear3", static: false, private: false, access: { has: function (obj) { return "hazardousWasteProductionYear3" in obj; }, get: function (obj) { return obj.hazardousWasteProductionYear3; }, set: function (obj, value) { obj.hazardousWasteProductionYear3 = value; } }, metadata: _metadata }, _hazardousWasteProductionYear3_initializers, _hazardousWasteProductionYear3_extraInitializers);
            __esDecorate(null, null, _hazardousWasteQuantityYear1_decorators, { kind: "field", name: "hazardousWasteQuantityYear1", static: false, private: false, access: { has: function (obj) { return "hazardousWasteQuantityYear1" in obj; }, get: function (obj) { return obj.hazardousWasteQuantityYear1; }, set: function (obj, value) { obj.hazardousWasteQuantityYear1 = value; } }, metadata: _metadata }, _hazardousWasteQuantityYear1_initializers, _hazardousWasteQuantityYear1_extraInitializers);
            __esDecorate(null, null, _hazardousWasteQuantityYear2_decorators, { kind: "field", name: "hazardousWasteQuantityYear2", static: false, private: false, access: { has: function (obj) { return "hazardousWasteQuantityYear2" in obj; }, get: function (obj) { return obj.hazardousWasteQuantityYear2; }, set: function (obj, value) { obj.hazardousWasteQuantityYear2 = value; } }, metadata: _metadata }, _hazardousWasteQuantityYear2_initializers, _hazardousWasteQuantityYear2_extraInitializers);
            __esDecorate(null, null, _hazardousWasteQuantityYear3_decorators, { kind: "field", name: "hazardousWasteQuantityYear3", static: false, private: false, access: { has: function (obj) { return "hazardousWasteQuantityYear3" in obj; }, get: function (obj) { return obj.hazardousWasteQuantityYear3; }, set: function (obj, value) { obj.hazardousWasteQuantityYear3 = value; } }, metadata: _metadata }, _hazardousWasteQuantityYear3_initializers, _hazardousWasteQuantityYear3_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteYear1_decorators, { kind: "field", name: "nonHazardousWasteYear1", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteYear1" in obj; }, get: function (obj) { return obj.nonHazardousWasteYear1; }, set: function (obj, value) { obj.nonHazardousWasteYear1 = value; } }, metadata: _metadata }, _nonHazardousWasteYear1_initializers, _nonHazardousWasteYear1_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteYear2_decorators, { kind: "field", name: "nonHazardousWasteYear2", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteYear2" in obj; }, get: function (obj) { return obj.nonHazardousWasteYear2; }, set: function (obj, value) { obj.nonHazardousWasteYear2 = value; } }, metadata: _metadata }, _nonHazardousWasteYear2_initializers, _nonHazardousWasteYear2_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteYear3_decorators, { kind: "field", name: "nonHazardousWasteYear3", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteYear3" in obj; }, get: function (obj) { return obj.nonHazardousWasteYear3; }, set: function (obj, value) { obj.nonHazardousWasteYear3 = value; } }, metadata: _metadata }, _nonHazardousWasteYear3_initializers, _nonHazardousWasteYear3_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteProductionUnit_decorators, { kind: "field", name: "nonHazardousWasteProductionUnit", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteProductionUnit" in obj; }, get: function (obj) { return obj.nonHazardousWasteProductionUnit; }, set: function (obj, value) { obj.nonHazardousWasteProductionUnit = value; } }, metadata: _metadata }, _nonHazardousWasteProductionUnit_initializers, _nonHazardousWasteProductionUnit_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteWaterUnit_decorators, { kind: "field", name: "nonHazardousWasteWaterUnit", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteWaterUnit" in obj; }, get: function (obj) { return obj.nonHazardousWasteWaterUnit; }, set: function (obj, value) { obj.nonHazardousWasteWaterUnit = value; } }, metadata: _metadata }, _nonHazardousWasteWaterUnit_initializers, _nonHazardousWasteWaterUnit_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteProductionYear1_decorators, { kind: "field", name: "nonHazardousWasteProductionYear1", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteProductionYear1" in obj; }, get: function (obj) { return obj.nonHazardousWasteProductionYear1; }, set: function (obj, value) { obj.nonHazardousWasteProductionYear1 = value; } }, metadata: _metadata }, _nonHazardousWasteProductionYear1_initializers, _nonHazardousWasteProductionYear1_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteProductionYear2_decorators, { kind: "field", name: "nonHazardousWasteProductionYear2", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteProductionYear2" in obj; }, get: function (obj) { return obj.nonHazardousWasteProductionYear2; }, set: function (obj, value) { obj.nonHazardousWasteProductionYear2 = value; } }, metadata: _metadata }, _nonHazardousWasteProductionYear2_initializers, _nonHazardousWasteProductionYear2_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteProductionYear3_decorators, { kind: "field", name: "nonHazardousWasteProductionYear3", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteProductionYear3" in obj; }, get: function (obj) { return obj.nonHazardousWasteProductionYear3; }, set: function (obj, value) { obj.nonHazardousWasteProductionYear3 = value; } }, metadata: _metadata }, _nonHazardousWasteProductionYear3_initializers, _nonHazardousWasteProductionYear3_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteWaterYear1_decorators, { kind: "field", name: "nonHazardousWasteWaterYear1", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteWaterYear1" in obj; }, get: function (obj) { return obj.nonHazardousWasteWaterYear1; }, set: function (obj, value) { obj.nonHazardousWasteWaterYear1 = value; } }, metadata: _metadata }, _nonHazardousWasteWaterYear1_initializers, _nonHazardousWasteWaterYear1_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteWaterYear2_decorators, { kind: "field", name: "nonHazardousWasteWaterYear2", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteWaterYear2" in obj; }, get: function (obj) { return obj.nonHazardousWasteWaterYear2; }, set: function (obj, value) { obj.nonHazardousWasteWaterYear2 = value; } }, metadata: _metadata }, _nonHazardousWasteWaterYear2_initializers, _nonHazardousWasteWaterYear2_extraInitializers);
            __esDecorate(null, null, _nonHazardousWasteWaterYear3_decorators, { kind: "field", name: "nonHazardousWasteWaterYear3", static: false, private: false, access: { has: function (obj) { return "nonHazardousWasteWaterYear3" in obj; }, get: function (obj) { return obj.nonHazardousWasteWaterYear3; }, set: function (obj, value) { obj.nonHazardousWasteWaterYear3 = value; } }, metadata: _metadata }, _nonHazardousWasteWaterYear3_initializers, _nonHazardousWasteWaterYear3_extraInitializers);
            __esDecorate(null, null, _calculateBulkRshwd_decorators, { kind: "field", name: "calculateBulkRshwd", static: false, private: false, access: { has: function (obj) { return "calculateBulkRshwd" in obj; }, get: function (obj) { return obj.calculateBulkRshwd; }, set: function (obj, value) { obj.calculateBulkRshwd = value; } }, metadata: _metadata }, _calculateBulkRshwd_initializers, _calculateBulkRshwd_extraInitializers);
            __esDecorate(null, null, _calculateBulkRsnhwd_decorators, { kind: "field", name: "calculateBulkRsnhwd", static: false, private: false, access: { has: function (obj) { return "calculateBulkRsnhwd" in obj; }, get: function (obj) { return obj.calculateBulkRsnhwd; }, set: function (obj, value) { obj.calculateBulkRsnhwd = value; } }, metadata: _metadata }, _calculateBulkRsnhwd_initializers, _calculateBulkRsnhwd_extraInitializers);
            __esDecorate(null, null, _calculateBulkRshwdMultipled_decorators, { kind: "field", name: "calculateBulkRshwdMultipled", static: false, private: false, access: { has: function (obj) { return "calculateBulkRshwdMultipled" in obj; }, get: function (obj) { return obj.calculateBulkRshwdMultipled; }, set: function (obj, value) { obj.calculateBulkRshwdMultipled = value; } }, metadata: _metadata }, _calculateBulkRshwdMultipled_initializers, _calculateBulkRshwdMultipled_extraInitializers);
            __esDecorate(null, null, _calculateBulkRsnhwdMultipled_decorators, { kind: "field", name: "calculateBulkRsnhwdMultipled", static: false, private: false, access: { has: function (obj) { return "calculateBulkRsnhwdMultipled" in obj; }, get: function (obj) { return obj.calculateBulkRsnhwdMultipled; }, set: function (obj, value) { obj.calculateBulkRsnhwdMultipled = value; } }, metadata: _metadata }, _calculateBulkRsnhwdMultipled_initializers, _calculateBulkRsnhwdMultipled_extraInitializers);
            __esDecorate(null, null, _wmImplementationDetailsWmUnits_decorators, { kind: "field", name: "wmImplementationDetailsWmUnits", static: false, private: false, access: { has: function (obj) { return "wmImplementationDetailsWmUnits" in obj; }, get: function (obj) { return obj.wmImplementationDetailsWmUnits; }, set: function (obj, value) { obj.wmImplementationDetailsWmUnits = value; } }, metadata: _metadata }, _wmImplementationDetailsWmUnits_initializers, _wmImplementationDetailsWmUnits_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProcessWmManufacturingUnitDto = CreateProcessWmManufacturingUnitDto;
