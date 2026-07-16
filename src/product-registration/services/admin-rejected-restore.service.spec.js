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
var admin_rejected_restore_service_1 = require("./admin-rejected-restore.service");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
describe('AdminRejectedRestoreService', function () {
    var urnNo = 'URN-20260428123027';
    var adminUserId = new mongoose_1.Types.ObjectId().toHexString();
    var productObjectId = new mongoose_1.Types.ObjectId();
    var manufacturerId = new mongoose_1.Types.ObjectId();
    var findOneExec;
    var findLeanExec;
    var countDocuments;
    var updateOne;
    var productStatusAuditCreate;
    var auditRecord;
    var assignNextActiveEoiNo;
    var applyEoiReassignment;
    var getMaxActiveSequenceSuffix;
    var startSession;
    var service;
    beforeEach(function () {
        findOneExec = jest.fn();
        findLeanExec = jest.fn();
        countDocuments = jest.fn().mockResolvedValue(0);
        updateOne = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        });
        productStatusAuditCreate = jest.fn().mockResolvedValue({});
        auditRecord = jest.fn().mockResolvedValue(undefined);
        assignNextActiveEoiNo = jest.fn().mockResolvedValue({
            eoiNo: 'GPPMI003006',
            eoiSequence: 6,
            previousEoiNo: 'GPPMI003003',
        });
        applyEoiReassignment = jest.fn().mockResolvedValue(undefined);
        getMaxActiveSequenceSuffix = jest.fn().mockResolvedValue(5);
        var session = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        startSession = jest.fn().mockResolvedValue(session);
        var productModel = {
            findOne: jest.fn().mockReturnValue({ exec: findOneExec }),
            find: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        lean: jest.fn().mockReturnValue({ exec: findLeanExec }),
                    }),
                }),
            }),
            countDocuments: jest.fn().mockReturnValue({ exec: countDocuments }),
            updateOne: updateOne,
        };
        service = new admin_rejected_restore_service_1.AdminRejectedRestoreService(productModel, { create: productStatusAuditCreate }, { startSession: startSession }, {
            assignNextActiveEoiNo: assignNextActiveEoiNo,
            applyEoiReassignment: applyEoiReassignment,
            getMaxActiveSequenceSuffix: getMaxActiveSequenceSuffix,
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
    describe('getRestoreOptions', function () {
        it('allows uncertified only when URN has no certified products', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        countDocuments
                            .mockResolvedValueOnce(0)
                            .mockResolvedValueOnce(2);
                        return [4 /*yield*/, service.getRestoreOptions(urnNo)];
                    case 1:
                        result = _a.sent();
                        expect(result.allowedTargets).toEqual(['uncertified']);
                        expect(result.rejectedProductCount).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('allows certified only when URN has certified products', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        countDocuments
                            .mockResolvedValueOnce(1)
                            .mockResolvedValueOnce(1);
                        return [4 /*yield*/, service.getRestoreOptions(urnNo)];
                    case 1:
                        result = _a.sent();
                        expect(result.allowedTargets).toEqual(['certified']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('restoreProduct', function () {
        it('assigns new eoiNo on restore to uncertified', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findOneExec.mockResolvedValue({
                            _id: productObjectId,
                            eoiNo: 'GPPMI003003',
                            productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED,
                            manufacturerId: manufacturerId,
                        });
                        countDocuments.mockResolvedValue(0);
                        return [4 /*yield*/, service.restoreProduct(urnNo, productObjectId.toHexString(), product_status_constants_1.PRODUCT_STATUS_PENDING, adminUserId)];
                    case 1:
                        result = _a.sent();
                        expect(result.previousEoiNo).toBe('GPPMI003003');
                        expect(result.eoiNo).toBe('GPPMI003006');
                        expect(assignNextActiveEoiNo).toHaveBeenCalledWith(String(manufacturerId), expect.any(Object), { previousEoiNo: 'GPPMI003003' });
                        expect(applyEoiReassignment).toHaveBeenCalled();
                        expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({ action: 'eoi_reassigned_on_restore' }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('blocks uncertified restore when URN has certified products', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findOneExec.mockResolvedValue({
                            _id: productObjectId,
                            eoiNo: 'GPPMI003803',
                            productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED,
                            manufacturerId: manufacturerId,
                        });
                        countDocuments.mockResolvedValue(1);
                        return [4 /*yield*/, expect(service.restoreProduct(urnNo, productObjectId.toHexString(), product_status_constants_1.PRODUCT_STATUS_PENDING, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('blocks certified restore when URN has no certified products', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findOneExec.mockResolvedValue({
                            _id: productObjectId,
                            eoiNo: 'GPPMI003003',
                            productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED,
                            manufacturerId: manufacturerId,
                        });
                        countDocuments.mockResolvedValue(0);
                        return [4 /*yield*/, expect(service.restoreProduct(urnNo, productObjectId.toHexString(), product_status_constants_1.PRODUCT_STATUS_CERTIFIED, adminUserId)).rejects.toBeInstanceOf(common_1.BadRequestException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws 409 when product is not rejected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findOneExec.mockResolvedValue({
                            _id: productObjectId,
                            eoiNo: 'GPPMI003803',
                            productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                            manufacturerId: manufacturerId,
                        });
                        return [4 /*yield*/, expect(service.restoreProduct(urnNo, productObjectId.toHexString(), product_status_constants_1.PRODUCT_STATUS_CERTIFIED, adminUserId)).rejects.toBeInstanceOf(common_1.ConflictException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('restoreUrn', function () {
        it('restores all rejected products to uncertified with sequential new EOIs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findLeanExec.mockResolvedValue([
                            {
                                _id: productObjectId,
                                eoiNo: 'GPPMI003003',
                                manufacturerId: manufacturerId,
                            },
                        ]);
                        countDocuments.mockResolvedValue(0);
                        return [4 /*yield*/, service.restoreUrn(urnNo, product_status_constants_1.PRODUCT_STATUS_PENDING, adminUserId)];
                    case 1:
                        result = _a.sent();
                        expect(result.updatedCount).toBe(1);
                        expect(result.previousEoiNos).toEqual(['GPPMI003003']);
                        expect(result.updatedEoiNos).toEqual(['GPPMI003006']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws 404 when URN has no rejected products', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findLeanExec.mockResolvedValue([]);
                        return [4 /*yield*/, expect(service.restoreUrn(urnNo, product_status_constants_1.PRODUCT_STATUS_CERTIFIED, adminUserId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
