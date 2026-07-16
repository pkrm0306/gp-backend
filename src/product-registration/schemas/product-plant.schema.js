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
exports.ProductPlantSchema = exports.ProductPlant = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProductPlant = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'product_plants' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _productPlantId_decorators;
    var _productPlantId_initializers = [];
    var _productPlantId_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _plantName_decorators;
    var _plantName_initializers = [];
    var _plantName_extraInitializers = [];
    var _plantLocation_decorators;
    var _plantLocation_initializers = [];
    var _plantLocation_extraInitializers = [];
    var _countryId_decorators;
    var _countryId_initializers = [];
    var _countryId_extraInitializers = [];
    var _stateId_decorators;
    var _stateId_initializers = [];
    var _stateId_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _plantStatus_decorators;
    var _plantStatus_initializers = [];
    var _plantStatus_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _is_deleted_decorators;
    var _is_deleted_initializers = [];
    var _is_deleted_extraInitializers = [];
    var _deleted_at_decorators;
    var _deleted_at_initializers = [];
    var _deleted_at_extraInitializers = [];
    var _deleted_by_decorators;
    var _deleted_by_initializers = [];
    var _deleted_by_extraInitializers = [];
    var _mergedIntoPlantId_decorators;
    var _mergedIntoPlantId_initializers = [];
    var _mergedIntoPlantId_extraInitializers = [];
    var _mergedAt_decorators;
    var _mergedAt_initializers = [];
    var _mergedAt_extraInitializers = [];
    var ProductPlant = _classThis = /** @class */ (function () {
        function ProductPlant_1() {
            this.productPlantId = __runInitializers(this, _productPlantId_initializers, void 0);
            this.productId = (__runInitializers(this, _productPlantId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.vendorId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.categoryId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.urnNo = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.eoiNo = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
            this.plantName = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _plantName_initializers, void 0));
            this.plantLocation = (__runInitializers(this, _plantName_extraInitializers), __runInitializers(this, _plantLocation_initializers, void 0));
            this.countryId = (__runInitializers(this, _plantLocation_extraInitializers), __runInitializers(this, _countryId_initializers, void 0));
            this.stateId = (__runInitializers(this, _countryId_extraInitializers), __runInitializers(this, _stateId_initializers, void 0));
            this.city = (__runInitializers(this, _stateId_extraInitializers), __runInitializers(this, _city_initializers, void 0));
            this.plantStatus = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _plantStatus_initializers, void 0));
            this.createdDate = (__runInitializers(this, _plantStatus_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            /** Soft delete — cascaded when parent product is deleted */
            this.is_deleted = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _is_deleted_initializers, void 0));
            this.deleted_at = (__runInitializers(this, _is_deleted_extraInitializers), __runInitializers(this, _deleted_at_initializers, void 0));
            this.deleted_by = (__runInitializers(this, _deleted_at_extraInitializers), __runInitializers(this, _deleted_by_initializers, void 0));
            /** Set when this plant was absorbed into another via admin plant merge. */
            this.mergedIntoPlantId = (__runInitializers(this, _deleted_by_extraInitializers), __runInitializers(this, _mergedIntoPlantId_initializers, void 0));
            this.mergedAt = (__runInitializers(this, _mergedIntoPlantId_extraInitializers), __runInitializers(this, _mergedAt_initializers, void 0));
            __runInitializers(this, _mergedAt_extraInitializers);
        }
        return ProductPlant_1;
    }());
    __setFunctionName(_classThis, "ProductPlant");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _productPlantId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _productId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _categoryId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Category', required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _eoiNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _plantName_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _plantLocation_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _countryId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Country', required: true })];
        _stateId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'State', required: true })];
        _city_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _plantStatus_decorators = [(0, mongoose_1.Prop)({ default: 1 })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _is_deleted_decorators = [(0, mongoose_1.Prop)({ default: false })];
        _deleted_at_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        _deleted_by_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null })];
        _mergedIntoPlantId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'ProductPlant', default: null })];
        _mergedAt_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        __esDecorate(null, null, _productPlantId_decorators, { kind: "field", name: "productPlantId", static: false, private: false, access: { has: function (obj) { return "productPlantId" in obj; }, get: function (obj) { return obj.productPlantId; }, set: function (obj, value) { obj.productPlantId = value; } }, metadata: _metadata }, _productPlantId_initializers, _productPlantId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
        __esDecorate(null, null, _plantName_decorators, { kind: "field", name: "plantName", static: false, private: false, access: { has: function (obj) { return "plantName" in obj; }, get: function (obj) { return obj.plantName; }, set: function (obj, value) { obj.plantName = value; } }, metadata: _metadata }, _plantName_initializers, _plantName_extraInitializers);
        __esDecorate(null, null, _plantLocation_decorators, { kind: "field", name: "plantLocation", static: false, private: false, access: { has: function (obj) { return "plantLocation" in obj; }, get: function (obj) { return obj.plantLocation; }, set: function (obj, value) { obj.plantLocation = value; } }, metadata: _metadata }, _plantLocation_initializers, _plantLocation_extraInitializers);
        __esDecorate(null, null, _countryId_decorators, { kind: "field", name: "countryId", static: false, private: false, access: { has: function (obj) { return "countryId" in obj; }, get: function (obj) { return obj.countryId; }, set: function (obj, value) { obj.countryId = value; } }, metadata: _metadata }, _countryId_initializers, _countryId_extraInitializers);
        __esDecorate(null, null, _stateId_decorators, { kind: "field", name: "stateId", static: false, private: false, access: { has: function (obj) { return "stateId" in obj; }, get: function (obj) { return obj.stateId; }, set: function (obj, value) { obj.stateId = value; } }, metadata: _metadata }, _stateId_initializers, _stateId_extraInitializers);
        __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
        __esDecorate(null, null, _plantStatus_decorators, { kind: "field", name: "plantStatus", static: false, private: false, access: { has: function (obj) { return "plantStatus" in obj; }, get: function (obj) { return obj.plantStatus; }, set: function (obj, value) { obj.plantStatus = value; } }, metadata: _metadata }, _plantStatus_initializers, _plantStatus_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _is_deleted_decorators, { kind: "field", name: "is_deleted", static: false, private: false, access: { has: function (obj) { return "is_deleted" in obj; }, get: function (obj) { return obj.is_deleted; }, set: function (obj, value) { obj.is_deleted = value; } }, metadata: _metadata }, _is_deleted_initializers, _is_deleted_extraInitializers);
        __esDecorate(null, null, _deleted_at_decorators, { kind: "field", name: "deleted_at", static: false, private: false, access: { has: function (obj) { return "deleted_at" in obj; }, get: function (obj) { return obj.deleted_at; }, set: function (obj, value) { obj.deleted_at = value; } }, metadata: _metadata }, _deleted_at_initializers, _deleted_at_extraInitializers);
        __esDecorate(null, null, _deleted_by_decorators, { kind: "field", name: "deleted_by", static: false, private: false, access: { has: function (obj) { return "deleted_by" in obj; }, get: function (obj) { return obj.deleted_by; }, set: function (obj, value) { obj.deleted_by = value; } }, metadata: _metadata }, _deleted_by_initializers, _deleted_by_extraInitializers);
        __esDecorate(null, null, _mergedIntoPlantId_decorators, { kind: "field", name: "mergedIntoPlantId", static: false, private: false, access: { has: function (obj) { return "mergedIntoPlantId" in obj; }, get: function (obj) { return obj.mergedIntoPlantId; }, set: function (obj, value) { obj.mergedIntoPlantId = value; } }, metadata: _metadata }, _mergedIntoPlantId_initializers, _mergedIntoPlantId_extraInitializers);
        __esDecorate(null, null, _mergedAt_decorators, { kind: "field", name: "mergedAt", static: false, private: false, access: { has: function (obj) { return "mergedAt" in obj; }, get: function (obj) { return obj.mergedAt; }, set: function (obj, value) { obj.mergedAt = value; } }, metadata: _metadata }, _mergedAt_initializers, _mergedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductPlant = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductPlant = _classThis;
}();
exports.ProductPlant = ProductPlant;
exports.ProductPlantSchema = mongoose_1.SchemaFactory.createForClass(ProductPlant);
exports.ProductPlantSchema.index({ productId: 1, is_deleted: 1 });
exports.ProductPlantSchema.index({ manufacturerId: 1, is_deleted: 1 });
