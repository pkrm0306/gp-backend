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
exports.ProductPerformanceSchema = exports.ProductPerformance = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProductPerformance = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'process_product_performance', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _processProductPerformanceId_decorators;
    var _processProductPerformanceId_initializers = [];
    var _processProductPerformanceId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _testReportFiles_decorators;
    var _testReportFiles_initializers = [];
    var _testReportFiles_extraInitializers = [];
    var _testReports_decorators;
    var _testReports_initializers = [];
    var _testReports_extraInitializers = [];
    var _renewalType_decorators;
    var _renewalType_initializers = [];
    var _renewalType_extraInitializers = [];
    var _productPerformanceStatus_decorators;
    var _productPerformanceStatus_initializers = [];
    var _productPerformanceStatus_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var ProductPerformance = _classThis = /** @class */ (function () {
        function ProductPerformance_1() {
            this.processProductPerformanceId = __runInitializers(this, _processProductPerformanceId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _processProductPerformanceId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.vendorId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.testReportFiles = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _testReportFiles_initializers, void 0));
            this.testReports = (__runInitializers(this, _testReportFiles_extraInitializers), __runInitializers(this, _testReports_initializers, void 0));
            this.renewalType = (__runInitializers(this, _testReports_extraInitializers), __runInitializers(this, _renewalType_initializers, void 0)); // 0=Not Renewed, >0 = Renewed no of times
            this.productPerformanceStatus = (__runInitializers(this, _renewalType_extraInitializers), __runInitializers(this, _productPerformanceStatus_initializers, void 0)); // 0=Pending, 1=Completed
            this.createdDate = (__runInitializers(this, _productPerformanceStatus_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return ProductPerformance_1;
    }());
    __setFunctionName(_classThis, "ProductPerformance");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processProductPerformanceId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _testReportFiles_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number, default: null })];
        _testReports_decorators = [(0, mongoose_1.Prop)({
                type: [
                    {
                        productName: { type: String },
                        testReportFileName: { type: String },
                    },
                ],
                default: [],
                required: false,
            })];
        _renewalType_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number, default: null })];
        _productPerformanceStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _processProductPerformanceId_decorators, { kind: "field", name: "processProductPerformanceId", static: false, private: false, access: { has: function (obj) { return "processProductPerformanceId" in obj; }, get: function (obj) { return obj.processProductPerformanceId; }, set: function (obj, value) { obj.processProductPerformanceId = value; } }, metadata: _metadata }, _processProductPerformanceId_initializers, _processProductPerformanceId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _testReportFiles_decorators, { kind: "field", name: "testReportFiles", static: false, private: false, access: { has: function (obj) { return "testReportFiles" in obj; }, get: function (obj) { return obj.testReportFiles; }, set: function (obj, value) { obj.testReportFiles = value; } }, metadata: _metadata }, _testReportFiles_initializers, _testReportFiles_extraInitializers);
        __esDecorate(null, null, _testReports_decorators, { kind: "field", name: "testReports", static: false, private: false, access: { has: function (obj) { return "testReports" in obj; }, get: function (obj) { return obj.testReports; }, set: function (obj, value) { obj.testReports = value; } }, metadata: _metadata }, _testReports_initializers, _testReports_extraInitializers);
        __esDecorate(null, null, _renewalType_decorators, { kind: "field", name: "renewalType", static: false, private: false, access: { has: function (obj) { return "renewalType" in obj; }, get: function (obj) { return obj.renewalType; }, set: function (obj, value) { obj.renewalType = value; } }, metadata: _metadata }, _renewalType_initializers, _renewalType_extraInitializers);
        __esDecorate(null, null, _productPerformanceStatus_decorators, { kind: "field", name: "productPerformanceStatus", static: false, private: false, access: { has: function (obj) { return "productPerformanceStatus" in obj; }, get: function (obj) { return obj.productPerformanceStatus; }, set: function (obj, value) { obj.productPerformanceStatus = value; } }, metadata: _metadata }, _productPerformanceStatus_initializers, _productPerformanceStatus_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductPerformance = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductPerformance = _classThis;
}();
exports.ProductPerformance = ProductPerformance;
exports.ProductPerformanceSchema = mongoose_1.SchemaFactory.createForClass(ProductPerformance);
exports.ProductPerformanceSchema.index({ urnNo: 1, vendorId: 1 }, { unique: true, name: 'uniq_product_performance_per_vendor_urn' });
