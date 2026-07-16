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
exports.UpdateVendorStatusDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var UpdateVendorStatusDto = function () {
    var _a;
    var _manufacturerStatus_decorators;
    var _manufacturerStatus_initializers = [];
    var _manufacturerStatus_extraInitializers = [];
    var _vendor_status_decorators;
    var _vendor_status_initializers = [];
    var _vendor_status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateVendorStatusDto() {
                this.manufacturerStatus = __runInitializers(this, _manufacturerStatus_initializers, void 0);
                this.vendor_status = (__runInitializers(this, _manufacturerStatus_extraInitializers), __runInitializers(this, _vendor_status_initializers, void 0));
                __runInitializers(this, _vendor_status_extraInitializers);
            }
            return UpdateVendorStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _manufacturerStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Optional manufacturer verification flag. When set to 1, backend also forces vendor_status=1.',
                    enum: [1],
                    required: false,
                    example: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsIn)([1], { message: 'manufacturerStatus can only be 1 when provided' })];
            _vendor_status_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Vendor active status for verified manufacturer (0=inactive, 1=active)',
                    enum: [0, 1],
                    required: false,
                    example: 1,
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsIn)([0, 1], { message: 'vendor_status must be 0 or 1' })];
            __esDecorate(null, null, _manufacturerStatus_decorators, { kind: "field", name: "manufacturerStatus", static: false, private: false, access: { has: function (obj) { return "manufacturerStatus" in obj; }, get: function (obj) { return obj.manufacturerStatus; }, set: function (obj, value) { obj.manufacturerStatus = value; } }, metadata: _metadata }, _manufacturerStatus_initializers, _manufacturerStatus_extraInitializers);
            __esDecorate(null, null, _vendor_status_decorators, { kind: "field", name: "vendor_status", static: false, private: false, access: { has: function (obj) { return "vendor_status" in obj; }, get: function (obj) { return obj.vendor_status; }, set: function (obj, value) { obj.vendor_status = value; } }, metadata: _metadata }, _vendor_status_initializers, _vendor_status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateVendorStatusDto = UpdateVendorStatusDto;
