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
exports.UpdateProfileDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var UpdateProfileDto = function () {
    var _a;
    var _companyName_decorators;
    var _companyName_initializers = [];
    var _companyName_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _designation_decorators;
    var _designation_initializers = [];
    var _designation_extraInitializers = [];
    var _gst_decorators;
    var _gst_initializers = [];
    var _gst_extraInitializers = [];
    var _gstNumber_decorators;
    var _gstNumber_initializers = [];
    var _gstNumber_extraInitializers = [];
    var _companyLogo_decorators;
    var _companyLogo_initializers = [];
    var _companyLogo_extraInitializers = [];
    var _pan_decorators;
    var _pan_initializers = [];
    var _pan_extraInitializers = [];
    var _panNumber_decorators;
    var _panNumber_initializers = [];
    var _panNumber_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _mobile_decorators;
    var _mobile_initializers = [];
    var _mobile_extraInitializers = [];
    var _facebook_decorators;
    var _facebook_initializers = [];
    var _facebook_extraInitializers = [];
    var _facebookUrl_decorators;
    var _facebookUrl_initializers = [];
    var _facebookUrl_extraInitializers = [];
    var _youtube_decorators;
    var _youtube_initializers = [];
    var _youtube_extraInitializers = [];
    var _youtubeUrl_decorators;
    var _youtubeUrl_initializers = [];
    var _youtubeUrl_extraInitializers = [];
    var _twitter_decorators;
    var _twitter_initializers = [];
    var _twitter_extraInitializers = [];
    var _twitterUrl_decorators;
    var _twitterUrl_initializers = [];
    var _twitterUrl_extraInitializers = [];
    var _linkedin_decorators;
    var _linkedin_initializers = [];
    var _linkedin_extraInitializers = [];
    var _linkedinUrl_decorators;
    var _linkedinUrl_initializers = [];
    var _linkedinUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateProfileDto() {
                this.companyName = __runInitializers(this, _companyName_initializers, void 0);
                this.name = (__runInitializers(this, _companyName_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.designation = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
                this.gst = (__runInitializers(this, _designation_extraInitializers), __runInitializers(this, _gst_initializers, void 0));
                this.gstNumber = (__runInitializers(this, _gst_extraInitializers), __runInitializers(this, _gstNumber_initializers, void 0));
                this.companyLogo = (__runInitializers(this, _gstNumber_extraInitializers), __runInitializers(this, _companyLogo_initializers, void 0));
                this.pan = (__runInitializers(this, _companyLogo_extraInitializers), __runInitializers(this, _pan_initializers, void 0));
                this.panNumber = (__runInitializers(this, _pan_extraInitializers), __runInitializers(this, _panNumber_initializers, void 0));
                this.email = (__runInitializers(this, _panNumber_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.mobile = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _mobile_initializers, void 0));
                this.facebook = (__runInitializers(this, _mobile_extraInitializers), __runInitializers(this, _facebook_initializers, void 0));
                this.facebookUrl = (__runInitializers(this, _facebook_extraInitializers), __runInitializers(this, _facebookUrl_initializers, void 0));
                this.youtube = (__runInitializers(this, _facebookUrl_extraInitializers), __runInitializers(this, _youtube_initializers, void 0));
                this.youtubeUrl = (__runInitializers(this, _youtube_extraInitializers), __runInitializers(this, _youtubeUrl_initializers, void 0));
                this.twitter = (__runInitializers(this, _youtubeUrl_extraInitializers), __runInitializers(this, _twitter_initializers, void 0));
                this.twitterUrl = (__runInitializers(this, _twitter_extraInitializers), __runInitializers(this, _twitterUrl_initializers, void 0));
                this.linkedin = (__runInitializers(this, _twitterUrl_extraInitializers), __runInitializers(this, _linkedin_initializers, void 0));
                this.linkedinUrl = (__runInitializers(this, _linkedin_extraInitializers), __runInitializers(this, _linkedinUrl_initializers, void 0));
                __runInitializers(this, _linkedinUrl_extraInitializers);
            }
            return UpdateProfileDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _companyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Company name', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor name', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _designation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Designation', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _gst_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: '**GST certificate** as a public URL path (e.g. `/uploads/manufacturers/vendor-gst-….pdf`) or absolute `https://…` URL. ' +
                        'If you send a plain GST number (no leading `/` or `http`), it is treated as **gstNumber** for backward compatibility. ' +
                        'Prefer **gstNumber** for the GST id text and **gst** for the document URL. Multipart uploads for this field must be **PDF, JPG, or PNG** only (.pdf, .jpg, .jpeg, .png).',
                    example: '/uploads/manufacturers/vendor-gst-123.pdf',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _gstNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'GST identification text (trimmed / uppercased for storage; no fixed format). Omit when you only upload a certificate file.',
                    example: '29AABCU9603R1ZM',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(64)];
            _companyLogo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Company logo image URL path (e.g. `/uploads/manufacturers/company-logo-….png`).',
                    example: '/uploads/manufacturers/company-logo-456.png',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _pan_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'PAN **document** URL path (e.g. `/uploads/manufacturers/...` or `https://…`) after upload, **or** a plain PAN id string for backward compatibility. Multipart uploads for the PAN file must be **PDF, JPG, or PNG** only (.pdf, .jpg, .jpeg, .png).',
                    example: '/uploads/manufacturers/1730000000000_pan.jpg',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _panNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Optional PAN id / reference text (trimmed / uppercased; no fixed pattern). **Omit** when you only upload a scan (**pan** / **panDocument**). Multipart may send this as an array — first non-empty value is used.',
                    example: 'ABCDE1234F',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null) {
                        return undefined;
                    }
                    if (Array.isArray(value)) {
                        var first = value.find(function (v) { return v !== undefined && v !== null && String(v).trim() !== ''; });
                        if (first === undefined) {
                            return undefined;
                        }
                        var s_1 = String(first).trim();
                        return s_1 === '' ? undefined : s_1;
                    }
                    var s = String(value).trim();
                    return s === '' ? undefined : s;
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email address', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _mobile_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mobile number', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _facebook_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Facebook page URL. Send an empty string to clear.',
                    example: 'https://www.facebook.com/yourcompany',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _facebookUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `facebook` (vendor panel).',
                    example: 'https://www.facebook.com/yourcompany',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _youtube_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'YouTube channel URL. Send an empty string to clear.',
                    example: 'https://www.youtube.com/@yourcompany',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _youtubeUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `youtube` (vendor panel).',
                    example: 'https://www.youtube.com/@yourcompany',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _twitter_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Twitter / X profile URL. Send an empty string to clear.',
                    example: 'https://x.com/yourcompany',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _twitterUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `twitter` (vendor panel).',
                    example: 'https://x.com/yourcompany',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _linkedin_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'LinkedIn company page URL. Send an empty string to clear.',
                    example: 'https://www.linkedin.com/company/yourcompany',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            _linkedinUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `linkedin` (vendor panel).',
                    example: 'https://www.linkedin.com/company/yourcompany',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1024)];
            __esDecorate(null, null, _companyName_decorators, { kind: "field", name: "companyName", static: false, private: false, access: { has: function (obj) { return "companyName" in obj; }, get: function (obj) { return obj.companyName; }, set: function (obj, value) { obj.companyName = value; } }, metadata: _metadata }, _companyName_initializers, _companyName_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: function (obj) { return "designation" in obj; }, get: function (obj) { return obj.designation; }, set: function (obj, value) { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
            __esDecorate(null, null, _gst_decorators, { kind: "field", name: "gst", static: false, private: false, access: { has: function (obj) { return "gst" in obj; }, get: function (obj) { return obj.gst; }, set: function (obj, value) { obj.gst = value; } }, metadata: _metadata }, _gst_initializers, _gst_extraInitializers);
            __esDecorate(null, null, _gstNumber_decorators, { kind: "field", name: "gstNumber", static: false, private: false, access: { has: function (obj) { return "gstNumber" in obj; }, get: function (obj) { return obj.gstNumber; }, set: function (obj, value) { obj.gstNumber = value; } }, metadata: _metadata }, _gstNumber_initializers, _gstNumber_extraInitializers);
            __esDecorate(null, null, _companyLogo_decorators, { kind: "field", name: "companyLogo", static: false, private: false, access: { has: function (obj) { return "companyLogo" in obj; }, get: function (obj) { return obj.companyLogo; }, set: function (obj, value) { obj.companyLogo = value; } }, metadata: _metadata }, _companyLogo_initializers, _companyLogo_extraInitializers);
            __esDecorate(null, null, _pan_decorators, { kind: "field", name: "pan", static: false, private: false, access: { has: function (obj) { return "pan" in obj; }, get: function (obj) { return obj.pan; }, set: function (obj, value) { obj.pan = value; } }, metadata: _metadata }, _pan_initializers, _pan_extraInitializers);
            __esDecorate(null, null, _panNumber_decorators, { kind: "field", name: "panNumber", static: false, private: false, access: { has: function (obj) { return "panNumber" in obj; }, get: function (obj) { return obj.panNumber; }, set: function (obj, value) { obj.panNumber = value; } }, metadata: _metadata }, _panNumber_initializers, _panNumber_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _mobile_decorators, { kind: "field", name: "mobile", static: false, private: false, access: { has: function (obj) { return "mobile" in obj; }, get: function (obj) { return obj.mobile; }, set: function (obj, value) { obj.mobile = value; } }, metadata: _metadata }, _mobile_initializers, _mobile_extraInitializers);
            __esDecorate(null, null, _facebook_decorators, { kind: "field", name: "facebook", static: false, private: false, access: { has: function (obj) { return "facebook" in obj; }, get: function (obj) { return obj.facebook; }, set: function (obj, value) { obj.facebook = value; } }, metadata: _metadata }, _facebook_initializers, _facebook_extraInitializers);
            __esDecorate(null, null, _facebookUrl_decorators, { kind: "field", name: "facebookUrl", static: false, private: false, access: { has: function (obj) { return "facebookUrl" in obj; }, get: function (obj) { return obj.facebookUrl; }, set: function (obj, value) { obj.facebookUrl = value; } }, metadata: _metadata }, _facebookUrl_initializers, _facebookUrl_extraInitializers);
            __esDecorate(null, null, _youtube_decorators, { kind: "field", name: "youtube", static: false, private: false, access: { has: function (obj) { return "youtube" in obj; }, get: function (obj) { return obj.youtube; }, set: function (obj, value) { obj.youtube = value; } }, metadata: _metadata }, _youtube_initializers, _youtube_extraInitializers);
            __esDecorate(null, null, _youtubeUrl_decorators, { kind: "field", name: "youtubeUrl", static: false, private: false, access: { has: function (obj) { return "youtubeUrl" in obj; }, get: function (obj) { return obj.youtubeUrl; }, set: function (obj, value) { obj.youtubeUrl = value; } }, metadata: _metadata }, _youtubeUrl_initializers, _youtubeUrl_extraInitializers);
            __esDecorate(null, null, _twitter_decorators, { kind: "field", name: "twitter", static: false, private: false, access: { has: function (obj) { return "twitter" in obj; }, get: function (obj) { return obj.twitter; }, set: function (obj, value) { obj.twitter = value; } }, metadata: _metadata }, _twitter_initializers, _twitter_extraInitializers);
            __esDecorate(null, null, _twitterUrl_decorators, { kind: "field", name: "twitterUrl", static: false, private: false, access: { has: function (obj) { return "twitterUrl" in obj; }, get: function (obj) { return obj.twitterUrl; }, set: function (obj, value) { obj.twitterUrl = value; } }, metadata: _metadata }, _twitterUrl_initializers, _twitterUrl_extraInitializers);
            __esDecorate(null, null, _linkedin_decorators, { kind: "field", name: "linkedin", static: false, private: false, access: { has: function (obj) { return "linkedin" in obj; }, get: function (obj) { return obj.linkedin; }, set: function (obj, value) { obj.linkedin = value; } }, metadata: _metadata }, _linkedin_initializers, _linkedin_extraInitializers);
            __esDecorate(null, null, _linkedinUrl_decorators, { kind: "field", name: "linkedinUrl", static: false, private: false, access: { has: function (obj) { return "linkedinUrl" in obj; }, get: function (obj) { return obj.linkedinUrl; }, set: function (obj, value) { obj.linkedinUrl = value; } }, metadata: _metadata }, _linkedinUrl_initializers, _linkedinUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateProfileDto = UpdateProfileDto;
