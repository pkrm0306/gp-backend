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
exports.WebsiteAnalyticsEventSchema = exports.WebsiteAnalyticsEvent = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var WebsiteAnalyticsEvent = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: { createdAt: true, updatedAt: false }, collection: 'website_analytics_events' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _eventType_decorators;
    var _eventType_initializers = [];
    var _eventType_extraInitializers = [];
    var _visitorId_decorators;
    var _visitorId_initializers = [];
    var _visitorId_extraInitializers = [];
    var _path_decorators;
    var _path_initializers = [];
    var _path_extraInitializers = [];
    var _signUpType_decorators;
    var _signUpType_initializers = [];
    var _signUpType_extraInitializers = [];
    var _measurementId_decorators;
    var _measurementId_initializers = [];
    var _measurementId_extraInitializers = [];
    var WebsiteAnalyticsEvent = _classThis = /** @class */ (function () {
        function WebsiteAnalyticsEvent_1() {
            this.eventType = __runInitializers(this, _eventType_initializers, void 0);
            /** Anonymous browser session id generated on the public website. */
            this.visitorId = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _visitorId_initializers, void 0));
            this.path = (__runInitializers(this, _visitorId_extraInitializers), __runInitializers(this, _path_initializers, void 0));
            this.signUpType = (__runInitializers(this, _path_extraInitializers), __runInitializers(this, _signUpType_initializers, void 0));
            this.measurementId = (__runInitializers(this, _signUpType_extraInitializers), __runInitializers(this, _measurementId_initializers, void 0));
            this.createdAt = __runInitializers(this, _measurementId_extraInitializers);
        }
        return WebsiteAnalyticsEvent_1;
    }());
    __setFunctionName(_classThis, "WebsiteAnalyticsEvent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _eventType_decorators = [(0, mongoose_1.Prop)({ required: true, enum: ['page_view', 'sign_up'], index: true })];
        _visitorId_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true, index: true })];
        _path_decorators = [(0, mongoose_1.Prop)({ trim: true })];
        _signUpType_decorators = [(0, mongoose_1.Prop)({ trim: true })];
        _measurementId_decorators = [(0, mongoose_1.Prop)({ trim: true })];
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: function (obj) { return "eventType" in obj; }, get: function (obj) { return obj.eventType; }, set: function (obj, value) { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _visitorId_decorators, { kind: "field", name: "visitorId", static: false, private: false, access: { has: function (obj) { return "visitorId" in obj; }, get: function (obj) { return obj.visitorId; }, set: function (obj, value) { obj.visitorId = value; } }, metadata: _metadata }, _visitorId_initializers, _visitorId_extraInitializers);
        __esDecorate(null, null, _path_decorators, { kind: "field", name: "path", static: false, private: false, access: { has: function (obj) { return "path" in obj; }, get: function (obj) { return obj.path; }, set: function (obj, value) { obj.path = value; } }, metadata: _metadata }, _path_initializers, _path_extraInitializers);
        __esDecorate(null, null, _signUpType_decorators, { kind: "field", name: "signUpType", static: false, private: false, access: { has: function (obj) { return "signUpType" in obj; }, get: function (obj) { return obj.signUpType; }, set: function (obj, value) { obj.signUpType = value; } }, metadata: _metadata }, _signUpType_initializers, _signUpType_extraInitializers);
        __esDecorate(null, null, _measurementId_decorators, { kind: "field", name: "measurementId", static: false, private: false, access: { has: function (obj) { return "measurementId" in obj; }, get: function (obj) { return obj.measurementId; }, set: function (obj, value) { obj.measurementId = value; } }, metadata: _metadata }, _measurementId_initializers, _measurementId_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebsiteAnalyticsEvent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebsiteAnalyticsEvent = _classThis;
}();
exports.WebsiteAnalyticsEvent = WebsiteAnalyticsEvent;
exports.WebsiteAnalyticsEventSchema = mongoose_1.SchemaFactory.createForClass(WebsiteAnalyticsEvent);
exports.WebsiteAnalyticsEventSchema.index({ createdAt: 1, eventType: 1 });
