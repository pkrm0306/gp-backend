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
exports.AdminRejectedRestoreUrnDto = exports.AdminRejectedRestoreProductDto = exports.REJECTED_RESTORE_TARGET_STATUSES = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
exports.REJECTED_RESTORE_TARGET_STATUSES = [
    product_status_constants_1.PRODUCT_STATUS_PENDING,
    product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
];
var AdminRejectedRestoreProductDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _targetStatus_decorators;
    var _targetStatus_initializers = [];
    var _targetStatus_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AdminRejectedRestoreProductDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.productId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.eoiNo = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
                this.targetStatus = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _targetStatus_initializers, void 0));
                __runInitializers(this, _targetStatus_extraInitializers);
            }
            return AdminRejectedRestoreProductDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260428123027' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(64)];
            _productId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'MongoDB _id or numeric productId from admin list',
                    example: '507f1f77bcf86cd799439011',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(64)];
            _eoiNo_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'GPPMI003803' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(64)];
            _targetStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: '0 = Un-certified (Pending), 2 = Certified',
                    enum: exports.REJECTED_RESTORE_TARGET_STATUSES,
                    example: 0,
                }), (0, class_validator_1.IsIn)(__spreadArray([], exports.REJECTED_RESTORE_TARGET_STATUSES, true))];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
            __esDecorate(null, null, _targetStatus_decorators, { kind: "field", name: "targetStatus", static: false, private: false, access: { has: function (obj) { return "targetStatus" in obj; }, get: function (obj) { return obj.targetStatus; }, set: function (obj, value) { obj.targetStatus = value; } }, metadata: _metadata }, _targetStatus_initializers, _targetStatus_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdminRejectedRestoreProductDto = AdminRejectedRestoreProductDto;
var AdminRejectedRestoreUrnDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _targetStatus_decorators;
    var _targetStatus_initializers = [];
    var _targetStatus_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AdminRejectedRestoreUrnDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.targetStatus = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _targetStatus_initializers, void 0));
                __runInitializers(this, _targetStatus_extraInitializers);
            }
            return AdminRejectedRestoreUrnDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260428123027' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(64)];
            _targetStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: '0 = Un-certified (Pending), 2 = Certified',
                    enum: exports.REJECTED_RESTORE_TARGET_STATUSES,
                    example: 2,
                }), (0, class_validator_1.IsIn)(__spreadArray([], exports.REJECTED_RESTORE_TARGET_STATUSES, true))];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _targetStatus_decorators, { kind: "field", name: "targetStatus", static: false, private: false, access: { has: function (obj) { return "targetStatus" in obj; }, get: function (obj) { return obj.targetStatus; }, set: function (obj, value) { obj.targetStatus = value; } }, metadata: _metadata }, _targetStatus_initializers, _targetStatus_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdminRejectedRestoreUrnDto = AdminRejectedRestoreUrnDto;
