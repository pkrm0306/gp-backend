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
exports.CreatePaymentDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var CreatePaymentDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _quoteAmount_decorators;
    var _quoteAmount_initializers = [];
    var _quoteAmount_extraInitializers = [];
    var _quoteGstAmount_decorators;
    var _quoteGstAmount_initializers = [];
    var _quoteGstAmount_extraInitializers = [];
    var _quoteTdsAmount_decorators;
    var _quoteTdsAmount_initializers = [];
    var _quoteTdsAmount_extraInitializers = [];
    var _quoteTotal_decorators;
    var _quoteTotal_initializers = [];
    var _quoteTotal_extraInitializers = [];
    var _adminGstNo_decorators;
    var _adminGstNo_initializers = [];
    var _adminGstNo_extraInitializers = [];
    var _vendorGstNo_decorators;
    var _vendorGstNo_initializers = [];
    var _vendorGstNo_extraInitializers = [];
    var _paymentType_decorators;
    var _paymentType_initializers = [];
    var _paymentType_extraInitializers = [];
    var _paymentMode_decorators;
    var _paymentMode_initializers = [];
    var _paymentMode_extraInitializers = [];
    var _onlinePaymentId_decorators;
    var _onlinePaymentId_initializers = [];
    var _onlinePaymentId_extraInitializers = [];
    var _paymentReferenceNo_decorators;
    var _paymentReferenceNo_initializers = [];
    var _paymentReferenceNo_extraInitializers = [];
    var _paymentChequeDate_decorators;
    var _paymentChequeDate_initializers = [];
    var _paymentChequeDate_extraInitializers = [];
    var _productsToBeCertified_decorators;
    var _productsToBeCertified_initializers = [];
    var _productsToBeCertified_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePaymentDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.quoteAmount = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _quoteAmount_initializers, void 0));
                this.quoteGstAmount = (__runInitializers(this, _quoteAmount_extraInitializers), __runInitializers(this, _quoteGstAmount_initializers, void 0));
                this.quoteTdsAmount = (__runInitializers(this, _quoteGstAmount_extraInitializers), __runInitializers(this, _quoteTdsAmount_initializers, void 0));
                this.quoteTotal = (__runInitializers(this, _quoteTdsAmount_extraInitializers), __runInitializers(this, _quoteTotal_initializers, void 0));
                this.adminGstNo = (__runInitializers(this, _quoteTotal_extraInitializers), __runInitializers(this, _adminGstNo_initializers, void 0));
                this.vendorGstNo = (__runInitializers(this, _adminGstNo_extraInitializers), __runInitializers(this, _vendorGstNo_initializers, void 0));
                this.paymentType = (__runInitializers(this, _vendorGstNo_extraInitializers), __runInitializers(this, _paymentType_initializers, void 0));
                this.paymentMode = (__runInitializers(this, _paymentType_extraInitializers), __runInitializers(this, _paymentMode_initializers, void 0));
                this.onlinePaymentId = (__runInitializers(this, _paymentMode_extraInitializers), __runInitializers(this, _onlinePaymentId_initializers, void 0));
                this.paymentReferenceNo = (__runInitializers(this, _onlinePaymentId_extraInitializers), __runInitializers(this, _paymentReferenceNo_initializers, void 0));
                this.paymentChequeDate = (__runInitializers(this, _paymentReferenceNo_extraInitializers), __runInitializers(this, _paymentChequeDate_initializers, void 0));
                this.productsToBeCertified = (__runInitializers(this, _paymentChequeDate_extraInitializers), __runInitializers(this, _productsToBeCertified_initializers, void 0));
                this.renewalCycleId = (__runInitializers(this, _productsToBeCertified_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
                __runInitializers(this, _renewalCycleId_extraInitializers);
            }
            return CreatePaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260303142815',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _quoteAmount_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Quote amount (mandatory)',
                    example: 10000.0,
                    required: true,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsNotEmpty)()];
            _quoteGstAmount_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'GST amount (mandatory)',
                    example: 1800.0,
                    required: true,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsNotEmpty)()];
            _quoteTdsAmount_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'TDS amount (mandatory)',
                    example: 1000,
                    required: true,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsNotEmpty)()];
            _quoteTotal_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Total amount (mandatory)',
                    example: 10800.0,
                    required: true,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsNotEmpty)()];
            _adminGstNo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Admin GST number',
                    example: '29ABCDE1234F1Z5',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _vendorGstNo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Vendor GST number',
                    example: '27ABCDE1234F1Z5',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _paymentType_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Payment type',
                    example: 'registration',
                    enum: ['registration', 'certification', 'renew'],
                    required: false,
                    default: 'registration',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['registration', 'certification', 'renew'])];
            _paymentMode_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Payment mode',
                    example: 'online',
                    enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['online', 'cheque_or_dd', 'neft_or_rtgs'])];
            _onlinePaymentId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Online payment ID',
                    example: 0,
                    required: false,
                    default: 0,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _paymentReferenceNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Payment reference number',
                    example: 'REF123456',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _paymentChequeDate_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Payment cheque date',
                    example: '2026-03-15',
                    required: false,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (value === '' ? undefined : value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _productsToBeCertified_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Numeric productId values only — JSON array string (certification payments)',
                    example: '[101,102]',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _renewalCycleId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Active renewal cycle id (required when paymentType is renew)',
                    example: '6a1edd713ec5008b997aca94',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _quoteAmount_decorators, { kind: "field", name: "quoteAmount", static: false, private: false, access: { has: function (obj) { return "quoteAmount" in obj; }, get: function (obj) { return obj.quoteAmount; }, set: function (obj, value) { obj.quoteAmount = value; } }, metadata: _metadata }, _quoteAmount_initializers, _quoteAmount_extraInitializers);
            __esDecorate(null, null, _quoteGstAmount_decorators, { kind: "field", name: "quoteGstAmount", static: false, private: false, access: { has: function (obj) { return "quoteGstAmount" in obj; }, get: function (obj) { return obj.quoteGstAmount; }, set: function (obj, value) { obj.quoteGstAmount = value; } }, metadata: _metadata }, _quoteGstAmount_initializers, _quoteGstAmount_extraInitializers);
            __esDecorate(null, null, _quoteTdsAmount_decorators, { kind: "field", name: "quoteTdsAmount", static: false, private: false, access: { has: function (obj) { return "quoteTdsAmount" in obj; }, get: function (obj) { return obj.quoteTdsAmount; }, set: function (obj, value) { obj.quoteTdsAmount = value; } }, metadata: _metadata }, _quoteTdsAmount_initializers, _quoteTdsAmount_extraInitializers);
            __esDecorate(null, null, _quoteTotal_decorators, { kind: "field", name: "quoteTotal", static: false, private: false, access: { has: function (obj) { return "quoteTotal" in obj; }, get: function (obj) { return obj.quoteTotal; }, set: function (obj, value) { obj.quoteTotal = value; } }, metadata: _metadata }, _quoteTotal_initializers, _quoteTotal_extraInitializers);
            __esDecorate(null, null, _adminGstNo_decorators, { kind: "field", name: "adminGstNo", static: false, private: false, access: { has: function (obj) { return "adminGstNo" in obj; }, get: function (obj) { return obj.adminGstNo; }, set: function (obj, value) { obj.adminGstNo = value; } }, metadata: _metadata }, _adminGstNo_initializers, _adminGstNo_extraInitializers);
            __esDecorate(null, null, _vendorGstNo_decorators, { kind: "field", name: "vendorGstNo", static: false, private: false, access: { has: function (obj) { return "vendorGstNo" in obj; }, get: function (obj) { return obj.vendorGstNo; }, set: function (obj, value) { obj.vendorGstNo = value; } }, metadata: _metadata }, _vendorGstNo_initializers, _vendorGstNo_extraInitializers);
            __esDecorate(null, null, _paymentType_decorators, { kind: "field", name: "paymentType", static: false, private: false, access: { has: function (obj) { return "paymentType" in obj; }, get: function (obj) { return obj.paymentType; }, set: function (obj, value) { obj.paymentType = value; } }, metadata: _metadata }, _paymentType_initializers, _paymentType_extraInitializers);
            __esDecorate(null, null, _paymentMode_decorators, { kind: "field", name: "paymentMode", static: false, private: false, access: { has: function (obj) { return "paymentMode" in obj; }, get: function (obj) { return obj.paymentMode; }, set: function (obj, value) { obj.paymentMode = value; } }, metadata: _metadata }, _paymentMode_initializers, _paymentMode_extraInitializers);
            __esDecorate(null, null, _onlinePaymentId_decorators, { kind: "field", name: "onlinePaymentId", static: false, private: false, access: { has: function (obj) { return "onlinePaymentId" in obj; }, get: function (obj) { return obj.onlinePaymentId; }, set: function (obj, value) { obj.onlinePaymentId = value; } }, metadata: _metadata }, _onlinePaymentId_initializers, _onlinePaymentId_extraInitializers);
            __esDecorate(null, null, _paymentReferenceNo_decorators, { kind: "field", name: "paymentReferenceNo", static: false, private: false, access: { has: function (obj) { return "paymentReferenceNo" in obj; }, get: function (obj) { return obj.paymentReferenceNo; }, set: function (obj, value) { obj.paymentReferenceNo = value; } }, metadata: _metadata }, _paymentReferenceNo_initializers, _paymentReferenceNo_extraInitializers);
            __esDecorate(null, null, _paymentChequeDate_decorators, { kind: "field", name: "paymentChequeDate", static: false, private: false, access: { has: function (obj) { return "paymentChequeDate" in obj; }, get: function (obj) { return obj.paymentChequeDate; }, set: function (obj, value) { obj.paymentChequeDate = value; } }, metadata: _metadata }, _paymentChequeDate_initializers, _paymentChequeDate_extraInitializers);
            __esDecorate(null, null, _productsToBeCertified_decorators, { kind: "field", name: "productsToBeCertified", static: false, private: false, access: { has: function (obj) { return "productsToBeCertified" in obj; }, get: function (obj) { return obj.productsToBeCertified; }, set: function (obj, value) { obj.productsToBeCertified = value; } }, metadata: _metadata }, _productsToBeCertified_initializers, _productsToBeCertified_extraInitializers);
            __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePaymentDto = CreatePaymentDto;
