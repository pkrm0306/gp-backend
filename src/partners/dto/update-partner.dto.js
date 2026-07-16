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
exports.UpdatePartnerDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var UpdatePartnerDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _countryCode_decorators;
    var _countryCode_initializers = [];
    var _countryCode_extraInitializers = [];
    var _country_code_decorators;
    var _country_code_initializers = [];
    var _country_code_extraInitializers = [];
    var _dialCode_decorators;
    var _dialCode_initializers = [];
    var _dialCode_extraInitializers = [];
    var _dial_code_decorators;
    var _dial_code_initializers = [];
    var _dial_code_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _mobile_decorators;
    var _mobile_initializers = [];
    var _mobile_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _confirmPassword_decorators;
    var _confirmPassword_initializers = [];
    var _confirmPassword_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePartnerDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.countryCode = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _countryCode_initializers, void 0));
                this.country_code = (__runInitializers(this, _countryCode_extraInitializers), __runInitializers(this, _country_code_initializers, void 0));
                this.dialCode = (__runInitializers(this, _country_code_extraInitializers), __runInitializers(this, _dialCode_initializers, void 0));
                this.dial_code = (__runInitializers(this, _dialCode_extraInitializers), __runInitializers(this, _dial_code_initializers, void 0));
                this.phone = (__runInitializers(this, _dial_code_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.mobile = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _mobile_initializers, void 0));
                this.password = (__runInitializers(this, _mobile_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.confirmPassword = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _confirmPassword_initializers, void 0));
                __runInitializers(this, _confirmPassword_extraInitializers);
            }
            return UpdatePartnerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Partner name' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Partner email address' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value == null
                        ? value
                        : String(value)
                            .trim()
                            .toLowerCase();
                })];
            _countryCode_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: '+91',
                    description: 'Country dial code (required when updating local mobile digits)',
                }), (0, class_validator_1.ValidateIf)(function (dto) {
                    var _b, _c;
                    var raw = String((_c = (_b = dto.phone) !== null && _b !== void 0 ? _b : dto.mobile) !== null && _c !== void 0 ? _c : '').trim();
                    return raw.length > 0 && !raw.startsWith('+');
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'countryCode is required for local phone numbers' }), (0, class_transformer_1.Transform)(function (_b) {
                    var _c, _d;
                    var value = _b.value, obj = _b.obj;
                    return String((_d = (_c = value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.country_code) !== null && _c !== void 0 ? _c : obj === null || obj === void 0 ? void 0 : obj.dialCode) !== null && _d !== void 0 ? _d : '').trim();
                }), (0, class_validator_1.Matches)(/^\+?[0-9]{1,4}$/, {
                    message: 'countryCode must be a valid dial code (1–4 digits, optional +)',
                })];
            _country_code_decorators = [(0, class_validator_1.Allow)()];
            _dialCode_decorators = [(0, class_validator_1.Allow)()];
            _dial_code_decorators = [(0, class_validator_1.Allow)()];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _mobile_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Mobile number (alias for phone)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _password_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'New password (only updates when provided)',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(6)];
            _confirmPassword_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Required when password is provided; must match password',
                }), (0, class_validator_1.ValidateIf)(function (dto) { var _b; return Boolean((_b = dto.password) === null || _b === void 0 ? void 0 : _b.trim()); }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _countryCode_decorators, { kind: "field", name: "countryCode", static: false, private: false, access: { has: function (obj) { return "countryCode" in obj; }, get: function (obj) { return obj.countryCode; }, set: function (obj, value) { obj.countryCode = value; } }, metadata: _metadata }, _countryCode_initializers, _countryCode_extraInitializers);
            __esDecorate(null, null, _country_code_decorators, { kind: "field", name: "country_code", static: false, private: false, access: { has: function (obj) { return "country_code" in obj; }, get: function (obj) { return obj.country_code; }, set: function (obj, value) { obj.country_code = value; } }, metadata: _metadata }, _country_code_initializers, _country_code_extraInitializers);
            __esDecorate(null, null, _dialCode_decorators, { kind: "field", name: "dialCode", static: false, private: false, access: { has: function (obj) { return "dialCode" in obj; }, get: function (obj) { return obj.dialCode; }, set: function (obj, value) { obj.dialCode = value; } }, metadata: _metadata }, _dialCode_initializers, _dialCode_extraInitializers);
            __esDecorate(null, null, _dial_code_decorators, { kind: "field", name: "dial_code", static: false, private: false, access: { has: function (obj) { return "dial_code" in obj; }, get: function (obj) { return obj.dial_code; }, set: function (obj, value) { obj.dial_code = value; } }, metadata: _metadata }, _dial_code_initializers, _dial_code_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _mobile_decorators, { kind: "field", name: "mobile", static: false, private: false, access: { has: function (obj) { return "mobile" in obj; }, get: function (obj) { return obj.mobile; }, set: function (obj, value) { obj.mobile = value; } }, metadata: _metadata }, _mobile_initializers, _mobile_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _confirmPassword_decorators, { kind: "field", name: "confirmPassword", static: false, private: false, access: { has: function (obj) { return "confirmPassword" in obj; }, get: function (obj) { return obj.confirmPassword; }, set: function (obj, value) { obj.confirmPassword = value; } }, metadata: _metadata }, _confirmPassword_initializers, _confirmPassword_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePartnerDto = UpdatePartnerDto;
