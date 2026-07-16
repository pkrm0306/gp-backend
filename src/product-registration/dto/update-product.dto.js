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
exports.UpdateProductDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
/** Swagger/clients often send "" or null for unchanged optional fields — treat as omitted. */
function omitEmptyOptional(value) {
    if (value === '' || value === null) {
        return undefined;
    }
    return value;
}
function parseOptionalBoolean(value) {
    if (value === '' || value === null || value === undefined) {
        return undefined;
    }
    if (value === true || value === 'true' || value === 1 || value === '1') {
        return true;
    }
    if (value === false || value === 'false' || value === 0 || value === '0') {
        return false;
    }
    return undefined;
}
var UpdateProductDto = function () {
    var _a;
    var _productName_decorators;
    var _productName_initializers = [];
    var _productName_extraInitializers = [];
    var _productDetails_decorators;
    var _productDetails_initializers = [];
    var _productDetails_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _resetCategoryAssessmentData_decorators;
    var _resetCategoryAssessmentData_initializers = [];
    var _resetCategoryAssessmentData_extraInitializers = [];
    var _previousCategoryId_decorators;
    var _previousCategoryId_initializers = [];
    var _previousCategoryId_extraInitializers = [];
    var _newCategoryId_decorators;
    var _newCategoryId_initializers = [];
    var _newCategoryId_extraInitializers = [];
    var _purgedRawMaterialStepIds_decorators;
    var _purgedRawMaterialStepIds_initializers = [];
    var _purgedRawMaterialStepIds_extraInitializers = [];
    var _purgedSteps_decorators;
    var _purgedSteps_initializers = [];
    var _purgedSteps_extraInitializers = [];
    var _retainedRawMaterialStepIds_decorators;
    var _retainedRawMaterialStepIds_initializers = [];
    var _retainedRawMaterialStepIds_extraInitializers = [];
    var _retainedRawMaterialSteps_decorators;
    var _retainedRawMaterialSteps_initializers = [];
    var _retainedRawMaterialSteps_extraInitializers = [];
    var _addedRawMaterialStepIds_decorators;
    var _addedRawMaterialStepIds_initializers = [];
    var _addedRawMaterialStepIds_extraInitializers = [];
    var _addedRawMaterialSteps_decorators;
    var _addedRawMaterialSteps_initializers = [];
    var _addedRawMaterialSteps_extraInitializers = [];
    var _visibleRawMaterialStepIds_decorators;
    var _visibleRawMaterialStepIds_initializers = [];
    var _visibleRawMaterialStepIds_extraInitializers = [];
    var _visibleRawMaterialSteps_decorators;
    var _visibleRawMaterialSteps_initializers = [];
    var _visibleRawMaterialSteps_extraInitializers = [];
    var _categoryChange_decorators;
    var _categoryChange_initializers = [];
    var _categoryChange_extraInitializers = [];
    var _categoryEditable_decorators;
    var _categoryEditable_initializers = [];
    var _categoryEditable_extraInitializers = [];
    var _categoryChangeBlockReason_decorators;
    var _categoryChangeBlockReason_initializers = [];
    var _categoryChangeBlockReason_extraInitializers = [];
    var _vendorMustRefillRawMaterials_decorators;
    var _vendorMustRefillRawMaterials_initializers = [];
    var _vendorMustRefillRawMaterials_extraInitializers = [];
    var _listRefreshRequired_decorators;
    var _listRefreshRequired_initializers = [];
    var _listRefreshRequired_extraInitializers = [];
    var _productImage_decorators;
    var _productImage_initializers = [];
    var _productImage_extraInitializers = [];
    var _productType_decorators;
    var _productType_initializers = [];
    var _productType_extraInitializers = [];
    var _productStatus_decorators;
    var _productStatus_initializers = [];
    var _productStatus_extraInitializers = [];
    var _productRenewStatus_decorators;
    var _productRenewStatus_initializers = [];
    var _productRenewStatus_extraInitializers = [];
    var _urnStatus_decorators;
    var _urnStatus_initializers = [];
    var _urnStatus_extraInitializers = [];
    var _assessmentReportUrl_decorators;
    var _assessmentReportUrl_initializers = [];
    var _assessmentReportUrl_extraInitializers = [];
    var _rejectedDetails_decorators;
    var _rejectedDetails_initializers = [];
    var _rejectedDetails_extraInitializers = [];
    var _certifiedDate_decorators;
    var _certifiedDate_initializers = [];
    var _certifiedDate_extraInitializers = [];
    var _validtillDate_decorators;
    var _validtillDate_initializers = [];
    var _validtillDate_extraInitializers = [];
    var _validTillDate_decorators;
    var _validTillDate_initializers = [];
    var _validTillDate_extraInitializers = [];
    var _firstNotifyDate_decorators;
    var _firstNotifyDate_initializers = [];
    var _firstNotifyDate_extraInitializers = [];
    var _secondNotifyDate_decorators;
    var _secondNotifyDate_initializers = [];
    var _secondNotifyDate_extraInitializers = [];
    var _thirdNotifyDate_decorators;
    var _thirdNotifyDate_initializers = [];
    var _thirdNotifyDate_extraInitializers = [];
    var _renewedDate_decorators;
    var _renewedDate_initializers = [];
    var _renewedDate_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateProductDto() {
                this.productName = __runInitializers(this, _productName_initializers, void 0);
                this.productDetails = (__runInitializers(this, _productName_extraInitializers), __runInitializers(this, _productDetails_initializers, void 0));
                this.urnNo = (__runInitializers(this, _productDetails_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
                this.eoiNo = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
                this.categoryId = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.resetCategoryAssessmentData = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _resetCategoryAssessmentData_initializers, void 0));
                /**
                 * Read-only echo from admin list/details — ignored; server resolves prior category from DB.
                 */
                this.previousCategoryId = (__runInitializers(this, _resetCategoryAssessmentData_extraInitializers), __runInitializers(this, _previousCategoryId_initializers, void 0));
                /** Read-only echo from category-change UI — ignored; send `categoryId` for the new value. */
                this.newCategoryId = (__runInitializers(this, _previousCategoryId_extraInitializers), __runInitializers(this, _newCategoryId_initializers, void 0));
                /**
                 * Read-only echoes from admin category-change preview / list row — ignored.
                 * Server computes raw-material step purge/retain from old vs new category in DB.
                 */
                this.purgedRawMaterialStepIds = (__runInitializers(this, _newCategoryId_extraInitializers), __runInitializers(this, _purgedRawMaterialStepIds_initializers, void 0));
                this.purgedSteps = (__runInitializers(this, _purgedRawMaterialStepIds_extraInitializers), __runInitializers(this, _purgedSteps_initializers, void 0));
                this.retainedRawMaterialStepIds = (__runInitializers(this, _purgedSteps_extraInitializers), __runInitializers(this, _retainedRawMaterialStepIds_initializers, void 0));
                this.retainedRawMaterialSteps = (__runInitializers(this, _retainedRawMaterialStepIds_extraInitializers), __runInitializers(this, _retainedRawMaterialSteps_initializers, void 0));
                this.addedRawMaterialStepIds = (__runInitializers(this, _retainedRawMaterialSteps_extraInitializers), __runInitializers(this, _addedRawMaterialStepIds_initializers, void 0));
                this.addedRawMaterialSteps = (__runInitializers(this, _addedRawMaterialStepIds_extraInitializers), __runInitializers(this, _addedRawMaterialSteps_initializers, void 0));
                this.visibleRawMaterialStepIds = (__runInitializers(this, _addedRawMaterialSteps_extraInitializers), __runInitializers(this, _visibleRawMaterialStepIds_initializers, void 0));
                this.visibleRawMaterialSteps = (__runInitializers(this, _visibleRawMaterialStepIds_extraInitializers), __runInitializers(this, _visibleRawMaterialSteps_initializers, void 0));
                this.categoryChange = (__runInitializers(this, _visibleRawMaterialSteps_extraInitializers), __runInitializers(this, _categoryChange_initializers, void 0));
                this.categoryEditable = (__runInitializers(this, _categoryChange_extraInitializers), __runInitializers(this, _categoryEditable_initializers, void 0));
                this.categoryChangeBlockReason = (__runInitializers(this, _categoryEditable_extraInitializers), __runInitializers(this, _categoryChangeBlockReason_initializers, void 0));
                this.vendorMustRefillRawMaterials = (__runInitializers(this, _categoryChangeBlockReason_extraInitializers), __runInitializers(this, _vendorMustRefillRawMaterials_initializers, void 0));
                this.listRefreshRequired = (__runInitializers(this, _vendorMustRefillRawMaterials_extraInitializers), __runInitializers(this, _listRefreshRequired_initializers, void 0));
                this.productImage = (__runInitializers(this, _listRefreshRequired_extraInitializers), __runInitializers(this, _productImage_initializers, void 0));
                this.productType = (__runInitializers(this, _productImage_extraInitializers), __runInitializers(this, _productType_initializers, void 0));
                this.productStatus = (__runInitializers(this, _productType_extraInitializers), __runInitializers(this, _productStatus_initializers, void 0));
                this.productRenewStatus = (__runInitializers(this, _productStatus_extraInitializers), __runInitializers(this, _productRenewStatus_initializers, void 0));
                this.urnStatus = (__runInitializers(this, _productRenewStatus_extraInitializers), __runInitializers(this, _urnStatus_initializers, void 0));
                this.assessmentReportUrl = (__runInitializers(this, _urnStatus_extraInitializers), __runInitializers(this, _assessmentReportUrl_initializers, void 0));
                this.rejectedDetails = (__runInitializers(this, _assessmentReportUrl_extraInitializers), __runInitializers(this, _rejectedDetails_initializers, void 0));
                this.certifiedDate = (__runInitializers(this, _rejectedDetails_extraInitializers), __runInitializers(this, _certifiedDate_initializers, void 0));
                this.validtillDate = (__runInitializers(this, _certifiedDate_extraInitializers), __runInitializers(this, _validtillDate_initializers, void 0));
                /** Alias accepted from Swagger/clients (`validTillDate`); merged into `validtillDate` above. */
                this.validTillDate = (__runInitializers(this, _validtillDate_extraInitializers), __runInitializers(this, _validTillDate_initializers, void 0));
                this.firstNotifyDate = (__runInitializers(this, _validTillDate_extraInitializers), __runInitializers(this, _firstNotifyDate_initializers, void 0));
                this.secondNotifyDate = (__runInitializers(this, _firstNotifyDate_extraInitializers), __runInitializers(this, _secondNotifyDate_initializers, void 0));
                this.thirdNotifyDate = (__runInitializers(this, _secondNotifyDate_extraInitializers), __runInitializers(this, _thirdNotifyDate_initializers, void 0));
                this.renewedDate = (__runInitializers(this, _thirdNotifyDate_extraInitializers), __runInitializers(this, _renewedDate_initializers, void 0));
                __runInitializers(this, _renewedDate_extraInitializers);
            }
            return UpdateProductDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productName_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Product name',
                    example: 'Solar Panel 100W Updated',
                    required: true,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _productDetails_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Product description text',
                    example: 'Updated product description',
                    required: true,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? value : String(value);
                }), (0, class_validator_1.IsString)()];
            _urnNo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'URN number (must match the product being updated)',
                    example: 'URN-20260514165917',
                    required: true,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _eoiNo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'EOI number (must match the product being updated)',
                    example: 'GPABC001001',
                    required: true,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _categoryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Category MongoDB ObjectId (admin EOI edit). Omit or send empty to leave unchanged.',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.IsMongoId)()];
            _resetCategoryAssessmentData_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Admin EOI edit — when changing category, if true, reset category-specific assessment/process data for the URN. ' +
                        'Ignored when categoryId is unchanged. Defaults to false when omitted.',
                    default: false,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return parseOptionalBoolean(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _previousCategoryId_decorators = [(0, class_validator_1.Allow)()];
            _newCategoryId_decorators = [(0, class_validator_1.Allow)()];
            _purgedRawMaterialStepIds_decorators = [(0, class_validator_1.Allow)()];
            _purgedSteps_decorators = [(0, class_validator_1.Allow)()];
            _retainedRawMaterialStepIds_decorators = [(0, class_validator_1.Allow)()];
            _retainedRawMaterialSteps_decorators = [(0, class_validator_1.Allow)()];
            _addedRawMaterialStepIds_decorators = [(0, class_validator_1.Allow)()];
            _addedRawMaterialSteps_decorators = [(0, class_validator_1.Allow)()];
            _visibleRawMaterialStepIds_decorators = [(0, class_validator_1.Allow)()];
            _visibleRawMaterialSteps_decorators = [(0, class_validator_1.Allow)()];
            _categoryChange_decorators = [(0, class_validator_1.Allow)()];
            _categoryEditable_decorators = [(0, class_validator_1.Allow)()];
            _categoryChangeBlockReason_decorators = [(0, class_validator_1.Allow)()];
            _vendorMustRefillRawMaterials_decorators = [(0, class_validator_1.Allow)()];
            _listRefreshRequired_decorators = [(0, class_validator_1.Allow)()];
            _productImage_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Product image URL' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _productType_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Product type', example: 0 }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _productStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Product status', example: 0 }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _productRenewStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Product renew status', example: 0 }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _urnStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'URN status', example: 0 }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _assessmentReportUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assessment report URL' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rejectedDetails_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Rejected details' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _certifiedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Certified date (ISO 8601)', format: 'date-time' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.IsDateString)()];
            _validtillDate_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Valid till date (ISO 8601)',
                    format: 'date-time',
                    name: 'validtillDate',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value, obj = _b.obj;
                    return omitEmptyOptional(value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.validTillDate);
                }), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.IsDateString)()];
            _validTillDate_decorators = [(0, class_validator_1.Allow)()];
            _firstNotifyDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'First notify date (ISO 8601)', format: 'date-time' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.IsDateString)()];
            _secondNotifyDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Second notify date (ISO 8601)', format: 'date-time' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.IsDateString)()];
            _thirdNotifyDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Third notify date (ISO 8601)', format: 'date-time' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.IsDateString)()];
            _renewedDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Renewed date (ISO 8601)', format: 'date-time' }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return omitEmptyOptional(value);
                }), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _productName_decorators, { kind: "field", name: "productName", static: false, private: false, access: { has: function (obj) { return "productName" in obj; }, get: function (obj) { return obj.productName; }, set: function (obj, value) { obj.productName = value; } }, metadata: _metadata }, _productName_initializers, _productName_extraInitializers);
            __esDecorate(null, null, _productDetails_decorators, { kind: "field", name: "productDetails", static: false, private: false, access: { has: function (obj) { return "productDetails" in obj; }, get: function (obj) { return obj.productDetails; }, set: function (obj, value) { obj.productDetails = value; } }, metadata: _metadata }, _productDetails_initializers, _productDetails_extraInitializers);
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _resetCategoryAssessmentData_decorators, { kind: "field", name: "resetCategoryAssessmentData", static: false, private: false, access: { has: function (obj) { return "resetCategoryAssessmentData" in obj; }, get: function (obj) { return obj.resetCategoryAssessmentData; }, set: function (obj, value) { obj.resetCategoryAssessmentData = value; } }, metadata: _metadata }, _resetCategoryAssessmentData_initializers, _resetCategoryAssessmentData_extraInitializers);
            __esDecorate(null, null, _previousCategoryId_decorators, { kind: "field", name: "previousCategoryId", static: false, private: false, access: { has: function (obj) { return "previousCategoryId" in obj; }, get: function (obj) { return obj.previousCategoryId; }, set: function (obj, value) { obj.previousCategoryId = value; } }, metadata: _metadata }, _previousCategoryId_initializers, _previousCategoryId_extraInitializers);
            __esDecorate(null, null, _newCategoryId_decorators, { kind: "field", name: "newCategoryId", static: false, private: false, access: { has: function (obj) { return "newCategoryId" in obj; }, get: function (obj) { return obj.newCategoryId; }, set: function (obj, value) { obj.newCategoryId = value; } }, metadata: _metadata }, _newCategoryId_initializers, _newCategoryId_extraInitializers);
            __esDecorate(null, null, _purgedRawMaterialStepIds_decorators, { kind: "field", name: "purgedRawMaterialStepIds", static: false, private: false, access: { has: function (obj) { return "purgedRawMaterialStepIds" in obj; }, get: function (obj) { return obj.purgedRawMaterialStepIds; }, set: function (obj, value) { obj.purgedRawMaterialStepIds = value; } }, metadata: _metadata }, _purgedRawMaterialStepIds_initializers, _purgedRawMaterialStepIds_extraInitializers);
            __esDecorate(null, null, _purgedSteps_decorators, { kind: "field", name: "purgedSteps", static: false, private: false, access: { has: function (obj) { return "purgedSteps" in obj; }, get: function (obj) { return obj.purgedSteps; }, set: function (obj, value) { obj.purgedSteps = value; } }, metadata: _metadata }, _purgedSteps_initializers, _purgedSteps_extraInitializers);
            __esDecorate(null, null, _retainedRawMaterialStepIds_decorators, { kind: "field", name: "retainedRawMaterialStepIds", static: false, private: false, access: { has: function (obj) { return "retainedRawMaterialStepIds" in obj; }, get: function (obj) { return obj.retainedRawMaterialStepIds; }, set: function (obj, value) { obj.retainedRawMaterialStepIds = value; } }, metadata: _metadata }, _retainedRawMaterialStepIds_initializers, _retainedRawMaterialStepIds_extraInitializers);
            __esDecorate(null, null, _retainedRawMaterialSteps_decorators, { kind: "field", name: "retainedRawMaterialSteps", static: false, private: false, access: { has: function (obj) { return "retainedRawMaterialSteps" in obj; }, get: function (obj) { return obj.retainedRawMaterialSteps; }, set: function (obj, value) { obj.retainedRawMaterialSteps = value; } }, metadata: _metadata }, _retainedRawMaterialSteps_initializers, _retainedRawMaterialSteps_extraInitializers);
            __esDecorate(null, null, _addedRawMaterialStepIds_decorators, { kind: "field", name: "addedRawMaterialStepIds", static: false, private: false, access: { has: function (obj) { return "addedRawMaterialStepIds" in obj; }, get: function (obj) { return obj.addedRawMaterialStepIds; }, set: function (obj, value) { obj.addedRawMaterialStepIds = value; } }, metadata: _metadata }, _addedRawMaterialStepIds_initializers, _addedRawMaterialStepIds_extraInitializers);
            __esDecorate(null, null, _addedRawMaterialSteps_decorators, { kind: "field", name: "addedRawMaterialSteps", static: false, private: false, access: { has: function (obj) { return "addedRawMaterialSteps" in obj; }, get: function (obj) { return obj.addedRawMaterialSteps; }, set: function (obj, value) { obj.addedRawMaterialSteps = value; } }, metadata: _metadata }, _addedRawMaterialSteps_initializers, _addedRawMaterialSteps_extraInitializers);
            __esDecorate(null, null, _visibleRawMaterialStepIds_decorators, { kind: "field", name: "visibleRawMaterialStepIds", static: false, private: false, access: { has: function (obj) { return "visibleRawMaterialStepIds" in obj; }, get: function (obj) { return obj.visibleRawMaterialStepIds; }, set: function (obj, value) { obj.visibleRawMaterialStepIds = value; } }, metadata: _metadata }, _visibleRawMaterialStepIds_initializers, _visibleRawMaterialStepIds_extraInitializers);
            __esDecorate(null, null, _visibleRawMaterialSteps_decorators, { kind: "field", name: "visibleRawMaterialSteps", static: false, private: false, access: { has: function (obj) { return "visibleRawMaterialSteps" in obj; }, get: function (obj) { return obj.visibleRawMaterialSteps; }, set: function (obj, value) { obj.visibleRawMaterialSteps = value; } }, metadata: _metadata }, _visibleRawMaterialSteps_initializers, _visibleRawMaterialSteps_extraInitializers);
            __esDecorate(null, null, _categoryChange_decorators, { kind: "field", name: "categoryChange", static: false, private: false, access: { has: function (obj) { return "categoryChange" in obj; }, get: function (obj) { return obj.categoryChange; }, set: function (obj, value) { obj.categoryChange = value; } }, metadata: _metadata }, _categoryChange_initializers, _categoryChange_extraInitializers);
            __esDecorate(null, null, _categoryEditable_decorators, { kind: "field", name: "categoryEditable", static: false, private: false, access: { has: function (obj) { return "categoryEditable" in obj; }, get: function (obj) { return obj.categoryEditable; }, set: function (obj, value) { obj.categoryEditable = value; } }, metadata: _metadata }, _categoryEditable_initializers, _categoryEditable_extraInitializers);
            __esDecorate(null, null, _categoryChangeBlockReason_decorators, { kind: "field", name: "categoryChangeBlockReason", static: false, private: false, access: { has: function (obj) { return "categoryChangeBlockReason" in obj; }, get: function (obj) { return obj.categoryChangeBlockReason; }, set: function (obj, value) { obj.categoryChangeBlockReason = value; } }, metadata: _metadata }, _categoryChangeBlockReason_initializers, _categoryChangeBlockReason_extraInitializers);
            __esDecorate(null, null, _vendorMustRefillRawMaterials_decorators, { kind: "field", name: "vendorMustRefillRawMaterials", static: false, private: false, access: { has: function (obj) { return "vendorMustRefillRawMaterials" in obj; }, get: function (obj) { return obj.vendorMustRefillRawMaterials; }, set: function (obj, value) { obj.vendorMustRefillRawMaterials = value; } }, metadata: _metadata }, _vendorMustRefillRawMaterials_initializers, _vendorMustRefillRawMaterials_extraInitializers);
            __esDecorate(null, null, _listRefreshRequired_decorators, { kind: "field", name: "listRefreshRequired", static: false, private: false, access: { has: function (obj) { return "listRefreshRequired" in obj; }, get: function (obj) { return obj.listRefreshRequired; }, set: function (obj, value) { obj.listRefreshRequired = value; } }, metadata: _metadata }, _listRefreshRequired_initializers, _listRefreshRequired_extraInitializers);
            __esDecorate(null, null, _productImage_decorators, { kind: "field", name: "productImage", static: false, private: false, access: { has: function (obj) { return "productImage" in obj; }, get: function (obj) { return obj.productImage; }, set: function (obj, value) { obj.productImage = value; } }, metadata: _metadata }, _productImage_initializers, _productImage_extraInitializers);
            __esDecorate(null, null, _productType_decorators, { kind: "field", name: "productType", static: false, private: false, access: { has: function (obj) { return "productType" in obj; }, get: function (obj) { return obj.productType; }, set: function (obj, value) { obj.productType = value; } }, metadata: _metadata }, _productType_initializers, _productType_extraInitializers);
            __esDecorate(null, null, _productStatus_decorators, { kind: "field", name: "productStatus", static: false, private: false, access: { has: function (obj) { return "productStatus" in obj; }, get: function (obj) { return obj.productStatus; }, set: function (obj, value) { obj.productStatus = value; } }, metadata: _metadata }, _productStatus_initializers, _productStatus_extraInitializers);
            __esDecorate(null, null, _productRenewStatus_decorators, { kind: "field", name: "productRenewStatus", static: false, private: false, access: { has: function (obj) { return "productRenewStatus" in obj; }, get: function (obj) { return obj.productRenewStatus; }, set: function (obj, value) { obj.productRenewStatus = value; } }, metadata: _metadata }, _productRenewStatus_initializers, _productRenewStatus_extraInitializers);
            __esDecorate(null, null, _urnStatus_decorators, { kind: "field", name: "urnStatus", static: false, private: false, access: { has: function (obj) { return "urnStatus" in obj; }, get: function (obj) { return obj.urnStatus; }, set: function (obj, value) { obj.urnStatus = value; } }, metadata: _metadata }, _urnStatus_initializers, _urnStatus_extraInitializers);
            __esDecorate(null, null, _assessmentReportUrl_decorators, { kind: "field", name: "assessmentReportUrl", static: false, private: false, access: { has: function (obj) { return "assessmentReportUrl" in obj; }, get: function (obj) { return obj.assessmentReportUrl; }, set: function (obj, value) { obj.assessmentReportUrl = value; } }, metadata: _metadata }, _assessmentReportUrl_initializers, _assessmentReportUrl_extraInitializers);
            __esDecorate(null, null, _rejectedDetails_decorators, { kind: "field", name: "rejectedDetails", static: false, private: false, access: { has: function (obj) { return "rejectedDetails" in obj; }, get: function (obj) { return obj.rejectedDetails; }, set: function (obj, value) { obj.rejectedDetails = value; } }, metadata: _metadata }, _rejectedDetails_initializers, _rejectedDetails_extraInitializers);
            __esDecorate(null, null, _certifiedDate_decorators, { kind: "field", name: "certifiedDate", static: false, private: false, access: { has: function (obj) { return "certifiedDate" in obj; }, get: function (obj) { return obj.certifiedDate; }, set: function (obj, value) { obj.certifiedDate = value; } }, metadata: _metadata }, _certifiedDate_initializers, _certifiedDate_extraInitializers);
            __esDecorate(null, null, _validtillDate_decorators, { kind: "field", name: "validtillDate", static: false, private: false, access: { has: function (obj) { return "validtillDate" in obj; }, get: function (obj) { return obj.validtillDate; }, set: function (obj, value) { obj.validtillDate = value; } }, metadata: _metadata }, _validtillDate_initializers, _validtillDate_extraInitializers);
            __esDecorate(null, null, _validTillDate_decorators, { kind: "field", name: "validTillDate", static: false, private: false, access: { has: function (obj) { return "validTillDate" in obj; }, get: function (obj) { return obj.validTillDate; }, set: function (obj, value) { obj.validTillDate = value; } }, metadata: _metadata }, _validTillDate_initializers, _validTillDate_extraInitializers);
            __esDecorate(null, null, _firstNotifyDate_decorators, { kind: "field", name: "firstNotifyDate", static: false, private: false, access: { has: function (obj) { return "firstNotifyDate" in obj; }, get: function (obj) { return obj.firstNotifyDate; }, set: function (obj, value) { obj.firstNotifyDate = value; } }, metadata: _metadata }, _firstNotifyDate_initializers, _firstNotifyDate_extraInitializers);
            __esDecorate(null, null, _secondNotifyDate_decorators, { kind: "field", name: "secondNotifyDate", static: false, private: false, access: { has: function (obj) { return "secondNotifyDate" in obj; }, get: function (obj) { return obj.secondNotifyDate; }, set: function (obj, value) { obj.secondNotifyDate = value; } }, metadata: _metadata }, _secondNotifyDate_initializers, _secondNotifyDate_extraInitializers);
            __esDecorate(null, null, _thirdNotifyDate_decorators, { kind: "field", name: "thirdNotifyDate", static: false, private: false, access: { has: function (obj) { return "thirdNotifyDate" in obj; }, get: function (obj) { return obj.thirdNotifyDate; }, set: function (obj, value) { obj.thirdNotifyDate = value; } }, metadata: _metadata }, _thirdNotifyDate_initializers, _thirdNotifyDate_extraInitializers);
            __esDecorate(null, null, _renewedDate_decorators, { kind: "field", name: "renewedDate", static: false, private: false, access: { has: function (obj) { return "renewedDate" in obj; }, get: function (obj) { return obj.renewedDate; }, set: function (obj, value) { obj.renewedDate = value; } }, metadata: _metadata }, _renewedDate_initializers, _renewedDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateProductDto = UpdateProductDto;
