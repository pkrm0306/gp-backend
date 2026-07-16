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
exports.UpdateManufacturerDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
/** New auto format or legacy admin-entered ids (3–5 letter prefix). */
var GP_INTERNAL_ID_PATTERN = /^(GP[A-Z]{2}-(?:[1-9]\d{3}|\d{3})|[A-Z]{3,5}-\d{3})$/i;
var UpdateManufacturerDto = function () {
    var _a;
    var _manufacturerName_decorators;
    var _manufacturerName_initializers = [];
    var _manufacturerName_extraInitializers = [];
    var _gpInternalId_decorators;
    var _gpInternalId_initializers = [];
    var _gpInternalId_extraInitializers = [];
    var _manufacturerInitial_decorators;
    var _manufacturerInitial_initializers = [];
    var _manufacturerInitial_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateManufacturerDto() {
                this.manufacturerName = __runInitializers(this, _manufacturerName_initializers, void 0);
                this.gpInternalId = (__runInitializers(this, _manufacturerName_extraInitializers), __runInitializers(this, _gpInternalId_initializers, void 0));
                this.manufacturerInitial = (__runInitializers(this, _gpInternalId_extraInitializers), __runInitializers(this, _manufacturerInitial_initializers, void 0));
                __runInitializers(this, _manufacturerInitial_extraInitializers);
            }
            return UpdateManufacturerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _manufacturerName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manufacturer / company display name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _gpInternalId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Ignored for **unverified** manufacturers (server-generated). Optional for verified updates (legacy or GP<INI>-### format).',
                    example: 'GPGP-001',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === '' || value === null || value === undefined
                        ? undefined
                        : String(value).trim();
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(GP_INTERNAL_ID_PATTERN, {
                    message: 'gpInternalId must match GP<INITIAL>-### (001–999) or #### (1000–9999), or legacy ABC-### / ABCDE-###',
                })];
            _manufacturerInitial_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Ignored for **unverified** manufacturers (server-generated). Optional for verified updates.',
                    example: 'GP',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === '' || value === null || value === undefined
                        ? undefined
                        : String(value).trim();
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^[A-Za-z]{2}$/, {
                    message: 'manufacturerInitial must be exactly 2 letters when provided',
                })];
            __esDecorate(null, null, _manufacturerName_decorators, { kind: "field", name: "manufacturerName", static: false, private: false, access: { has: function (obj) { return "manufacturerName" in obj; }, get: function (obj) { return obj.manufacturerName; }, set: function (obj, value) { obj.manufacturerName = value; } }, metadata: _metadata }, _manufacturerName_initializers, _manufacturerName_extraInitializers);
            __esDecorate(null, null, _gpInternalId_decorators, { kind: "field", name: "gpInternalId", static: false, private: false, access: { has: function (obj) { return "gpInternalId" in obj; }, get: function (obj) { return obj.gpInternalId; }, set: function (obj, value) { obj.gpInternalId = value; } }, metadata: _metadata }, _gpInternalId_initializers, _gpInternalId_extraInitializers);
            __esDecorate(null, null, _manufacturerInitial_decorators, { kind: "field", name: "manufacturerInitial", static: false, private: false, access: { has: function (obj) { return "manufacturerInitial" in obj; }, get: function (obj) { return obj.manufacturerInitial; }, set: function (obj, value) { obj.manufacturerInitial = value; } }, metadata: _metadata }, _manufacturerInitial_initializers, _manufacturerInitial_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateManufacturerDto = UpdateManufacturerDto;
