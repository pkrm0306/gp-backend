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
exports.CreateRawMaterialsHazardousDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var raw_materials_upload_util_1 = require("../../common/raw-materials/raw-materials-upload.util");
var CreateRawMaterialsHazardousDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _details_decorators;
    var _details_initializers = [];
    var _details_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRawMaterialsHazardousDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.eoiNo = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
                this.details = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _details_initializers, void 0));
                __runInitializers(this, _details_extraInitializers);
            }
            return CreateRawMaterialsHazardousDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260520013725',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(raw_materials_upload_util_1.RAW_MATERIALS_URN_MAX_LENGTH)];
            _eoiNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'EOI number from product context',
                    example: 'GPPMI003014',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(raw_materials_upload_util_1.RAW_MATERIALS_EOI_NO_MAX_LENGTH)];
            _details_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Details of the test carried out (textarea). Optional on this endpoint if products/files are saved separately.',
                    example: 'Details of hazardous raw materials and handling controls.',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
            __esDecorate(null, null, _details_decorators, { kind: "field", name: "details", static: false, private: false, access: { has: function (obj) { return "details" in obj; }, get: function (obj) { return obj.details; }, set: function (obj, value) { obj.details = value; } }, metadata: _metadata }, _details_initializers, _details_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRawMaterialsHazardousDto = CreateRawMaterialsHazardousDto;
