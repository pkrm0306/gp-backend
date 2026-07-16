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
exports.UpdateSummitPayloadDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var summit_constants_1 = require("../constants/summit.constants");
var summit_status_util_1 = require("../utils/summit-status.util");
var summit_speaker_util_1 = require("../utils/summit-speaker.util");
var SummitBasicDto = function () {
    var _a;
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitBasicDto() {
                this.year = __runInitializers(this, _year_initializers, void 0);
                this.title = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.date = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.location = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.status = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.slug = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                __runInitializers(this, _slug_extraInitializers);
            }
            return SummitBasicDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _year_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2026' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^(19|20)\d{2}$/, { message: 'year must be a valid 4-digit year' })];
            _title_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2)];
            _date_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/)];
            _location_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: summit_constants_1.SUMMIT_STATUSES }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === '' ? undefined : (0, summit_status_util_1.normalizeSummitStatus)(value);
                }), (0, class_validator_1.IsIn)(__spreadArray([], summit_constants_1.SUMMIT_STATUSES, true))];
            _slug_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitBannerDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _imageUrl_decorators;
    var _imageUrl_initializers = [];
    var _imageUrl_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _subtitle_decorators;
    var _subtitle_initializers = [];
    var _subtitle_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitBannerDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.imageUrl = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
                this.title = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.subtitle = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _subtitle_initializers, void 0));
                __runInitializers(this, _subtitle_extraInitializers);
            }
            return SummitBannerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _imageUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _title_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _subtitle_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: function (obj) { return "imageUrl" in obj; }, get: function (obj) { return obj.imageUrl; }, set: function (obj, value) { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _subtitle_decorators, { kind: "field", name: "subtitle", static: false, private: false, access: { has: function (obj) { return "subtitle" in obj; }, get: function (obj) { return obj.subtitle; }, set: function (obj, value) { obj.subtitle = value; } }, metadata: _metadata }, _subtitle_initializers, _subtitle_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitPdfDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _fileUrl_decorators;
    var _fileUrl_initializers = [];
    var _fileUrl_extraInitializers = [];
    var _fileName_decorators;
    var _fileName_initializers = [];
    var _fileName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitPdfDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.title = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.fileUrl = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
                this.fileName = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
                __runInitializers(this, _fileName_extraInitializers);
            }
            return SummitPdfDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _title_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _fileUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _fileName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: function (obj) { return "fileUrl" in obj; }, get: function (obj) { return obj.fileUrl; }, set: function (obj, value) { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
            __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: function (obj) { return "fileName" in obj; }, get: function (obj) { return obj.fileName; }, set: function (obj, value) { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitRichTextDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitRichTextDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                __runInitializers(this, _content_extraInitializers);
            }
            return SummitRichTextDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _content_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitCardItemDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _heading_decorators;
    var _heading_initializers = [];
    var _heading_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitCardItemDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.heading = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
                this.description = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                /** Legacy flat bullet alias */
                this.text = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _text_initializers, void 0));
                __runInitializers(this, _text_extraInitializers);
            }
            return SummitCardItemDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _heading_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _text_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: function (obj) { return "heading" in obj; }, get: function (obj) { return obj.heading; }, set: function (obj, value) { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitFocusPointDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitFocusPointDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.text = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _text_initializers, void 0));
                __runInitializers(this, _text_extraInitializers);
            }
            return SummitFocusPointDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _text_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitFocusAreaCardDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _heading_decorators;
    var _heading_initializers = [];
    var _heading_extraInitializers = [];
    var _points_decorators;
    var _points_initializers = [];
    var _points_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitFocusAreaCardDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.heading = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
                this.points = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _points_initializers, void 0));
                __runInitializers(this, _points_extraInitializers);
            }
            return SummitFocusAreaCardDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _heading_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _points_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMaxSize)(summit_constants_1.SUMMIT_FOCUS_POINTS_MAX), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitFocusPointDto; })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: function (obj) { return "heading" in obj; }, get: function (obj) { return obj.heading; }, set: function (obj, value) { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
            __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: function (obj) { return "points" in obj; }, get: function (obj) { return obj.points; }, set: function (obj, value) { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitAgendaPointDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _heading_decorators;
    var _heading_initializers = [];
    var _heading_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitAgendaPointDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.heading = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
                this.description = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                /** @deprecated legacy flat bullet — treated as description */
                this.text = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _text_initializers, void 0));
                __runInitializers(this, _text_extraInitializers);
            }
            return SummitAgendaPointDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _heading_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _text_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: function (obj) { return "heading" in obj; }, get: function (obj) { return obj.heading; }, set: function (obj, value) { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitSpeakerDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _designation_decorators;
    var _designation_initializers = [];
    var _designation_extraInitializers = [];
    var _organisation_decorators;
    var _organisation_initializers = [];
    var _organisation_extraInitializers = [];
    var _organization_decorators;
    var _organization_initializers = [];
    var _organization_extraInitializers = [];
    var _sub_decorators;
    var _sub_initializers = [];
    var _sub_extraInitializers = [];
    var _keyPoint_decorators;
    var _keyPoint_initializers = [];
    var _keyPoint_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _keyPoints_decorators;
    var _keyPoints_initializers = [];
    var _keyPoints_extraInitializers = [];
    var _imageUrl_decorators;
    var _imageUrl_initializers = [];
    var _imageUrl_extraInitializers = [];
    var _image_decorators;
    var _image_initializers = [];
    var _image_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitSpeakerDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.name = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.designation = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
                this.organisation = (__runInitializers(this, _designation_extraInitializers), __runInitializers(this, _organisation_initializers, void 0));
                this.organization = (__runInitializers(this, _organisation_extraInitializers), __runInitializers(this, _organization_initializers, void 0));
                this.sub = (__runInitializers(this, _organization_extraInitializers), __runInitializers(this, _sub_initializers, void 0));
                this.keyPoint = (__runInitializers(this, _sub_extraInitializers), __runInitializers(this, _keyPoint_initializers, void 0));
                this.tags = (__runInitializers(this, _keyPoint_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.keyPoints = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _keyPoints_initializers, void 0));
                this.imageUrl = (__runInitializers(this, _keyPoints_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
                /** Legacy alias for imageUrl on save. */
                this.image = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _image_initializers, void 0));
                __runInitializers(this, _image_extraInitializers);
            }
            return SummitSpeakerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _name_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _designation_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _organisation_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _organization_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sub_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _keyPoint_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, summit_speaker_util_1.normalizeSpeakerTags)(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _keyPoints_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, summit_speaker_util_1.normalizeSpeakerTags)(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _imageUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _image_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: function (obj) { return "designation" in obj; }, get: function (obj) { return obj.designation; }, set: function (obj, value) { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
            __esDecorate(null, null, _organisation_decorators, { kind: "field", name: "organisation", static: false, private: false, access: { has: function (obj) { return "organisation" in obj; }, get: function (obj) { return obj.organisation; }, set: function (obj, value) { obj.organisation = value; } }, metadata: _metadata }, _organisation_initializers, _organisation_extraInitializers);
            __esDecorate(null, null, _organization_decorators, { kind: "field", name: "organization", static: false, private: false, access: { has: function (obj) { return "organization" in obj; }, get: function (obj) { return obj.organization; }, set: function (obj, value) { obj.organization = value; } }, metadata: _metadata }, _organization_initializers, _organization_extraInitializers);
            __esDecorate(null, null, _sub_decorators, { kind: "field", name: "sub", static: false, private: false, access: { has: function (obj) { return "sub" in obj; }, get: function (obj) { return obj.sub; }, set: function (obj, value) { obj.sub = value; } }, metadata: _metadata }, _sub_initializers, _sub_extraInitializers);
            __esDecorate(null, null, _keyPoint_decorators, { kind: "field", name: "keyPoint", static: false, private: false, access: { has: function (obj) { return "keyPoint" in obj; }, get: function (obj) { return obj.keyPoint; }, set: function (obj, value) { obj.keyPoint = value; } }, metadata: _metadata }, _keyPoint_initializers, _keyPoint_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _keyPoints_decorators, { kind: "field", name: "keyPoints", static: false, private: false, access: { has: function (obj) { return "keyPoints" in obj; }, get: function (obj) { return obj.keyPoints; }, set: function (obj, value) { obj.keyPoints = value; } }, metadata: _metadata }, _keyPoints_initializers, _keyPoints_extraInitializers);
            __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: function (obj) { return "imageUrl" in obj; }, get: function (obj) { return obj.imageUrl; }, set: function (obj, value) { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
            __esDecorate(null, null, _image_decorators, { kind: "field", name: "image", static: false, private: false, access: { has: function (obj) { return "image" in obj; }, get: function (obj) { return obj.image; }, set: function (obj, value) { obj.image = value; } }, metadata: _metadata }, _image_initializers, _image_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var SummitSponsorDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _tier_decorators;
    var _tier_initializers = [];
    var _tier_extraInitializers = [];
    var _logoUrl_decorators;
    var _logoUrl_initializers = [];
    var _logoUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SummitSponsorDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.name = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.tier = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
                this.logoUrl = (__runInitializers(this, _tier_extraInitializers), __runInitializers(this, _logoUrl_initializers, void 0));
                __runInitializers(this, _logoUrl_extraInitializers);
            }
            return SummitSponsorDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _name_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tier_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(__spreadArray([], summit_constants_1.SUMMIT_SPONSOR_TIERS, true))];
            _logoUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: function (obj) { return "tier" in obj; }, get: function (obj) { return obj.tier; }, set: function (obj, value) { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
            __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: function (obj) { return "logoUrl" in obj; }, get: function (obj) { return obj.logoUrl; }, set: function (obj, value) { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
/** Full summit document for PATCH /admin/summits/:id */
var UpdateSummitPayloadDto = function () {
    var _a;
    var _basic_decorators;
    var _basic_initializers = [];
    var _basic_extraInitializers = [];
    var _banners_decorators;
    var _banners_initializers = [];
    var _banners_extraInitializers = [];
    var _industrialPdfs_decorators;
    var _industrialPdfs_initializers = [];
    var _industrialPdfs_extraInitializers = [];
    var _buildingsPdfs_decorators;
    var _buildingsPdfs_initializers = [];
    var _buildingsPdfs_extraInitializers = [];
    var _aboutGreenPro_decorators;
    var _aboutGreenPro_initializers = [];
    var _aboutGreenPro_extraInitializers = [];
    var _aboutSummit_decorators;
    var _aboutSummit_initializers = [];
    var _aboutSummit_extraInitializers = [];
    var _highlightsTitle_decorators;
    var _highlightsTitle_initializers = [];
    var _highlightsTitle_extraInitializers = [];
    var _highlights_decorators;
    var _highlights_initializers = [];
    var _highlights_extraInitializers = [];
    var _focusedAreaTitle_decorators;
    var _focusedAreaTitle_initializers = [];
    var _focusedAreaTitle_extraInitializers = [];
    var _focusedAreas_decorators;
    var _focusedAreas_initializers = [];
    var _focusedAreas_extraInitializers = [];
    var _areaPoints_decorators;
    var _areaPoints_initializers = [];
    var _areaPoints_extraInitializers = [];
    var _eventOutcomesTitle_decorators;
    var _eventOutcomesTitle_initializers = [];
    var _eventOutcomesTitle_extraInitializers = [];
    var _eventOutcomes_decorators;
    var _eventOutcomes_initializers = [];
    var _eventOutcomes_extraInitializers = [];
    var _speakers_decorators;
    var _speakers_initializers = [];
    var _speakers_extraInitializers = [];
    var _agendaTitle_decorators;
    var _agendaTitle_initializers = [];
    var _agendaTitle_extraInitializers = [];
    var _agendaPoints_decorators;
    var _agendaPoints_initializers = [];
    var _agendaPoints_extraInitializers = [];
    var _agenda_decorators;
    var _agenda_initializers = [];
    var _agenda_extraInitializers = [];
    var _sponsorsTitle_decorators;
    var _sponsorsTitle_initializers = [];
    var _sponsorsTitle_extraInitializers = [];
    var _sponsors_decorators;
    var _sponsors_initializers = [];
    var _sponsors_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateSummitPayloadDto() {
                this.basic = __runInitializers(this, _basic_initializers, void 0);
                this.banners = (__runInitializers(this, _basic_extraInitializers), __runInitializers(this, _banners_initializers, void 0));
                this.industrialPdfs = (__runInitializers(this, _banners_extraInitializers), __runInitializers(this, _industrialPdfs_initializers, void 0));
                this.buildingsPdfs = (__runInitializers(this, _industrialPdfs_extraInitializers), __runInitializers(this, _buildingsPdfs_initializers, void 0));
                this.aboutGreenPro = (__runInitializers(this, _buildingsPdfs_extraInitializers), __runInitializers(this, _aboutGreenPro_initializers, void 0));
                this.aboutSummit = (__runInitializers(this, _aboutGreenPro_extraInitializers), __runInitializers(this, _aboutSummit_initializers, void 0));
                this.highlightsTitle = (__runInitializers(this, _aboutSummit_extraInitializers), __runInitializers(this, _highlightsTitle_initializers, void 0));
                this.highlights = (__runInitializers(this, _highlightsTitle_extraInitializers), __runInitializers(this, _highlights_initializers, void 0));
                this.focusedAreaTitle = (__runInitializers(this, _highlights_extraInitializers), __runInitializers(this, _focusedAreaTitle_initializers, void 0));
                this.focusedAreas = (__runInitializers(this, _focusedAreaTitle_extraInitializers), __runInitializers(this, _focusedAreas_initializers, void 0));
                /** @deprecated legacy flat bullets — use focusedAreas */
                this.areaPoints = (__runInitializers(this, _focusedAreas_extraInitializers), __runInitializers(this, _areaPoints_initializers, void 0));
                this.eventOutcomesTitle = (__runInitializers(this, _areaPoints_extraInitializers), __runInitializers(this, _eventOutcomesTitle_initializers, void 0));
                this.eventOutcomes = (__runInitializers(this, _eventOutcomesTitle_extraInitializers), __runInitializers(this, _eventOutcomes_initializers, void 0));
                this.speakers = (__runInitializers(this, _eventOutcomes_extraInitializers), __runInitializers(this, _speakers_initializers, void 0));
                this.agendaTitle = (__runInitializers(this, _speakers_extraInitializers), __runInitializers(this, _agendaTitle_initializers, void 0));
                this.agendaPoints = (__runInitializers(this, _agendaTitle_extraInitializers), __runInitializers(this, _agendaPoints_initializers, void 0));
                /** @deprecated legacy rich-text agenda — use agendaTitle + agendaPoints */
                this.agenda = (__runInitializers(this, _agendaPoints_extraInitializers), __runInitializers(this, _agenda_initializers, void 0));
                this.sponsorsTitle = (__runInitializers(this, _agenda_extraInitializers), __runInitializers(this, _sponsorsTitle_initializers, void 0));
                this.sponsors = (__runInitializers(this, _sponsorsTitle_extraInitializers), __runInitializers(this, _sponsors_initializers, void 0));
                this.slug = (__runInitializers(this, _sponsors_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                __runInitializers(this, _slug_extraInitializers);
            }
            return UpdateSummitPayloadDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basic_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return SummitBasicDto; })];
            _banners_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitBannerDto] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitBannerDto; })];
            _industrialPdfs_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitPdfDto] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitPdfDto; })];
            _buildingsPdfs_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitPdfDto] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitPdfDto; })];
            _aboutGreenPro_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return SummitRichTextDto; })];
            _aboutSummit_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return SummitRichTextDto; })];
            _highlightsTitle_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    minLength: summit_constants_1.SUMMIT_CMS_FIELD_MIN,
                    maxLength: summit_constants_1.SUMMIT_CMS_FIELD_MAX,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _highlights_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitCardItemDto], maxItems: summit_constants_1.SUMMIT_CMS_CARD_MAX }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMaxSize)(summit_constants_1.SUMMIT_CMS_CARD_MAX), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitCardItemDto; })];
            _focusedAreaTitle_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    minLength: summit_constants_1.SUMMIT_CMS_FIELD_MIN,
                    maxLength: summit_constants_1.SUMMIT_CMS_FIELD_MAX,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _focusedAreas_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitFocusAreaCardDto], maxItems: summit_constants_1.SUMMIT_CMS_CARD_MAX }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMaxSize)(summit_constants_1.SUMMIT_CMS_CARD_MAX), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitFocusAreaCardDto; })];
            _areaPoints_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitAgendaPointDto] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitAgendaPointDto; })];
            _eventOutcomesTitle_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    minLength: summit_constants_1.SUMMIT_CMS_FIELD_MIN,
                    maxLength: summit_constants_1.SUMMIT_CMS_FIELD_MAX,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _eventOutcomes_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitCardItemDto], maxItems: summit_constants_1.SUMMIT_CMS_CARD_MAX }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMaxSize)(summit_constants_1.SUMMIT_CMS_CARD_MAX), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitCardItemDto; })];
            _speakers_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitSpeakerDto] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitSpeakerDto; })];
            _agendaTitle_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    minLength: summit_constants_1.SUMMIT_CMS_FIELD_MIN,
                    maxLength: summit_constants_1.SUMMIT_CMS_FIELD_MAX,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _agendaPoints_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitAgendaPointDto] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitAgendaPointDto; })];
            _agenda_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return SummitRichTextDto; })];
            _sponsorsTitle_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sponsors_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [SummitSponsorDto] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SummitSponsorDto; })];
            _slug_decorators = [(0, swagger_1.ApiPropertyOptional)({ deprecated: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _basic_decorators, { kind: "field", name: "basic", static: false, private: false, access: { has: function (obj) { return "basic" in obj; }, get: function (obj) { return obj.basic; }, set: function (obj, value) { obj.basic = value; } }, metadata: _metadata }, _basic_initializers, _basic_extraInitializers);
            __esDecorate(null, null, _banners_decorators, { kind: "field", name: "banners", static: false, private: false, access: { has: function (obj) { return "banners" in obj; }, get: function (obj) { return obj.banners; }, set: function (obj, value) { obj.banners = value; } }, metadata: _metadata }, _banners_initializers, _banners_extraInitializers);
            __esDecorate(null, null, _industrialPdfs_decorators, { kind: "field", name: "industrialPdfs", static: false, private: false, access: { has: function (obj) { return "industrialPdfs" in obj; }, get: function (obj) { return obj.industrialPdfs; }, set: function (obj, value) { obj.industrialPdfs = value; } }, metadata: _metadata }, _industrialPdfs_initializers, _industrialPdfs_extraInitializers);
            __esDecorate(null, null, _buildingsPdfs_decorators, { kind: "field", name: "buildingsPdfs", static: false, private: false, access: { has: function (obj) { return "buildingsPdfs" in obj; }, get: function (obj) { return obj.buildingsPdfs; }, set: function (obj, value) { obj.buildingsPdfs = value; } }, metadata: _metadata }, _buildingsPdfs_initializers, _buildingsPdfs_extraInitializers);
            __esDecorate(null, null, _aboutGreenPro_decorators, { kind: "field", name: "aboutGreenPro", static: false, private: false, access: { has: function (obj) { return "aboutGreenPro" in obj; }, get: function (obj) { return obj.aboutGreenPro; }, set: function (obj, value) { obj.aboutGreenPro = value; } }, metadata: _metadata }, _aboutGreenPro_initializers, _aboutGreenPro_extraInitializers);
            __esDecorate(null, null, _aboutSummit_decorators, { kind: "field", name: "aboutSummit", static: false, private: false, access: { has: function (obj) { return "aboutSummit" in obj; }, get: function (obj) { return obj.aboutSummit; }, set: function (obj, value) { obj.aboutSummit = value; } }, metadata: _metadata }, _aboutSummit_initializers, _aboutSummit_extraInitializers);
            __esDecorate(null, null, _highlightsTitle_decorators, { kind: "field", name: "highlightsTitle", static: false, private: false, access: { has: function (obj) { return "highlightsTitle" in obj; }, get: function (obj) { return obj.highlightsTitle; }, set: function (obj, value) { obj.highlightsTitle = value; } }, metadata: _metadata }, _highlightsTitle_initializers, _highlightsTitle_extraInitializers);
            __esDecorate(null, null, _highlights_decorators, { kind: "field", name: "highlights", static: false, private: false, access: { has: function (obj) { return "highlights" in obj; }, get: function (obj) { return obj.highlights; }, set: function (obj, value) { obj.highlights = value; } }, metadata: _metadata }, _highlights_initializers, _highlights_extraInitializers);
            __esDecorate(null, null, _focusedAreaTitle_decorators, { kind: "field", name: "focusedAreaTitle", static: false, private: false, access: { has: function (obj) { return "focusedAreaTitle" in obj; }, get: function (obj) { return obj.focusedAreaTitle; }, set: function (obj, value) { obj.focusedAreaTitle = value; } }, metadata: _metadata }, _focusedAreaTitle_initializers, _focusedAreaTitle_extraInitializers);
            __esDecorate(null, null, _focusedAreas_decorators, { kind: "field", name: "focusedAreas", static: false, private: false, access: { has: function (obj) { return "focusedAreas" in obj; }, get: function (obj) { return obj.focusedAreas; }, set: function (obj, value) { obj.focusedAreas = value; } }, metadata: _metadata }, _focusedAreas_initializers, _focusedAreas_extraInitializers);
            __esDecorate(null, null, _areaPoints_decorators, { kind: "field", name: "areaPoints", static: false, private: false, access: { has: function (obj) { return "areaPoints" in obj; }, get: function (obj) { return obj.areaPoints; }, set: function (obj, value) { obj.areaPoints = value; } }, metadata: _metadata }, _areaPoints_initializers, _areaPoints_extraInitializers);
            __esDecorate(null, null, _eventOutcomesTitle_decorators, { kind: "field", name: "eventOutcomesTitle", static: false, private: false, access: { has: function (obj) { return "eventOutcomesTitle" in obj; }, get: function (obj) { return obj.eventOutcomesTitle; }, set: function (obj, value) { obj.eventOutcomesTitle = value; } }, metadata: _metadata }, _eventOutcomesTitle_initializers, _eventOutcomesTitle_extraInitializers);
            __esDecorate(null, null, _eventOutcomes_decorators, { kind: "field", name: "eventOutcomes", static: false, private: false, access: { has: function (obj) { return "eventOutcomes" in obj; }, get: function (obj) { return obj.eventOutcomes; }, set: function (obj, value) { obj.eventOutcomes = value; } }, metadata: _metadata }, _eventOutcomes_initializers, _eventOutcomes_extraInitializers);
            __esDecorate(null, null, _speakers_decorators, { kind: "field", name: "speakers", static: false, private: false, access: { has: function (obj) { return "speakers" in obj; }, get: function (obj) { return obj.speakers; }, set: function (obj, value) { obj.speakers = value; } }, metadata: _metadata }, _speakers_initializers, _speakers_extraInitializers);
            __esDecorate(null, null, _agendaTitle_decorators, { kind: "field", name: "agendaTitle", static: false, private: false, access: { has: function (obj) { return "agendaTitle" in obj; }, get: function (obj) { return obj.agendaTitle; }, set: function (obj, value) { obj.agendaTitle = value; } }, metadata: _metadata }, _agendaTitle_initializers, _agendaTitle_extraInitializers);
            __esDecorate(null, null, _agendaPoints_decorators, { kind: "field", name: "agendaPoints", static: false, private: false, access: { has: function (obj) { return "agendaPoints" in obj; }, get: function (obj) { return obj.agendaPoints; }, set: function (obj, value) { obj.agendaPoints = value; } }, metadata: _metadata }, _agendaPoints_initializers, _agendaPoints_extraInitializers);
            __esDecorate(null, null, _agenda_decorators, { kind: "field", name: "agenda", static: false, private: false, access: { has: function (obj) { return "agenda" in obj; }, get: function (obj) { return obj.agenda; }, set: function (obj, value) { obj.agenda = value; } }, metadata: _metadata }, _agenda_initializers, _agenda_extraInitializers);
            __esDecorate(null, null, _sponsorsTitle_decorators, { kind: "field", name: "sponsorsTitle", static: false, private: false, access: { has: function (obj) { return "sponsorsTitle" in obj; }, get: function (obj) { return obj.sponsorsTitle; }, set: function (obj, value) { obj.sponsorsTitle = value; } }, metadata: _metadata }, _sponsorsTitle_initializers, _sponsorsTitle_extraInitializers);
            __esDecorate(null, null, _sponsors_decorators, { kind: "field", name: "sponsors", static: false, private: false, access: { has: function (obj) { return "sponsors" in obj; }, get: function (obj) { return obj.sponsors; }, set: function (obj, value) { obj.sponsors = value; } }, metadata: _metadata }, _sponsors_initializers, _sponsors_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateSummitPayloadDto = UpdateSummitPayloadDto;
