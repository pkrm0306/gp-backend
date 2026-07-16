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
exports.CreateEventDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var event_brochure_item_dto_1 = require("./event-brochure-item.dto");
var CreateEventDto = function () {
    var _a;
    var _eventName_decorators;
    var _eventName_initializers = [];
    var _eventName_extraInitializers = [];
    var _eventStartDate_decorators;
    var _eventStartDate_initializers = [];
    var _eventStartDate_extraInitializers = [];
    var _eventEndDate_decorators;
    var _eventEndDate_initializers = [];
    var _eventEndDate_extraInitializers = [];
    var _eventDate_decorators;
    var _eventDate_initializers = [];
    var _eventDate_extraInitializers = [];
    var _eventStartTime_decorators;
    var _eventStartTime_initializers = [];
    var _eventStartTime_extraInitializers = [];
    var _eventEndTime_decorators;
    var _eventEndTime_initializers = [];
    var _eventEndTime_extraInitializers = [];
    var _eventLocation_decorators;
    var _eventLocation_initializers = [];
    var _eventLocation_extraInitializers = [];
    var _eventDescription_decorators;
    var _eventDescription_initializers = [];
    var _eventDescription_extraInitializers = [];
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
    return _a = /** @class */ (function () {
            function CreateEventDto() {
                this.eventName = __runInitializers(this, _eventName_initializers, void 0);
                this.eventStartDate = (__runInitializers(this, _eventName_extraInitializers), __runInitializers(this, _eventStartDate_initializers, void 0));
                this.eventEndDate = (__runInitializers(this, _eventStartDate_extraInitializers), __runInitializers(this, _eventEndDate_initializers, void 0));
                this.eventDate = (__runInitializers(this, _eventEndDate_extraInitializers), __runInitializers(this, _eventDate_initializers, void 0));
                this.eventStartTime = (__runInitializers(this, _eventDate_extraInitializers), __runInitializers(this, _eventStartTime_initializers, void 0));
                this.eventEndTime = (__runInitializers(this, _eventStartTime_extraInitializers), __runInitializers(this, _eventEndTime_initializers, void 0));
                this.eventLocation = (__runInitializers(this, _eventEndTime_extraInitializers), __runInitializers(this, _eventLocation_initializers, void 0));
                this.eventDescription = (__runInitializers(this, _eventLocation_extraInitializers), __runInitializers(this, _eventDescription_initializers, void 0));
                this.contactPersonName = (__runInitializers(this, _eventDescription_extraInitializers), __runInitializers(this, _contactPersonName_initializers, void 0));
                this.contactPersonDesignation = (__runInitializers(this, _contactPersonName_extraInitializers), __runInitializers(this, _contactPersonDesignation_initializers, void 0));
                this.contactPersonEmail = (__runInitializers(this, _contactPersonDesignation_extraInitializers), __runInitializers(this, _contactPersonEmail_initializers, void 0));
                this.contactPersonPhone = (__runInitializers(this, _contactPersonEmail_extraInitializers), __runInitializers(this, _contactPersonPhone_initializers, void 0));
                this.registrationLink = (__runInitializers(this, _contactPersonPhone_extraInitializers), __runInitializers(this, _registrationLink_initializers, void 0));
                this.brochureLink = (__runInitializers(this, _registrationLink_extraInitializers), __runInitializers(this, _brochureLink_initializers, void 0));
                this.brochures = (__runInitializers(this, _brochureLink_extraInitializers), __runInitializers(this, _brochures_initializers, void 0));
                __runInitializers(this, _brochures_extraInitializers);
            }
            return CreateEventDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _eventName_decorators = [(0, swagger_1.ApiProperty)({ example: 'Green Summit 2026' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                }), (0, class_validator_1.Length)(2, 120)];
            _eventStartDate_decorators = [(0, swagger_1.ApiProperty)({
                    example: '2026-04-08',
                    description: 'Event start date (ISO YYYY-MM-DD or DD-MM-YYYY).',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _eventEndDate_decorators = [(0, swagger_1.ApiProperty)({
                    example: '2026-04-10',
                    description: 'Event end date (ISO YYYY-MM-DD or DD-MM-YYYY).',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return String(value !== null && value !== void 0 ? value : '').trim();
                })];
            _eventDate_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: '2026-04-08',
                    description: 'Legacy alias of eventStartDate.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _eventStartTime_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '10:00 AM' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _eventEndTime_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '05:00 PM' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _eventLocation_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Chennai' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _eventDescription_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '<p>Eco-labelled products summit</p>' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _contactPersonName_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Priya' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _contactPersonDesignation_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Manager' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _contactPersonEmail_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'priya@example.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null
                        ? undefined
                        : String(value).trim().toLowerCase();
                })];
            _contactPersonPhone_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '9876543210' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _registrationLink_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'https://cam.mycii.in/OR/OnlineRegistrationLogin.html?EventId=E000069218',
                    description: 'External registration link for the event',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _brochureLink_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'https://www.linkedin.com/posts/cii-greenpro-ecolabelling_greenpro-summit-2025-brochure-03062025-activity-7335663123154014208-2ScV',
                    description: 'Legacy single brochure link (prefer brochures[]).',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === undefined || value === null ? undefined : String(value).trim();
                })];
            _brochures_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Brochure cards for the event. Each item requires heading and link. ' +
                        'Multipart forms may send this as a JSON string.',
                    type: [event_brochure_item_dto_1.EventBrochureItemDto],
                    example: [
                        {
                            heading: 'GreenPro Summit Brochure',
                            link: 'https://example.com/brochure.pdf',
                        },
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return event_brochure_item_dto_1.EventBrochureItemDto; })];
            __esDecorate(null, null, _eventName_decorators, { kind: "field", name: "eventName", static: false, private: false, access: { has: function (obj) { return "eventName" in obj; }, get: function (obj) { return obj.eventName; }, set: function (obj, value) { obj.eventName = value; } }, metadata: _metadata }, _eventName_initializers, _eventName_extraInitializers);
            __esDecorate(null, null, _eventStartDate_decorators, { kind: "field", name: "eventStartDate", static: false, private: false, access: { has: function (obj) { return "eventStartDate" in obj; }, get: function (obj) { return obj.eventStartDate; }, set: function (obj, value) { obj.eventStartDate = value; } }, metadata: _metadata }, _eventStartDate_initializers, _eventStartDate_extraInitializers);
            __esDecorate(null, null, _eventEndDate_decorators, { kind: "field", name: "eventEndDate", static: false, private: false, access: { has: function (obj) { return "eventEndDate" in obj; }, get: function (obj) { return obj.eventEndDate; }, set: function (obj, value) { obj.eventEndDate = value; } }, metadata: _metadata }, _eventEndDate_initializers, _eventEndDate_extraInitializers);
            __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: function (obj) { return "eventDate" in obj; }, get: function (obj) { return obj.eventDate; }, set: function (obj, value) { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
            __esDecorate(null, null, _eventStartTime_decorators, { kind: "field", name: "eventStartTime", static: false, private: false, access: { has: function (obj) { return "eventStartTime" in obj; }, get: function (obj) { return obj.eventStartTime; }, set: function (obj, value) { obj.eventStartTime = value; } }, metadata: _metadata }, _eventStartTime_initializers, _eventStartTime_extraInitializers);
            __esDecorate(null, null, _eventEndTime_decorators, { kind: "field", name: "eventEndTime", static: false, private: false, access: { has: function (obj) { return "eventEndTime" in obj; }, get: function (obj) { return obj.eventEndTime; }, set: function (obj, value) { obj.eventEndTime = value; } }, metadata: _metadata }, _eventEndTime_initializers, _eventEndTime_extraInitializers);
            __esDecorate(null, null, _eventLocation_decorators, { kind: "field", name: "eventLocation", static: false, private: false, access: { has: function (obj) { return "eventLocation" in obj; }, get: function (obj) { return obj.eventLocation; }, set: function (obj, value) { obj.eventLocation = value; } }, metadata: _metadata }, _eventLocation_initializers, _eventLocation_extraInitializers);
            __esDecorate(null, null, _eventDescription_decorators, { kind: "field", name: "eventDescription", static: false, private: false, access: { has: function (obj) { return "eventDescription" in obj; }, get: function (obj) { return obj.eventDescription; }, set: function (obj, value) { obj.eventDescription = value; } }, metadata: _metadata }, _eventDescription_initializers, _eventDescription_extraInitializers);
            __esDecorate(null, null, _contactPersonName_decorators, { kind: "field", name: "contactPersonName", static: false, private: false, access: { has: function (obj) { return "contactPersonName" in obj; }, get: function (obj) { return obj.contactPersonName; }, set: function (obj, value) { obj.contactPersonName = value; } }, metadata: _metadata }, _contactPersonName_initializers, _contactPersonName_extraInitializers);
            __esDecorate(null, null, _contactPersonDesignation_decorators, { kind: "field", name: "contactPersonDesignation", static: false, private: false, access: { has: function (obj) { return "contactPersonDesignation" in obj; }, get: function (obj) { return obj.contactPersonDesignation; }, set: function (obj, value) { obj.contactPersonDesignation = value; } }, metadata: _metadata }, _contactPersonDesignation_initializers, _contactPersonDesignation_extraInitializers);
            __esDecorate(null, null, _contactPersonEmail_decorators, { kind: "field", name: "contactPersonEmail", static: false, private: false, access: { has: function (obj) { return "contactPersonEmail" in obj; }, get: function (obj) { return obj.contactPersonEmail; }, set: function (obj, value) { obj.contactPersonEmail = value; } }, metadata: _metadata }, _contactPersonEmail_initializers, _contactPersonEmail_extraInitializers);
            __esDecorate(null, null, _contactPersonPhone_decorators, { kind: "field", name: "contactPersonPhone", static: false, private: false, access: { has: function (obj) { return "contactPersonPhone" in obj; }, get: function (obj) { return obj.contactPersonPhone; }, set: function (obj, value) { obj.contactPersonPhone = value; } }, metadata: _metadata }, _contactPersonPhone_initializers, _contactPersonPhone_extraInitializers);
            __esDecorate(null, null, _registrationLink_decorators, { kind: "field", name: "registrationLink", static: false, private: false, access: { has: function (obj) { return "registrationLink" in obj; }, get: function (obj) { return obj.registrationLink; }, set: function (obj, value) { obj.registrationLink = value; } }, metadata: _metadata }, _registrationLink_initializers, _registrationLink_extraInitializers);
            __esDecorate(null, null, _brochureLink_decorators, { kind: "field", name: "brochureLink", static: false, private: false, access: { has: function (obj) { return "brochureLink" in obj; }, get: function (obj) { return obj.brochureLink; }, set: function (obj, value) { obj.brochureLink = value; } }, metadata: _metadata }, _brochureLink_initializers, _brochureLink_extraInitializers);
            __esDecorate(null, null, _brochures_decorators, { kind: "field", name: "brochures", static: false, private: false, access: { has: function (obj) { return "brochures" in obj; }, get: function (obj) { return obj.brochures; }, set: function (obj, value) { obj.brochures = value; } }, metadata: _metadata }, _brochures_initializers, _brochures_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateEventDto = CreateEventDto;
