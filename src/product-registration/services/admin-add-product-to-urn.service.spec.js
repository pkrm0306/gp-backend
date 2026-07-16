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
var admin_add_product_to_urn_service_1 = require("./admin-add-product-to-urn.service");
describe('AdminAddProductToUrnService', function () {
    var urnNo = 'URN-20260528142848';
    var adminUserId = new mongoose_1.Types.ObjectId().toHexString();
    var categoryId = new mongoose_1.Types.ObjectId();
    var manufacturerId = new mongoose_1.Types.ObjectId();
    var vendorId = new mongoose_1.Types.ObjectId();
    var productObjectId = new mongoose_1.Types.ObjectId();
    var findLeanExec;
    var countDocuments;
    var categoryFindById;
    var manufacturerFindById;
    var assignNextActiveEoiNo;
    var getProductId;
    var getProductPlantId;
    var productCreate;
    var plantCreate;
    var plantFind;
    var auditRecord;
    var startSession;
    var certificationPaymentCount;
    var service;
    var countryId;
    var stateId;
    beforeEach(function () {
        countryId = new mongoose_1.Types.ObjectId().toHexString();
        stateId = new mongoose_1.Types.ObjectId().toHexString();
        findLeanExec = jest.fn().mockResolvedValue([
            {
                _id: productObjectId,
                categoryId: categoryId,
                manufacturerId: manufacturerId,
                vendorId: vendorId,
                urnStatus: 1,
                productStatus: 0,
                productRenewStatus: 0,
            },
        ]);
        countDocuments = jest.fn().mockResolvedValue(1);
        categoryFindById = jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue({ categoryName: 'Copper Tubes' }),
            }),
        });
        manufacturerFindById = jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue({ manufacturerName: 'prabha vendor' }),
            }),
        });
        assignNextActiveEoiNo = jest.fn().mockResolvedValue({
            eoiNo: 'GPPMI003006',
            eoiSequence: 6,
        });
        getProductId = jest.fn().mockResolvedValue(501);
        getProductPlantId = jest.fn().mockResolvedValue(9001);
        productCreate = jest.fn().mockResolvedValue([
            { _id: new mongoose_1.Types.ObjectId(), productId: 501 },
        ]);
        plantCreate = jest.fn().mockResolvedValue([]);
        plantFind = jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue([]),
                    }),
                }),
            }),
        });
        auditRecord = jest.fn().mockResolvedValue(undefined);
        certificationPaymentCount = jest.fn().mockResolvedValue(0);
        var session = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        startSession = jest.fn().mockResolvedValue(session);
        service = new admin_add_product_to_urn_service_1.AdminAddProductToUrnService({
            find: jest.fn().mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({ exec: findLeanExec }),
                }),
            }),
            countDocuments: jest.fn().mockReturnValue({ exec: countDocuments }),
            create: productCreate,
        }, {
            find: plantFind,
            create: plantCreate,
        }, { findById: categoryFindById }, { findById: manufacturerFindById }, {
            startSession: startSession,
            db: {
                collection: jest.fn().mockReturnValue({
                    countDocuments: certificationPaymentCount,
                }),
            },
        }, { assignNextActiveEoiNo: assignNextActiveEoiNo }, {
            getProductId: getProductId,
            getProductPlantId: getProductPlantId,
        }, {
            findById: jest.fn().mockResolvedValue({ _id: countryId }),
        }, {
            findById: jest.fn().mockResolvedValue({ countryId: countryId }),
        }, { record: auditRecord }, {
            deleteByPattern: jest.fn().mockResolvedValue(undefined),
            buildKey: jest.fn(function () {
                var parts = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parts[_i] = arguments[_i];
                }
                return parts.join(':');
            }),
        });
    });
    it('returns context for eligible URN', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getAddProductContext(urnNo)];
                case 1:
                    result = _a.sent();
                    expect(result.canAddProduct).toBe(true);
                    expect(result.categoryName).toBe('Copper Tubes');
                    expect(result.urnStatus).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws 404 when URN has no active products', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findLeanExec.mockResolvedValue([]);
                    return [4 /*yield*/, expect(service.getAddProductContext(urnNo)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('adds product with next active EOI', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.addProductToUrn(urnNo, {
                        productName: 'New solar panel model',
                        productDetails: 'desc',
                        plants: [
                            {
                                plantName: 'Plant A',
                                plantLocation: '123 Industrial Area',
                                countryId: countryId,
                                stateId: stateId,
                                city: 'Hyderabad',
                            },
                        ],
                    }, adminUserId)];
                case 1:
                    result = _a.sent();
                    expect(result.eoiNo).toBe('GPPMI003006');
                    expect(result.urnStatus).toBe(1);
                    expect(result.productStatus).toBe(0);
                    expect(assignNextActiveEoiNo).toHaveBeenCalled();
                    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({ action: 'admin_add_product_to_urn' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('blocks add-product when certification fee exists', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    certificationPaymentCount.mockResolvedValue(1);
                    return [4 /*yield*/, expect(service.addProductToUrn(urnNo, {
                            productName: 'Late product',
                            productDetails: 'desc',
                            plants: [
                                {
                                    plantName: 'Plant A',
                                    plantLocation: '123 Industrial Area',
                                    countryId: countryId,
                                    stateId: stateId,
                                    city: 'Hyderabad',
                                },
                            ],
                        }, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects wrong categoryId in body', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(service.addProductToUrn(urnNo, {
                        productName: 'x',
                        productDetails: 'y',
                        categoryId: new mongoose_1.Types.ObjectId().toHexString(),
                        plants: [
                            {
                                plantName: 'Plant A',
                                plantLocation: 'loc',
                                countryId: new mongoose_1.Types.ObjectId().toHexString(),
                                stateId: new mongoose_1.Types.ObjectId().toHexString(),
                                city: 'Hyderabad',
                            },
                        ],
                    }, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
