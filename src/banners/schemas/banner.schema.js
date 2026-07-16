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
exports.BannerSchema = exports.Banner = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var Banner = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _banner_image_decorators;
    var _banner_image_initializers = [];
    var _banner_image_extraInitializers = [];
    var _imageUrl_decorators;
    var _imageUrl_initializers = [];
    var _imageUrl_extraInitializers = [];
    var _imageSource_decorators;
    var _imageSource_initializers = [];
    var _imageSource_extraInitializers = [];
    var _banner_video_decorators;
    var _banner_video_initializers = [];
    var _banner_video_extraInitializers = [];
    var _videoUrl_decorators;
    var _videoUrl_initializers = [];
    var _videoUrl_extraInitializers = [];
    var _videoSource_decorators;
    var _videoSource_initializers = [];
    var _videoSource_extraInitializers = [];
    var _heading_decorators;
    var _heading_initializers = [];
    var _heading_extraInitializers = [];
    var _sequenceNumber_decorators;
    var _sequenceNumber_initializers = [];
    var _sequenceNumber_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var Banner = _classThis = /** @class */ (function () {
        function Banner_1() {
            this.vendorId = __runInitializers(this, _vendorId_initializers, void 0);
            /** Relative path stored in DB (for example: banners/file.jpg) */
            this.banner_image = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _banner_image_initializers, void 0));
            this.imageUrl = (__runInitializers(this, _banner_image_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
            /** Tracks how banner image was provided: uploaded file vs URL/path in form. */
            this.imageSource = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _imageSource_initializers, void 0));
            /** Relative path for uploaded banner video (e.g. banners/banner-video-….mp4). */
            this.banner_video = (__runInitializers(this, _imageSource_extraInitializers), __runInitializers(this, _banner_video_initializers, void 0));
            this.videoUrl = (__runInitializers(this, _banner_video_extraInitializers), __runInitializers(this, _videoUrl_initializers, void 0));
            /** Banner video is always provided via multipart upload (no manual URL). */
            this.videoSource = (__runInitializers(this, _videoUrl_extraInitializers), __runInitializers(this, _videoSource_initializers, void 0));
            this.heading = (__runInitializers(this, _videoSource_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
            this.sequenceNumber = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _sequenceNumber_initializers, void 0));
            this.description = (__runInitializers(this, _sequenceNumber_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            /** 1 = active (toggle on), 0 = inactive (toggle off). */
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = __runInitializers(this, _status_extraInitializers);
        }
        return Banner_1;
    }());
    __setFunctionName(_classThis, "Banner");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _banner_image_decorators = [(0, mongoose_1.Prop)({ required: false, default: '' })];
        _imageUrl_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _imageSource_decorators = [(0, mongoose_1.Prop)({
                type: String,
                enum: ['binary_upload', 'manual_url'],
                default: 'manual_url',
            })];
        _banner_video_decorators = [(0, mongoose_1.Prop)({ required: false, default: '' })];
        _videoUrl_decorators = [(0, mongoose_1.Prop)({ required: false, default: '' })];
        _videoSource_decorators = [(0, mongoose_1.Prop)({
                type: String,
                enum: ['binary_upload'],
                required: false,
            })];
        _heading_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _sequenceNumber_decorators = [(0, mongoose_1.Prop)({ required: true, min: 1 })];
        _description_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _status_decorators = [(0, mongoose_1.Prop)({ default: 1 })];
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _banner_image_decorators, { kind: "field", name: "banner_image", static: false, private: false, access: { has: function (obj) { return "banner_image" in obj; }, get: function (obj) { return obj.banner_image; }, set: function (obj, value) { obj.banner_image = value; } }, metadata: _metadata }, _banner_image_initializers, _banner_image_extraInitializers);
        __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: function (obj) { return "imageUrl" in obj; }, get: function (obj) { return obj.imageUrl; }, set: function (obj, value) { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
        __esDecorate(null, null, _imageSource_decorators, { kind: "field", name: "imageSource", static: false, private: false, access: { has: function (obj) { return "imageSource" in obj; }, get: function (obj) { return obj.imageSource; }, set: function (obj, value) { obj.imageSource = value; } }, metadata: _metadata }, _imageSource_initializers, _imageSource_extraInitializers);
        __esDecorate(null, null, _banner_video_decorators, { kind: "field", name: "banner_video", static: false, private: false, access: { has: function (obj) { return "banner_video" in obj; }, get: function (obj) { return obj.banner_video; }, set: function (obj, value) { obj.banner_video = value; } }, metadata: _metadata }, _banner_video_initializers, _banner_video_extraInitializers);
        __esDecorate(null, null, _videoUrl_decorators, { kind: "field", name: "videoUrl", static: false, private: false, access: { has: function (obj) { return "videoUrl" in obj; }, get: function (obj) { return obj.videoUrl; }, set: function (obj, value) { obj.videoUrl = value; } }, metadata: _metadata }, _videoUrl_initializers, _videoUrl_extraInitializers);
        __esDecorate(null, null, _videoSource_decorators, { kind: "field", name: "videoSource", static: false, private: false, access: { has: function (obj) { return "videoSource" in obj; }, get: function (obj) { return obj.videoSource; }, set: function (obj, value) { obj.videoSource = value; } }, metadata: _metadata }, _videoSource_initializers, _videoSource_extraInitializers);
        __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: function (obj) { return "heading" in obj; }, get: function (obj) { return obj.heading; }, set: function (obj, value) { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
        __esDecorate(null, null, _sequenceNumber_decorators, { kind: "field", name: "sequenceNumber", static: false, private: false, access: { has: function (obj) { return "sequenceNumber" in obj; }, get: function (obj) { return obj.sequenceNumber; }, set: function (obj, value) { obj.sequenceNumber = value; } }, metadata: _metadata }, _sequenceNumber_initializers, _sequenceNumber_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Banner = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Banner = _classThis;
}();
exports.Banner = Banner;
exports.BannerSchema = mongoose_1.SchemaFactory.createForClass(Banner);
