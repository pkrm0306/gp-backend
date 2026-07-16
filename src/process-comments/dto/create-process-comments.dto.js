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
exports.CreateProcessCommentsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateProcessCommentsDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _productDesign_decorators;
    var _productDesign_initializers = [];
    var _productDesign_extraInitializers = [];
    var _productPerformance_decorators;
    var _productPerformance_initializers = [];
    var _productPerformance_extraInitializers = [];
    var _manfacturingProcess_decorators;
    var _manfacturingProcess_initializers = [];
    var _manfacturingProcess_extraInitializers = [];
    var _wasteManagement_decorators;
    var _wasteManagement_initializers = [];
    var _wasteManagement_extraInitializers = [];
    var _lifeCycleApproach_decorators;
    var _lifeCycleApproach_initializers = [];
    var _lifeCycleApproach_extraInitializers = [];
    var _productStewardship_decorators;
    var _productStewardship_initializers = [];
    var _productStewardship_extraInitializers = [];
    var _productInnovation_decorators;
    var _productInnovation_initializers = [];
    var _productInnovation_extraInitializers = [];
    var _rawMaterials31_decorators;
    var _rawMaterials31_initializers = [];
    var _rawMaterials31_extraInitializers = [];
    var _rawMaterials32_decorators;
    var _rawMaterials32_initializers = [];
    var _rawMaterials32_extraInitializers = [];
    var _rawMaterials33_decorators;
    var _rawMaterials33_initializers = [];
    var _rawMaterials33_extraInitializers = [];
    var _rawMaterials34_decorators;
    var _rawMaterials34_initializers = [];
    var _rawMaterials34_extraInitializers = [];
    var _rawMaterials35_decorators;
    var _rawMaterials35_initializers = [];
    var _rawMaterials35_extraInitializers = [];
    var _rawMaterials36_decorators;
    var _rawMaterials36_initializers = [];
    var _rawMaterials36_extraInitializers = [];
    var _rawMaterials37_decorators;
    var _rawMaterials37_initializers = [];
    var _rawMaterials37_extraInitializers = [];
    var _rawMaterials38_decorators;
    var _rawMaterials38_initializers = [];
    var _rawMaterials38_extraInitializers = [];
    var _rawMaterials39_decorators;
    var _rawMaterials39_initializers = [];
    var _rawMaterials39_extraInitializers = [];
    var _rawMaterials310_decorators;
    var _rawMaterials310_initializers = [];
    var _rawMaterials310_extraInitializers = [];
    var _rawMaterials311_decorators;
    var _rawMaterials311_initializers = [];
    var _rawMaterials311_extraInitializers = [];
    var _rawMaterials312_decorators;
    var _rawMaterials312_initializers = [];
    var _rawMaterials312_extraInitializers = [];
    var _rawMaterials313_decorators;
    var _rawMaterials313_initializers = [];
    var _rawMaterials313_extraInitializers = [];
    var _rawMaterials314_decorators;
    var _rawMaterials314_initializers = [];
    var _rawMaterials314_extraInitializers = [];
    var _rawMaterials315_decorators;
    var _rawMaterials315_initializers = [];
    var _rawMaterials315_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProcessCommentsDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.renewalCycleId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
                this.productDesign = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _productDesign_initializers, void 0));
                this.productPerformance = (__runInitializers(this, _productDesign_extraInitializers), __runInitializers(this, _productPerformance_initializers, void 0));
                this.manfacturingProcess = (__runInitializers(this, _productPerformance_extraInitializers), __runInitializers(this, _manfacturingProcess_initializers, void 0));
                this.wasteManagement = (__runInitializers(this, _manfacturingProcess_extraInitializers), __runInitializers(this, _wasteManagement_initializers, void 0));
                this.lifeCycleApproach = (__runInitializers(this, _wasteManagement_extraInitializers), __runInitializers(this, _lifeCycleApproach_initializers, void 0));
                this.productStewardship = (__runInitializers(this, _lifeCycleApproach_extraInitializers), __runInitializers(this, _productStewardship_initializers, void 0));
                this.productInnovation = (__runInitializers(this, _productStewardship_extraInitializers), __runInitializers(this, _productInnovation_initializers, void 0));
                this.rawMaterials31 = (__runInitializers(this, _productInnovation_extraInitializers), __runInitializers(this, _rawMaterials31_initializers, void 0));
                this.rawMaterials32 = (__runInitializers(this, _rawMaterials31_extraInitializers), __runInitializers(this, _rawMaterials32_initializers, void 0));
                this.rawMaterials33 = (__runInitializers(this, _rawMaterials32_extraInitializers), __runInitializers(this, _rawMaterials33_initializers, void 0));
                this.rawMaterials34 = (__runInitializers(this, _rawMaterials33_extraInitializers), __runInitializers(this, _rawMaterials34_initializers, void 0));
                this.rawMaterials35 = (__runInitializers(this, _rawMaterials34_extraInitializers), __runInitializers(this, _rawMaterials35_initializers, void 0));
                this.rawMaterials36 = (__runInitializers(this, _rawMaterials35_extraInitializers), __runInitializers(this, _rawMaterials36_initializers, void 0));
                this.rawMaterials37 = (__runInitializers(this, _rawMaterials36_extraInitializers), __runInitializers(this, _rawMaterials37_initializers, void 0));
                this.rawMaterials38 = (__runInitializers(this, _rawMaterials37_extraInitializers), __runInitializers(this, _rawMaterials38_initializers, void 0));
                this.rawMaterials39 = (__runInitializers(this, _rawMaterials38_extraInitializers), __runInitializers(this, _rawMaterials39_initializers, void 0));
                this.rawMaterials310 = (__runInitializers(this, _rawMaterials39_extraInitializers), __runInitializers(this, _rawMaterials310_initializers, void 0));
                this.rawMaterials311 = (__runInitializers(this, _rawMaterials310_extraInitializers), __runInitializers(this, _rawMaterials311_initializers, void 0));
                this.rawMaterials312 = (__runInitializers(this, _rawMaterials311_extraInitializers), __runInitializers(this, _rawMaterials312_initializers, void 0));
                this.rawMaterials313 = (__runInitializers(this, _rawMaterials312_extraInitializers), __runInitializers(this, _rawMaterials313_initializers, void 0));
                this.rawMaterials314 = (__runInitializers(this, _rawMaterials313_extraInitializers), __runInitializers(this, _rawMaterials314_initializers, void 0));
                this.rawMaterials315 = (__runInitializers(this, _rawMaterials314_extraInitializers), __runInitializers(this, _rawMaterials315_initializers, void 0));
                __runInitializers(this, _rawMaterials315_extraInitializers);
            }
            return CreateProcessCommentsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _renewalCycleId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Renewal cycle id (required for renewal admin/vendor comments)',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productDesign_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Product design comment',
                    example: 'Please provide more details on eco-design strategies',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productPerformance_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Product performance comment',
                    example: 'Test report needs to be updated',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _manfacturingProcess_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Manufacturing process comment',
                    example: 'Energy consumption data is incomplete',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wasteManagement_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Waste management comment',
                    example: 'Waste management implementation details required',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _lifeCycleApproach_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Life cycle approach comment',
                    example: 'Life cycle assessment report needs revision',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productStewardship_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Product stewardship comment',
                    example: 'EPR implementation details missing',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productInnovation_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Product innovation comment',
                    example: 'Innovation implementation details required',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials31_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.1 comment',
                    example: 'Raw materials 3.1 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials32_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.2 comment',
                    example: 'Raw materials 3.2 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials33_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.3 comment',
                    example: 'Raw materials 3.3 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials34_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.4 comment',
                    example: 'Raw materials 3.4 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials35_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.5 comment',
                    example: 'Raw materials 3.5 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials36_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.6 comment',
                    example: 'Raw materials 3.6 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials37_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.7 comment',
                    example: 'Raw materials 3.7 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials38_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.8 comment',
                    example: 'Raw materials 3.8 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials39_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.9 comment',
                    example: 'Raw materials 3.9 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials310_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.10 comment',
                    example: 'Raw materials 3.10 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials311_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.11 comment',
                    example: 'Raw materials 3.11 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials312_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.12 comment',
                    example: 'Raw materials 3.12 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials313_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.13 comment',
                    example: 'Raw materials 3.13 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials314_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.14 comment',
                    example: 'Raw materials 3.14 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _rawMaterials315_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Raw materials 3.15 comment',
                    example: 'Raw materials 3.15 comment',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
            __esDecorate(null, null, _productDesign_decorators, { kind: "field", name: "productDesign", static: false, private: false, access: { has: function (obj) { return "productDesign" in obj; }, get: function (obj) { return obj.productDesign; }, set: function (obj, value) { obj.productDesign = value; } }, metadata: _metadata }, _productDesign_initializers, _productDesign_extraInitializers);
            __esDecorate(null, null, _productPerformance_decorators, { kind: "field", name: "productPerformance", static: false, private: false, access: { has: function (obj) { return "productPerformance" in obj; }, get: function (obj) { return obj.productPerformance; }, set: function (obj, value) { obj.productPerformance = value; } }, metadata: _metadata }, _productPerformance_initializers, _productPerformance_extraInitializers);
            __esDecorate(null, null, _manfacturingProcess_decorators, { kind: "field", name: "manfacturingProcess", static: false, private: false, access: { has: function (obj) { return "manfacturingProcess" in obj; }, get: function (obj) { return obj.manfacturingProcess; }, set: function (obj, value) { obj.manfacturingProcess = value; } }, metadata: _metadata }, _manfacturingProcess_initializers, _manfacturingProcess_extraInitializers);
            __esDecorate(null, null, _wasteManagement_decorators, { kind: "field", name: "wasteManagement", static: false, private: false, access: { has: function (obj) { return "wasteManagement" in obj; }, get: function (obj) { return obj.wasteManagement; }, set: function (obj, value) { obj.wasteManagement = value; } }, metadata: _metadata }, _wasteManagement_initializers, _wasteManagement_extraInitializers);
            __esDecorate(null, null, _lifeCycleApproach_decorators, { kind: "field", name: "lifeCycleApproach", static: false, private: false, access: { has: function (obj) { return "lifeCycleApproach" in obj; }, get: function (obj) { return obj.lifeCycleApproach; }, set: function (obj, value) { obj.lifeCycleApproach = value; } }, metadata: _metadata }, _lifeCycleApproach_initializers, _lifeCycleApproach_extraInitializers);
            __esDecorate(null, null, _productStewardship_decorators, { kind: "field", name: "productStewardship", static: false, private: false, access: { has: function (obj) { return "productStewardship" in obj; }, get: function (obj) { return obj.productStewardship; }, set: function (obj, value) { obj.productStewardship = value; } }, metadata: _metadata }, _productStewardship_initializers, _productStewardship_extraInitializers);
            __esDecorate(null, null, _productInnovation_decorators, { kind: "field", name: "productInnovation", static: false, private: false, access: { has: function (obj) { return "productInnovation" in obj; }, get: function (obj) { return obj.productInnovation; }, set: function (obj, value) { obj.productInnovation = value; } }, metadata: _metadata }, _productInnovation_initializers, _productInnovation_extraInitializers);
            __esDecorate(null, null, _rawMaterials31_decorators, { kind: "field", name: "rawMaterials31", static: false, private: false, access: { has: function (obj) { return "rawMaterials31" in obj; }, get: function (obj) { return obj.rawMaterials31; }, set: function (obj, value) { obj.rawMaterials31 = value; } }, metadata: _metadata }, _rawMaterials31_initializers, _rawMaterials31_extraInitializers);
            __esDecorate(null, null, _rawMaterials32_decorators, { kind: "field", name: "rawMaterials32", static: false, private: false, access: { has: function (obj) { return "rawMaterials32" in obj; }, get: function (obj) { return obj.rawMaterials32; }, set: function (obj, value) { obj.rawMaterials32 = value; } }, metadata: _metadata }, _rawMaterials32_initializers, _rawMaterials32_extraInitializers);
            __esDecorate(null, null, _rawMaterials33_decorators, { kind: "field", name: "rawMaterials33", static: false, private: false, access: { has: function (obj) { return "rawMaterials33" in obj; }, get: function (obj) { return obj.rawMaterials33; }, set: function (obj, value) { obj.rawMaterials33 = value; } }, metadata: _metadata }, _rawMaterials33_initializers, _rawMaterials33_extraInitializers);
            __esDecorate(null, null, _rawMaterials34_decorators, { kind: "field", name: "rawMaterials34", static: false, private: false, access: { has: function (obj) { return "rawMaterials34" in obj; }, get: function (obj) { return obj.rawMaterials34; }, set: function (obj, value) { obj.rawMaterials34 = value; } }, metadata: _metadata }, _rawMaterials34_initializers, _rawMaterials34_extraInitializers);
            __esDecorate(null, null, _rawMaterials35_decorators, { kind: "field", name: "rawMaterials35", static: false, private: false, access: { has: function (obj) { return "rawMaterials35" in obj; }, get: function (obj) { return obj.rawMaterials35; }, set: function (obj, value) { obj.rawMaterials35 = value; } }, metadata: _metadata }, _rawMaterials35_initializers, _rawMaterials35_extraInitializers);
            __esDecorate(null, null, _rawMaterials36_decorators, { kind: "field", name: "rawMaterials36", static: false, private: false, access: { has: function (obj) { return "rawMaterials36" in obj; }, get: function (obj) { return obj.rawMaterials36; }, set: function (obj, value) { obj.rawMaterials36 = value; } }, metadata: _metadata }, _rawMaterials36_initializers, _rawMaterials36_extraInitializers);
            __esDecorate(null, null, _rawMaterials37_decorators, { kind: "field", name: "rawMaterials37", static: false, private: false, access: { has: function (obj) { return "rawMaterials37" in obj; }, get: function (obj) { return obj.rawMaterials37; }, set: function (obj, value) { obj.rawMaterials37 = value; } }, metadata: _metadata }, _rawMaterials37_initializers, _rawMaterials37_extraInitializers);
            __esDecorate(null, null, _rawMaterials38_decorators, { kind: "field", name: "rawMaterials38", static: false, private: false, access: { has: function (obj) { return "rawMaterials38" in obj; }, get: function (obj) { return obj.rawMaterials38; }, set: function (obj, value) { obj.rawMaterials38 = value; } }, metadata: _metadata }, _rawMaterials38_initializers, _rawMaterials38_extraInitializers);
            __esDecorate(null, null, _rawMaterials39_decorators, { kind: "field", name: "rawMaterials39", static: false, private: false, access: { has: function (obj) { return "rawMaterials39" in obj; }, get: function (obj) { return obj.rawMaterials39; }, set: function (obj, value) { obj.rawMaterials39 = value; } }, metadata: _metadata }, _rawMaterials39_initializers, _rawMaterials39_extraInitializers);
            __esDecorate(null, null, _rawMaterials310_decorators, { kind: "field", name: "rawMaterials310", static: false, private: false, access: { has: function (obj) { return "rawMaterials310" in obj; }, get: function (obj) { return obj.rawMaterials310; }, set: function (obj, value) { obj.rawMaterials310 = value; } }, metadata: _metadata }, _rawMaterials310_initializers, _rawMaterials310_extraInitializers);
            __esDecorate(null, null, _rawMaterials311_decorators, { kind: "field", name: "rawMaterials311", static: false, private: false, access: { has: function (obj) { return "rawMaterials311" in obj; }, get: function (obj) { return obj.rawMaterials311; }, set: function (obj, value) { obj.rawMaterials311 = value; } }, metadata: _metadata }, _rawMaterials311_initializers, _rawMaterials311_extraInitializers);
            __esDecorate(null, null, _rawMaterials312_decorators, { kind: "field", name: "rawMaterials312", static: false, private: false, access: { has: function (obj) { return "rawMaterials312" in obj; }, get: function (obj) { return obj.rawMaterials312; }, set: function (obj, value) { obj.rawMaterials312 = value; } }, metadata: _metadata }, _rawMaterials312_initializers, _rawMaterials312_extraInitializers);
            __esDecorate(null, null, _rawMaterials313_decorators, { kind: "field", name: "rawMaterials313", static: false, private: false, access: { has: function (obj) { return "rawMaterials313" in obj; }, get: function (obj) { return obj.rawMaterials313; }, set: function (obj, value) { obj.rawMaterials313 = value; } }, metadata: _metadata }, _rawMaterials313_initializers, _rawMaterials313_extraInitializers);
            __esDecorate(null, null, _rawMaterials314_decorators, { kind: "field", name: "rawMaterials314", static: false, private: false, access: { has: function (obj) { return "rawMaterials314" in obj; }, get: function (obj) { return obj.rawMaterials314; }, set: function (obj, value) { obj.rawMaterials314 = value; } }, metadata: _metadata }, _rawMaterials314_initializers, _rawMaterials314_extraInitializers);
            __esDecorate(null, null, _rawMaterials315_decorators, { kind: "field", name: "rawMaterials315", static: false, private: false, access: { has: function (obj) { return "rawMaterials315" in obj; }, get: function (obj) { return obj.rawMaterials315; }, set: function (obj, value) { obj.rawMaterials315 = value; } }, metadata: _metadata }, _rawMaterials315_initializers, _rawMaterials315_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProcessCommentsDto = CreateProcessCommentsDto;
