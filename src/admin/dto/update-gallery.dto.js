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
exports.UpdateGalleryDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var gallery_schema_1 = require("../../gallery/schemas/gallery.schema");
function emptyToUndefined(value) {
    if (value === undefined || value === null)
        return undefined;
    var s = String(value).trim();
    return s === '' ? undefined : s;
}
var UpdateGalleryDto = function () {
    var _a;
    var _eventName_decorators;
    var _eventName_initializers = [];
    var _eventName_extraInitializers = [];
    var _eventDate_decorators;
    var _eventDate_initializers = [];
    var _eventDate_extraInitializers = [];
    var _galleryType_decorators;
    var _galleryType_initializers = [];
    var _galleryType_extraInitializers = [];
    var _eventDescription_decorators;
    var _eventDescription_initializers = [];
    var _eventDescription_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateGalleryDto() {
                this.eventName = __runInitializers(this, _eventName_initializers, void 0);
                this.eventDate = (__runInitializers(this, _eventName_extraInitializers), __runInitializers(this, _eventDate_initializers, void 0));
                this.galleryType = (__runInitializers(this, _eventDate_extraInitializers), __runInitializers(this, _galleryType_initializers, void 0));
                this.eventDescription = (__runInitializers(this, _galleryType_extraInitializers), __runInitializers(this, _eventDescription_initializers, void 0));
                __runInitializers(this, _eventDescription_extraInitializers);
            }
            return UpdateGalleryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _eventName_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Green Summit 2026' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return emptyToUndefined(value);
                }), (0, class_validator_1.Length)(2, 120)];
            _eventDate_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: '2026-04-08',
                    description: 'Gallery date (ISO YYYY-MM-DD or DD-MM-YYYY).',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return emptyToUndefined(value);
                })];
            _galleryType_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'Site Visits',
                    enum: gallery_schema_1.GALLERY_TYPES,
                    description: 'Gallery tab/type for edit form dropdown. Only Training & Workshops, Site Visits, Recognition.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return emptyToUndefined(value);
                }), (0, class_validator_1.IsIn)(__spreadArray([], gallery_schema_1.GALLERY_TYPES, true), {
                    message: 'galleryType must be one of: Training & Workshops, Site Visits, Recognition',
                })];
            _eventDescription_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '<p>Gallery description</p>' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return emptyToUndefined(value);
                })];
            __esDecorate(null, null, _eventName_decorators, { kind: "field", name: "eventName", static: false, private: false, access: { has: function (obj) { return "eventName" in obj; }, get: function (obj) { return obj.eventName; }, set: function (obj, value) { obj.eventName = value; } }, metadata: _metadata }, _eventName_initializers, _eventName_extraInitializers);
            __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: function (obj) { return "eventDate" in obj; }, get: function (obj) { return obj.eventDate; }, set: function (obj, value) { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
            __esDecorate(null, null, _galleryType_decorators, { kind: "field", name: "galleryType", static: false, private: false, access: { has: function (obj) { return "galleryType" in obj; }, get: function (obj) { return obj.galleryType; }, set: function (obj, value) { obj.galleryType = value; } }, metadata: _metadata }, _galleryType_initializers, _galleryType_extraInitializers);
            __esDecorate(null, null, _eventDescription_decorators, { kind: "field", name: "eventDescription", static: false, private: false, access: { has: function (obj) { return "eventDescription" in obj; }, get: function (obj) { return obj.eventDescription; }, set: function (obj, value) { obj.eventDescription = value; } }, metadata: _metadata }, _eventDescription_initializers, _eventDescription_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateGalleryDto = UpdateGalleryDto;
