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
exports.ArticleSchema = exports.Article = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var Article = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'articles', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _shortDescription_decorators;
    var _shortDescription_initializers = [];
    var _shortDescription_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _image_decorators;
    var _image_initializers = [];
    var _image_extraInitializers = [];
    var _article_image_decorators;
    var _article_image_initializers = [];
    var _article_image_extraInitializers = [];
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    var _externalUrl_decorators;
    var _externalUrl_initializers = [];
    var _externalUrl_extraInitializers = [];
    var _pdf_decorators;
    var _pdf_initializers = [];
    var _pdf_extraInitializers = [];
    var _article_pdf_decorators;
    var _article_pdf_initializers = [];
    var _article_pdf_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var Article = _classThis = /** @class */ (function () {
        function Article_1() {
            this.title = __runInitializers(this, _title_initializers, void 0);
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            /** Plain-text teaser shown on cards when externalUrl is true. */
            this.shortDescription = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _shortDescription_initializers, void 0));
            this.date = (__runInitializers(this, _shortDescription_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.image = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _image_initializers, void 0));
            this.article_image = (__runInitializers(this, _image_extraInitializers), __runInitializers(this, _article_image_initializers, void 0));
            this.url = (__runInitializers(this, _article_image_extraInitializers), __runInitializers(this, _url_initializers, void 0));
            this.externalUrl = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _externalUrl_initializers, void 0));
            this.pdf = (__runInitializers(this, _externalUrl_extraInitializers), __runInitializers(this, _pdf_initializers, void 0));
            this.article_pdf = (__runInitializers(this, _pdf_extraInitializers), __runInitializers(this, _article_pdf_initializers, void 0));
            /** 1 = active, 0 = inactive */
            this.status = (__runInitializers(this, _article_pdf_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = __runInitializers(this, _status_extraInitializers);
        }
        return Article_1;
    }());
    __setFunctionName(_classThis, "Article");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _title_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _shortDescription_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _date_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _image_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _article_image_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _url_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _externalUrl_decorators = [(0, mongoose_1.Prop)({ type: Boolean, default: false })];
        _pdf_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _article_pdf_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _status_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 1 })];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _shortDescription_decorators, { kind: "field", name: "shortDescription", static: false, private: false, access: { has: function (obj) { return "shortDescription" in obj; }, get: function (obj) { return obj.shortDescription; }, set: function (obj, value) { obj.shortDescription = value; } }, metadata: _metadata }, _shortDescription_initializers, _shortDescription_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _image_decorators, { kind: "field", name: "image", static: false, private: false, access: { has: function (obj) { return "image" in obj; }, get: function (obj) { return obj.image; }, set: function (obj, value) { obj.image = value; } }, metadata: _metadata }, _image_initializers, _image_extraInitializers);
        __esDecorate(null, null, _article_image_decorators, { kind: "field", name: "article_image", static: false, private: false, access: { has: function (obj) { return "article_image" in obj; }, get: function (obj) { return obj.article_image; }, set: function (obj, value) { obj.article_image = value; } }, metadata: _metadata }, _article_image_initializers, _article_image_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _externalUrl_decorators, { kind: "field", name: "externalUrl", static: false, private: false, access: { has: function (obj) { return "externalUrl" in obj; }, get: function (obj) { return obj.externalUrl; }, set: function (obj, value) { obj.externalUrl = value; } }, metadata: _metadata }, _externalUrl_initializers, _externalUrl_extraInitializers);
        __esDecorate(null, null, _pdf_decorators, { kind: "field", name: "pdf", static: false, private: false, access: { has: function (obj) { return "pdf" in obj; }, get: function (obj) { return obj.pdf; }, set: function (obj, value) { obj.pdf = value; } }, metadata: _metadata }, _pdf_initializers, _pdf_extraInitializers);
        __esDecorate(null, null, _article_pdf_decorators, { kind: "field", name: "article_pdf", static: false, private: false, access: { has: function (obj) { return "article_pdf" in obj; }, get: function (obj) { return obj.article_pdf; }, set: function (obj, value) { obj.article_pdf = value; } }, metadata: _metadata }, _article_pdf_initializers, _article_pdf_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Article = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Article = _classThis;
}();
exports.Article = Article;
exports.ArticleSchema = mongoose_1.SchemaFactory.createForClass(Article);
