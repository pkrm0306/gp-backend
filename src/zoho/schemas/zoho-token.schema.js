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
exports.ZohoTokenSchema = exports.ZohoToken = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var ZohoToken = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'zoho_tokens', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _key_decorators;
    var _key_initializers = [];
    var _key_extraInitializers = [];
    var _accessToken_decorators;
    var _accessToken_initializers = [];
    var _accessToken_extraInitializers = [];
    var _refreshToken_decorators;
    var _refreshToken_initializers = [];
    var _refreshToken_extraInitializers = [];
    var _apiDomain_decorators;
    var _apiDomain_initializers = [];
    var _apiDomain_extraInitializers = [];
    var _expiresAt_decorators;
    var _expiresAt_initializers = [];
    var _expiresAt_extraInitializers = [];
    var _lastRefreshError_decorators;
    var _lastRefreshError_initializers = [];
    var _lastRefreshError_extraInitializers = [];
    var _lastRefreshedAt_decorators;
    var _lastRefreshedAt_initializers = [];
    var _lastRefreshedAt_extraInitializers = [];
    var ZohoToken = _classThis = /** @class */ (function () {
        function ZohoToken_1() {
            this.key = __runInitializers(this, _key_initializers, void 0);
            this.accessToken = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _accessToken_initializers, void 0));
            this.refreshToken = (__runInitializers(this, _accessToken_extraInitializers), __runInitializers(this, _refreshToken_initializers, void 0));
            this.apiDomain = (__runInitializers(this, _refreshToken_extraInitializers), __runInitializers(this, _apiDomain_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _apiDomain_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.lastRefreshError = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _lastRefreshError_initializers, void 0));
            this.lastRefreshedAt = (__runInitializers(this, _lastRefreshError_extraInitializers), __runInitializers(this, _lastRefreshedAt_initializers, void 0));
            __runInitializers(this, _lastRefreshedAt_extraInitializers);
        }
        return ZohoToken_1;
    }());
    __setFunctionName(_classThis, "ZohoToken");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _key_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true, default: 'primary' })];
        _accessToken_decorators = [(0, mongoose_1.Prop)()];
        _refreshToken_decorators = [(0, mongoose_1.Prop)()];
        _apiDomain_decorators = [(0, mongoose_1.Prop)()];
        _expiresAt_decorators = [(0, mongoose_1.Prop)()];
        _lastRefreshError_decorators = [(0, mongoose_1.Prop)()];
        _lastRefreshedAt_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: function (obj) { return "key" in obj; }, get: function (obj) { return obj.key; }, set: function (obj, value) { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
        __esDecorate(null, null, _accessToken_decorators, { kind: "field", name: "accessToken", static: false, private: false, access: { has: function (obj) { return "accessToken" in obj; }, get: function (obj) { return obj.accessToken; }, set: function (obj, value) { obj.accessToken = value; } }, metadata: _metadata }, _accessToken_initializers, _accessToken_extraInitializers);
        __esDecorate(null, null, _refreshToken_decorators, { kind: "field", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; }, set: function (obj, value) { obj.refreshToken = value; } }, metadata: _metadata }, _refreshToken_initializers, _refreshToken_extraInitializers);
        __esDecorate(null, null, _apiDomain_decorators, { kind: "field", name: "apiDomain", static: false, private: false, access: { has: function (obj) { return "apiDomain" in obj; }, get: function (obj) { return obj.apiDomain; }, set: function (obj, value) { obj.apiDomain = value; } }, metadata: _metadata }, _apiDomain_initializers, _apiDomain_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: function (obj) { return "expiresAt" in obj; }, get: function (obj) { return obj.expiresAt; }, set: function (obj, value) { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _lastRefreshError_decorators, { kind: "field", name: "lastRefreshError", static: false, private: false, access: { has: function (obj) { return "lastRefreshError" in obj; }, get: function (obj) { return obj.lastRefreshError; }, set: function (obj, value) { obj.lastRefreshError = value; } }, metadata: _metadata }, _lastRefreshError_initializers, _lastRefreshError_extraInitializers);
        __esDecorate(null, null, _lastRefreshedAt_decorators, { kind: "field", name: "lastRefreshedAt", static: false, private: false, access: { has: function (obj) { return "lastRefreshedAt" in obj; }, get: function (obj) { return obj.lastRefreshedAt; }, set: function (obj, value) { obj.lastRefreshedAt = value; } }, metadata: _metadata }, _lastRefreshedAt_initializers, _lastRefreshedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoToken = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoToken = _classThis;
}();
exports.ZohoToken = ZohoToken;
exports.ZohoTokenSchema = mongoose_1.SchemaFactory.createForClass(ZohoToken);
exports.ZohoTokenSchema.index({ key: 1 }, { unique: true });
