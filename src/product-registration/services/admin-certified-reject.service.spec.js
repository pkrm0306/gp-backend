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
var admin_certified_reject_service_1 = require("./admin-certified-reject.service");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
describe('AdminCertifiedRejectService', function () {
    var urnNo = 'URN-20260428123027';
    var adminUserId = new mongoose_1.Types.ObjectId().toHexString();
    var productObjectId = new mongoose_1.Types.ObjectId();
    var findOneExec;
    var updateOne;
    var updateOneExec;
    var productStatusAuditCreate;
    var auditRecord;
    var service;
    beforeEach(function () {
        findOneExec = jest.fn();
        updateOneExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
        updateOne = jest.fn().mockReturnValue({ exec: updateOneExec });
        productStatusAuditCreate = jest.fn().mockResolvedValue({});
        auditRecord = jest.fn().mockResolvedValue(undefined);
        service = new admin_certified_reject_service_1.AdminCertifiedRejectService({
            findOne: jest.fn().mockReturnValue({ exec: findOneExec }),
            updateOne: updateOne,
        }, { create: productStatusAuditCreate }, { record: auditRecord }, {
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
    it('rejects certified product and keeps eoiNo', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findOneExec.mockResolvedValue({
                        _id: productObjectId,
                        eoiNo: 'GPPMI003026',
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                    });
                    return [4 /*yield*/, service.rejectProduct(urnNo, productObjectId.toHexString(), adminUserId, { rejectionReason: 'Admin rejected' })];
                case 1:
                    result = _a.sent();
                    expect(result.fromStatus).toBe(2);
                    expect(result.toStatus).toBe(3);
                    expect(result.eoiNo).toBe('GPPMI003026');
                    expect(updateOne).toHaveBeenCalledWith({ _id: productObjectId, productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED }, {
                        $set: expect.objectContaining({
                            productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED,
                            rejectedDetails: 'Admin rejected',
                            rejectedAt: expect.any(Date),
                        }),
                    });
                    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({ action: 'certified_reject_product' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws 409 when product is not certified', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findOneExec.mockResolvedValue({
                        _id: productObjectId,
                        eoiNo: 'GPPMI003026',
                        productStatus: product_status_constants_1.PRODUCT_STATUS_REJECTED,
                    });
                    return [4 /*yield*/, expect(service.rejectProduct(urnNo, productObjectId.toHexString(), adminUserId)).rejects.toBeInstanceOf(common_1.ConflictException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('throws 404 when product is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findOneExec.mockResolvedValue(null);
                    return [4 /*yield*/, expect(service.rejectProduct(urnNo, productObjectId.toHexString(), adminUserId)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
