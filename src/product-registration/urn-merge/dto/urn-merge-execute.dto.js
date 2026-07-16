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
exports.UrnMergeExecuteDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var UrnMergeExecuteDto = function () {
    var _a;
    var _sourceUrnNo_decorators;
    var _sourceUrnNo_initializers = [];
    var _sourceUrnNo_extraInitializers = [];
    var _targetUrnNo_decorators;
    var _targetUrnNo_initializers = [];
    var _targetUrnNo_extraInitializers = [];
    var _moveAllCertifiedEois_decorators;
    var _moveAllCertifiedEois_initializers = [];
    var _moveAllCertifiedEois_extraInitializers = [];
    var _productIds_decorators;
    var _productIds_initializers = [];
    var _productIds_extraInitializers = [];
    var _urnLevelStrategy_decorators;
    var _urnLevelStrategy_initializers = [];
    var _urnLevelStrategy_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UrnMergeExecuteDto() {
                this.sourceUrnNo = __runInitializers(this, _sourceUrnNo_initializers, void 0);
                this.targetUrnNo = (__runInitializers(this, _sourceUrnNo_extraInitializers), __runInitializers(this, _targetUrnNo_initializers, void 0));
                this.moveAllCertifiedEois = (__runInitializers(this, _targetUrnNo_extraInitializers), __runInitializers(this, _moveAllCertifiedEois_initializers, void 0));
                this.productIds = (__runInitializers(this, _moveAllCertifiedEois_extraInitializers), __runInitializers(this, _productIds_initializers, void 0));
                this.urnLevelStrategy = (__runInitializers(this, _productIds_extraInitializers), __runInitializers(this, _urnLevelStrategy_initializers, void 0));
                __runInitializers(this, _urnLevelStrategy_extraInitializers);
            }
            return UrnMergeExecuteDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sourceUrnNo_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetUrnNo_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _moveAllCertifiedEois_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _productIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [Number] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsInt)({ each: true }), (0, class_validator_1.Min)(1, { each: true })];
            _urnLevelStrategy_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 'fill_gaps_keep_target' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _sourceUrnNo_decorators, { kind: "field", name: "sourceUrnNo", static: false, private: false, access: { has: function (obj) { return "sourceUrnNo" in obj; }, get: function (obj) { return obj.sourceUrnNo; }, set: function (obj, value) { obj.sourceUrnNo = value; } }, metadata: _metadata }, _sourceUrnNo_initializers, _sourceUrnNo_extraInitializers);
            __esDecorate(null, null, _targetUrnNo_decorators, { kind: "field", name: "targetUrnNo", static: false, private: false, access: { has: function (obj) { return "targetUrnNo" in obj; }, get: function (obj) { return obj.targetUrnNo; }, set: function (obj, value) { obj.targetUrnNo = value; } }, metadata: _metadata }, _targetUrnNo_initializers, _targetUrnNo_extraInitializers);
            __esDecorate(null, null, _moveAllCertifiedEois_decorators, { kind: "field", name: "moveAllCertifiedEois", static: false, private: false, access: { has: function (obj) { return "moveAllCertifiedEois" in obj; }, get: function (obj) { return obj.moveAllCertifiedEois; }, set: function (obj, value) { obj.moveAllCertifiedEois = value; } }, metadata: _metadata }, _moveAllCertifiedEois_initializers, _moveAllCertifiedEois_extraInitializers);
            __esDecorate(null, null, _productIds_decorators, { kind: "field", name: "productIds", static: false, private: false, access: { has: function (obj) { return "productIds" in obj; }, get: function (obj) { return obj.productIds; }, set: function (obj, value) { obj.productIds = value; } }, metadata: _metadata }, _productIds_initializers, _productIds_extraInitializers);
            __esDecorate(null, null, _urnLevelStrategy_decorators, { kind: "field", name: "urnLevelStrategy", static: false, private: false, access: { has: function (obj) { return "urnLevelStrategy" in obj; }, get: function (obj) { return obj.urnLevelStrategy; }, set: function (obj, value) { obj.urnLevelStrategy = value; } }, metadata: _metadata }, _urnLevelStrategy_initializers, _urnLevelStrategy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UrnMergeExecuteDto = UrnMergeExecuteDto;
