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
exports.AllRenewProductDocumentSchema = exports.AllRenewProductDocument = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var AllRenewProductDocument = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'all_renew_product_documents', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _productDocumentId_decorators;
    var _productDocumentId_initializers = [];
    var _productDocumentId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _documentForm_decorators;
    var _documentForm_initializers = [];
    var _documentForm_extraInitializers = [];
    var _documentFormSubsection_decorators;
    var _documentFormSubsection_initializers = [];
    var _documentFormSubsection_extraInitializers = [];
    var _formPrimaryId_decorators;
    var _formPrimaryId_initializers = [];
    var _formPrimaryId_extraInitializers = [];
    var _documentName_decorators;
    var _documentName_initializers = [];
    var _documentName_extraInitializers = [];
    var _documentOriginalName_decorators;
    var _documentOriginalName_initializers = [];
    var _documentOriginalName_extraInitializers = [];
    var _documentLink_decorators;
    var _documentLink_initializers = [];
    var _documentLink_extraInitializers = [];
    var _documentTag_decorators;
    var _documentTag_initializers = [];
    var _documentTag_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var _isDeleted_decorators;
    var _isDeleted_initializers = [];
    var _isDeleted_extraInitializers = [];
    var _deletedAt_decorators;
    var _deletedAt_initializers = [];
    var _deletedAt_extraInitializers = [];
    var _deletedBy_decorators;
    var _deletedBy_initializers = [];
    var _deletedBy_extraInitializers = [];
    var AllRenewProductDocument = _classThis = /** @class */ (function () {
        function AllRenewProductDocument_1() {
            this.productDocumentId = __runInitializers(this, _productDocumentId_initializers, void 0);
            this.vendorId = (__runInitializers(this, _productDocumentId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.urnNo = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.renewalCycleId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
            this.eoiNo = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
            this.documentForm = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _documentForm_initializers, void 0));
            this.documentFormSubsection = (__runInitializers(this, _documentForm_extraInitializers), __runInitializers(this, _documentFormSubsection_initializers, void 0));
            this.formPrimaryId = (__runInitializers(this, _documentFormSubsection_extraInitializers), __runInitializers(this, _formPrimaryId_initializers, void 0));
            this.documentName = (__runInitializers(this, _formPrimaryId_extraInitializers), __runInitializers(this, _documentName_initializers, void 0));
            this.documentOriginalName = (__runInitializers(this, _documentName_extraInitializers), __runInitializers(this, _documentOriginalName_initializers, void 0));
            this.documentLink = (__runInitializers(this, _documentOriginalName_extraInitializers), __runInitializers(this, _documentLink_initializers, void 0));
            this.documentTag = (__runInitializers(this, _documentLink_extraInitializers), __runInitializers(this, _documentTag_initializers, void 0));
            this.createdDate = (__runInitializers(this, _documentTag_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            this.isDeleted = (__runInitializers(this, _updatedDate_extraInitializers), __runInitializers(this, _isDeleted_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _isDeleted_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.deletedBy = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _deletedBy_initializers, void 0));
            __runInitializers(this, _deletedBy_extraInitializers);
        }
        return AllRenewProductDocument_1;
    }());
    __setFunctionName(_classThis, "AllRenewProductDocument");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _productDocumentId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true, index: true })];
        _renewalCycleId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'RenewalCycle', index: true })];
        _eoiNo_decorators = [(0, mongoose_1.Prop)()];
        _documentForm_decorators = [(0, mongoose_1.Prop)({ required: true, enum: document_section_key_constants_1.DOCUMENT_SECTION_KEY_VALUES })];
        _documentFormSubsection_decorators = [(0, mongoose_1.Prop)()];
        _formPrimaryId_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _documentName_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _documentOriginalName_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _documentLink_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _documentTag_decorators = [(0, mongoose_1.Prop)({ required: false, enum: ['tech', 'process', 'social'] })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _isDeleted_decorators = [(0, mongoose_1.Prop)({ default: false })];
        _deletedAt_decorators = [(0, mongoose_1.Prop)()];
        _deletedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor' })];
        __esDecorate(null, null, _productDocumentId_decorators, { kind: "field", name: "productDocumentId", static: false, private: false, access: { has: function (obj) { return "productDocumentId" in obj; }, get: function (obj) { return obj.productDocumentId; }, set: function (obj, value) { obj.productDocumentId = value; } }, metadata: _metadata }, _productDocumentId_initializers, _productDocumentId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
        __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
        __esDecorate(null, null, _documentForm_decorators, { kind: "field", name: "documentForm", static: false, private: false, access: { has: function (obj) { return "documentForm" in obj; }, get: function (obj) { return obj.documentForm; }, set: function (obj, value) { obj.documentForm = value; } }, metadata: _metadata }, _documentForm_initializers, _documentForm_extraInitializers);
        __esDecorate(null, null, _documentFormSubsection_decorators, { kind: "field", name: "documentFormSubsection", static: false, private: false, access: { has: function (obj) { return "documentFormSubsection" in obj; }, get: function (obj) { return obj.documentFormSubsection; }, set: function (obj, value) { obj.documentFormSubsection = value; } }, metadata: _metadata }, _documentFormSubsection_initializers, _documentFormSubsection_extraInitializers);
        __esDecorate(null, null, _formPrimaryId_decorators, { kind: "field", name: "formPrimaryId", static: false, private: false, access: { has: function (obj) { return "formPrimaryId" in obj; }, get: function (obj) { return obj.formPrimaryId; }, set: function (obj, value) { obj.formPrimaryId = value; } }, metadata: _metadata }, _formPrimaryId_initializers, _formPrimaryId_extraInitializers);
        __esDecorate(null, null, _documentName_decorators, { kind: "field", name: "documentName", static: false, private: false, access: { has: function (obj) { return "documentName" in obj; }, get: function (obj) { return obj.documentName; }, set: function (obj, value) { obj.documentName = value; } }, metadata: _metadata }, _documentName_initializers, _documentName_extraInitializers);
        __esDecorate(null, null, _documentOriginalName_decorators, { kind: "field", name: "documentOriginalName", static: false, private: false, access: { has: function (obj) { return "documentOriginalName" in obj; }, get: function (obj) { return obj.documentOriginalName; }, set: function (obj, value) { obj.documentOriginalName = value; } }, metadata: _metadata }, _documentOriginalName_initializers, _documentOriginalName_extraInitializers);
        __esDecorate(null, null, _documentLink_decorators, { kind: "field", name: "documentLink", static: false, private: false, access: { has: function (obj) { return "documentLink" in obj; }, get: function (obj) { return obj.documentLink; }, set: function (obj, value) { obj.documentLink = value; } }, metadata: _metadata }, _documentLink_initializers, _documentLink_extraInitializers);
        __esDecorate(null, null, _documentTag_decorators, { kind: "field", name: "documentTag", static: false, private: false, access: { has: function (obj) { return "documentTag" in obj; }, get: function (obj) { return obj.documentTag; }, set: function (obj, value) { obj.documentTag = value; } }, metadata: _metadata }, _documentTag_initializers, _documentTag_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, null, _isDeleted_decorators, { kind: "field", name: "isDeleted", static: false, private: false, access: { has: function (obj) { return "isDeleted" in obj; }, get: function (obj) { return obj.isDeleted; }, set: function (obj, value) { obj.isDeleted = value; } }, metadata: _metadata }, _isDeleted_initializers, _isDeleted_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: function (obj) { return "deletedAt" in obj; }, get: function (obj) { return obj.deletedAt; }, set: function (obj, value) { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _deletedBy_decorators, { kind: "field", name: "deletedBy", static: false, private: false, access: { has: function (obj) { return "deletedBy" in obj; }, get: function (obj) { return obj.deletedBy; }, set: function (obj, value) { obj.deletedBy = value; } }, metadata: _metadata }, _deletedBy_initializers, _deletedBy_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AllRenewProductDocument = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AllRenewProductDocument = _classThis;
}();
exports.AllRenewProductDocument = AllRenewProductDocument;
exports.AllRenewProductDocumentSchema = mongoose_1.SchemaFactory.createForClass(AllRenewProductDocument);
