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
var product_registration_service_1 = require("./product-registration.service");
describe('ProductRegistrationService.getRenewList', function () {
    it('filters vendor renew list by manufacturerId (not vendorId)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var aggregateExec, aggregate, service, serviceAny, manufacturerId, pipeline, match, project;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    aggregateExec = jest.fn().mockResolvedValue([]);
                    aggregate = jest.fn().mockReturnValue({ exec: aggregateExec });
                    service = Object.create(product_registration_service_1.ProductRegistrationService.prototype);
                    serviceAny = service;
                    serviceAny.productModel = { aggregate: aggregate };
                    serviceAny.toObjectId = function (id) { return new mongoose_1.Types.ObjectId(id); };
                    manufacturerId = new mongoose_1.Types.ObjectId().toString();
                    return [4 /*yield*/, service.getRenewList(manufacturerId)];
                case 1:
                    _b.sent();
                    expect(aggregate).toHaveBeenCalledTimes(1);
                    pipeline = aggregate.mock.calls[0][0];
                    match = pipeline[0].$match;
                    expect(match.manufacturerId).toBeDefined();
                    expect(match.vendorId).toBeUndefined();
                    expect(String(match.manufacturerId)).toBe(manufacturerId);
                    expect(match.productStatus).toBe(2);
                    expect(match.productStatus).not.toBe(3);
                    project = (_a = pipeline.find(function (stage) { return stage.$project; })) === null || _a === void 0 ? void 0 : _a.$project;
                    expect(project.product_details).toBeDefined();
                    expect(project.unit_count).toBeDefined();
                    expect(project.plantCount).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
