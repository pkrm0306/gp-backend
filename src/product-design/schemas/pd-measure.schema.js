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
exports.PdMeasureSchema = exports.PdMeasure = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var PdMeasure = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'process_pd_measures', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _productDesignMeasureId_decorators;
    var _productDesignMeasureId_initializers = [];
    var _productDesignMeasureId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _productDesignId_decorators;
    var _productDesignId_initializers = [];
    var _productDesignId_extraInitializers = [];
    var _measures_decorators;
    var _measures_initializers = [];
    var _measures_extraInitializers = [];
    var _benefits_decorators;
    var _benefits_initializers = [];
    var _benefits_extraInitializers = [];
    var _normalizedMeasures_decorators;
    var _normalizedMeasures_initializers = [];
    var _normalizedMeasures_extraInitializers = [];
    var _normalizedBenefits_decorators;
    var _normalizedBenefits_initializers = [];
    var _normalizedBenefits_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var PdMeasure = _classThis = /** @class */ (function () {
        function PdMeasure_1() {
            this.productDesignMeasureId = __runInitializers(this, _productDesignMeasureId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _productDesignMeasureId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.vendorId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.productDesignId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _productDesignId_initializers, void 0));
            this.measures = (__runInitializers(this, _productDesignId_extraInitializers), __runInitializers(this, _measures_initializers, void 0));
            this.benefits = (__runInitializers(this, _measures_extraInitializers), __runInitializers(this, _benefits_initializers, void 0));
            /** Partial rows: only measures or only benefits may be filled (vendor UI). */
            // @Prop({ required: true })
            this.normalizedMeasures = (__runInitializers(this, _benefits_extraInitializers), __runInitializers(this, _normalizedMeasures_initializers, void 0));
            // @Prop({ required: true })
            this.normalizedBenefits = (__runInitializers(this, _normalizedMeasures_extraInitializers), __runInitializers(this, _normalizedBenefits_initializers, void 0));
            this.createdDate = (__runInitializers(this, _normalizedBenefits_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return PdMeasure_1;
    }());
    __setFunctionName(_classThis, "PdMeasure");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _productDesignMeasureId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _productDesignId_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _measures_decorators = [(0, mongoose_1.Prop)()];
        _benefits_decorators = [(0, mongoose_1.Prop)()];
        _normalizedMeasures_decorators = [(0, mongoose_1.Prop)({ required: false, default: '' })];
        _normalizedBenefits_decorators = [(0, mongoose_1.Prop)({ required: false, default: '' })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _productDesignMeasureId_decorators, { kind: "field", name: "productDesignMeasureId", static: false, private: false, access: { has: function (obj) { return "productDesignMeasureId" in obj; }, get: function (obj) { return obj.productDesignMeasureId; }, set: function (obj, value) { obj.productDesignMeasureId = value; } }, metadata: _metadata }, _productDesignMeasureId_initializers, _productDesignMeasureId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _productDesignId_decorators, { kind: "field", name: "productDesignId", static: false, private: false, access: { has: function (obj) { return "productDesignId" in obj; }, get: function (obj) { return obj.productDesignId; }, set: function (obj, value) { obj.productDesignId = value; } }, metadata: _metadata }, _productDesignId_initializers, _productDesignId_extraInitializers);
        __esDecorate(null, null, _measures_decorators, { kind: "field", name: "measures", static: false, private: false, access: { has: function (obj) { return "measures" in obj; }, get: function (obj) { return obj.measures; }, set: function (obj, value) { obj.measures = value; } }, metadata: _metadata }, _measures_initializers, _measures_extraInitializers);
        __esDecorate(null, null, _benefits_decorators, { kind: "field", name: "benefits", static: false, private: false, access: { has: function (obj) { return "benefits" in obj; }, get: function (obj) { return obj.benefits; }, set: function (obj, value) { obj.benefits = value; } }, metadata: _metadata }, _benefits_initializers, _benefits_extraInitializers);
        __esDecorate(null, null, _normalizedMeasures_decorators, { kind: "field", name: "normalizedMeasures", static: false, private: false, access: { has: function (obj) { return "normalizedMeasures" in obj; }, get: function (obj) { return obj.normalizedMeasures; }, set: function (obj, value) { obj.normalizedMeasures = value; } }, metadata: _metadata }, _normalizedMeasures_initializers, _normalizedMeasures_extraInitializers);
        __esDecorate(null, null, _normalizedBenefits_decorators, { kind: "field", name: "normalizedBenefits", static: false, private: false, access: { has: function (obj) { return "normalizedBenefits" in obj; }, get: function (obj) { return obj.normalizedBenefits; }, set: function (obj, value) { obj.normalizedBenefits = value; } }, metadata: _metadata }, _normalizedBenefits_initializers, _normalizedBenefits_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PdMeasure = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PdMeasure = _classThis;
}();
exports.PdMeasure = PdMeasure;
exports.PdMeasureSchema = mongoose_1.SchemaFactory.createForClass(PdMeasure);
exports.PdMeasureSchema.index({ urnNo: 1, normalizedMeasures: 1, normalizedBenefits: 1 }, { unique: true, name: 'uniq_pd_measure_per_urn_normalized_pair' });
