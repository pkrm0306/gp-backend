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
var rbac_service_1 = require("./rbac.service");
describe('RbacService', function () {
    var roleModel = {
        findOne: jest.fn(),
        create: jest.fn(),
    };
    var mappingModel = {
        findOneAndUpdate: jest.fn(),
        find: jest.fn(),
        countDocuments: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(0),
        }),
    };
    var vendorUserModel = {
        findOne: jest.fn(),
        findById: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue({ type: 'staff' }),
                }),
            }),
        }),
    };
    var vendorUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };
    var emailService = {
        sendStaffCredentialsEmail: jest.fn(),
    };
    var configService = {
        get: jest.fn().mockReturnValue('120'),
    };
    var redisService = {
        buildKey: jest.fn().mockReturnValue('rbac:test:*'),
        deleteByPattern: jest.fn().mockResolvedValue(0),
        get: jest.fn(),
        set: jest.fn().mockResolvedValue('OK'),
    };
    var service = new rbac_service_1.RbacService(roleModel, mappingModel, vendorUserModel, vendorUsersService, emailService, configService, redisService);
    beforeEach(function () {
        jest.clearAllMocks();
    });
    it('stores minimal permissions: aliases, dedupe, and parent drops implied children', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roleModel.create.mockResolvedValue({ _id: 'new' });
                    return [4 /*yield*/, service.createRole('507f1f77bcf86cd799439012', {
                            name: 'Test role',
                            permissions: [
                                'contacts.view',
                                'inquiries:view',
                                'products:view',
                                'products:certified:view',
                            ],
                        })];
                case 1:
                    _a.sent();
                    expect(roleModel.create).toHaveBeenCalledWith(expect.objectContaining({
                        permissions: ['inquiries:view', 'products:view'],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('effectivePermissionsFromRaw expands parent grants to known child keys', function () {
        var eff = service.effectivePermissionsFromRaw(['products:view']);
        expect(eff).toContain('products:certified:view');
        expect(eff).toContain('products:uncertified:view');
        expect(eff).not.toContain('products:add');
    });
    it('getStaffPermissions unions normalized grants from every active mapped role', function () { return __awaiter(void 0, void 0, void 0, function () {
        var execMappings, uid, grants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    redisService.get.mockResolvedValue(null);
                    execMappings = jest.fn().mockResolvedValue([
                        { roleId: { permissions: ['dashboard:view', 'products:view'], status: 1 } },
                        { roleId: { permissions: ['inquiries:view'], status: 1 } },
                    ]);
                    mappingModel.find.mockReturnValue({
                        populate: function () { return ({
                            lean: function () { return ({ exec: execMappings }); },
                        }); },
                    });
                    uid = '507f1f77bcf86cd799439099';
                    return [4 /*yield*/, service.getStaffPermissions(undefined, uid)];
                case 1:
                    grants = _a.sent();
                    expect(grants).toContain('products:view');
                    expect(grants).toContain('inquiries:view');
                    expect(mappingModel.find).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects role assignment when staff user is not found', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vendorUserModel.findOne.mockReturnValue({
                        exec: jest.fn().mockResolvedValue(null),
                    });
                    roleModel.findOne.mockReturnValue({
                        exec: jest.fn().mockResolvedValue({ _id: 'r1', status: 1 }),
                    });
                    return [4 /*yield*/, expect(service.assignRole(undefined, {
                            vendorUserId: '507f1f77bcf86cd799439013',
                            roleId: '507f1f77bcf86cd799439014',
                        })).rejects.toBeInstanceOf(common_1.NotFoundException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends credentials email when staff is created', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vendorUsersService.findByEmail.mockResolvedValue(null);
                    vendorUsersService.create.mockResolvedValue({ _id: 'staff1' });
                    emailService.sendStaffCredentialsEmail.mockResolvedValue(undefined);
                    return [4 /*yield*/, service.createStaff(undefined, {
                            name: 'Staff User',
                            email: 'staff@example.com',
                            phone: '9999999999',
                            password: 'Pass@123',
                        })];
                case 1:
                    _a.sent();
                    expect(vendorUsersService.create).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'staff',
                        email: 'staff@example.com',
                    }));
                    expect(emailService.sendStaffCredentialsEmail).toHaveBeenCalledWith('staff@example.com', 'Pass@123', 'Staff User');
                    return [2 /*return*/];
            }
        });
    }); });
});
