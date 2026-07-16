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
exports.CategorySchema = exports.Category = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var Category = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'categories' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _category_name_decorators;
    var _category_name_initializers = [];
    var _category_name_extraInitializers = [];
    var _category_name_normalized_decorators;
    var _category_name_normalized_initializers = [];
    var _category_name_normalized_extraInitializers = [];
    var _category_image_decorators;
    var _category_image_initializers = [];
    var _category_image_extraInitializers = [];
    var _category_raw_material_forms_decorators;
    var _category_raw_material_forms_initializers = [];
    var _category_raw_material_forms_extraInitializers = [];
    var _category_status_decorators;
    var _category_status_initializers = [];
    var _category_status_extraInitializers = [];
    var _sector_decorators;
    var _sector_initializers = [];
    var _sector_extraInitializers = [];
    var _created_date_decorators;
    var _created_date_initializers = [];
    var _created_date_extraInitializers = [];
    var _updated_date_decorators;
    var _updated_date_initializers = [];
    var _updated_date_extraInitializers = [];
    var Category = _classThis = /** @class */ (function () {
        function Category_1() {
            this.category_id = __runInitializers(this, _category_id_initializers, void 0);
            this.category_name = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _category_name_initializers, void 0));
            /** Lowercase trimmed/collapsed name for case-insensitive global uniqueness */
            this.category_name_normalized = (__runInitializers(this, _category_name_extraInitializers), __runInitializers(this, _category_name_normalized_initializers, void 0));
            this.category_image = (__runInitializers(this, _category_name_normalized_extraInitializers), __runInitializers(this, _category_image_initializers, void 0));
            /** Comma-separated raw material form ids, e.g. "1,3,2" */
            this.category_raw_material_forms = (__runInitializers(this, _category_image_extraInitializers), __runInitializers(this, _category_raw_material_forms_initializers, void 0));
            this.category_status = (__runInitializers(this, _category_raw_material_forms_extraInitializers), __runInitializers(this, _category_status_initializers, void 0));
            /** Sector id */
            this.sector = (__runInitializers(this, _category_status_extraInitializers), __runInitializers(this, _sector_initializers, void 0));
            this.created_date = (__runInitializers(this, _sector_extraInitializers), __runInitializers(this, _created_date_initializers, void 0));
            this.updated_date = (__runInitializers(this, _created_date_extraInitializers), __runInitializers(this, _updated_date_initializers, void 0));
            __runInitializers(this, _updated_date_extraInitializers);
        }
        return Category_1;
    }());
    __setFunctionName(_classThis, "Category");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _category_id_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _category_name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _category_name_normalized_decorators = [(0, mongoose_1.Prop)()];
        _category_image_decorators = [(0, mongoose_1.Prop)()];
        _category_raw_material_forms_decorators = [(0, mongoose_1.Prop)()];
        _category_status_decorators = [(0, mongoose_1.Prop)({ default: 1 })];
        _sector_decorators = [(0, mongoose_1.Prop)({ default: 1 })];
        _created_date_decorators = [(0, mongoose_1.Prop)()];
        _updated_date_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
        __esDecorate(null, null, _category_name_decorators, { kind: "field", name: "category_name", static: false, private: false, access: { has: function (obj) { return "category_name" in obj; }, get: function (obj) { return obj.category_name; }, set: function (obj, value) { obj.category_name = value; } }, metadata: _metadata }, _category_name_initializers, _category_name_extraInitializers);
        __esDecorate(null, null, _category_name_normalized_decorators, { kind: "field", name: "category_name_normalized", static: false, private: false, access: { has: function (obj) { return "category_name_normalized" in obj; }, get: function (obj) { return obj.category_name_normalized; }, set: function (obj, value) { obj.category_name_normalized = value; } }, metadata: _metadata }, _category_name_normalized_initializers, _category_name_normalized_extraInitializers);
        __esDecorate(null, null, _category_image_decorators, { kind: "field", name: "category_image", static: false, private: false, access: { has: function (obj) { return "category_image" in obj; }, get: function (obj) { return obj.category_image; }, set: function (obj, value) { obj.category_image = value; } }, metadata: _metadata }, _category_image_initializers, _category_image_extraInitializers);
        __esDecorate(null, null, _category_raw_material_forms_decorators, { kind: "field", name: "category_raw_material_forms", static: false, private: false, access: { has: function (obj) { return "category_raw_material_forms" in obj; }, get: function (obj) { return obj.category_raw_material_forms; }, set: function (obj, value) { obj.category_raw_material_forms = value; } }, metadata: _metadata }, _category_raw_material_forms_initializers, _category_raw_material_forms_extraInitializers);
        __esDecorate(null, null, _category_status_decorators, { kind: "field", name: "category_status", static: false, private: false, access: { has: function (obj) { return "category_status" in obj; }, get: function (obj) { return obj.category_status; }, set: function (obj, value) { obj.category_status = value; } }, metadata: _metadata }, _category_status_initializers, _category_status_extraInitializers);
        __esDecorate(null, null, _sector_decorators, { kind: "field", name: "sector", static: false, private: false, access: { has: function (obj) { return "sector" in obj; }, get: function (obj) { return obj.sector; }, set: function (obj, value) { obj.sector = value; } }, metadata: _metadata }, _sector_initializers, _sector_extraInitializers);
        __esDecorate(null, null, _created_date_decorators, { kind: "field", name: "created_date", static: false, private: false, access: { has: function (obj) { return "created_date" in obj; }, get: function (obj) { return obj.created_date; }, set: function (obj, value) { obj.created_date = value; } }, metadata: _metadata }, _created_date_initializers, _created_date_extraInitializers);
        __esDecorate(null, null, _updated_date_decorators, { kind: "field", name: "updated_date", static: false, private: false, access: { has: function (obj) { return "updated_date" in obj; }, get: function (obj) { return obj.updated_date; }, set: function (obj, value) { obj.updated_date = value; } }, metadata: _metadata }, _updated_date_initializers, _updated_date_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Category = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Category = _classThis;
}();
exports.Category = Category;
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);
exports.CategorySchema.index({ category_name_normalized: 1 }, { unique: true, sparse: true });
/** Backfill + syncIndexes in CategoriesService.onModuleInit — avoid building unique index before backfill */
exports.CategorySchema.set('autoIndex', false);
