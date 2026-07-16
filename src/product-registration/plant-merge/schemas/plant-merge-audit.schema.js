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
exports.PlantMergeAuditSchema = exports.PlantMergeAudit = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var PlantMergeAudit = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'plant_merges', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _sourcePlantIds_decorators;
    var _sourcePlantIds_initializers = [];
    var _sourcePlantIds_extraInitializers = [];
    var _sourceProductPlantIds_decorators;
    var _sourceProductPlantIds_initializers = [];
    var _sourceProductPlantIds_extraInitializers = [];
    var _targetPlantId_decorators;
    var _targetPlantId_initializers = [];
    var _targetPlantId_extraInitializers = [];
    var _targetProductPlantId_decorators;
    var _targetProductPlantId_initializers = [];
    var _targetProductPlantId_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _targetProductId_decorators;
    var _targetProductId_initializers = [];
    var _targetProductId_extraInitializers = [];
    var _copiedPlantIds_decorators;
    var _copiedPlantIds_initializers = [];
    var _copiedPlantIds_extraInitializers = [];
    var _copiedProductPlantIds_decorators;
    var _copiedProductPlantIds_initializers = [];
    var _copiedProductPlantIds_extraInitializers = [];
    var _productIdNumeric_decorators;
    var _productIdNumeric_initializers = [];
    var _productIdNumeric_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _targetUrnNo_decorators;
    var _targetUrnNo_initializers = [];
    var _targetUrnNo_extraInitializers = [];
    var _targetEoiNo_decorators;
    var _targetEoiNo_initializers = [];
    var _targetEoiNo_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _manufacturingUnitsRemoved_decorators;
    var _manufacturingUnitsRemoved_initializers = [];
    var _manufacturingUnitsRemoved_extraInitializers = [];
    var _manufacturingUnitsSkipped_decorators;
    var _manufacturingUnitsSkipped_initializers = [];
    var _manufacturingUnitsSkipped_extraInitializers = [];
    var _plantCountBefore_decorators;
    var _plantCountBefore_initializers = [];
    var _plantCountBefore_extraInitializers = [];
    var _plantCountAfter_decorators;
    var _plantCountAfter_initializers = [];
    var _plantCountAfter_extraInitializers = [];
    var _mergeStrategy_decorators;
    var _mergeStrategy_initializers = [];
    var _mergeStrategy_extraInitializers = [];
    var _mergeStatus_decorators;
    var _mergeStatus_initializers = [];
    var _mergeStatus_extraInitializers = [];
    var _mergedBy_decorators;
    var _mergedBy_initializers = [];
    var _mergedBy_extraInitializers = [];
    var _mergedAt_decorators;
    var _mergedAt_initializers = [];
    var _mergedAt_extraInitializers = [];
    var PlantMergeAudit = _classThis = /** @class */ (function () {
        function PlantMergeAudit_1() {
            this.sourcePlantIds = __runInitializers(this, _sourcePlantIds_initializers, void 0);
            this.sourceProductPlantIds = (__runInitializers(this, _sourcePlantIds_extraInitializers), __runInitializers(this, _sourceProductPlantIds_initializers, void 0));
            /** Within-EOI absorb merge target plant (optional for URN-level copy). */
            this.targetPlantId = (__runInitializers(this, _sourceProductPlantIds_extraInitializers), __runInitializers(this, _targetPlantId_initializers, void 0));
            this.targetProductPlantId = (__runInitializers(this, _targetPlantId_extraInitializers), __runInitializers(this, _targetProductPlantId_initializers, void 0));
            /** Source product (URN-level copy) or product owning merged plants (within-EOI). */
            this.productId = (__runInitializers(this, _targetProductPlantId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            /** Target product for URN-level plant copy. */
            this.targetProductId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _targetProductId_initializers, void 0));
            this.copiedPlantIds = (__runInitializers(this, _targetProductId_extraInitializers), __runInitializers(this, _copiedPlantIds_initializers, void 0));
            this.copiedProductPlantIds = (__runInitializers(this, _copiedPlantIds_extraInitializers), __runInitializers(this, _copiedProductPlantIds_initializers, void 0));
            this.productIdNumeric = (__runInitializers(this, _copiedProductPlantIds_extraInitializers), __runInitializers(this, _productIdNumeric_initializers, void 0));
            this.eoiNo = (__runInitializers(this, _productIdNumeric_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
            this.urnNo = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            /** URN-level plant merge target (optional for within-EOI merges). */
            this.targetUrnNo = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _targetUrnNo_initializers, void 0));
            this.targetEoiNo = (__runInitializers(this, _targetUrnNo_extraInitializers), __runInitializers(this, _targetEoiNo_initializers, void 0));
            this.categoryId = (__runInitializers(this, _targetEoiNo_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
            this.vendorId = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.manufacturingUnitsRemoved = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _manufacturingUnitsRemoved_initializers, void 0));
            this.manufacturingUnitsSkipped = (__runInitializers(this, _manufacturingUnitsRemoved_extraInitializers), __runInitializers(this, _manufacturingUnitsSkipped_initializers, void 0));
            this.plantCountBefore = (__runInitializers(this, _manufacturingUnitsSkipped_extraInitializers), __runInitializers(this, _plantCountBefore_initializers, void 0));
            this.plantCountAfter = (__runInitializers(this, _plantCountBefore_extraInitializers), __runInitializers(this, _plantCountAfter_initializers, void 0));
            this.mergeStrategy = (__runInitializers(this, _plantCountAfter_extraInitializers), __runInitializers(this, _mergeStrategy_initializers, void 0));
            this.mergeStatus = (__runInitializers(this, _mergeStrategy_extraInitializers), __runInitializers(this, _mergeStatus_initializers, void 0));
            this.mergedBy = (__runInitializers(this, _mergeStatus_extraInitializers), __runInitializers(this, _mergedBy_initializers, void 0));
            this.mergedAt = (__runInitializers(this, _mergedBy_extraInitializers), __runInitializers(this, _mergedAt_initializers, void 0));
            __runInitializers(this, _mergedAt_extraInitializers);
        }
        return PlantMergeAudit_1;
    }());
    __setFunctionName(_classThis, "PlantMergeAudit");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _sourcePlantIds_decorators = [(0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], required: true, default: [] })];
        _sourceProductPlantIds_decorators = [(0, mongoose_1.Prop)({ type: [Number], required: true, default: [] })];
        _targetPlantId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId })];
        _targetProductPlantId_decorators = [(0, mongoose_1.Prop)()];
        _productId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _targetProductId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId })];
        _copiedPlantIds_decorators = [(0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], default: [] })];
        _copiedProductPlantIds_decorators = [(0, mongoose_1.Prop)({ type: [Number], default: [] })];
        _productIdNumeric_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _eoiNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _targetUrnNo_decorators = [(0, mongoose_1.Prop)()];
        _targetEoiNo_decorators = [(0, mongoose_1.Prop)()];
        _categoryId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _manufacturingUnitsRemoved_decorators = [(0, mongoose_1.Prop)({ type: [String], required: true, default: [] })];
        _manufacturingUnitsSkipped_decorators = [(0, mongoose_1.Prop)({ type: [String], required: true, default: [] })];
        _plantCountBefore_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _plantCountAfter_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _mergeStrategy_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _mergeStatus_decorators = [(0, mongoose_1.Prop)({ required: true, default: 'completed' })];
        _mergedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true })];
        _mergedAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _sourcePlantIds_decorators, { kind: "field", name: "sourcePlantIds", static: false, private: false, access: { has: function (obj) { return "sourcePlantIds" in obj; }, get: function (obj) { return obj.sourcePlantIds; }, set: function (obj, value) { obj.sourcePlantIds = value; } }, metadata: _metadata }, _sourcePlantIds_initializers, _sourcePlantIds_extraInitializers);
        __esDecorate(null, null, _sourceProductPlantIds_decorators, { kind: "field", name: "sourceProductPlantIds", static: false, private: false, access: { has: function (obj) { return "sourceProductPlantIds" in obj; }, get: function (obj) { return obj.sourceProductPlantIds; }, set: function (obj, value) { obj.sourceProductPlantIds = value; } }, metadata: _metadata }, _sourceProductPlantIds_initializers, _sourceProductPlantIds_extraInitializers);
        __esDecorate(null, null, _targetPlantId_decorators, { kind: "field", name: "targetPlantId", static: false, private: false, access: { has: function (obj) { return "targetPlantId" in obj; }, get: function (obj) { return obj.targetPlantId; }, set: function (obj, value) { obj.targetPlantId = value; } }, metadata: _metadata }, _targetPlantId_initializers, _targetPlantId_extraInitializers);
        __esDecorate(null, null, _targetProductPlantId_decorators, { kind: "field", name: "targetProductPlantId", static: false, private: false, access: { has: function (obj) { return "targetProductPlantId" in obj; }, get: function (obj) { return obj.targetProductPlantId; }, set: function (obj, value) { obj.targetProductPlantId = value; } }, metadata: _metadata }, _targetProductPlantId_initializers, _targetProductPlantId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _targetProductId_decorators, { kind: "field", name: "targetProductId", static: false, private: false, access: { has: function (obj) { return "targetProductId" in obj; }, get: function (obj) { return obj.targetProductId; }, set: function (obj, value) { obj.targetProductId = value; } }, metadata: _metadata }, _targetProductId_initializers, _targetProductId_extraInitializers);
        __esDecorate(null, null, _copiedPlantIds_decorators, { kind: "field", name: "copiedPlantIds", static: false, private: false, access: { has: function (obj) { return "copiedPlantIds" in obj; }, get: function (obj) { return obj.copiedPlantIds; }, set: function (obj, value) { obj.copiedPlantIds = value; } }, metadata: _metadata }, _copiedPlantIds_initializers, _copiedPlantIds_extraInitializers);
        __esDecorate(null, null, _copiedProductPlantIds_decorators, { kind: "field", name: "copiedProductPlantIds", static: false, private: false, access: { has: function (obj) { return "copiedProductPlantIds" in obj; }, get: function (obj) { return obj.copiedProductPlantIds; }, set: function (obj, value) { obj.copiedProductPlantIds = value; } }, metadata: _metadata }, _copiedProductPlantIds_initializers, _copiedProductPlantIds_extraInitializers);
        __esDecorate(null, null, _productIdNumeric_decorators, { kind: "field", name: "productIdNumeric", static: false, private: false, access: { has: function (obj) { return "productIdNumeric" in obj; }, get: function (obj) { return obj.productIdNumeric; }, set: function (obj, value) { obj.productIdNumeric = value; } }, metadata: _metadata }, _productIdNumeric_initializers, _productIdNumeric_extraInitializers);
        __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _targetUrnNo_decorators, { kind: "field", name: "targetUrnNo", static: false, private: false, access: { has: function (obj) { return "targetUrnNo" in obj; }, get: function (obj) { return obj.targetUrnNo; }, set: function (obj, value) { obj.targetUrnNo = value; } }, metadata: _metadata }, _targetUrnNo_initializers, _targetUrnNo_extraInitializers);
        __esDecorate(null, null, _targetEoiNo_decorators, { kind: "field", name: "targetEoiNo", static: false, private: false, access: { has: function (obj) { return "targetEoiNo" in obj; }, get: function (obj) { return obj.targetEoiNo; }, set: function (obj, value) { obj.targetEoiNo = value; } }, metadata: _metadata }, _targetEoiNo_initializers, _targetEoiNo_extraInitializers);
        __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _manufacturingUnitsRemoved_decorators, { kind: "field", name: "manufacturingUnitsRemoved", static: false, private: false, access: { has: function (obj) { return "manufacturingUnitsRemoved" in obj; }, get: function (obj) { return obj.manufacturingUnitsRemoved; }, set: function (obj, value) { obj.manufacturingUnitsRemoved = value; } }, metadata: _metadata }, _manufacturingUnitsRemoved_initializers, _manufacturingUnitsRemoved_extraInitializers);
        __esDecorate(null, null, _manufacturingUnitsSkipped_decorators, { kind: "field", name: "manufacturingUnitsSkipped", static: false, private: false, access: { has: function (obj) { return "manufacturingUnitsSkipped" in obj; }, get: function (obj) { return obj.manufacturingUnitsSkipped; }, set: function (obj, value) { obj.manufacturingUnitsSkipped = value; } }, metadata: _metadata }, _manufacturingUnitsSkipped_initializers, _manufacturingUnitsSkipped_extraInitializers);
        __esDecorate(null, null, _plantCountBefore_decorators, { kind: "field", name: "plantCountBefore", static: false, private: false, access: { has: function (obj) { return "plantCountBefore" in obj; }, get: function (obj) { return obj.plantCountBefore; }, set: function (obj, value) { obj.plantCountBefore = value; } }, metadata: _metadata }, _plantCountBefore_initializers, _plantCountBefore_extraInitializers);
        __esDecorate(null, null, _plantCountAfter_decorators, { kind: "field", name: "plantCountAfter", static: false, private: false, access: { has: function (obj) { return "plantCountAfter" in obj; }, get: function (obj) { return obj.plantCountAfter; }, set: function (obj, value) { obj.plantCountAfter = value; } }, metadata: _metadata }, _plantCountAfter_initializers, _plantCountAfter_extraInitializers);
        __esDecorate(null, null, _mergeStrategy_decorators, { kind: "field", name: "mergeStrategy", static: false, private: false, access: { has: function (obj) { return "mergeStrategy" in obj; }, get: function (obj) { return obj.mergeStrategy; }, set: function (obj, value) { obj.mergeStrategy = value; } }, metadata: _metadata }, _mergeStrategy_initializers, _mergeStrategy_extraInitializers);
        __esDecorate(null, null, _mergeStatus_decorators, { kind: "field", name: "mergeStatus", static: false, private: false, access: { has: function (obj) { return "mergeStatus" in obj; }, get: function (obj) { return obj.mergeStatus; }, set: function (obj, value) { obj.mergeStatus = value; } }, metadata: _metadata }, _mergeStatus_initializers, _mergeStatus_extraInitializers);
        __esDecorate(null, null, _mergedBy_decorators, { kind: "field", name: "mergedBy", static: false, private: false, access: { has: function (obj) { return "mergedBy" in obj; }, get: function (obj) { return obj.mergedBy; }, set: function (obj, value) { obj.mergedBy = value; } }, metadata: _metadata }, _mergedBy_initializers, _mergedBy_extraInitializers);
        __esDecorate(null, null, _mergedAt_decorators, { kind: "field", name: "mergedAt", static: false, private: false, access: { has: function (obj) { return "mergedAt" in obj; }, get: function (obj) { return obj.mergedAt; }, set: function (obj, value) { obj.mergedAt = value; } }, metadata: _metadata }, _mergedAt_initializers, _mergedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlantMergeAudit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlantMergeAudit = _classThis;
}();
exports.PlantMergeAudit = PlantMergeAudit;
exports.PlantMergeAuditSchema = mongoose_1.SchemaFactory.createForClass(PlantMergeAudit);
exports.PlantMergeAuditSchema.index({ urnNo: 1, mergedAt: -1 });
exports.PlantMergeAuditSchema.index({ eoiNo: 1, mergedAt: -1 });
exports.PlantMergeAuditSchema.index({ productId: 1, mergedAt: -1 });
exports.PlantMergeAuditSchema.index({ urnNo: 1, eoiNo: 1, targetUrnNo: 1, targetEoiNo: 1 }, { name: 'plant_merge_urn_pair_unique' });
