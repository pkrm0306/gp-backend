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
var manufacturers_service_1 = require("../manufacturers/manufacturers.service");
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var lifecycle_notification_service_1 = require("../notifications/lifecycle-notification.service");
var account_deletion_service_1 = require("./account-deletion.service");
var account_deletion_request_schema_1 = require("./schemas/account-deletion-request.schema");
describe('AccountDeletionService', function () {
    var service;
    var vendorId = new mongoose_2.Types.ObjectId().toString();
    var adminUserId = new mongoose_2.Types.ObjectId().toString();
    var requestId = new mongoose_2.Types.ObjectId().toString();
    var findMock = jest.fn();
    var findOneMock = jest.fn();
    var findByIdMock = jest.fn();
    var countDocumentsMock = jest.fn();
    var saveMock = jest.fn();
    var manufacturerFindMock = jest.fn();
    var softDeleteAccountAfterDeletionRequest = jest
        .fn()
        .mockResolvedValue({ _id: vendorId, vendor_status: 0 });
    var lifecycleNotification = {
        notifyAccountDeletionRequested: jest.fn().mockResolvedValue(undefined),
        notifyAccountDeletionApproved: jest.fn().mockResolvedValue(undefined),
        notifyAccountDeletionRejected: jest.fn().mockResolvedValue(undefined),
        notifyAccountDeletionCompleted: jest.fn().mockResolvedValue(undefined),
    };
    var AccountDeletionModelMock = jest.fn().mockImplementation(function (data) {
        var _a;
        var doc = __assign(__assign({}, data), { _id: new mongoose_2.Types.ObjectId(requestId), requestNo: 'ADR-000001', status: (_a = data.status) !== null && _a !== void 0 ? _a : account_deletion_request_schema_1.AccountDeletionStatus.Requested, save: saveMock });
        saveMock.mockResolvedValue(doc);
        return doc;
    });
    AccountDeletionModelMock.find = findMock;
    AccountDeletionModelMock.findOne = findOneMock;
    AccountDeletionModelMock.findById = findByIdMock;
    AccountDeletionModelMock.countDocuments = countDocumentsMock;
    var chainFind = function (result) {
        return findMock.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(result),
        });
    };
    var chainFindOne = function (result) {
        return findOneMock.mockReturnValue({
            exec: jest.fn().mockResolvedValue(result),
        });
    };
    var chainFindById = function (result, lean) {
        if (lean === void 0) { lean = false; }
        if (lean) {
            findByIdMock.mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(result),
            });
            return;
        }
        findByIdMock.mockReturnValue({
            exec: jest.fn().mockResolvedValue(result),
        });
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    saveMock.mockReset();
                    softDeleteAccountAfterDeletionRequest.mockResolvedValue({
                        _id: vendorId,
                        vendor_status: 0,
                    });
                    countDocumentsMock.mockReturnValue({
                        exec: jest.fn().mockResolvedValue(0),
                    });
                    manufacturerFindMock.mockReturnValue({
                        select: jest.fn().mockReturnThis(),
                        lean: jest.fn().mockReturnThis(),
                        exec: jest.fn().mockResolvedValue([]),
                    });
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                account_deletion_service_1.AccountDeletionService,
                                {
                                    provide: (0, mongoose_1.getModelToken)(account_deletion_request_schema_1.AccountDeletionRequest.name),
                                    useValue: AccountDeletionModelMock,
                                },
                                {
                                    provide: (0, mongoose_1.getModelToken)(manufacturer_schema_1.Manufacturer.name),
                                    useValue: { find: manufacturerFindMock },
                                },
                                {
                                    provide: manufacturers_service_1.ManufacturersService,
                                    useValue: { softDeleteAccountAfterDeletionRequest: softDeleteAccountAfterDeletionRequest },
                                },
                                {
                                    provide: lifecycle_notification_service_1.LifecycleNotificationService,
                                    useValue: lifecycleNotification,
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(account_deletion_service_1.AccountDeletionService);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('findAllForVendor', function () {
        it('lists deletion requests for vendor', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = [{ requestNo: 'ADR-000001' }];
                        chainFind(rows);
                        return [4 /*yield*/, expect(service.findAllForVendor(vendorId)).resolves.toEqual(rows)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects invalid vendor id', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(service.findAllForVendor('x')).rejects.toBeInstanceOf(common_1.BadRequestException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findOneForVendor', function () {
        it('returns request owned by vendor', function () { return __awaiter(void 0, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = { _id: requestId, reason: 'Privacy concerns' };
                        chainFindOne(doc);
                        return [4 /*yield*/, expect(service.findOneForVendor(requestId, vendorId)).resolves.toEqual(doc)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NotFound when missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindOne(null);
                        return [4 /*yield*/, expect(service.findOneForVendor(requestId, vendorId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('createForVendor', function () {
        it('creates Requested deletion request and notifies', function () { return __awaiter(void 0, void 0, void 0, function () {
            var saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindOne(null);
                        return [4 /*yield*/, service.createForVendor(vendorId, {
                                reason: 'Privacy concerns',
                                description: ' Optional details ',
                                confirmed: true,
                            })];
                    case 1:
                        saved = _a.sent();
                        expect(AccountDeletionModelMock).toHaveBeenCalledWith(expect.objectContaining({
                            reason: 'Privacy concerns',
                            description: 'Optional details',
                            confirmed: true,
                            status: account_deletion_request_schema_1.AccountDeletionStatus.Requested,
                        }));
                        expect(saved.requestNo).toBe('ADR-000001');
                        expect(lifecycleNotification.notifyAccountDeletionRequested).toHaveBeenCalledWith(expect.objectContaining({
                            manufacturerId: vendorId,
                            requestNo: 'ADR-000001',
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('blocks second open request while Requested/Approved exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindOne({
                            requestNo: 'ADR-000001',
                            status: account_deletion_request_schema_1.AccountDeletionStatus.Requested,
                        });
                        return [4 /*yield*/, expect(service.createForVendor(vendorId, {
                                reason: 'Duplicate account',
                                confirmed: true,
                            })).rejects.toThrow(/already have an open account deletion request/i)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findAllForAdmin', function () {
        it('returns paginated list with vendor name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vendorObjectId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vendorObjectId = new mongoose_2.Types.ObjectId(vendorId);
                        chainFind([
                            {
                                _id: new mongoose_2.Types.ObjectId(requestId),
                                vendorId: vendorObjectId,
                                reason: 'Privacy concerns',
                            },
                        ]);
                        countDocumentsMock.mockReturnValue({
                            exec: jest.fn().mockResolvedValue(1),
                        });
                        manufacturerFindMock.mockReturnValue({
                            select: jest.fn().mockReturnThis(),
                            lean: jest.fn().mockReturnThis(),
                            exec: jest.fn().mockResolvedValue([
                                {
                                    _id: vendorObjectId,
                                    manufacturerName: 'GreenCo',
                                },
                            ]),
                        });
                        return [4 /*yield*/, service.findAllForAdmin({
                                page: 1,
                                limit: 10,
                                status: account_deletion_request_schema_1.AccountDeletionStatus.Requested,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.total).toBe(1);
                        expect(result.items[0].vendorName).toBe('GreenCo');
                        return [2 /*return*/];
                }
            });
        }); });
        it('supports search, reason, and date filters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFind([]);
                        countDocumentsMock.mockReturnValue({
                            exec: jest.fn().mockResolvedValue(0),
                        });
                        return [4 /*yield*/, service.findAllForAdmin({
                                search: 'ADR-0001',
                                reason: 'Privacy concerns',
                                from: '2026-01-01',
                                to: '2026-12-31',
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.items).toEqual([]);
                        expect(findMock).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findOneForAdmin', function () {
        it('returns request with vendor details', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vendorObjectId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vendorObjectId = new mongoose_2.Types.ObjectId(vendorId);
                        chainFindById({
                            _id: new mongoose_2.Types.ObjectId(requestId),
                            vendorId: vendorObjectId,
                            reason: 'Privacy concerns',
                        }, true);
                        manufacturerFindMock.mockReturnValue({
                            select: jest.fn().mockReturnThis(),
                            lean: jest.fn().mockReturnThis(),
                            exec: jest.fn().mockResolvedValue([
                                {
                                    _id: vendorObjectId,
                                    manufacturerName: 'GreenCo',
                                    vendor_email: 'g@example.com',
                                },
                            ]),
                        });
                        return [4 /*yield*/, service.findOneForAdmin(requestId)];
                    case 1:
                        result = _a.sent();
                        expect(result.vendorName).toBe('GreenCo');
                        expect(result.vendorEmail).toBe('g@example.com');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NotFound when missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(null, true);
                        return [4 /*yield*/, expect(service.findOneForAdmin(requestId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('reviewForAdmin', function () {
        var buildDoc = function (overrides) {
            if (overrides === void 0) { overrides = {}; }
            return (__assign({ _id: new mongoose_2.Types.ObjectId(requestId), vendorId: new mongoose_2.Types.ObjectId(vendorId), requestNo: 'ADR-000001', reason: 'Privacy concerns', status: account_deletion_request_schema_1.AccountDeletionStatus.Requested, adminRemarks: '', save: saveMock }, overrides));
        };
        it('approves a Requested item and notifies', function () { return __awaiter(void 0, void 0, void 0, function () {
            var doc, saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = buildDoc();
                        chainFindById(doc);
                        saveMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, doc];
                        }); }); });
                        return [4 /*yield*/, service.reviewForAdmin(requestId, { status: account_deletion_request_schema_1.AccountDeletionStatus.Approved, adminRemarks: 'OK' }, adminUserId)];
                    case 1:
                        saved = _a.sent();
                        expect(saved.status).toBe(account_deletion_request_schema_1.AccountDeletionStatus.Approved);
                        expect(softDeleteAccountAfterDeletionRequest).not.toHaveBeenCalled();
                        expect(lifecycleNotification.notifyAccountDeletionApproved).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects a Requested item with required remarks', function () { return __awaiter(void 0, void 0, void 0, function () {
            var doc, saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = buildDoc();
                        chainFindById(doc);
                        saveMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, doc];
                        }); }); });
                        return [4 /*yield*/, service.reviewForAdmin(requestId, {
                                status: account_deletion_request_schema_1.AccountDeletionStatus.Rejected,
                                adminRemarks: 'Insufficient justification',
                            }, adminUserId)];
                    case 1:
                        saved = _a.sent();
                        expect(saved.status).toBe(account_deletion_request_schema_1.AccountDeletionStatus.Rejected);
                        expect(lifecycleNotification.notifyAccountDeletionRejected).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('requires remarks when rejecting', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(buildDoc());
                        return [4 /*yield*/, expect(service.reviewForAdmin(requestId, { status: account_deletion_request_schema_1.AccountDeletionStatus.Rejected, adminRemarks: '  ' }, adminUserId)).rejects.toThrow(/remarks are required/i)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('completes an Approved request with soft-delete outcomes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var doc, saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = buildDoc({ status: account_deletion_request_schema_1.AccountDeletionStatus.Approved });
                        chainFindById(doc);
                        saveMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                doc.status = account_deletion_request_schema_1.AccountDeletionStatus.Completed;
                                return [2 /*return*/, doc];
                            });
                        }); });
                        return [4 /*yield*/, service.reviewForAdmin(requestId, { status: account_deletion_request_schema_1.AccountDeletionStatus.Completed }, adminUserId)];
                    case 1:
                        saved = _a.sent();
                        expect(softDeleteAccountAfterDeletionRequest).toHaveBeenCalledWith(vendorId);
                        expect(saved.status).toBe(account_deletion_request_schema_1.AccountDeletionStatus.Completed);
                        expect(lifecycleNotification.notifyAccountDeletionCompleted).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not complete unless current status is Approved', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(buildDoc({ status: account_deletion_request_schema_1.AccountDeletionStatus.Requested }));
                        return [4 /*yield*/, expect(service.reviewForAdmin(requestId, { status: account_deletion_request_schema_1.AccountDeletionStatus.Completed }, adminUserId)).rejects.toThrow(/Only approved requests can be marked Completed/i)];
                    case 1:
                        _a.sent();
                        expect(softDeleteAccountAfterDeletionRequest).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not approve unless current status is Requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(buildDoc({ status: account_deletion_request_schema_1.AccountDeletionStatus.Approved }));
                        return [4 /*yield*/, expect(service.reviewForAdmin(requestId, { status: account_deletion_request_schema_1.AccountDeletionStatus.Approved }, adminUserId)).rejects.toThrow(/Only requests with status Requested can be approved/i)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('blocks review of already Rejected requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(buildDoc({ status: account_deletion_request_schema_1.AccountDeletionStatus.Rejected }));
                        return [4 /*yield*/, expect(service.reviewForAdmin(requestId, { status: account_deletion_request_schema_1.AccountDeletionStatus.Approved }, adminUserId)).rejects.toThrow(/already Rejected/i)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('blocks review of already Completed requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(buildDoc({ status: account_deletion_request_schema_1.AccountDeletionStatus.Completed }));
                        return [4 /*yield*/, expect(service.reviewForAdmin(requestId, { status: account_deletion_request_schema_1.AccountDeletionStatus.Approved }, adminUserId)).rejects.toThrow(/already Completed/i)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NotFound when request missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(null);
                        return [4 /*yield*/, expect(service.reviewForAdmin(requestId, { status: account_deletion_request_schema_1.AccountDeletionStatus.Approved }, adminUserId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
