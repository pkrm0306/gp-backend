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
exports.CreateBannerDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var readable_text_validator_1 = require("../../common/validators/readable-text.validator");
var CreateBannerDto = function () {
    var _a;
    var _imageUrl_decorators;
    var _imageUrl_initializers = [];
    var _imageUrl_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _sequenceNumber_decorators;
    var _sequenceNumber_initializers = [];
    var _sequenceNumber_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _imageSource_decorators;
    var _imageSource_initializers = [];
    var _imageSource_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _videoDurationSeconds_decorators;
    var _videoDurationSeconds_initializers = [];
    var _videoDurationSeconds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateBannerDto() {
                this.imageUrl = __runInitializers(this, _imageUrl_initializers, void 0);
                this.title = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.sequenceNumber = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _sequenceNumber_initializers, void 0));
                this.status = (__runInitializers(this, _sequenceNumber_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.imageSource = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _imageSource_initializers, void 0));
                this.description = (__runInitializers(this, _imageSource_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.videoDurationSeconds = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _videoDurationSeconds_initializers, void 0));
                __runInitializers(this, _videoDurationSeconds_extraInitializers);
            }
            return CreateBannerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _imageUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: '/uploads/banners/banner-123.jpg',
                    description: 'Banner image URL/path. Optional when uploading multipart file `image`.',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null)
                        return undefined;
                    var v = String(value).trim();
                    return v === '' ? undefined : v;
                }), (0, class_validator_1.Matches)(/^(https?:\/\/.+|\/uploads\/.+)$/i, {
                    message: 'imageUrl must be a full http(s) URL or a /uploads/... path',
                })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Summer sale', description: 'Title of your banner' }), (0, class_validator_1.IsString)(), (0, readable_text_validator_1.IsReadableNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _sequenceNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 1,
                    description: 'Display sequence number for this banner (optional)',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null)
                        return undefined;
                    var raw = String(value).trim();
                    if (!raw)
                        return undefined;
                    return Number(raw);
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'active',
                    description: 'Initial banner status',
                    enum: ['active', 'inactive', '1', '0'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _imageSource_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'How the image was supplied (informational). On create, the server sets **binary_upload** when multipart `image` is sent, otherwise **manual_url** from `imageUrl`.',
                    enum: ['binary_upload', 'manual_url'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsIn)(['binary_upload', 'manual_url'])];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Up to 50% off selected items.',
                    description: 'Banner description (max 1000 readable characters)',
                }), (0, class_validator_1.IsString)(), (0, readable_text_validator_1.IsReadableNotEmpty)(), (0, readable_text_validator_1.MaxReadableLength)(1000), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _videoDurationSeconds_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Video duration in seconds measured in the admin UI before upload.',
                    example: 29.5,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '')
                        return undefined;
                    var n = Number.parseFloat(String(value).trim());
                    return Number.isFinite(n) ? n : undefined;
                })];
            __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: function (obj) { return "imageUrl" in obj; }, get: function (obj) { return obj.imageUrl; }, set: function (obj, value) { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _sequenceNumber_decorators, { kind: "field", name: "sequenceNumber", static: false, private: false, access: { has: function (obj) { return "sequenceNumber" in obj; }, get: function (obj) { return obj.sequenceNumber; }, set: function (obj, value) { obj.sequenceNumber = value; } }, metadata: _metadata }, _sequenceNumber_initializers, _sequenceNumber_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _imageSource_decorators, { kind: "field", name: "imageSource", static: false, private: false, access: { has: function (obj) { return "imageSource" in obj; }, get: function (obj) { return obj.imageSource; }, set: function (obj, value) { obj.imageSource = value; } }, metadata: _metadata }, _imageSource_initializers, _imageSource_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _videoDurationSeconds_decorators, { kind: "field", name: "videoDurationSeconds", static: false, private: false, access: { has: function (obj) { return "videoDurationSeconds" in obj; }, get: function (obj) { return obj.videoDurationSeconds; }, set: function (obj, value) { obj.videoDurationSeconds = value; } }, metadata: _metadata }, _videoDurationSeconds_initializers, _videoDurationSeconds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateBannerDto = CreateBannerDto;
