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
exports.ProcessWasteManagementSchema = exports.ProcessWasteManagement = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProcessWasteManagement = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'process_waste_management', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _processWasteManagementId_decorators;
    var _processWasteManagementId_initializers = [];
    var _processWasteManagementId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _wmImplementationDetails_decorators;
    var _wmImplementationDetails_initializers = [];
    var _wmImplementationDetails_extraInitializers = [];
    var _wmSupportingDocuments_decorators;
    var _wmSupportingDocuments_initializers = [];
    var _wmSupportingDocuments_extraInitializers = [];
    var _processWasteManagementStatus_decorators;
    var _processWasteManagementStatus_initializers = [];
    var _processWasteManagementStatus_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var ProcessWasteManagement = _classThis = /** @class */ (function () {
        function ProcessWasteManagement_1() {
            this.processWasteManagementId = __runInitializers(this, _processWasteManagementId_initializers, void 0);
            this.vendorId = (__runInitializers(this, _processWasteManagementId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.urnNo = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.wmImplementationDetails = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _wmImplementationDetails_initializers, void 0));
            this.wmSupportingDocuments = (__runInitializers(this, _wmImplementationDetails_extraInitializers), __runInitializers(this, _wmSupportingDocuments_initializers, void 0)); // 0=No File Available, 1=File Available
            this.processWasteManagementStatus = (__runInitializers(this, _wmSupportingDocuments_extraInitializers), __runInitializers(this, _processWasteManagementStatus_initializers, void 0)); // 0=Pending, 1=Completed
            this.createdDate = (__runInitializers(this, _processWasteManagementStatus_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return ProcessWasteManagement_1;
    }());
    __setFunctionName(_classThis, "ProcessWasteManagement");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processWasteManagementId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _wmImplementationDetails_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _wmSupportingDocuments_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number, default: null })];
        _processWasteManagementStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _processWasteManagementId_decorators, { kind: "field", name: "processWasteManagementId", static: false, private: false, access: { has: function (obj) { return "processWasteManagementId" in obj; }, get: function (obj) { return obj.processWasteManagementId; }, set: function (obj, value) { obj.processWasteManagementId = value; } }, metadata: _metadata }, _processWasteManagementId_initializers, _processWasteManagementId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _wmImplementationDetails_decorators, { kind: "field", name: "wmImplementationDetails", static: false, private: false, access: { has: function (obj) { return "wmImplementationDetails" in obj; }, get: function (obj) { return obj.wmImplementationDetails; }, set: function (obj, value) { obj.wmImplementationDetails = value; } }, metadata: _metadata }, _wmImplementationDetails_initializers, _wmImplementationDetails_extraInitializers);
        __esDecorate(null, null, _wmSupportingDocuments_decorators, { kind: "field", name: "wmSupportingDocuments", static: false, private: false, access: { has: function (obj) { return "wmSupportingDocuments" in obj; }, get: function (obj) { return obj.wmSupportingDocuments; }, set: function (obj, value) { obj.wmSupportingDocuments = value; } }, metadata: _metadata }, _wmSupportingDocuments_initializers, _wmSupportingDocuments_extraInitializers);
        __esDecorate(null, null, _processWasteManagementStatus_decorators, { kind: "field", name: "processWasteManagementStatus", static: false, private: false, access: { has: function (obj) { return "processWasteManagementStatus" in obj; }, get: function (obj) { return obj.processWasteManagementStatus; }, set: function (obj, value) { obj.processWasteManagementStatus = value; } }, metadata: _metadata }, _processWasteManagementStatus_initializers, _processWasteManagementStatus_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessWasteManagement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessWasteManagement = _classThis;
}();
exports.ProcessWasteManagement = ProcessWasteManagement;
exports.ProcessWasteManagementSchema = mongoose_1.SchemaFactory.createForClass(ProcessWasteManagement);
exports.ProcessWasteManagementSchema.index({ urnNo: 1 }, { unique: true, name: 'uniq_process_waste_management_urn' });
