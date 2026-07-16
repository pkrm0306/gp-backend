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
var mongoose_1 = require("mongoose");
var product_registration_service_1 = require("./product-registration.service");
describe('ProductRegistrationService.adminUpdateUrnStatus', function () {
    var vendorId = new mongoose_1.Types.ObjectId();
    var manufacturerId = new mongoose_1.Types.ObjectId();
    var baseProducts = [
        {
            urnNo: 'URN-202604010001',
            vendorId: vendorId,
            manufacturerId: manufacturerId,
            urnStatus: 10,
            productName: 'Test Product',
        },
    ];
    function createServiceHarness() {
        var updateExec = jest.fn().mockResolvedValue({ acknowledged: true });
        var updateMany = jest.fn().mockReturnValue({
            exec: updateExec,
        });
        var findExec = jest.fn().mockResolvedValue(baseProducts);
        var find = jest.fn().mockReturnValue({
            lean: function () { return ({ exec: findExec }); },
        });
        var session = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn().mockResolvedValue(undefined),
            abortTransaction: jest.fn().mockResolvedValue(undefined),
            endSession: jest.fn(),
        };
        var startSession = jest.fn().mockResolvedValue(session);
        var service = Object.create(product_registration_service_1.ProductRegistrationService.prototype);
        var serviceAny = service;
        serviceAny.productModel = { find: find, updateMany: updateMany };
        serviceAny.connection = { startSession: startSession };
        serviceAny.tryLogUrnLifecycleStep = jest.fn().mockResolvedValue(undefined);
        serviceAny.syncUrnProductsToZohoDeal = jest.fn().mockResolvedValue(undefined);
        serviceAny.syncDocumentReviewedStatusToZohoDeal = jest
            .fn()
            .mockResolvedValue(undefined);
        serviceAny.urnTabReviewService = {
            ensurePendingReviewsForUrn: jest.fn().mockResolvedValue(undefined),
        };
        serviceAny.manufacturerModel = {
            findById: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue({
                            manufacturerName: 'Acme Co',
                            vendor_email: 'vendor@example.com',
                        }),
                    }),
                }),
            }),
        };
        serviceAny.lifecycleNotification = {
            notifyUrnInitialApproved: jest.fn().mockResolvedValue(undefined),
            notifyUrnRegistrationRejected: jest.fn().mockResolvedValue(undefined),
            notifyProductCertified: jest.fn().mockResolvedValue(undefined),
            notifyProductRejected: jest.fn().mockResolvedValue(undefined),
        };
        serviceAny.invalidateProductListingsCache = jest
            .fn()
            .mockResolvedValue(undefined);
        serviceAny.logger = { warn: jest.fn(), log: jest.fn(), debug: jest.fn() };
        return {
            service: service,
            find: find,
            updateMany: updateMany,
            updateExec: updateExec,
            session: session,
        };
    }
    it('rejects urn_status 12 when URN is already in renewal workflow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, find;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, find = _a.find;
                    find.mockReturnValue({
                        lean: function () { return ({
                            exec: jest.fn().mockResolvedValue([
                                {
                                    urnNo: 'URN-202604010001',
                                    urnStatus: 12,
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    productName: 'Test Product',
                                },
                            ]),
                        }); },
                    });
                    return [4 /*yield*/, expect(service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 14,
                        })).rejects.toThrow(/PATCH \/renew\/urn-status/)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('accepts cert urn_status 6 and persists urnStatus', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, updateMany, find, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, updateMany = _a.updateMany, find = _a.find;
                    find.mockReturnValue({
                        lean: function () { return ({
                            exec: jest.fn().mockResolvedValue([
                                {
                                    urnNo: 'URN-202604010001',
                                    urnStatus: 6,
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    productName: 'Test Product',
                                },
                            ]),
                        }); },
                    });
                    return [4 /*yield*/, service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 7,
                        })];
                case 1:
                    result = _b.sent();
                    expect(updateMany).toHaveBeenCalledWith({ urnNo: 'URN-202604010001' }, expect.objectContaining({
                        $set: expect.objectContaining({ urnStatus: 7 }),
                    }), expect.any(Object));
                    expect(result).toEqual({ urnNo: 'URN-202604010001', urnStatus: 7 });
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects renewal urn_status 12–17 on cert admin route', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, find;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, find = _a.find;
                    find.mockReturnValue({
                        lean: function () { return ({
                            exec: jest.fn().mockResolvedValue([
                                {
                                    urnNo: 'URN-202604010001',
                                    urnStatus: 15,
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    productName: 'Test Product',
                                },
                            ]),
                        }); },
                    });
                    return [4 /*yield*/, expect(service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 17,
                        })).rejects.toThrow(/PATCH \/renew\/urn-status/)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('still accepts existing urn_status <=11', function () { return __awaiter(void 0, void 0, void 0, function () {
        var service;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    service = createServiceHarness().service;
                    return [4 /*yield*/, expect(service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 11,
                        })).resolves.toEqual({ urnNo: 'URN-202604010001', urnStatus: 11 })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects invalid urn_status values outside 0..17', function () { return __awaiter(void 0, void 0, void 0, function () {
        var service;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    service = createServiceHarness().service;
                    return [4 /*yield*/, expect(service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: -1,
                        })).rejects.toThrow(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, expect(service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 99,
                        })).rejects.toThrow('updateStatusTo must be between 0 and 17 for urn_status')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('keeps product_status behavior unchanged (0..3 only)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, updateMany;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, updateMany = _a.updateMany;
                    return [4 /*yield*/, expect(service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'product_status',
                            updateStatusTo: 3,
                        })).resolves.toEqual({ urnNo: 'URN-202604010001', productStatus: 3 })];
                case 1:
                    _b.sent();
                    expect(updateMany).toHaveBeenCalledWith({ urnNo: 'URN-202604010001' }, expect.objectContaining({
                        $set: expect.objectContaining({ productStatus: 3 }),
                    }), expect.any(Object));
                    return [4 /*yield*/, expect(service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'product_status',
                            updateStatusTo: 4,
                        })).rejects.toThrow('updateStatusTo must be between 0 and 3 for product_status')];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('notifies product certified when product_status becomes 2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var service, notifyProductCertified;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    service = createServiceHarness().service;
                    notifyProductCertified = service.lifecycleNotification
                        .notifyProductCertified;
                    return [4 /*yield*/, service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'product_status',
                            updateStatusTo: 2,
                        })];
                case 1:
                    _a.sent();
                    expect(notifyProductCertified).toHaveBeenCalledWith(expect.objectContaining({
                        manufacturerId: manufacturerId.toString(),
                        urnNo: 'URN-202604010001',
                        productName: 'Test Product',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('notifies product rejected when product_status becomes 3', function () { return __awaiter(void 0, void 0, void 0, function () {
        var service, notifyProductRejected;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    service = createServiceHarness().service;
                    notifyProductRejected = service.lifecycleNotification
                        .notifyProductRejected;
                    return [4 /*yield*/, service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'product_status',
                            updateStatusTo: 3,
                        })];
                case 1:
                    _a.sent();
                    expect(notifyProductRejected).toHaveBeenCalledWith(expect.objectContaining({
                        manufacturerId: manufacturerId.toString(),
                        urnNo: 'URN-202604010001',
                        productName: 'Test Product',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('notifies registration rejected when product_status becomes 3 at initial stage', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, find, notifyUrnRegistrationRejected;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, find = _a.find;
                    find.mockReturnValue({
                        lean: function () { return ({
                            exec: jest.fn().mockResolvedValue([
                                {
                                    urnNo: 'URN-202604010001',
                                    urnStatus: 0,
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    productName: 'Test Product',
                                },
                            ]),
                        }); },
                    });
                    notifyUrnRegistrationRejected = service.lifecycleNotification
                        .notifyUrnRegistrationRejected;
                    return [4 /*yield*/, service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'product_status',
                            updateStatusTo: 3,
                        })];
                case 1:
                    _b.sent();
                    expect(notifyUrnRegistrationRejected).toHaveBeenCalledWith(expect.objectContaining({
                        manufacturerId: manufacturerId.toString(),
                        urnNo: 'URN-202604010001',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('notifies urn initial approved when urn_status becomes 1 from 0 (legacy approve)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, find, notifyUrnInitialApproved;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, find = _a.find;
                    find.mockReturnValue({
                        lean: function () { return ({
                            exec: jest.fn().mockResolvedValue([
                                {
                                    urnNo: 'URN-202604010001',
                                    urnStatus: 0,
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    productName: 'Test Product',
                                },
                            ]),
                        }); },
                    });
                    notifyUrnInitialApproved = service.lifecycleNotification
                        .notifyUrnInitialApproved;
                    return [4 /*yield*/, service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 1,
                        })];
                case 1:
                    _b.sent();
                    expect(notifyUrnInitialApproved).toHaveBeenCalledWith(expect.objectContaining({
                        manufacturerId: manufacturerId.toString(),
                        urnNo: 'URN-202604010001',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('notifies urn initial approved when urn_status becomes 2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, find, notifyUrnInitialApproved;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, find = _a.find;
                    find.mockReturnValue({
                        lean: function () { return ({
                            exec: jest.fn().mockResolvedValue([
                                {
                                    urnNo: 'URN-202604010001',
                                    urnStatus: 0,
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    productName: 'Test Product',
                                },
                            ]),
                        }); },
                    });
                    notifyUrnInitialApproved = service.lifecycleNotification
                        .notifyUrnInitialApproved;
                    return [4 /*yield*/, service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 2,
                        })];
                case 1:
                    _b.sent();
                    expect(notifyUrnInitialApproved).toHaveBeenCalledWith(expect.objectContaining({
                        manufacturerId: manufacturerId.toString(),
                        urnNo: 'URN-202604010001',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not notify initial approval when urn_status goes 1 to 2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, find, notifyUrnInitialApproved;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, find = _a.find;
                    find.mockReturnValue({
                        lean: function () { return ({
                            exec: jest.fn().mockResolvedValue([
                                {
                                    urnNo: 'URN-202604010001',
                                    urnStatus: 1,
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    productName: 'Test Product',
                                },
                            ]),
                        }); },
                    });
                    notifyUrnInitialApproved = service.lifecycleNotification
                        .notifyUrnInitialApproved;
                    return [4 /*yield*/, service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 2,
                        })];
                case 1:
                    _b.sent();
                    expect(notifyUrnInitialApproved).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('notifies product certified when urn_status becomes 11 (non-renewal)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, find, notifyProductCertified;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createServiceHarness(), service = _a.service, find = _a.find;
                    find.mockReturnValue({
                        lean: function () { return ({
                            exec: jest.fn().mockResolvedValue([
                                {
                                    urnNo: 'URN-202604010001',
                                    urnStatus: 10,
                                    productRenewStatus: 0,
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    productName: 'Test Product',
                                },
                            ]),
                        }); },
                    });
                    notifyProductCertified = service.lifecycleNotification
                        .notifyProductCertified;
                    return [4 /*yield*/, service.adminUpdateUrnStatus({
                            urnNo: 'URN-202604010001',
                            updateStatusType: 'urn_status',
                            updateStatusTo: 11,
                        })];
                case 1:
                    _b.sent();
                    expect(notifyProductCertified).toHaveBeenCalledWith(expect.objectContaining({
                        manufacturerId: manufacturerId.toString(),
                        urnNo: 'URN-202604010001',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
