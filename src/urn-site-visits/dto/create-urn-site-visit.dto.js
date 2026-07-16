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
exports.CreateUrnSiteVisitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function firstString() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
        var v = values_1[_a];
        if (v !== undefined && v !== null && String(v).trim() !== '') {
            return String(v).trim();
        }
    }
    return undefined;
}
var CreateUrnSiteVisitDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _addressLine1_decorators;
    var _addressLine1_initializers = [];
    var _addressLine1_extraInitializers = [];
    var _addressLine2_decorators;
    var _addressLine2_initializers = [];
    var _addressLine2_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _postalCode_decorators;
    var _postalCode_initializers = [];
    var _postalCode_extraInitializers = [];
    var _postal_code_decorators;
    var _postal_code_initializers = [];
    var _postal_code_extraInitializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _country_extraInitializers = [];
    var _auditType_decorators;
    var _auditType_initializers = [];
    var _auditType_extraInitializers = [];
    var _auditConductedOn_decorators;
    var _auditConductedOn_initializers = [];
    var _auditConductedOn_extraInitializers = [];
    var _conductedBy_decorators;
    var _conductedBy_initializers = [];
    var _conductedBy_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateUrnSiteVisitDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.name = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.addressLine1 = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _addressLine1_initializers, void 0));
                this.addressLine2 = (__runInitializers(this, _addressLine1_extraInitializers), __runInitializers(this, _addressLine2_initializers, void 0));
                this.city = (__runInitializers(this, _addressLine2_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                /** Legacy clients may still send postal code; it is ignored. */
                this.postalCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
                this.postal_code = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _postal_code_initializers, void 0));
                this.country = (__runInitializers(this, _postal_code_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                this.auditType = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _auditType_initializers, void 0));
                this.auditConductedOn = (__runInitializers(this, _auditType_extraInitializers), __runInitializers(this, _auditConductedOn_initializers, void 0));
                this.conductedBy = (__runInitializers(this, _auditConductedOn_extraInitializers), __runInitializers(this, _conductedBy_initializers, void 0));
                __runInitializers(this, _conductedBy_extraInitializers);
            }
            return CreateUrnSiteVisitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260514165917' }), (0, class_transformer_1.Transform)(function (_b) {
                    var obj = _b.obj, value = _b.value;
                    return firstString(value, obj === null || obj === void 0 ? void 0 : obj.urn_no);
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Plant A',
                    description: 'Manufacturing plant name for this URN (must match an active plant on the URN). Use GET /api/admin/urn-site-visits/plant-options?urnNo=… for allowed values.',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _addressLine1_decorators = [(0, swagger_1.ApiProperty)({ example: '12 Industrial Ave' }), (0, class_transformer_1.Transform)(function (_b) {
                    var _c;
                    var obj = _b.obj, value = _b.value;
                    return (_c = firstString(value, obj === null || obj === void 0 ? void 0 : obj.address_line1)) !== null && _c !== void 0 ? _c : value;
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _addressLine2_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '' }), (0, class_transformer_1.Transform)(function (_b) {
                    var obj = _b.obj, value = _b.value;
                    return value === undefined ? obj === null || obj === void 0 ? void 0 : obj.address_line2 : value;
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _city_decorators = [(0, swagger_1.ApiProperty)({ example: 'Sydney' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _state_decorators = [(0, swagger_1.ApiProperty)({ example: 'NSW' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _postalCode_decorators = [(0, class_validator_1.Allow)()];
            _postal_code_decorators = [(0, class_validator_1.Allow)()];
            _country_decorators = [(0, swagger_1.ApiProperty)({ example: 'Australia', description: 'Country display name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _auditType_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Initial audit' }), (0, class_transformer_1.Transform)(function (_b) {
                    var obj = _b.obj, value = _b.value;
                    return firstString(value, obj === null || obj === void 0 ? void 0 : obj.audit_type);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _auditConductedOn_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2026-05-14' }), (0, class_transformer_1.Transform)(function (_b) {
                    var obj = _b.obj, value = _b.value;
                    return firstString(value, obj === null || obj === void 0 ? void 0 : obj.audit_conducted_on);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _conductedBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'GreenPro Auditor' }), (0, class_transformer_1.Transform)(function (_b) {
                    var obj = _b.obj, value = _b.value;
                    return firstString(value, obj === null || obj === void 0 ? void 0 : obj.conducted_by);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _addressLine1_decorators, { kind: "field", name: "addressLine1", static: false, private: false, access: { has: function (obj) { return "addressLine1" in obj; }, get: function (obj) { return obj.addressLine1; }, set: function (obj, value) { obj.addressLine1 = value; } }, metadata: _metadata }, _addressLine1_initializers, _addressLine1_extraInitializers);
            __esDecorate(null, null, _addressLine2_decorators, { kind: "field", name: "addressLine2", static: false, private: false, access: { has: function (obj) { return "addressLine2" in obj; }, get: function (obj) { return obj.addressLine2; }, set: function (obj, value) { obj.addressLine2 = value; } }, metadata: _metadata }, _addressLine2_initializers, _addressLine2_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: function (obj) { return "postalCode" in obj; }, get: function (obj) { return obj.postalCode; }, set: function (obj, value) { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
            __esDecorate(null, null, _postal_code_decorators, { kind: "field", name: "postal_code", static: false, private: false, access: { has: function (obj) { return "postal_code" in obj; }, get: function (obj) { return obj.postal_code; }, set: function (obj, value) { obj.postal_code = value; } }, metadata: _metadata }, _postal_code_initializers, _postal_code_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _auditType_decorators, { kind: "field", name: "auditType", static: false, private: false, access: { has: function (obj) { return "auditType" in obj; }, get: function (obj) { return obj.auditType; }, set: function (obj, value) { obj.auditType = value; } }, metadata: _metadata }, _auditType_initializers, _auditType_extraInitializers);
            __esDecorate(null, null, _auditConductedOn_decorators, { kind: "field", name: "auditConductedOn", static: false, private: false, access: { has: function (obj) { return "auditConductedOn" in obj; }, get: function (obj) { return obj.auditConductedOn; }, set: function (obj, value) { obj.auditConductedOn = value; } }, metadata: _metadata }, _auditConductedOn_initializers, _auditConductedOn_extraInitializers);
            __esDecorate(null, null, _conductedBy_decorators, { kind: "field", name: "conductedBy", static: false, private: false, access: { has: function (obj) { return "conductedBy" in obj; }, get: function (obj) { return obj.conductedBy; }, set: function (obj, value) { obj.conductedBy = value; } }, metadata: _metadata }, _conductedBy_initializers, _conductedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateUrnSiteVisitDto = CreateUrnSiteVisitDto;
