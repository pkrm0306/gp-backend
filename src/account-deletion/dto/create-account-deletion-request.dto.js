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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountDeletionRequestDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var account_deletion_request_schema_1 = require("../schemas/account-deletion-request.schema");
var CreateAccountDeletionRequestDto = function () {
    var _a;
    var _requestType_decorators;
    var _requestType_initializers = [];
    var _requestType_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _confirmed_decorators;
    var _confirmed_initializers = [];
    var _confirmed_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateAccountDeletionRequestDto() {
                this.requestType = __runInitializers(this, _requestType_initializers, void 0);
                this.reason = (__runInitializers(this, _requestType_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.description = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.confirmed = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _confirmed_initializers, void 0));
                __runInitializers(this, _confirmed_extraInitializers);
            }
            return CreateAccountDeletionRequestDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _requestType_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Fixed request type for account deletion workflow.',
                    example: 'Account deletion',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _reason_decorators = [(0, swagger_1.ApiProperty)({
                    enum: account_deletion_request_schema_1.ACCOUNT_DELETION_REASONS,
                    example: 'No longer using the platform',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsIn)(__spreadArray([], account_deletion_request_schema_1.ACCOUNT_DELETION_REASONS, true), {
                    message: 'reason must be a valid deletion reason',
                })];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'Optional additional context for the deletion request.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _confirmed_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Must be true. Confirms the vendor understands this is a deletion request.',
                    example: true,
                }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.Equals)(true, {
                    message: 'You must confirm before submitting an account deletion request',
                })];
            __esDecorate(null, null, _requestType_decorators, { kind: "field", name: "requestType", static: false, private: false, access: { has: function (obj) { return "requestType" in obj; }, get: function (obj) { return obj.requestType; }, set: function (obj, value) { obj.requestType = value; } }, metadata: _metadata }, _requestType_initializers, _requestType_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _confirmed_decorators, { kind: "field", name: "confirmed", static: false, private: false, access: { has: function (obj) { return "confirmed" in obj; }, get: function (obj) { return obj.confirmed; }, set: function (obj, value) { obj.confirmed = value; } }, metadata: _metadata }, _confirmed_initializers, _confirmed_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateAccountDeletionRequestDto = CreateAccountDeletionRequestDto;
