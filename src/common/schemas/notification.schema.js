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
exports.NotificationSchema = exports.Notification = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var Notification = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'notifications', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _source_decorators;
    var _source_initializers = [];
    var _source_extraInitializers = [];
    var _referenceType_decorators;
    var _referenceType_initializers = [];
    var _referenceType_extraInitializers = [];
    var _referenceId_decorators;
    var _referenceId_initializers = [];
    var _referenceId_extraInitializers = [];
    var _actorName_decorators;
    var _actorName_initializers = [];
    var _actorName_extraInitializers = [];
    var _seen_decorators;
    var _seen_initializers = [];
    var _seen_extraInitializers = [];
    var _seenAt_decorators;
    var _seenAt_initializers = [];
    var _seenAt_extraInitializers = [];
    var Notification = _classThis = /** @class */ (function () {
        function Notification_1() {
            this.title = __runInitializers(this, _title_initializers, void 0);
            this.message = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.type = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.source = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _source_initializers, void 0));
            this.referenceType = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _referenceType_initializers, void 0));
            this.referenceId = (__runInitializers(this, _referenceType_extraInitializers), __runInitializers(this, _referenceId_initializers, void 0));
            this.actorName = (__runInitializers(this, _referenceId_extraInitializers), __runInitializers(this, _actorName_initializers, void 0));
            /** `0` = unseen, `1` = seen (admin bell feed). */
            this.seen = (__runInitializers(this, _actorName_extraInitializers), __runInitializers(this, _seen_initializers, void 0));
            this.seenAt = (__runInitializers(this, _seen_extraInitializers), __runInitializers(this, _seenAt_initializers, void 0));
            this.createdAt = __runInitializers(this, _seenAt_extraInitializers);
        }
        return Notification_1;
    }());
    __setFunctionName(_classThis, "Notification");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _title_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _message_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _type_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true, default: 'info' })];
        _source_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true, default: 'system' })];
        _referenceType_decorators = [(0, mongoose_1.Prop)({ trim: true })];
        _referenceId_decorators = [(0, mongoose_1.Prop)({ trim: true })];
        _actorName_decorators = [(0, mongoose_1.Prop)({ trim: true })];
        _seen_decorators = [(0, mongoose_1.Prop)({ required: true, default: 0 })];
        _seenAt_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: function (obj) { return "source" in obj; }, get: function (obj) { return obj.source; }, set: function (obj, value) { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
        __esDecorate(null, null, _referenceType_decorators, { kind: "field", name: "referenceType", static: false, private: false, access: { has: function (obj) { return "referenceType" in obj; }, get: function (obj) { return obj.referenceType; }, set: function (obj, value) { obj.referenceType = value; } }, metadata: _metadata }, _referenceType_initializers, _referenceType_extraInitializers);
        __esDecorate(null, null, _referenceId_decorators, { kind: "field", name: "referenceId", static: false, private: false, access: { has: function (obj) { return "referenceId" in obj; }, get: function (obj) { return obj.referenceId; }, set: function (obj, value) { obj.referenceId = value; } }, metadata: _metadata }, _referenceId_initializers, _referenceId_extraInitializers);
        __esDecorate(null, null, _actorName_decorators, { kind: "field", name: "actorName", static: false, private: false, access: { has: function (obj) { return "actorName" in obj; }, get: function (obj) { return obj.actorName; }, set: function (obj, value) { obj.actorName = value; } }, metadata: _metadata }, _actorName_initializers, _actorName_extraInitializers);
        __esDecorate(null, null, _seen_decorators, { kind: "field", name: "seen", static: false, private: false, access: { has: function (obj) { return "seen" in obj; }, get: function (obj) { return obj.seen; }, set: function (obj, value) { obj.seen = value; } }, metadata: _metadata }, _seen_initializers, _seen_extraInitializers);
        __esDecorate(null, null, _seenAt_decorators, { kind: "field", name: "seenAt", static: false, private: false, access: { has: function (obj) { return "seenAt" in obj; }, get: function (obj) { return obj.seenAt; }, set: function (obj, value) { obj.seenAt = value; } }, metadata: _metadata }, _seenAt_initializers, _seenAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Notification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Notification = _classThis;
}();
exports.Notification = Notification;
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.index({ createdAt: -1 });
exports.NotificationSchema.index({ seen: 1, createdAt: -1 });
