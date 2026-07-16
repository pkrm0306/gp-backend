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
exports.UpdateUrnStatusDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var UpdateUrnStatusDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _updateStatusType_decorators;
    var _updateStatusType_initializers = [];
    var _updateStatusType_extraInitializers = [];
    var _updateStatusTo_decorators;
    var _updateStatusTo_initializers = [];
    var _updateStatusTo_extraInitializers = [];
    var _productStatus_decorators;
    var _productStatus_initializers = [];
    var _productStatus_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateUrnStatusDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.updateStatusType = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _updateStatusType_initializers, void 0));
                this.updateStatusTo = (__runInitializers(this, _updateStatusType_extraInitializers), __runInitializers(this, _updateStatusTo_initializers, void 0));
                this.productStatus = (__runInitializers(this, _updateStatusTo_extraInitializers), __runInitializers(this, _productStatus_initializers, void 0));
                __runInitializers(this, _productStatus_extraInitializers);
            }
            return UpdateUrnStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _updateStatusType_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Update status type (for future use)',
                    example: 'urn_status',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _updateStatusTo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'New URN status to update to (0-11)',
                    example: 2,
                    required: true,
                    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])];
            _productStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Optional product status to update along with urnStatus (0=Pending, 1=Submitted, 2=Certified, 3=Rejected, 4=Expired)',
                    example: 1,
                    required: false,
                    enum: [0, 1, 2, 3, 4],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1, 2, 3, 4])];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _updateStatusType_decorators, { kind: "field", name: "updateStatusType", static: false, private: false, access: { has: function (obj) { return "updateStatusType" in obj; }, get: function (obj) { return obj.updateStatusType; }, set: function (obj, value) { obj.updateStatusType = value; } }, metadata: _metadata }, _updateStatusType_initializers, _updateStatusType_extraInitializers);
            __esDecorate(null, null, _updateStatusTo_decorators, { kind: "field", name: "updateStatusTo", static: false, private: false, access: { has: function (obj) { return "updateStatusTo" in obj; }, get: function (obj) { return obj.updateStatusTo; }, set: function (obj, value) { obj.updateStatusTo = value; } }, metadata: _metadata }, _updateStatusTo_initializers, _updateStatusTo_extraInitializers);
            __esDecorate(null, null, _productStatus_decorators, { kind: "field", name: "productStatus", static: false, private: false, access: { has: function (obj) { return "productStatus" in obj; }, get: function (obj) { return obj.productStatus; }, set: function (obj, value) { obj.productStatus = value; } }, metadata: _metadata }, _productStatus_initializers, _productStatus_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUrnStatusDto = UpdateUrnStatusDto;
