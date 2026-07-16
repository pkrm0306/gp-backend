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
exports.WebsiteAnalyticsCollectDto = exports.WebsiteAnalyticsEventDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var WebsiteAnalyticsEventDto = function () {
    var _a;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _path_decorators;
    var _path_initializers = [];
    var _path_extraInitializers = [];
    var _signUpType_decorators;
    var _signUpType_initializers = [];
    var _signUpType_extraInitializers = [];
    var _timestamp_decorators;
    var _timestamp_initializers = [];
    var _timestamp_extraInitializers = [];
    return _a = /** @class */ (function () {
            function WebsiteAnalyticsEventDto() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.path = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _path_initializers, void 0));
                this.signUpType = (__runInitializers(this, _path_extraInitializers), __runInitializers(this, _signUpType_initializers, void 0));
                this.timestamp = (__runInitializers(this, _signUpType_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
                __runInitializers(this, _timestamp_extraInitializers);
            }
            return WebsiteAnalyticsEventDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ['page_view', 'sign_up'] }), (0, class_validator_1.IsIn)(['page_view', 'sign_up'])];
            _path_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '/products' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _signUpType_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'newsletter',
                    description: 'Required when type is sign_up (newsletter, contact, lead, etc.)',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(80)];
            _timestamp_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Client event time (ISO). Defaults to server receive time.' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsISO8601)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _path_decorators, { kind: "field", name: "path", static: false, private: false, access: { has: function (obj) { return "path" in obj; }, get: function (obj) { return obj.path; }, set: function (obj, value) { obj.path = value; } }, metadata: _metadata }, _path_initializers, _path_extraInitializers);
            __esDecorate(null, null, _signUpType_decorators, { kind: "field", name: "signUpType", static: false, private: false, access: { has: function (obj) { return "signUpType" in obj; }, get: function (obj) { return obj.signUpType; }, set: function (obj, value) { obj.signUpType = value; } }, metadata: _metadata }, _signUpType_initializers, _signUpType_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: function (obj) { return "timestamp" in obj; }, get: function (obj) { return obj.timestamp; }, set: function (obj, value) { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.WebsiteAnalyticsEventDto = WebsiteAnalyticsEventDto;
var WebsiteAnalyticsCollectDto = function () {
    var _a;
    var _visitorId_decorators;
    var _visitorId_initializers = [];
    var _visitorId_extraInitializers = [];
    var _measurementId_decorators;
    var _measurementId_initializers = [];
    var _measurementId_extraInitializers = [];
    var _events_decorators;
    var _events_initializers = [];
    var _events_extraInitializers = [];
    return _a = /** @class */ (function () {
            function WebsiteAnalyticsCollectDto() {
                this.visitorId = __runInitializers(this, _visitorId_initializers, void 0);
                this.measurementId = (__runInitializers(this, _visitorId_extraInitializers), __runInitializers(this, _measurementId_initializers, void 0));
                this.events = (__runInitializers(this, _measurementId_extraInitializers), __runInitializers(this, _events_initializers, void 0));
                __runInitializers(this, _events_extraInitializers);
            }
            return WebsiteAnalyticsCollectDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _visitorId_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'v_8f3c2a1b9d4e',
                    description: 'Stable anonymous id from localStorage on the public website',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(8), (0, class_validator_1.MaxLength)(128)];
            _measurementId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'G-KZB4S4WLCP',
                    description: 'Optional GA4 measurement id when the client script is enabled',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(32)];
            _events_decorators = [(0, swagger_1.ApiProperty)({ type: [WebsiteAnalyticsEventDto] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMaxSize)(50), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return WebsiteAnalyticsEventDto; })];
            __esDecorate(null, null, _visitorId_decorators, { kind: "field", name: "visitorId", static: false, private: false, access: { has: function (obj) { return "visitorId" in obj; }, get: function (obj) { return obj.visitorId; }, set: function (obj, value) { obj.visitorId = value; } }, metadata: _metadata }, _visitorId_initializers, _visitorId_extraInitializers);
            __esDecorate(null, null, _measurementId_decorators, { kind: "field", name: "measurementId", static: false, private: false, access: { has: function (obj) { return "measurementId" in obj; }, get: function (obj) { return obj.measurementId; }, set: function (obj, value) { obj.measurementId = value; } }, metadata: _metadata }, _measurementId_initializers, _measurementId_extraInitializers);
            __esDecorate(null, null, _events_decorators, { kind: "field", name: "events", static: false, private: false, access: { has: function (obj) { return "events" in obj; }, get: function (obj) { return obj.events; }, set: function (obj, value) { obj.events = value; } }, metadata: _metadata }, _events_initializers, _events_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.WebsiteAnalyticsCollectDto = WebsiteAnalyticsCollectDto;
