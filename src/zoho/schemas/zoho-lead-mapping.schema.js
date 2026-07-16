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
exports.ZohoLeadMappingSchema = exports.ZohoLeadMapping = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ZohoLeadMapping = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'zoho_lead_mappings', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _portalUserId_decorators;
    var _portalUserId_initializers = [];
    var _portalUserId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _zohoLeadId_decorators;
    var _zohoLeadId_initializers = [];
    var _zohoLeadId_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _company_decorators;
    var _company_initializers = [];
    var _company_extraInitializers = [];
    var _source_decorators;
    var _source_initializers = [];
    var _source_extraInitializers = [];
    var _lastSyncedAt_decorators;
    var _lastSyncedAt_initializers = [];
    var _lastSyncedAt_extraInitializers = [];
    var _rawSnapshot_decorators;
    var _rawSnapshot_initializers = [];
    var _rawSnapshot_extraInitializers = [];
    var ZohoLeadMapping = _classThis = /** @class */ (function () {
        function ZohoLeadMapping_1() {
            this.portalUserId = __runInitializers(this, _portalUserId_initializers, void 0);
            this.vendorId = (__runInitializers(this, _portalUserId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.zohoLeadId = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _zohoLeadId_initializers, void 0));
            this.email = (__runInitializers(this, _zohoLeadId_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.company = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _company_initializers, void 0));
            this.source = (__runInitializers(this, _company_extraInitializers), __runInitializers(this, _source_initializers, void 0));
            this.lastSyncedAt = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _lastSyncedAt_initializers, void 0));
            this.rawSnapshot = (__runInitializers(this, _lastSyncedAt_extraInitializers), __runInitializers(this, _rawSnapshot_initializers, void 0));
            __runInitializers(this, _rawSnapshot_extraInitializers);
        }
        return ZohoLeadMapping_1;
    }());
    __setFunctionName(_classThis, "ZohoLeadMapping");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _portalUserId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId })];
        _zohoLeadId_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _email_decorators = [(0, mongoose_1.Prop)()];
        _company_decorators = [(0, mongoose_1.Prop)()];
        _source_decorators = [(0, mongoose_1.Prop)({ default: 'vendor-registration' })];
        _lastSyncedAt_decorators = [(0, mongoose_1.Prop)()];
        _rawSnapshot_decorators = [(0, mongoose_1.Prop)({ type: Object })];
        __esDecorate(null, null, _portalUserId_decorators, { kind: "field", name: "portalUserId", static: false, private: false, access: { has: function (obj) { return "portalUserId" in obj; }, get: function (obj) { return obj.portalUserId; }, set: function (obj, value) { obj.portalUserId = value; } }, metadata: _metadata }, _portalUserId_initializers, _portalUserId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _zohoLeadId_decorators, { kind: "field", name: "zohoLeadId", static: false, private: false, access: { has: function (obj) { return "zohoLeadId" in obj; }, get: function (obj) { return obj.zohoLeadId; }, set: function (obj, value) { obj.zohoLeadId = value; } }, metadata: _metadata }, _zohoLeadId_initializers, _zohoLeadId_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _company_decorators, { kind: "field", name: "company", static: false, private: false, access: { has: function (obj) { return "company" in obj; }, get: function (obj) { return obj.company; }, set: function (obj, value) { obj.company = value; } }, metadata: _metadata }, _company_initializers, _company_extraInitializers);
        __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: function (obj) { return "source" in obj; }, get: function (obj) { return obj.source; }, set: function (obj, value) { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
        __esDecorate(null, null, _lastSyncedAt_decorators, { kind: "field", name: "lastSyncedAt", static: false, private: false, access: { has: function (obj) { return "lastSyncedAt" in obj; }, get: function (obj) { return obj.lastSyncedAt; }, set: function (obj, value) { obj.lastSyncedAt = value; } }, metadata: _metadata }, _lastSyncedAt_initializers, _lastSyncedAt_extraInitializers);
        __esDecorate(null, null, _rawSnapshot_decorators, { kind: "field", name: "rawSnapshot", static: false, private: false, access: { has: function (obj) { return "rawSnapshot" in obj; }, get: function (obj) { return obj.rawSnapshot; }, set: function (obj, value) { obj.rawSnapshot = value; } }, metadata: _metadata }, _rawSnapshot_initializers, _rawSnapshot_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoLeadMapping = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoLeadMapping = _classThis;
}();
exports.ZohoLeadMapping = ZohoLeadMapping;
exports.ZohoLeadMappingSchema = mongoose_1.SchemaFactory.createForClass(ZohoLeadMapping);
exports.ZohoLeadMappingSchema.index({ portalUserId: 1 }, { unique: true });
exports.ZohoLeadMappingSchema.index({ manufacturerId: 1 }, { unique: true, sparse: true });
exports.ZohoLeadMappingSchema.index({ vendorId: 1 });
exports.ZohoLeadMappingSchema.index({ zohoLeadId: 1 }, { unique: true });
