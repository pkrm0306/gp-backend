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
exports.NewsletterSubscriberSchema = exports.NewsletterSubscriber = void 0;
var mongoose_1 = require("@nestjs/mongoose");
/**
 * Existing Atlas/prod data uses Mongoose’s default pluralized name
 * (`newslettersubscribers`), not `newsletter_subscribers`.
 */
var NewsletterSubscriber = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true, collection: 'newslettersubscribers' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _subscribedFor_decorators;
    var _subscribedFor_initializers = [];
    var _subscribedFor_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var NewsletterSubscriber = _classThis = /** @class */ (function () {
        function NewsletterSubscriber_1() {
            this.email = __runInitializers(this, _email_initializers, void 0);
            /**
             * Human-readable preference labels (e.g. "Green Products", "Events").
             * Kept as strings to match UI labels.
             */
            this.subscribedFor = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _subscribedFor_initializers, void 0));
            /** 1 = active (toggle on), 0 = inactive (toggle off). */
            this.status = (__runInitializers(this, _subscribedFor_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = __runInitializers(this, _status_extraInitializers);
        }
        return NewsletterSubscriber_1;
    }());
    __setFunctionName(_classThis, "NewsletterSubscriber");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _email_decorators = [(0, mongoose_1.Prop)({
                required: true,
                unique: true,
                index: true,
                lowercase: true,
                trim: true,
            })];
        _subscribedFor_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _status_decorators = [(0, mongoose_1.Prop)({ default: 1 })];
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _subscribedFor_decorators, { kind: "field", name: "subscribedFor", static: false, private: false, access: { has: function (obj) { return "subscribedFor" in obj; }, get: function (obj) { return obj.subscribedFor; }, set: function (obj, value) { obj.subscribedFor = value; } }, metadata: _metadata }, _subscribedFor_initializers, _subscribedFor_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NewsletterSubscriber = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NewsletterSubscriber = _classThis;
}();
exports.NewsletterSubscriber = NewsletterSubscriber;
exports.NewsletterSubscriberSchema = mongoose_1.SchemaFactory.createForClass(NewsletterSubscriber);
