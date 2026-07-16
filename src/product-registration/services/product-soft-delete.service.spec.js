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
var product_soft_delete_service_1 = require("./product-soft-delete.service");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
describe('ProductSoftDeleteService', function () {
    var manufacturerId = new mongoose_1.Types.ObjectId().toHexString();
    var productObjectId = new mongoose_1.Types.ObjectId();
    var deletedByUserId = new mongoose_1.Types.ObjectId().toHexString();
    var productFindByIdLean;
    var productFindOneSessionExec;
    var productUpdateOneExec;
    var plantUpdateManyExec;
    var resequenceSpy;
    var service;
    beforeEach(function () {
        productFindByIdLean = jest.fn().mockResolvedValue({
            _id: productObjectId,
            manufacturerId: new mongoose_1.Types.ObjectId(manufacturerId),
            is_deleted: false,
            productStatus: product_status_constants_1.PRODUCT_STATUS_PENDING,
        });
        productFindOneSessionExec = jest.fn().mockResolvedValue({
            _id: productObjectId,
            productStatus: product_status_constants_1.PRODUCT_STATUS_PENDING,
        });
        productUpdateOneExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
        plantUpdateManyExec = jest.fn().mockResolvedValue({ modifiedCount: 2 });
        var session = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        service = new product_soft_delete_service_1.ProductSoftDeleteService({
            findById: jest.fn().mockReturnValue({ lean: function () { return ({ exec: productFindByIdLean }); } }),
            findOne: jest.fn().mockReturnValue({
                session: jest.fn().mockReturnValue({ exec: productFindOneSessionExec }),
            }),
            updateOne: jest.fn().mockReturnValue({ exec: productUpdateOneExec }),
        }, {
            updateMany: jest.fn().mockReturnValue({ exec: plantUpdateManyExec }),
        }, {
            startSession: jest.fn().mockResolvedValue(session),
        }, { findById: jest.fn().mockResolvedValue({ _id: manufacturerId }) }, { buildEoiNo: jest.fn() }, {
            deleteByPattern: jest.fn().mockResolvedValue(undefined),
            buildKey: jest.fn(function () {
                var parts = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parts[_i] = arguments[_i];
                }
                return parts.join(':');
            }),
        });
        resequenceSpy = jest
            .spyOn(service, 'resequenceActiveEoisForManufacturer')
            .mockResolvedValue(3);
    });
    afterEach(function () {
        resequenceSpy.mockRestore();
    });
    it('re-sequences EOIs when deleting an uncertified (pending) product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.softDeleteProduct(productObjectId.toHexString(), deletedByUserId)];
                case 1:
                    result = _a.sent();
                    expect(resequenceSpy).toHaveBeenCalled();
                    expect(result.updated_sequence_count).toBe(3);
                    expect(result.message).toContain('sequences rearranged');
                    return [2 /*return*/];
            }
        });
    }); });
    it('re-sequences EOIs when deleting a submitted product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productFindByIdLean.mockResolvedValue({
                        _id: productObjectId,
                        manufacturerId: new mongoose_1.Types.ObjectId(manufacturerId),
                        is_deleted: false,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_SUBMITTED,
                    });
                    productFindOneSessionExec.mockResolvedValue({
                        _id: productObjectId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_SUBMITTED,
                    });
                    return [4 /*yield*/, service.softDeleteProduct(productObjectId.toHexString(), deletedByUserId)];
                case 1:
                    result = _a.sent();
                    expect(resequenceSpy).toHaveBeenCalled();
                    expect(result.updated_sequence_count).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips re-sequencing when deleting a certified product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productFindByIdLean.mockResolvedValue({
                        _id: productObjectId,
                        manufacturerId: new mongoose_1.Types.ObjectId(manufacturerId),
                        is_deleted: false,
                        productStatus: 2,
                    });
                    productFindOneSessionExec.mockResolvedValue({
                        _id: productObjectId,
                        productStatus: 2,
                    });
                    return [4 /*yield*/, service.softDeleteProduct(productObjectId.toHexString(), deletedByUserId)];
                case 1:
                    result = _a.sent();
                    expect(resequenceSpy).not.toHaveBeenCalled();
                    expect(result.updated_sequence_count).toBe(0);
                    expect(result.message).toBe('EOI deleted successfully');
                    return [2 /*return*/];
            }
        });
    }); });
});
