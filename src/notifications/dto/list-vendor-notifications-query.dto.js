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
exports.ListVendorNotificationsQueryDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var ListVendorNotificationsQueryDto = function () {
    var _a;
    var _range_decorators;
    var _range_initializers = [];
    var _range_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _seen_decorators;
    var _seen_initializers = [];
    var _seen_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListVendorNotificationsQueryDto() {
                this.range = __runInitializers(this, _range_initializers, 'all');
                this.page = (__runInitializers(this, _range_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                this.seen = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _seen_initializers, void 0));
                __runInitializers(this, _seen_extraInitializers);
            }
            return ListVendorNotificationsQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _range_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Time filter',
                    enum: ['all', 'today', 'week', '30d', '90d'],
                    default: 'all',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : 'all')
                        .trim()
                        .toLowerCase();
                }), (0, class_validator_1.IsIn)(['all', 'today', 'week', '30d', '90d'])];
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    var n = Number.parseInt(String(value), 10);
                    return Number.isFinite(n) ? n : 1;
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 20 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    var n = Number.parseInt(String(value), 10);
                    return Number.isFinite(n) ? n : 20;
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _seen_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by read state: true = read only, false = unread only',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '') {
                        return undefined;
                    }
                    if (value === true || value === 'true' || value === 1 || value === '1') {
                        return true;
                    }
                    if (value === false || value === 'false' || value === 0 || value === '0') {
                        return false;
                    }
                    return undefined;
                }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _range_decorators, { kind: "field", name: "range", static: false, private: false, access: { has: function (obj) { return "range" in obj; }, get: function (obj) { return obj.range; }, set: function (obj, value) { obj.range = value; } }, metadata: _metadata }, _range_initializers, _range_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _seen_decorators, { kind: "field", name: "seen", static: false, private: false, access: { has: function (obj) { return "seen" in obj; }, get: function (obj) { return obj.seen; }, set: function (obj, value) { obj.seen = value; } }, metadata: _metadata }, _seen_initializers, _seen_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListVendorNotificationsQueryDto = ListVendorNotificationsQueryDto;
