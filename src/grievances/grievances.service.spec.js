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
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var lifecycle_notification_service_1 = require("../notifications/lifecycle-notification.service");
var grievances_service_1 = require("./grievances.service");
var grievance_schema_1 = require("./schemas/grievance.schema");
describe('GrievancesService', function () {
    var service;
    var vendorId = new mongoose_2.Types.ObjectId().toString();
    var adminUserId = new mongoose_2.Types.ObjectId().toString();
    var grievanceId = new mongoose_2.Types.ObjectId().toString();
    var findMock = jest.fn();
    var findOneMock = jest.fn();
    var findByIdMock = jest.fn();
    var countDocumentsMock = jest.fn();
    var saveMock = jest.fn();
    var manufacturerFindMock = jest.fn();
    var lifecycleNotification = {
        notifyGrievanceCreated: jest.fn().mockResolvedValue(undefined),
        notifyGrievanceResponded: jest.fn().mockResolvedValue(undefined),
        notifyGrievanceClosed: jest.fn().mockResolvedValue(undefined),
    };
    var GrievanceModelMock = jest.fn().mockImplementation(function (data) {
        var _a, _b;
        var doc = __assign(__assign({}, data), { _id: new mongoose_2.Types.ObjectId(grievanceId), grievanceNo: 'GRV-000001', adminResponse: (_a = data.adminResponse) !== null && _a !== void 0 ? _a : '', status: (_b = data.status) !== null && _b !== void 0 ? _b : grievance_schema_1.GrievanceStatus.Pending, save: saveMock });
        saveMock.mockResolvedValue(doc);
        return doc;
    });
    GrievanceModelMock.find = findMock;
    GrievanceModelMock.findOne = findOneMock;
    GrievanceModelMock.findById = findByIdMock;
    GrievanceModelMock.countDocuments = countDocumentsMock;
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
                                grievances_service_1.GrievancesService,
                                { provide: (0, mongoose_1.getModelToken)(grievance_schema_1.Grievance.name), useValue: GrievanceModelMock },
                                {
                                    provide: (0, mongoose_1.getModelToken)(manufacturer_schema_1.Manufacturer.name),
                                    useValue: { find: manufacturerFindMock },
                                },
                                {
                                    provide: lifecycle_notification_service_1.LifecycleNotificationService,
                                    useValue: lifecycleNotification,
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(grievances_service_1.GrievancesService);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('findAllForVendor', function () {
        it('lists grievances for a valid vendor id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rows, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = [{ grievanceNo: 'GRV-000001' }];
                        chainFind(rows);
                        return [4 /*yield*/, service.findAllForVendor(vendorId)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(rows);
                        expect(findMock).toHaveBeenCalledWith({
                            vendorId: expect.any(mongoose_2.Types.ObjectId),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects invalid vendor id', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(service.findAllForVendor('bad-id')).rejects.toBeInstanceOf(common_1.BadRequestException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findOneForVendor', function () {
        it('returns grievance owned by vendor', function () { return __awaiter(void 0, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = { _id: grievanceId, subject: 'Data access' };
                        chainFindOne(doc);
                        return [4 /*yield*/, expect(service.findOneForVendor(grievanceId, vendorId)).resolves.toEqual(doc)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NotFound when grievance missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindOne(null);
                        return [4 /*yield*/, expect(service.findOneForVendor(grievanceId, vendorId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects invalid grievance id', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(service.findOneForVendor('not-an-id', vendorId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('createForVendor', function () {
        it('creates a Pending grievance and notifies', function () { return __awaiter(void 0, void 0, void 0, function () {
            var saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.createForVendor(vendorId, {
                            category: ' Data access ',
                            subject: ' Unauthorized processing ',
                            description: ' Details under DPDP ',
                            attachment: ' uploads/g.pdf ',
                        })];
                    case 1:
                        saved = _a.sent();
                        expect(GrievanceModelMock).toHaveBeenCalledWith(expect.objectContaining({
                            category: 'Data access',
                            subject: 'Unauthorized processing',
                            description: 'Details under DPDP',
                            attachment: 'uploads/g.pdf',
                            status: grievance_schema_1.GrievanceStatus.Pending,
                        }));
                        expect(saved.grievanceNo).toBe('GRV-000001');
                        expect(lifecycleNotification.notifyGrievanceCreated).toHaveBeenCalledWith(expect.objectContaining({
                            manufacturerId: vendorId,
                            grievanceNo: 'GRV-000001',
                            subject: expect.any(String),
                            category: expect.any(String),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('omits attachment when not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.createForVendor(vendorId, {
                            category: 'Privacy',
                            subject: 'Subject',
                            description: 'Description',
                        })];
                    case 1:
                        _a.sent();
                        expect(GrievanceModelMock).toHaveBeenCalledWith(expect.not.objectContaining({ attachment: expect.anything() }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findAllForAdmin', function () {
        it('returns paginated items with vendor enrichment', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vendorObjectId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vendorObjectId = new mongoose_2.Types.ObjectId(vendorId);
                        chainFind([
                            {
                                _id: new mongoose_2.Types.ObjectId(grievanceId),
                                vendorId: vendorObjectId,
                                subject: 'S1',
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
                                    manufacturerName: 'Acme Green',
                                    vendor_name: 'Acme',
                                },
                            ]),
                        });
                        return [4 /*yield*/, service.findAllForAdmin({
                                page: 1,
                                limit: 10,
                                status: grievance_schema_1.GrievanceStatus.Pending,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.total).toBe(1);
                        expect(result.totalPages).toBe(1);
                        expect(result.items[0].vendorName).toBe('Acme Green');
                        return [2 /*return*/];
                }
            });
        }); });
        it('applies search / category / date filters without throwing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFind([]);
                        countDocumentsMock.mockReturnValue({
                            exec: jest.fn().mockResolvedValue(0),
                        });
                        return [4 /*yield*/, service.findAllForAdmin({
                                search: 'GRV-0001',
                                category: 'Data access',
                                from: '2026-01-01',
                                to: '2026-12-31',
                                page: 2,
                                limit: 5,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.page).toBe(2);
                        expect(result.limit).toBe(5);
                        expect(result.items).toEqual([]);
                        expect(findMock).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findOneForAdmin', function () {
        it('returns grievance with vendor details', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vendorObjectId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vendorObjectId = new mongoose_2.Types.ObjectId(vendorId);
                        chainFindById({
                            _id: new mongoose_2.Types.ObjectId(grievanceId),
                            vendorId: vendorObjectId,
                            subject: 'S1',
                        }, true);
                        manufacturerFindMock.mockReturnValue({
                            select: jest.fn().mockReturnThis(),
                            lean: jest.fn().mockReturnThis(),
                            exec: jest.fn().mockResolvedValue([
                                {
                                    _id: vendorObjectId,
                                    manufacturerName: 'Vendor Co',
                                    vendor_email: 'v@example.com',
                                    vendor_phone: '9999999999',
                                },
                            ]),
                        });
                        return [4 /*yield*/, service.findOneForAdmin(grievanceId)];
                    case 1:
                        result = _a.sent();
                        expect(result.vendorName).toBe('Vendor Co');
                        expect(result.vendorEmail).toBe('v@example.com');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NotFound when missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(null, true);
                        return [4 /*yield*/, expect(service.findOneForAdmin(grievanceId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('respondForAdmin', function () {
        var buildDoc = function (overrides) {
            if (overrides === void 0) { overrides = {}; }
            return (__assign({ _id: new mongoose_2.Types.ObjectId(grievanceId), vendorId: new mongoose_2.Types.ObjectId(vendorId), grievanceNo: 'GRV-000001', subject: 'Subject', category: 'Privacy', status: grievance_schema_1.GrievanceStatus.Pending, adminResponse: '', save: saveMock }, overrides));
        };
        it('submits first response as Responded and notifies', function () { return __awaiter(void 0, void 0, void 0, function () {
            var doc, saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = buildDoc();
                        chainFindById(doc);
                        saveMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, doc];
                        }); }); });
                        return [4 /*yield*/, service.respondForAdmin(grievanceId, {
                                adminResponse: 'We have reviewed your request.',
                                status: grievance_schema_1.GrievanceStatus.Responded,
                            }, adminUserId)];
                    case 1:
                        saved = _a.sent();
                        expect(saved.status).toBe(grievance_schema_1.GrievanceStatus.Responded);
                        expect(saved.adminResponse).toBe('We have reviewed your request.');
                        expect(lifecycleNotification.notifyGrievanceResponded).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('submits first response as Closed and notifies closed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = buildDoc();
                        chainFindById(doc);
                        saveMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                doc.status = grievance_schema_1.GrievanceStatus.Closed;
                                return [2 /*return*/, doc];
                            });
                        }); });
                        return [4 /*yield*/, service.respondForAdmin(grievanceId, {
                                adminResponse: 'Resolved and closed.',
                                status: grievance_schema_1.GrievanceStatus.Closed,
                            }, adminUserId)];
                    case 1:
                        _a.sent();
                        expect(lifecycleNotification.notifyGrievanceClosed).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('closes an already-responded grievance without changing response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc = buildDoc({
                            adminResponse: 'Prior response',
                            status: grievance_schema_1.GrievanceStatus.Responded,
                        });
                        chainFindById(doc);
                        saveMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, doc];
                        }); }); });
                        return [4 /*yield*/, service.respondForAdmin(grievanceId, {
                                adminResponse: 'Should be ignored',
                                status: grievance_schema_1.GrievanceStatus.Closed,
                            }, adminUserId)];
                    case 1:
                        _a.sent();
                        expect(doc.adminResponse).toBe('Prior response');
                        expect(doc.status).toBe(grievance_schema_1.GrievanceStatus.Closed);
                        expect(lifecycleNotification.notifyGrievanceClosed).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects empty response on first reply', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(buildDoc());
                        return [4 /*yield*/, expect(service.respondForAdmin(grievanceId, { adminResponse: '   ', status: grievance_schema_1.GrievanceStatus.Responded }, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects second Responded when response already exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(buildDoc({
                            adminResponse: 'Already replied',
                            status: grievance_schema_1.GrievanceStatus.Responded,
                        }));
                        return [4 /*yield*/, expect(service.respondForAdmin(grievanceId, {
                                adminResponse: 'Another reply',
                                status: grievance_schema_1.GrievanceStatus.Responded,
                            }, adminUserId)).rejects.toThrow(/already been submitted/i)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects updates on Closed grievances', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(buildDoc({ status: grievance_schema_1.GrievanceStatus.Closed }));
                        return [4 /*yield*/, expect(service.respondForAdmin(grievanceId, {
                                adminResponse: 'Too late',
                                status: grievance_schema_1.GrievanceStatus.Closed,
                            }, adminUserId)).rejects.toBeInstanceOf(common_1.ConflictException)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(service.respondForAdmin(grievanceId, {
                                adminResponse: 'Too late',
                                status: grievance_schema_1.GrievanceStatus.Responded,
                            }, adminUserId)).rejects.toThrow(/closed and cannot be modified/i)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws NotFound when grievance missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainFindById(null);
                        return [4 /*yield*/, expect(service.respondForAdmin(grievanceId, {
                                adminResponse: 'Hello',
                                status: grievance_schema_1.GrievanceStatus.Responded,
                            }, adminUserId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
