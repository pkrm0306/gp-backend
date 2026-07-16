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
describe('AdminController Banner Endpoints', function () {
    var controller;
    var adminServiceMock = {
        listBanners: jest.fn(),
        createBanner: jest.fn(),
        updateBanner: jest.fn(),
        getBannerById: jest.fn(),
        setOrToggleBannerStatus: jest.fn(),
        deleteBanner: jest.fn(),
    };
    beforeEach(function () {
        jest.clearAllMocks();
        controller = new admin_controller_1.AdminController(adminServiceMock, {}, {}, {});
    });
    it('lists banners for vendor id from token', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.listBanners.mockResolvedValue([{ id: 'b1', title: 'Banner 1' }]);
                    return [4 /*yield*/, controller.listBanners({ vendorId: 'v1' })];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.listBanners).toHaveBeenCalledWith('v1');
                    expect(res.message).toBe('Banners retrieved successfully');
                    expect(res.data).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('lists banners for platform admin without vendor id', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.listBanners.mockResolvedValue([]);
                    return [4 /*yield*/, controller.listBanners({ role: 'admin' })];
                case 1:
                    _a.sent();
                    expect(adminServiceMock.listBanners).toHaveBeenCalledWith(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('creates banner with body + image URL', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.createBanner.mockResolvedValue({ id: 'b1', title: 'Banner 1' });
                    return [4 /*yield*/, controller.createBanner({ vendorId: 'v1' }, {
                            title: 'Banner 1',
                            description: 'Desc',
                            sequenceNumber: 1,
                            status: 'active',
                            imageUrl: 'https://example.com/banner.jpg',
                        }, undefined)];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.createBanner).toHaveBeenCalledWith('v1', expect.objectContaining({ imageUrl: 'https://example.com/banner.jpg' }), 'manual_url');
                    expect(res.message).toBe('Banner created successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws for create when vendor id missing for vendor accounts', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(controller.createBanner({ role: 'vendor' }, { title: 'Banner 1', description: 'Desc', sequenceNumber: 1 }, undefined)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('creates banner for platform admin without vendor id', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.createBanner.mockResolvedValue({ id: 'b1', title: 'Banner 1' });
                    return [4 /*yield*/, controller.createBanner({ role: 'staff' }, {
                            title: 'Banner 1',
                            description: 'Desc',
                            sequenceNumber: 1,
                            status: 'active',
                            imageUrl: 'https://example.com/banner.jpg',
                        }, undefined)];
                case 1:
                    _a.sent();
                    expect(adminServiceMock.createBanner).toHaveBeenCalledWith(null, expect.objectContaining({ imageUrl: 'https://example.com/banner.jpg' }), 'manual_url');
                    return [2 /*return*/];
            }
        });
    }); });
    it('edits banner and forwards payload', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.updateBanner.mockResolvedValue({ id: 'b1', title: 'Updated' });
                    return [4 /*yield*/, controller.editBanner({ vendorId: 'v1' }, 'b1', { title: 'Updated', description: 'Desc', sequenceNumber: 2, status: 'inactive' }, undefined)];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.updateBanner).toHaveBeenCalledWith('v1', 'b1', {
                        title: 'Updated',
                        status: 'inactive',
                        sequenceNumber: 2,
                        description: 'Desc',
                    });
                    expect(res.message).toBe('Banner updated successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('gets banner by id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.getBannerById.mockResolvedValue({ id: 'b1', title: 'Banner' });
                    return [4 /*yield*/, controller.getBannerById({ vendorId: 'v1' }, 'b1')];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.getBannerById).toHaveBeenCalledWith('v1', 'b1');
                    expect(res.message).toBe('Banner retrieved successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates banner status', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.setOrToggleBannerStatus.mockResolvedValue({
                        id: 'b1',
                        status: 'inactive',
                        is_active: false,
                    });
                    return [4 /*yield*/, controller.updateBannerStatus({ vendorId: 'v1' }, 'b1', { status: 'inactive' })];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.setOrToggleBannerStatus).toHaveBeenCalledWith('v1', 'b1', 'inactive');
                    expect(res.message).toBe('Banner status updated successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('deletes banner via post route', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminServiceMock.deleteBanner.mockResolvedValue({ id: 'b1' });
                    return [4 /*yield*/, controller.deleteBannerPost({ vendorId: 'v1' }, { id: 'b1' })];
                case 1:
                    res = _a.sent();
                    expect(adminServiceMock.deleteBanner).toHaveBeenCalledWith('v1', 'b1');
                    expect(res.message).toBe('Banner deleted successfully');
                    return [2 /*return*/];
            }
        });
    }); });
});
