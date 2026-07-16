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
exports.DocVersionSchema = exports.DocVersion = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var document_version_constants_1 = require("../constants/document-version.constants");
var DocVersion = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'doc_versions', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _streamId_decorators;
    var _streamId_initializers = [];
    var _streamId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _processType_decorators;
    var _processType_initializers = [];
    var _processType_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _roundNo_decorators;
    var _roundNo_initializers = [];
    var _roundNo_extraInitializers = [];
    var _versionNo_decorators;
    var _versionNo_initializers = [];
    var _versionNo_extraInitializers = [];
    var _action_decorators;
    var _action_initializers = [];
    var _action_extraInitializers = [];
    var _filePath_decorators;
    var _filePath_initializers = [];
    var _filePath_extraInitializers = [];
    var _originalName_decorators;
    var _originalName_initializers = [];
    var _originalName_extraInitializers = [];
    var _storedName_decorators;
    var _storedName_initializers = [];
    var _storedName_extraInitializers = [];
    var _mimeType_decorators;
    var _mimeType_initializers = [];
    var _mimeType_extraInitializers = [];
    var _sizeBytes_decorators;
    var _sizeBytes_initializers = [];
    var _sizeBytes_extraInitializers = [];
    var _checksum_decorators;
    var _checksum_initializers = [];
    var _checksum_extraInitializers = [];
    var _isLatest_decorators;
    var _isLatest_initializers = [];
    var _isLatest_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _createdBy_decorators;
    var _createdBy_initializers = [];
    var _createdBy_extraInitializers = [];
    var DocVersion = _classThis = /** @class */ (function () {
        function DocVersion_1() {
            this.streamId = __runInitializers(this, _streamId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _streamId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.processType = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _processType_initializers, void 0));
            this.renewalCycleId = (__runInitializers(this, _processType_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
            this.roundNo = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _roundNo_initializers, void 0));
            this.versionNo = (__runInitializers(this, _roundNo_extraInitializers), __runInitializers(this, _versionNo_initializers, void 0));
            this.action = (__runInitializers(this, _versionNo_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.filePath = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _filePath_initializers, void 0));
            this.originalName = (__runInitializers(this, _filePath_extraInitializers), __runInitializers(this, _originalName_initializers, void 0));
            this.storedName = (__runInitializers(this, _originalName_extraInitializers), __runInitializers(this, _storedName_initializers, void 0));
            this.mimeType = (__runInitializers(this, _storedName_extraInitializers), __runInitializers(this, _mimeType_initializers, void 0));
            this.sizeBytes = (__runInitializers(this, _mimeType_extraInitializers), __runInitializers(this, _sizeBytes_initializers, void 0));
            this.checksum = (__runInitializers(this, _sizeBytes_extraInitializers), __runInitializers(this, _checksum_initializers, void 0));
            this.isLatest = (__runInitializers(this, _checksum_extraInitializers), __runInitializers(this, _isLatest_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isLatest_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.createdBy = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            __runInitializers(this, _createdBy_extraInitializers);
        }
        return DocVersion_1;
    }());
    __setFunctionName(_classThis, "DocVersion");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _streamId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'DocStream', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _processType_decorators = [(0, mongoose_1.Prop)({ required: true, enum: document_version_constants_1.DOCUMENT_PROCESS_TYPE_VALUES })];
        _renewalCycleId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, default: null })];
        _roundNo_decorators = [(0, mongoose_1.Prop)({ type: Number, default: null })];
        _versionNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _action_decorators = [(0, mongoose_1.Prop)({ required: true, enum: document_version_constants_1.DOCUMENT_VERSION_ACTION_VALUES })];
        _filePath_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _originalName_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _storedName_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _mimeType_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _sizeBytes_decorators = [(0, mongoose_1.Prop)({ type: Number, default: null })];
        _checksum_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _isLatest_decorators = [(0, mongoose_1.Prop)({ required: true, default: true })];
        _createdAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _createdBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        __esDecorate(null, null, _streamId_decorators, { kind: "field", name: "streamId", static: false, private: false, access: { has: function (obj) { return "streamId" in obj; }, get: function (obj) { return obj.streamId; }, set: function (obj, value) { obj.streamId = value; } }, metadata: _metadata }, _streamId_initializers, _streamId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _processType_decorators, { kind: "field", name: "processType", static: false, private: false, access: { has: function (obj) { return "processType" in obj; }, get: function (obj) { return obj.processType; }, set: function (obj, value) { obj.processType = value; } }, metadata: _metadata }, _processType_initializers, _processType_extraInitializers);
        __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
        __esDecorate(null, null, _roundNo_decorators, { kind: "field", name: "roundNo", static: false, private: false, access: { has: function (obj) { return "roundNo" in obj; }, get: function (obj) { return obj.roundNo; }, set: function (obj, value) { obj.roundNo = value; } }, metadata: _metadata }, _roundNo_initializers, _roundNo_extraInitializers);
        __esDecorate(null, null, _versionNo_decorators, { kind: "field", name: "versionNo", static: false, private: false, access: { has: function (obj) { return "versionNo" in obj; }, get: function (obj) { return obj.versionNo; }, set: function (obj, value) { obj.versionNo = value; } }, metadata: _metadata }, _versionNo_initializers, _versionNo_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: function (obj) { return "action" in obj; }, get: function (obj) { return obj.action; }, set: function (obj, value) { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _filePath_decorators, { kind: "field", name: "filePath", static: false, private: false, access: { has: function (obj) { return "filePath" in obj; }, get: function (obj) { return obj.filePath; }, set: function (obj, value) { obj.filePath = value; } }, metadata: _metadata }, _filePath_initializers, _filePath_extraInitializers);
        __esDecorate(null, null, _originalName_decorators, { kind: "field", name: "originalName", static: false, private: false, access: { has: function (obj) { return "originalName" in obj; }, get: function (obj) { return obj.originalName; }, set: function (obj, value) { obj.originalName = value; } }, metadata: _metadata }, _originalName_initializers, _originalName_extraInitializers);
        __esDecorate(null, null, _storedName_decorators, { kind: "field", name: "storedName", static: false, private: false, access: { has: function (obj) { return "storedName" in obj; }, get: function (obj) { return obj.storedName; }, set: function (obj, value) { obj.storedName = value; } }, metadata: _metadata }, _storedName_initializers, _storedName_extraInitializers);
        __esDecorate(null, null, _mimeType_decorators, { kind: "field", name: "mimeType", static: false, private: false, access: { has: function (obj) { return "mimeType" in obj; }, get: function (obj) { return obj.mimeType; }, set: function (obj, value) { obj.mimeType = value; } }, metadata: _metadata }, _mimeType_initializers, _mimeType_extraInitializers);
        __esDecorate(null, null, _sizeBytes_decorators, { kind: "field", name: "sizeBytes", static: false, private: false, access: { has: function (obj) { return "sizeBytes" in obj; }, get: function (obj) { return obj.sizeBytes; }, set: function (obj, value) { obj.sizeBytes = value; } }, metadata: _metadata }, _sizeBytes_initializers, _sizeBytes_extraInitializers);
        __esDecorate(null, null, _checksum_decorators, { kind: "field", name: "checksum", static: false, private: false, access: { has: function (obj) { return "checksum" in obj; }, get: function (obj) { return obj.checksum; }, set: function (obj, value) { obj.checksum = value; } }, metadata: _metadata }, _checksum_initializers, _checksum_extraInitializers);
        __esDecorate(null, null, _isLatest_decorators, { kind: "field", name: "isLatest", static: false, private: false, access: { has: function (obj) { return "isLatest" in obj; }, get: function (obj) { return obj.isLatest; }, set: function (obj, value) { obj.isLatest = value; } }, metadata: _metadata }, _isLatest_initializers, _isLatest_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: function (obj) { return "createdBy" in obj; }, get: function (obj) { return obj.createdBy; }, set: function (obj, value) { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocVersion = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocVersion = _classThis;
}();
exports.DocVersion = DocVersion;
exports.DocVersionSchema = mongoose_1.SchemaFactory.createForClass(DocVersion);
exports.DocVersionSchema.index({ streamId: 1, versionNo: 1 }, { unique: true });
exports.DocVersionSchema.index({ streamId: 1, isLatest: 1 });
exports.DocVersionSchema.index({ urnNo: 1, processType: 1, renewalCycleId: 1 });
