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
exports.CreateProductDesignDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var measure_benefit_dto_1 = require("./measure-benefit.dto");
var CreateProductDesignDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _strategies_decorators;
    var _strategies_initializers = [];
    var _strategies_extraInitializers = [];
    var _statergies_decorators;
    var _statergies_initializers = [];
    var _statergies_extraInitializers = [];
    var _productDesignStatus_decorators;
    var _productDesignStatus_initializers = [];
    var _productDesignStatus_extraInitializers = [];
    var _measuresAndBenefits_decorators;
    var _measuresAndBenefits_initializers = [];
    var _measuresAndBenefits_extraInitializers = [];
    var _existingEcoVisionDocumentIds_decorators;
    var _existingEcoVisionDocumentIds_initializers = [];
    var _existingEcoVisionDocumentIds_extraInitializers = [];
    var _existingSupportingDocumentIds_decorators;
    var _existingSupportingDocumentIds_initializers = [];
    var _existingSupportingDocumentIds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProductDesignDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.strategies = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _strategies_initializers, void 0));
                this.statergies = (__runInitializers(this, _strategies_extraInitializers), __runInitializers(this, _statergies_initializers, void 0));
                this.productDesignStatus = (__runInitializers(this, _statergies_extraInitializers), __runInitializers(this, _productDesignStatus_initializers, void 0));
                this.measuresAndBenefits = (__runInitializers(this, _productDesignStatus_extraInitializers), __runInitializers(this, _measuresAndBenefits_initializers, void 0));
                this.existingEcoVisionDocumentIds = (__runInitializers(this, _measuresAndBenefits_extraInitializers), __runInitializers(this, _existingEcoVisionDocumentIds_initializers, void 0));
                this.existingSupportingDocumentIds = (__runInitializers(this, _existingEcoVisionDocumentIds_extraInitializers), __runInitializers(this, _existingSupportingDocumentIds_initializers, void 0));
                __runInitializers(this, _existingSupportingDocumentIds_extraInitializers);
            }
            return CreateProductDesignDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _strategies_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Strategies text (optional). At least one of strategies, measures (non-empty row), ecoVisionFile, supportingDesignFile, or retained product_design_documents for this URN should be present.',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _statergies_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Legacy alias for strategies (typo kept for compatibility)',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productDesignStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Product design status (0=Pending, 1=Completed)',
                    example: 0,
                    required: false,
                    enum: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            _measuresAndBenefits_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'JSON array — **replaces** all measures for this URN. Optional; rows may have one column filled. Send the full list on every save.',
                    type: [measure_benefit_dto_1.MeasureBenefitDto],
                    required: false,
                    example: [
                        {
                            measuresImplemented: 'Use of renewable energy sources in manufacturing',
                            benefitsAchieved: 'Reduced carbon footprint by 30% and lower operational costs',
                        },
                        {
                            measuresImplemented: 'Implementation of waste reduction programs',
                            benefitsAchieved: 'Decreased waste disposal costs by 25%',
                        },
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return measure_benefit_dto_1.MeasureBenefitDto; })];
            _existingEcoVisionDocumentIds_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'JSON array of product document ids (_id or productDocumentId) to keep for eco vision. Omit to keep all existing eco docs on text-only save; send [] to clear.',
                    required: false,
                    example: '["507f1f77bcf86cd799439011"]',
                }), (0, class_validator_1.IsOptional)()];
            _existingSupportingDocumentIds_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'JSON array of product document ids to keep for supporting documents. Omit to keep all existing supporting docs on text-only save; send [] to clear.',
                    required: false,
                    example: '["507f1f77bcf86cd799439012"]',
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _strategies_decorators, { kind: "field", name: "strategies", static: false, private: false, access: { has: function (obj) { return "strategies" in obj; }, get: function (obj) { return obj.strategies; }, set: function (obj, value) { obj.strategies = value; } }, metadata: _metadata }, _strategies_initializers, _strategies_extraInitializers);
            __esDecorate(null, null, _statergies_decorators, { kind: "field", name: "statergies", static: false, private: false, access: { has: function (obj) { return "statergies" in obj; }, get: function (obj) { return obj.statergies; }, set: function (obj, value) { obj.statergies = value; } }, metadata: _metadata }, _statergies_initializers, _statergies_extraInitializers);
            __esDecorate(null, null, _productDesignStatus_decorators, { kind: "field", name: "productDesignStatus", static: false, private: false, access: { has: function (obj) { return "productDesignStatus" in obj; }, get: function (obj) { return obj.productDesignStatus; }, set: function (obj, value) { obj.productDesignStatus = value; } }, metadata: _metadata }, _productDesignStatus_initializers, _productDesignStatus_extraInitializers);
            __esDecorate(null, null, _measuresAndBenefits_decorators, { kind: "field", name: "measuresAndBenefits", static: false, private: false, access: { has: function (obj) { return "measuresAndBenefits" in obj; }, get: function (obj) { return obj.measuresAndBenefits; }, set: function (obj, value) { obj.measuresAndBenefits = value; } }, metadata: _metadata }, _measuresAndBenefits_initializers, _measuresAndBenefits_extraInitializers);
            __esDecorate(null, null, _existingEcoVisionDocumentIds_decorators, { kind: "field", name: "existingEcoVisionDocumentIds", static: false, private: false, access: { has: function (obj) { return "existingEcoVisionDocumentIds" in obj; }, get: function (obj) { return obj.existingEcoVisionDocumentIds; }, set: function (obj, value) { obj.existingEcoVisionDocumentIds = value; } }, metadata: _metadata }, _existingEcoVisionDocumentIds_initializers, _existingEcoVisionDocumentIds_extraInitializers);
            __esDecorate(null, null, _existingSupportingDocumentIds_decorators, { kind: "field", name: "existingSupportingDocumentIds", static: false, private: false, access: { has: function (obj) { return "existingSupportingDocumentIds" in obj; }, get: function (obj) { return obj.existingSupportingDocumentIds; }, set: function (obj, value) { obj.existingSupportingDocumentIds = value; } }, metadata: _metadata }, _existingSupportingDocumentIds_initializers, _existingSupportingDocumentIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProductDesignDto = CreateProductDesignDto;
