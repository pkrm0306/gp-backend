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
exports.DeleteProcessWmManufacturingUnitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var DeleteProcessWmManufacturingUnitDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _processWmManufacturingUnitId_decorators;
    var _processWmManufacturingUnitId_initializers = [];
    var _processWmManufacturingUnitId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DeleteProcessWmManufacturingUnitDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.processWmManufacturingUnitId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _processWmManufacturingUnitId_initializers, void 0));
                __runInitializers(this, _processWmManufacturingUnitId_extraInitializers);
            }
            return DeleteProcessWmManufacturingUnitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260305124230' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _processWmManufacturingUnitId_decorators = [(0, swagger_1.ApiProperty)({ example: 1, description: 'Numeric process_wm_manufacturing_units id' }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _processWmManufacturingUnitId_decorators, { kind: "field", name: "processWmManufacturingUnitId", static: false, private: false, access: { has: function (obj) { return "processWmManufacturingUnitId" in obj; }, get: function (obj) { return obj.processWmManufacturingUnitId; }, set: function (obj, value) { obj.processWmManufacturingUnitId = value; } }, metadata: _metadata }, _processWmManufacturingUnitId_initializers, _processWmManufacturingUnitId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DeleteProcessWmManufacturingUnitDto = DeleteProcessWmManufacturingUnitDto;
