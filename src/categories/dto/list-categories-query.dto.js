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
exports.ListCategoriesQueryDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var ListCategoriesQueryDto = function () {
    var _a;
    var _sector_decorators;
    var _sector_initializers = [];
    var _sector_extraInitializers = [];
    var _sectors_decorators;
    var _sectors_initializers = [];
    var _sectors_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _sort_decorators;
    var _sort_initializers = [];
    var _sort_extraInitializers = [];
    var _raw_material_decorators;
    var _raw_material_initializers = [];
    var _raw_material_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListCategoriesQueryDto() {
                this.sector = __runInitializers(this, _sector_initializers, void 0);
                this.sectors = (__runInitializers(this, _sector_extraInitializers), __runInitializers(this, _sectors_initializers, void 0));
                this.status = (__runInitializers(this, _sectors_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.sort = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sort_initializers, void 0));
                this.raw_material = (__runInitializers(this, _sort_extraInitializers), __runInitializers(this, _raw_material_initializers, void 0));
                __runInitializers(this, _raw_material_extraInitializers);
            }
            return ListCategoriesQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sector_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 1,
                    description: 'Filter by sector id',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _sectors_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: '1,2,5',
                    description: 'Listing only: filter by multiple sector ids (multi-select). Pass comma-separated values.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 1,
                    description: 'Filter by category status (category_status)',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _sort_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['asc', 'desc'],
                    default: 'asc',
                    description: 'Sort by category_name: asc = A–Z, desc = Z–A',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['asc', 'desc'])];
            _raw_material_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: '1,3,5',
                    description: 'Filter by raw material ids (multi-select). Pass comma-separated values; matches categories containing any selected raw material.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _sector_decorators, { kind: "field", name: "sector", static: false, private: false, access: { has: function (obj) { return "sector" in obj; }, get: function (obj) { return obj.sector; }, set: function (obj, value) { obj.sector = value; } }, metadata: _metadata }, _sector_initializers, _sector_extraInitializers);
            __esDecorate(null, null, _sectors_decorators, { kind: "field", name: "sectors", static: false, private: false, access: { has: function (obj) { return "sectors" in obj; }, get: function (obj) { return obj.sectors; }, set: function (obj, value) { obj.sectors = value; } }, metadata: _metadata }, _sectors_initializers, _sectors_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _sort_decorators, { kind: "field", name: "sort", static: false, private: false, access: { has: function (obj) { return "sort" in obj; }, get: function (obj) { return obj.sort; }, set: function (obj, value) { obj.sort = value; } }, metadata: _metadata }, _sort_initializers, _sort_extraInitializers);
            __esDecorate(null, null, _raw_material_decorators, { kind: "field", name: "raw_material", static: false, private: false, access: { has: function (obj) { return "raw_material" in obj; }, get: function (obj) { return obj.raw_material; }, set: function (obj, value) { obj.raw_material = value; } }, metadata: _metadata }, _raw_material_initializers, _raw_material_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListCategoriesQueryDto = ListCategoriesQueryDto;
