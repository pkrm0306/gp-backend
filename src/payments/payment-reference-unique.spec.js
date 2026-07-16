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
var payments_service_1 = require("./payments.service");
var payment_response_util_1 = require("./payment-response.util");
describe('PaymentsService payment reference uniqueness', function () {
    function serviceWithFindOneResult(result) {
        var exec = jest.fn().mockResolvedValue(result);
        var lean = jest.fn().mockReturnValue({ exec: exec });
        var session = jest.fn().mockReturnValue({ select: function () { return ({ lean: lean }); } });
        var select = jest.fn().mockReturnValue({ lean: lean, session: session });
        var findOne = jest.fn().mockReturnValue({ select: select, session: session });
        var service = Object.create(payments_service_1.PaymentsService.prototype);
        service.paymentDetailsModel = { findOne: findOne };
        return { service: service, findOne: findOne, exec: exec, select: select };
    }
    it('rejects duplicate payment reference numbers across records', function () { return __awaiter(void 0, void 0, void 0, function () {
        var service;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    service = serviceWithFindOneResult({ _id: new mongoose_1.Types.ObjectId() }).service;
                    return [4 /*yield*/, expect(service.assertPaymentReferenceNoUnique('REF123ABC')).rejects.toThrow(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, expect(service.assertPaymentReferenceNoUnique('REF123ABC')).rejects.toThrow(payment_response_util_1.PAYMENT_REFERENCE_UNIQUE_MESSAGE)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('allows the same payment reference on the excluded payment record', function () { return __awaiter(void 0, void 0, void 0, function () {
        var paymentId, service;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paymentId = new mongoose_1.Types.ObjectId();
                    service = serviceWithFindOneResult(null).service;
                    return [4 /*yield*/, expect(service.assertPaymentReferenceNoUnique('REF123ABC', paymentId)).resolves.toBeUndefined()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('queries payment_details with a case-insensitive exact match', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, findOne, select;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = serviceWithFindOneResult(null), service = _a.service, findOne = _a.findOne, select = _a.select;
                    return [4 /*yield*/, service.assertPaymentReferenceNoUnique('Ref123ABC')];
                case 1:
                    _b.sent();
                    expect(findOne).toHaveBeenCalledWith({
                        paymentReferenceNo: { $regex: '^Ref123ABC$', $options: 'i' },
                    });
                    expect(select).toHaveBeenCalledWith('_id');
                    return [2 /*return*/];
            }
        });
    }); });
    it('escapes regex characters in payment reference numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, findOne;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = serviceWithFindOneResult(null), service = _a.service, findOne = _a.findOne;
                    return [4 /*yield*/, service.assertPaymentReferenceNoUnique('REF.123')];
                case 1:
                    _b.sent();
                    expect(findOne).toHaveBeenCalledWith({
                        paymentReferenceNo: { $regex: '^REF\\.123$', $options: 'i' },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
