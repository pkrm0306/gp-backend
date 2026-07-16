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
var mongoose_1 = require("mongoose");
var process_renew_product_performance_service_1 = require("./process-renew-product-performance.service");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
describe('ProcessRenewProductPerformanceService storage rules', function () {
    var urnNo = 'URN-TEST-001';
    var vendorId = new mongoose_1.Types.ObjectId().toHexString();
    var cycleId = new mongoose_1.Types.ObjectId();
    function createHarness() {
        var renewTestReportDeleteMany = jest.fn().mockReturnValue({ session: jest.fn() });
        var renewTestReportInsertMany = jest.fn().mockResolvedValue([]);
        var renewTestReportFind = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue([
                        {
                            productName: 'A',
                            testReportFileName: 'r1',
                            eoiNo: 'EOI-1',
                        },
                        {
                            productName: 'B',
                            testReportFileName: 'r2',
                            eoiNo: 'EOI-2',
                        },
                    ]),
                }),
            }),
        });
        var renewPerformanceDeleteMany = jest.fn().mockResolvedValue({});
        var renewPerformanceFindOne = jest.fn().mockReturnValue({
            session: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            }),
        });
        var renewPerformanceFindOneAndUpdate = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({}),
        });
        var renewDocumentFind = jest.fn().mockReturnValue({
            session: jest.fn().mockResolvedValue([]),
        });
        var renewDocumentCountDocuments = jest.fn().mockReturnValue({
            session: jest.fn().mockResolvedValue(0),
        });
        var renewalCycleModel = {
            findById: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    _id: cycleId,
                    urnNo: urnNo,
                    status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                }),
            }),
        };
        var productModel = {
            findOne: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue({
                            vendorId: new mongoose_1.Types.ObjectId(),
                            manufacturerId: new mongoose_1.Types.ObjectId(),
                        }),
                    }),
                }),
            }),
            find: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        lean: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([
                                { eoiNo: 'EOI-1', productName: 'Product 1' },
                            ]),
                        }),
                    }),
                }),
            }),
            exists: jest.fn().mockResolvedValue(true),
        };
        var connection = {
            startSession: jest.fn().mockResolvedValue({
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                abortTransaction: jest.fn(),
                endSession: jest.fn(),
            }),
        };
        var service = new process_renew_product_performance_service_1.ProcessRenewProductPerformanceService({
            deleteMany: renewPerformanceDeleteMany,
            findOne: renewPerformanceFindOne,
            findOneAndUpdate: renewPerformanceFindOneAndUpdate,
            find: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
            }),
        }, {
            deleteMany: renewTestReportDeleteMany,
            insertMany: renewTestReportInsertMany,
            find: renewTestReportFind,
        }, {
            find: renewDocumentFind,
            countDocuments: renewDocumentCountDocuments,
            updateMany: jest.fn().mockReturnValue({ session: jest.fn() }),
            insertMany: jest.fn().mockReturnValue({ session: jest.fn() }),
        }, renewalCycleModel, productModel, connection, {
            getProcessRenewProductPerformanceId: jest.fn().mockResolvedValue(100),
            getProcessRenewProductPerformanceTestReportId: jest
                .fn()
                .mockResolvedValue(1),
            getRenewProductDocumentId: jest.fn().mockResolvedValue(201),
        }, { trackProductDocumentBatch: jest.fn(), trackProductDocumentDeleteBatch: jest.fn() });
        return {
            service: service,
            renewTestReportDeleteMany: renewTestReportDeleteMany,
            renewTestReportInsertMany: renewTestReportInsertMany,
            renewPerformanceDeleteMany: renewPerformanceDeleteMany,
        };
    }
    it('replaces test report rows for urn+cycle (delete then insert)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, renewTestReportDeleteMany, renewTestReportInsertMany;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createHarness(), service = _a.service, renewTestReportDeleteMany = _a.renewTestReportDeleteMany, renewTestReportInsertMany = _a.renewTestReportInsertMany;
                    jest.spyOn(service, 'getFormPayloadByUrn').mockResolvedValue({
                        urnNo: urnNo,
                        renewalCycleId: String(cycleId),
                        testReports: [],
                        testReportFiles: 0,
                    });
                    return [4 /*yield*/, service.save({
                            urnNo: urnNo,
                            renewalCycleId: String(cycleId),
                            testReports: [
                                { productName: 'A', testReportFileName: 'r1', eoiNo: 'EOI-1' },
                                { productName: 'B', testReportFileName: 'r2', eoiNo: 'EOI-2' },
                            ],
                        })];
                case 1:
                    _b.sent();
                    expect(renewTestReportDeleteMany).toHaveBeenCalledWith(expect.objectContaining({
                        urnNo: urnNo,
                        renewalCycleId: cycleId,
                    }), expect.any(Object));
                    expect(renewTestReportInsertMany).toHaveBeenCalledWith(expect.arrayContaining([
                        expect.objectContaining({ productName: 'A', testReportFileName: 'r1' }),
                        expect.objectContaining({ productName: 'B', testReportFileName: 'r2' }),
                    ]), expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    it('purges legacy per-EOI performance rows before cycle header upsert', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, renewPerformanceDeleteMany;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createHarness(), service = _a.service, renewPerformanceDeleteMany = _a.renewPerformanceDeleteMany;
                    jest.spyOn(service, 'getFormPayloadByUrn').mockResolvedValue({
                        urnNo: urnNo,
                        renewalCycleId: String(cycleId),
                        testReports: [],
                        testReportFiles: 0,
                    });
                    return [4 /*yield*/, service.save({
                            urnNo: urnNo,
                            renewalCycleId: String(cycleId),
                            testReports: [],
                        })];
                case 1:
                    _b.sent();
                    expect(renewPerformanceDeleteMany).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('GET uses child collection as authoritative testReports source', function () { return __awaiter(void 0, void 0, void 0, function () {
        var harness, loadSpy, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    harness = createHarness();
                    harness.service.renewPerformanceModel.findOne = jest.fn().mockReturnValue({
                        sort: jest.fn().mockReturnValue({
                            lean: jest.fn().mockReturnValue({
                                exec: jest.fn().mockResolvedValue(null),
                            }),
                        }),
                        lean: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue(null),
                        }),
                    });
                    harness.service.productModel.find = jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            sort: jest.fn().mockReturnValue({
                                lean: jest.fn().mockReturnValue({
                                    exec: jest.fn().mockResolvedValue([
                                        { eoiNo: 'EOI-1', productName: 'Product 1', productStatus: 2 },
                                    ]),
                                }),
                            }),
                        }),
                    });
                    harness.service.renewDocumentModel.find = jest.fn().mockReturnValue({
                        lean: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([]),
                        }),
                    });
                    loadSpy = jest
                        .spyOn(process_renew_product_performance_service_1.ProcessRenewProductPerformanceService.prototype, 'loadAuthoritativeTestReports')
                        .mockResolvedValue([
                        { productName: 'Only', testReportFileName: 'saved', eoiNo: 'EOI-1' },
                    ]);
                    jest
                        .spyOn(harness.service, 'resolveRenewalCycleForRead')
                        .mockResolvedValue({ _id: cycleId, urnNo: urnNo });
                    return [4 /*yield*/, harness.service.getFormPayloadByUrn(urnNo, String(cycleId))];
                case 1:
                    payload = _a.sent();
                    expect(loadSpy).toHaveBeenCalled();
                    expect(payload.testReports).toEqual([
                        { productName: 'Only', testReportFileName: 'saved', eoiNo: 'EOI-1' },
                    ]);
                    loadSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    it('GET returns embedded header testReports when child table is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
        var harness, header, findOneCall, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    harness = createHarness();
                    header = {
                        _id: 'hdr',
                        processRenewProductPerformanceId: 3,
                        urnNo: urnNo,
                        renewalCycleId: cycleId,
                        productPerformanceStatus: 0,
                        renewalType: 1,
                        testReportFiles: 0,
                        testReports: [
                            {
                                productName: 'kkjjdsdjksd',
                                testReportFileName: '',
                                eoiNo: 'GPPMI003026',
                            },
                        ],
                    };
                    findOneCall = 0;
                    harness.service.renewPerformanceModel.findOne = jest
                        .fn()
                        .mockImplementation(function () { return ({
                        sort: jest.fn().mockReturnValue({
                            lean: jest.fn().mockReturnValue({
                                exec: jest.fn().mockResolvedValue(findOneCall++ === 0 ? header : null),
                            }),
                        }),
                        lean: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue(header),
                        }),
                    }); });
                    harness.service.renewTestReportModel.find = jest.fn().mockReturnValue({
                        sort: jest.fn().mockReturnValue({
                            lean: jest.fn().mockReturnValue({
                                exec: jest.fn().mockResolvedValue([]),
                            }),
                        }),
                    });
                    harness.service.productModel.find = jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            sort: jest.fn().mockReturnValue({
                                lean: jest.fn().mockReturnValue({
                                    exec: jest.fn().mockResolvedValue([
                                        {
                                            eoiNo: 'GPPMI003026',
                                            productName: 'Test Product 2',
                                            productStatus: 2,
                                        },
                                    ]),
                                }),
                            }),
                        }),
                    });
                    harness.service.renewDocumentModel.find = jest.fn().mockReturnValue({
                        lean: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([]),
                        }),
                    });
                    jest
                        .spyOn(harness.service, 'resolveRenewalCycleForRead')
                        .mockResolvedValue({ _id: cycleId, urnNo: urnNo });
                    jest
                        .spyOn(harness.service, 'resolveRenewalCycleForRead')
                        .mockResolvedValue({ _id: cycleId, urnNo: urnNo });
                    return [4 /*yield*/, harness.service.getFormPayloadByUrn(urnNo, String(cycleId))];
                case 1:
                    payload = _a.sent();
                    expect(payload.testReports).toEqual([
                        {
                            productName: 'kkjjdsdjksd',
                            testReportFileName: '',
                            eoiNo: 'GPPMI003026',
                        },
                    ]);
                    expect(payload.product_performance.testReports).toHaveLength(1);
                    expect(payload.testReportFiles).toBeGreaterThanOrEqual(1);
                    expect(payload.rows[0].testReports).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
