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
exports.RegisterVendorDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var RegisterVendorDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _companySize_decorators;
    var _companySize_initializers = [];
    var _companySize_extraInitializers = [];
    var _companyName_decorators;
    var _companyName_initializers = [];
    var _companyName_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _countryCode_decorators;
    var _countryCode_initializers = [];
    var _countryCode_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _confirmPassword_decorators;
    var _confirmPassword_initializers = [];
    var _confirmPassword_extraInitializers = [];
    var _captchaToken_decorators;
    var _captchaToken_initializers = [];
    var _captchaToken_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterVendorDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.companySize = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _companySize_initializers, void 0));
                this.companyName = (__runInitializers(this, _companySize_extraInitializers), __runInitializers(this, _companyName_initializers, void 0));
                this.email = (__runInitializers(this, _companyName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.countryCode = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _countryCode_initializers, void 0));
                this.password = (__runInitializers(this, _countryCode_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.confirmPassword = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _confirmPassword_initializers, void 0));
                this.captchaToken = (__runInitializers(this, _confirmPassword_extraInitializers), __runInitializers(this, _captchaToken_initializers, void 0));
                __runInitializers(this, _captchaToken_extraInitializers);
            }
            return RegisterVendorDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Primary contact / account holder display name.',
                    example: 'Jane Doe',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (typeof value === 'string' ? value.trim() : value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _companySize_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Company size band (free text or app-defined value, e.g. "1-10", "11-50", "201+").',
                    example: '11-50',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (typeof value === 'string' ? value.trim() : value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(64)];
            _companyName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (typeof value === 'string' ? value.trim() : value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({ example: 'niharika@gmail.com' }), (0, class_transformer_1.Transform)(function (_b) {
                    var _c;
                    var value = _b.value;
                    if (value === null || value === undefined) {
                        return value;
                    }
                    if (Array.isArray(value)) {
                        return String((_c = value[0]) !== null && _c !== void 0 ? _c : '').trim().toLowerCase();
                    }
                    return String(value).trim().toLowerCase();
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEmail)({}, { message: 'email must be a valid email address' })];
            _phone_decorators = [(0, swagger_1.ApiProperty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var _c;
                    var value = _b.value;
                    if (value === null || value === undefined) {
                        return value;
                    }
                    if (Array.isArray(value)) {
                        return String((_c = value[0]) !== null && _c !== void 0 ? _c : '').trim();
                    }
                    return String(value).trim();
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _countryCode_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: '+91',
                    description: 'Optional country dial code. If `phone` is local digits, backend prefixes this code (e.g. +91 + 9848447383 => +919848447383).',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _password_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(6)];
            _confirmPassword_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _captchaToken_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Google reCAPTCHA v2 response token from the signup checkbox.',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (typeof value === 'string' ? value.trim() : value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'Please complete the reCAPTCHA verification.' })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _companySize_decorators, { kind: "field", name: "companySize", static: false, private: false, access: { has: function (obj) { return "companySize" in obj; }, get: function (obj) { return obj.companySize; }, set: function (obj, value) { obj.companySize = value; } }, metadata: _metadata }, _companySize_initializers, _companySize_extraInitializers);
            __esDecorate(null, null, _companyName_decorators, { kind: "field", name: "companyName", static: false, private: false, access: { has: function (obj) { return "companyName" in obj; }, get: function (obj) { return obj.companyName; }, set: function (obj, value) { obj.companyName = value; } }, metadata: _metadata }, _companyName_initializers, _companyName_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _countryCode_decorators, { kind: "field", name: "countryCode", static: false, private: false, access: { has: function (obj) { return "countryCode" in obj; }, get: function (obj) { return obj.countryCode; }, set: function (obj, value) { obj.countryCode = value; } }, metadata: _metadata }, _countryCode_initializers, _countryCode_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _confirmPassword_decorators, { kind: "field", name: "confirmPassword", static: false, private: false, access: { has: function (obj) { return "confirmPassword" in obj; }, get: function (obj) { return obj.confirmPassword; }, set: function (obj, value) { obj.confirmPassword = value; } }, metadata: _metadata }, _confirmPassword_initializers, _confirmPassword_extraInitializers);
            __esDecorate(null, null, _captchaToken_decorators, { kind: "field", name: "captchaToken", static: false, private: false, access: { has: function (obj) { return "captchaToken" in obj; }, get: function (obj) { return obj.captchaToken; }, set: function (obj, value) { obj.captchaToken = value; } }, metadata: _metadata }, _captchaToken_initializers, _captchaToken_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterVendorDto = RegisterVendorDto;
