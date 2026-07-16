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
exports.UpdateVendorContactsDto = exports.VendorContactFieldsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var VendorContactFieldsDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_id_decorators;
    var _email_id_initializers = [];
    var _email_id_extraInitializers = [];
    var _phone_number_decorators;
    var _phone_number_initializers = [];
    var _phone_number_extraInitializers = [];
    var _designation_decorators;
    var _designation_initializers = [];
    var _designation_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VendorContactFieldsDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.email_id = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_id_initializers, void 0));
                this.phone_number = (__runInitializers(this, _email_id_extraInitializers), __runInitializers(this, _phone_number_initializers, void 0));
                this.designation = (__runInitializers(this, _phone_number_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
                __runInitializers(this, _designation_extraInitializers);
            }
            return VendorContactFieldsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Jane Doe' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _email_id_decorators = [(0, swagger_1.ApiProperty)({ example: 'jane@example.com' }), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(320)];
            _phone_number_decorators = [(0, swagger_1.ApiProperty)({ example: '+919876543210' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(32)];
            _designation_decorators = [(0, swagger_1.ApiProperty)({ example: 'Head of Engineering' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _email_id_decorators, { kind: "field", name: "email_id", static: false, private: false, access: { has: function (obj) { return "email_id" in obj; }, get: function (obj) { return obj.email_id; }, set: function (obj, value) { obj.email_id = value; } }, metadata: _metadata }, _email_id_initializers, _email_id_extraInitializers);
            __esDecorate(null, null, _phone_number_decorators, { kind: "field", name: "phone_number", static: false, private: false, access: { has: function (obj) { return "phone_number" in obj; }, get: function (obj) { return obj.phone_number; }, set: function (obj, value) { obj.phone_number = value; } }, metadata: _metadata }, _phone_number_initializers, _phone_number_extraInitializers);
            __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: function (obj) { return "designation" in obj; }, get: function (obj) { return obj.designation; }, set: function (obj, value) { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VendorContactFieldsDto = VendorContactFieldsDto;
var UpdateVendorContactsDto = function () {
    var _a;
    var _technicalContact_decorators;
    var _technicalContact_initializers = [];
    var _technicalContact_extraInitializers = [];
    var _marketingContact_decorators;
    var _marketingContact_initializers = [];
    var _marketingContact_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateVendorContactsDto() {
                this.technicalContact = __runInitializers(this, _technicalContact_initializers, void 0);
                this.marketingContact = (__runInitializers(this, _technicalContact_extraInitializers), __runInitializers(this, _marketingContact_initializers, void 0));
                __runInitializers(this, _marketingContact_extraInitializers);
            }
            return UpdateVendorContactsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _technicalContact_decorators = [(0, swagger_1.ApiProperty)({ type: VendorContactFieldsDto }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return VendorContactFieldsDto; })];
            _marketingContact_decorators = [(0, swagger_1.ApiProperty)({ type: VendorContactFieldsDto }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return VendorContactFieldsDto; })];
            __esDecorate(null, null, _technicalContact_decorators, { kind: "field", name: "technicalContact", static: false, private: false, access: { has: function (obj) { return "technicalContact" in obj; }, get: function (obj) { return obj.technicalContact; }, set: function (obj, value) { obj.technicalContact = value; } }, metadata: _metadata }, _technicalContact_initializers, _technicalContact_extraInitializers);
            __esDecorate(null, null, _marketingContact_decorators, { kind: "field", name: "marketingContact", static: false, private: false, access: { has: function (obj) { return "marketingContact" in obj; }, get: function (obj) { return obj.marketingContact; }, set: function (obj, value) { obj.marketingContact = value; } }, metadata: _metadata }, _marketingContact_initializers, _marketingContact_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateVendorContactsDto = UpdateVendorContactsDto;
