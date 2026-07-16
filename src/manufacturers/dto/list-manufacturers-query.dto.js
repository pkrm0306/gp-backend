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
exports.ListManufacturersQueryDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var list_manufacturers_query_util_1 = require("../utils/list-manufacturers-query.util");
var ListManufacturersQueryDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _manufacturerName_decorators;
    var _manufacturerName_initializers = [];
    var _manufacturerName_extraInitializers = [];
    var _gpInternalId_decorators;
    var _gpInternalId_initializers = [];
    var _gpInternalId_extraInitializers = [];
    var _manufacturerInitial_decorators;
    var _manufacturerInitial_initializers = [];
    var _manufacturerInitial_extraInitializers = [];
    var _scope_decorators;
    var _scope_initializers = [];
    var _scope_extraInitializers = [];
    var _manufacturerStatus_decorators;
    var _manufacturerStatus_initializers = [];
    var _manufacturerStatus_extraInitializers = [];
    var _vendor_status_decorators;
    var _vendor_status_initializers = [];
    var _vendor_status_extraInitializers = [];
    var _vendor_status_list_decorators;
    var _vendor_status_list_initializers = [];
    var _vendor_status_list_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _sortBy_decorators;
    var _sortBy_initializers = [];
    var _sortBy_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var _format_decorators;
    var _format_initializers = [];
    var _format_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListManufacturersQueryDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.page = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.manufacturerName = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _manufacturerName_initializers, void 0));
                this.gpInternalId = (__runInitializers(this, _manufacturerName_extraInitializers), __runInitializers(this, _gpInternalId_initializers, void 0));
                this.manufacturerInitial = (__runInitializers(this, _gpInternalId_extraInitializers), __runInitializers(this, _manufacturerInitial_initializers, void 0));
                this.scope = (__runInitializers(this, _manufacturerInitial_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.manufacturerStatus = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _manufacturerStatus_initializers, void 0));
                this.vendor_status = (__runInitializers(this, _manufacturerStatus_extraInitializers), __runInitializers(this, _vendor_status_initializers, void 0));
                this.vendor_status_list = (__runInitializers(this, _vendor_status_extraInitializers), __runInitializers(this, _vendor_status_list_initializers, void 0));
                this.status = (__runInitializers(this, _vendor_status_list_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.sortBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sortBy_initializers, 'createdAt'));
                this.order = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _order_initializers, 'desc'));
                this.format = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _format_initializers, void 0));
                __runInitializers(this, _format_extraInitializers);
            }
            return ListManufacturersQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Optional manufacturer MongoDB id. When provided, returns only that manufacturer (ignores pagination/search).',
                    example: '660000000000000000000000',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsMongoId)()];
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    default: 10,
                    description: 'Page size (max 500).',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(500)];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Case-insensitive partial match on manufacturer name, vendor name, email, or GP internal ID',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _manufacturerName_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Case-insensitive partial filter by manufacturerName',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _gpInternalId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Case-insensitive partial filter by gpInternalId',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _manufacturerInitial_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Case-insensitive partial filter by manufacturerInitial',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _scope_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'List scope: `verified` (manufacturerStatus=1), `unverified` (0 or 2, excluding vendors still on the registration OTP step), or `all`. Use `verified` for the verified-manufacturers admin screen.',
                    enum: ['verified', 'unverified', 'all'],
                    default: 'all',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['verified', 'unverified', 'all'])];
            _manufacturerStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: '0 deleted / pending, 1 verified, 2 unverified. Ignored when `scope` is `verified` or `unverified` unless you need to override.',
                    enum: [0, 1, 2],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsEnum)([0, 1, 2])];
            _vendor_status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Vendor lifecycle (single value): 0 unverified, 1 active, 2 inactive. Prefer `status` for UI Active/Inactive multiselect.',
                    enum: [0, 1, 2],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsEnum)([0, 1, 2])];
            _vendor_status_list_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Vendor lifecycle (multi): same codes as vendor_status. Comma-separated or repeated, e.g. vendor_status=0,1',
                    type: [Number],
                    example: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, list_manufacturers_query_util_1.normalizeNumberArray)(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2], { each: true })];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'UI status multiselect: `active` → vendor_status=1 (toggle On); `inactive` → vendor_status≠1 (toggle Off, includes 0/2/null/unset). Comma-separated or repeated.',
                    type: [String],
                    example: ['active'],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, list_manufacturers_query_util_1.normalizeStatusLabels)(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsIn)(['active', 'inactive'], { each: true })];
            _sortBy_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['createdAt', 'updatedAt', 'manufacturerName'],
                    default: 'createdAt',
                    description: 'Sort field. Admin verified/unverified lists use `updatedAt`; legacy clients may use `createdAt`.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['createdAt', 'updatedAt', 'manufacturerName'])];
            _order_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'], default: 'desc' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['asc', 'desc'])];
            _format_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Only for `GET /api/manufacturers/export`: `csv` (default) or `xlsx` spreadsheet with Initial and Status columns aligned to the admin listing.',
                    enum: ['csv', 'xlsx'],
                    default: 'csv',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['csv', 'xlsx'])];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _manufacturerName_decorators, { kind: "field", name: "manufacturerName", static: false, private: false, access: { has: function (obj) { return "manufacturerName" in obj; }, get: function (obj) { return obj.manufacturerName; }, set: function (obj, value) { obj.manufacturerName = value; } }, metadata: _metadata }, _manufacturerName_initializers, _manufacturerName_extraInitializers);
            __esDecorate(null, null, _gpInternalId_decorators, { kind: "field", name: "gpInternalId", static: false, private: false, access: { has: function (obj) { return "gpInternalId" in obj; }, get: function (obj) { return obj.gpInternalId; }, set: function (obj, value) { obj.gpInternalId = value; } }, metadata: _metadata }, _gpInternalId_initializers, _gpInternalId_extraInitializers);
            __esDecorate(null, null, _manufacturerInitial_decorators, { kind: "field", name: "manufacturerInitial", static: false, private: false, access: { has: function (obj) { return "manufacturerInitial" in obj; }, get: function (obj) { return obj.manufacturerInitial; }, set: function (obj, value) { obj.manufacturerInitial = value; } }, metadata: _metadata }, _manufacturerInitial_initializers, _manufacturerInitial_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: function (obj) { return "scope" in obj; }, get: function (obj) { return obj.scope; }, set: function (obj, value) { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _manufacturerStatus_decorators, { kind: "field", name: "manufacturerStatus", static: false, private: false, access: { has: function (obj) { return "manufacturerStatus" in obj; }, get: function (obj) { return obj.manufacturerStatus; }, set: function (obj, value) { obj.manufacturerStatus = value; } }, metadata: _metadata }, _manufacturerStatus_initializers, _manufacturerStatus_extraInitializers);
            __esDecorate(null, null, _vendor_status_decorators, { kind: "field", name: "vendor_status", static: false, private: false, access: { has: function (obj) { return "vendor_status" in obj; }, get: function (obj) { return obj.vendor_status; }, set: function (obj, value) { obj.vendor_status = value; } }, metadata: _metadata }, _vendor_status_initializers, _vendor_status_extraInitializers);
            __esDecorate(null, null, _vendor_status_list_decorators, { kind: "field", name: "vendor_status_list", static: false, private: false, access: { has: function (obj) { return "vendor_status_list" in obj; }, get: function (obj) { return obj.vendor_status_list; }, set: function (obj, value) { obj.vendor_status_list = value; } }, metadata: _metadata }, _vendor_status_list_initializers, _vendor_status_list_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: function (obj) { return "sortBy" in obj; }, get: function (obj) { return obj.sortBy; }, set: function (obj, value) { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: function (obj) { return "format" in obj; }, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListManufacturersQueryDto = ListManufacturersQueryDto;
