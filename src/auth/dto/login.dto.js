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
exports.LoginDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var vendor_login_email_util_1 = require("../../vendor-users/utils/vendor-login-email.util");
var LoginDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _username_decorators;
    var _username_initializers = [];
    var _username_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _portal_decorators;
    var _portal_initializers = [];
    var _portal_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LoginDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.username = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _username_initializers, void 0));
                this.password = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.portal = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _portal_initializers, void 0));
                __runInitializers(this, _portal_extraInitializers);
            }
            return LoginDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'user@example.com',
                    description: 'Login email. If omitted, **username** is used (vendor team member forms often label this field as username).',
                }), (0, class_validator_1.ValidateIf)(function (dto) { var _b; return !String((_b = dto.username) !== null && _b !== void 0 ? _b : '').trim(); }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === null || value === undefined) {
                        return value;
                    }
                    if (Array.isArray(value)) {
                        return (0, vendor_login_email_util_1.normalizeLoginEmail)(value[0]);
                    }
                    return (0, vendor_login_email_util_1.normalizeLoginEmail)(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEmail)({}, { message: 'email must be a valid email address' })];
            _username_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'user@example.com',
                    description: 'Alias for **email** when the client sends `username` instead.',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === null || value === undefined) {
                        return value;
                    }
                    if (Array.isArray(value)) {
                        return (0, vendor_login_email_util_1.normalizeLoginEmail)(value[0]);
                    }
                    return (0, vendor_login_email_util_1.normalizeLoginEmail)(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.ValidateIf)(function (dto) { var _b; return !String((_b = dto.email) !== null && _b !== void 0 ? _b : '').trim(); }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEmail)({}, { message: 'username must be a valid email address' })];
            _password_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _portal_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['admin', 'vendor'],
                    description: 'Portal context for login. admin portal allows admin/staff only; vendor portal allows vendor/partner only.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsIn)(['admin', 'vendor'])];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: function (obj) { return "username" in obj; }, get: function (obj) { return obj.username; }, set: function (obj, value) { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _portal_decorators, { kind: "field", name: "portal", static: false, private: false, access: { has: function (obj) { return "portal" in obj; }, get: function (obj) { return obj.portal; }, set: function (obj, value) { obj.portal = value; } }, metadata: _metadata }, _portal_initializers, _portal_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoginDto = LoginDto;
