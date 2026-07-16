"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var testing_1 = require("@nestjs/testing");
var mongoose_2 = require("mongoose");
var admin_service_1 = require("./admin.service");
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var vendor_user_schema_1 = require("../vendor-users/schemas/vendor-user.schema");
var banner_schema_1 = require("../banners/schemas/banner.schema");
var event_schema_1 = require("../events/schemas/event.schema");
var event_id_counter_schema_1 = require("../events/schemas/event-id-counter.schema");
var newsletter_subscriber_schema_1 = require("../website/schemas/newsletter-subscriber.schema");
var contact_message_schema_1 = require("../website/schemas/contact-message.schema");
var contact_reply_thread_schema_1 = require("./schemas/contact-reply-thread.schema");
var notification_schema_1 = require("../common/schemas/notification.schema");
var article_schema_1 = require("../articles/schemas/article.schema");
var email_service_1 = require("../common/services/email.service");
var rbac_service_1 = require("../rbac/rbac.service");
var admin_system_notification_service_1 = require("../notifications/helpers/admin-system-notification.service");
function queryMock(result) {
    return {
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(result),
    };
}
describe('AdminService Event Functionality', function () {
    var service;
    var eventModel = jest.fn();
    eventModel.find = jest.fn();
    eventModel.findById = jest.fn();
    eventModel.findByIdAndUpdate = jest.fn();
    eventModel.findOne = jest.fn();
    eventModel.findOneAndUpdate = jest.fn();
    eventModel.deleteOne = jest.fn();
    var eventCounterModel = {
        findOneAndUpdate: jest.fn(),
    };
    var notificationModel = {
        create: jest.fn(),
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    eventModel.mockImplementation(function (doc) { return ({
                        save: jest.fn().mockResolvedValue({
                            toObject: function () { return (__assign({ _id: new mongoose_2.Types.ObjectId() }, doc)); },
                        }),
                    }); });
                    eventCounterModel.findOneAndUpdate.mockReturnValue(queryMock({
                        seq: 9,
                    }));
                    notificationModel.create.mockResolvedValue(undefined);
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                admin_service_1.AdminService,
                                { provide: (0, mongoose_1.getModelToken)(manufacturer_schema_1.Manufacturer.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(vendor_user_schema_1.VendorUser.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(banner_schema_1.Banner.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(event_schema_1.Event.name), useValue: eventModel },
                                { provide: (0, mongoose_1.getModelToken)(event_id_counter_schema_1.EventIdCounter.name), useValue: eventCounterModel },
                                { provide: (0, mongoose_1.getModelToken)(newsletter_subscriber_schema_1.NewsletterSubscriber.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(contact_message_schema_1.ContactMessage.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(contact_reply_thread_schema_1.ContactReplyThread.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(notification_schema_1.Notification.name), useValue: notificationModel },
                                { provide: (0, mongoose_1.getModelToken)(article_schema_1.Article.name), useValue: {} },
                                { provide: email_service_1.EmailService, useValue: {} },
                                {
                                    provide: admin_system_notification_service_1.AdminSystemNotificationService,
                                    useValue: { createFeedNotification: jest.fn() },
                                },
                                { provide: rbac_service_1.RbacService, useValue: {} },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(admin_service_1.AdminService);
                    return [2 /*return*/];
            }
        });
    }); });
    it('creates event successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.createEvent({
                        eventName: 'Green Summit',
                        eventDate: new Date('2026-05-10T00:00:00.000Z'),
                        eventDescription: 'Event description',
                        eventStatus: 1,
                    })];
                case 1:
                    result = _a.sent();
                    expect(result.eventName).toBe('Green Summit');
                    expect(result.eventId).toBe(9);
                    expect(notificationModel.create).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates event by object id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventModel.findByIdAndUpdate.mockReturnValue(queryMock({
                        _id: new mongoose_2.Types.ObjectId(),
                        eventName: 'Updated Event',
                        eventStatus: 0,
                    }));
                    id = new mongoose_2.Types.ObjectId().toString();
                    return [4 /*yield*/, service.updateEvent(id, {
                            eventName: 'Updated Event',
                            eventStatus: 0,
                        })];
                case 1:
                    result = _a.sent();
                    expect(eventModel.findByIdAndUpdate).toHaveBeenCalled();
                    expect(result.eventName).toBe('Updated Event');
                    expect(notificationModel.create).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws bad request for invalid event id during update', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(service.updateEvent('invalid-id', { eventName: 'x' })).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('lists events with transformed response', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventModel.find.mockReturnValue(queryMock([
                        {
                            _id: new mongoose_2.Types.ObjectId(),
                            eventId: 10,
                            eventName: 'Event A',
                            eventDescription: 'Desc',
                            eventDate: new Date('2026-06-01T00:00:00.000Z'),
                            eventStartTime: '10:00 AM',
                            eventLocation: 'Chennai',
                            eventStatus: 1,
                            eventImage: '/uploads/events/a.jpg',
                            event_image: 'events/a.jpg',
                        },
                    ]));
                    return [4 /*yield*/, service.listEvents()];
                case 1:
                    rows = _a.sent();
                    expect(rows).toHaveLength(1);
                    expect(rows[0].eventName).toBe('Event A');
                    expect(rows[0].is_active).toBe(true);
                    expect(rows[0].dateTime).toContain('2026-06-01');
                    return [2 /*return*/];
            }
        });
    }); });
    it('gets event by object id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventModel.findById.mockReturnValue(queryMock({
                        _id: new mongoose_2.Types.ObjectId(),
                        eventName: 'Event A',
                        eventStatus: 1,
                    }));
                    id = new mongoose_2.Types.ObjectId().toString();
                    return [4 /*yield*/, service.getEventById(id)];
                case 1:
                    event = _a.sent();
                    expect(event.eventName).toBe('Event A');
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws not found when get event missing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventModel.findById.mockReturnValue(queryMock(null));
                    id = new mongoose_2.Types.ObjectId().toString();
                    return [4 /*yield*/, expect(service.getEventById(id)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('deletes event successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventModel.deleteOne.mockReturnValue(queryMock({
                        deletedCount: 1,
                    }));
                    id = new mongoose_2.Types.ObjectId().toString();
                    return [4 /*yield*/, expect(service.deleteEvent(id)).resolves.toEqual({ id: id })];
                case 1:
                    _a.sent();
                    expect(notificationModel.create).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('toggles event status when omitted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventModel.findOne.mockReturnValue(queryMock({ eventStatus: 1 }));
                    eventModel.findOneAndUpdate.mockReturnValue(queryMock({
                        _id: new mongoose_2.Types.ObjectId(),
                        eventId: 10,
                        eventStatus: 0,
                    }));
                    id = new mongoose_2.Types.ObjectId().toString();
                    return [4 /*yield*/, service.setOrToggleEventStatus(id)];
                case 1:
                    result = _a.sent();
                    expect(result.status).toBe('inactive');
                    expect(result.is_active).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('sets event status explicitly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventModel.findOneAndUpdate.mockReturnValue(queryMock({
                        _id: new mongoose_2.Types.ObjectId(),
                        eventId: 11,
                        eventStatus: 1,
                    }));
                    id = new mongoose_2.Types.ObjectId().toString();
                    return [4 /*yield*/, service.setOrToggleEventStatus(id, 1)];
                case 1:
                    result = _a.sent();
                    expect(result.status).toBe('active');
                    expect(result.is_active).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
