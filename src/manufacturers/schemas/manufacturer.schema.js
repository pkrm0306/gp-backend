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
exports.ManufacturerSchema = exports.Manufacturer = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var vendor_contact_slot_schema_1 = require("./vendor-contact-slot.schema");
var Manufacturer = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _manufacturerName_decorators;
    var _manufacturerName_initializers = [];
    var _manufacturerName_extraInitializers = [];
    var _gpInternalId_decorators;
    var _gpInternalId_initializers = [];
    var _gpInternalId_extraInitializers = [];
    var _manufacturerInitial_decorators;
    var _manufacturerInitial_initializers = [];
    var _manufacturerInitial_extraInitializers = [];
    var _manufacturerStatus_decorators;
    var _manufacturerStatus_initializers = [];
    var _manufacturerStatus_extraInitializers = [];
    var _vendorPortalEmailVerified_decorators;
    var _vendorPortalEmailVerified_initializers = [];
    var _vendorPortalEmailVerified_extraInitializers = [];
    var _vendor_name_decorators;
    var _vendor_name_initializers = [];
    var _vendor_name_extraInitializers = [];
    var _vendor_email_decorators;
    var _vendor_email_initializers = [];
    var _vendor_email_extraInitializers = [];
    var _vendor_phone_decorators;
    var _vendor_phone_initializers = [];
    var _vendor_phone_extraInitializers = [];
    var _vendor_website_decorators;
    var _vendor_website_initializers = [];
    var _vendor_website_extraInitializers = [];
    var _vendor_facebook_decorators;
    var _vendor_facebook_initializers = [];
    var _vendor_facebook_extraInitializers = [];
    var _vendor_youtube_decorators;
    var _vendor_youtube_initializers = [];
    var _vendor_youtube_extraInitializers = [];
    var _vendor_twitter_decorators;
    var _vendor_twitter_initializers = [];
    var _vendor_twitter_extraInitializers = [];
    var _vendor_linkedin_decorators;
    var _vendor_linkedin_initializers = [];
    var _vendor_linkedin_extraInitializers = [];
    var _vendor_designation_decorators;
    var _vendor_designation_initializers = [];
    var _vendor_designation_extraInitializers = [];
    var _vendor_gst_decorators;
    var _vendor_gst_initializers = [];
    var _vendor_gst_extraInitializers = [];
    var _vendorPan_decorators;
    var _vendorPan_initializers = [];
    var _vendorPan_extraInitializers = [];
    var _vendorGstPdf_decorators;
    var _vendorGstPdf_initializers = [];
    var _vendorGstPdf_extraInitializers = [];
    var _vendor_status_decorators;
    var _vendor_status_initializers = [];
    var _vendor_status_extraInitializers = [];
    var _accountDeletedAt_decorators;
    var _accountDeletedAt_initializers = [];
    var _accountDeletedAt_extraInitializers = [];
    var _deletedVendorEmail_decorators;
    var _deletedVendorEmail_initializers = [];
    var _deletedVendorEmail_extraInitializers = [];
    var _deletedVendorPhone_decorators;
    var _deletedVendorPhone_initializers = [];
    var _deletedVendorPhone_extraInitializers = [];
    var _companySize_decorators;
    var _companySize_initializers = [];
    var _companySize_extraInitializers = [];
    var _manufacturerImage_decorators;
    var _manufacturerImage_initializers = [];
    var _manufacturerImage_extraInitializers = [];
    var _companyLogo_decorators;
    var _companyLogo_initializers = [];
    var _companyLogo_extraInitializers = [];
    var _vendorPanDocument_decorators;
    var _vendorPanDocument_initializers = [];
    var _vendorPanDocument_extraInitializers = [];
    var _technicalContact_decorators;
    var _technicalContact_initializers = [];
    var _technicalContact_extraInitializers = [];
    var _marketingContact_decorators;
    var _marketingContact_initializers = [];
    var _marketingContact_extraInitializers = [];
    var Manufacturer = _classThis = /** @class */ (function () {
        function Manufacturer_1() {
            this.manufacturerName = __runInitializers(this, _manufacturerName_initializers, void 0);
            this.gpInternalId = (__runInitializers(this, _manufacturerName_extraInitializers), __runInitializers(this, _gpInternalId_initializers, void 0));
            this.manufacturerInitial = (__runInitializers(this, _gpInternalId_extraInitializers), __runInitializers(this, _manufacturerInitial_initializers, void 0));
            this.manufacturerStatus = (__runInitializers(this, _manufacturerInitial_extraInitializers), __runInitializers(this, _manufacturerStatus_initializers, void 0));
            /**
             * After self-registration, false until the vendor completes email OTP.
             * Admin **unverified** listings exclude `false` so pending-OTP rows stay hidden.
             * Omitted on legacy rows (treated as eligible for the unverified list).
             */
            this.vendorPortalEmailVerified = (__runInitializers(this, _manufacturerStatus_extraInitializers), __runInitializers(this, _vendorPortalEmailVerified_initializers, void 0));
            this.vendor_name = (__runInitializers(this, _vendorPortalEmailVerified_extraInitializers), __runInitializers(this, _vendor_name_initializers, void 0));
            this.vendor_email = (__runInitializers(this, _vendor_name_extraInitializers), __runInitializers(this, _vendor_email_initializers, void 0));
            this.vendor_phone = (__runInitializers(this, _vendor_email_extraInitializers), __runInitializers(this, _vendor_phone_initializers, void 0));
            this.vendor_website = (__runInitializers(this, _vendor_phone_extraInitializers), __runInitializers(this, _vendor_website_initializers, void 0));
            this.vendor_facebook = (__runInitializers(this, _vendor_website_extraInitializers), __runInitializers(this, _vendor_facebook_initializers, void 0));
            this.vendor_youtube = (__runInitializers(this, _vendor_facebook_extraInitializers), __runInitializers(this, _vendor_youtube_initializers, void 0));
            this.vendor_twitter = (__runInitializers(this, _vendor_youtube_extraInitializers), __runInitializers(this, _vendor_twitter_initializers, void 0));
            this.vendor_linkedin = (__runInitializers(this, _vendor_twitter_extraInitializers), __runInitializers(this, _vendor_linkedin_initializers, void 0));
            this.vendor_designation = (__runInitializers(this, _vendor_linkedin_extraInitializers), __runInitializers(this, _vendor_designation_initializers, void 0));
            this.vendor_gst = (__runInitializers(this, _vendor_designation_extraInitializers), __runInitializers(this, _vendor_gst_initializers, void 0));
            /** PAN card id (10 chars, e.g. ABCDE1234F). Separate from document URL in vendorPanDocument. */
            this.vendorPan = (__runInitializers(this, _vendor_gst_extraInitializers), __runInitializers(this, _vendorPan_initializers, void 0));
            /** GST certificate / document (PDF), stored as public URL path under /uploads/... */
            this.vendorGstPdf = (__runInitializers(this, _vendorPan_extraInitializers), __runInitializers(this, _vendorGstPdf_initializers, void 0));
            this.vendor_status = (__runInitializers(this, _vendorGstPdf_extraInitializers), __runInitializers(this, _vendor_status_initializers, void 0));
            /**
             * Soft account deletion (DPDP). When set, portal access is blocked, products are hidden
             * from the public website, and login email/phone are released for re-registration.
             */
            this.accountDeletedAt = (__runInitializers(this, _vendor_status_extraInitializers), __runInitializers(this, _accountDeletedAt_initializers, void 0));
            /** Original login email preserved after soft deletion freed `vendor_email`. */
            this.deletedVendorEmail = (__runInitializers(this, _accountDeletedAt_extraInitializers), __runInitializers(this, _deletedVendorEmail_initializers, void 0));
            /** Original login phone preserved after soft deletion freed `vendor_phone`. */
            this.deletedVendorPhone = (__runInitializers(this, _deletedVendorEmail_extraInitializers), __runInitializers(this, _deletedVendorPhone_initializers, void 0));
            /** Headcount / scale band collected at vendor self-registration (e.g. "1-10", "11-50"). */
            this.companySize = (__runInitializers(this, _deletedVendorPhone_extraInitializers), __runInitializers(this, _companySize_initializers, void 0));
            this.manufacturerImage = (__runInitializers(this, _companySize_extraInitializers), __runInitializers(this, _manufacturerImage_initializers, void 0));
            /** Company logo image URL path (e.g. /uploads/manufacturers/...). */
            this.companyLogo = (__runInitializers(this, _manufacturerImage_extraInitializers), __runInitializers(this, _companyLogo_initializers, void 0));
            /** PAN card document scan, public URL path (separate from PAN id in vendorPan). */
            this.vendorPanDocument = (__runInitializers(this, _companyLogo_extraInitializers), __runInitializers(this, _vendorPanDocument_initializers, void 0));
            this.technicalContact = (__runInitializers(this, _vendorPanDocument_extraInitializers), __runInitializers(this, _technicalContact_initializers, void 0));
            this.marketingContact = (__runInitializers(this, _technicalContact_extraInitializers), __runInitializers(this, _marketingContact_initializers, void 0));
            this.createdAt = __runInitializers(this, _marketingContact_extraInitializers);
        }
        return Manufacturer_1;
    }());
    __setFunctionName(_classThis, "Manufacturer");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _manufacturerName_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _gpInternalId_decorators = [(0, mongoose_1.Prop)({ required: false, unique: true, sparse: true, default: undefined })];
        _manufacturerInitial_decorators = [(0, mongoose_1.Prop)({ required: false, default: undefined })];
        _manufacturerStatus_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _vendorPortalEmailVerified_decorators = [(0, mongoose_1.Prop)()];
        _vendor_name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendor_email_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _vendor_phone_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendor_website_decorators = [(0, mongoose_1.Prop)()];
        _vendor_facebook_decorators = [(0, mongoose_1.Prop)()];
        _vendor_youtube_decorators = [(0, mongoose_1.Prop)()];
        _vendor_twitter_decorators = [(0, mongoose_1.Prop)()];
        _vendor_linkedin_decorators = [(0, mongoose_1.Prop)()];
        _vendor_designation_decorators = [(0, mongoose_1.Prop)()];
        _vendor_gst_decorators = [(0, mongoose_1.Prop)()];
        _vendorPan_decorators = [(0, mongoose_1.Prop)()];
        _vendorGstPdf_decorators = [(0, mongoose_1.Prop)()];
        _vendor_status_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _accountDeletedAt_decorators = [(0, mongoose_1.Prop)()];
        _deletedVendorEmail_decorators = [(0, mongoose_1.Prop)()];
        _deletedVendorPhone_decorators = [(0, mongoose_1.Prop)()];
        _companySize_decorators = [(0, mongoose_1.Prop)()];
        _manufacturerImage_decorators = [(0, mongoose_1.Prop)()];
        _companyLogo_decorators = [(0, mongoose_1.Prop)()];
        _vendorPanDocument_decorators = [(0, mongoose_1.Prop)()];
        _technicalContact_decorators = [(0, mongoose_1.Prop)({ type: vendor_contact_slot_schema_1.VendorContactSlotSchema })];
        _marketingContact_decorators = [(0, mongoose_1.Prop)({ type: vendor_contact_slot_schema_1.VendorContactSlotSchema })];
        __esDecorate(null, null, _manufacturerName_decorators, { kind: "field", name: "manufacturerName", static: false, private: false, access: { has: function (obj) { return "manufacturerName" in obj; }, get: function (obj) { return obj.manufacturerName; }, set: function (obj, value) { obj.manufacturerName = value; } }, metadata: _metadata }, _manufacturerName_initializers, _manufacturerName_extraInitializers);
        __esDecorate(null, null, _gpInternalId_decorators, { kind: "field", name: "gpInternalId", static: false, private: false, access: { has: function (obj) { return "gpInternalId" in obj; }, get: function (obj) { return obj.gpInternalId; }, set: function (obj, value) { obj.gpInternalId = value; } }, metadata: _metadata }, _gpInternalId_initializers, _gpInternalId_extraInitializers);
        __esDecorate(null, null, _manufacturerInitial_decorators, { kind: "field", name: "manufacturerInitial", static: false, private: false, access: { has: function (obj) { return "manufacturerInitial" in obj; }, get: function (obj) { return obj.manufacturerInitial; }, set: function (obj, value) { obj.manufacturerInitial = value; } }, metadata: _metadata }, _manufacturerInitial_initializers, _manufacturerInitial_extraInitializers);
        __esDecorate(null, null, _manufacturerStatus_decorators, { kind: "field", name: "manufacturerStatus", static: false, private: false, access: { has: function (obj) { return "manufacturerStatus" in obj; }, get: function (obj) { return obj.manufacturerStatus; }, set: function (obj, value) { obj.manufacturerStatus = value; } }, metadata: _metadata }, _manufacturerStatus_initializers, _manufacturerStatus_extraInitializers);
        __esDecorate(null, null, _vendorPortalEmailVerified_decorators, { kind: "field", name: "vendorPortalEmailVerified", static: false, private: false, access: { has: function (obj) { return "vendorPortalEmailVerified" in obj; }, get: function (obj) { return obj.vendorPortalEmailVerified; }, set: function (obj, value) { obj.vendorPortalEmailVerified = value; } }, metadata: _metadata }, _vendorPortalEmailVerified_initializers, _vendorPortalEmailVerified_extraInitializers);
        __esDecorate(null, null, _vendor_name_decorators, { kind: "field", name: "vendor_name", static: false, private: false, access: { has: function (obj) { return "vendor_name" in obj; }, get: function (obj) { return obj.vendor_name; }, set: function (obj, value) { obj.vendor_name = value; } }, metadata: _metadata }, _vendor_name_initializers, _vendor_name_extraInitializers);
        __esDecorate(null, null, _vendor_email_decorators, { kind: "field", name: "vendor_email", static: false, private: false, access: { has: function (obj) { return "vendor_email" in obj; }, get: function (obj) { return obj.vendor_email; }, set: function (obj, value) { obj.vendor_email = value; } }, metadata: _metadata }, _vendor_email_initializers, _vendor_email_extraInitializers);
        __esDecorate(null, null, _vendor_phone_decorators, { kind: "field", name: "vendor_phone", static: false, private: false, access: { has: function (obj) { return "vendor_phone" in obj; }, get: function (obj) { return obj.vendor_phone; }, set: function (obj, value) { obj.vendor_phone = value; } }, metadata: _metadata }, _vendor_phone_initializers, _vendor_phone_extraInitializers);
        __esDecorate(null, null, _vendor_website_decorators, { kind: "field", name: "vendor_website", static: false, private: false, access: { has: function (obj) { return "vendor_website" in obj; }, get: function (obj) { return obj.vendor_website; }, set: function (obj, value) { obj.vendor_website = value; } }, metadata: _metadata }, _vendor_website_initializers, _vendor_website_extraInitializers);
        __esDecorate(null, null, _vendor_facebook_decorators, { kind: "field", name: "vendor_facebook", static: false, private: false, access: { has: function (obj) { return "vendor_facebook" in obj; }, get: function (obj) { return obj.vendor_facebook; }, set: function (obj, value) { obj.vendor_facebook = value; } }, metadata: _metadata }, _vendor_facebook_initializers, _vendor_facebook_extraInitializers);
        __esDecorate(null, null, _vendor_youtube_decorators, { kind: "field", name: "vendor_youtube", static: false, private: false, access: { has: function (obj) { return "vendor_youtube" in obj; }, get: function (obj) { return obj.vendor_youtube; }, set: function (obj, value) { obj.vendor_youtube = value; } }, metadata: _metadata }, _vendor_youtube_initializers, _vendor_youtube_extraInitializers);
        __esDecorate(null, null, _vendor_twitter_decorators, { kind: "field", name: "vendor_twitter", static: false, private: false, access: { has: function (obj) { return "vendor_twitter" in obj; }, get: function (obj) { return obj.vendor_twitter; }, set: function (obj, value) { obj.vendor_twitter = value; } }, metadata: _metadata }, _vendor_twitter_initializers, _vendor_twitter_extraInitializers);
        __esDecorate(null, null, _vendor_linkedin_decorators, { kind: "field", name: "vendor_linkedin", static: false, private: false, access: { has: function (obj) { return "vendor_linkedin" in obj; }, get: function (obj) { return obj.vendor_linkedin; }, set: function (obj, value) { obj.vendor_linkedin = value; } }, metadata: _metadata }, _vendor_linkedin_initializers, _vendor_linkedin_extraInitializers);
        __esDecorate(null, null, _vendor_designation_decorators, { kind: "field", name: "vendor_designation", static: false, private: false, access: { has: function (obj) { return "vendor_designation" in obj; }, get: function (obj) { return obj.vendor_designation; }, set: function (obj, value) { obj.vendor_designation = value; } }, metadata: _metadata }, _vendor_designation_initializers, _vendor_designation_extraInitializers);
        __esDecorate(null, null, _vendor_gst_decorators, { kind: "field", name: "vendor_gst", static: false, private: false, access: { has: function (obj) { return "vendor_gst" in obj; }, get: function (obj) { return obj.vendor_gst; }, set: function (obj, value) { obj.vendor_gst = value; } }, metadata: _metadata }, _vendor_gst_initializers, _vendor_gst_extraInitializers);
        __esDecorate(null, null, _vendorPan_decorators, { kind: "field", name: "vendorPan", static: false, private: false, access: { has: function (obj) { return "vendorPan" in obj; }, get: function (obj) { return obj.vendorPan; }, set: function (obj, value) { obj.vendorPan = value; } }, metadata: _metadata }, _vendorPan_initializers, _vendorPan_extraInitializers);
        __esDecorate(null, null, _vendorGstPdf_decorators, { kind: "field", name: "vendorGstPdf", static: false, private: false, access: { has: function (obj) { return "vendorGstPdf" in obj; }, get: function (obj) { return obj.vendorGstPdf; }, set: function (obj, value) { obj.vendorGstPdf = value; } }, metadata: _metadata }, _vendorGstPdf_initializers, _vendorGstPdf_extraInitializers);
        __esDecorate(null, null, _vendor_status_decorators, { kind: "field", name: "vendor_status", static: false, private: false, access: { has: function (obj) { return "vendor_status" in obj; }, get: function (obj) { return obj.vendor_status; }, set: function (obj, value) { obj.vendor_status = value; } }, metadata: _metadata }, _vendor_status_initializers, _vendor_status_extraInitializers);
        __esDecorate(null, null, _accountDeletedAt_decorators, { kind: "field", name: "accountDeletedAt", static: false, private: false, access: { has: function (obj) { return "accountDeletedAt" in obj; }, get: function (obj) { return obj.accountDeletedAt; }, set: function (obj, value) { obj.accountDeletedAt = value; } }, metadata: _metadata }, _accountDeletedAt_initializers, _accountDeletedAt_extraInitializers);
        __esDecorate(null, null, _deletedVendorEmail_decorators, { kind: "field", name: "deletedVendorEmail", static: false, private: false, access: { has: function (obj) { return "deletedVendorEmail" in obj; }, get: function (obj) { return obj.deletedVendorEmail; }, set: function (obj, value) { obj.deletedVendorEmail = value; } }, metadata: _metadata }, _deletedVendorEmail_initializers, _deletedVendorEmail_extraInitializers);
        __esDecorate(null, null, _deletedVendorPhone_decorators, { kind: "field", name: "deletedVendorPhone", static: false, private: false, access: { has: function (obj) { return "deletedVendorPhone" in obj; }, get: function (obj) { return obj.deletedVendorPhone; }, set: function (obj, value) { obj.deletedVendorPhone = value; } }, metadata: _metadata }, _deletedVendorPhone_initializers, _deletedVendorPhone_extraInitializers);
        __esDecorate(null, null, _companySize_decorators, { kind: "field", name: "companySize", static: false, private: false, access: { has: function (obj) { return "companySize" in obj; }, get: function (obj) { return obj.companySize; }, set: function (obj, value) { obj.companySize = value; } }, metadata: _metadata }, _companySize_initializers, _companySize_extraInitializers);
        __esDecorate(null, null, _manufacturerImage_decorators, { kind: "field", name: "manufacturerImage", static: false, private: false, access: { has: function (obj) { return "manufacturerImage" in obj; }, get: function (obj) { return obj.manufacturerImage; }, set: function (obj, value) { obj.manufacturerImage = value; } }, metadata: _metadata }, _manufacturerImage_initializers, _manufacturerImage_extraInitializers);
        __esDecorate(null, null, _companyLogo_decorators, { kind: "field", name: "companyLogo", static: false, private: false, access: { has: function (obj) { return "companyLogo" in obj; }, get: function (obj) { return obj.companyLogo; }, set: function (obj, value) { obj.companyLogo = value; } }, metadata: _metadata }, _companyLogo_initializers, _companyLogo_extraInitializers);
        __esDecorate(null, null, _vendorPanDocument_decorators, { kind: "field", name: "vendorPanDocument", static: false, private: false, access: { has: function (obj) { return "vendorPanDocument" in obj; }, get: function (obj) { return obj.vendorPanDocument; }, set: function (obj, value) { obj.vendorPanDocument = value; } }, metadata: _metadata }, _vendorPanDocument_initializers, _vendorPanDocument_extraInitializers);
        __esDecorate(null, null, _technicalContact_decorators, { kind: "field", name: "technicalContact", static: false, private: false, access: { has: function (obj) { return "technicalContact" in obj; }, get: function (obj) { return obj.technicalContact; }, set: function (obj, value) { obj.technicalContact = value; } }, metadata: _metadata }, _technicalContact_initializers, _technicalContact_extraInitializers);
        __esDecorate(null, null, _marketingContact_decorators, { kind: "field", name: "marketingContact", static: false, private: false, access: { has: function (obj) { return "marketingContact" in obj; }, get: function (obj) { return obj.marketingContact; }, set: function (obj, value) { obj.marketingContact = value; } }, metadata: _metadata }, _marketingContact_initializers, _marketingContact_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Manufacturer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Manufacturer = _classThis;
}();
exports.Manufacturer = Manufacturer;
exports.ManufacturerSchema = mongoose_1.SchemaFactory.createForClass(Manufacturer);
/** Admin dashboard vendor activity / pending approval aggregations */
exports.ManufacturerSchema.index({ manufacturerStatus: 1, vendor_status: 1, createdAt: -1 });
exports.ManufacturerSchema.index({ createdAt: -1 });
