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
exports.ListProductsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
function normalizeOptionalString(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    var v = String(value).trim();
    return v === '' ? undefined : v;
}
/** Query: `0,1` or repeated keys → EOI `productStatus` list. */
function normalizeProductStatusListFromQuery(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var source = Array.isArray(value) ? value : String(value).split(',');
    var parsed = source
        .map(function (v) { return Number(String(v).trim()); })
        .filter(function (v) { return Number.isFinite(v); });
    return parsed.length > 0 ? parsed : undefined;
}
var ListProductsDto = function () {
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
    var _productStatus_decorators;
    var _productStatus_initializers = [];
    var _productStatus_extraInitializers = [];
    var _productStatusList_decorators;
    var _productStatusList_initializers = [];
    var _productStatusList_extraInitializers = [];
    var _product_status_list_decorators;
    var _product_status_list_initializers = [];
    var _product_status_list_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _dateFrom_decorators;
    var _dateFrom_initializers = [];
    var _dateFrom_extraInitializers = [];
    var _dateTo_decorators;
    var _dateTo_initializers = [];
    var _dateTo_extraInitializers = [];
    var _countryId_decorators;
    var _countryId_initializers = [];
    var _countryId_extraInitializers = [];
    var _country_id_decorators;
    var _country_id_initializers = [];
    var _country_id_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _state_name_decorators;
    var _state_name_initializers = [];
    var _state_name_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _city_name_decorators;
    var _city_name_initializers = [];
    var _city_name_extraInitializers = [];
    var _sort_decorators;
    var _sort_initializers = [];
    var _sort_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListProductsDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.productStatus = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _productStatus_initializers, void 0));
                this.productStatusList = (__runInitializers(this, _productStatus_extraInitializers), __runInitializers(this, _productStatusList_initializers, void 0));
                this.product_status_list = (__runInitializers(this, _productStatusList_extraInitializers), __runInitializers(this, _product_status_list_initializers, void 0));
                this.status = (__runInitializers(this, _product_status_list_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.categoryId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.dateFrom = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _dateFrom_initializers, void 0));
                this.dateTo = (__runInitializers(this, _dateFrom_extraInitializers), __runInitializers(this, _dateTo_initializers, void 0));
                this.countryId = (__runInitializers(this, _dateTo_extraInitializers), __runInitializers(this, _countryId_initializers, void 0));
                this.country_id = (__runInitializers(this, _countryId_extraInitializers), __runInitializers(this, _country_id_initializers, void 0));
                this.state = (__runInitializers(this, _country_id_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.state_name = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _state_name_initializers, void 0));
                this.city = (__runInitializers(this, _state_name_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.city_name = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _city_name_initializers, void 0));
                this.sort = (__runInitializers(this, _city_name_extraInitializers), __runInitializers(this, _sort_initializers, 'desc'));
                __runInitializers(this, _sort_extraInitializers);
            }
            return ListProductsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Page number (default: 1)',
                    example: 1,
                    required: false,
                    minimum: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Number of items per page (default: 20)',
                    example: 20,
                    required: false,
                    minimum: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _search_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Global search term (searches in product_name, eoi_no, urn_no, category.category_name)',
                    example: 'Solar Panel',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _productStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Filter EOIs by **single** `productStatus` (EOI list status). Prefer `productStatusList` for multiple values. ' +
                        'If **both** this and `productStatusList` are omitted, the list defaults to **Pending (0) + Submitted (1)** only. ' +
                        'URN is included if any child matches. `4` = expired certified (past validtill).',
                    example: 0,
                    required: false,
                    enum: [0, 1, 2, 3, 4],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4])];
            _productStatusList_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter EOIs by **multiple** EOI `productStatus` codes (comma-separated or repeated query param), e.g. **`0,1`** = Pending + Submitted. ' +
                        'Takes precedence over `productStatus` / `status` when non-empty. Values: **0** Pending, **1** Submitted, **2** Certified, **3** Rejected, **4** Expired certified.',
                    example: '0,1',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeProductStatusListFromQuery(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4], { each: true })];
            _product_status_list_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `productStatusList`.',
                    example: '0,1',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeProductStatusListFromQuery(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4], { each: true })];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Deprecated alias for productStatus',
                    example: 0,
                    enum: [0, 1, 2, 3, 4],
                    deprecated: true,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4])];
            _categoryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by category MongoDB ObjectId',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsMongoId)()];
            _dateFrom_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter products created on or after this date (YYYY-MM-DD)',
                    example: '2026-01-01',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/)];
            _dateTo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter products created on or before this date (YYYY-MM-DD)',
                    example: '2026-12-31',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/)];
            _countryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by manufacturing plant **country** (MongoDB `_id` from countries dropdown).',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsMongoId)()];
            _country_id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `countryId`.',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsMongoId)()];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by plant **state name** (free text, case-insensitive partial match). Not a state id.',
                    example: 'Telangana',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)()];
            _state_name_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `state` (text search).',
                    example: 'Telangana',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)()];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by plant **city** (free text, case-insensitive partial match).',
                    example: 'Hyderabad',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)()];
            _city_name_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `city`.',
                    example: 'Hyderabad',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)()];
            _sort_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Sort order (default: desc)',
                    example: 'desc',
                    required: false,
                    enum: ['asc', 'desc'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsIn)(['asc', 'desc'])];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _productStatus_decorators, { kind: "field", name: "productStatus", static: false, private: false, access: { has: function (obj) { return "productStatus" in obj; }, get: function (obj) { return obj.productStatus; }, set: function (obj, value) { obj.productStatus = value; } }, metadata: _metadata }, _productStatus_initializers, _productStatus_extraInitializers);
            __esDecorate(null, null, _productStatusList_decorators, { kind: "field", name: "productStatusList", static: false, private: false, access: { has: function (obj) { return "productStatusList" in obj; }, get: function (obj) { return obj.productStatusList; }, set: function (obj, value) { obj.productStatusList = value; } }, metadata: _metadata }, _productStatusList_initializers, _productStatusList_extraInitializers);
            __esDecorate(null, null, _product_status_list_decorators, { kind: "field", name: "product_status_list", static: false, private: false, access: { has: function (obj) { return "product_status_list" in obj; }, get: function (obj) { return obj.product_status_list; }, set: function (obj, value) { obj.product_status_list = value; } }, metadata: _metadata }, _product_status_list_initializers, _product_status_list_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _dateFrom_decorators, { kind: "field", name: "dateFrom", static: false, private: false, access: { has: function (obj) { return "dateFrom" in obj; }, get: function (obj) { return obj.dateFrom; }, set: function (obj, value) { obj.dateFrom = value; } }, metadata: _metadata }, _dateFrom_initializers, _dateFrom_extraInitializers);
            __esDecorate(null, null, _dateTo_decorators, { kind: "field", name: "dateTo", static: false, private: false, access: { has: function (obj) { return "dateTo" in obj; }, get: function (obj) { return obj.dateTo; }, set: function (obj, value) { obj.dateTo = value; } }, metadata: _metadata }, _dateTo_initializers, _dateTo_extraInitializers);
            __esDecorate(null, null, _countryId_decorators, { kind: "field", name: "countryId", static: false, private: false, access: { has: function (obj) { return "countryId" in obj; }, get: function (obj) { return obj.countryId; }, set: function (obj, value) { obj.countryId = value; } }, metadata: _metadata }, _countryId_initializers, _countryId_extraInitializers);
            __esDecorate(null, null, _country_id_decorators, { kind: "field", name: "country_id", static: false, private: false, access: { has: function (obj) { return "country_id" in obj; }, get: function (obj) { return obj.country_id; }, set: function (obj, value) { obj.country_id = value; } }, metadata: _metadata }, _country_id_initializers, _country_id_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _state_name_decorators, { kind: "field", name: "state_name", static: false, private: false, access: { has: function (obj) { return "state_name" in obj; }, get: function (obj) { return obj.state_name; }, set: function (obj, value) { obj.state_name = value; } }, metadata: _metadata }, _state_name_initializers, _state_name_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _city_name_decorators, { kind: "field", name: "city_name", static: false, private: false, access: { has: function (obj) { return "city_name" in obj; }, get: function (obj) { return obj.city_name; }, set: function (obj, value) { obj.city_name = value; } }, metadata: _metadata }, _city_name_initializers, _city_name_extraInitializers);
            __esDecorate(null, null, _sort_decorators, { kind: "field", name: "sort", static: false, private: false, access: { has: function (obj) { return "sort" in obj; }, get: function (obj) { return obj.sort; }, set: function (obj, value) { obj.sort = value; } }, metadata: _metadata }, _sort_initializers, _sort_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListProductsDto = ListProductsDto;
