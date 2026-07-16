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
exports.AdminListProductsDto = exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN = void 0;
exports.normalizeNumberArray = normalizeNumberArray;
exports.normalizeStringArray = normalizeStringArray;
exports.normalizeMongoIdArray = normalizeMongoIdArray;
exports.normalizeOptionalString = normalizeOptionalString;
exports.normalizeOptionalMongoId = normalizeOptionalMongoId;
exports.normalizeAdminListValidTillMonthYearString = normalizeAdminListValidTillMonthYearString;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function normalizeNumberArray(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var source = Array.isArray(value) ? value : String(value).split(',');
    var parsed = source
        .map(function (v) { return Number(String(v).trim()); })
        .filter(function (v) { return Number.isFinite(v); });
    return parsed.length > 0 ? parsed : undefined;
}
function normalizeStringArray(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var source = Array.isArray(value) ? value : String(value).split(',');
    var parsed = source
        .map(function (v) { return String(v).trim(); })
        .filter(function (v) { return v.length > 0; });
    return parsed.length > 0 ? parsed : undefined;
}
function normalizeMongoIdArray(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var source = Array.isArray(value) ? value : String(value).split(',');
    var valid = source
        .map(function (entry) { return normalizeOptionalMongoId(entry); })
        .filter(function (id) { return Boolean(id); });
    return valid.length > 0 ? valid : undefined;
}
function normalizeOptionalString(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    var v = String(value).trim();
    return v === '' ? undefined : v;
}
/** Optional Mongo `_id` filter — empty/invalid/sentinel values become `undefined` (no 400). */
function normalizeOptionalMongoId(value) {
    var v = normalizeOptionalString(value);
    if (!v) {
        return undefined;
    }
    var lower = v.toLowerCase();
    if (lower === 'all' ||
        lower === 'null' ||
        lower === 'undefined' ||
        lower === 'none' ||
        lower === 'any') {
        return undefined;
    }
    return /^[a-fA-F0-9]{24}$/.test(v) ? v : undefined;
}
/** Certified valid-till filter: `YYYY-MM` (month + year only). */
exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
function normalizeAdminListValidTillMonthYearString(value) {
    var v = normalizeOptionalString(value);
    if (!v) {
        return undefined;
    }
    var match = /^(\d{4}-(0[1-9]|1[0-2]))/.exec(v);
    return match ? match[1] : v;
}
function normalizeOptionalNumber(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var n = Number(value);
    return Number.isFinite(n) ? n : undefined;
}
var AdminListProductsDto = function () {
    var _a;
    var _urnStatusLabels_decorators;
    var _urnStatusLabels_initializers = [];
    var _urnStatusLabels_extraInitializers = [];
    var _urn_status_labels_decorators;
    var _urn_status_labels_initializers = [];
    var _urn_status_labels_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _productStatus_decorators;
    var _productStatus_initializers = [];
    var _productStatus_extraInitializers = [];
    var _product_status_decorators;
    var _product_status_initializers = [];
    var _product_status_extraInitializers = [];
    var _product_type_decorators;
    var _product_type_initializers = [];
    var _product_type_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _categoryIds_decorators;
    var _categoryIds_initializers = [];
    var _categoryIds_extraInitializers = [];
    var _category_ids_decorators;
    var _category_ids_initializers = [];
    var _category_ids_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _manufacturer_id_decorators;
    var _manufacturer_id_initializers = [];
    var _manufacturer_id_extraInitializers = [];
    var _manufacturerIds_decorators;
    var _manufacturerIds_initializers = [];
    var _manufacturerIds_extraInitializers = [];
    var _manufacturer_ids_decorators;
    var _manufacturer_ids_initializers = [];
    var _manufacturer_ids_extraInitializers = [];
    var _manufacturerNames_decorators;
    var _manufacturerNames_initializers = [];
    var _manufacturerNames_extraInitializers = [];
    var _manufacturer_names_decorators;
    var _manufacturer_names_initializers = [];
    var _manufacturer_names_extraInitializers = [];
    var _from_decorators;
    var _from_initializers = [];
    var _from_extraInitializers = [];
    var _to_decorators;
    var _to_initializers = [];
    var _to_extraInitializers = [];
    var _fromDate_decorators;
    var _fromDate_initializers = [];
    var _fromDate_extraInitializers = [];
    var _toDate_decorators;
    var _toDate_initializers = [];
    var _toDate_extraInitializers = [];
    var _validTillYear_decorators;
    var _validTillYear_initializers = [];
    var _validTillYear_extraInitializers = [];
    var _valid_till_year_decorators;
    var _valid_till_year_initializers = [];
    var _valid_till_year_extraInitializers = [];
    var _validTillMonth_decorators;
    var _validTillMonth_initializers = [];
    var _validTillMonth_extraInitializers = [];
    var _valid_till_month_decorators;
    var _valid_till_month_initializers = [];
    var _valid_till_month_extraInitializers = [];
    var _validTillYears_decorators;
    var _validTillYears_initializers = [];
    var _validTillYears_extraInitializers = [];
    var _valid_till_years_decorators;
    var _valid_till_years_initializers = [];
    var _valid_till_years_extraInitializers = [];
    var _validTillMonthYear_decorators;
    var _validTillMonthYear_initializers = [];
    var _validTillMonthYear_extraInitializers = [];
    var _valid_till_month_year_decorators;
    var _valid_till_month_year_initializers = [];
    var _valid_till_month_year_extraInitializers = [];
    var _validTillDate_decorators;
    var _validTillDate_initializers = [];
    var _validTillDate_extraInitializers = [];
    var _validTill_decorators;
    var _validTill_initializers = [];
    var _validTill_extraInitializers = [];
    var _valid_till_decorators;
    var _valid_till_initializers = [];
    var _valid_till_extraInitializers = [];
    var _valid_till_date_decorators;
    var _valid_till_date_initializers = [];
    var _valid_till_date_extraInitializers = [];
    var _validtillDate_decorators;
    var _validtillDate_initializers = [];
    var _validtillDate_extraInitializers = [];
    var _validtill_date_decorators;
    var _validtill_date_initializers = [];
    var _validtill_date_extraInitializers = [];
    var _validTillFrom_decorators;
    var _validTillFrom_initializers = [];
    var _validTillFrom_extraInitializers = [];
    var _validTillTo_decorators;
    var _validTillTo_initializers = [];
    var _validTillTo_extraInitializers = [];
    var _valid_till_from_decorators;
    var _valid_till_from_initializers = [];
    var _valid_till_from_extraInitializers = [];
    var _valid_till_to_decorators;
    var _valid_till_to_initializers = [];
    var _valid_till_to_extraInitializers = [];
    var _countryId_decorators;
    var _countryId_initializers = [];
    var _countryId_extraInitializers = [];
    var _country_id_decorators;
    var _country_id_initializers = [];
    var _country_id_extraInitializers = [];
    var _stateId_decorators;
    var _stateId_initializers = [];
    var _stateId_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _state_name_decorators;
    var _state_name_initializers = [];
    var _state_name_extraInitializers = [];
    var _stateIds_decorators;
    var _stateIds_initializers = [];
    var _stateIds_extraInitializers = [];
    var _state_ids_decorators;
    var _state_ids_initializers = [];
    var _state_ids_extraInitializers = [];
    var _stateNames_decorators;
    var _stateNames_initializers = [];
    var _stateNames_extraInitializers = [];
    var _state_names_decorators;
    var _state_names_initializers = [];
    var _state_names_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _city_name_decorators;
    var _city_name_initializers = [];
    var _city_name_extraInitializers = [];
    var _cities_decorators;
    var _cities_initializers = [];
    var _cities_extraInitializers = [];
    var _sectorId_decorators;
    var _sectorId_initializers = [];
    var _sectorId_extraInitializers = [];
    var _sector_id_decorators;
    var _sector_id_initializers = [];
    var _sector_id_extraInitializers = [];
    var _sectorIds_decorators;
    var _sectorIds_initializers = [];
    var _sectorIds_extraInitializers = [];
    var _sector_ids_decorators;
    var _sector_ids_initializers = [];
    var _sector_ids_extraInitializers = [];
    var _buildingIds_decorators;
    var _buildingIds_initializers = [];
    var _buildingIds_extraInitializers = [];
    var _building_ids_decorators;
    var _building_ids_initializers = [];
    var _building_ids_extraInitializers = [];
    var _buildings_decorators;
    var _buildings_initializers = [];
    var _buildings_extraInitializers = [];
    var _buildingId_decorators;
    var _buildingId_initializers = [];
    var _buildingId_extraInitializers = [];
    var _building_id_decorators;
    var _building_id_initializers = [];
    var _building_id_extraInitializers = [];
    var _building_decorators;
    var _building_initializers = [];
    var _building_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _groupBy_decorators;
    var _groupBy_initializers = [];
    var _groupBy_extraInitializers = [];
    var _sortBy_decorators;
    var _sortBy_initializers = [];
    var _sortBy_extraInitializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    var _sortOrder_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AdminListProductsDto() {
                /**
                 * UI-only fields some admin clients send; not used by the API.
                 * Whitelisted so ValidationPipe `forbidNonWhitelisted` does not reject the body.
                 * Clients may send camelCase or snake_case.
                 */
                this.urnStatusLabels = __runInitializers(this, _urnStatusLabels_initializers, void 0);
                this.urn_status_labels = (__runInitializers(this, _urnStatusLabels_extraInitializers), __runInitializers(this, _urn_status_labels_initializers, void 0));
                this.status = (__runInitializers(this, _urn_status_labels_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.productStatus = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _productStatus_initializers, void 0));
                this.product_status = (__runInitializers(this, _productStatus_extraInitializers), __runInitializers(this, _product_status_initializers, void 0));
                this.product_type = (__runInitializers(this, _product_status_extraInitializers), __runInitializers(this, _product_type_initializers, void 0));
                this.categoryId = (__runInitializers(this, _product_type_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.category_id = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
                this.categoryIds = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _categoryIds_initializers, void 0));
                this.category_ids = (__runInitializers(this, _categoryIds_extraInitializers), __runInitializers(this, _category_ids_initializers, void 0));
                this.manufacturerId = (__runInitializers(this, _category_ids_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
                this.manufacturer_id = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _manufacturer_id_initializers, void 0));
                this.manufacturerIds = (__runInitializers(this, _manufacturer_id_extraInitializers), __runInitializers(this, _manufacturerIds_initializers, void 0));
                this.manufacturer_ids = (__runInitializers(this, _manufacturerIds_extraInitializers), __runInitializers(this, _manufacturer_ids_initializers, void 0));
                this.manufacturerNames = (__runInitializers(this, _manufacturer_ids_extraInitializers), __runInitializers(this, _manufacturerNames_initializers, void 0));
                this.manufacturer_names = (__runInitializers(this, _manufacturerNames_extraInitializers), __runInitializers(this, _manufacturer_names_initializers, void 0));
                this.from = (__runInitializers(this, _manufacturer_names_extraInitializers), __runInitializers(this, _from_initializers, void 0));
                this.to = (__runInitializers(this, _from_extraInitializers), __runInitializers(this, _to_initializers, void 0));
                this.fromDate = (__runInitializers(this, _to_extraInitializers), __runInitializers(this, _fromDate_initializers, void 0));
                this.toDate = (__runInitializers(this, _fromDate_extraInitializers), __runInitializers(this, _toDate_initializers, void 0));
                this.validTillYear = (__runInitializers(this, _toDate_extraInitializers), __runInitializers(this, _validTillYear_initializers, void 0));
                this.valid_till_year = (__runInitializers(this, _validTillYear_extraInitializers), __runInitializers(this, _valid_till_year_initializers, void 0));
                this.validTillMonth = (__runInitializers(this, _valid_till_year_extraInitializers), __runInitializers(this, _validTillMonth_initializers, void 0));
                this.valid_till_month = (__runInitializers(this, _validTillMonth_extraInitializers), __runInitializers(this, _valid_till_month_initializers, void 0));
                this.validTillYears = (__runInitializers(this, _valid_till_month_extraInitializers), __runInitializers(this, _validTillYears_initializers, void 0));
                this.valid_till_years = (__runInitializers(this, _validTillYears_extraInitializers), __runInitializers(this, _valid_till_years_initializers, void 0));
                this.validTillMonthYear = (__runInitializers(this, _valid_till_years_extraInitializers), __runInitializers(this, _validTillMonthYear_initializers, void 0));
                this.valid_till_month_year = (__runInitializers(this, _validTillMonthYear_extraInitializers), __runInitializers(this, _valid_till_month_year_initializers, void 0));
                this.validTillDate = (__runInitializers(this, _valid_till_month_year_extraInitializers), __runInitializers(this, _validTillDate_initializers, void 0));
                this.validTill = (__runInitializers(this, _validTillDate_extraInitializers), __runInitializers(this, _validTill_initializers, void 0));
                this.valid_till = (__runInitializers(this, _validTill_extraInitializers), __runInitializers(this, _valid_till_initializers, void 0));
                this.valid_till_date = (__runInitializers(this, _valid_till_extraInitializers), __runInitializers(this, _valid_till_date_initializers, void 0));
                this.validtillDate = (__runInitializers(this, _valid_till_date_extraInitializers), __runInitializers(this, _validtillDate_initializers, void 0));
                this.validtill_date = (__runInitializers(this, _validtillDate_extraInitializers), __runInitializers(this, _validtill_date_initializers, void 0));
                this.validTillFrom = (__runInitializers(this, _validtill_date_extraInitializers), __runInitializers(this, _validTillFrom_initializers, void 0));
                this.validTillTo = (__runInitializers(this, _validTillFrom_extraInitializers), __runInitializers(this, _validTillTo_initializers, void 0));
                this.valid_till_from = (__runInitializers(this, _validTillTo_extraInitializers), __runInitializers(this, _valid_till_from_initializers, void 0));
                this.valid_till_to = (__runInitializers(this, _valid_till_from_extraInitializers), __runInitializers(this, _valid_till_to_initializers, void 0));
                this.countryId = (__runInitializers(this, _valid_till_to_extraInitializers), __runInitializers(this, _countryId_initializers, void 0));
                this.country_id = (__runInitializers(this, _countryId_extraInitializers), __runInitializers(this, _country_id_initializers, void 0));
                this.stateId = (__runInitializers(this, _country_id_extraInitializers), __runInitializers(this, _stateId_initializers, void 0));
                this.state = (__runInitializers(this, _stateId_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.state_name = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _state_name_initializers, void 0));
                this.stateIds = (__runInitializers(this, _state_name_extraInitializers), __runInitializers(this, _stateIds_initializers, void 0));
                this.state_ids = (__runInitializers(this, _stateIds_extraInitializers), __runInitializers(this, _state_ids_initializers, void 0));
                this.stateNames = (__runInitializers(this, _state_ids_extraInitializers), __runInitializers(this, _stateNames_initializers, void 0));
                this.state_names = (__runInitializers(this, _stateNames_extraInitializers), __runInitializers(this, _state_names_initializers, void 0));
                this.city = (__runInitializers(this, _state_names_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.city_name = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _city_name_initializers, void 0));
                this.cities = (__runInitializers(this, _city_name_extraInitializers), __runInitializers(this, _cities_initializers, void 0));
                this.sectorId = (__runInitializers(this, _cities_extraInitializers), __runInitializers(this, _sectorId_initializers, void 0));
                this.sector_id = (__runInitializers(this, _sectorId_extraInitializers), __runInitializers(this, _sector_id_initializers, void 0));
                this.sectorIds = (__runInitializers(this, _sector_id_extraInitializers), __runInitializers(this, _sectorIds_initializers, void 0));
                this.sector_ids = (__runInitializers(this, _sectorIds_extraInitializers), __runInitializers(this, _sector_ids_initializers, void 0));
                this.buildingIds = (__runInitializers(this, _sector_ids_extraInitializers), __runInitializers(this, _buildingIds_initializers, void 0));
                this.building_ids = (__runInitializers(this, _buildingIds_extraInitializers), __runInitializers(this, _building_ids_initializers, void 0));
                this.buildings = (__runInitializers(this, _building_ids_extraInitializers), __runInitializers(this, _buildings_initializers, void 0));
                this.buildingId = (__runInitializers(this, _buildings_extraInitializers), __runInitializers(this, _buildingId_initializers, void 0));
                this.building_id = (__runInitializers(this, _buildingId_extraInitializers), __runInitializers(this, _building_id_initializers, void 0));
                this.building = (__runInitializers(this, _building_id_extraInitializers), __runInitializers(this, _building_initializers, void 0));
                this.search = (__runInitializers(this, _building_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.page = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                this.groupBy = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _groupBy_initializers, 'manufacturer'));
                this.sortBy = (__runInitializers(this, _groupBy_extraInitializers), __runInitializers(this, _sortBy_initializers, 'createdDate'));
                this.sortOrder = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _sortOrder_initializers, 'desc'));
                this.order = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _order_initializers, void 0));
                this.productId = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                __runInitializers(this, _productId_extraInitializers);
            }
            return AdminListProductsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnStatusLabels_decorators = [(0, class_validator_1.Allow)()];
            _urn_status_labels_decorators = [(0, class_validator_1.Allow)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'EOI **productStatus** filter (same as `productStatus` / `product_status`). Values: **0** Pending, **1** Submitted, **2** Certified, **3** Rejected, **4** Expired (certified past validtill). ' +
                        'Omitted or empty → server uses `[0, 1]` for admin list/export. This filters **per EOI row** on `products.productStatus`, not manufacturer/vendor status.',
                    type: [Number],
                    example: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4], { each: true })];
            _productStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `status` — EOI `productStatus` codes **0–4**.',
                    type: [Number],
                    example: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4], { each: true })];
            _product_status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `status` — EOI `product_status` / productStatus codes **0–4** (snake_case).',
                    type: [Number],
                    example: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4], { each: true })];
            _product_type_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Product type filter: 0=online, 1=offline',
                    enum: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsIn)([0, 1])];
            _categoryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Category ID',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalMongoId(value);
                }), (0, class_validator_1.IsMongoId)()];
            _category_id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `categoryId` (single category filter).',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalMongoId(value);
                }), (0, class_validator_1.IsMongoId)()];
            _categoryIds_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Multi-select category filter (Mongo category `_id` values). Takes precedence over `categoryId` when non-empty.',
                    type: [String],
                    example: ['507f1f77bcf86cd799439011'],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeMongoIdArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsMongoId)({ each: true })];
            _category_ids_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `categoryIds`.',
                    type: [String],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeMongoIdArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsMongoId)({ each: true })];
            _manufacturerId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Manufacturer ID',
                    example: '507f1f77bcf86cd799439012',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalMongoId(value);
                }), (0, class_validator_1.IsMongoId)()];
            _manufacturer_id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `manufacturerId`.',
                    example: '507f1f77bcf86cd799439012',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalMongoId(value);
                }), (0, class_validator_1.IsMongoId)()];
            _manufacturerIds_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Multi-select manufacturer filter by Mongo `_id`. Takes precedence over `manufacturerId` when non-empty.',
                    type: [String],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeMongoIdArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsMongoId)({ each: true })];
            _manufacturer_ids_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `manufacturerIds`.',
                    type: [String],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeMongoIdArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsMongoId)({ each: true })];
            _manufacturerNames_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Multi-select manufacturer filter by exact `manufacturerName` (use labels from filter-options).',
                    type: [String],
                    example: ['ABC Solar Pvt Ltd'],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeStringArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _manufacturer_names_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `manufacturerNames`.',
                    type: [String],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeStringArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _from_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Created date start (ISO date string). Alias: fromDate',
                    example: '2026-01-01',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _to_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Created date end (ISO date string). Alias: toDate',
                    example: '2026-12-31',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _fromDate_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias for from',
                    example: '2026-01-01',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _toDate_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias for to',
                    example: '2026-12-31',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _validTillYear_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by valid till year',
                    example: 2026,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)()];
            _valid_till_year_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `validTillYear`.',
                    example: 2026,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)()];
            _validTillMonth_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Certified products: month (1–12) for valid-till filter. Pair with `validTillYear` when the UI uses separate month/year pickers.',
                    example: 12,
                    minimum: 1,
                    maximum: 12,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(12)];
            _valid_till_month_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `validTillMonth`.',
                    example: 12,
                    minimum: 1,
                    maximum: 12,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(12)];
            _validTillYears_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Multi-select valid-till year filter. Takes precedence over `validTillYear` when non-empty.',
                    type: [Number],
                    example: [2024, 2025],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true })];
            _valid_till_years_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `validTillYears`.',
                    type: [Number],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true })];
            _validTillMonthYear_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Certified products: filter by **valid till month + year** (`YYYY-MM`). Use a month/year picker in the UI (no day).',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _valid_till_month_year_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `validTillMonthYear`.',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _validTillDate_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `validTillMonthYear` (legacy name; value must be `YYYY-MM`, not a full date).',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _validTill_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias of `validTillMonthYear`.',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _valid_till_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `validTillMonthYear` (`valid_till`).',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _valid_till_date_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `validTillMonthYear` (`valid_till_date`).',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _validtillDate_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'DB-style camelCase alias of `validTillMonthYear` (`validtillDate` — lowercase `t` in till).',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _validtill_date_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'DB-style snake_case alias of `validTillMonthYear` (`validtill_date`).',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _validTillFrom_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Optional valid-till range start (inclusive, `YYYY-MM`). Use with `validTillTo` for a month/year range.',
                    example: '2026-01',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _validTillTo_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Optional valid-till range end (inclusive, `YYYY-MM`). Use with `validTillFrom` for a month/year range.',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _valid_till_from_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `validTillFrom`.',
                    example: '2026-01',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _valid_till_to_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `validTillTo`.',
                    example: '2026-12',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeAdminListValidTillMonthYearString(value);
                }), (0, class_validator_1.Matches)(exports.ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)];
            _countryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Plant country Mongo `_id`. Pair with free-text `state` / `city` filters on the list body.',
                    example: '507f1f77bcf86cd799439010',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalMongoId(value);
                }), (0, class_validator_1.IsMongoId)()];
            _country_id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `countryId`.',
                    example: '507f1f77bcf86cd799439010',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalMongoId(value);
                }), (0, class_validator_1.IsMongoId)()];
            _stateId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Plant state ID',
                    example: '507f1f77bcf86cd799439013',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalMongoId(value);
                }), (0, class_validator_1.IsMongoId)()];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Plant **state name** (free text, case-insensitive partial match on any plant for the EOI). Use a text input in the UI, not a dropdown. `state_name` is a snake_case alias.',
                    example: 'Telangana',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)()];
            _state_name_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `state` — free-text state name search (partial match).',
                    example: 'Telangana',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)()];
            _stateIds_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Multi-select plant state ids (Mongo). Use with `countryId`. Takes precedence over single `stateId` when non-empty.',
                    type: [String],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeMongoIdArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsMongoId)({ each: true })];
            _state_ids_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `stateIds`.',
                    type: [String],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeMongoIdArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsMongoId)({ each: true })];
            _stateNames_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Multi-select plant state names (exact match on resolved plant `stateName`, case-insensitive).',
                    type: [String],
                    example: ['Karnataka', 'Telangana'],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeStringArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _state_names_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `stateNames`.',
                    type: [String],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeStringArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Plant **city** (free text, case-insensitive partial match on any plant for the EOI). Use a text input in the UI, not a dropdown.',
                    example: 'Mumbai',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)()];
            _city_name_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `city` (free-text plant city filter).',
                    example: 'Mumbai',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalString(value);
                }), (0, class_validator_1.IsString)()];
            _cities_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Deprecated multi-select cities. Prefer single `city` text filter. Still supported for backward compatibility.',
                    type: [String],
                    example: ['Bengaluru', 'Mumbai'],
                    deprecated: true,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeStringArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _sectorId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter EOIs whose category `sector` id matches (`categories.sector`). Single value; use `sectorIds` / `sector_ids` for multiple.',
                    example: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)()];
            _sector_id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `sectorId`.',
                    example: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)()];
            _sectorIds_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by multiple category sector ids (comma-separated or array). Takes precedence over `sectorId` / `sector_id` when non-empty.',
                    type: [Number],
                    example: [1, 2],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true })];
            _sector_ids_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `sectorIds` (Building / sector multiselect).',
                    type: [Number],
                    example: [1, 2],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true })];
            _buildingIds_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'UI alias of `sectorIds` — **Building** sector multiselect (numeric sector ids from `GET /api/sectors`).',
                    type: [Number],
                    example: [1],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true })];
            _building_ids_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `buildingIds`.',
                    type: [Number],
                    example: [1],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true })];
            _buildings_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'UI alias of `buildingIds` / `sectorIds`.',
                    type: [Number],
                    example: [1, 2],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeNumberArray(value);
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true })];
            _buildingId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Single Building / sector id (alias of `sectorId`).',
                    example: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)()];
            _building_id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Snake_case alias of `buildingId`.',
                    example: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)()];
            _building_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Single Building / sector id (alias of `sectorId`).',
                    example: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalNumber(value);
                }), (0, class_validator_1.IsInt)()];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Global search on eoiNo, urnNo, productName, manufacturerName, email, phone',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 10 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(200)];
            _groupBy_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Response grouping: manufacturer (default, paginates manufacturers) or urn (legacy flat URN groups)',
                    enum: ['manufacturer', 'urn'],
                    default: 'manufacturer',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['manufacturer', 'urn'])];
            _sortBy_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: [
                        'createdDate',
                        'createdAt',
                        'validTill',
                        'productName',
                        'eoiNo',
                        'urnNo',
                        'manufacturerName',
                    ],
                    default: 'createdDate',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)([
                    'createdDate',
                    'createdAt',
                    'validTill',
                    'productName',
                    'eoiNo',
                    'urnNo',
                    'manufacturerName',
                ])];
            _sortOrder_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'], default: 'desc' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['asc', 'desc'])];
            _order_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Alias for sortOrder',
                    enum: ['asc', 'desc'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['asc', 'desc'])];
            _productId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Public website only: when user picks a product from search suggestions, pass its MongoDB _id.',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeOptionalMongoId(value);
                }), (0, class_validator_1.IsMongoId)()];
            __esDecorate(null, null, _urnStatusLabels_decorators, { kind: "field", name: "urnStatusLabels", static: false, private: false, access: { has: function (obj) { return "urnStatusLabels" in obj; }, get: function (obj) { return obj.urnStatusLabels; }, set: function (obj, value) { obj.urnStatusLabels = value; } }, metadata: _metadata }, _urnStatusLabels_initializers, _urnStatusLabels_extraInitializers);
            __esDecorate(null, null, _urn_status_labels_decorators, { kind: "field", name: "urn_status_labels", static: false, private: false, access: { has: function (obj) { return "urn_status_labels" in obj; }, get: function (obj) { return obj.urn_status_labels; }, set: function (obj, value) { obj.urn_status_labels = value; } }, metadata: _metadata }, _urn_status_labels_initializers, _urn_status_labels_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _productStatus_decorators, { kind: "field", name: "productStatus", static: false, private: false, access: { has: function (obj) { return "productStatus" in obj; }, get: function (obj) { return obj.productStatus; }, set: function (obj, value) { obj.productStatus = value; } }, metadata: _metadata }, _productStatus_initializers, _productStatus_extraInitializers);
            __esDecorate(null, null, _product_status_decorators, { kind: "field", name: "product_status", static: false, private: false, access: { has: function (obj) { return "product_status" in obj; }, get: function (obj) { return obj.product_status; }, set: function (obj, value) { obj.product_status = value; } }, metadata: _metadata }, _product_status_initializers, _product_status_extraInitializers);
            __esDecorate(null, null, _product_type_decorators, { kind: "field", name: "product_type", static: false, private: false, access: { has: function (obj) { return "product_type" in obj; }, get: function (obj) { return obj.product_type; }, set: function (obj, value) { obj.product_type = value; } }, metadata: _metadata }, _product_type_initializers, _product_type_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
            __esDecorate(null, null, _categoryIds_decorators, { kind: "field", name: "categoryIds", static: false, private: false, access: { has: function (obj) { return "categoryIds" in obj; }, get: function (obj) { return obj.categoryIds; }, set: function (obj, value) { obj.categoryIds = value; } }, metadata: _metadata }, _categoryIds_initializers, _categoryIds_extraInitializers);
            __esDecorate(null, null, _category_ids_decorators, { kind: "field", name: "category_ids", static: false, private: false, access: { has: function (obj) { return "category_ids" in obj; }, get: function (obj) { return obj.category_ids; }, set: function (obj, value) { obj.category_ids = value; } }, metadata: _metadata }, _category_ids_initializers, _category_ids_extraInitializers);
            __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
            __esDecorate(null, null, _manufacturer_id_decorators, { kind: "field", name: "manufacturer_id", static: false, private: false, access: { has: function (obj) { return "manufacturer_id" in obj; }, get: function (obj) { return obj.manufacturer_id; }, set: function (obj, value) { obj.manufacturer_id = value; } }, metadata: _metadata }, _manufacturer_id_initializers, _manufacturer_id_extraInitializers);
            __esDecorate(null, null, _manufacturerIds_decorators, { kind: "field", name: "manufacturerIds", static: false, private: false, access: { has: function (obj) { return "manufacturerIds" in obj; }, get: function (obj) { return obj.manufacturerIds; }, set: function (obj, value) { obj.manufacturerIds = value; } }, metadata: _metadata }, _manufacturerIds_initializers, _manufacturerIds_extraInitializers);
            __esDecorate(null, null, _manufacturer_ids_decorators, { kind: "field", name: "manufacturer_ids", static: false, private: false, access: { has: function (obj) { return "manufacturer_ids" in obj; }, get: function (obj) { return obj.manufacturer_ids; }, set: function (obj, value) { obj.manufacturer_ids = value; } }, metadata: _metadata }, _manufacturer_ids_initializers, _manufacturer_ids_extraInitializers);
            __esDecorate(null, null, _manufacturerNames_decorators, { kind: "field", name: "manufacturerNames", static: false, private: false, access: { has: function (obj) { return "manufacturerNames" in obj; }, get: function (obj) { return obj.manufacturerNames; }, set: function (obj, value) { obj.manufacturerNames = value; } }, metadata: _metadata }, _manufacturerNames_initializers, _manufacturerNames_extraInitializers);
            __esDecorate(null, null, _manufacturer_names_decorators, { kind: "field", name: "manufacturer_names", static: false, private: false, access: { has: function (obj) { return "manufacturer_names" in obj; }, get: function (obj) { return obj.manufacturer_names; }, set: function (obj, value) { obj.manufacturer_names = value; } }, metadata: _metadata }, _manufacturer_names_initializers, _manufacturer_names_extraInitializers);
            __esDecorate(null, null, _from_decorators, { kind: "field", name: "from", static: false, private: false, access: { has: function (obj) { return "from" in obj; }, get: function (obj) { return obj.from; }, set: function (obj, value) { obj.from = value; } }, metadata: _metadata }, _from_initializers, _from_extraInitializers);
            __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: function (obj) { return "to" in obj; }, get: function (obj) { return obj.to; }, set: function (obj, value) { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
            __esDecorate(null, null, _fromDate_decorators, { kind: "field", name: "fromDate", static: false, private: false, access: { has: function (obj) { return "fromDate" in obj; }, get: function (obj) { return obj.fromDate; }, set: function (obj, value) { obj.fromDate = value; } }, metadata: _metadata }, _fromDate_initializers, _fromDate_extraInitializers);
            __esDecorate(null, null, _toDate_decorators, { kind: "field", name: "toDate", static: false, private: false, access: { has: function (obj) { return "toDate" in obj; }, get: function (obj) { return obj.toDate; }, set: function (obj, value) { obj.toDate = value; } }, metadata: _metadata }, _toDate_initializers, _toDate_extraInitializers);
            __esDecorate(null, null, _validTillYear_decorators, { kind: "field", name: "validTillYear", static: false, private: false, access: { has: function (obj) { return "validTillYear" in obj; }, get: function (obj) { return obj.validTillYear; }, set: function (obj, value) { obj.validTillYear = value; } }, metadata: _metadata }, _validTillYear_initializers, _validTillYear_extraInitializers);
            __esDecorate(null, null, _valid_till_year_decorators, { kind: "field", name: "valid_till_year", static: false, private: false, access: { has: function (obj) { return "valid_till_year" in obj; }, get: function (obj) { return obj.valid_till_year; }, set: function (obj, value) { obj.valid_till_year = value; } }, metadata: _metadata }, _valid_till_year_initializers, _valid_till_year_extraInitializers);
            __esDecorate(null, null, _validTillMonth_decorators, { kind: "field", name: "validTillMonth", static: false, private: false, access: { has: function (obj) { return "validTillMonth" in obj; }, get: function (obj) { return obj.validTillMonth; }, set: function (obj, value) { obj.validTillMonth = value; } }, metadata: _metadata }, _validTillMonth_initializers, _validTillMonth_extraInitializers);
            __esDecorate(null, null, _valid_till_month_decorators, { kind: "field", name: "valid_till_month", static: false, private: false, access: { has: function (obj) { return "valid_till_month" in obj; }, get: function (obj) { return obj.valid_till_month; }, set: function (obj, value) { obj.valid_till_month = value; } }, metadata: _metadata }, _valid_till_month_initializers, _valid_till_month_extraInitializers);
            __esDecorate(null, null, _validTillYears_decorators, { kind: "field", name: "validTillYears", static: false, private: false, access: { has: function (obj) { return "validTillYears" in obj; }, get: function (obj) { return obj.validTillYears; }, set: function (obj, value) { obj.validTillYears = value; } }, metadata: _metadata }, _validTillYears_initializers, _validTillYears_extraInitializers);
            __esDecorate(null, null, _valid_till_years_decorators, { kind: "field", name: "valid_till_years", static: false, private: false, access: { has: function (obj) { return "valid_till_years" in obj; }, get: function (obj) { return obj.valid_till_years; }, set: function (obj, value) { obj.valid_till_years = value; } }, metadata: _metadata }, _valid_till_years_initializers, _valid_till_years_extraInitializers);
            __esDecorate(null, null, _validTillMonthYear_decorators, { kind: "field", name: "validTillMonthYear", static: false, private: false, access: { has: function (obj) { return "validTillMonthYear" in obj; }, get: function (obj) { return obj.validTillMonthYear; }, set: function (obj, value) { obj.validTillMonthYear = value; } }, metadata: _metadata }, _validTillMonthYear_initializers, _validTillMonthYear_extraInitializers);
            __esDecorate(null, null, _valid_till_month_year_decorators, { kind: "field", name: "valid_till_month_year", static: false, private: false, access: { has: function (obj) { return "valid_till_month_year" in obj; }, get: function (obj) { return obj.valid_till_month_year; }, set: function (obj, value) { obj.valid_till_month_year = value; } }, metadata: _metadata }, _valid_till_month_year_initializers, _valid_till_month_year_extraInitializers);
            __esDecorate(null, null, _validTillDate_decorators, { kind: "field", name: "validTillDate", static: false, private: false, access: { has: function (obj) { return "validTillDate" in obj; }, get: function (obj) { return obj.validTillDate; }, set: function (obj, value) { obj.validTillDate = value; } }, metadata: _metadata }, _validTillDate_initializers, _validTillDate_extraInitializers);
            __esDecorate(null, null, _validTill_decorators, { kind: "field", name: "validTill", static: false, private: false, access: { has: function (obj) { return "validTill" in obj; }, get: function (obj) { return obj.validTill; }, set: function (obj, value) { obj.validTill = value; } }, metadata: _metadata }, _validTill_initializers, _validTill_extraInitializers);
            __esDecorate(null, null, _valid_till_decorators, { kind: "field", name: "valid_till", static: false, private: false, access: { has: function (obj) { return "valid_till" in obj; }, get: function (obj) { return obj.valid_till; }, set: function (obj, value) { obj.valid_till = value; } }, metadata: _metadata }, _valid_till_initializers, _valid_till_extraInitializers);
            __esDecorate(null, null, _valid_till_date_decorators, { kind: "field", name: "valid_till_date", static: false, private: false, access: { has: function (obj) { return "valid_till_date" in obj; }, get: function (obj) { return obj.valid_till_date; }, set: function (obj, value) { obj.valid_till_date = value; } }, metadata: _metadata }, _valid_till_date_initializers, _valid_till_date_extraInitializers);
            __esDecorate(null, null, _validtillDate_decorators, { kind: "field", name: "validtillDate", static: false, private: false, access: { has: function (obj) { return "validtillDate" in obj; }, get: function (obj) { return obj.validtillDate; }, set: function (obj, value) { obj.validtillDate = value; } }, metadata: _metadata }, _validtillDate_initializers, _validtillDate_extraInitializers);
            __esDecorate(null, null, _validtill_date_decorators, { kind: "field", name: "validtill_date", static: false, private: false, access: { has: function (obj) { return "validtill_date" in obj; }, get: function (obj) { return obj.validtill_date; }, set: function (obj, value) { obj.validtill_date = value; } }, metadata: _metadata }, _validtill_date_initializers, _validtill_date_extraInitializers);
            __esDecorate(null, null, _validTillFrom_decorators, { kind: "field", name: "validTillFrom", static: false, private: false, access: { has: function (obj) { return "validTillFrom" in obj; }, get: function (obj) { return obj.validTillFrom; }, set: function (obj, value) { obj.validTillFrom = value; } }, metadata: _metadata }, _validTillFrom_initializers, _validTillFrom_extraInitializers);
            __esDecorate(null, null, _validTillTo_decorators, { kind: "field", name: "validTillTo", static: false, private: false, access: { has: function (obj) { return "validTillTo" in obj; }, get: function (obj) { return obj.validTillTo; }, set: function (obj, value) { obj.validTillTo = value; } }, metadata: _metadata }, _validTillTo_initializers, _validTillTo_extraInitializers);
            __esDecorate(null, null, _valid_till_from_decorators, { kind: "field", name: "valid_till_from", static: false, private: false, access: { has: function (obj) { return "valid_till_from" in obj; }, get: function (obj) { return obj.valid_till_from; }, set: function (obj, value) { obj.valid_till_from = value; } }, metadata: _metadata }, _valid_till_from_initializers, _valid_till_from_extraInitializers);
            __esDecorate(null, null, _valid_till_to_decorators, { kind: "field", name: "valid_till_to", static: false, private: false, access: { has: function (obj) { return "valid_till_to" in obj; }, get: function (obj) { return obj.valid_till_to; }, set: function (obj, value) { obj.valid_till_to = value; } }, metadata: _metadata }, _valid_till_to_initializers, _valid_till_to_extraInitializers);
            __esDecorate(null, null, _countryId_decorators, { kind: "field", name: "countryId", static: false, private: false, access: { has: function (obj) { return "countryId" in obj; }, get: function (obj) { return obj.countryId; }, set: function (obj, value) { obj.countryId = value; } }, metadata: _metadata }, _countryId_initializers, _countryId_extraInitializers);
            __esDecorate(null, null, _country_id_decorators, { kind: "field", name: "country_id", static: false, private: false, access: { has: function (obj) { return "country_id" in obj; }, get: function (obj) { return obj.country_id; }, set: function (obj, value) { obj.country_id = value; } }, metadata: _metadata }, _country_id_initializers, _country_id_extraInitializers);
            __esDecorate(null, null, _stateId_decorators, { kind: "field", name: "stateId", static: false, private: false, access: { has: function (obj) { return "stateId" in obj; }, get: function (obj) { return obj.stateId; }, set: function (obj, value) { obj.stateId = value; } }, metadata: _metadata }, _stateId_initializers, _stateId_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _state_name_decorators, { kind: "field", name: "state_name", static: false, private: false, access: { has: function (obj) { return "state_name" in obj; }, get: function (obj) { return obj.state_name; }, set: function (obj, value) { obj.state_name = value; } }, metadata: _metadata }, _state_name_initializers, _state_name_extraInitializers);
            __esDecorate(null, null, _stateIds_decorators, { kind: "field", name: "stateIds", static: false, private: false, access: { has: function (obj) { return "stateIds" in obj; }, get: function (obj) { return obj.stateIds; }, set: function (obj, value) { obj.stateIds = value; } }, metadata: _metadata }, _stateIds_initializers, _stateIds_extraInitializers);
            __esDecorate(null, null, _state_ids_decorators, { kind: "field", name: "state_ids", static: false, private: false, access: { has: function (obj) { return "state_ids" in obj; }, get: function (obj) { return obj.state_ids; }, set: function (obj, value) { obj.state_ids = value; } }, metadata: _metadata }, _state_ids_initializers, _state_ids_extraInitializers);
            __esDecorate(null, null, _stateNames_decorators, { kind: "field", name: "stateNames", static: false, private: false, access: { has: function (obj) { return "stateNames" in obj; }, get: function (obj) { return obj.stateNames; }, set: function (obj, value) { obj.stateNames = value; } }, metadata: _metadata }, _stateNames_initializers, _stateNames_extraInitializers);
            __esDecorate(null, null, _state_names_decorators, { kind: "field", name: "state_names", static: false, private: false, access: { has: function (obj) { return "state_names" in obj; }, get: function (obj) { return obj.state_names; }, set: function (obj, value) { obj.state_names = value; } }, metadata: _metadata }, _state_names_initializers, _state_names_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _city_name_decorators, { kind: "field", name: "city_name", static: false, private: false, access: { has: function (obj) { return "city_name" in obj; }, get: function (obj) { return obj.city_name; }, set: function (obj, value) { obj.city_name = value; } }, metadata: _metadata }, _city_name_initializers, _city_name_extraInitializers);
            __esDecorate(null, null, _cities_decorators, { kind: "field", name: "cities", static: false, private: false, access: { has: function (obj) { return "cities" in obj; }, get: function (obj) { return obj.cities; }, set: function (obj, value) { obj.cities = value; } }, metadata: _metadata }, _cities_initializers, _cities_extraInitializers);
            __esDecorate(null, null, _sectorId_decorators, { kind: "field", name: "sectorId", static: false, private: false, access: { has: function (obj) { return "sectorId" in obj; }, get: function (obj) { return obj.sectorId; }, set: function (obj, value) { obj.sectorId = value; } }, metadata: _metadata }, _sectorId_initializers, _sectorId_extraInitializers);
            __esDecorate(null, null, _sector_id_decorators, { kind: "field", name: "sector_id", static: false, private: false, access: { has: function (obj) { return "sector_id" in obj; }, get: function (obj) { return obj.sector_id; }, set: function (obj, value) { obj.sector_id = value; } }, metadata: _metadata }, _sector_id_initializers, _sector_id_extraInitializers);
            __esDecorate(null, null, _sectorIds_decorators, { kind: "field", name: "sectorIds", static: false, private: false, access: { has: function (obj) { return "sectorIds" in obj; }, get: function (obj) { return obj.sectorIds; }, set: function (obj, value) { obj.sectorIds = value; } }, metadata: _metadata }, _sectorIds_initializers, _sectorIds_extraInitializers);
            __esDecorate(null, null, _sector_ids_decorators, { kind: "field", name: "sector_ids", static: false, private: false, access: { has: function (obj) { return "sector_ids" in obj; }, get: function (obj) { return obj.sector_ids; }, set: function (obj, value) { obj.sector_ids = value; } }, metadata: _metadata }, _sector_ids_initializers, _sector_ids_extraInitializers);
            __esDecorate(null, null, _buildingIds_decorators, { kind: "field", name: "buildingIds", static: false, private: false, access: { has: function (obj) { return "buildingIds" in obj; }, get: function (obj) { return obj.buildingIds; }, set: function (obj, value) { obj.buildingIds = value; } }, metadata: _metadata }, _buildingIds_initializers, _buildingIds_extraInitializers);
            __esDecorate(null, null, _building_ids_decorators, { kind: "field", name: "building_ids", static: false, private: false, access: { has: function (obj) { return "building_ids" in obj; }, get: function (obj) { return obj.building_ids; }, set: function (obj, value) { obj.building_ids = value; } }, metadata: _metadata }, _building_ids_initializers, _building_ids_extraInitializers);
            __esDecorate(null, null, _buildings_decorators, { kind: "field", name: "buildings", static: false, private: false, access: { has: function (obj) { return "buildings" in obj; }, get: function (obj) { return obj.buildings; }, set: function (obj, value) { obj.buildings = value; } }, metadata: _metadata }, _buildings_initializers, _buildings_extraInitializers);
            __esDecorate(null, null, _buildingId_decorators, { kind: "field", name: "buildingId", static: false, private: false, access: { has: function (obj) { return "buildingId" in obj; }, get: function (obj) { return obj.buildingId; }, set: function (obj, value) { obj.buildingId = value; } }, metadata: _metadata }, _buildingId_initializers, _buildingId_extraInitializers);
            __esDecorate(null, null, _building_id_decorators, { kind: "field", name: "building_id", static: false, private: false, access: { has: function (obj) { return "building_id" in obj; }, get: function (obj) { return obj.building_id; }, set: function (obj, value) { obj.building_id = value; } }, metadata: _metadata }, _building_id_initializers, _building_id_extraInitializers);
            __esDecorate(null, null, _building_decorators, { kind: "field", name: "building", static: false, private: false, access: { has: function (obj) { return "building" in obj; }, get: function (obj) { return obj.building; }, set: function (obj, value) { obj.building = value; } }, metadata: _metadata }, _building_initializers, _building_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _groupBy_decorators, { kind: "field", name: "groupBy", static: false, private: false, access: { has: function (obj) { return "groupBy" in obj; }, get: function (obj) { return obj.groupBy; }, set: function (obj, value) { obj.groupBy = value; } }, metadata: _metadata }, _groupBy_initializers, _groupBy_extraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: function (obj) { return "sortBy" in obj; }, get: function (obj) { return obj.sortBy; }, set: function (obj, value) { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdminListProductsDto = AdminListProductsDto;
