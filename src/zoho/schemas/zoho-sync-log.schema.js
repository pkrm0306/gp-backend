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
exports.ZohoSyncLogSchema = exports.ZohoSyncLog = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var ZohoSyncLog = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'zoho_sync_logs', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _operation_decorators;
    var _operation_initializers = [];
    var _operation_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _portalEntityId_decorators;
    var _portalEntityId_initializers = [];
    var _portalEntityId_extraInitializers = [];
    var _zohoModule_decorators;
    var _zohoModule_initializers = [];
    var _zohoModule_extraInitializers = [];
    var _zohoRecordId_decorators;
    var _zohoRecordId_initializers = [];
    var _zohoRecordId_extraInitializers = [];
    var _requestPayload_decorators;
    var _requestPayload_initializers = [];
    var _requestPayload_extraInitializers = [];
    var _responsePayload_decorators;
    var _responsePayload_initializers = [];
    var _responsePayload_extraInitializers = [];
    var _errorCode_decorators;
    var _errorCode_initializers = [];
    var _errorCode_extraInitializers = [];
    var _errorMessage_decorators;
    var _errorMessage_initializers = [];
    var _errorMessage_extraInitializers = [];
    var _attempts_decorators;
    var _attempts_initializers = [];
    var _attempts_extraInitializers = [];
    var _correlationId_decorators;
    var _correlationId_initializers = [];
    var _correlationId_extraInitializers = [];
    var ZohoSyncLog = _classThis = /** @class */ (function () {
        function ZohoSyncLog_1() {
            this.operation = __runInitializers(this, _operation_initializers, void 0);
            this.status = (__runInitializers(this, _operation_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.portalEntityId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _portalEntityId_initializers, void 0));
            this.zohoModule = (__runInitializers(this, _portalEntityId_extraInitializers), __runInitializers(this, _zohoModule_initializers, void 0));
            this.zohoRecordId = (__runInitializers(this, _zohoModule_extraInitializers), __runInitializers(this, _zohoRecordId_initializers, void 0));
            this.requestPayload = (__runInitializers(this, _zohoRecordId_extraInitializers), __runInitializers(this, _requestPayload_initializers, void 0));
            this.responsePayload = (__runInitializers(this, _requestPayload_extraInitializers), __runInitializers(this, _responsePayload_initializers, void 0));
            this.errorCode = (__runInitializers(this, _responsePayload_extraInitializers), __runInitializers(this, _errorCode_initializers, void 0));
            this.errorMessage = (__runInitializers(this, _errorCode_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
            this.attempts = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _attempts_initializers, void 0));
            this.correlationId = (__runInitializers(this, _attempts_extraInitializers), __runInitializers(this, _correlationId_initializers, void 0));
            __runInitializers(this, _correlationId_extraInitializers);
        }
        return ZohoSyncLog_1;
    }());
    __setFunctionName(_classThis, "ZohoSyncLog");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _operation_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _status_decorators = [(0, mongoose_1.Prop)({ required: true, enum: ['queued', 'success', 'failed', 'skipped'] })];
        _portalEntityId_decorators = [(0, mongoose_1.Prop)()];
        _zohoModule_decorators = [(0, mongoose_1.Prop)()];
        _zohoRecordId_decorators = [(0, mongoose_1.Prop)()];
        _requestPayload_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _responsePayload_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        _errorCode_decorators = [(0, mongoose_1.Prop)()];
        _errorMessage_decorators = [(0, mongoose_1.Prop)()];
        _attempts_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _correlationId_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: function (obj) { return "operation" in obj; }, get: function (obj) { return obj.operation; }, set: function (obj, value) { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _portalEntityId_decorators, { kind: "field", name: "portalEntityId", static: false, private: false, access: { has: function (obj) { return "portalEntityId" in obj; }, get: function (obj) { return obj.portalEntityId; }, set: function (obj, value) { obj.portalEntityId = value; } }, metadata: _metadata }, _portalEntityId_initializers, _portalEntityId_extraInitializers);
        __esDecorate(null, null, _zohoModule_decorators, { kind: "field", name: "zohoModule", static: false, private: false, access: { has: function (obj) { return "zohoModule" in obj; }, get: function (obj) { return obj.zohoModule; }, set: function (obj, value) { obj.zohoModule = value; } }, metadata: _metadata }, _zohoModule_initializers, _zohoModule_extraInitializers);
        __esDecorate(null, null, _zohoRecordId_decorators, { kind: "field", name: "zohoRecordId", static: false, private: false, access: { has: function (obj) { return "zohoRecordId" in obj; }, get: function (obj) { return obj.zohoRecordId; }, set: function (obj, value) { obj.zohoRecordId = value; } }, metadata: _metadata }, _zohoRecordId_initializers, _zohoRecordId_extraInitializers);
        __esDecorate(null, null, _requestPayload_decorators, { kind: "field", name: "requestPayload", static: false, private: false, access: { has: function (obj) { return "requestPayload" in obj; }, get: function (obj) { return obj.requestPayload; }, set: function (obj, value) { obj.requestPayload = value; } }, metadata: _metadata }, _requestPayload_initializers, _requestPayload_extraInitializers);
        __esDecorate(null, null, _responsePayload_decorators, { kind: "field", name: "responsePayload", static: false, private: false, access: { has: function (obj) { return "responsePayload" in obj; }, get: function (obj) { return obj.responsePayload; }, set: function (obj, value) { obj.responsePayload = value; } }, metadata: _metadata }, _responsePayload_initializers, _responsePayload_extraInitializers);
        __esDecorate(null, null, _errorCode_decorators, { kind: "field", name: "errorCode", static: false, private: false, access: { has: function (obj) { return "errorCode" in obj; }, get: function (obj) { return obj.errorCode; }, set: function (obj, value) { obj.errorCode = value; } }, metadata: _metadata }, _errorCode_initializers, _errorCode_extraInitializers);
        __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: function (obj) { return "errorMessage" in obj; }, get: function (obj) { return obj.errorMessage; }, set: function (obj, value) { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
        __esDecorate(null, null, _attempts_decorators, { kind: "field", name: "attempts", static: false, private: false, access: { has: function (obj) { return "attempts" in obj; }, get: function (obj) { return obj.attempts; }, set: function (obj, value) { obj.attempts = value; } }, metadata: _metadata }, _attempts_initializers, _attempts_extraInitializers);
        __esDecorate(null, null, _correlationId_decorators, { kind: "field", name: "correlationId", static: false, private: false, access: { has: function (obj) { return "correlationId" in obj; }, get: function (obj) { return obj.correlationId; }, set: function (obj, value) { obj.correlationId = value; } }, metadata: _metadata }, _correlationId_initializers, _correlationId_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoSyncLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoSyncLog = _classThis;
}();
exports.ZohoSyncLog = ZohoSyncLog;
exports.ZohoSyncLogSchema = mongoose_1.SchemaFactory.createForClass(ZohoSyncLog);
exports.ZohoSyncLogSchema.index({ operation: 1, status: 1 });
exports.ZohoSyncLogSchema.index({ portalEntityId: 1 });
exports.ZohoSyncLogSchema.index({ createdAt: -1 });
