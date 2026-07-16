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
exports.ListStandardsQueryDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var parse_resource_standard_types_util_1 = require("../utils/parse-resource-standard-types.util");
var ListStandardsQueryDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _resource_standard_type_decorators;
    var _resource_standard_type_initializers = [];
    var _resource_standard_type_extraInitializers = [];
    var _resource_standard_types_decorators;
    var _resource_standard_types_initializers = [];
    var _resource_standard_types_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _sector_decorators;
    var _sector_initializers = [];
    var _sector_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _sortBy_decorators;
    var _sortBy_initializers = [];
    var _sortBy_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListStandardsQueryDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.resource_standard_type = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _resource_standard_type_initializers, void 0));
                this.resource_standard_types = (__runInitializers(this, _resource_standard_type_extraInitializers), __runInitializers(this, _resource_standard_types_initializers, void 0));
                this.category_id = (__runInitializers(this, _resource_standard_types_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
                this.sector = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _sector_initializers, void 0));
                this.status = (__runInitializers(this, _sector_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.sortBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sortBy_initializers, 'id'));
                this.order = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _order_initializers, 'asc'));
                __runInitializers(this, _order_extraInitializers);
            }
            return ListStandardsQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    default: 10,
                    description: 'Page size (max 500). For CSV export use GET /api/standards/export instead.',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(500)];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Case-insensitive partial match on name',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _resource_standard_type_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'Environmental',
                    description: 'Single standard type (legacy). Merged with resource_standard_types.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _resource_standard_types_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'Environmental,Energy',
                    description: 'Multi-select standard types. Comma-separated string, JSON array string, or repeated query param (resource_standard_types or resource_standard_types[]).',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, parse_resource_standard_types_util_1.normalizeResourceStandardTypeList)(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _category_id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 1,
                    description: 'Numeric `category_id` from GET /categories; limits results to that category.',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _sector_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 1,
                    description: 'Numeric sector `id` from GET /api/sectors; limits results to standards linked to any category in that sector.',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: [0, 1] }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsEnum)([0, 1])];
            _sortBy_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['id', 'name', 'resource_standard_type', 'created_at'],
                    default: 'id',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['id', 'name', 'resource_standard_type', 'created_at'])];
            _order_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'], default: 'asc' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['asc', 'desc'])];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _resource_standard_type_decorators, { kind: "field", name: "resource_standard_type", static: false, private: false, access: { has: function (obj) { return "resource_standard_type" in obj; }, get: function (obj) { return obj.resource_standard_type; }, set: function (obj, value) { obj.resource_standard_type = value; } }, metadata: _metadata }, _resource_standard_type_initializers, _resource_standard_type_extraInitializers);
            __esDecorate(null, null, _resource_standard_types_decorators, { kind: "field", name: "resource_standard_types", static: false, private: false, access: { has: function (obj) { return "resource_standard_types" in obj; }, get: function (obj) { return obj.resource_standard_types; }, set: function (obj, value) { obj.resource_standard_types = value; } }, metadata: _metadata }, _resource_standard_types_initializers, _resource_standard_types_extraInitializers);
            __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
            __esDecorate(null, null, _sector_decorators, { kind: "field", name: "sector", static: false, private: false, access: { has: function (obj) { return "sector" in obj; }, get: function (obj) { return obj.sector; }, set: function (obj, value) { obj.sector = value; } }, metadata: _metadata }, _sector_initializers, _sector_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: function (obj) { return "sortBy" in obj; }, get: function (obj) { return obj.sortBy; }, set: function (obj, value) { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListStandardsQueryDto = ListStandardsQueryDto;
