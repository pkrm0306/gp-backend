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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterSubscribeDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function toOptionalBoolean(value) {
    if (value === undefined || value === null || value === '')
        return undefined;
    if (typeof value === 'boolean')
        return value;
    if (typeof value === 'number')
        return value === 1;
    var normalized = String(value).trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized))
        return true;
    if (['false', '0', 'no', 'off'].includes(normalized))
        return false;
    return undefined;
}
var NewsletterSubscribeDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _greenProducts_decorators;
    var _greenProducts_initializers = [];
    var _greenProducts_extraInitializers = [];
    var _events_decorators;
    var _events_initializers = [];
    var _events_extraInitializers = [];
    var _captcha_decorators;
    var _captcha_initializers = [];
    var _captcha_extraInitializers = [];
    return _a = /** @class */ (function () {
            function NewsletterSubscribeDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.greenProducts = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _greenProducts_initializers, void 0));
                this.events = (__runInitializers(this, _greenProducts_extraInitializers), __runInitializers(this, _events_initializers, void 0));
                this.captcha = (__runInitializers(this, _events_extraInitializers), __runInitializers(this, _captcha_initializers, void 0));
                __runInitializers(this, _captcha_extraInitializers);
            }
            return NewsletterSubscribeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, swagger_1.ApiProperty)({ example: 'user@example.com' }), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            _greenProducts_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Checkbox: Green Products',
                    example: true,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return toOptionalBoolean(value);
                }), (0, class_validator_1.IsBoolean)()];
            _events_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Checkbox: Events',
                    example: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return toOptionalBoolean(value);
                }), (0, class_validator_1.IsBoolean)()];
            _captcha_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Captcha text user typed (backend does not validate image captcha)',
                    example: 'n7cUb',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _greenProducts_decorators, { kind: "field", name: "greenProducts", static: false, private: false, access: { has: function (obj) { return "greenProducts" in obj; }, get: function (obj) { return obj.greenProducts; }, set: function (obj, value) { obj.greenProducts = value; } }, metadata: _metadata }, _greenProducts_initializers, _greenProducts_extraInitializers);
            __esDecorate(null, null, _events_decorators, { kind: "field", name: "events", static: false, private: false, access: { has: function (obj) { return "events" in obj; }, get: function (obj) { return obj.events; }, set: function (obj, value) { obj.events = value; } }, metadata: _metadata }, _events_initializers, _events_extraInitializers);
            __esDecorate(null, null, _captcha_decorators, { kind: "field", name: "captcha", static: false, private: false, access: { has: function (obj) { return "captcha" in obj; }, get: function (obj) { return obj.captcha; }, set: function (obj, value) { obj.captcha = value; } }, metadata: _metadata }, _captcha_initializers, _captcha_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.NewsletterSubscribeDto = NewsletterSubscribeDto;
