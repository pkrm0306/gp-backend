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
exports.EventSchema = exports.Event = exports.EventKeyThemeItemSchema = exports.EventKeyThemeItem = exports.EventProgrammeAtAGlanceItemSchema = exports.EventProgrammeAtAGlanceItem = exports.EventBrochureItemSchema = exports.EventBrochureItem = exports.EVENT_MAX_IMAGES = exports.GALLERY_TYPES = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const gallery_schema_1 = require("../../gallery/schemas/gallery.schema");
Object.defineProperty(exports, "GALLERY_TYPES", { enumerable: true, get: function () { return gallery_schema_1.GALLERY_TYPES; } });
/** Max gallery images allowed on event create/edit (same cap as articles/gallery). */
exports.EVENT_MAX_IMAGES = 10;
let EventBrochureItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _heading_decorators;
    let _heading_initializers = [];
    let _heading_extraInitializers = [];
    let _link_decorators;
    let _link_initializers = [];
    let _link_extraInitializers = [];
    var EventBrochureItem = _classThis = class {
        constructor() {
            this.heading = __runInitializers(this, _heading_initializers, void 0);
            this.link = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _link_initializers, void 0));
            __runInitializers(this, _link_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EventBrochureItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _heading_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _link_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: obj => "heading" in obj, get: obj => obj.heading, set: (obj, value) => { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
        __esDecorate(null, null, _link_decorators, { kind: "field", name: "link", static: false, private: false, access: { has: obj => "link" in obj, get: obj => obj.link, set: (obj, value) => { obj.link = value; } }, metadata: _metadata }, _link_initializers, _link_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventBrochureItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventBrochureItem = _classThis;
})();
exports.EventBrochureItem = EventBrochureItem;
exports.EventBrochureItemSchema = mongoose_1.SchemaFactory.createForClass(EventBrochureItem);
let EventProgrammeAtAGlanceItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _day_decorators;
    let _day_initializers = [];
    let _day_extraInitializers = [];
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _time_decorators;
    let _time_initializers = [];
    let _time_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    var EventProgrammeAtAGlanceItem = _classThis = class {
        constructor() {
            /** 1-based day index within the event date range. */
            this.day = __runInitializers(this, _day_initializers, void 0);
            /** Optional ISO date (YYYY-MM-DD) for the programme day. */
            this.date = (__runInitializers(this, _day_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.time = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _time_initializers, void 0));
            this.description = (__runInitializers(this, _time_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            __runInitializers(this, _description_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EventProgrammeAtAGlanceItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _day_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, min: 1 })];
        _date_decorators = [(0, mongoose_1.Prop)({ required: false, trim: true })];
        _time_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        __esDecorate(null, null, _day_decorators, { kind: "field", name: "day", static: false, private: false, access: { has: obj => "day" in obj, get: obj => obj.day, set: (obj, value) => { obj.day = value; } }, metadata: _metadata }, _day_initializers, _day_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _time_decorators, { kind: "field", name: "time", static: false, private: false, access: { has: obj => "time" in obj, get: obj => obj.time, set: (obj, value) => { obj.time = value; } }, metadata: _metadata }, _time_initializers, _time_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventProgrammeAtAGlanceItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventProgrammeAtAGlanceItem = _classThis;
})();
exports.EventProgrammeAtAGlanceItem = EventProgrammeAtAGlanceItem;
exports.EventProgrammeAtAGlanceItemSchema = mongoose_1.SchemaFactory.createForClass(EventProgrammeAtAGlanceItem);
let EventKeyThemeItem = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ _id: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _heading_decorators;
    let _heading_initializers = [];
    let _heading_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    var EventKeyThemeItem = _classThis = class {
        constructor() {
            this.heading = __runInitializers(this, _heading_initializers, void 0);
            this.description = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            __runInitializers(this, _description_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EventKeyThemeItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _heading_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ required: true, trim: true })];
        __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: obj => "heading" in obj, get: obj => obj.heading, set: (obj, value) => { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventKeyThemeItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventKeyThemeItem = _classThis;
})();
exports.EventKeyThemeItem = EventKeyThemeItem;
exports.EventKeyThemeItemSchema = mongoose_1.SchemaFactory.createForClass(EventKeyThemeItem);
let Event = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ collection: 'events', timestamps: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _eventId_decorators;
    let _eventId_initializers = [];
    let _eventId_extraInitializers = [];
    let _eventName_decorators;
    let _eventName_initializers = [];
    let _eventName_extraInitializers = [];
    let _eventImage_decorators;
    let _eventImage_initializers = [];
    let _eventImage_extraInitializers = [];
    let _event_image_decorators;
    let _event_image_initializers = [];
    let _event_image_extraInitializers = [];
    let _galleryImages_decorators;
    let _galleryImages_initializers = [];
    let _galleryImages_extraInitializers = [];
    let _galleryType_decorators;
    let _galleryType_initializers = [];
    let _galleryType_extraInitializers = [];
    let _eventDescription_decorators;
    let _eventDescription_initializers = [];
    let _eventDescription_extraInitializers = [];
    let _eventDate_decorators;
    let _eventDate_initializers = [];
    let _eventDate_extraInitializers = [];
    let _eventStartDate_decorators;
    let _eventStartDate_initializers = [];
    let _eventStartDate_extraInitializers = [];
    let _eventEndDate_decorators;
    let _eventEndDate_initializers = [];
    let _eventEndDate_extraInitializers = [];
    let _eventStartTime_decorators;
    let _eventStartTime_initializers = [];
    let _eventStartTime_extraInitializers = [];
    let _eventEndTime_decorators;
    let _eventEndTime_initializers = [];
    let _eventEndTime_extraInitializers = [];
    let _eventLocation_decorators;
    let _eventLocation_initializers = [];
    let _eventLocation_extraInitializers = [];
    let _contactPersonName_decorators;
    let _contactPersonName_initializers = [];
    let _contactPersonName_extraInitializers = [];
    let _contactPersonDesignation_decorators;
    let _contactPersonDesignation_initializers = [];
    let _contactPersonDesignation_extraInitializers = [];
    let _contactPersonEmail_decorators;
    let _contactPersonEmail_initializers = [];
    let _contactPersonEmail_extraInitializers = [];
    let _contactPersonPhone_decorators;
    let _contactPersonPhone_initializers = [];
    let _contactPersonPhone_extraInitializers = [];
    let _registrationLink_decorators;
    let _registrationLink_initializers = [];
    let _registrationLink_extraInitializers = [];
    let _brochureLink_decorators;
    let _brochureLink_initializers = [];
    let _brochureLink_extraInitializers = [];
    let _brochures_decorators;
    let _brochures_initializers = [];
    let _brochures_extraInitializers = [];
    let _whoShouldAttend_decorators;
    let _whoShouldAttend_initializers = [];
    let _whoShouldAttend_extraInitializers = [];
    let _keyThemes_decorators;
    let _keyThemes_initializers = [];
    let _keyThemes_extraInitializers = [];
    let _programmeAtAGlance_decorators;
    let _programmeAtAGlance_initializers = [];
    let _programmeAtAGlance_extraInitializers = [];
    let _venueAndTravel_decorators;
    let _venueAndTravel_initializers = [];
    let _venueAndTravel_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _eventStatus_decorators;
    let _eventStatus_initializers = [];
    let _eventStatus_extraInitializers = [];
    let _isDeleted_decorators;
    let _isDeleted_initializers = [];
    let _isDeleted_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _createdDate_decorators;
    let _createdDate_initializers = [];
    let _createdDate_extraInitializers = [];
    let _updatedDate_decorators;
    let _updatedDate_initializers = [];
    let _updatedDate_extraInitializers = [];
    var Event = _classThis = class {
        constructor() {
            /** Unique among non–soft-deleted rows (see partial index below). */
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
            /** Audience bullets for the public "Who should attend" section. */
            this.whoShouldAttend = (__runInitializers(this, _brochures_extraInitializers), __runInitializers(this, _whoShouldAttend_initializers, void 0));
            /** Key themes for the public event detail page (heading + description). */
            this.keyThemes = (__runInitializers(this, _whoShouldAttend_extraInitializers), __runInitializers(this, _keyThemes_initializers, void 0));
            /**
             * "Programme at a glance" slots (time + description), optionally tagged with `day`
             * (and `date`) so multi-day events can store any number of rows per day.
             */
            this.programmeAtAGlance = (__runInitializers(this, _keyThemes_extraInitializers), __runInitializers(this, _programmeAtAGlance_initializers, void 0));
            /** Venue / travel notes for the public event detail page. */
            this.venueAndTravel = (__runInitializers(this, _programmeAtAGlance_extraInitializers), __runInitializers(this, _venueAndTravel_initializers, void 0));
            /** Tag pills shown on the public event detail page. */
            this.tags = (__runInitializers(this, _venueAndTravel_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.eventStatus = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _eventStatus_initializers, void 0)); // 0=Inactive, 1=Active
            this.isDeleted = (__runInitializers(this, _eventStatus_extraInitializers), __runInitializers(this, _isDeleted_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _isDeleted_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.createdDate = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Event");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _eventId_decorators = [(0, mongoose_1.Prop)({ required: true })];
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
        _whoShouldAttend_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _keyThemes_decorators = [(0, mongoose_1.Prop)({ type: [exports.EventKeyThemeItemSchema], default: [] })];
        _programmeAtAGlance_decorators = [(0, mongoose_1.Prop)({ type: [exports.EventProgrammeAtAGlanceItemSchema], default: [] })];
        _venueAndTravel_decorators = [(0, mongoose_1.Prop)({ default: '', trim: true })];
        _tags_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _eventStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 1 })];
        _isDeleted_decorators = [(0, mongoose_1.Prop)({ type: Boolean, default: false, index: true })];
        _deletedAt_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _eventId_decorators, { kind: "field", name: "eventId", static: false, private: false, access: { has: obj => "eventId" in obj, get: obj => obj.eventId, set: (obj, value) => { obj.eventId = value; } }, metadata: _metadata }, _eventId_initializers, _eventId_extraInitializers);
        __esDecorate(null, null, _eventName_decorators, { kind: "field", name: "eventName", static: false, private: false, access: { has: obj => "eventName" in obj, get: obj => obj.eventName, set: (obj, value) => { obj.eventName = value; } }, metadata: _metadata }, _eventName_initializers, _eventName_extraInitializers);
        __esDecorate(null, null, _eventImage_decorators, { kind: "field", name: "eventImage", static: false, private: false, access: { has: obj => "eventImage" in obj, get: obj => obj.eventImage, set: (obj, value) => { obj.eventImage = value; } }, metadata: _metadata }, _eventImage_initializers, _eventImage_extraInitializers);
        __esDecorate(null, null, _event_image_decorators, { kind: "field", name: "event_image", static: false, private: false, access: { has: obj => "event_image" in obj, get: obj => obj.event_image, set: (obj, value) => { obj.event_image = value; } }, metadata: _metadata }, _event_image_initializers, _event_image_extraInitializers);
        __esDecorate(null, null, _galleryImages_decorators, { kind: "field", name: "galleryImages", static: false, private: false, access: { has: obj => "galleryImages" in obj, get: obj => obj.galleryImages, set: (obj, value) => { obj.galleryImages = value; } }, metadata: _metadata }, _galleryImages_initializers, _galleryImages_extraInitializers);
        __esDecorate(null, null, _galleryType_decorators, { kind: "field", name: "galleryType", static: false, private: false, access: { has: obj => "galleryType" in obj, get: obj => obj.galleryType, set: (obj, value) => { obj.galleryType = value; } }, metadata: _metadata }, _galleryType_initializers, _galleryType_extraInitializers);
        __esDecorate(null, null, _eventDescription_decorators, { kind: "field", name: "eventDescription", static: false, private: false, access: { has: obj => "eventDescription" in obj, get: obj => obj.eventDescription, set: (obj, value) => { obj.eventDescription = value; } }, metadata: _metadata }, _eventDescription_initializers, _eventDescription_extraInitializers);
        __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: obj => "eventDate" in obj, get: obj => obj.eventDate, set: (obj, value) => { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
        __esDecorate(null, null, _eventStartDate_decorators, { kind: "field", name: "eventStartDate", static: false, private: false, access: { has: obj => "eventStartDate" in obj, get: obj => obj.eventStartDate, set: (obj, value) => { obj.eventStartDate = value; } }, metadata: _metadata }, _eventStartDate_initializers, _eventStartDate_extraInitializers);
        __esDecorate(null, null, _eventEndDate_decorators, { kind: "field", name: "eventEndDate", static: false, private: false, access: { has: obj => "eventEndDate" in obj, get: obj => obj.eventEndDate, set: (obj, value) => { obj.eventEndDate = value; } }, metadata: _metadata }, _eventEndDate_initializers, _eventEndDate_extraInitializers);
        __esDecorate(null, null, _eventStartTime_decorators, { kind: "field", name: "eventStartTime", static: false, private: false, access: { has: obj => "eventStartTime" in obj, get: obj => obj.eventStartTime, set: (obj, value) => { obj.eventStartTime = value; } }, metadata: _metadata }, _eventStartTime_initializers, _eventStartTime_extraInitializers);
        __esDecorate(null, null, _eventEndTime_decorators, { kind: "field", name: "eventEndTime", static: false, private: false, access: { has: obj => "eventEndTime" in obj, get: obj => obj.eventEndTime, set: (obj, value) => { obj.eventEndTime = value; } }, metadata: _metadata }, _eventEndTime_initializers, _eventEndTime_extraInitializers);
        __esDecorate(null, null, _eventLocation_decorators, { kind: "field", name: "eventLocation", static: false, private: false, access: { has: obj => "eventLocation" in obj, get: obj => obj.eventLocation, set: (obj, value) => { obj.eventLocation = value; } }, metadata: _metadata }, _eventLocation_initializers, _eventLocation_extraInitializers);
        __esDecorate(null, null, _contactPersonName_decorators, { kind: "field", name: "contactPersonName", static: false, private: false, access: { has: obj => "contactPersonName" in obj, get: obj => obj.contactPersonName, set: (obj, value) => { obj.contactPersonName = value; } }, metadata: _metadata }, _contactPersonName_initializers, _contactPersonName_extraInitializers);
        __esDecorate(null, null, _contactPersonDesignation_decorators, { kind: "field", name: "contactPersonDesignation", static: false, private: false, access: { has: obj => "contactPersonDesignation" in obj, get: obj => obj.contactPersonDesignation, set: (obj, value) => { obj.contactPersonDesignation = value; } }, metadata: _metadata }, _contactPersonDesignation_initializers, _contactPersonDesignation_extraInitializers);
        __esDecorate(null, null, _contactPersonEmail_decorators, { kind: "field", name: "contactPersonEmail", static: false, private: false, access: { has: obj => "contactPersonEmail" in obj, get: obj => obj.contactPersonEmail, set: (obj, value) => { obj.contactPersonEmail = value; } }, metadata: _metadata }, _contactPersonEmail_initializers, _contactPersonEmail_extraInitializers);
        __esDecorate(null, null, _contactPersonPhone_decorators, { kind: "field", name: "contactPersonPhone", static: false, private: false, access: { has: obj => "contactPersonPhone" in obj, get: obj => obj.contactPersonPhone, set: (obj, value) => { obj.contactPersonPhone = value; } }, metadata: _metadata }, _contactPersonPhone_initializers, _contactPersonPhone_extraInitializers);
        __esDecorate(null, null, _registrationLink_decorators, { kind: "field", name: "registrationLink", static: false, private: false, access: { has: obj => "registrationLink" in obj, get: obj => obj.registrationLink, set: (obj, value) => { obj.registrationLink = value; } }, metadata: _metadata }, _registrationLink_initializers, _registrationLink_extraInitializers);
        __esDecorate(null, null, _brochureLink_decorators, { kind: "field", name: "brochureLink", static: false, private: false, access: { has: obj => "brochureLink" in obj, get: obj => obj.brochureLink, set: (obj, value) => { obj.brochureLink = value; } }, metadata: _metadata }, _brochureLink_initializers, _brochureLink_extraInitializers);
        __esDecorate(null, null, _brochures_decorators, { kind: "field", name: "brochures", static: false, private: false, access: { has: obj => "brochures" in obj, get: obj => obj.brochures, set: (obj, value) => { obj.brochures = value; } }, metadata: _metadata }, _brochures_initializers, _brochures_extraInitializers);
        __esDecorate(null, null, _whoShouldAttend_decorators, { kind: "field", name: "whoShouldAttend", static: false, private: false, access: { has: obj => "whoShouldAttend" in obj, get: obj => obj.whoShouldAttend, set: (obj, value) => { obj.whoShouldAttend = value; } }, metadata: _metadata }, _whoShouldAttend_initializers, _whoShouldAttend_extraInitializers);
        __esDecorate(null, null, _keyThemes_decorators, { kind: "field", name: "keyThemes", static: false, private: false, access: { has: obj => "keyThemes" in obj, get: obj => obj.keyThemes, set: (obj, value) => { obj.keyThemes = value; } }, metadata: _metadata }, _keyThemes_initializers, _keyThemes_extraInitializers);
        __esDecorate(null, null, _programmeAtAGlance_decorators, { kind: "field", name: "programmeAtAGlance", static: false, private: false, access: { has: obj => "programmeAtAGlance" in obj, get: obj => obj.programmeAtAGlance, set: (obj, value) => { obj.programmeAtAGlance = value; } }, metadata: _metadata }, _programmeAtAGlance_initializers, _programmeAtAGlance_extraInitializers);
        __esDecorate(null, null, _venueAndTravel_decorators, { kind: "field", name: "venueAndTravel", static: false, private: false, access: { has: obj => "venueAndTravel" in obj, get: obj => obj.venueAndTravel, set: (obj, value) => { obj.venueAndTravel = value; } }, metadata: _metadata }, _venueAndTravel_initializers, _venueAndTravel_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _eventStatus_decorators, { kind: "field", name: "eventStatus", static: false, private: false, access: { has: obj => "eventStatus" in obj, get: obj => obj.eventStatus, set: (obj, value) => { obj.eventStatus = value; } }, metadata: _metadata }, _eventStatus_initializers, _eventStatus_extraInitializers);
        __esDecorate(null, null, _isDeleted_decorators, { kind: "field", name: "isDeleted", static: false, private: false, access: { has: obj => "isDeleted" in obj, get: obj => obj.isDeleted, set: (obj, value) => { obj.isDeleted = value; } }, metadata: _metadata }, _isDeleted_initializers, _isDeleted_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: obj => "createdDate" in obj, get: obj => obj.createdDate, set: (obj, value) => { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: obj => "updatedDate" in obj, get: obj => obj.updatedDate, set: (obj, value) => { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Event = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Event = _classThis;
})();
exports.Event = Event;
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);
exports.EventSchema.index({ eventId: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
exports.EventSchema.index({ deletedAt: 1 });
