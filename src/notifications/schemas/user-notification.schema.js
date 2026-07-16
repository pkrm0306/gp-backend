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
exports.UserNotificationSchema = exports.UserNotification = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
/**
 * Per-user in-app notifications (distinct from admin `notifications` system feed).
 * Collection: user_notifications
 */
var UserNotification = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            collection: 'user_notifications',
            timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _user_id_decorators;
    var _user_id_initializers = [];
    var _user_id_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _notify_type_decorators;
    var _notify_type_initializers = [];
    var _notify_type_extraInitializers = [];
    var _seen_decorators;
    var _seen_initializers = [];
    var _seen_extraInitializers = [];
    var _deleted_at_decorators;
    var _deleted_at_initializers = [];
    var _deleted_at_extraInitializers = [];
    var UserNotification = _classThis = /** @class */ (function () {
        function UserNotification_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.user_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _user_id_initializers, void 0));
            this.title = (__runInitializers(this, _user_id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.type = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.notify_type = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _notify_type_initializers, void 0));
            /** 0 = unseen, 1 = seen */
            this.seen = (__runInitializers(this, _notify_type_extraInitializers), __runInitializers(this, _seen_initializers, void 0));
            this.deleted_at = (__runInitializers(this, _seen_extraInitializers), __runInitializers(this, _deleted_at_initializers, void 0));
            __runInitializers(this, _deleted_at_extraInitializers);
        }
        return UserNotification_1;
    }());
    __setFunctionName(_classThis, "UserNotification");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _user_id_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, index: true })];
        _title_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _content_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _type_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true, default: 'info' })];
        _notify_type_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _seen_decorators = [(0, mongoose_1.Prop)({ required: true, default: 0 })];
        _deleted_at_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _user_id_decorators, { kind: "field", name: "user_id", static: false, private: false, access: { has: function (obj) { return "user_id" in obj; }, get: function (obj) { return obj.user_id; }, set: function (obj, value) { obj.user_id = value; } }, metadata: _metadata }, _user_id_initializers, _user_id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _notify_type_decorators, { kind: "field", name: "notify_type", static: false, private: false, access: { has: function (obj) { return "notify_type" in obj; }, get: function (obj) { return obj.notify_type; }, set: function (obj, value) { obj.notify_type = value; } }, metadata: _metadata }, _notify_type_initializers, _notify_type_extraInitializers);
        __esDecorate(null, null, _seen_decorators, { kind: "field", name: "seen", static: false, private: false, access: { has: function (obj) { return "seen" in obj; }, get: function (obj) { return obj.seen; }, set: function (obj, value) { obj.seen = value; } }, metadata: _metadata }, _seen_initializers, _seen_extraInitializers);
        __esDecorate(null, null, _deleted_at_decorators, { kind: "field", name: "deleted_at", static: false, private: false, access: { has: function (obj) { return "deleted_at" in obj; }, get: function (obj) { return obj.deleted_at; }, set: function (obj, value) { obj.deleted_at = value; } }, metadata: _metadata }, _deleted_at_initializers, _deleted_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserNotification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserNotification = _classThis;
}();
exports.UserNotification = UserNotification;
exports.UserNotificationSchema = mongoose_1.SchemaFactory.createForClass(UserNotification);
exports.UserNotificationSchema.index({ user_id: 1, seen: 1, created_at: -1 });
exports.UserNotificationSchema.index({ user_id: 1, deleted_at: 1 });
