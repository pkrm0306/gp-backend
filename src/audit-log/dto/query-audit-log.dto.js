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
exports.QueryAuditLogDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var QueryAuditLogDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _action_decorators;
    var _action_initializers = [];
    var _action_extraInitializers = [];
    var _module_decorators;
    var _module_initializers = [];
    var _module_extraInitializers = [];
    var _action_type_decorators;
    var _action_type_initializers = [];
    var _action_type_extraInitializers = [];
    var _actor_user_id_decorators;
    var _actor_user_id_initializers = [];
    var _actor_user_id_extraInitializers = [];
    var _resource_type_decorators;
    var _resource_type_initializers = [];
    var _resource_type_extraInitializers = [];
    var _resource_id_decorators;
    var _resource_id_initializers = [];
    var _resource_id_extraInitializers = [];
    var _urn_no_decorators;
    var _urn_no_initializers = [];
    var _urn_no_extraInitializers = [];
    var _from_decorators;
    var _from_initializers = [];
    var _from_extraInitializers = [];
    var _to_decorators;
    var _to_initializers = [];
    var _to_extraInitializers = [];
    return _a = /** @class */ (function () {
            function QueryAuditLogDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                this.action = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.module = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _module_initializers, void 0));
                this.action_type = (__runInitializers(this, _module_extraInitializers), __runInitializers(this, _action_type_initializers, void 0));
                this.actor_user_id = (__runInitializers(this, _action_type_extraInitializers), __runInitializers(this, _actor_user_id_initializers, void 0));
                this.resource_type = (__runInitializers(this, _actor_user_id_extraInitializers), __runInitializers(this, _resource_type_initializers, void 0));
                this.resource_id = (__runInitializers(this, _resource_type_extraInitializers), __runInitializers(this, _resource_id_initializers, void 0));
                this.urn_no = (__runInitializers(this, _resource_id_extraInitializers), __runInitializers(this, _urn_no_initializers, void 0));
                this.from = (__runInitializers(this, _urn_no_extraInitializers), __runInitializers(this, _from_initializers, void 0));
                this.to = (__runInitializers(this, _from_extraInitializers), __runInitializers(this, _to_initializers, void 0));
                __runInitializers(this, _to_extraInitializers);
            }
            return QueryAuditLogDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 20, maximum: 100 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _action_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _module_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'User-facing module (category, sector, product, …)',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _action_type_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'User-facing action (create, update, delete, approve, reject, login)',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _actor_user_id_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Filter by user id, email, or display name (matches actor.user_id, performed_by.user_id, performed_by.email, or performed_by.name)',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _resource_type_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _resource_id_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _urn_no_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _from_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Start of date range. Defaults to one month before `to`/now when omitted.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _to_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'End of date range. Defaults to current server time.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: function (obj) { return "action" in obj; }, get: function (obj) { return obj.action; }, set: function (obj, value) { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _module_decorators, { kind: "field", name: "module", static: false, private: false, access: { has: function (obj) { return "module" in obj; }, get: function (obj) { return obj.module; }, set: function (obj, value) { obj.module = value; } }, metadata: _metadata }, _module_initializers, _module_extraInitializers);
            __esDecorate(null, null, _action_type_decorators, { kind: "field", name: "action_type", static: false, private: false, access: { has: function (obj) { return "action_type" in obj; }, get: function (obj) { return obj.action_type; }, set: function (obj, value) { obj.action_type = value; } }, metadata: _metadata }, _action_type_initializers, _action_type_extraInitializers);
            __esDecorate(null, null, _actor_user_id_decorators, { kind: "field", name: "actor_user_id", static: false, private: false, access: { has: function (obj) { return "actor_user_id" in obj; }, get: function (obj) { return obj.actor_user_id; }, set: function (obj, value) { obj.actor_user_id = value; } }, metadata: _metadata }, _actor_user_id_initializers, _actor_user_id_extraInitializers);
            __esDecorate(null, null, _resource_type_decorators, { kind: "field", name: "resource_type", static: false, private: false, access: { has: function (obj) { return "resource_type" in obj; }, get: function (obj) { return obj.resource_type; }, set: function (obj, value) { obj.resource_type = value; } }, metadata: _metadata }, _resource_type_initializers, _resource_type_extraInitializers);
            __esDecorate(null, null, _resource_id_decorators, { kind: "field", name: "resource_id", static: false, private: false, access: { has: function (obj) { return "resource_id" in obj; }, get: function (obj) { return obj.resource_id; }, set: function (obj, value) { obj.resource_id = value; } }, metadata: _metadata }, _resource_id_initializers, _resource_id_extraInitializers);
            __esDecorate(null, null, _urn_no_decorators, { kind: "field", name: "urn_no", static: false, private: false, access: { has: function (obj) { return "urn_no" in obj; }, get: function (obj) { return obj.urn_no; }, set: function (obj, value) { obj.urn_no = value; } }, metadata: _metadata }, _urn_no_initializers, _urn_no_extraInitializers);
            __esDecorate(null, null, _from_decorators, { kind: "field", name: "from", static: false, private: false, access: { has: function (obj) { return "from" in obj; }, get: function (obj) { return obj.from; }, set: function (obj, value) { obj.from = value; } }, metadata: _metadata }, _from_initializers, _from_extraInitializers);
            __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: function (obj) { return "to" in obj; }, get: function (obj) { return obj.to; }, set: function (obj, value) { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.QueryAuditLogDto = QueryAuditLogDto;
