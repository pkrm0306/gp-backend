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
exports.UpdatePartnerStatusDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var UpdatePartnerStatusDto = function () {
    var _a;
    var _partnerId_decorators;
    var _partnerId_initializers = [];
    var _partnerId_extraInitializers = [];
    var _currentStatus_decorators;
    var _currentStatus_initializers = [];
    var _currentStatus_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePartnerStatusDto() {
                this.partnerId = __runInitializers(this, _partnerId_initializers, void 0);
                this.currentStatus = (__runInitializers(this, _partnerId_extraInitializers), __runInitializers(this, _currentStatus_initializers, void 0));
                __runInitializers(this, _currentStatus_extraInitializers);
            }
            return UpdatePartnerStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _partnerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Partner ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _currentStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current status (0 or 1)', enum: [0, 1] }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            __esDecorate(null, null, _partnerId_decorators, { kind: "field", name: "partnerId", static: false, private: false, access: { has: function (obj) { return "partnerId" in obj; }, get: function (obj) { return obj.partnerId; }, set: function (obj, value) { obj.partnerId = value; } }, metadata: _metadata }, _partnerId_initializers, _partnerId_extraInitializers);
            __esDecorate(null, null, _currentStatus_decorators, { kind: "field", name: "currentStatus", static: false, private: false, access: { has: function (obj) { return "currentStatus" in obj; }, get: function (obj) { return obj.currentStatus; }, set: function (obj, value) { obj.currentStatus = value; } }, metadata: _metadata }, _currentStatus_initializers, _currentStatus_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePartnerStatusDto = UpdatePartnerStatusDto;
