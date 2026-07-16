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
exports.ListPaymentsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
function parseOptionalPaymentStatus(raw) {
    if (raw === undefined || raw === null || raw === '')
        return undefined;
    var s = String(raw).trim().toLowerCase();
    if (s === 'all' || s === 'any')
        return undefined;
    var n = Number(raw);
    if (Number.isFinite(n) && n >= 0 && n <= 3)
        return Math.floor(n);
    return undefined;
}
var ListPaymentsDto = function () {
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
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _paymentType_decorators;
    var _paymentType_initializers = [];
    var _paymentType_extraInitializers = [];
    var _sort_decorators;
    var _sort_initializers = [];
    var _sort_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListPaymentsDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 50));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.status = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.paymentType = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _paymentType_initializers, void 0));
                this.sort = (__runInitializers(this, _paymentType_extraInitializers), __runInitializers(this, _sort_initializers, 'desc'));
                __runInitializers(this, _sort_extraInitializers);
            }
            return ListPaymentsDto;
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
                    description: 'Number of items per page (default: 50, max: 200)',
                    example: 50,
                    required: false,
                    minimum: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(200)];
            _search_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Global search term (searches in urn_no, payment_reference_no)',
                    example: 'URN-20260303142815',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Filter by payment status (0=Created, 1=Pending, 2=Completed, 3=Cancelled)',
                    example: 0,
                    required: false,
                    enum: [0, 1, 2, 3],
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return parseOptionalPaymentStatus(value);
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsIn)([0, 1, 2, 3])];
            _paymentType_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Filter by payment type',
                    example: 'registration',
                    required: false,
                    enum: ['registration', 'certification', 'renew'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsIn)(['registration', 'certification', 'renew'])];
            _sort_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Sort: `asc` | `desc` (by created date), or `field:asc` | `field:desc` (e.g. `createdAt:desc`). ' +
                        'Fields: createdAt, updatedAt, paymentId, quoteTotal, urnNo, paymentReferenceNo, paymentStatus, paymentType.',
                    example: 'createdAt:desc',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '')
                        return undefined;
                    return String(value).trim();
                }), (0, class_validator_1.Matches)(/^(asc|desc|[\w]+:(asc|desc))$/i, {
                    message: 'sort must be asc, desc, or field:asc|field:desc (e.g. createdAt:desc)',
                })];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _paymentType_decorators, { kind: "field", name: "paymentType", static: false, private: false, access: { has: function (obj) { return "paymentType" in obj; }, get: function (obj) { return obj.paymentType; }, set: function (obj, value) { obj.paymentType = value; } }, metadata: _metadata }, _paymentType_initializers, _paymentType_extraInitializers);
            __esDecorate(null, null, _sort_decorators, { kind: "field", name: "sort", static: false, private: false, access: { has: function (obj) { return "sort" in obj; }, get: function (obj) { return obj.sort; }, set: function (obj, value) { obj.sort = value; } }, metadata: _metadata }, _sort_initializers, _sort_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListPaymentsDto = ListPaymentsDto;
