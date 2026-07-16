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
exports.StandardSchema = exports.Standard = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var Standard = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'standards' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _filename_decorators;
    var _filename_initializers = [];
    var _filename_extraInitializers = [];
    var _file_url_decorators;
    var _file_url_initializers = [];
    var _file_url_extraInitializers = [];
    var _storage_type_decorators;
    var _storage_type_initializers = [];
    var _storage_type_extraInitializers = [];
    var _s3_key_decorators;
    var _s3_key_initializers = [];
    var _s3_key_extraInitializers = [];
    var _original_filename_decorators;
    var _original_filename_initializers = [];
    var _original_filename_extraInitializers = [];
    var _resource_standard_type_decorators;
    var _resource_standard_type_initializers = [];
    var _resource_standard_type_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    var Standard = _classThis = /** @class */ (function () {
        function Standard_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            /** Stored relative path under uploads/ or same path segment for S3 key suffix, e.g. standards/1700000000_file.pdf */
            this.filename = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _filename_initializers, void 0));
            /** Public URL (S3 HTTPS) or app path (/uploads/...) */
            this.file_url = (__runInitializers(this, _filename_extraInitializers), __runInitializers(this, _file_url_initializers, void 0));
            /** Where the binary lives */
            this.storage_type = (__runInitializers(this, _file_url_extraInitializers), __runInitializers(this, _storage_type_initializers, void 0));
            /** Full S3 object key when storage_type is s3 (for delete) */
            this.s3_key = (__runInitializers(this, _storage_type_extraInitializers), __runInitializers(this, _s3_key_initializers, void 0));
            this.original_filename = (__runInitializers(this, _s3_key_extraInitializers), __runInitializers(this, _original_filename_initializers, void 0));
            this.resource_standard_type = (__runInitializers(this, _original_filename_extraInitializers), __runInitializers(this, _resource_standard_type_initializers, void 0));
            /**
             * Primary category (first of the multi-category set). Same numeric id as GET /categories.
             * Full set is stored in **standard_categories**; this field is kept for legacy filters and clients.
             */
            this.category_id = (__runInitializers(this, _resource_standard_type_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
            this.status = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.created_at = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
            __runInitializers(this, _updated_at_extraInitializers);
        }
        return Standard_1;
    }());
    __setFunctionName(_classThis, "Standard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ type: String, default: '' })];
        _filename_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _file_url_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _storage_type_decorators = [(0, mongoose_1.Prop)({ enum: ['local', 's3'], required: false })];
        _s3_key_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _original_filename_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _resource_standard_type_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _category_id_decorators = [(0, mongoose_1.Prop)({ type: Number, required: false })];
        _status_decorators = [(0, mongoose_1.Prop)({ type: Number, default: 1 })];
        _created_at_decorators = [(0, mongoose_1.Prop)({ type: Date, required: true })];
        _updated_at_decorators = [(0, mongoose_1.Prop)({ type: Date, required: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _filename_decorators, { kind: "field", name: "filename", static: false, private: false, access: { has: function (obj) { return "filename" in obj; }, get: function (obj) { return obj.filename; }, set: function (obj, value) { obj.filename = value; } }, metadata: _metadata }, _filename_initializers, _filename_extraInitializers);
        __esDecorate(null, null, _file_url_decorators, { kind: "field", name: "file_url", static: false, private: false, access: { has: function (obj) { return "file_url" in obj; }, get: function (obj) { return obj.file_url; }, set: function (obj, value) { obj.file_url = value; } }, metadata: _metadata }, _file_url_initializers, _file_url_extraInitializers);
        __esDecorate(null, null, _storage_type_decorators, { kind: "field", name: "storage_type", static: false, private: false, access: { has: function (obj) { return "storage_type" in obj; }, get: function (obj) { return obj.storage_type; }, set: function (obj, value) { obj.storage_type = value; } }, metadata: _metadata }, _storage_type_initializers, _storage_type_extraInitializers);
        __esDecorate(null, null, _s3_key_decorators, { kind: "field", name: "s3_key", static: false, private: false, access: { has: function (obj) { return "s3_key" in obj; }, get: function (obj) { return obj.s3_key; }, set: function (obj, value) { obj.s3_key = value; } }, metadata: _metadata }, _s3_key_initializers, _s3_key_extraInitializers);
        __esDecorate(null, null, _original_filename_decorators, { kind: "field", name: "original_filename", static: false, private: false, access: { has: function (obj) { return "original_filename" in obj; }, get: function (obj) { return obj.original_filename; }, set: function (obj, value) { obj.original_filename = value; } }, metadata: _metadata }, _original_filename_initializers, _original_filename_extraInitializers);
        __esDecorate(null, null, _resource_standard_type_decorators, { kind: "field", name: "resource_standard_type", static: false, private: false, access: { has: function (obj) { return "resource_standard_type" in obj; }, get: function (obj) { return obj.resource_standard_type; }, set: function (obj, value) { obj.resource_standard_type = value; } }, metadata: _metadata }, _resource_standard_type_initializers, _resource_standard_type_extraInitializers);
        __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Standard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Standard = _classThis;
}();
exports.Standard = Standard;
exports.StandardSchema = mongoose_1.SchemaFactory.createForClass(Standard);
