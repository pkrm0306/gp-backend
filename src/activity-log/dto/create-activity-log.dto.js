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
exports.CreateActivityLogDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
/** Body for POST /activity-log — same fields as internal `ActivityLogService.logActivity`. */
var CreateActivityLogDto = function () {
    var _a;
    var _vendor_id_decorators;
    var _vendor_id_initializers = [];
    var _vendor_id_extraInitializers = [];
    var _manufacturer_id_decorators;
    var _manufacturer_id_initializers = [];
    var _manufacturer_id_extraInitializers = [];
    var _urn_no_decorators;
    var _urn_no_initializers = [];
    var _urn_no_extraInitializers = [];
    var _activities_id_decorators;
    var _activities_id_initializers = [];
    var _activities_id_extraInitializers = [];
    var _activity_decorators;
    var _activity_initializers = [];
    var _activity_extraInitializers = [];
    var _activity_status_decorators;
    var _activity_status_initializers = [];
    var _activity_status_extraInitializers = [];
    var _sub_activities_id_decorators;
    var _sub_activities_id_initializers = [];
    var _sub_activities_id_extraInitializers = [];
    var _responsibility_decorators;
    var _responsibility_initializers = [];
    var _responsibility_extraInitializers = [];
    var _next_responsibility_decorators;
    var _next_responsibility_initializers = [];
    var _next_responsibility_extraInitializers = [];
    var _next_acitivities_id_decorators;
    var _next_acitivities_id_initializers = [];
    var _next_acitivities_id_extraInitializers = [];
    var _next_activity_decorators;
    var _next_activity_initializers = [];
    var _next_activity_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateActivityLogDto() {
                this.vendor_id = __runInitializers(this, _vendor_id_initializers, void 0);
                this.manufacturer_id = (__runInitializers(this, _vendor_id_extraInitializers), __runInitializers(this, _manufacturer_id_initializers, void 0));
                this.urn_no = (__runInitializers(this, _manufacturer_id_extraInitializers), __runInitializers(this, _urn_no_initializers, void 0));
                this.activities_id = (__runInitializers(this, _urn_no_extraInitializers), __runInitializers(this, _activities_id_initializers, void 0));
                this.activity = (__runInitializers(this, _activities_id_extraInitializers), __runInitializers(this, _activity_initializers, void 0));
                this.activity_status = (__runInitializers(this, _activity_extraInitializers), __runInitializers(this, _activity_status_initializers, void 0));
                this.sub_activities_id = (__runInitializers(this, _activity_status_extraInitializers), __runInitializers(this, _sub_activities_id_initializers, void 0));
                this.responsibility = (__runInitializers(this, _sub_activities_id_extraInitializers), __runInitializers(this, _responsibility_initializers, void 0));
                this.next_responsibility = (__runInitializers(this, _responsibility_extraInitializers), __runInitializers(this, _next_responsibility_initializers, void 0));
                /** Matches DB field name (typo preserved). */
                this.next_acitivities_id = (__runInitializers(this, _next_responsibility_extraInitializers), __runInitializers(this, _next_acitivities_id_initializers, void 0));
                this.next_activity = (__runInitializers(this, _next_acitivities_id_extraInitializers), __runInitializers(this, _next_activity_initializers, void 0));
                this.status = (__runInitializers(this, _next_activity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return CreateActivityLogDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vendor_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor MongoDB ObjectId' }), (0, class_validator_1.IsMongoId)()];
            _manufacturer_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manufacturer MongoDB ObjectId' }), (0, class_validator_1.IsMongoId)()];
            _urn_no_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20240302120000' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _activities_id_decorators = [(0, swagger_1.ApiProperty)({ example: 1 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _activity_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Approve/Reject Registration Fee Proposal and make payment',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _activity_status_decorators = [(0, swagger_1.ApiProperty)({ example: 1 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)()];
            _sub_activities_id_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _responsibility_decorators = [(0, swagger_1.ApiProperty)({ example: 'Manufacturer' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _next_responsibility_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Admin' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _next_acitivities_id_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _next_activity_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _vendor_id_decorators, { kind: "field", name: "vendor_id", static: false, private: false, access: { has: function (obj) { return "vendor_id" in obj; }, get: function (obj) { return obj.vendor_id; }, set: function (obj, value) { obj.vendor_id = value; } }, metadata: _metadata }, _vendor_id_initializers, _vendor_id_extraInitializers);
            __esDecorate(null, null, _manufacturer_id_decorators, { kind: "field", name: "manufacturer_id", static: false, private: false, access: { has: function (obj) { return "manufacturer_id" in obj; }, get: function (obj) { return obj.manufacturer_id; }, set: function (obj, value) { obj.manufacturer_id = value; } }, metadata: _metadata }, _manufacturer_id_initializers, _manufacturer_id_extraInitializers);
            __esDecorate(null, null, _urn_no_decorators, { kind: "field", name: "urn_no", static: false, private: false, access: { has: function (obj) { return "urn_no" in obj; }, get: function (obj) { return obj.urn_no; }, set: function (obj, value) { obj.urn_no = value; } }, metadata: _metadata }, _urn_no_initializers, _urn_no_extraInitializers);
            __esDecorate(null, null, _activities_id_decorators, { kind: "field", name: "activities_id", static: false, private: false, access: { has: function (obj) { return "activities_id" in obj; }, get: function (obj) { return obj.activities_id; }, set: function (obj, value) { obj.activities_id = value; } }, metadata: _metadata }, _activities_id_initializers, _activities_id_extraInitializers);
            __esDecorate(null, null, _activity_decorators, { kind: "field", name: "activity", static: false, private: false, access: { has: function (obj) { return "activity" in obj; }, get: function (obj) { return obj.activity; }, set: function (obj, value) { obj.activity = value; } }, metadata: _metadata }, _activity_initializers, _activity_extraInitializers);
            __esDecorate(null, null, _activity_status_decorators, { kind: "field", name: "activity_status", static: false, private: false, access: { has: function (obj) { return "activity_status" in obj; }, get: function (obj) { return obj.activity_status; }, set: function (obj, value) { obj.activity_status = value; } }, metadata: _metadata }, _activity_status_initializers, _activity_status_extraInitializers);
            __esDecorate(null, null, _sub_activities_id_decorators, { kind: "field", name: "sub_activities_id", static: false, private: false, access: { has: function (obj) { return "sub_activities_id" in obj; }, get: function (obj) { return obj.sub_activities_id; }, set: function (obj, value) { obj.sub_activities_id = value; } }, metadata: _metadata }, _sub_activities_id_initializers, _sub_activities_id_extraInitializers);
            __esDecorate(null, null, _responsibility_decorators, { kind: "field", name: "responsibility", static: false, private: false, access: { has: function (obj) { return "responsibility" in obj; }, get: function (obj) { return obj.responsibility; }, set: function (obj, value) { obj.responsibility = value; } }, metadata: _metadata }, _responsibility_initializers, _responsibility_extraInitializers);
            __esDecorate(null, null, _next_responsibility_decorators, { kind: "field", name: "next_responsibility", static: false, private: false, access: { has: function (obj) { return "next_responsibility" in obj; }, get: function (obj) { return obj.next_responsibility; }, set: function (obj, value) { obj.next_responsibility = value; } }, metadata: _metadata }, _next_responsibility_initializers, _next_responsibility_extraInitializers);
            __esDecorate(null, null, _next_acitivities_id_decorators, { kind: "field", name: "next_acitivities_id", static: false, private: false, access: { has: function (obj) { return "next_acitivities_id" in obj; }, get: function (obj) { return obj.next_acitivities_id; }, set: function (obj, value) { obj.next_acitivities_id = value; } }, metadata: _metadata }, _next_acitivities_id_initializers, _next_acitivities_id_extraInitializers);
            __esDecorate(null, null, _next_activity_decorators, { kind: "field", name: "next_activity", static: false, private: false, access: { has: function (obj) { return "next_activity" in obj; }, get: function (obj) { return obj.next_activity; }, set: function (obj, value) { obj.next_activity = value; } }, metadata: _metadata }, _next_activity_initializers, _next_activity_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateActivityLogDto = CreateActivityLogDto;
