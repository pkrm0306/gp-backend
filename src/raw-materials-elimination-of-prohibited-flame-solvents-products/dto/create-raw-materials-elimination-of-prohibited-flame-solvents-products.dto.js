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
exports.CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _productsName_decorators;
    var _productsName_initializers = [];
    var _productsName_extraInitializers = [];
    var _productsTestReport_decorators;
    var _productsTestReport_initializers = [];
    var _productsTestReport_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.productsName = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _productsName_initializers, void 0));
                this.productsTestReport = (__runInitializers(this, _productsName_extraInitializers), __runInitializers(this, _productsTestReport_initializers, void 0));
                __runInitializers(this, _productsTestReport_extraInitializers);
            }
            return CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(64)];
            _productsName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Products name',
                    example: 'Compliant solvent product',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _productsTestReport_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Products test report details',
                    example: 'Prohibited flame solvents product test report details/reference',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _productsName_decorators, { kind: "field", name: "productsName", static: false, private: false, access: { has: function (obj) { return "productsName" in obj; }, get: function (obj) { return obj.productsName; }, set: function (obj, value) { obj.productsName = value; } }, metadata: _metadata }, _productsName_initializers, _productsName_extraInitializers);
            __esDecorate(null, null, _productsTestReport_decorators, { kind: "field", name: "productsTestReport", static: false, private: false, access: { has: function (obj) { return "productsTestReport" in obj; }, get: function (obj) { return obj.productsTestReport; }, set: function (obj, value) { obj.productsTestReport = value; } }, metadata: _metadata }, _productsTestReport_initializers, _productsTestReport_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto = CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto;
