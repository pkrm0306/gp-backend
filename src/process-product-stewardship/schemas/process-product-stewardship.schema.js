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
exports.ProcessProductStewardshipSchema = exports.ProcessProductStewardship = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProcessProductStewardship = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'process_product_stewardship', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _processProductStewardshipId_decorators;
    var _processProductStewardshipId_initializers = [];
    var _processProductStewardshipId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _seaSupportingDocuments_decorators;
    var _seaSupportingDocuments_initializers = [];
    var _seaSupportingDocuments_extraInitializers = [];
    var _qualityManagementDetails_decorators;
    var _qualityManagementDetails_initializers = [];
    var _qualityManagementDetails_extraInitializers = [];
    var _qmSupportingDocuments_decorators;
    var _qmSupportingDocuments_initializers = [];
    var _qmSupportingDocuments_extraInitializers = [];
    var _eprImplementedDetails_decorators;
    var _eprImplementedDetails_initializers = [];
    var _eprImplementedDetails_extraInitializers = [];
    var _eprGreenPackagingDetails_decorators;
    var _eprGreenPackagingDetails_initializers = [];
    var _eprGreenPackagingDetails_extraInitializers = [];
    var _eprSupportingDocuments_decorators;
    var _eprSupportingDocuments_initializers = [];
    var _eprSupportingDocuments_extraInitializers = [];
    var _productStewardshipStatus_decorators;
    var _productStewardshipStatus_initializers = [];
    var _productStewardshipStatus_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var ProcessProductStewardship = _classThis = /** @class */ (function () {
        function ProcessProductStewardship_1() {
            this.processProductStewardshipId = __runInitializers(this, _processProductStewardshipId_initializers, void 0);
            this.vendorId = (__runInitializers(this, _processProductStewardshipId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.urnNo = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.seaSupportingDocuments = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _seaSupportingDocuments_initializers, void 0)); // 0=No File Available, 1=File Available
            this.qualityManagementDetails = (__runInitializers(this, _seaSupportingDocuments_extraInitializers), __runInitializers(this, _qualityManagementDetails_initializers, void 0));
            this.qmSupportingDocuments = (__runInitializers(this, _qualityManagementDetails_extraInitializers), __runInitializers(this, _qmSupportingDocuments_initializers, void 0)); // 0=No File Available, 1=File Available
            this.eprImplementedDetails = (__runInitializers(this, _qmSupportingDocuments_extraInitializers), __runInitializers(this, _eprImplementedDetails_initializers, void 0));
            this.eprGreenPackagingDetails = (__runInitializers(this, _eprImplementedDetails_extraInitializers), __runInitializers(this, _eprGreenPackagingDetails_initializers, void 0));
            this.eprSupportingDocuments = (__runInitializers(this, _eprGreenPackagingDetails_extraInitializers), __runInitializers(this, _eprSupportingDocuments_initializers, void 0)); // 0=No File Available, 1=File Available
            this.productStewardshipStatus = (__runInitializers(this, _eprSupportingDocuments_extraInitializers), __runInitializers(this, _productStewardshipStatus_initializers, void 0)); // 0=Pending, 1=Completed
            this.createdDate = (__runInitializers(this, _productStewardshipStatus_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return ProcessProductStewardship_1;
    }());
    __setFunctionName(_classThis, "ProcessProductStewardship");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processProductStewardshipId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _seaSupportingDocuments_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number, default: null })];
        _qualityManagementDetails_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _qmSupportingDocuments_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number, default: null })];
        _eprImplementedDetails_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _eprGreenPackagingDetails_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _eprSupportingDocuments_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number, default: null })];
        _productStewardshipStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _processProductStewardshipId_decorators, { kind: "field", name: "processProductStewardshipId", static: false, private: false, access: { has: function (obj) { return "processProductStewardshipId" in obj; }, get: function (obj) { return obj.processProductStewardshipId; }, set: function (obj, value) { obj.processProductStewardshipId = value; } }, metadata: _metadata }, _processProductStewardshipId_initializers, _processProductStewardshipId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _seaSupportingDocuments_decorators, { kind: "field", name: "seaSupportingDocuments", static: false, private: false, access: { has: function (obj) { return "seaSupportingDocuments" in obj; }, get: function (obj) { return obj.seaSupportingDocuments; }, set: function (obj, value) { obj.seaSupportingDocuments = value; } }, metadata: _metadata }, _seaSupportingDocuments_initializers, _seaSupportingDocuments_extraInitializers);
        __esDecorate(null, null, _qualityManagementDetails_decorators, { kind: "field", name: "qualityManagementDetails", static: false, private: false, access: { has: function (obj) { return "qualityManagementDetails" in obj; }, get: function (obj) { return obj.qualityManagementDetails; }, set: function (obj, value) { obj.qualityManagementDetails = value; } }, metadata: _metadata }, _qualityManagementDetails_initializers, _qualityManagementDetails_extraInitializers);
        __esDecorate(null, null, _qmSupportingDocuments_decorators, { kind: "field", name: "qmSupportingDocuments", static: false, private: false, access: { has: function (obj) { return "qmSupportingDocuments" in obj; }, get: function (obj) { return obj.qmSupportingDocuments; }, set: function (obj, value) { obj.qmSupportingDocuments = value; } }, metadata: _metadata }, _qmSupportingDocuments_initializers, _qmSupportingDocuments_extraInitializers);
        __esDecorate(null, null, _eprImplementedDetails_decorators, { kind: "field", name: "eprImplementedDetails", static: false, private: false, access: { has: function (obj) { return "eprImplementedDetails" in obj; }, get: function (obj) { return obj.eprImplementedDetails; }, set: function (obj, value) { obj.eprImplementedDetails = value; } }, metadata: _metadata }, _eprImplementedDetails_initializers, _eprImplementedDetails_extraInitializers);
        __esDecorate(null, null, _eprGreenPackagingDetails_decorators, { kind: "field", name: "eprGreenPackagingDetails", static: false, private: false, access: { has: function (obj) { return "eprGreenPackagingDetails" in obj; }, get: function (obj) { return obj.eprGreenPackagingDetails; }, set: function (obj, value) { obj.eprGreenPackagingDetails = value; } }, metadata: _metadata }, _eprGreenPackagingDetails_initializers, _eprGreenPackagingDetails_extraInitializers);
        __esDecorate(null, null, _eprSupportingDocuments_decorators, { kind: "field", name: "eprSupportingDocuments", static: false, private: false, access: { has: function (obj) { return "eprSupportingDocuments" in obj; }, get: function (obj) { return obj.eprSupportingDocuments; }, set: function (obj, value) { obj.eprSupportingDocuments = value; } }, metadata: _metadata }, _eprSupportingDocuments_initializers, _eprSupportingDocuments_extraInitializers);
        __esDecorate(null, null, _productStewardshipStatus_decorators, { kind: "field", name: "productStewardshipStatus", static: false, private: false, access: { has: function (obj) { return "productStewardshipStatus" in obj; }, get: function (obj) { return obj.productStewardshipStatus; }, set: function (obj, value) { obj.productStewardshipStatus = value; } }, metadata: _metadata }, _productStewardshipStatus_initializers, _productStewardshipStatus_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessProductStewardship = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessProductStewardship = _classThis;
}();
exports.ProcessProductStewardship = ProcessProductStewardship;
exports.ProcessProductStewardshipSchema = mongoose_1.SchemaFactory.createForClass(ProcessProductStewardship);
exports.ProcessProductStewardshipSchema.index({ urnNo: 1 }, { unique: true, name: 'uniq_process_product_stewardship_urn' });
