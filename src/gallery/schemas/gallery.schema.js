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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GallerySchema = exports.Gallery = exports.GALLERY_MAX_IMAGES = exports.ALL_GALLERY_TYPES = exports.LEGACY_GALLERY_TYPES = exports.GALLERY_TYPE_OPTIONS = exports.GALLERY_TYPES = void 0;
var mongoose_1 = require("@nestjs/mongoose");
exports.GALLERY_TYPES = [
    'Training & Workshops',
    'Site Visits',
    'Recognition',
];
/** Options for admin add/edit gallery type dropdown (canonical labels only). */
exports.GALLERY_TYPE_OPTIONS = exports.GALLERY_TYPES.map(function (value) { return ({
    value: value,
    label: value,
}); });
/** Legacy values kept for existing records; not offered in admin UI. */
exports.LEGACY_GALLERY_TYPES = [
    'Summits',
    'Awards',
    'Site Audits',
    'Workshops',
    'Trainings',
    'Other',
];
exports.ALL_GALLERY_TYPES = __spreadArray(__spreadArray([], exports.GALLERY_TYPES, true), exports.LEGACY_GALLERY_TYPES, true);
exports.GALLERY_MAX_IMAGES = 10;
var Gallery = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'galleries', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _galleryId_decorators;
    var _galleryId_initializers = [];
    var _galleryId_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _image_decorators;
    var _image_initializers = [];
    var _image_extraInitializers = [];
    var _gallery_image_decorators;
    var _gallery_image_initializers = [];
    var _gallery_image_extraInitializers = [];
    var _galleryImages_decorators;
    var _galleryImages_initializers = [];
    var _galleryImages_extraInitializers = [];
    var _galleryType_decorators;
    var _galleryType_initializers = [];
    var _galleryType_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var Gallery = _classThis = /** @class */ (function () {
        function Gallery_1() {
            this.galleryId = __runInitializers(this, _galleryId_initializers, void 0);
            this.title = (__runInitializers(this, _galleryId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            /** Local upload path (e.g. /uploads/gallery/xxx.png) or absolute URL */
            this.image = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _image_initializers, void 0));
            /** Relative path stored in DB (for example: gallery/file.png) */
            this.gallery_image = (__runInitializers(this, _image_extraInitializers), __runInitializers(this, _gallery_image_initializers, void 0));
            this.galleryImages = (__runInitializers(this, _gallery_image_extraInitializers), __runInitializers(this, _galleryImages_initializers, void 0));
            this.galleryType = (__runInitializers(this, _galleryImages_extraInitializers), __runInitializers(this, _galleryType_initializers, void 0));
            this.description = (__runInitializers(this, _galleryType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.date = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.status = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return Gallery_1;
    }());
    __setFunctionName(_classThis, "Gallery");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _galleryId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _title_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _image_decorators = [(0, mongoose_1.Prop)()];
        _gallery_image_decorators = [(0, mongoose_1.Prop)()];
        _galleryImages_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _galleryType_decorators = [(0, mongoose_1.Prop)({ enum: exports.ALL_GALLERY_TYPES, required: true })];
        _description_decorators = [(0, mongoose_1.Prop)()];
        _date_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _status_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 1 })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _galleryId_decorators, { kind: "field", name: "galleryId", static: false, private: false, access: { has: function (obj) { return "galleryId" in obj; }, get: function (obj) { return obj.galleryId; }, set: function (obj, value) { obj.galleryId = value; } }, metadata: _metadata }, _galleryId_initializers, _galleryId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _image_decorators, { kind: "field", name: "image", static: false, private: false, access: { has: function (obj) { return "image" in obj; }, get: function (obj) { return obj.image; }, set: function (obj, value) { obj.image = value; } }, metadata: _metadata }, _image_initializers, _image_extraInitializers);
        __esDecorate(null, null, _gallery_image_decorators, { kind: "field", name: "gallery_image", static: false, private: false, access: { has: function (obj) { return "gallery_image" in obj; }, get: function (obj) { return obj.gallery_image; }, set: function (obj, value) { obj.gallery_image = value; } }, metadata: _metadata }, _gallery_image_initializers, _gallery_image_extraInitializers);
        __esDecorate(null, null, _galleryImages_decorators, { kind: "field", name: "galleryImages", static: false, private: false, access: { has: function (obj) { return "galleryImages" in obj; }, get: function (obj) { return obj.galleryImages; }, set: function (obj, value) { obj.galleryImages = value; } }, metadata: _metadata }, _galleryImages_initializers, _galleryImages_extraInitializers);
        __esDecorate(null, null, _galleryType_decorators, { kind: "field", name: "galleryType", static: false, private: false, access: { has: function (obj) { return "galleryType" in obj; }, get: function (obj) { return obj.galleryType; }, set: function (obj, value) { obj.galleryType = value; } }, metadata: _metadata }, _galleryType_initializers, _galleryType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gallery = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gallery = _classThis;
}();
exports.Gallery = Gallery;
exports.GallerySchema = mongoose_1.SchemaFactory.createForClass(Gallery);
