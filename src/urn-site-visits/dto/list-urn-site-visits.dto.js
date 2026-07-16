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
exports.ListUrnSiteVisitsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function firstString() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
        var v = values_1[_a];
        if (v !== undefined && v !== null && String(v).trim() !== '') {
            return String(v).trim();
        }
    }
    return undefined;
}
var ListUrnSiteVisitsDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _sortBy_decorators;
    var _sortBy_initializers = [];
    var _sortBy_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var _includeDeleted_decorators;
    var _includeDeleted_initializers = [];
    var _includeDeleted_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListUrnSiteVisitsDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.page = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.sortBy = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _sortBy_initializers, 'createdAt'));
                this.order = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _order_initializers, 'desc'));
                this.includeDeleted = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _includeDeleted_initializers, false));
                __runInitializers(this, _includeDeleted_extraInitializers);
            }
            return ListUrnSiteVisitsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260514165917' }), (0, class_transformer_1.Transform)(function (_b) {
                    var obj = _b.obj, value = _b.value;
                    return firstString(value, obj === null || obj === void 0 ? void 0 : obj.urn_no);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 10 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search name, conductedBy, city' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortBy_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['createdAt', 'name', 'auditConductedOn', 'updatedAt'],
                    default: 'createdAt',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var _c;
                    var obj = _b.obj, value = _b.value;
                    return (_c = firstString(value, obj === null || obj === void 0 ? void 0 : obj.sort_by)) !== null && _c !== void 0 ? _c : 'createdAt';
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['createdAt', 'name', 'auditConductedOn', 'updatedAt'])];
            _order_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'], default: 'desc' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['asc', 'desc'])];
            _includeDeleted_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === true || value === 'true' || value === 1;
                }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: function (obj) { return "sortBy" in obj; }, get: function (obj) { return obj.sortBy; }, set: function (obj, value) { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
            __esDecorate(null, null, _includeDeleted_decorators, { kind: "field", name: "includeDeleted", static: false, private: false, access: { has: function (obj) { return "includeDeleted" in obj; }, get: function (obj) { return obj.includeDeleted; }, set: function (obj, value) { obj.includeDeleted = value; } }, metadata: _metadata }, _includeDeleted_initializers, _includeDeleted_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListUrnSiteVisitsDto = ListUrnSiteVisitsDto;
