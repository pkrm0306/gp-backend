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
exports.DocStreamSchema = exports.DocStream = exports.DocStreamLiveRef = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var document_version_constants_1 = require("../constants/document-version.constants");
var DocStreamLiveRef = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _collection_decorators;
    var _collection_initializers = [];
    var _collection_extraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _field_decorators;
    var _field_initializers = [];
    var _field_extraInitializers = [];
    var DocStreamLiveRef = _classThis = /** @class */ (function () {
        function DocStreamLiveRef_1() {
            this.collection = __runInitializers(this, _collection_initializers, void 0);
            this.id = (__runInitializers(this, _collection_extraInitializers), __runInitializers(this, _id_initializers, void 0));
            this.field = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _field_initializers, void 0));
            __runInitializers(this, _field_extraInitializers);
        }
        return DocStreamLiveRef_1;
    }());
    __setFunctionName(_classThis, "DocStreamLiveRef");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _collection_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _id_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _field_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _collection_decorators, { kind: "field", name: "collection", static: false, private: false, access: { has: function (obj) { return "collection" in obj; }, get: function (obj) { return obj.collection; }, set: function (obj, value) { obj.collection = value; } }, metadata: _metadata }, _collection_initializers, _collection_extraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _field_decorators, { kind: "field", name: "field", static: false, private: false, access: { has: function (obj) { return "field" in obj; }, get: function (obj) { return obj.field; }, set: function (obj, value) { obj.field = value; } }, metadata: _metadata }, _field_initializers, _field_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocStreamLiveRef = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocStreamLiveRef = _classThis;
}();
exports.DocStreamLiveRef = DocStreamLiveRef;
var DocStreamLiveRefSchema = mongoose_1.SchemaFactory.createForClass(DocStreamLiveRef);
var DocStream = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'doc_streams', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _processType_decorators;
    var _processType_initializers = [];
    var _processType_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _sectionKey_decorators;
    var _sectionKey_initializers = [];
    var _sectionKey_extraInitializers = [];
    var _subsectionKey_decorators;
    var _subsectionKey_initializers = [];
    var _subsectionKey_extraInitializers = [];
    var _slotKey_decorators;
    var _slotKey_initializers = [];
    var _slotKey_extraInitializers = [];
    var _streamKey_decorators;
    var _streamKey_initializers = [];
    var _streamKey_extraInitializers = [];
    var _liveSource_decorators;
    var _liveSource_initializers = [];
    var _liveSource_extraInitializers = [];
    var _liveRef_decorators;
    var _liveRef_initializers = [];
    var _liveRef_extraInitializers = [];
    var _latestVersionNo_decorators;
    var _latestVersionNo_initializers = [];
    var _latestVersionNo_extraInitializers = [];
    var _latestVersionId_decorators;
    var _latestVersionId_initializers = [];
    var _latestVersionId_extraInitializers = [];
    var _isDeleted_decorators;
    var _isDeleted_initializers = [];
    var _isDeleted_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _createdBy_decorators;
    var _createdBy_initializers = [];
    var _createdBy_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _updatedBy_decorators;
    var _updatedBy_initializers = [];
    var _updatedBy_extraInitializers = [];
    var DocStream = _classThis = /** @class */ (function () {
        function DocStream_1() {
            this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
            this.processType = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _processType_initializers, void 0));
            this.renewalCycleId = (__runInitializers(this, _processType_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
            this.sectionKey = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _sectionKey_initializers, void 0));
            this.subsectionKey = (__runInitializers(this, _sectionKey_extraInitializers), __runInitializers(this, _subsectionKey_initializers, void 0));
            this.slotKey = (__runInitializers(this, _subsectionKey_extraInitializers), __runInitializers(this, _slotKey_initializers, void 0));
            this.streamKey = (__runInitializers(this, _slotKey_extraInitializers), __runInitializers(this, _streamKey_initializers, void 0));
            this.liveSource = (__runInitializers(this, _streamKey_extraInitializers), __runInitializers(this, _liveSource_initializers, void 0));
            this.liveRef = (__runInitializers(this, _liveSource_extraInitializers), __runInitializers(this, _liveRef_initializers, void 0));
            this.latestVersionNo = (__runInitializers(this, _liveRef_extraInitializers), __runInitializers(this, _latestVersionNo_initializers, void 0));
            this.latestVersionId = (__runInitializers(this, _latestVersionNo_extraInitializers), __runInitializers(this, _latestVersionId_initializers, void 0));
            this.isDeleted = (__runInitializers(this, _latestVersionId_extraInitializers), __runInitializers(this, _isDeleted_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isDeleted_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.createdBy = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            __runInitializers(this, _updatedBy_extraInitializers);
        }
        return DocStream_1;
    }());
    __setFunctionName(_classThis, "DocStream");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _processType_decorators = [(0, mongoose_1.Prop)({ required: true, enum: document_version_constants_1.DOCUMENT_PROCESS_TYPE_VALUES })];
        _renewalCycleId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, default: null })];
        _sectionKey_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _subsectionKey_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _slotKey_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _streamKey_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _liveSource_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _liveRef_decorators = [(0, mongoose_1.Prop)({ type: DocStreamLiveRefSchema, required: true })];
        _latestVersionNo_decorators = [(0, mongoose_1.Prop)({ required: true, default: 0 })];
        _latestVersionId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, default: null })];
        _isDeleted_decorators = [(0, mongoose_1.Prop)({ required: true, default: false })];
        _createdAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _createdBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _updatedAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _processType_decorators, { kind: "field", name: "processType", static: false, private: false, access: { has: function (obj) { return "processType" in obj; }, get: function (obj) { return obj.processType; }, set: function (obj, value) { obj.processType = value; } }, metadata: _metadata }, _processType_initializers, _processType_extraInitializers);
        __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
        __esDecorate(null, null, _sectionKey_decorators, { kind: "field", name: "sectionKey", static: false, private: false, access: { has: function (obj) { return "sectionKey" in obj; }, get: function (obj) { return obj.sectionKey; }, set: function (obj, value) { obj.sectionKey = value; } }, metadata: _metadata }, _sectionKey_initializers, _sectionKey_extraInitializers);
        __esDecorate(null, null, _subsectionKey_decorators, { kind: "field", name: "subsectionKey", static: false, private: false, access: { has: function (obj) { return "subsectionKey" in obj; }, get: function (obj) { return obj.subsectionKey; }, set: function (obj, value) { obj.subsectionKey = value; } }, metadata: _metadata }, _subsectionKey_initializers, _subsectionKey_extraInitializers);
        __esDecorate(null, null, _slotKey_decorators, { kind: "field", name: "slotKey", static: false, private: false, access: { has: function (obj) { return "slotKey" in obj; }, get: function (obj) { return obj.slotKey; }, set: function (obj, value) { obj.slotKey = value; } }, metadata: _metadata }, _slotKey_initializers, _slotKey_extraInitializers);
        __esDecorate(null, null, _streamKey_decorators, { kind: "field", name: "streamKey", static: false, private: false, access: { has: function (obj) { return "streamKey" in obj; }, get: function (obj) { return obj.streamKey; }, set: function (obj, value) { obj.streamKey = value; } }, metadata: _metadata }, _streamKey_initializers, _streamKey_extraInitializers);
        __esDecorate(null, null, _liveSource_decorators, { kind: "field", name: "liveSource", static: false, private: false, access: { has: function (obj) { return "liveSource" in obj; }, get: function (obj) { return obj.liveSource; }, set: function (obj, value) { obj.liveSource = value; } }, metadata: _metadata }, _liveSource_initializers, _liveSource_extraInitializers);
        __esDecorate(null, null, _liveRef_decorators, { kind: "field", name: "liveRef", static: false, private: false, access: { has: function (obj) { return "liveRef" in obj; }, get: function (obj) { return obj.liveRef; }, set: function (obj, value) { obj.liveRef = value; } }, metadata: _metadata }, _liveRef_initializers, _liveRef_extraInitializers);
        __esDecorate(null, null, _latestVersionNo_decorators, { kind: "field", name: "latestVersionNo", static: false, private: false, access: { has: function (obj) { return "latestVersionNo" in obj; }, get: function (obj) { return obj.latestVersionNo; }, set: function (obj, value) { obj.latestVersionNo = value; } }, metadata: _metadata }, _latestVersionNo_initializers, _latestVersionNo_extraInitializers);
        __esDecorate(null, null, _latestVersionId_decorators, { kind: "field", name: "latestVersionId", static: false, private: false, access: { has: function (obj) { return "latestVersionId" in obj; }, get: function (obj) { return obj.latestVersionId; }, set: function (obj, value) { obj.latestVersionId = value; } }, metadata: _metadata }, _latestVersionId_initializers, _latestVersionId_extraInitializers);
        __esDecorate(null, null, _isDeleted_decorators, { kind: "field", name: "isDeleted", static: false, private: false, access: { has: function (obj) { return "isDeleted" in obj; }, get: function (obj) { return obj.isDeleted; }, set: function (obj, value) { obj.isDeleted = value; } }, metadata: _metadata }, _isDeleted_initializers, _isDeleted_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: function (obj) { return "createdBy" in obj; }, get: function (obj) { return obj.createdBy; }, set: function (obj, value) { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: function (obj) { return "updatedBy" in obj; }, get: function (obj) { return obj.updatedBy; }, set: function (obj, value) { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocStream = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocStream = _classThis;
}();
exports.DocStream = DocStream;
exports.DocStreamSchema = mongoose_1.SchemaFactory.createForClass(DocStream);
exports.DocStreamSchema.index({
    urnNo: 1,
    processType: 1,
    renewalCycleId: 1,
    sectionKey: 1,
    subsectionKey: 1,
    slotKey: 1,
}, { unique: true });
