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
exports.EventSchema = exports.Event = exports.EventBrochureItemSchema = exports.EventBrochureItem = exports.GALLERY_TYPES = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var gallery_schema_1 = require("../../gallery/schemas/gallery.schema");
Object.defineProperty(exports, "GALLERY_TYPES", { enumerable: true, get: function () { return gallery_schema_1.GALLERY_TYPES; } });
var EventBrochureItem = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _heading_decorators;
    var _heading_initializers = [];
    var _heading_extraInitializers = [];
    var _link_decorators;
    var _link_initializers = [];
    var _link_extraInitializers = [];
    var EventBrochureItem = _classThis = /** @class */ (function () {
        function EventBrochureItem_1() {
            this.heading = __runInitializers(this, _heading_initializers, void 0);
            this.link = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _link_initializers, void 0));
            __runInitializers(this, _link_extraInitializers);
        }
        return EventBrochureItem_1;
    }());
    __setFunctionName(_classThis, "EventBrochureItem");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _heading_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _link_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: function (obj) { return "heading" in obj; }, get: function (obj) { return obj.heading; }, set: function (obj, value) { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
        __esDecorate(null, null, _link_decorators, { kind: "field", name: "link", static: false, private: false, access: { has: function (obj) { return "link" in obj; }, get: function (obj) { return obj.link; }, set: function (obj, value) { obj.link = value; } }, metadata: _metadata }, _link_initializers, _link_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventBrochureItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventBrochureItem = _classThis;
}();
exports.EventBrochureItem = EventBrochureItem;
exports.EventBrochureItemSchema = mongoose_1.SchemaFactory.createForClass(EventBrochureItem);
var Event = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'events', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _eventId_decorators;
    var _eventId_initializers = [];
    var _eventId_extraInitializers = [];
    var _eventName_decorators;
    var _eventName_initializers = [];
    var _eventName_extraInitializers = [];
    var _eventImage_decorators;
    var _eventImage_initializers = [];
    var _eventImage_extraInitializers = [];
    var _event_image_decorators;
    var _event_image_initializers = [];
    var _event_image_extraInitializers = [];
    var _galleryImages_decorators;
    var _galleryImages_initializers = [];
    var _galleryImages_extraInitializers = [];
    var _galleryType_decorators;
    var _galleryType_initializers = [];
    var _galleryType_extraInitializers = [];
    var _eventDescription_decorators;
    var _eventDescription_initializers = [];
    var _eventDescription_extraInitializers = [];
    var _eventDate_decorators;
    var _eventDate_initializers = [];
    var _eventDate_extraInitializers = [];
    var _eventStartDate_decorators;
    var _eventStartDate_initializers = [];
    var _eventStartDate_extraInitializers = [];
    var _eventEndDate_decorators;
    var _eventEndDate_initializers = [];
    var _eventEndDate_extraInitializers = [];
    var _eventStartTime_decorators;
    var _eventStartTime_initializers = [];
    var _eventStartTime_extraInitializers = [];
    var _eventEndTime_decorators;
    var _eventEndTime_initializers = [];
    var _eventEndTime_extraInitializers = [];
    var _eventLocation_decorators;
    var _eventLocation_initializers = [];
    var _eventLocation_extraInitializers = [];
    var _contactPersonName_decorators;
    var _contactPersonName_initializers = [];
    var _contactPersonName_extraInitializers = [];
    var _contactPersonDesignation_decorators;
    var _contactPersonDesignation_initializers = [];
    var _contactPersonDesignation_extraInitializers = [];
    var _contactPersonEmail_decorators;
    var _contactPersonEmail_initializers = [];
    var _contactPersonEmail_extraInitializers = [];
    var _contactPersonPhone_decorators;
    var _contactPersonPhone_initializers = [];
    var _contactPersonPhone_extraInitializers = [];
    var _registrationLink_decorators;
    var _registrationLink_initializers = [];
    var _registrationLink_extraInitializers = [];
    var _brochureLink_decorators;
    var _brochureLink_initializers = [];
    var _brochureLink_extraInitializers = [];
    var _brochures_decorators;
    var _brochures_initializers = [];
    var _brochures_extraInitializers = [];
    var _eventStatus_decorators;
    var _eventStatus_initializers = [];
    var _eventStatus_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var Event = _classThis = /** @class */ (function () {
        function Event_1() {
            this.eventId = __runInitializers(this, _eventId_initializers, void 0);
            this.eventName = (__runInitializers(this, _eventId_extraInitializers), __runInitializers(this, _eventName_initializers, void 0));
            /** Local upload path (e.g. /uploads/events/xxx.png) or absolute URL */
            this.eventImage = (__runInitializers(this, _eventName_extraInitializers), __runInitializers(this, _eventImage_initializers, void 0));
            /** Relative path stored in DB (for example: events/file.png) */
            this.event_image = (__runInitializers(this, _eventImage_extraInitializers), __runInitializers(this, _event_image_initializers, void 0));
            /** Multiple gallery images (local upload paths or absolute URLs) */
            this.galleryImages = (__runInitializers(this, _event_image_extraInitializers), __runInitializers(this, _galleryImages_initializers, void 0));
            this.galleryType = (__runInitializers(this, _galleryImages_extraInitializers), __runInitializers(this, _galleryType_initializers, void 0));
            this.eventDescription = (__runInitializers(this, _galleryType_extraInitializers), __runInitializers(this, _eventDescription_initializers, void 0));
            this.eventDate = (__runInitializers(this, _eventDescription_extraInitializers), __runInitializers(this, _eventDate_initializers, void 0));
            /** Inclusive event start date (falls back to `eventDate` on legacy rows). */
            this.eventStartDate = (__runInitializers(this, _eventDate_extraInitializers), __runInitializers(this, _eventStartDate_initializers, void 0));
            /** Inclusive event end date (falls back to start/`eventDate` on legacy rows). */
            this.eventEndDate = (__runInitializers(this, _eventStartDate_extraInitializers), __runInitializers(this, _eventEndDate_initializers, void 0));
            this.eventStartTime = (__runInitializers(this, _eventEndDate_extraInitializers), __runInitializers(this, _eventStartTime_initializers, void 0));
            this.eventEndTime = (__runInitializers(this, _eventStartTime_extraInitializers), __runInitializers(this, _eventEndTime_initializers, void 0));
            this.eventLocation = (__runInitializers(this, _eventEndTime_extraInitializers), __runInitializers(this, _eventLocation_initializers, void 0));
            this.contactPersonName = (__runInitializers(this, _eventLocation_extraInitializers), __runInitializers(this, _contactPersonName_initializers, void 0));
            this.contactPersonDesignation = (__runInitializers(this, _contactPersonName_extraInitializers), __runInitializers(this, _contactPersonDesignation_initializers, void 0));
            this.contactPersonEmail = (__runInitializers(this, _contactPersonDesignation_extraInitializers), __runInitializers(this, _contactPersonEmail_initializers, void 0));
            this.contactPersonPhone = (__runInitializers(this, _contactPersonEmail_extraInitializers), __runInitializers(this, _contactPersonPhone_initializers, void 0));
            /** Optional external registration URL */
            this.registrationLink = (__runInitializers(this, _contactPersonPhone_extraInitializers), __runInitializers(this, _registrationLink_initializers, void 0));
            /** Optional brochure/attachment URL */
            this.brochureLink = (__runInitializers(this, _registrationLink_extraInitializers), __runInitializers(this, _brochureLink_initializers, void 0));
            /** Multiple brochure cards (heading + external link). */
            this.brochures = (__runInitializers(this, _brochureLink_extraInitializers), __runInitializers(this, _brochures_initializers, void 0));
            this.eventStatus = (__runInitializers(this, _brochures_extraInitializers), __runInitializers(this, _eventStatus_initializers, void 0)); // 0=Inactive, 1=Active
            this.createdDate = (__runInitializers(this, _eventStatus_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return Event_1;
    }());
    __setFunctionName(_classThis, "Event");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _eventId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _eventName_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _eventImage_decorators = [(0, mongoose_1.Prop)()];
        _event_image_decorators = [(0, mongoose_1.Prop)()];
        _galleryImages_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _galleryType_decorators = [(0, mongoose_1.Prop)({ enum: gallery_schema_1.ALL_GALLERY_TYPES, required: false })];
        _eventDescription_decorators = [(0, mongoose_1.Prop)()];
        _eventDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _eventStartDate_decorators = [(0, mongoose_1.Prop)()];
        _eventEndDate_decorators = [(0, mongoose_1.Prop)()];
        _eventStartTime_decorators = [(0, mongoose_1.Prop)()];
        _eventEndTime_decorators = [(0, mongoose_1.Prop)()];
        _eventLocation_decorators = [(0, mongoose_1.Prop)()];
        _contactPersonName_decorators = [(0, mongoose_1.Prop)()];
        _contactPersonDesignation_decorators = [(0, mongoose_1.Prop)()];
        _contactPersonEmail_decorators = [(0, mongoose_1.Prop)()];
        _contactPersonPhone_decorators = [(0, mongoose_1.Prop)()];
        _registrationLink_decorators = [(0, mongoose_1.Prop)()];
        _brochureLink_decorators = [(0, mongoose_1.Prop)()];
        _brochures_decorators = [(0, mongoose_1.Prop)({ type: [exports.EventBrochureItemSchema], default: [] })];
        _eventStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 1 })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _eventId_decorators, { kind: "field", name: "eventId", static: false, private: false, access: { has: function (obj) { return "eventId" in obj; }, get: function (obj) { return obj.eventId; }, set: function (obj, value) { obj.eventId = value; } }, metadata: _metadata }, _eventId_initializers, _eventId_extraInitializers);
        __esDecorate(null, null, _eventName_decorators, { kind: "field", name: "eventName", static: false, private: false, access: { has: function (obj) { return "eventName" in obj; }, get: function (obj) { return obj.eventName; }, set: function (obj, value) { obj.eventName = value; } }, metadata: _metadata }, _eventName_initializers, _eventName_extraInitializers);
        __esDecorate(null, null, _eventImage_decorators, { kind: "field", name: "eventImage", static: false, private: false, access: { has: function (obj) { return "eventImage" in obj; }, get: function (obj) { return obj.eventImage; }, set: function (obj, value) { obj.eventImage = value; } }, metadata: _metadata }, _eventImage_initializers, _eventImage_extraInitializers);
        __esDecorate(null, null, _event_image_decorators, { kind: "field", name: "event_image", static: false, private: false, access: { has: function (obj) { return "event_image" in obj; }, get: function (obj) { return obj.event_image; }, set: function (obj, value) { obj.event_image = value; } }, metadata: _metadata }, _event_image_initializers, _event_image_extraInitializers);
        __esDecorate(null, null, _galleryImages_decorators, { kind: "field", name: "galleryImages", static: false, private: false, access: { has: function (obj) { return "galleryImages" in obj; }, get: function (obj) { return obj.galleryImages; }, set: function (obj, value) { obj.galleryImages = value; } }, metadata: _metadata }, _galleryImages_initializers, _galleryImages_extraInitializers);
        __esDecorate(null, null, _galleryType_decorators, { kind: "field", name: "galleryType", static: false, private: false, access: { has: function (obj) { return "galleryType" in obj; }, get: function (obj) { return obj.galleryType; }, set: function (obj, value) { obj.galleryType = value; } }, metadata: _metadata }, _galleryType_initializers, _galleryType_extraInitializers);
        __esDecorate(null, null, _eventDescription_decorators, { kind: "field", name: "eventDescription", static: false, private: false, access: { has: function (obj) { return "eventDescription" in obj; }, get: function (obj) { return obj.eventDescription; }, set: function (obj, value) { obj.eventDescription = value; } }, metadata: _metadata }, _eventDescription_initializers, _eventDescription_extraInitializers);
        __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: function (obj) { return "eventDate" in obj; }, get: function (obj) { return obj.eventDate; }, set: function (obj, value) { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
        __esDecorate(null, null, _eventStartDate_decorators, { kind: "field", name: "eventStartDate", static: false, private: false, access: { has: function (obj) { return "eventStartDate" in obj; }, get: function (obj) { return obj.eventStartDate; }, set: function (obj, value) { obj.eventStartDate = value; } }, metadata: _metadata }, _eventStartDate_initializers, _eventStartDate_extraInitializers);
        __esDecorate(null, null, _eventEndDate_decorators, { kind: "field", name: "eventEndDate", static: false, private: false, access: { has: function (obj) { return "eventEndDate" in obj; }, get: function (obj) { return obj.eventEndDate; }, set: function (obj, value) { obj.eventEndDate = value; } }, metadata: _metadata }, _eventEndDate_initializers, _eventEndDate_extraInitializers);
        __esDecorate(null, null, _eventStartTime_decorators, { kind: "field", name: "eventStartTime", static: false, private: false, access: { has: function (obj) { return "eventStartTime" in obj; }, get: function (obj) { return obj.eventStartTime; }, set: function (obj, value) { obj.eventStartTime = value; } }, metadata: _metadata }, _eventStartTime_initializers, _eventStartTime_extraInitializers);
        __esDecorate(null, null, _eventEndTime_decorators, { kind: "field", name: "eventEndTime", static: false, private: false, access: { has: function (obj) { return "eventEndTime" in obj; }, get: function (obj) { return obj.eventEndTime; }, set: function (obj, value) { obj.eventEndTime = value; } }, metadata: _metadata }, _eventEndTime_initializers, _eventEndTime_extraInitializers);
        __esDecorate(null, null, _eventLocation_decorators, { kind: "field", name: "eventLocation", static: false, private: false, access: { has: function (obj) { return "eventLocation" in obj; }, get: function (obj) { return obj.eventLocation; }, set: function (obj, value) { obj.eventLocation = value; } }, metadata: _metadata }, _eventLocation_initializers, _eventLocation_extraInitializers);
        __esDecorate(null, null, _contactPersonName_decorators, { kind: "field", name: "contactPersonName", static: false, private: false, access: { has: function (obj) { return "contactPersonName" in obj; }, get: function (obj) { return obj.contactPersonName; }, set: function (obj, value) { obj.contactPersonName = value; } }, metadata: _metadata }, _contactPersonName_initializers, _contactPersonName_extraInitializers);
        __esDecorate(null, null, _contactPersonDesignation_decorators, { kind: "field", name: "contactPersonDesignation", static: false, private: false, access: { has: function (obj) { return "contactPersonDesignation" in obj; }, get: function (obj) { return obj.contactPersonDesignation; }, set: function (obj, value) { obj.contactPersonDesignation = value; } }, metadata: _metadata }, _contactPersonDesignation_initializers, _contactPersonDesignation_extraInitializers);
        __esDecorate(null, null, _contactPersonEmail_decorators, { kind: "field", name: "contactPersonEmail", static: false, private: false, access: { has: function (obj) { return "contactPersonEmail" in obj; }, get: function (obj) { return obj.contactPersonEmail; }, set: function (obj, value) { obj.contactPersonEmail = value; } }, metadata: _metadata }, _contactPersonEmail_initializers, _contactPersonEmail_extraInitializers);
        __esDecorate(null, null, _contactPersonPhone_decorators, { kind: "field", name: "contactPersonPhone", static: false, private: false, access: { has: function (obj) { return "contactPersonPhone" in obj; }, get: function (obj) { return obj.contactPersonPhone; }, set: function (obj, value) { obj.contactPersonPhone = value; } }, metadata: _metadata }, _contactPersonPhone_initializers, _contactPersonPhone_extraInitializers);
        __esDecorate(null, null, _registrationLink_decorators, { kind: "field", name: "registrationLink", static: false, private: false, access: { has: function (obj) { return "registrationLink" in obj; }, get: function (obj) { return obj.registrationLink; }, set: function (obj, value) { obj.registrationLink = value; } }, metadata: _metadata }, _registrationLink_initializers, _registrationLink_extraInitializers);
        __esDecorate(null, null, _brochureLink_decorators, { kind: "field", name: "brochureLink", static: false, private: false, access: { has: function (obj) { return "brochureLink" in obj; }, get: function (obj) { return obj.brochureLink; }, set: function (obj, value) { obj.brochureLink = value; } }, metadata: _metadata }, _brochureLink_initializers, _brochureLink_extraInitializers);
        __esDecorate(null, null, _brochures_decorators, { kind: "field", name: "brochures", static: false, private: false, access: { has: function (obj) { return "brochures" in obj; }, get: function (obj) { return obj.brochures; }, set: function (obj, value) { obj.brochures = value; } }, metadata: _metadata }, _brochures_initializers, _brochures_extraInitializers);
        __esDecorate(null, null, _eventStatus_decorators, { kind: "field", name: "eventStatus", static: false, private: false, access: { has: function (obj) { return "eventStatus" in obj; }, get: function (obj) { return obj.eventStatus; }, set: function (obj, value) { obj.eventStatus = value; } }, metadata: _metadata }, _eventStatus_initializers, _eventStatus_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Event = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Event = _classThis;
}();
exports.Event = Event;
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);
