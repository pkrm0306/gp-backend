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
exports.StandardCategorySchema = exports.StandardCategory = void 0;
var mongoose_1 = require("@nestjs/mongoose");
/** Many-to-many: numeric `standard.id` ↔ numeric `category_id` (GET /categories). */
var StandardCategory = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'standard_categories', timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _standard_id_decorators;
    var _standard_id_initializers = [];
    var _standard_id_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var StandardCategory = _classThis = /** @class */ (function () {
        function StandardCategory_1() {
            this.standard_id = __runInitializers(this, _standard_id_initializers, void 0);
            this.category_id = (__runInitializers(this, _standard_id_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
            __runInitializers(this, _category_id_extraInitializers);
        }
        return StandardCategory_1;
    }());
    __setFunctionName(_classThis, "StandardCategory");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _standard_id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _category_id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _standard_id_decorators, { kind: "field", name: "standard_id", static: false, private: false, access: { has: function (obj) { return "standard_id" in obj; }, get: function (obj) { return obj.standard_id; }, set: function (obj, value) { obj.standard_id = value; } }, metadata: _metadata }, _standard_id_initializers, _standard_id_extraInitializers);
        __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StandardCategory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StandardCategory = _classThis;
}();
exports.StandardCategory = StandardCategory;
exports.StandardCategorySchema = mongoose_1.SchemaFactory.createForClass(StandardCategory);
exports.StandardCategorySchema.index({ standard_id: 1, category_id: 1 }, { unique: true });
exports.StandardCategorySchema.index({ category_id: 1 });
exports.StandardCategorySchema.index({ standard_id: 1 });
