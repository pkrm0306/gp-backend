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
exports.EditTeamMemberDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var vendor_user_schema_1 = require("../../vendor-users/schemas/vendor-user.schema");
var EditTeamMemberDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _designation_decorators;
    var _designation_initializers = [];
    var _designation_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _mobile_decorators;
    var _mobile_initializers = [];
    var _mobile_extraInitializers = [];
    var _facebookUrl_decorators;
    var _facebookUrl_initializers = [];
    var _facebookUrl_extraInitializers = [];
    var _twitterUrl_decorators;
    var _twitterUrl_initializers = [];
    var _twitterUrl_extraInitializers = [];
    var _linkedinUrl_decorators;
    var _linkedinUrl_initializers = [];
    var _linkedinUrl_extraInitializers = [];
    var _roleId_decorators;
    var _roleId_initializers = [];
    var _roleId_extraInitializers = [];
    var _displayOrder_decorators;
    var _displayOrder_initializers = [];
    var _displayOrder_extraInitializers = [];
    var _businessVertical_decorators;
    var _businessVertical_initializers = [];
    var _businessVertical_extraInitializers = [];
    var _showOnWebsite_decorators;
    var _showOnWebsite_initializers = [];
    var _showOnWebsite_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EditTeamMemberDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.designation = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
                this.email = (__runInitializers(this, _designation_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.mobile = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _mobile_initializers, void 0));
                this.facebookUrl = (__runInitializers(this, _mobile_extraInitializers), __runInitializers(this, _facebookUrl_initializers, void 0));
                this.twitterUrl = (__runInitializers(this, _facebookUrl_extraInitializers), __runInitializers(this, _twitterUrl_initializers, void 0));
                this.linkedinUrl = (__runInitializers(this, _twitterUrl_extraInitializers), __runInitializers(this, _linkedinUrl_initializers, void 0));
                this.roleId = (__runInitializers(this, _linkedinUrl_extraInitializers), __runInitializers(this, _roleId_initializers, void 0));
                this.displayOrder = (__runInitializers(this, _roleId_extraInitializers), __runInitializers(this, _displayOrder_initializers, void 0));
                this.businessVertical = (__runInitializers(this, _displayOrder_extraInitializers), __runInitializers(this, _businessVertical_initializers, void 0));
                this.showOnWebsite = (__runInitializers(this, _businessVertical_extraInitializers), __runInitializers(this, _showOnWebsite_initializers, void 0));
                __runInitializers(this, _showOnWebsite_extraInitializers);
            }
            return EditTeamMemberDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Team member document id' }), (0, class_validator_1.IsMongoId)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Team member name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _designation_decorators = [(0, swagger_1.ApiProperty)({ required: false, description: 'Team member designation' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Team member email' }), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            _mobile_decorators = [(0, swagger_1.ApiProperty)({ description: 'Team member mobile number' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _facebookUrl_decorators = [(0, swagger_1.ApiProperty)({ required: false, description: 'Facebook profile URL' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _twitterUrl_decorators = [(0, swagger_1.ApiProperty)({ required: false, description: 'Twitter profile URL' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _linkedinUrl_decorators = [(0, swagger_1.ApiProperty)({ required: false, description: 'LinkedIn profile URL' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _roleId_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Optional RBAC role id. If provided, portal access is enabled and credentials email is sent only on first assignment.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsMongoId)()];
            _displayOrder_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Display order for list/website ordering',
                    minimum: 1,
                    example: 1,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '')
                        return undefined;
                    var n = Number(value);
                    if (!Number.isFinite(n) || n < 1)
                        return undefined;
                    return n;
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _businessVertical_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Business vertical',
                    enum: vendor_user_schema_1.BUSINESS_VERTICALS,
                    example: 'building products',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null
                        ? value
                        : String(value).trim().toLowerCase();
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsIn)(vendor_user_schema_1.BUSINESS_VERTICALS)];
            _showOnWebsite_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'When false, team member is hidden on the public website.',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || String(value).trim() === '') {
                        return undefined;
                    }
                    var v = String(value).trim().toLowerCase();
                    if (v === '1' || v === 'true' || v === 'yes' || v === 'on')
                        return true;
                    if (v === '0' || v === 'false' || v === 'no' || v === 'off')
                        return false;
                    return undefined;
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: function (obj) { return "designation" in obj; }, get: function (obj) { return obj.designation; }, set: function (obj, value) { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _mobile_decorators, { kind: "field", name: "mobile", static: false, private: false, access: { has: function (obj) { return "mobile" in obj; }, get: function (obj) { return obj.mobile; }, set: function (obj, value) { obj.mobile = value; } }, metadata: _metadata }, _mobile_initializers, _mobile_extraInitializers);
            __esDecorate(null, null, _facebookUrl_decorators, { kind: "field", name: "facebookUrl", static: false, private: false, access: { has: function (obj) { return "facebookUrl" in obj; }, get: function (obj) { return obj.facebookUrl; }, set: function (obj, value) { obj.facebookUrl = value; } }, metadata: _metadata }, _facebookUrl_initializers, _facebookUrl_extraInitializers);
            __esDecorate(null, null, _twitterUrl_decorators, { kind: "field", name: "twitterUrl", static: false, private: false, access: { has: function (obj) { return "twitterUrl" in obj; }, get: function (obj) { return obj.twitterUrl; }, set: function (obj, value) { obj.twitterUrl = value; } }, metadata: _metadata }, _twitterUrl_initializers, _twitterUrl_extraInitializers);
            __esDecorate(null, null, _linkedinUrl_decorators, { kind: "field", name: "linkedinUrl", static: false, private: false, access: { has: function (obj) { return "linkedinUrl" in obj; }, get: function (obj) { return obj.linkedinUrl; }, set: function (obj, value) { obj.linkedinUrl = value; } }, metadata: _metadata }, _linkedinUrl_initializers, _linkedinUrl_extraInitializers);
            __esDecorate(null, null, _roleId_decorators, { kind: "field", name: "roleId", static: false, private: false, access: { has: function (obj) { return "roleId" in obj; }, get: function (obj) { return obj.roleId; }, set: function (obj, value) { obj.roleId = value; } }, metadata: _metadata }, _roleId_initializers, _roleId_extraInitializers);
            __esDecorate(null, null, _displayOrder_decorators, { kind: "field", name: "displayOrder", static: false, private: false, access: { has: function (obj) { return "displayOrder" in obj; }, get: function (obj) { return obj.displayOrder; }, set: function (obj, value) { obj.displayOrder = value; } }, metadata: _metadata }, _displayOrder_initializers, _displayOrder_extraInitializers);
            __esDecorate(null, null, _businessVertical_decorators, { kind: "field", name: "businessVertical", static: false, private: false, access: { has: function (obj) { return "businessVertical" in obj; }, get: function (obj) { return obj.businessVertical; }, set: function (obj, value) { obj.businessVertical = value; } }, metadata: _metadata }, _businessVertical_initializers, _businessVertical_extraInitializers);
            __esDecorate(null, null, _showOnWebsite_decorators, { kind: "field", name: "showOnWebsite", static: false, private: false, access: { has: function (obj) { return "showOnWebsite" in obj; }, get: function (obj) { return obj.showOnWebsite; }, set: function (obj, value) { obj.showOnWebsite = value; } }, metadata: _metadata }, _showOnWebsite_initializers, _showOnWebsite_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.EditTeamMemberDto = EditTeamMemberDto;
