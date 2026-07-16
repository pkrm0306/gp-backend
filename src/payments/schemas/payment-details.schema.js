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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDetailsSchema = exports.PaymentDetails = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var PaymentDetails = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'payment_details', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _paymentId_decorators;
    var _paymentId_initializers = [];
    var _paymentId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
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
    var _proposalFile_decorators;
    var _proposalFile_initializers = [];
    var _proposalFile_extraInitializers = [];
    var _adminGstNo_decorators;
    var _adminGstNo_initializers = [];
    var _adminGstNo_extraInitializers = [];
    var _vendorGstNo_decorators;
    var _vendorGstNo_initializers = [];
    var _vendorGstNo_extraInitializers = [];
    var _paymentType_decorators;
    var _paymentType_initializers = [];
    var _paymentType_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
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
    var _chequeOrDdFile_decorators;
    var _chequeOrDdFile_initializers = [];
    var _chequeOrDdFile_extraInitializers = [];
    var _tdsFile_decorators;
    var _tdsFile_initializers = [];
    var _tdsFile_extraInitializers = [];
    var _productsToBeCertified_decorators;
    var _productsToBeCertified_initializers = [];
    var _productsToBeCertified_extraInitializers = [];
    var _paymentStatus_decorators;
    var _paymentStatus_initializers = [];
    var _paymentStatus_extraInitializers = [];
    var _vendorProposalApprovalStatus_decorators;
    var _vendorProposalApprovalStatus_initializers = [];
    var _vendorProposalApprovalStatus_extraInitializers = [];
    var _proposalRejectionRemarks_decorators;
    var _proposalRejectionRemarks_initializers = [];
    var _proposalRejectionRemarks_extraInitializers = [];
    var _paymentRejectionRemarks_decorators;
    var _paymentRejectionRemarks_initializers = [];
    var _paymentRejectionRemarks_extraInitializers = [];
    var _previousProposalFile_decorators;
    var _previousProposalFile_initializers = [];
    var _previousProposalFile_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var PaymentDetails = _classThis = /** @class */ (function () {
        function PaymentDetails_1() {
            this.paymentId = __runInitializers(this, _paymentId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.vendorId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.quoteAmount = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _quoteAmount_initializers, void 0));
            this.quoteGstAmount = (__runInitializers(this, _quoteAmount_extraInitializers), __runInitializers(this, _quoteGstAmount_initializers, void 0));
            this.quoteTdsAmount = (__runInitializers(this, _quoteGstAmount_extraInitializers), __runInitializers(this, _quoteTdsAmount_initializers, void 0));
            this.quoteTotal = (__runInitializers(this, _quoteTdsAmount_extraInitializers), __runInitializers(this, _quoteTotal_initializers, void 0));
            this.proposalFile = (__runInitializers(this, _quoteTotal_extraInitializers), __runInitializers(this, _proposalFile_initializers, void 0));
            this.adminGstNo = (__runInitializers(this, _proposalFile_extraInitializers), __runInitializers(this, _adminGstNo_initializers, void 0));
            this.vendorGstNo = (__runInitializers(this, _adminGstNo_extraInitializers), __runInitializers(this, _vendorGstNo_initializers, void 0));
            this.paymentType = (__runInitializers(this, _vendorGstNo_extraInitializers), __runInitializers(this, _paymentType_initializers, void 0));
            /** Required for `paymentType: renew` — scopes fee to one renewal cycle. */
            this.renewalCycleId = (__runInitializers(this, _paymentType_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
            this.paymentMode = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _paymentMode_initializers, void 0));
            this.onlinePaymentId = (__runInitializers(this, _paymentMode_extraInitializers), __runInitializers(this, _onlinePaymentId_initializers, void 0));
            this.paymentReferenceNo = (__runInitializers(this, _onlinePaymentId_extraInitializers), __runInitializers(this, _paymentReferenceNo_initializers, void 0));
            this.paymentChequeDate = (__runInitializers(this, _paymentReferenceNo_extraInitializers), __runInitializers(this, _paymentChequeDate_initializers, void 0));
            this.chequeOrDdFile = (__runInitializers(this, _paymentChequeDate_extraInitializers), __runInitializers(this, _chequeOrDdFile_initializers, void 0));
            this.tdsFile = (__runInitializers(this, _chequeOrDdFile_extraInitializers), __runInitializers(this, _tdsFile_initializers, void 0));
            this.productsToBeCertified = (__runInitializers(this, _tdsFile_extraInitializers), __runInitializers(this, _productsToBeCertified_initializers, void 0));
            this.paymentStatus = (__runInitializers(this, _productsToBeCertified_extraInitializers), __runInitializers(this, _paymentStatus_initializers, void 0)); // 0=Created, 1=Pending, 2=Completed, 3=Cancelled
            /** 0=pending vendor review, 1=approved, 2=rejected (await admin re-upload) */
            this.vendorProposalApprovalStatus = (__runInitializers(this, _paymentStatus_extraInitializers), __runInitializers(this, _vendorProposalApprovalStatus_initializers, void 0));
            this.proposalRejectionRemarks = (__runInitializers(this, _vendorProposalApprovalStatus_extraInitializers), __runInitializers(this, _proposalRejectionRemarks_initializers, void 0));
            /** Admin remarks when rejecting vendor payment proof (paymentStatus = 3) */
            this.paymentRejectionRemarks = (__runInitializers(this, _proposalRejectionRemarks_extraInitializers), __runInitializers(this, _paymentRejectionRemarks_initializers, void 0));
            /** Previous proposal file path after admin re-upload (audit) */
            this.previousProposalFile = (__runInitializers(this, _paymentRejectionRemarks_extraInitializers), __runInitializers(this, _previousProposalFile_initializers, void 0));
            this.createdDate = (__runInitializers(this, _previousProposalFile_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return PaymentDetails_1;
    }());
    __setFunctionName(_classThis, "PaymentDetails");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _paymentId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _quoteAmount_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number })];
        _quoteGstAmount_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number })];
        _quoteTdsAmount_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number })];
        _quoteTotal_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number })];
        _proposalFile_decorators = [(0, mongoose_1.Prop)()];
        _adminGstNo_decorators = [(0, mongoose_1.Prop)()];
        _vendorGstNo_decorators = [(0, mongoose_1.Prop)()];
        _paymentType_decorators = [(0, mongoose_1.Prop)({
                required: true,
                enum: ['registration', 'certification', 'renew'],
                default: 'registration',
            })];
        _renewalCycleId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'RenewalCycle' })];
        _paymentMode_decorators = [(0, mongoose_1.Prop)({
                enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
            })];
        _onlinePaymentId_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _paymentReferenceNo_decorators = [(0, mongoose_1.Prop)()];
        _paymentChequeDate_decorators = [(0, mongoose_1.Prop)()];
        _chequeOrDdFile_decorators = [(0, mongoose_1.Prop)()];
        _tdsFile_decorators = [(0, mongoose_1.Prop)()];
        _productsToBeCertified_decorators = [(0, mongoose_1.Prop)()];
        _paymentStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _vendorProposalApprovalStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _proposalRejectionRemarks_decorators = [(0, mongoose_1.Prop)()];
        _paymentRejectionRemarks_decorators = [(0, mongoose_1.Prop)()];
        _previousProposalFile_decorators = [(0, mongoose_1.Prop)()];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: function (obj) { return "paymentId" in obj; }, get: function (obj) { return obj.paymentId; }, set: function (obj, value) { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _quoteAmount_decorators, { kind: "field", name: "quoteAmount", static: false, private: false, access: { has: function (obj) { return "quoteAmount" in obj; }, get: function (obj) { return obj.quoteAmount; }, set: function (obj, value) { obj.quoteAmount = value; } }, metadata: _metadata }, _quoteAmount_initializers, _quoteAmount_extraInitializers);
        __esDecorate(null, null, _quoteGstAmount_decorators, { kind: "field", name: "quoteGstAmount", static: false, private: false, access: { has: function (obj) { return "quoteGstAmount" in obj; }, get: function (obj) { return obj.quoteGstAmount; }, set: function (obj, value) { obj.quoteGstAmount = value; } }, metadata: _metadata }, _quoteGstAmount_initializers, _quoteGstAmount_extraInitializers);
        __esDecorate(null, null, _quoteTdsAmount_decorators, { kind: "field", name: "quoteTdsAmount", static: false, private: false, access: { has: function (obj) { return "quoteTdsAmount" in obj; }, get: function (obj) { return obj.quoteTdsAmount; }, set: function (obj, value) { obj.quoteTdsAmount = value; } }, metadata: _metadata }, _quoteTdsAmount_initializers, _quoteTdsAmount_extraInitializers);
        __esDecorate(null, null, _quoteTotal_decorators, { kind: "field", name: "quoteTotal", static: false, private: false, access: { has: function (obj) { return "quoteTotal" in obj; }, get: function (obj) { return obj.quoteTotal; }, set: function (obj, value) { obj.quoteTotal = value; } }, metadata: _metadata }, _quoteTotal_initializers, _quoteTotal_extraInitializers);
        __esDecorate(null, null, _proposalFile_decorators, { kind: "field", name: "proposalFile", static: false, private: false, access: { has: function (obj) { return "proposalFile" in obj; }, get: function (obj) { return obj.proposalFile; }, set: function (obj, value) { obj.proposalFile = value; } }, metadata: _metadata }, _proposalFile_initializers, _proposalFile_extraInitializers);
        __esDecorate(null, null, _adminGstNo_decorators, { kind: "field", name: "adminGstNo", static: false, private: false, access: { has: function (obj) { return "adminGstNo" in obj; }, get: function (obj) { return obj.adminGstNo; }, set: function (obj, value) { obj.adminGstNo = value; } }, metadata: _metadata }, _adminGstNo_initializers, _adminGstNo_extraInitializers);
        __esDecorate(null, null, _vendorGstNo_decorators, { kind: "field", name: "vendorGstNo", static: false, private: false, access: { has: function (obj) { return "vendorGstNo" in obj; }, get: function (obj) { return obj.vendorGstNo; }, set: function (obj, value) { obj.vendorGstNo = value; } }, metadata: _metadata }, _vendorGstNo_initializers, _vendorGstNo_extraInitializers);
        __esDecorate(null, null, _paymentType_decorators, { kind: "field", name: "paymentType", static: false, private: false, access: { has: function (obj) { return "paymentType" in obj; }, get: function (obj) { return obj.paymentType; }, set: function (obj, value) { obj.paymentType = value; } }, metadata: _metadata }, _paymentType_initializers, _paymentType_extraInitializers);
        __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
        __esDecorate(null, null, _paymentMode_decorators, { kind: "field", name: "paymentMode", static: false, private: false, access: { has: function (obj) { return "paymentMode" in obj; }, get: function (obj) { return obj.paymentMode; }, set: function (obj, value) { obj.paymentMode = value; } }, metadata: _metadata }, _paymentMode_initializers, _paymentMode_extraInitializers);
        __esDecorate(null, null, _onlinePaymentId_decorators, { kind: "field", name: "onlinePaymentId", static: false, private: false, access: { has: function (obj) { return "onlinePaymentId" in obj; }, get: function (obj) { return obj.onlinePaymentId; }, set: function (obj, value) { obj.onlinePaymentId = value; } }, metadata: _metadata }, _onlinePaymentId_initializers, _onlinePaymentId_extraInitializers);
        __esDecorate(null, null, _paymentReferenceNo_decorators, { kind: "field", name: "paymentReferenceNo", static: false, private: false, access: { has: function (obj) { return "paymentReferenceNo" in obj; }, get: function (obj) { return obj.paymentReferenceNo; }, set: function (obj, value) { obj.paymentReferenceNo = value; } }, metadata: _metadata }, _paymentReferenceNo_initializers, _paymentReferenceNo_extraInitializers);
        __esDecorate(null, null, _paymentChequeDate_decorators, { kind: "field", name: "paymentChequeDate", static: false, private: false, access: { has: function (obj) { return "paymentChequeDate" in obj; }, get: function (obj) { return obj.paymentChequeDate; }, set: function (obj, value) { obj.paymentChequeDate = value; } }, metadata: _metadata }, _paymentChequeDate_initializers, _paymentChequeDate_extraInitializers);
        __esDecorate(null, null, _chequeOrDdFile_decorators, { kind: "field", name: "chequeOrDdFile", static: false, private: false, access: { has: function (obj) { return "chequeOrDdFile" in obj; }, get: function (obj) { return obj.chequeOrDdFile; }, set: function (obj, value) { obj.chequeOrDdFile = value; } }, metadata: _metadata }, _chequeOrDdFile_initializers, _chequeOrDdFile_extraInitializers);
        __esDecorate(null, null, _tdsFile_decorators, { kind: "field", name: "tdsFile", static: false, private: false, access: { has: function (obj) { return "tdsFile" in obj; }, get: function (obj) { return obj.tdsFile; }, set: function (obj, value) { obj.tdsFile = value; } }, metadata: _metadata }, _tdsFile_initializers, _tdsFile_extraInitializers);
        __esDecorate(null, null, _productsToBeCertified_decorators, { kind: "field", name: "productsToBeCertified", static: false, private: false, access: { has: function (obj) { return "productsToBeCertified" in obj; }, get: function (obj) { return obj.productsToBeCertified; }, set: function (obj, value) { obj.productsToBeCertified = value; } }, metadata: _metadata }, _productsToBeCertified_initializers, _productsToBeCertified_extraInitializers);
        __esDecorate(null, null, _paymentStatus_decorators, { kind: "field", name: "paymentStatus", static: false, private: false, access: { has: function (obj) { return "paymentStatus" in obj; }, get: function (obj) { return obj.paymentStatus; }, set: function (obj, value) { obj.paymentStatus = value; } }, metadata: _metadata }, _paymentStatus_initializers, _paymentStatus_extraInitializers);
        __esDecorate(null, null, _vendorProposalApprovalStatus_decorators, { kind: "field", name: "vendorProposalApprovalStatus", static: false, private: false, access: { has: function (obj) { return "vendorProposalApprovalStatus" in obj; }, get: function (obj) { return obj.vendorProposalApprovalStatus; }, set: function (obj, value) { obj.vendorProposalApprovalStatus = value; } }, metadata: _metadata }, _vendorProposalApprovalStatus_initializers, _vendorProposalApprovalStatus_extraInitializers);
        __esDecorate(null, null, _proposalRejectionRemarks_decorators, { kind: "field", name: "proposalRejectionRemarks", static: false, private: false, access: { has: function (obj) { return "proposalRejectionRemarks" in obj; }, get: function (obj) { return obj.proposalRejectionRemarks; }, set: function (obj, value) { obj.proposalRejectionRemarks = value; } }, metadata: _metadata }, _proposalRejectionRemarks_initializers, _proposalRejectionRemarks_extraInitializers);
        __esDecorate(null, null, _paymentRejectionRemarks_decorators, { kind: "field", name: "paymentRejectionRemarks", static: false, private: false, access: { has: function (obj) { return "paymentRejectionRemarks" in obj; }, get: function (obj) { return obj.paymentRejectionRemarks; }, set: function (obj, value) { obj.paymentRejectionRemarks = value; } }, metadata: _metadata }, _paymentRejectionRemarks_initializers, _paymentRejectionRemarks_extraInitializers);
        __esDecorate(null, null, _previousProposalFile_decorators, { kind: "field", name: "previousProposalFile", static: false, private: false, access: { has: function (obj) { return "previousProposalFile" in obj; }, get: function (obj) { return obj.previousProposalFile; }, set: function (obj, value) { obj.previousProposalFile = value; } }, metadata: _metadata }, _previousProposalFile_initializers, _previousProposalFile_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentDetails = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentDetails = _classThis;
}();
exports.PaymentDetails = PaymentDetails;
exports.PaymentDetailsSchema = mongoose_1.SchemaFactory.createForClass(PaymentDetails);
exports.PaymentDetailsSchema.index({ urnNo: 1, paymentType: 1, renewalCycleId: 1 }, {
    unique: true,
    sparse: true,
    name: 'uniq_renew_payment_per_cycle',
});
/** Admin dashboard payment status / recent payments / revenue facets */
exports.PaymentDetailsSchema.index({ paymentStatus: 1, updatedDate: -1 });
exports.PaymentDetailsSchema.index({ paymentStatus: 1, createdDate: -1 });
exports.PaymentDetailsSchema.index({ vendorId: 1, paymentStatus: 1, updatedDate: -1 });
exports.PaymentDetailsSchema.index({ vendorId: 1, paymentStatus: 1, createdDate: -1 });
