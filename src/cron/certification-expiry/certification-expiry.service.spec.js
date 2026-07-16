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
var mongoose_1 = require("mongoose");
var certification_expiry_service_1 = require("./certification-expiry.service");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var cron_date_util_1 = require("../utils/cron-date.util");
var certification_dates_util_1 = require("../../product-registration/helpers/certification-dates.util");
function makeProduct(productId, overrides) {
    if (overrides === void 0) { overrides = {}; }
    var validtillDate = new Date('2020-06-01T00:00:00.000Z');
    return __assign({ productId: productId, eoiNo: "EOI-".concat(productId), urnNo: "URN-".concat(productId), productName: "Product ".concat(productId), productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED, productRenewStatus: 0, urnStatus: 0, validtillDate: validtillDate, vendorId: new mongoose_1.Types.ObjectId(), vendorEmail: "vendor".concat(productId, "@example.com") }, overrides);
}
describe('CertificationExpiryService.runDeactivationMail', function () {
    var service;
    var updateMany;
    var updateOne;
    var productFindLeanExec;
    var cronLogFindLeanExec;
    var cronLogCreate;
    var sendEmail;
    var renderDeactivationEmail;
    var getDeactivationEligibleProducts;
    var renewalFindLeanExec;
    beforeEach(function () {
        updateMany = jest
            .fn()
            .mockResolvedValue({ matchedCount: 0, modifiedCount: 0 });
        updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
        productFindLeanExec = jest.fn().mockResolvedValue([]);
        cronLogFindLeanExec = jest.fn().mockResolvedValue([]);
        cronLogCreate = jest.fn().mockResolvedValue({});
        sendEmail = jest.fn().mockResolvedValue(undefined);
        renderDeactivationEmail = jest.fn().mockResolvedValue('<p>deactivated</p>');
        getDeactivationEligibleProducts = jest.fn().mockResolvedValue([]);
        renewalFindLeanExec = jest.fn().mockResolvedValue(null);
        var productModel = {
            updateMany: updateMany,
            updateOne: updateOne,
            find: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({ exec: productFindLeanExec }),
                }),
            }),
        };
        var cronEmailLogModel = {
            find: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({ exec: cronLogFindLeanExec }),
                }),
            }),
            create: cronLogCreate,
            exists: jest.fn(),
        };
        var renewalCycleModel = {
            findOne: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({ exec: renewalFindLeanExec }),
                }),
            }),
        };
        service = new certification_expiry_service_1.CertificationExpiryService({ getDeactivationEligibleProducts: getDeactivationEligibleProducts }, { renderDeactivationEmail: renderDeactivationEmail }, { sendEmail: sendEmail }, { get: jest.fn().mockReturnValue('false') }, productModel, renewalCycleModel, cronEmailLogModel, {
            notifyCertificationExpiryAdmin: jest.fn().mockResolvedValue(undefined),
        });
    });
    it('bulk-commits all planned products with a single updateMany', function () { return __awaiter(void 0, void 0, void 0, function () {
        var products, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    products = [makeProduct(1), makeProduct(2), makeProduct(3)];
                    getDeactivationEligibleProducts.mockResolvedValue(products);
                    productFindLeanExec.mockResolvedValue(products.map(function (p) { return ({
                        productId: p.productId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                    }); }));
                    updateMany.mockResolvedValue({ matchedCount: 3, modifiedCount: 3 });
                    return [4 /*yield*/, service.runDeactivationMail()];
                case 1:
                    result = _a.sent();
                    expect(updateMany).toHaveBeenCalledTimes(1);
                    expect(updateMany).toHaveBeenCalledWith({
                        productId: { $in: [1, 2, 3] },
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                    }, {
                        $set: {
                            productStatus: product_status_constants_1.PRODUCT_STATUS_DISCONTINUED,
                            updatedDate: expect.any(Date),
                        },
                    });
                    expect(updateOne).not.toHaveBeenCalled();
                    expect(result.planned).toBe(3);
                    expect(result.deactivated).toBe(3);
                    expect(result.modifiedCount).toBe(3);
                    expect(result.sent).toBe(3);
                    expect(sendEmail).toHaveBeenCalledTimes(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it('commits status before sending any vendor email', function () { return __awaiter(void 0, void 0, void 0, function () {
        var products, resolveUpdateMany, updateManyGate, emailStarted, runPromise, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    products = [makeProduct(10), makeProduct(11)];
                    getDeactivationEligibleProducts.mockResolvedValue(products);
                    productFindLeanExec.mockResolvedValue(products.map(function (p) { return ({
                        productId: p.productId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                    }); }));
                    resolveUpdateMany = function () { return undefined; };
                    updateManyGate = new Promise(function (resolve) {
                        resolveUpdateMany = resolve;
                    });
                    updateMany.mockImplementation(function () { return updateManyGate; });
                    emailStarted = false;
                    sendEmail.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            emailStarted = true;
                            return [2 /*return*/];
                        });
                    }); });
                    runPromise = service.runDeactivationMail();
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 1:
                    _a.sent();
                    expect(emailStarted).toBe(false);
                    resolveUpdateMany({ matchedCount: 2, modifiedCount: 2 });
                    return [4 /*yield*/, runPromise];
                case 2:
                    result = _a.sent();
                    expect(updateMany).toHaveBeenCalled();
                    expect(emailStarted).toBe(true);
                    expect(result.sent).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips products already logged and discontinued (idempotency)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var product, graceEndIso, notifyDate, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    product = makeProduct(42);
                    graceEndIso = (0, cron_date_util_1.toIsoDateInTimeZone)((0, certification_dates_util_1.computeGraceEndDate)(product.validtillDate));
                    notifyDate = "deactivate-".concat(graceEndIso);
                    getDeactivationEligibleProducts.mockResolvedValue([product]);
                    cronLogFindLeanExec.mockResolvedValue([{ productId: 42, notifyDate: notifyDate }]);
                    productFindLeanExec.mockResolvedValue([
                        { productId: 42, productStatus: product_status_constants_1.PRODUCT_STATUS_DISCONTINUED },
                    ]);
                    return [4 /*yield*/, service.runDeactivationMail()];
                case 1:
                    result = _a.sent();
                    expect(updateMany).not.toHaveBeenCalled();
                    expect(sendEmail).not.toHaveBeenCalled();
                    expect(result.skipped).toBe(1);
                    expect(result.planned).toBe(0);
                    expect(result.deactivated).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not double-deactivate on re-run after successful processing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var products, graceEndById, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    products = [makeProduct(7), makeProduct(8)];
                    graceEndById = new Map(products.map(function (p) { return [
                        p.productId,
                        "deactivate-".concat((0, cron_date_util_1.toIsoDateInTimeZone)((0, certification_dates_util_1.computeGraceEndDate)(p.validtillDate))),
                    ]; }));
                    getDeactivationEligibleProducts.mockResolvedValue(products);
                    productFindLeanExec.mockResolvedValue(products.map(function (p) { return ({
                        productId: p.productId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                    }); }));
                    updateMany.mockResolvedValue({ matchedCount: 2, modifiedCount: 2 });
                    return [4 /*yield*/, service.runDeactivationMail()];
                case 1:
                    first = _a.sent();
                    expect(first.deactivated).toBe(2);
                    cronLogFindLeanExec.mockResolvedValue(products.map(function (p) { return ({
                        productId: p.productId,
                        notifyDate: graceEndById.get(p.productId),
                    }); }));
                    productFindLeanExec.mockResolvedValue(products.map(function (p) { return ({
                        productId: p.productId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_DISCONTINUED,
                    }); }));
                    updateMany.mockClear();
                    sendEmail.mockClear();
                    return [4 /*yield*/, service.runDeactivationMail()];
                case 2:
                    second = _a.sent();
                    expect(updateMany).not.toHaveBeenCalled();
                    expect(sendEmail).not.toHaveBeenCalled();
                    expect(second.skipped).toBe(2);
                    expect(second.deactivated).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('records email failures without rolling back bulk deactivation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var products, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    products = [makeProduct(21), makeProduct(22)];
                    getDeactivationEligibleProducts.mockResolvedValue(products);
                    productFindLeanExec.mockResolvedValue(products.map(function (p) { return ({
                        productId: p.productId,
                        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                    }); }));
                    updateMany.mockResolvedValue({ matchedCount: 2, modifiedCount: 2 });
                    sendEmail
                        .mockResolvedValueOnce(undefined)
                        .mockRejectedValueOnce(new Error('SMTP down'));
                    return [4 /*yield*/, service.runDeactivationMail()];
                case 1:
                    result = _a.sent();
                    expect(updateMany).toHaveBeenCalledTimes(1);
                    expect(result.deactivated).toBe(2);
                    expect(result.sent).toBe(1);
                    expect(result.failed).toBe(1);
                    expect(result.success).toBe(false);
                    expect(result.errors).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('CertificationExpiryService.planDeactivationBatch', function () {
    var service;
    var productFindLeanExec;
    var cronLogFindLeanExec;
    beforeEach(function () {
        productFindLeanExec = jest.fn().mockResolvedValue([]);
        cronLogFindLeanExec = jest.fn().mockResolvedValue([]);
        service = new certification_expiry_service_1.CertificationExpiryService({}, {}, {}, { get: jest.fn() }, {
            find: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({ exec: productFindLeanExec }),
                }),
            }),
        }, {}, {
            find: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({ exec: cronLogFindLeanExec }),
                }),
            }),
        }, {
            notifyCertificationExpiryAdmin: jest.fn().mockResolvedValue(undefined),
        });
    });
    it('skips products still inside the grace window', function () { return __awaiter(void 0, void 0, void 0, function () {
        var futureValidTill, product, result, planned;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    futureValidTill = new Date();
                    futureValidTill.setFullYear(futureValidTill.getFullYear() + 2);
                    product = makeProduct(99, { validtillDate: futureValidTill });
                    result = {
                        success: true,
                        jobType: 'deactivationMail',
                        processed: 0,
                        sent: 0,
                        skipped: 0,
                        failed: 0,
                        deactivated: 0,
                        errors: [],
                    };
                    return [4 /*yield*/, service.planDeactivationBatch([product], (0, cron_date_util_1.todayIsoInTimeZone)(), result)];
                case 1:
                    planned = _a.sent();
                    expect(planned).toHaveLength(0);
                    expect(result.skipped).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
