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
exports.UpdateZohoDealDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var UpdateZohoDealDto = function () {
    var _a;
    var _dealId_decorators;
    var _dealId_initializers = [];
    var _dealId_extraInitializers = [];
    var _stage_decorators;
    var _stage_initializers = [];
    var _stage_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _closingDate_decorators;
    var _closingDate_initializers = [];
    var _closingDate_extraInitializers = [];
    var _customFields_decorators;
    var _customFields_initializers = [];
    var _customFields_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateZohoDealDto() {
                this.dealId = __runInitializers(this, _dealId_initializers, void 0);
                this.stage = (__runInitializers(this, _dealId_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
                this.amount = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.closingDate = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _closingDate_initializers, void 0));
                this.customFields = (__runInitializers(this, _closingDate_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
                __runInitializers(this, _customFields_extraInitializers);
            }
            return UpdateZohoDealDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _dealId_decorators = [(0, swagger_1.ApiProperty)({ example: '6424000000123456' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _stage_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Registration Payment Received' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _amount_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 25000 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _closingDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2026-06-30' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _customFields_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Additional Zoho Deal field API names and values.',
                    example: { Verification_Status: 'Approved' },
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _dealId_decorators, { kind: "field", name: "dealId", static: false, private: false, access: { has: function (obj) { return "dealId" in obj; }, get: function (obj) { return obj.dealId; }, set: function (obj, value) { obj.dealId = value; } }, metadata: _metadata }, _dealId_initializers, _dealId_extraInitializers);
            __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: function (obj) { return "stage" in obj; }, get: function (obj) { return obj.stage; }, set: function (obj, value) { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _closingDate_decorators, { kind: "field", name: "closingDate", static: false, private: false, access: { has: function (obj) { return "closingDate" in obj; }, get: function (obj) { return obj.closingDate; }, set: function (obj, value) { obj.closingDate = value; } }, metadata: _metadata }, _closingDate_initializers, _closingDate_extraInitializers);
            __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: function (obj) { return "customFields" in obj; }, get: function (obj) { return obj.customFields; }, set: function (obj, value) { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateZohoDealDto = UpdateZohoDealDto;
