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
exports.ProductDesignSchema = exports.ProductDesign = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProductDesign = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'process_product_design', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _productDesignId_decorators;
    var _productDesignId_initializers = [];
    var _productDesignId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _ecoVisionUpload_decorators;
    var _ecoVisionUpload_initializers = [];
    var _ecoVisionUpload_extraInitializers = [];
    var _statergies_decorators;
    var _statergies_initializers = [];
    var _statergies_extraInitializers = [];
    var _productDesignSupportingDocument_decorators;
    var _productDesignSupportingDocument_initializers = [];
    var _productDesignSupportingDocument_extraInitializers = [];
    var _productDesignStatus_decorators;
    var _productDesignStatus_initializers = [];
    var _productDesignStatus_extraInitializers = [];
    var _measuresAndBenefits_decorators;
    var _measuresAndBenefits_initializers = [];
    var _measuresAndBenefits_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var ProductDesign = _classThis = /** @class */ (function () {
        function ProductDesign_1() {
            this.productDesignId = __runInitializers(this, _productDesignId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _productDesignId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.vendorId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.ecoVisionUpload = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _ecoVisionUpload_initializers, void 0)); // 0=No File Available, 1=File Available
            this.statergies = (__runInitializers(this, _ecoVisionUpload_extraInitializers), __runInitializers(this, _statergies_initializers, void 0));
            this.productDesignSupportingDocument = (__runInitializers(this, _statergies_extraInitializers), __runInitializers(this, _productDesignSupportingDocument_initializers, void 0)); // 0=No File Available, 1=File Available
            this.productDesignStatus = (__runInitializers(this, _productDesignSupportingDocument_extraInitializers), __runInitializers(this, _productDesignStatus_initializers, void 0)); // 0=Pending, 1=Completed
            this.measuresAndBenefits = (__runInitializers(this, _productDesignStatus_extraInitializers), __runInitializers(this, _measuresAndBenefits_initializers, void 0));
            this.createdDate = (__runInitializers(this, _measuresAndBenefits_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return ProductDesign_1;
    }());
    __setFunctionName(_classThis, "ProductDesign");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _productDesignId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _ecoVisionUpload_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number, default: null })];
        _statergies_decorators = [(0, mongoose_1.Prop)()];
        _productDesignSupportingDocument_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number, default: null })];
        _productDesignStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _measuresAndBenefits_decorators = [(0, mongoose_1.Prop)({
                type: [
                    {
                        measuresImplemented: { type: String },
                        benefitsAchieved: { type: String },
                    },
                ],
                default: [],
                required: false,
            })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _productDesignId_decorators, { kind: "field", name: "productDesignId", static: false, private: false, access: { has: function (obj) { return "productDesignId" in obj; }, get: function (obj) { return obj.productDesignId; }, set: function (obj, value) { obj.productDesignId = value; } }, metadata: _metadata }, _productDesignId_initializers, _productDesignId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _ecoVisionUpload_decorators, { kind: "field", name: "ecoVisionUpload", static: false, private: false, access: { has: function (obj) { return "ecoVisionUpload" in obj; }, get: function (obj) { return obj.ecoVisionUpload; }, set: function (obj, value) { obj.ecoVisionUpload = value; } }, metadata: _metadata }, _ecoVisionUpload_initializers, _ecoVisionUpload_extraInitializers);
        __esDecorate(null, null, _statergies_decorators, { kind: "field", name: "statergies", static: false, private: false, access: { has: function (obj) { return "statergies" in obj; }, get: function (obj) { return obj.statergies; }, set: function (obj, value) { obj.statergies = value; } }, metadata: _metadata }, _statergies_initializers, _statergies_extraInitializers);
        __esDecorate(null, null, _productDesignSupportingDocument_decorators, { kind: "field", name: "productDesignSupportingDocument", static: false, private: false, access: { has: function (obj) { return "productDesignSupportingDocument" in obj; }, get: function (obj) { return obj.productDesignSupportingDocument; }, set: function (obj, value) { obj.productDesignSupportingDocument = value; } }, metadata: _metadata }, _productDesignSupportingDocument_initializers, _productDesignSupportingDocument_extraInitializers);
        __esDecorate(null, null, _productDesignStatus_decorators, { kind: "field", name: "productDesignStatus", static: false, private: false, access: { has: function (obj) { return "productDesignStatus" in obj; }, get: function (obj) { return obj.productDesignStatus; }, set: function (obj, value) { obj.productDesignStatus = value; } }, metadata: _metadata }, _productDesignStatus_initializers, _productDesignStatus_extraInitializers);
        __esDecorate(null, null, _measuresAndBenefits_decorators, { kind: "field", name: "measuresAndBenefits", static: false, private: false, access: { has: function (obj) { return "measuresAndBenefits" in obj; }, get: function (obj) { return obj.measuresAndBenefits; }, set: function (obj, value) { obj.measuresAndBenefits = value; } }, metadata: _metadata }, _measuresAndBenefits_initializers, _measuresAndBenefits_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductDesign = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductDesign = _classThis;
}();
exports.ProductDesign = ProductDesign;
exports.ProductDesignSchema = mongoose_1.SchemaFactory.createForClass(ProductDesign);
exports.ProductDesignSchema.index({ urnNo: 1, vendorId: 1 }, { unique: true, name: 'uniq_product_design_per_vendor_urn' });
