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
exports.ProcessRenewPpTestReportSchema = exports.ProcessRenewPpTestReport = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProcessRenewPpTestReport = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'process_renew_pp_test_reports', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _processRenewProductPerformanceTestReportId_decorators;
    var _processRenewProductPerformanceTestReportId_initializers = [];
    var _processRenewProductPerformanceTestReportId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _processRenewProductPerformanceId_decorators;
    var _processRenewProductPerformanceId_initializers = [];
    var _processRenewProductPerformanceId_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _productName_decorators;
    var _productName_initializers = [];
    var _productName_extraInitializers = [];
    var _testReportFileName_decorators;
    var _testReportFileName_initializers = [];
    var _testReportFileName_extraInitializers = [];
    var _normalizedProductName_decorators;
    var _normalizedProductName_initializers = [];
    var _normalizedProductName_extraInitializers = [];
    var _normalizedTestReportFileName_decorators;
    var _normalizedTestReportFileName_initializers = [];
    var _normalizedTestReportFileName_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var ProcessRenewPpTestReport = _classThis = /** @class */ (function () {
        function ProcessRenewPpTestReport_1() {
            this.processRenewProductPerformanceTestReportId = __runInitializers(this, _processRenewProductPerformanceTestReportId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _processRenewProductPerformanceTestReportId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.renewalCycleId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
            this.vendorId = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.processRenewProductPerformanceId = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _processRenewProductPerformanceId_initializers, void 0));
            this.eoiNo = (__runInitializers(this, _processRenewProductPerformanceId_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
            this.productName = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _productName_initializers, void 0));
            this.testReportFileName = (__runInitializers(this, _productName_extraInitializers), __runInitializers(this, _testReportFileName_initializers, void 0));
            this.normalizedProductName = (__runInitializers(this, _testReportFileName_extraInitializers), __runInitializers(this, _normalizedProductName_initializers, void 0));
            this.normalizedTestReportFileName = (__runInitializers(this, _normalizedProductName_extraInitializers), __runInitializers(this, _normalizedTestReportFileName_initializers, void 0));
            this.createdDate = (__runInitializers(this, _normalizedTestReportFileName_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return ProcessRenewPpTestReport_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewPpTestReport");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processRenewProductPerformanceTestReportId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true, index: true })];
        _renewalCycleId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'RenewalCycle', required: true, index: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: true })];
        _processRenewProductPerformanceId_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _eoiNo_decorators = [(0, mongoose_1.Prop)()];
        _productName_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _testReportFileName_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _normalizedProductName_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _normalizedTestReportFileName_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _processRenewProductPerformanceTestReportId_decorators, { kind: "field", name: "processRenewProductPerformanceTestReportId", static: false, private: false, access: { has: function (obj) { return "processRenewProductPerformanceTestReportId" in obj; }, get: function (obj) { return obj.processRenewProductPerformanceTestReportId; }, set: function (obj, value) { obj.processRenewProductPerformanceTestReportId = value; } }, metadata: _metadata }, _processRenewProductPerformanceTestReportId_initializers, _processRenewProductPerformanceTestReportId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _processRenewProductPerformanceId_decorators, { kind: "field", name: "processRenewProductPerformanceId", static: false, private: false, access: { has: function (obj) { return "processRenewProductPerformanceId" in obj; }, get: function (obj) { return obj.processRenewProductPerformanceId; }, set: function (obj, value) { obj.processRenewProductPerformanceId = value; } }, metadata: _metadata }, _processRenewProductPerformanceId_initializers, _processRenewProductPerformanceId_extraInitializers);
        __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
        __esDecorate(null, null, _productName_decorators, { kind: "field", name: "productName", static: false, private: false, access: { has: function (obj) { return "productName" in obj; }, get: function (obj) { return obj.productName; }, set: function (obj, value) { obj.productName = value; } }, metadata: _metadata }, _productName_initializers, _productName_extraInitializers);
        __esDecorate(null, null, _testReportFileName_decorators, { kind: "field", name: "testReportFileName", static: false, private: false, access: { has: function (obj) { return "testReportFileName" in obj; }, get: function (obj) { return obj.testReportFileName; }, set: function (obj, value) { obj.testReportFileName = value; } }, metadata: _metadata }, _testReportFileName_initializers, _testReportFileName_extraInitializers);
        __esDecorate(null, null, _normalizedProductName_decorators, { kind: "field", name: "normalizedProductName", static: false, private: false, access: { has: function (obj) { return "normalizedProductName" in obj; }, get: function (obj) { return obj.normalizedProductName; }, set: function (obj, value) { obj.normalizedProductName = value; } }, metadata: _metadata }, _normalizedProductName_initializers, _normalizedProductName_extraInitializers);
        __esDecorate(null, null, _normalizedTestReportFileName_decorators, { kind: "field", name: "normalizedTestReportFileName", static: false, private: false, access: { has: function (obj) { return "normalizedTestReportFileName" in obj; }, get: function (obj) { return obj.normalizedTestReportFileName; }, set: function (obj, value) { obj.normalizedTestReportFileName = value; } }, metadata: _metadata }, _normalizedTestReportFileName_initializers, _normalizedTestReportFileName_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewPpTestReport = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewPpTestReport = _classThis;
}();
exports.ProcessRenewPpTestReport = ProcessRenewPpTestReport;
exports.ProcessRenewPpTestReportSchema = mongoose_1.SchemaFactory.createForClass(ProcessRenewPpTestReport);
exports.ProcessRenewPpTestReportSchema.index({
    urnNo: 1,
    renewalCycleId: 1,
    normalizedProductName: 1,
    normalizedTestReportFileName: 1,
    eoiNo: 1,
}, { name: 'uniq_renew_pp_test_report_per_cycle_row' });
