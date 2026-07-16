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
exports.DashboardActivityQueryDto = exports.DashboardRecentProductsQueryDto = exports.DashboardMetricsQueryDto = void 0;
exports.normalizeDashboardPeriod = normalizeDashboardPeriod;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
function trimOptional(value) {
    if (value === undefined || value === null)
        return undefined;
    var v = String(value).trim();
    return v === '' ? undefined : v;
}
/** Maps UI labels and short aliases to canonical period values. */
function normalizeDashboardPeriod(value) {
    var _a;
    var raw = trimOptional(value);
    if (!raw)
        return undefined;
    var key = raw.toLowerCase().replace(/\s+/g, '_');
    var aliases = {
        week: 'this_week',
        thisweek: 'this_week',
        month: 'this_month',
        thismonth: 'this_month',
        quarter: 'this_quarter',
        year: 'this_year',
        thisyear: 'this_year',
        lastweek: 'last_week',
        lastmonth: 'last_month',
        lastyear: 'last_year',
        last_month: 'last_month',
        last_week: 'last_week',
        last_year: 'last_year',
    };
    return (_a = aliases[key]) !== null && _a !== void 0 ? _a : key;
}
var DashboardMetricsQueryDto = function () {
    var _a;
    var _period_decorators;
    var _period_initializers = [];
    var _period_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _month_decorators;
    var _month_initializers = [];
    var _month_extraInitializers = [];
    var _quarter_decorators;
    var _quarter_initializers = [];
    var _quarter_extraInitializers = [];
    var _productStatus_decorators;
    var _productStatus_initializers = [];
    var _productStatus_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _region_decorators;
    var _region_initializers = [];
    var _region_extraInitializers = [];
    var _granularity_decorators;
    var _granularity_initializers = [];
    var _granularity_extraInitializers = [];
    var _from_decorators;
    var _from_initializers = [];
    var _from_extraInitializers = [];
    var _to_decorators;
    var _to_initializers = [];
    var _to_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DashboardMetricsQueryDto() {
                this.period = __runInitializers(this, _period_initializers, void 0);
                this.year = (__runInitializers(this, _period_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.month = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _month_initializers, void 0));
                this.quarter = (__runInitializers(this, _month_extraInitializers), __runInitializers(this, _quarter_initializers, void 0));
                this.productStatus = (__runInitializers(this, _quarter_extraInitializers), __runInitializers(this, _productStatus_initializers, void 0));
                this.categoryId = (__runInitializers(this, _productStatus_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.region = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _region_initializers, void 0));
                this.granularity = (__runInitializers(this, _region_extraInitializers), __runInitializers(this, _granularity_initializers, 'monthly'));
                /** Explicit custom range start (ISO date). Overrides period when both `from` and `to` are set. */
                this.from = (__runInitializers(this, _granularity_extraInitializers), __runInitializers(this, _from_initializers, void 0));
                /** Explicit custom range end (ISO date). Overrides period when both `from` and `to` are set. */
                this.to = (__runInitializers(this, _from_extraInitializers), __runInitializers(this, _to_initializers, void 0));
                /** Manufacturer / vendor MongoDB _id — scopes products, payments, and manufacturer KPIs. */
                this.manufacturerId = (__runInitializers(this, _to_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
                /** Alias for manufacturerId (vendor portal / payment vendorId). */
                this.vendorId = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
                /**
                 * Generic status filter used by activity / pending panels.
                 * Prefer `productStatus` for product KPIs; this is a freer string for activity feeds.
                 */
                this.status = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return DashboardMetricsQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _period_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: [
                        'this_week',
                        'this_month',
                        'this_quarter',
                        'this_year',
                        'last_week',
                        'last_month',
                        'last_year',
                    ],
                    description: 'Time window. Aliases: week, month, year, last_month (also accepts "Last Month").',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return normalizeDashboardPeriod(value);
                }), (0, class_validator_1.IsIn)([
                    'this_week',
                    'this_month',
                    'this_quarter',
                    'this_year',
                    'last_week',
                    'last_month',
                    'last_year',
                ])];
            _year_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 2026,
                    description: 'Omit or send "all" for all years',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, dashboard_metrics_filters_util_1.parseDashboardYear)(value);
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(2000), (0, class_validator_1.Max)(2100)];
            _month_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    minimum: 1,
                    maximum: 12,
                    description: '1–12, or short name (Jan, Mar). Omit or "all" for all months',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, dashboard_metrics_filters_util_1.parseDashboardMonth)(value);
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(12)];
            _quarter_decorators = [(0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 4 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(4)];
            _productStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['active', 'pending', 'completed', 'overdue'],
                    description: 'pending → productStatus 0–1; completed → certified & valid; overdue → expired certificate; active → in certification (URN 1–10 or approved)',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimOptional(value);
                }), (0, class_validator_1.IsIn)(['active', 'pending', 'completed', 'overdue'])];
            _categoryId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Category MongoDB _id or slug (e.g. cement)',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimOptional(value);
                }), (0, class_validator_1.IsString)()];
            _region_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ['north', 'south', 'east', 'west'] }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var _c;
                    var value = _b.value;
                    return (_c = trimOptional(value)) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                }), (0, class_validator_1.IsIn)(['north', 'south', 'east', 'west'])];
            _granularity_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['monthly', 'weekly', 'quarterly'],
                    default: 'monthly',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var _c;
                    var value = _b.value;
                    return (_c = trimOptional(value)) !== null && _c !== void 0 ? _c : 'monthly';
                }), (0, class_validator_1.IsIn)(['monthly', 'weekly', 'quarterly'])];
            _from_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2026-01-01', description: 'ISO date or datetime' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimOptional(value);
                }), (0, class_validator_1.IsString)()];
            _to_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2026-03-31' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimOptional(value);
                }), (0, class_validator_1.IsString)()];
            _manufacturerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Manufacturer MongoDB ObjectId' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimOptional(value);
                }), (0, class_validator_1.IsString)()];
            _vendorId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Alias of manufacturerId' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return trimOptional(value);
                }), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Generic status token (pending, verified, paid, etc.)',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var _c;
                    var value = _b.value;
                    return (_c = trimOptional(value)) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _period_decorators, { kind: "field", name: "period", static: false, private: false, access: { has: function (obj) { return "period" in obj; }, get: function (obj) { return obj.period; }, set: function (obj, value) { obj.period = value; } }, metadata: _metadata }, _period_initializers, _period_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _month_decorators, { kind: "field", name: "month", static: false, private: false, access: { has: function (obj) { return "month" in obj; }, get: function (obj) { return obj.month; }, set: function (obj, value) { obj.month = value; } }, metadata: _metadata }, _month_initializers, _month_extraInitializers);
            __esDecorate(null, null, _quarter_decorators, { kind: "field", name: "quarter", static: false, private: false, access: { has: function (obj) { return "quarter" in obj; }, get: function (obj) { return obj.quarter; }, set: function (obj, value) { obj.quarter = value; } }, metadata: _metadata }, _quarter_initializers, _quarter_extraInitializers);
            __esDecorate(null, null, _productStatus_decorators, { kind: "field", name: "productStatus", static: false, private: false, access: { has: function (obj) { return "productStatus" in obj; }, get: function (obj) { return obj.productStatus; }, set: function (obj, value) { obj.productStatus = value; } }, metadata: _metadata }, _productStatus_initializers, _productStatus_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _region_decorators, { kind: "field", name: "region", static: false, private: false, access: { has: function (obj) { return "region" in obj; }, get: function (obj) { return obj.region; }, set: function (obj, value) { obj.region = value; } }, metadata: _metadata }, _region_initializers, _region_extraInitializers);
            __esDecorate(null, null, _granularity_decorators, { kind: "field", name: "granularity", static: false, private: false, access: { has: function (obj) { return "granularity" in obj; }, get: function (obj) { return obj.granularity; }, set: function (obj, value) { obj.granularity = value; } }, metadata: _metadata }, _granularity_initializers, _granularity_extraInitializers);
            __esDecorate(null, null, _from_decorators, { kind: "field", name: "from", static: false, private: false, access: { has: function (obj) { return "from" in obj; }, get: function (obj) { return obj.from; }, set: function (obj, value) { obj.from = value; } }, metadata: _metadata }, _from_initializers, _from_extraInitializers);
            __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: function (obj) { return "to" in obj; }, get: function (obj) { return obj.to; }, set: function (obj, value) { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
            __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DashboardMetricsQueryDto = DashboardMetricsQueryDto;
var DashboardRecentProductsQueryDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DashboardRecentProductsQueryDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                __runInitializers(this, _limit_extraInitializers);
            }
            return DashboardRecentProductsQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 10 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(50)];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DashboardRecentProductsQueryDto = DashboardRecentProductsQueryDto;
var DashboardActivityQueryDto = function () {
    var _a;
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DashboardActivityQueryDto() {
                this.limit = __runInitializers(this, _limit_initializers, 20);
                __runInitializers(this, _limit_extraInitializers);
            }
            return DashboardActivityQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 20 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DashboardActivityQueryDto = DashboardActivityQueryDto;
