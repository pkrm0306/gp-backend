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
exports.ProcessRenewPsStakeholderEduAwarnessSchema = exports.ProcessRenewPsStakeholderEduAwarness = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProcessRenewPsStakeholderEduAwarness = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            collection: 'process_renew_ps_stakeholder_edu_awarness',
            timestamps: false,
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _processRenewPsStakeholderEduAwarnessId_decorators;
    var _processRenewPsStakeholderEduAwarnessId_initializers = [];
    var _processRenewPsStakeholderEduAwarnessId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _processRenewProductStewardshipId_decorators;
    var _processRenewProductStewardshipId_initializers = [];
    var _processRenewProductStewardshipId_extraInitializers = [];
    var _seaProgramDetails_decorators;
    var _seaProgramDetails_initializers = [];
    var _seaProgramDetails_extraInitializers = [];
    var _seaNoOfPrograms_decorators;
    var _seaNoOfPrograms_initializers = [];
    var _seaNoOfPrograms_extraInitializers = [];
    var _seaSupportingDocuments_decorators;
    var _seaSupportingDocuments_initializers = [];
    var _seaSupportingDocuments_extraInitializers = [];
    var _productStewardshipStatus_decorators;
    var _productStewardshipStatus_initializers = [];
    var _productStewardshipStatus_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var _isDeleted_decorators;
    var _isDeleted_initializers = [];
    var _isDeleted_extraInitializers = [];
    var ProcessRenewPsStakeholderEduAwarness = _classThis = /** @class */ (function () {
        function ProcessRenewPsStakeholderEduAwarness_1() {
            this.processRenewPsStakeholderEduAwarnessId = __runInitializers(this, _processRenewPsStakeholderEduAwarnessId_initializers, void 0);
            this.vendorId = (__runInitializers(this, _processRenewPsStakeholderEduAwarnessId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.urnNo = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.processRenewProductStewardshipId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _processRenewProductStewardshipId_initializers, void 0));
            this.seaProgramDetails = (__runInitializers(this, _processRenewProductStewardshipId_extraInitializers), __runInitializers(this, _seaProgramDetails_initializers, void 0));
            this.seaNoOfPrograms = (__runInitializers(this, _seaProgramDetails_extraInitializers), __runInitializers(this, _seaNoOfPrograms_initializers, void 0));
            this.seaSupportingDocuments = (__runInitializers(this, _seaNoOfPrograms_extraInitializers), __runInitializers(this, _seaSupportingDocuments_initializers, void 0));
            this.productStewardshipStatus = (__runInitializers(this, _seaSupportingDocuments_extraInitializers), __runInitializers(this, _productStewardshipStatus_initializers, void 0));
            this.createdDate = (__runInitializers(this, _productStewardshipStatus_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            this.isDeleted = (__runInitializers(this, _updatedDate_extraInitializers), __runInitializers(this, _isDeleted_initializers, void 0));
            __runInitializers(this, _isDeleted_extraInitializers);
        }
        return ProcessRenewPsStakeholderEduAwarness_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewPsStakeholderEduAwarness");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processRenewPsStakeholderEduAwarnessId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _processRenewProductStewardshipId_decorators = [(0, mongoose_1.Prop)({
                type: mongoose_2.Types.ObjectId,
                ref: 'ProcessRenewProductStewardship',
                required: true,
            })];
        _seaProgramDetails_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _seaNoOfPrograms_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _seaSupportingDocuments_decorators = [(0, mongoose_1.Prop)({ type: Number, default: 0 })];
        _productStewardshipStatus_decorators = [(0, mongoose_1.Prop)({ type: Number, default: 0 })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _isDeleted_decorators = [(0, mongoose_1.Prop)({ type: Boolean, default: false })];
        __esDecorate(null, null, _processRenewPsStakeholderEduAwarnessId_decorators, { kind: "field", name: "processRenewPsStakeholderEduAwarnessId", static: false, private: false, access: { has: function (obj) { return "processRenewPsStakeholderEduAwarnessId" in obj; }, get: function (obj) { return obj.processRenewPsStakeholderEduAwarnessId; }, set: function (obj, value) { obj.processRenewPsStakeholderEduAwarnessId = value; } }, metadata: _metadata }, _processRenewPsStakeholderEduAwarnessId_initializers, _processRenewPsStakeholderEduAwarnessId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _processRenewProductStewardshipId_decorators, { kind: "field", name: "processRenewProductStewardshipId", static: false, private: false, access: { has: function (obj) { return "processRenewProductStewardshipId" in obj; }, get: function (obj) { return obj.processRenewProductStewardshipId; }, set: function (obj, value) { obj.processRenewProductStewardshipId = value; } }, metadata: _metadata }, _processRenewProductStewardshipId_initializers, _processRenewProductStewardshipId_extraInitializers);
        __esDecorate(null, null, _seaProgramDetails_decorators, { kind: "field", name: "seaProgramDetails", static: false, private: false, access: { has: function (obj) { return "seaProgramDetails" in obj; }, get: function (obj) { return obj.seaProgramDetails; }, set: function (obj, value) { obj.seaProgramDetails = value; } }, metadata: _metadata }, _seaProgramDetails_initializers, _seaProgramDetails_extraInitializers);
        __esDecorate(null, null, _seaNoOfPrograms_decorators, { kind: "field", name: "seaNoOfPrograms", static: false, private: false, access: { has: function (obj) { return "seaNoOfPrograms" in obj; }, get: function (obj) { return obj.seaNoOfPrograms; }, set: function (obj, value) { obj.seaNoOfPrograms = value; } }, metadata: _metadata }, _seaNoOfPrograms_initializers, _seaNoOfPrograms_extraInitializers);
        __esDecorate(null, null, _seaSupportingDocuments_decorators, { kind: "field", name: "seaSupportingDocuments", static: false, private: false, access: { has: function (obj) { return "seaSupportingDocuments" in obj; }, get: function (obj) { return obj.seaSupportingDocuments; }, set: function (obj, value) { obj.seaSupportingDocuments = value; } }, metadata: _metadata }, _seaSupportingDocuments_initializers, _seaSupportingDocuments_extraInitializers);
        __esDecorate(null, null, _productStewardshipStatus_decorators, { kind: "field", name: "productStewardshipStatus", static: false, private: false, access: { has: function (obj) { return "productStewardshipStatus" in obj; }, get: function (obj) { return obj.productStewardshipStatus; }, set: function (obj, value) { obj.productStewardshipStatus = value; } }, metadata: _metadata }, _productStewardshipStatus_initializers, _productStewardshipStatus_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, null, _isDeleted_decorators, { kind: "field", name: "isDeleted", static: false, private: false, access: { has: function (obj) { return "isDeleted" in obj; }, get: function (obj) { return obj.isDeleted; }, set: function (obj, value) { obj.isDeleted = value; } }, metadata: _metadata }, _isDeleted_initializers, _isDeleted_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewPsStakeholderEduAwarness = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewPsStakeholderEduAwarness = _classThis;
}();
exports.ProcessRenewPsStakeholderEduAwarness = ProcessRenewPsStakeholderEduAwarness;
exports.ProcessRenewPsStakeholderEduAwarnessSchema = mongoose_1.SchemaFactory.createForClass(ProcessRenewPsStakeholderEduAwarness);
exports.ProcessRenewPsStakeholderEduAwarnessSchema.index({ urnNo: 1, vendorId: 1, isDeleted: 1 }, { name: 'idx_renew_ps_stakeholder_urn_vendor_active' });
