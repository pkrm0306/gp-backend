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
exports.CreateProcessProductStewardshipDto = exports.ProductStewardshipProgrammeDetailDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var ProductStewardshipProgrammeDetailDto = function () {
    var _a;
    var _programmeDetails_decorators;
    var _programmeDetails_initializers = [];
    var _programmeDetails_extraInitializers = [];
    var _numberOfPrograms_decorators;
    var _numberOfPrograms_initializers = [];
    var _numberOfPrograms_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProductStewardshipProgrammeDetailDto() {
                this.programmeDetails = __runInitializers(this, _programmeDetails_initializers, void 0);
                this.numberOfPrograms = (__runInitializers(this, _programmeDetails_extraInitializers), __runInitializers(this, _numberOfPrograms_initializers, void 0));
                __runInitializers(this, _numberOfPrograms_extraInitializers);
            }
            return ProductStewardshipProgrammeDetailDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _programmeDetails_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Stakeholder education / awareness programme details',
                    example: 'Training programme for dealers and retailers',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _numberOfPrograms_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Number of programmes',
                    example: '4',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _programmeDetails_decorators, { kind: "field", name: "programmeDetails", static: false, private: false, access: { has: function (obj) { return "programmeDetails" in obj; }, get: function (obj) { return obj.programmeDetails; }, set: function (obj, value) { obj.programmeDetails = value; } }, metadata: _metadata }, _programmeDetails_initializers, _programmeDetails_extraInitializers);
            __esDecorate(null, null, _numberOfPrograms_decorators, { kind: "field", name: "numberOfPrograms", static: false, private: false, access: { has: function (obj) { return "numberOfPrograms" in obj; }, get: function (obj) { return obj.numberOfPrograms; }, set: function (obj, value) { obj.numberOfPrograms = value; } }, metadata: _metadata }, _numberOfPrograms_initializers, _numberOfPrograms_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProductStewardshipProgrammeDetailDto = ProductStewardshipProgrammeDetailDto;
var CreateProcessProductStewardshipDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _programmeDetails_decorators;
    var _programmeDetails_initializers = [];
    var _programmeDetails_extraInitializers = [];
    var _qualityManagementDetails_decorators;
    var _qualityManagementDetails_initializers = [];
    var _qualityManagementDetails_extraInitializers = [];
    var _eprImplementedDetails_decorators;
    var _eprImplementedDetails_initializers = [];
    var _eprImplementedDetails_extraInitializers = [];
    var _eprGreenPackagingDetails_decorators;
    var _eprGreenPackagingDetails_initializers = [];
    var _eprGreenPackagingDetails_extraInitializers = [];
    var _productStewardshipStatus_decorators;
    var _productStewardshipStatus_initializers = [];
    var _productStewardshipStatus_extraInitializers = [];
    var _seaSupportingDocumentsFileName_decorators;
    var _seaSupportingDocumentsFileName_initializers = [];
    var _seaSupportingDocumentsFileName_extraInitializers = [];
    var _qmSupportingDocumentsFileName_decorators;
    var _qmSupportingDocumentsFileName_initializers = [];
    var _qmSupportingDocumentsFileName_extraInitializers = [];
    var _eprSupportingDocumentsFileName_decorators;
    var _eprSupportingDocumentsFileName_initializers = [];
    var _eprSupportingDocumentsFileName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProcessProductStewardshipDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.programmeDetails = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _programmeDetails_initializers, void 0));
                this.qualityManagementDetails = (__runInitializers(this, _programmeDetails_extraInitializers), __runInitializers(this, _qualityManagementDetails_initializers, void 0));
                this.eprImplementedDetails = (__runInitializers(this, _qualityManagementDetails_extraInitializers), __runInitializers(this, _eprImplementedDetails_initializers, void 0));
                this.eprGreenPackagingDetails = (__runInitializers(this, _eprImplementedDetails_extraInitializers), __runInitializers(this, _eprGreenPackagingDetails_initializers, void 0));
                this.productStewardshipStatus = (__runInitializers(this, _eprGreenPackagingDetails_extraInitializers), __runInitializers(this, _productStewardshipStatus_initializers, void 0));
                this.seaSupportingDocumentsFileName = (__runInitializers(this, _productStewardshipStatus_extraInitializers), __runInitializers(this, _seaSupportingDocumentsFileName_initializers, void 0));
                this.qmSupportingDocumentsFileName = (__runInitializers(this, _seaSupportingDocumentsFileName_extraInitializers), __runInitializers(this, _qmSupportingDocumentsFileName_initializers, void 0));
                this.eprSupportingDocumentsFileName = (__runInitializers(this, _qmSupportingDocumentsFileName_extraInitializers), __runInitializers(this, _eprSupportingDocumentsFileName_initializers, void 0));
                __runInitializers(this, _eprSupportingDocumentsFileName_extraInitializers);
            }
            return CreateProcessProductStewardshipDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _programmeDetails_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Array of stakeholder education/awareness programmes (from programmeDetails payload)',
                    required: false,
                    type: [ProductStewardshipProgrammeDetailDto],
                    example: [
                        {
                            programmeDetails: 'Training programme for channel partners',
                            numberOfPrograms: '4',
                        },
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return ProductStewardshipProgrammeDetailDto; })];
            _qualityManagementDetails_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Quality management details (text)',
                    example: 'Quality management implementation details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _eprImplementedDetails_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'EPR implemented details (text)',
                    example: 'EPR implementation details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _eprGreenPackagingDetails_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'EPR green packaging details (text)',
                    example: 'EPR green packaging details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productStewardshipStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Product stewardship status (0=Pending, 1=Completed)',
                    example: 0,
                    required: false,
                    enum: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            _seaSupportingDocumentsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'SEA supporting documents display name (required if uploading seaSupportingDocumentsFile)',
                    example: 'SEA Supporting Documents - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _qmSupportingDocumentsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Quality management supporting documents display name (required if uploading qmSupportingDocumentsFile)',
                    example: 'Quality Management Supporting Documents - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _eprSupportingDocumentsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'EPR supporting documents display name (required if uploading eprSupportingDocumentsFile)',
                    example: 'EPR Supporting Documents - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _programmeDetails_decorators, { kind: "field", name: "programmeDetails", static: false, private: false, access: { has: function (obj) { return "programmeDetails" in obj; }, get: function (obj) { return obj.programmeDetails; }, set: function (obj, value) { obj.programmeDetails = value; } }, metadata: _metadata }, _programmeDetails_initializers, _programmeDetails_extraInitializers);
            __esDecorate(null, null, _qualityManagementDetails_decorators, { kind: "field", name: "qualityManagementDetails", static: false, private: false, access: { has: function (obj) { return "qualityManagementDetails" in obj; }, get: function (obj) { return obj.qualityManagementDetails; }, set: function (obj, value) { obj.qualityManagementDetails = value; } }, metadata: _metadata }, _qualityManagementDetails_initializers, _qualityManagementDetails_extraInitializers);
            __esDecorate(null, null, _eprImplementedDetails_decorators, { kind: "field", name: "eprImplementedDetails", static: false, private: false, access: { has: function (obj) { return "eprImplementedDetails" in obj; }, get: function (obj) { return obj.eprImplementedDetails; }, set: function (obj, value) { obj.eprImplementedDetails = value; } }, metadata: _metadata }, _eprImplementedDetails_initializers, _eprImplementedDetails_extraInitializers);
            __esDecorate(null, null, _eprGreenPackagingDetails_decorators, { kind: "field", name: "eprGreenPackagingDetails", static: false, private: false, access: { has: function (obj) { return "eprGreenPackagingDetails" in obj; }, get: function (obj) { return obj.eprGreenPackagingDetails; }, set: function (obj, value) { obj.eprGreenPackagingDetails = value; } }, metadata: _metadata }, _eprGreenPackagingDetails_initializers, _eprGreenPackagingDetails_extraInitializers);
            __esDecorate(null, null, _productStewardshipStatus_decorators, { kind: "field", name: "productStewardshipStatus", static: false, private: false, access: { has: function (obj) { return "productStewardshipStatus" in obj; }, get: function (obj) { return obj.productStewardshipStatus; }, set: function (obj, value) { obj.productStewardshipStatus = value; } }, metadata: _metadata }, _productStewardshipStatus_initializers, _productStewardshipStatus_extraInitializers);
            __esDecorate(null, null, _seaSupportingDocumentsFileName_decorators, { kind: "field", name: "seaSupportingDocumentsFileName", static: false, private: false, access: { has: function (obj) { return "seaSupportingDocumentsFileName" in obj; }, get: function (obj) { return obj.seaSupportingDocumentsFileName; }, set: function (obj, value) { obj.seaSupportingDocumentsFileName = value; } }, metadata: _metadata }, _seaSupportingDocumentsFileName_initializers, _seaSupportingDocumentsFileName_extraInitializers);
            __esDecorate(null, null, _qmSupportingDocumentsFileName_decorators, { kind: "field", name: "qmSupportingDocumentsFileName", static: false, private: false, access: { has: function (obj) { return "qmSupportingDocumentsFileName" in obj; }, get: function (obj) { return obj.qmSupportingDocumentsFileName; }, set: function (obj, value) { obj.qmSupportingDocumentsFileName = value; } }, metadata: _metadata }, _qmSupportingDocumentsFileName_initializers, _qmSupportingDocumentsFileName_extraInitializers);
            __esDecorate(null, null, _eprSupportingDocumentsFileName_decorators, { kind: "field", name: "eprSupportingDocumentsFileName", static: false, private: false, access: { has: function (obj) { return "eprSupportingDocumentsFileName" in obj; }, get: function (obj) { return obj.eprSupportingDocumentsFileName; }, set: function (obj, value) { obj.eprSupportingDocumentsFileName = value; } }, metadata: _metadata }, _eprSupportingDocumentsFileName_initializers, _eprSupportingDocumentsFileName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProcessProductStewardshipDto = CreateProcessProductStewardshipDto;
