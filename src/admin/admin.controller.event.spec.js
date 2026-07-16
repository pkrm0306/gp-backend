"use strict";
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
var admin_controller_1 = require("./admin.controller");
describe('AdminController Event Endpoints', function () {
    var controller;
    var adminServiceMock = {
        createEvent: jest.fn(),
        updateEvent: jest.fn(),
        listEventsPaginated: jest.fn(),
        getEventById: jest.fn(),
        setOrToggleEventStatus: jest.fn(),
        deleteEvent: jest.fn(),
    };
    var galleryServiceMock = {
        setOrToggleGalleryStatus: jest.fn(),
        createGallery: jest.fn(),
        updateGallery: jest.fn(),
        listGalleryPaginated: jest.fn(),
        getGalleryById: jest.fn(),
        deleteGallery: jest.fn(),
    };
    beforeEach(function () {
        jest.clearAllMocks();
        controller = new admin_controller_1.AdminController(adminServiceMock, galleryServiceMock, {}, {});
    });
    it('creates event successfully with required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.createEvent.mockResolvedValue({ id: 'e1', eventName: 'Event 1' });
                    return [4 /*yield*/, controller.createEvent({
                            eventName: 'Event 1',
                            eventDate: '2026-05-15',
                        })];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.createEvent).toHaveBeenCalledTimes(1);
                    expect(res.message).toBe('Event created successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws when create event date is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(controller.createEvent({
                        eventName: 'Event 1',
                        eventDate: 'not-a-date',
                    })).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('edits event successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.updateEvent.mockResolvedValue({ id: 'e1', eventName: 'Updated' });
                    return [4 /*yield*/, controller.editEvent('e1', {
                            eventName: 'Updated',
                            eventDate: '2026-05-20',
                            status: 'inactive',
                        })];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.updateEvent).toHaveBeenCalledTimes(1);
                    expect(res.message).toBe('Event updated successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('lists events successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.listEventsPaginated.mockResolvedValue({
                        data: [{ id: 'e1' }],
                        pagination: { page: 1, limit: 10, perPage: 10, total: 1, totalPages: 1 },
                    });
                    return [4 /*yield*/, controller.listEvents()];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.listEventsPaginated).toHaveBeenCalledWith(1, 10, {
                        activeOnly: true,
                    });
                    expect(res.message).toBe('Events retrieved successfully');
                    expect(Array.isArray(res.data)).toBe(true);
                    expect(res.pagination).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('gets event by id successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.getEventById.mockResolvedValue({ id: 'e1' });
                    return [4 /*yield*/, controller.getEventById('e1')];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.getEventById).toHaveBeenCalledWith('e1', 'event');
                    expect(res.message).toBe('Event retrieved successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates gallery status by parsing active/inactive', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    galleryServiceMock.setOrToggleGalleryStatus.mockResolvedValue({
                        id: 'g1',
                        status: 'active',
                        is_active: true,
                    });
                    return [4 /*yield*/, controller.updateGalleryStatus('g1', { status: 'active' })];
                case 1:
                    res = _a.sent();
                    expect(galleryServiceMock.setOrToggleGalleryStatus).toHaveBeenCalledWith('g1', 1);
                    expect(res.message).toBe('Gallery status updated successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('deletes event successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.deleteEvent.mockResolvedValue({ id: 'e1' });
                    return [4 /*yield*/, controller.deleteEvent('e1')];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.deleteEvent).toHaveBeenCalledWith('e1', 'event');
                    expect(res.message).toBe('Event deleted successfully');
                    return [2 /*return*/];
            }
        });
    }); });
});
