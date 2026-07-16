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
exports.AdminRenewProcessCommentsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
/** Admin renew process review — one section field per POST. */
var AdminRenewProcessCommentsDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _productPerformance_decorators;
    var _productPerformance_initializers = [];
    var _productPerformance_extraInitializers = [];
    var _manfacturingProcess_decorators;
    var _manfacturingProcess_initializers = [];
    var _manfacturingProcess_extraInitializers = [];
    var _wasteManagement_decorators;
    var _wasteManagement_initializers = [];
    var _wasteManagement_extraInitializers = [];
    var _productInnovation_decorators;
    var _productInnovation_initializers = [];
    var _productInnovation_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AdminRenewProcessCommentsDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.renewalCycleId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
                this.productPerformance = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _productPerformance_initializers, void 0));
                this.manfacturingProcess = (__runInitializers(this, _productPerformance_extraInitializers), __runInitializers(this, _manfacturingProcess_initializers, void 0));
                this.wasteManagement = (__runInitializers(this, _manfacturingProcess_extraInitializers), __runInitializers(this, _wasteManagement_initializers, void 0));
                this.productInnovation = (__runInitializers(this, _wasteManagement_extraInitializers), __runInitializers(this, _productInnovation_initializers, void 0));
                __runInitializers(this, _productInnovation_extraInitializers);
            }
            return AdminRenewProcessCommentsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260528142848' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _renewalCycleId_decorators = [(0, swagger_1.ApiProperty)({ example: '6a1edd713ec5008b997aca94' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _productPerformance_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _manfacturingProcess_decorators = [(0, swagger_1.ApiProperty)({ required: false, description: 'Legacy typo — must accept' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wasteManagement_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productInnovation_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
            __esDecorate(null, null, _productPerformance_decorators, { kind: "field", name: "productPerformance", static: false, private: false, access: { has: function (obj) { return "productPerformance" in obj; }, get: function (obj) { return obj.productPerformance; }, set: function (obj, value) { obj.productPerformance = value; } }, metadata: _metadata }, _productPerformance_initializers, _productPerformance_extraInitializers);
            __esDecorate(null, null, _manfacturingProcess_decorators, { kind: "field", name: "manfacturingProcess", static: false, private: false, access: { has: function (obj) { return "manfacturingProcess" in obj; }, get: function (obj) { return obj.manfacturingProcess; }, set: function (obj, value) { obj.manfacturingProcess = value; } }, metadata: _metadata }, _manfacturingProcess_initializers, _manfacturingProcess_extraInitializers);
            __esDecorate(null, null, _wasteManagement_decorators, { kind: "field", name: "wasteManagement", static: false, private: false, access: { has: function (obj) { return "wasteManagement" in obj; }, get: function (obj) { return obj.wasteManagement; }, set: function (obj, value) { obj.wasteManagement = value; } }, metadata: _metadata }, _wasteManagement_initializers, _wasteManagement_extraInitializers);
            __esDecorate(null, null, _productInnovation_decorators, { kind: "field", name: "productInnovation", static: false, private: false, access: { has: function (obj) { return "productInnovation" in obj; }, get: function (obj) { return obj.productInnovation; }, set: function (obj, value) { obj.productInnovation = value; } }, metadata: _metadata }, _productInnovation_initializers, _productInnovation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AdminRenewProcessCommentsDto = AdminRenewProcessCommentsDto;
