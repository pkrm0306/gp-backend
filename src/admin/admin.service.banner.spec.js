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
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(result),
    };
}
describe('AdminService Banner Functionality', function () {
    var service;
    var bannerModel = jest.fn();
    bannerModel.exists = jest.fn();
    bannerModel.find = jest.fn();
    bannerModel.findOne = jest.fn();
    bannerModel.findByIdAndUpdate = jest.fn();
    bannerModel.findOneAndUpdate = jest.fn();
    bannerModel.deleteOne = jest.fn();
    var vendorId = new mongoose_2.Types.ObjectId().toString();
    var bannerId = new mongoose_2.Types.ObjectId().toString();
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    bannerModel.mockImplementation(function (doc) { return ({
                        save: jest.fn().mockResolvedValue({
                            toObject: function () { return (__assign(__assign({ _id: new mongoose_2.Types.ObjectId() }, doc), { createdAt: new Date('2026-01-01T00:00:00.000Z'), updatedAt: new Date('2026-01-01T00:00:00.000Z') })); },
                        }),
                    }); });
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                admin_service_1.AdminService,
                                { provide: (0, mongoose_1.getModelToken)(manufacturer_schema_1.Manufacturer.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(vendor_user_schema_1.VendorUser.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(banner_schema_1.Banner.name), useValue: bannerModel },
                                { provide: (0, mongoose_1.getModelToken)(event_schema_1.Event.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(event_id_counter_schema_1.EventIdCounter.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(newsletter_subscriber_schema_1.NewsletterSubscriber.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(contact_message_schema_1.ContactMessage.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(contact_reply_thread_schema_1.ContactReplyThread.name), useValue: {} },
                                { provide: (0, mongoose_1.getModelToken)(notification_schema_1.Notification.name), useValue: {} },
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
    it('creates banner with unique sequence number', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.exists.mockReturnValue(queryMock(null));
                    return [4 /*yield*/, service.createBanner(vendorId, {
                            imageUrl: '/uploads/banners/home.jpg',
                            title: 'Home Banner',
                            sequenceNumber: 1,
                            description: 'Banner description',
                            status: 'active',
                        }, 'manual_url')];
                case 1:
                    result = _a.sent();
                    expect(bannerModel.exists).toHaveBeenCalled();
                    expect(result.title).toBe('Home Banner');
                    expect(result.sequenceNumber).toBe(1);
                    expect(result.status).toBe('active');
                    expect(result.is_active).toBe(true);
                    expect(result.imageUrl).toContain('/uploads/');
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects duplicate sequence number on create', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.exists.mockReturnValue(queryMock({ _id: new mongoose_2.Types.ObjectId() }));
                    return [4 /*yield*/, expect(service.createBanner(vendorId, {
                            imageUrl: '/uploads/banners/home.jpg',
                            title: 'Home Banner',
                            sequenceNumber: 1,
                            description: 'Banner description',
                        }, 'manual_url')).rejects.toBeInstanceOf(common_1.ConflictException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('lists banners with transformed output', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.find.mockReturnValue(queryMock([
                        {
                            _id: new mongoose_2.Types.ObjectId(),
                            imageUrl: '/uploads/banners/a.jpg',
                            banner_image: 'banners/a.jpg',
                            heading: 'A',
                            sequenceNumber: 2,
                            description: 'Desc A',
                            status: 1,
                        },
                    ]));
                    return [4 /*yield*/, service.listBanners(vendorId)];
                case 1:
                    rows = _a.sent();
                    expect(rows).toHaveLength(1);
                    expect(rows[0]).toMatchObject({
                        title: 'A',
                        sequenceNumber: 2,
                        status: 'active',
                        is_active: true,
                    });
                    expect(rows[0].imageUrl).toContain('/uploads/');
                    return [2 /*return*/];
            }
        });
    }); });
    it('gets a single banner by id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.findOne.mockReturnValue(queryMock({
                        _id: new mongoose_2.Types.ObjectId(),
                        imageUrl: '/uploads/banners/a.jpg',
                        banner_image: 'banners/a.jpg',
                        heading: 'A',
                        sequenceNumber: 2,
                        description: 'Desc A',
                        status: 0,
                    }));
                    return [4 /*yield*/, service.getBannerById(vendorId, bannerId)];
                case 1:
                    row = _a.sent();
                    expect(row.title).toBe('A');
                    expect(row.status).toBe('inactive');
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws not found when banner id does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.findOne.mockReturnValue(queryMock(null));
                    return [4 /*yield*/, expect(service.getBannerById(vendorId, bannerId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates banner with unique sequence number', function () { return __awaiter(void 0, void 0, void 0, function () {
        var updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.findOne.mockReturnValueOnce(queryMock({ _id: new mongoose_2.Types.ObjectId() }));
                    bannerModel.exists.mockReturnValueOnce(queryMock(null));
                    bannerModel.findByIdAndUpdate.mockReturnValue(queryMock({
                        _id: new mongoose_2.Types.ObjectId(),
                        imageUrl: '/uploads/banners/updated.jpg',
                        banner_image: 'banners/updated.jpg',
                        heading: 'Updated',
                        sequenceNumber: 4,
                        description: 'Updated desc',
                        status: 0,
                        createdAt: new Date('2026-01-01T00:00:00.000Z'),
                        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
                    }));
                    return [4 /*yield*/, service.updateBanner(vendorId, bannerId, {
                            imageUrl: '/uploads/banners/updated.jpg',
                            title: 'Updated',
                            sequenceNumber: 4,
                            description: 'Updated desc',
                            status: 'inactive',
                        })];
                case 1:
                    updated = _a.sent();
                    expect(updated.title).toBe('Updated');
                    expect(updated.status).toBe('inactive');
                    expect(updated.sequenceNumber).toBe(4);
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects duplicate sequence number on update', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.findOne.mockReturnValueOnce(queryMock({ _id: new mongoose_2.Types.ObjectId() }));
                    bannerModel.exists.mockReturnValueOnce(queryMock({ _id: new mongoose_2.Types.ObjectId() }));
                    return [4 /*yield*/, expect(service.updateBanner(vendorId, bannerId, {
                            title: 'Updated',
                            sequenceNumber: 1,
                            description: 'Updated desc',
                        })).rejects.toBeInstanceOf(common_1.ConflictException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sets explicit banner status', function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.findOne.mockReturnValue(queryMock({ _id: new mongoose_2.Types.ObjectId(), status: 1 }));
                    bannerModel.findByIdAndUpdate.mockReturnValue(queryMock({ _id: new mongoose_2.Types.ObjectId(), status: 0 }));
                    return [4 /*yield*/, service.setOrToggleBannerStatus(vendorId, bannerId, 'inactive')];
                case 1:
                    data = _a.sent();
                    expect(data.status).toBe('inactive');
                    expect(data.is_active).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('toggles banner status when status is omitted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.findOne.mockReturnValue(queryMock({ _id: new mongoose_2.Types.ObjectId(), status: 0 }));
                    bannerModel.findByIdAndUpdate.mockReturnValue(queryMock({ _id: new mongoose_2.Types.ObjectId(), status: 1 }));
                    return [4 /*yield*/, service.setOrToggleBannerStatus(vendorId, bannerId)];
                case 1:
                    data = _a.sent();
                    expect(data.status).toBe('active');
                    expect(data.is_active).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('deletes banner by id', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bannerModel.deleteOne.mockReturnValue({
                        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
                    });
                    return [4 /*yield*/, expect(service.deleteBanner(vendorId, bannerId)).resolves.toEqual({
                            id: bannerId,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws invalid vendor id on create', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(service.createBanner('invalid-id', {
                        imageUrl: '/uploads/banners/home.jpg',
                        title: 'x',
                        sequenceNumber: 1,
                        description: 'y',
                    }, 'manual_url')).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
