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
exports.CreateZohoLeadDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateZohoLeadDto = function () {
    var _a;
    var _company_decorators;
    var _company_initializers = [];
    var _company_extraInitializers = [];
    var _lastName_decorators;
    var _lastName_initializers = [];
    var _lastName_extraInitializers = [];
    var _firstName_decorators;
    var _firstName_initializers = [];
    var _firstName_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _mobile_decorators;
    var _mobile_initializers = [];
    var _mobile_extraInitializers = [];
    var _leadSource_decorators;
    var _leadSource_initializers = [];
    var _leadSource_extraInitializers = [];
    var _leadStatus_decorators;
    var _leadStatus_initializers = [];
    var _leadStatus_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _country_extraInitializers = [];
    var _portalUserId_decorators;
    var _portalUserId_initializers = [];
    var _portalUserId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _productInterest_decorators;
    var _productInterest_initializers = [];
    var _productInterest_extraInitializers = [];
    var _customFields_decorators;
    var _customFields_initializers = [];
    var _customFields_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateZohoLeadDto() {
                this.company = __runInitializers(this, _company_initializers, void 0);
                this.lastName = (__runInitializers(this, _company_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
                this.firstName = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
                this.email = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.mobile = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _mobile_initializers, void 0));
                this.leadSource = (__runInitializers(this, _mobile_extraInitializers), __runInitializers(this, _leadSource_initializers, void 0));
                this.leadStatus = (__runInitializers(this, _leadSource_extraInitializers), __runInitializers(this, _leadStatus_initializers, void 0));
                this.city = (__runInitializers(this, _leadStatus_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.country = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                this.portalUserId = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _portalUserId_initializers, void 0));
                this.vendorId = (__runInitializers(this, _portalUserId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
                this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
                this.productInterest = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _productInterest_initializers, void 0));
                this.customFields = (__runInitializers(this, _productInterest_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
                __runInitializers(this, _customFields_extraInitializers);
            }
            return CreateZohoLeadDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _company_decorators = [(0, swagger_1.ApiProperty)({ example: 'Acme Green Materials Pvt Ltd' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _lastName_decorators = [(0, swagger_1.ApiProperty)({ example: 'Rao' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _firstName_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Vicky' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'vicky@example.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '+919876543210' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _mobile_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '+919876543210' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _leadSource_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Portal Registration' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _leadStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'New' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Hyderabad' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Telangana' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _country_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'India' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _portalUserId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '65a4c5c861f71f1a6f357b11' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _vendorId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '65a4c5c861f71f1a6f357b12' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _manufacturerId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Manufacturer MongoDB id for storing Zoho lead mapping.',
                    example: '65a4c5c861f71f1a6f357b12',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _productInterest_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Paints and coatings' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _customFields_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Additional Zoho field API names and values.',
                    example: { Lead_Status: 'Not Contacted' },
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _company_decorators, { kind: "field", name: "company", static: false, private: false, access: { has: function (obj) { return "company" in obj; }, get: function (obj) { return obj.company; }, set: function (obj, value) { obj.company = value; } }, metadata: _metadata }, _company_initializers, _company_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: function (obj) { return "lastName" in obj; }, get: function (obj) { return obj.lastName; }, set: function (obj, value) { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: function (obj) { return "firstName" in obj; }, get: function (obj) { return obj.firstName; }, set: function (obj, value) { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _mobile_decorators, { kind: "field", name: "mobile", static: false, private: false, access: { has: function (obj) { return "mobile" in obj; }, get: function (obj) { return obj.mobile; }, set: function (obj, value) { obj.mobile = value; } }, metadata: _metadata }, _mobile_initializers, _mobile_extraInitializers);
            __esDecorate(null, null, _leadSource_decorators, { kind: "field", name: "leadSource", static: false, private: false, access: { has: function (obj) { return "leadSource" in obj; }, get: function (obj) { return obj.leadSource; }, set: function (obj, value) { obj.leadSource = value; } }, metadata: _metadata }, _leadSource_initializers, _leadSource_extraInitializers);
            __esDecorate(null, null, _leadStatus_decorators, { kind: "field", name: "leadStatus", static: false, private: false, access: { has: function (obj) { return "leadStatus" in obj; }, get: function (obj) { return obj.leadStatus; }, set: function (obj, value) { obj.leadStatus = value; } }, metadata: _metadata }, _leadStatus_initializers, _leadStatus_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _portalUserId_decorators, { kind: "field", name: "portalUserId", static: false, private: false, access: { has: function (obj) { return "portalUserId" in obj; }, get: function (obj) { return obj.portalUserId; }, set: function (obj, value) { obj.portalUserId = value; } }, metadata: _metadata }, _portalUserId_initializers, _portalUserId_extraInitializers);
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
            __esDecorate(null, null, _productInterest_decorators, { kind: "field", name: "productInterest", static: false, private: false, access: { has: function (obj) { return "productInterest" in obj; }, get: function (obj) { return obj.productInterest; }, set: function (obj, value) { obj.productInterest = value; } }, metadata: _metadata }, _productInterest_initializers, _productInterest_extraInitializers);
            __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: function (obj) { return "customFields" in obj; }, get: function (obj) { return obj.customFields; }, set: function (obj, value) { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateZohoLeadDto = CreateZohoLeadDto;
