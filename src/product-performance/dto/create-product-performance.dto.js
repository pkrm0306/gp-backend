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
exports.CreateProductPerformanceDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var test_report_entry_dto_1 = require("./test-report-entry.dto");
var CreateProductPerformanceDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _renewalType_decorators;
    var _renewalType_initializers = [];
    var _renewalType_extraInitializers = [];
    var _productPerformanceStatus_decorators;
    var _productPerformanceStatus_initializers = [];
    var _productPerformanceStatus_extraInitializers = [];
    var _testReports_decorators;
    var _testReports_initializers = [];
    var _testReports_extraInitializers = [];
    var _testReportFileName_decorators;
    var _testReportFileName_initializers = [];
    var _testReportFileName_extraInitializers = [];
    var _productName_decorators;
    var _productName_initializers = [];
    var _productName_extraInitializers = [];
    var _existingDocumentIds_decorators;
    var _existingDocumentIds_initializers = [];
    var _existingDocumentIds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProductPerformanceDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.renewalType = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _renewalType_initializers, void 0));
                this.productPerformanceStatus = (__runInitializers(this, _renewalType_extraInitializers), __runInitializers(this, _productPerformanceStatus_initializers, void 0));
                this.testReports = (__runInitializers(this, _productPerformanceStatus_extraInitializers), __runInitializers(this, _testReports_initializers, void 0));
                /** @deprecated Use testReports[].testReportFileName — kept for single-file legacy submits */
                this.testReportFileName = (__runInitializers(this, _testReports_extraInitializers), __runInitializers(this, _testReportFileName_initializers, void 0));
                /** @deprecated Use testReports[].productName */
                this.productName = (__runInitializers(this, _testReportFileName_extraInitializers), __runInitializers(this, _productName_initializers, void 0));
                this.existingDocumentIds = (__runInitializers(this, _productName_extraInitializers), __runInitializers(this, _existingDocumentIds_initializers, void 0));
                __runInitializers(this, _existingDocumentIds_extraInitializers);
            }
            return CreateProductPerformanceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _renewalType_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Renewal type (0=Not Renewed, >0 = Renewed no of times)',
                    example: 0,
                    required: false,
                    minimum: 0,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _productPerformanceStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Product performance status (0=Pending, 1=Completed)',
                    example: 0,
                    required: false,
                    enum: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            _testReports_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'JSON array — **replaces** all test report rows for this URN (optional; send full list on save). At least one of testReports (non-empty row), files, or retained product_performance_documents for this URN should be present. Format: [{"productName":"...","testReportFileName":"..."}]',
                    type: [test_report_entry_dto_1.TestReportEntryDto],
                    required: false,
                    example: [
                        {
                            productName: 'Solar Panel 100W',
                            testReportFileName: 'IEC Test Report - March 2026',
                        },
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return test_report_entry_dto_1.TestReportEntryDto; })];
            _testReportFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Legacy single test report display name when uploading one file',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productName_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _existingDocumentIds_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'JSON array of productDocumentId (or _id) values to keep for product performance documents. Omit to keep all on text-only save; [] to clear unlisted.',
                    required: false,
                    example: '[201,202,203]',
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _renewalType_decorators, { kind: "field", name: "renewalType", static: false, private: false, access: { has: function (obj) { return "renewalType" in obj; }, get: function (obj) { return obj.renewalType; }, set: function (obj, value) { obj.renewalType = value; } }, metadata: _metadata }, _renewalType_initializers, _renewalType_extraInitializers);
            __esDecorate(null, null, _productPerformanceStatus_decorators, { kind: "field", name: "productPerformanceStatus", static: false, private: false, access: { has: function (obj) { return "productPerformanceStatus" in obj; }, get: function (obj) { return obj.productPerformanceStatus; }, set: function (obj, value) { obj.productPerformanceStatus = value; } }, metadata: _metadata }, _productPerformanceStatus_initializers, _productPerformanceStatus_extraInitializers);
            __esDecorate(null, null, _testReports_decorators, { kind: "field", name: "testReports", static: false, private: false, access: { has: function (obj) { return "testReports" in obj; }, get: function (obj) { return obj.testReports; }, set: function (obj, value) { obj.testReports = value; } }, metadata: _metadata }, _testReports_initializers, _testReports_extraInitializers);
            __esDecorate(null, null, _testReportFileName_decorators, { kind: "field", name: "testReportFileName", static: false, private: false, access: { has: function (obj) { return "testReportFileName" in obj; }, get: function (obj) { return obj.testReportFileName; }, set: function (obj, value) { obj.testReportFileName = value; } }, metadata: _metadata }, _testReportFileName_initializers, _testReportFileName_extraInitializers);
            __esDecorate(null, null, _productName_decorators, { kind: "field", name: "productName", static: false, private: false, access: { has: function (obj) { return "productName" in obj; }, get: function (obj) { return obj.productName; }, set: function (obj, value) { obj.productName = value; } }, metadata: _metadata }, _productName_initializers, _productName_extraInitializers);
            __esDecorate(null, null, _existingDocumentIds_decorators, { kind: "field", name: "existingDocumentIds", static: false, private: false, access: { has: function (obj) { return "existingDocumentIds" in obj; }, get: function (obj) { return obj.existingDocumentIds; }, set: function (obj, value) { obj.existingDocumentIds = value; } }, metadata: _metadata }, _existingDocumentIds_initializers, _existingDocumentIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProductPerformanceDto = CreateProductPerformanceDto;
