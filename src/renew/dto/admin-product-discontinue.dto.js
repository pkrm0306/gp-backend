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
exports.BulkReactivateProductsBodyDto = exports.ToggleProductStatusBodyDto = exports.DiscontinueProductBodyDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var DiscontinueProductBodyDto = function () {
    var _a;
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DiscontinueProductBodyDto() {
                this.reason = __runInitializers(this, _reason_initializers, void 0);
                __runInitializers(this, _reason_extraInitializers);
            }
            return DiscontinueProductBodyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional reason recorded on the soft-deleted product' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DiscontinueProductBodyDto = DiscontinueProductBodyDto;
var ToggleProductStatusBodyDto = function () {
    var _a;
    var _currentStatus_decorators;
    var _currentStatus_initializers = [];
    var _currentStatus_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ToggleProductStatusBodyDto() {
                this.currentStatus = __runInitializers(this, _currentStatus_initializers, void 0);
                this.reason = (__runInitializers(this, _currentStatus_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return ToggleProductStatusBodyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _currentStatus_decorators = [(0, swagger_1.ApiProperty)({ enum: [2, 4], description: 'Current status must match DB before toggle' }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsIn)([2, 4])];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _currentStatus_decorators, { kind: "field", name: "currentStatus", static: false, private: false, access: { has: function (obj) { return "currentStatus" in obj; }, get: function (obj) { return obj.currentStatus; }, set: function (obj, value) { obj.currentStatus = value; } }, metadata: _metadata }, _currentStatus_initializers, _currentStatus_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ToggleProductStatusBodyDto = ToggleProductStatusBodyDto;
var BulkReactivateProductsBodyDto = function () {
    var _a;
    var _productIds_decorators;
    var _productIds_initializers = [];
    var _productIds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BulkReactivateProductsBodyDto() {
                this.productIds = __runInitializers(this, _productIds_initializers, void 0);
                __runInitializers(this, _productIds_extraInitializers);
            }
            return BulkReactivateProductsBodyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productIds_decorators = [(0, swagger_1.ApiProperty)({
                    type: [String],
                    description: 'MongoDB product _id strings',
                    example: ['507f1f77bcf86cd799439011'],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsMongoId)({ each: true })];
            __esDecorate(null, null, _productIds_decorators, { kind: "field", name: "productIds", static: false, private: false, access: { has: function (obj) { return "productIds" in obj; }, get: function (obj) { return obj.productIds; }, set: function (obj, value) { obj.productIds = value; } }, metadata: _metadata }, _productIds_initializers, _productIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BulkReactivateProductsBodyDto = BulkReactivateProductsBodyDto;
