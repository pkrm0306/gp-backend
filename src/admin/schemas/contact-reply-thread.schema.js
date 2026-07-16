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
exports.ContactReplyThreadSchema = exports.ContactReplyThread = exports.ContactReplyEntry = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ContactReplyEntry = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _adminReply_decorators;
    var _adminReply_initializers = [];
    var _adminReply_extraInitializers = [];
    var _repliedAt_decorators;
    var _repliedAt_initializers = [];
    var _repliedAt_extraInitializers = [];
    var ContactReplyEntry = _classThis = /** @class */ (function () {
        function ContactReplyEntry_1() {
            this.adminReply = __runInitializers(this, _adminReply_initializers, void 0);
            this.repliedAt = (__runInitializers(this, _adminReply_extraInitializers), __runInitializers(this, _repliedAt_initializers, void 0));
            __runInitializers(this, _repliedAt_extraInitializers);
        }
        return ContactReplyEntry_1;
    }());
    __setFunctionName(_classThis, "ContactReplyEntry");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _adminReply_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _repliedAt_decorators = [(0, mongoose_1.Prop)({ required: true, default: function () { return new Date(); } })];
        __esDecorate(null, null, _adminReply_decorators, { kind: "field", name: "adminReply", static: false, private: false, access: { has: function (obj) { return "adminReply" in obj; }, get: function (obj) { return obj.adminReply; }, set: function (obj, value) { obj.adminReply = value; } }, metadata: _metadata }, _adminReply_initializers, _adminReply_extraInitializers);
        __esDecorate(null, null, _repliedAt_decorators, { kind: "field", name: "repliedAt", static: false, private: false, access: { has: function (obj) { return "repliedAt" in obj; }, get: function (obj) { return obj.repliedAt; }, set: function (obj, value) { obj.repliedAt = value; } }, metadata: _metadata }, _repliedAt_initializers, _repliedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContactReplyEntry = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContactReplyEntry = _classThis;
}();
exports.ContactReplyEntry = ContactReplyEntry;
var ContactReplyEntrySchema = mongoose_1.SchemaFactory.createForClass(ContactReplyEntry);
var ContactReplyThread = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'contact_reply_threads', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _contactMessageId_decorators;
    var _contactMessageId_initializers = [];
    var _contactMessageId_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _conversations_decorators;
    var _conversations_initializers = [];
    var _conversations_extraInitializers = [];
    var ContactReplyThread = _classThis = /** @class */ (function () {
        function ContactReplyThread_1() {
            this.contactMessageId = __runInitializers(this, _contactMessageId_initializers, void 0);
            this.email = (__runInitializers(this, _contactMessageId_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.conversations = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _conversations_initializers, void 0));
            this.createdAt = __runInitializers(this, _conversations_extraInitializers);
        }
        return ContactReplyThread_1;
    }());
    __setFunctionName(_classThis, "ContactReplyThread");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _contactMessageId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, unique: true, index: true })];
        _email_decorators = [(0, mongoose_1.Prop)({ required: true, lowercase: true, trim: true })];
        _conversations_decorators = [(0, mongoose_1.Prop)({ type: [ContactReplyEntrySchema], default: [] })];
        __esDecorate(null, null, _contactMessageId_decorators, { kind: "field", name: "contactMessageId", static: false, private: false, access: { has: function (obj) { return "contactMessageId" in obj; }, get: function (obj) { return obj.contactMessageId; }, set: function (obj, value) { obj.contactMessageId = value; } }, metadata: _metadata }, _contactMessageId_initializers, _contactMessageId_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _conversations_decorators, { kind: "field", name: "conversations", static: false, private: false, access: { has: function (obj) { return "conversations" in obj; }, get: function (obj) { return obj.conversations; }, set: function (obj, value) { obj.conversations = value; } }, metadata: _metadata }, _conversations_initializers, _conversations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContactReplyThread = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContactReplyThread = _classThis;
}();
exports.ContactReplyThread = ContactReplyThread;
exports.ContactReplyThreadSchema = mongoose_1.SchemaFactory.createForClass(ContactReplyThread);
