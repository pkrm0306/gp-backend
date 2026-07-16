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
exports.ManufacturerInquiryDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
/**
 * Manufacturer inquiry POST body — visitor fields from the public form.
 * reCAPTCHA is **not required** for this endpoint (optional widget on the UI only).
 * Manufacturer can be provided via body/query `manufacturerId`.
 */
var ManufacturerInquiryDto = function () {
    var _a;
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
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
    var _phoneNumber_decorators;
    var _phoneNumber_initializers = [];
    var _phoneNumber_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _contact_decorators;
    var _contact_initializers = [];
    var _contact_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _captchaToken_decorators;
    var _captchaToken_initializers = [];
    var _captchaToken_extraInitializers = [];
    var _recaptchaToken_decorators;
    var _recaptchaToken_initializers = [];
    var _recaptchaToken_extraInitializers = [];
    var _gRecaptchaResponse_decorators;
    var _gRecaptchaResponse_initializers = [];
    var _gRecaptchaResponse_extraInitializers = [];
    var _member_decorators;
    var _member_initializers = [];
    var _member_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _urnNumber_decorators;
    var _urnNumber_initializers = [];
    var _urnNumber_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _urn_no_decorators;
    var _urn_no_initializers = [];
    var _urn_no_extraInitializers = [];
    var _designation_decorators;
    var _designation_initializers = [];
    var _designation_extraInitializers = [];
    var _organisation_decorators;
    var _organisation_initializers = [];
    var _organisation_extraInitializers = [];
    var _organization_decorators;
    var _organization_initializers = [];
    var _organization_extraInitializers = [];
    var _org_decorators;
    var _org_initializers = [];
    var _org_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ManufacturerInquiryDto() {
                this.manufacturerId = __runInitializers(this, _manufacturerId_initializers, void 0);
                this.name = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.countryCode = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _countryCode_initializers, void 0));
                this.country_code = (__runInitializers(this, _countryCode_extraInitializers), __runInitializers(this, _country_code_initializers, void 0));
                this.dialCode = (__runInitializers(this, _country_code_extraInitializers), __runInitializers(this, _dialCode_initializers, void 0));
                this.dial_code = (__runInitializers(this, _dialCode_extraInitializers), __runInitializers(this, _dial_code_initializers, void 0));
                this.phoneNumber = (__runInitializers(this, _dial_code_extraInitializers), __runInitializers(this, _phoneNumber_initializers, void 0));
                this.phone = (__runInitializers(this, _phoneNumber_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.contact = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _contact_initializers, void 0));
                this.message = (__runInitializers(this, _contact_extraInitializers), __runInitializers(this, _message_initializers, void 0));
                this.subject = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
                /** Ignored by API — allowed so frontends may send widget tokens without failing validation. */
                this.captchaToken = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _captchaToken_initializers, void 0));
                this.recaptchaToken = (__runInitializers(this, _captchaToken_extraInitializers), __runInitializers(this, _recaptchaToken_initializers, void 0));
                this.gRecaptchaResponse = (__runInitializers(this, _recaptchaToken_extraInitializers), __runInitializers(this, _gRecaptchaResponse_initializers, void 0));
                this['g-recaptcha-response'] = (__runInitializers(this, _gRecaptchaResponse_extraInitializers), __runInitializers(this, _member_initializers, void 0));
                this.productId = (__runInitializers(this, _member_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.categoryId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.urnNumber = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _urnNumber_initializers, void 0));
                this.urnNo = (__runInitializers(this, _urnNumber_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
                this.urn_no = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _urn_no_initializers, void 0));
                this.designation = (__runInitializers(this, _urn_no_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
                this.organisation = (__runInitializers(this, _designation_extraInitializers), __runInitializers(this, _organisation_initializers, void 0));
                this.organization = (__runInitializers(this, _organisation_extraInitializers), __runInitializers(this, _organization_initializers, void 0));
                this.org = (__runInitializers(this, _organization_extraInitializers), __runInitializers(this, _org_initializers, void 0));
                __runInitializers(this, _org_extraInitializers);
            }
            return ManufacturerInquiryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _manufacturerId_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    example: '680c9ccbe5fce6d879ec4aa1',
                    description: 'Manufacturer id (Mongo ObjectId). Preferred in body for API clients.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'John Doe' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                }), (0, class_validator_1.Length)(2, 80)];
            _email_decorators = [(0, swagger_1.ApiProperty)({ example: 'you@example.com' }), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '')
                        .trim()
                        .toLowerCase();
                })];
            _countryCode_decorators = [(0, swagger_1.ApiProperty)({
                    example: '+91',
                    description: 'Country dial code from the phone selector (e.g. `+91`, `91`). Required when `phoneNumber` is local digits without a leading `+`.',
                }), (0, class_validator_1.ValidateIf)(function (o) {
                    var _b, _c, _d;
                    var p = String((_d = (_c = (_b = o.phoneNumber) !== null && _b !== void 0 ? _b : o.phone) !== null && _c !== void 0 ? _c : o.contact) !== null && _d !== void 0 ? _d : '').trim();
                    return p.length > 0 && !p.startsWith('+');
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
            _phoneNumber_decorators = [(0, swagger_1.ApiProperty)({
                    example: '9876543210',
                    description: 'Local phone number (without country code) or full international number starting with `+`. Aliases: `phone`, `contact`.',
                }), (0, class_validator_1.ValidateIf)(function (o) {
                    return o.phoneNumber !== undefined ||
                        (o.phone === undefined && o.contact === undefined);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                }), (0, class_validator_1.Length)(6, 15), (0, class_validator_1.Matches)(/^[0-9+\-\s()]+$/, {
                    message: 'phoneNumber contains invalid characters',
                })];
            _phone_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    example: '9876543210',
                    description: 'Alias for `phoneNumber`.',
                }), (0, class_validator_1.ValidateIf)(function (o) {
                    return o.phone !== undefined ||
                        (o.phoneNumber === undefined && o.contact === undefined);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                }), (0, class_validator_1.Length)(6, 15), (0, class_validator_1.Matches)(/^[0-9+\-\s()]+$/, {
                    message: 'phone contains invalid characters',
                })];
            _contact_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    example: '9876543210',
                    description: 'Deprecated alias for `phoneNumber`.',
                }), (0, class_validator_1.ValidateIf)(function (o) {
                    return o.contact !== undefined ||
                        (o.phoneNumber === undefined && o.phone === undefined);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                }), (0, class_validator_1.Length)(6, 15), (0, class_validator_1.Matches)(/^[0-9+\-\s()]+$/, {
                    message: 'contact contains invalid characters',
                })];
            _message_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    example: 'I would like more details about your products.',
                    description: 'Optional visitor message. The public manufacturer inquiry form does not collect this field.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    var trimmed = String(value !== null && value !== void 0 ? value : '').trim();
                    return trimmed === '' ? undefined : trimmed;
                }), (0, class_validator_1.ValidateIf)(function (_, value) { return value !== undefined; }), (0, class_validator_1.Length)(5, 2000)];
            _subject_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    example: 'Inquiry regarding your catalog',
                    description: 'Optional custom subject line for customer email.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                }), (0, class_validator_1.Length)(3, 200)];
            _captchaToken_decorators = [(0, class_validator_1.Allow)()];
            _recaptchaToken_decorators = [(0, class_validator_1.Allow)()];
            _gRecaptchaResponse_decorators = [(0, class_validator_1.Allow)()];
            _member_decorators = [(0, class_validator_1.Allow)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ required: false, description: 'Mongo product id from product detail page.' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _categoryId_decorators = [(0, swagger_1.ApiProperty)({ required: false, description: 'Category id from product detail page.' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _urnNumber_decorators = [(0, swagger_1.ApiProperty)({ required: false, description: 'Product URN number.' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var _c, _d, _e;
                    var value = _b.value, obj = _b.obj;
                    return String((_e = (_d = (_c = value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.urnNo) !== null && _c !== void 0 ? _c : obj === null || obj === void 0 ? void 0 : obj.urn_no) !== null && _d !== void 0 ? _d : obj === null || obj === void 0 ? void 0 : obj.urnNumber) !== null && _e !== void 0 ? _e : '').trim();
                })];
            _urnNo_decorators = [(0, class_validator_1.Allow)()];
            _urn_no_decorators = [(0, class_validator_1.Allow)()];
            _designation_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _organisation_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var _c, _d;
                    var value = _b.value, obj = _b.obj;
                    return String((_d = (_c = value !== null && value !== void 0 ? value : obj === null || obj === void 0 ? void 0 : obj.organization) !== null && _c !== void 0 ? _c : obj === null || obj === void 0 ? void 0 : obj.org) !== null && _d !== void 0 ? _d : '').trim();
                })];
            _organization_decorators = [(0, class_validator_1.Allow)()];
            _org_decorators = [(0, class_validator_1.Allow)()];
            __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _countryCode_decorators, { kind: "field", name: "countryCode", static: false, private: false, access: { has: function (obj) { return "countryCode" in obj; }, get: function (obj) { return obj.countryCode; }, set: function (obj, value) { obj.countryCode = value; } }, metadata: _metadata }, _countryCode_initializers, _countryCode_extraInitializers);
            __esDecorate(null, null, _country_code_decorators, { kind: "field", name: "country_code", static: false, private: false, access: { has: function (obj) { return "country_code" in obj; }, get: function (obj) { return obj.country_code; }, set: function (obj, value) { obj.country_code = value; } }, metadata: _metadata }, _country_code_initializers, _country_code_extraInitializers);
            __esDecorate(null, null, _dialCode_decorators, { kind: "field", name: "dialCode", static: false, private: false, access: { has: function (obj) { return "dialCode" in obj; }, get: function (obj) { return obj.dialCode; }, set: function (obj, value) { obj.dialCode = value; } }, metadata: _metadata }, _dialCode_initializers, _dialCode_extraInitializers);
            __esDecorate(null, null, _dial_code_decorators, { kind: "field", name: "dial_code", static: false, private: false, access: { has: function (obj) { return "dial_code" in obj; }, get: function (obj) { return obj.dial_code; }, set: function (obj, value) { obj.dial_code = value; } }, metadata: _metadata }, _dial_code_initializers, _dial_code_extraInitializers);
            __esDecorate(null, null, _phoneNumber_decorators, { kind: "field", name: "phoneNumber", static: false, private: false, access: { has: function (obj) { return "phoneNumber" in obj; }, get: function (obj) { return obj.phoneNumber; }, set: function (obj, value) { obj.phoneNumber = value; } }, metadata: _metadata }, _phoneNumber_initializers, _phoneNumber_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _contact_decorators, { kind: "field", name: "contact", static: false, private: false, access: { has: function (obj) { return "contact" in obj; }, get: function (obj) { return obj.contact; }, set: function (obj, value) { obj.contact = value; } }, metadata: _metadata }, _contact_initializers, _contact_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _captchaToken_decorators, { kind: "field", name: "captchaToken", static: false, private: false, access: { has: function (obj) { return "captchaToken" in obj; }, get: function (obj) { return obj.captchaToken; }, set: function (obj, value) { obj.captchaToken = value; } }, metadata: _metadata }, _captchaToken_initializers, _captchaToken_extraInitializers);
            __esDecorate(null, null, _recaptchaToken_decorators, { kind: "field", name: "recaptchaToken", static: false, private: false, access: { has: function (obj) { return "recaptchaToken" in obj; }, get: function (obj) { return obj.recaptchaToken; }, set: function (obj, value) { obj.recaptchaToken = value; } }, metadata: _metadata }, _recaptchaToken_initializers, _recaptchaToken_extraInitializers);
            __esDecorate(null, null, _gRecaptchaResponse_decorators, { kind: "field", name: "gRecaptchaResponse", static: false, private: false, access: { has: function (obj) { return "gRecaptchaResponse" in obj; }, get: function (obj) { return obj.gRecaptchaResponse; }, set: function (obj, value) { obj.gRecaptchaResponse = value; } }, metadata: _metadata }, _gRecaptchaResponse_initializers, _gRecaptchaResponse_extraInitializers);
            __esDecorate(null, null, _member_decorators, { kind: "field", name: 'g-recaptcha-response', static: false, private: false, access: { has: function (obj) { return 'g-recaptcha-response' in obj; }, get: function (obj) { return obj['g-recaptcha-response']; }, set: function (obj, value) { obj['g-recaptcha-response'] = value; } }, metadata: _metadata }, _member_initializers, _member_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _urnNumber_decorators, { kind: "field", name: "urnNumber", static: false, private: false, access: { has: function (obj) { return "urnNumber" in obj; }, get: function (obj) { return obj.urnNumber; }, set: function (obj, value) { obj.urnNumber = value; } }, metadata: _metadata }, _urnNumber_initializers, _urnNumber_extraInitializers);
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _urn_no_decorators, { kind: "field", name: "urn_no", static: false, private: false, access: { has: function (obj) { return "urn_no" in obj; }, get: function (obj) { return obj.urn_no; }, set: function (obj, value) { obj.urn_no = value; } }, metadata: _metadata }, _urn_no_initializers, _urn_no_extraInitializers);
            __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: function (obj) { return "designation" in obj; }, get: function (obj) { return obj.designation; }, set: function (obj, value) { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
            __esDecorate(null, null, _organisation_decorators, { kind: "field", name: "organisation", static: false, private: false, access: { has: function (obj) { return "organisation" in obj; }, get: function (obj) { return obj.organisation; }, set: function (obj, value) { obj.organisation = value; } }, metadata: _metadata }, _organisation_initializers, _organisation_extraInitializers);
            __esDecorate(null, null, _organization_decorators, { kind: "field", name: "organization", static: false, private: false, access: { has: function (obj) { return "organization" in obj; }, get: function (obj) { return obj.organization; }, set: function (obj, value) { obj.organization = value; } }, metadata: _metadata }, _organization_initializers, _organization_extraInitializers);
            __esDecorate(null, null, _org_decorators, { kind: "field", name: "org", static: false, private: false, access: { has: function (obj) { return "org" in obj; }, get: function (obj) { return obj.org; }, set: function (obj, value) { obj.org = value; } }, metadata: _metadata }, _org_initializers, _org_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ManufacturerInquiryDto = ManufacturerInquiryDto;
