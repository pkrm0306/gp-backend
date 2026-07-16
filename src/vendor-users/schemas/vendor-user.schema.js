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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserSchema = exports.VendorUser = exports.BUSINESS_VERTICALS = exports.TEAM_MEMBER_TEAMS = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
exports.TEAM_MEMBER_TEAMS = [
    'administrative',
    'technical',
    'finance',
    'marketing',
];
exports.BUSINESS_VERTICALS = [
    'building products',
    'industrial products',
    'consumer products',
    'facility services',
];
/**
 * Vendor portal accounts (vendor / partner / admin / staff).
 *
 * **Collection name:** legacy data lives in **`users`** (not the Mongoose default
 * `vendorusers`). Override with env **`VENDOR_USERS_MONGO_COLLECTION`** if your DB uses a
 * different collection.
 */
var vendorUsersCollectionName = (typeof process !== 'undefined' &&
    String(process.env.VENDOR_USERS_MONGO_COLLECTION || '').trim()) ||
    'users';
var VendorUser = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: vendorUsersCollectionName, timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _countryCode_decorators;
    var _countryCode_initializers = [];
    var _countryCode_extraInitializers = [];
    var _designation_decorators;
    var _designation_initializers = [];
    var _designation_extraInitializers = [];
    var _image_decorators;
    var _image_initializers = [];
    var _image_extraInitializers = [];
    var _facebookUrl_decorators;
    var _facebookUrl_initializers = [];
    var _facebookUrl_extraInitializers = [];
    var _twitterUrl_decorators;
    var _twitterUrl_initializers = [];
    var _twitterUrl_extraInitializers = [];
    var _linkedinUrl_decorators;
    var _linkedinUrl_initializers = [];
    var _linkedinUrl_extraInitializers = [];
    var _displayOrder_decorators;
    var _displayOrder_initializers = [];
    var _displayOrder_extraInitializers = [];
    var _team_decorators;
    var _team_initializers = [];
    var _team_extraInitializers = [];
    var _businessVertical_decorators;
    var _businessVertical_initializers = [];
    var _businessVertical_extraInitializers = [];
    var _sector_ids_decorators;
    var _sector_ids_initializers = [];
    var _sector_ids_extraInitializers = [];
    var _sector_id_decorators;
    var _sector_id_initializers = [];
    var _sector_id_extraInitializers = [];
    var _category_ids_decorators;
    var _category_ids_initializers = [];
    var _category_ids_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _otp_decorators;
    var _otp_initializers = [];
    var _otp_extraInitializers = [];
    var _isVerified_decorators;
    var _isVerified_initializers = [];
    var _isVerified_extraInitializers = [];
    var _showOnWebsite_decorators;
    var _showOnWebsite_initializers = [];
    var _showOnWebsite_extraInitializers = [];
    var VendorUser = _classThis = /** @class */ (function () {
        function VendorUser_1() {
            this.manufacturerId = __runInitializers(this, _manufacturerId_initializers, void 0);
            // Legacy alias retained for backward compatibility with existing modules.
            this.vendorId = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.name = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            /** Dial code stored for vendor team members (e.g. +91). */
            this.countryCode = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _countryCode_initializers, void 0));
            this.designation = (__runInitializers(this, _countryCode_extraInitializers), __runInitializers(this, _designation_initializers, void 0));
            this.image = (__runInitializers(this, _designation_extraInitializers), __runInitializers(this, _image_initializers, void 0));
            this.facebookUrl = (__runInitializers(this, _image_extraInitializers), __runInitializers(this, _facebookUrl_initializers, void 0));
            this.twitterUrl = (__runInitializers(this, _facebookUrl_extraInitializers), __runInitializers(this, _twitterUrl_initializers, void 0));
            this.linkedinUrl = (__runInitializers(this, _twitterUrl_extraInitializers), __runInitializers(this, _linkedinUrl_initializers, void 0));
            this.displayOrder = (__runInitializers(this, _linkedinUrl_extraInitializers), __runInitializers(this, _displayOrder_initializers, void 0));
            this.team = (__runInitializers(this, _displayOrder_extraInitializers), __runInitializers(this, _team_initializers, void 0));
            this.businessVertical = (__runInitializers(this, _team_extraInitializers), __runInitializers(this, _businessVertical_initializers, void 0));
            /**
             * Sector ids (GET /api/sectors numeric `id`); admin multiselect — what the user picks.
             * Replaces legacy **category_ids** for team-member forms.
             */
            this.sector_ids = (__runInitializers(this, _businessVertical_extraInitializers), __runInitializers(this, _sector_ids_initializers, void 0));
            /** Legacy primary sector (first entry of sector_ids when set). */
            this.sector_id = (__runInitializers(this, _sector_ids_extraInitializers), __runInitializers(this, _sector_id_initializers, void 0));
            /** @deprecated Use **sector_ids**. Kept for legacy queries / migration. */
            this.category_ids = (__runInitializers(this, _sector_id_extraInitializers), __runInitializers(this, _category_ids_initializers, void 0));
            /** @deprecated Use **sector_id**. */
            this.category_id = (__runInitializers(this, _category_ids_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
            this.password = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.type = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.otp = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _otp_initializers, void 0));
            this.isVerified = (__runInitializers(this, _otp_extraInitializers), __runInitializers(this, _isVerified_initializers, void 0));
            /** When false, member is hidden from the public website team listing. */
            this.showOnWebsite = (__runInitializers(this, _isVerified_extraInitializers), __runInitializers(this, _showOnWebsite_initializers, void 0));
            this.createdAt = __runInitializers(this, _showOnWebsite_extraInitializers);
        }
        return VendorUser_1;
    }());
    __setFunctionName(_classThis, "VendorUser");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: false })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: false })];
        _name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _email_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _phone_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _countryCode_decorators = [(0, mongoose_1.Prop)()];
        _designation_decorators = [(0, mongoose_1.Prop)()];
        _image_decorators = [(0, mongoose_1.Prop)()];
        _facebookUrl_decorators = [(0, mongoose_1.Prop)()];
        _twitterUrl_decorators = [(0, mongoose_1.Prop)()];
        _linkedinUrl_decorators = [(0, mongoose_1.Prop)()];
        _displayOrder_decorators = [(0, mongoose_1.Prop)({ required: false, min: 1 })];
        _team_decorators = [(0, mongoose_1.Prop)({ required: false, enum: exports.TEAM_MEMBER_TEAMS })];
        _businessVertical_decorators = [(0, mongoose_1.Prop)({ required: false, enum: exports.BUSINESS_VERTICALS })];
        _sector_ids_decorators = [(0, mongoose_1.Prop)({ type: [Number], default: [] })];
        _sector_id_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _category_ids_decorators = [(0, mongoose_1.Prop)({ type: [Number], default: [] })];
        _category_id_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _password_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _type_decorators = [(0, mongoose_1.Prop)({ required: true, enum: ['vendor', 'partner', 'admin', 'staff'] })];
        _status_decorators = [(0, mongoose_1.Prop)({ default: 1 })];
        _otp_decorators = [(0, mongoose_1.Prop)()];
        _isVerified_decorators = [(0, mongoose_1.Prop)({ default: false })];
        _showOnWebsite_decorators = [(0, mongoose_1.Prop)({ default: true })];
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _countryCode_decorators, { kind: "field", name: "countryCode", static: false, private: false, access: { has: function (obj) { return "countryCode" in obj; }, get: function (obj) { return obj.countryCode; }, set: function (obj, value) { obj.countryCode = value; } }, metadata: _metadata }, _countryCode_initializers, _countryCode_extraInitializers);
        __esDecorate(null, null, _designation_decorators, { kind: "field", name: "designation", static: false, private: false, access: { has: function (obj) { return "designation" in obj; }, get: function (obj) { return obj.designation; }, set: function (obj, value) { obj.designation = value; } }, metadata: _metadata }, _designation_initializers, _designation_extraInitializers);
        __esDecorate(null, null, _image_decorators, { kind: "field", name: "image", static: false, private: false, access: { has: function (obj) { return "image" in obj; }, get: function (obj) { return obj.image; }, set: function (obj, value) { obj.image = value; } }, metadata: _metadata }, _image_initializers, _image_extraInitializers);
        __esDecorate(null, null, _facebookUrl_decorators, { kind: "field", name: "facebookUrl", static: false, private: false, access: { has: function (obj) { return "facebookUrl" in obj; }, get: function (obj) { return obj.facebookUrl; }, set: function (obj, value) { obj.facebookUrl = value; } }, metadata: _metadata }, _facebookUrl_initializers, _facebookUrl_extraInitializers);
        __esDecorate(null, null, _twitterUrl_decorators, { kind: "field", name: "twitterUrl", static: false, private: false, access: { has: function (obj) { return "twitterUrl" in obj; }, get: function (obj) { return obj.twitterUrl; }, set: function (obj, value) { obj.twitterUrl = value; } }, metadata: _metadata }, _twitterUrl_initializers, _twitterUrl_extraInitializers);
        __esDecorate(null, null, _linkedinUrl_decorators, { kind: "field", name: "linkedinUrl", static: false, private: false, access: { has: function (obj) { return "linkedinUrl" in obj; }, get: function (obj) { return obj.linkedinUrl; }, set: function (obj, value) { obj.linkedinUrl = value; } }, metadata: _metadata }, _linkedinUrl_initializers, _linkedinUrl_extraInitializers);
        __esDecorate(null, null, _displayOrder_decorators, { kind: "field", name: "displayOrder", static: false, private: false, access: { has: function (obj) { return "displayOrder" in obj; }, get: function (obj) { return obj.displayOrder; }, set: function (obj, value) { obj.displayOrder = value; } }, metadata: _metadata }, _displayOrder_initializers, _displayOrder_extraInitializers);
        __esDecorate(null, null, _team_decorators, { kind: "field", name: "team", static: false, private: false, access: { has: function (obj) { return "team" in obj; }, get: function (obj) { return obj.team; }, set: function (obj, value) { obj.team = value; } }, metadata: _metadata }, _team_initializers, _team_extraInitializers);
        __esDecorate(null, null, _businessVertical_decorators, { kind: "field", name: "businessVertical", static: false, private: false, access: { has: function (obj) { return "businessVertical" in obj; }, get: function (obj) { return obj.businessVertical; }, set: function (obj, value) { obj.businessVertical = value; } }, metadata: _metadata }, _businessVertical_initializers, _businessVertical_extraInitializers);
        __esDecorate(null, null, _sector_ids_decorators, { kind: "field", name: "sector_ids", static: false, private: false, access: { has: function (obj) { return "sector_ids" in obj; }, get: function (obj) { return obj.sector_ids; }, set: function (obj, value) { obj.sector_ids = value; } }, metadata: _metadata }, _sector_ids_initializers, _sector_ids_extraInitializers);
        __esDecorate(null, null, _sector_id_decorators, { kind: "field", name: "sector_id", static: false, private: false, access: { has: function (obj) { return "sector_id" in obj; }, get: function (obj) { return obj.sector_id; }, set: function (obj, value) { obj.sector_id = value; } }, metadata: _metadata }, _sector_id_initializers, _sector_id_extraInitializers);
        __esDecorate(null, null, _category_ids_decorators, { kind: "field", name: "category_ids", static: false, private: false, access: { has: function (obj) { return "category_ids" in obj; }, get: function (obj) { return obj.category_ids; }, set: function (obj, value) { obj.category_ids = value; } }, metadata: _metadata }, _category_ids_initializers, _category_ids_extraInitializers);
        __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _otp_decorators, { kind: "field", name: "otp", static: false, private: false, access: { has: function (obj) { return "otp" in obj; }, get: function (obj) { return obj.otp; }, set: function (obj, value) { obj.otp = value; } }, metadata: _metadata }, _otp_initializers, _otp_extraInitializers);
        __esDecorate(null, null, _isVerified_decorators, { kind: "field", name: "isVerified", static: false, private: false, access: { has: function (obj) { return "isVerified" in obj; }, get: function (obj) { return obj.isVerified; }, set: function (obj, value) { obj.isVerified = value; } }, metadata: _metadata }, _isVerified_initializers, _isVerified_extraInitializers);
        __esDecorate(null, null, _showOnWebsite_decorators, { kind: "field", name: "showOnWebsite", static: false, private: false, access: { has: function (obj) { return "showOnWebsite" in obj; }, get: function (obj) { return obj.showOnWebsite; }, set: function (obj, value) { obj.showOnWebsite = value; } }, metadata: _metadata }, _showOnWebsite_initializers, _showOnWebsite_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorUser = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorUser = _classThis;
}();
exports.VendorUser = VendorUser;
exports.VendorUserSchema = mongoose_1.SchemaFactory.createForClass(VendorUser);
exports.VendorUserSchema.pre('validate', function vendorUserManufacturerRules(next) {
    var _a;
    var doc = this;
    var type = String((_a = doc.type) !== null && _a !== void 0 ? _a : '').trim().toLowerCase();
    var hasManufacturer = doc.manufacturerId != null;
    var hasVendor = doc.vendorId != null;
    if (type === 'vendor' || type === 'partner') {
        if (!hasManufacturer && !hasVendor) {
            return next(new Error('manufacturerId is required for vendor and partner accounts'));
        }
        return next();
    }
    if (type === 'admin' || type === 'staff') {
        if (hasManufacturer || hasVendor) {
            return next(new Error('manufacturerId and vendorId must not be set for admin and staff accounts'));
        }
    }
    next();
});
// Vendor/partner: unique email and phone per manufacturer.
exports.VendorUserSchema.index({ manufacturerId: 1, email: 1 }, {
    unique: true,
    partialFilterExpression: {
        type: { $in: ['vendor', 'partner'] },
        manufacturerId: { $exists: true, $type: 'objectId' },
    },
});
exports.VendorUserSchema.index({ manufacturerId: 1, phone: 1 }, {
    unique: true,
    partialFilterExpression: {
        type: { $in: ['vendor', 'partner'] },
        manufacturerId: { $exists: true, $type: 'objectId' },
    },
});
// Platform admin/staff: globally unique email and phone.
exports.VendorUserSchema.index({ email: 1 }, {
    unique: true,
    partialFilterExpression: { type: { $in: ['admin', 'staff'] } },
});
exports.VendorUserSchema.index({ phone: 1 }, {
    unique: true,
    partialFilterExpression: { type: { $in: ['admin', 'staff'] } },
});
/**
 * Team members: one display slot per team (platform staff / website team).
 */
exports.VendorUserSchema.index({ team: 1, displayOrder: 1 }, {
    unique: true,
    name: 'uniq_staff_team_display_order',
    partialFilterExpression: {
        type: 'staff',
        status: { $ne: 2 },
        team: { $exists: true, $type: 'string' },
        displayOrder: { $exists: true, $gte: 1 },
    },
});
/**
 * Team members: one display slot per business vertical.
 */
exports.VendorUserSchema.index({ businessVertical: 1, displayOrder: 1 }, {
    unique: true,
    name: 'uniq_staff_business_vertical_display_order',
    partialFilterExpression: {
        type: 'staff',
        status: { $ne: 2 },
        businessVertical: { $exists: true, $type: 'string' },
        displayOrder: { $exists: true, $gte: 1 },
    },
});
