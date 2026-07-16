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
exports.UpdateRenewUrnStatusDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var UpdateRenewUrnStatusDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _updateStatusType_decorators;
    var _updateStatusType_initializers = [];
    var _updateStatusType_extraInitializers = [];
    var _updateStatusTo_decorators;
    var _updateStatusTo_initializers = [];
    var _updateStatusTo_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateRenewUrnStatusDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.renewalCycleId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
                this.updateStatusType = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _updateStatusType_initializers, void 0));
                this.updateStatusTo = (__runInitializers(this, _updateStatusType_extraInitializers), __runInitializers(this, _updateStatusTo_initializers, void 0));
                __runInitializers(this, _updateStatusTo_extraInitializers);
            }
            return UpdateRenewUrnStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260528142848' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _renewalCycleId_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    example: '6a1edd713ec5008b997aca94',
                    description: 'Active renewal cycle (validated against URN)',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _updateStatusType_decorators = [(0, swagger_1.ApiProperty)({ example: 'urn_status', enum: ['urn_status'] }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsIn)(['urn_status'])];
            _updateStatusTo_decorators = [(0, swagger_1.ApiProperty)({
                    example: 15,
                    description: 'Renewal urnStatus only: 11, 12, 13, 14, 15, 16, 17',
                    enum: renewal_urn_status_constants_1.RENEWAL_URN_STATUS_ALLOWED_VALUES,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)(__spreadArray([], renewal_urn_status_constants_1.RENEWAL_URN_STATUS_ALLOWED_VALUES, true))];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
            __esDecorate(null, null, _updateStatusType_decorators, { kind: "field", name: "updateStatusType", static: false, private: false, access: { has: function (obj) { return "updateStatusType" in obj; }, get: function (obj) { return obj.updateStatusType; }, set: function (obj, value) { obj.updateStatusType = value; } }, metadata: _metadata }, _updateStatusType_initializers, _updateStatusType_extraInitializers);
            __esDecorate(null, null, _updateStatusTo_decorators, { kind: "field", name: "updateStatusTo", static: false, private: false, access: { has: function (obj) { return "updateStatusTo" in obj; }, get: function (obj) { return obj.updateStatusTo; }, set: function (obj, value) { obj.updateStatusTo = value; } }, metadata: _metadata }, _updateStatusTo_initializers, _updateStatusTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateRenewUrnStatusDto = UpdateRenewUrnStatusDto;
