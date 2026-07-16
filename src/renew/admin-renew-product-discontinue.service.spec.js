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
var admin_renew_product_discontinue_service_1 = require("./services/admin-renew-product-discontinue.service");
var product_status_constants_1 = require("./constants/product-status.constants");
describe('AdminRenewProductDiscontinueService', function () {
    var urnNo = 'URN-202606020001';
    var adminUserId = new mongoose_1.Types.ObjectId().toHexString();
    var productId = new mongoose_1.Types.ObjectId();
    var findChain;
    var findOneExec;
    var findOneLeanExec;
    var updateOne;
    var auditCreate;
    var auditRecord;
    var resequenceForManufacturerInSession;
    var service;
    beforeEach(function () {
        findChain = {
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn(),
        };
        findOneExec = jest.fn();
        findOneLeanExec = jest.fn();
        updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
        auditCreate = jest.fn().mockResolvedValue({});
        auditRecord = jest.fn().mockResolvedValue(undefined);
        resequenceForManufacturerInSession = jest.fn().mockResolvedValue(2);
        var session = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        var connection = {
            startSession: jest.fn().mockResolvedValue(session),
        };
        var productModel = {
            find: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue(findChain),
                }),
            }),
            findOne: jest.fn().mockImplementation(function () { return ({
                exec: findOneExec,
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({ exec: findOneLeanExec }),
                }),
            }); }),
            updateOne: updateOne,
        };
        service = new admin_renew_product_discontinue_service_1.AdminRenewProductDiscontinueService(productModel, { create: auditCreate }, connection, { resequenceForManufacturerInSession: resequenceForManufacturerInSession }, { record: auditRecord }, {
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
    it('lists only active certified products for URN', function () { return __awaiter(void 0, void 0, void 0, function () {
        var createdDate, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createdDate = new Date('2024-01-15T10:00:00.000Z');
                    findChain.exec.mockResolvedValue([
                        {
                            _id: productId,
                            eoiNo: 'EOI-1',
                            productName: 'Sample',
                            productStatus: 2,
                            createdDate: createdDate,
                        },
                    ]);
                    return [4 /*yield*/, service.listProducts(urnNo)];
                case 1:
                    data = _a.sent();
                    expect(data[0]).toMatchObject({
                        _id: String(productId),
                        eoiNo: 'EOI-1',
                        productStatus: 2,
                        productStatusLabel: 'Certified',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('soft-deletes certified product without changing productStatus', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findOneExec.mockResolvedValue({
                        _id: productId,
                        urnNo: urnNo,
                        eoiNo: 'GPPMI003004',
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                        manufacturerId: new mongoose_1.Types.ObjectId(),
                    });
                    return [4 /*yield*/, service.discontinueProduct(urnNo, String(productId), adminUserId, 'EOL')];
                case 1:
                    result = _a.sent();
                    expect(result).toMatchObject({
                        success: true,
                        productId: String(productId),
                        eoiNo: 'GPPMI003004',
                        productStatus: 2,
                        productStatusLabel: 'Certified',
                        discontinueStatus: 'discontinued',
                        discontinueStatusLabel: 'Discontinued',
                        isDeleted: true,
                    });
                    expect(updateOne).toHaveBeenCalledWith({ _id: productId }, {
                        $set: expect.objectContaining({
                            is_deleted: true,
                            deleted_at: expect.any(Date),
                            discontinuedAt: expect.any(Date),
                            discontinueReason: 'EOL',
                        }),
                    }, expect.objectContaining({ session: expect.anything() }));
                    expect(resequenceForManufacturerInSession).toHaveBeenCalled();
                    expect(updateOne.mock.calls[0][1].$set).not.toHaveProperty('productStatus');
                    expect(auditCreate).toHaveBeenCalledWith([
                        expect.objectContaining({
                            fromStatus: 2,
                            toStatus: 2,
                            reason: 'EOL',
                        }),
                    ], expect.objectContaining({ session: expect.anything() }));
                    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({
                        new_values: expect.objectContaining({
                            productStatus: 2,
                            productStatusLabel: 'Certified',
                            discontinueStatus: 'discontinued',
                            discontinueStatusLabel: 'Discontinued',
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects discontinue when currentStatus is not certified', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(service.toggleProductStatus(urnNo, String(productId), product_status_constants_1.PRODUCT_STATUS_PENDING, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns 409 when product is already soft-deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findOneLeanExec.mockResolvedValue({
                        is_deleted: true,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                    });
                    return [4 /*yield*/, expect(service.toggleProductStatus(urnNo, String(productId), product_status_constants_1.PRODUCT_STATUS_CERTIFIED, adminUserId)).rejects.toBeInstanceOf(common_1.ConflictException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns 404 when product is not under urnNo', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findOneExec.mockResolvedValue(null);
                    return [4 /*yield*/, expect(service.discontinueProduct(urnNo, String(productId), adminUserId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects bulk reactivate', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(service.bulkReactivate(urnNo, [String(productId)], adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
