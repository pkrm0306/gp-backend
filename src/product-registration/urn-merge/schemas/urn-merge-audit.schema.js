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
exports.UrnMergeAuditSchema = exports.UrnMergeAudit = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var UrnMergeAudit = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'urn_merges', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _sourceUrnNo_decorators;
    var _sourceUrnNo_initializers = [];
    var _sourceUrnNo_extraInitializers = [];
    var _targetUrnNo_decorators;
    var _targetUrnNo_initializers = [];
    var _targetUrnNo_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _movedProductIds_decorators;
    var _movedProductIds_initializers = [];
    var _movedProductIds_extraInitializers = [];
    var _movedEoiNos_decorators;
    var _movedEoiNos_initializers = [];
    var _movedEoiNos_extraInitializers = [];
    var _urnSectionsRekeyed_decorators;
    var _urnSectionsRekeyed_initializers = [];
    var _urnSectionsRekeyed_extraInitializers = [];
    var _urnSectionsSkipped_decorators;
    var _urnSectionsSkipped_initializers = [];
    var _urnSectionsSkipped_extraInitializers = [];
    var _urnLevelStrategy_decorators;
    var _urnLevelStrategy_initializers = [];
    var _urnLevelStrategy_extraInitializers = [];
    var _mergedBy_decorators;
    var _mergedBy_initializers = [];
    var _mergedBy_extraInitializers = [];
    var _mergedAt_decorators;
    var _mergedAt_initializers = [];
    var _mergedAt_extraInitializers = [];
    var UrnMergeAudit = _classThis = /** @class */ (function () {
        function UrnMergeAudit_1() {
            this.sourceUrnNo = __runInitializers(this, _sourceUrnNo_initializers, void 0);
            this.targetUrnNo = (__runInitializers(this, _sourceUrnNo_extraInitializers), __runInitializers(this, _targetUrnNo_initializers, void 0));
            this.categoryId = (__runInitializers(this, _targetUrnNo_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
            this.vendorId = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.movedProductIds = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _movedProductIds_initializers, void 0));
            this.movedEoiNos = (__runInitializers(this, _movedProductIds_extraInitializers), __runInitializers(this, _movedEoiNos_initializers, void 0));
            this.urnSectionsRekeyed = (__runInitializers(this, _movedEoiNos_extraInitializers), __runInitializers(this, _urnSectionsRekeyed_initializers, void 0));
            this.urnSectionsSkipped = (__runInitializers(this, _urnSectionsRekeyed_extraInitializers), __runInitializers(this, _urnSectionsSkipped_initializers, void 0));
            this.urnLevelStrategy = (__runInitializers(this, _urnSectionsSkipped_extraInitializers), __runInitializers(this, _urnLevelStrategy_initializers, void 0));
            this.mergedBy = (__runInitializers(this, _urnLevelStrategy_extraInitializers), __runInitializers(this, _mergedBy_initializers, void 0));
            this.mergedAt = (__runInitializers(this, _mergedBy_extraInitializers), __runInitializers(this, _mergedAt_initializers, void 0));
            __runInitializers(this, _mergedAt_extraInitializers);
        }
        return UrnMergeAudit_1;
    }());
    __setFunctionName(_classThis, "UrnMergeAudit");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _sourceUrnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _targetUrnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _categoryId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _movedProductIds_decorators = [(0, mongoose_1.Prop)({ type: [Number], required: true, default: [] })];
        _movedEoiNos_decorators = [(0, mongoose_1.Prop)({ type: [String], required: true, default: [] })];
        _urnSectionsRekeyed_decorators = [(0, mongoose_1.Prop)({ type: [String], required: true, default: [] })];
        _urnSectionsSkipped_decorators = [(0, mongoose_1.Prop)({ type: [String], required: true, default: [] })];
        _urnLevelStrategy_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _mergedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true })];
        _mergedAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _sourceUrnNo_decorators, { kind: "field", name: "sourceUrnNo", static: false, private: false, access: { has: function (obj) { return "sourceUrnNo" in obj; }, get: function (obj) { return obj.sourceUrnNo; }, set: function (obj, value) { obj.sourceUrnNo = value; } }, metadata: _metadata }, _sourceUrnNo_initializers, _sourceUrnNo_extraInitializers);
        __esDecorate(null, null, _targetUrnNo_decorators, { kind: "field", name: "targetUrnNo", static: false, private: false, access: { has: function (obj) { return "targetUrnNo" in obj; }, get: function (obj) { return obj.targetUrnNo; }, set: function (obj, value) { obj.targetUrnNo = value; } }, metadata: _metadata }, _targetUrnNo_initializers, _targetUrnNo_extraInitializers);
        __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _movedProductIds_decorators, { kind: "field", name: "movedProductIds", static: false, private: false, access: { has: function (obj) { return "movedProductIds" in obj; }, get: function (obj) { return obj.movedProductIds; }, set: function (obj, value) { obj.movedProductIds = value; } }, metadata: _metadata }, _movedProductIds_initializers, _movedProductIds_extraInitializers);
        __esDecorate(null, null, _movedEoiNos_decorators, { kind: "field", name: "movedEoiNos", static: false, private: false, access: { has: function (obj) { return "movedEoiNos" in obj; }, get: function (obj) { return obj.movedEoiNos; }, set: function (obj, value) { obj.movedEoiNos = value; } }, metadata: _metadata }, _movedEoiNos_initializers, _movedEoiNos_extraInitializers);
        __esDecorate(null, null, _urnSectionsRekeyed_decorators, { kind: "field", name: "urnSectionsRekeyed", static: false, private: false, access: { has: function (obj) { return "urnSectionsRekeyed" in obj; }, get: function (obj) { return obj.urnSectionsRekeyed; }, set: function (obj, value) { obj.urnSectionsRekeyed = value; } }, metadata: _metadata }, _urnSectionsRekeyed_initializers, _urnSectionsRekeyed_extraInitializers);
        __esDecorate(null, null, _urnSectionsSkipped_decorators, { kind: "field", name: "urnSectionsSkipped", static: false, private: false, access: { has: function (obj) { return "urnSectionsSkipped" in obj; }, get: function (obj) { return obj.urnSectionsSkipped; }, set: function (obj, value) { obj.urnSectionsSkipped = value; } }, metadata: _metadata }, _urnSectionsSkipped_initializers, _urnSectionsSkipped_extraInitializers);
        __esDecorate(null, null, _urnLevelStrategy_decorators, { kind: "field", name: "urnLevelStrategy", static: false, private: false, access: { has: function (obj) { return "urnLevelStrategy" in obj; }, get: function (obj) { return obj.urnLevelStrategy; }, set: function (obj, value) { obj.urnLevelStrategy = value; } }, metadata: _metadata }, _urnLevelStrategy_initializers, _urnLevelStrategy_extraInitializers);
        __esDecorate(null, null, _mergedBy_decorators, { kind: "field", name: "mergedBy", static: false, private: false, access: { has: function (obj) { return "mergedBy" in obj; }, get: function (obj) { return obj.mergedBy; }, set: function (obj, value) { obj.mergedBy = value; } }, metadata: _metadata }, _mergedBy_initializers, _mergedBy_extraInitializers);
        __esDecorate(null, null, _mergedAt_decorators, { kind: "field", name: "mergedAt", static: false, private: false, access: { has: function (obj) { return "mergedAt" in obj; }, get: function (obj) { return obj.mergedAt; }, set: function (obj, value) { obj.mergedAt = value; } }, metadata: _metadata }, _mergedAt_initializers, _mergedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UrnMergeAudit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UrnMergeAudit = _classThis;
}();
exports.UrnMergeAudit = UrnMergeAudit;
exports.UrnMergeAuditSchema = mongoose_1.SchemaFactory.createForClass(UrnMergeAudit);
exports.UrnMergeAuditSchema.index({ targetUrnNo: 1, mergedAt: -1 });
exports.UrnMergeAuditSchema.index({ sourceUrnNo: 1, mergedAt: -1 });
