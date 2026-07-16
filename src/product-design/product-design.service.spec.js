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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var product_design_service_1 = require("./product-design.service");
describe('ProductDesignService measures idempotency', function () {
    var vendorObjectId = new mongoose_1.Types.ObjectId();
    var now = new Date('2026-04-28T10:00:00.000Z');
    function buildServiceWithMeasureStore(initialRows) {
        var _this = this;
        if (initialRows === void 0) { initialRows = []; }
        var store = __spreadArray([], initialRows, true);
        var seq = 1000;
        var pdMeasureModel = {
            find: jest.fn(function () { return ({
                session: jest.fn().mockResolvedValue(store.map(function (r) { return ({
                    normalizedMeasures: r.normalizedMeasures,
                    normalizedBenefits: r.normalizedBenefits,
                }); })),
            }); }),
            insertMany: jest.fn(function (docs) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    store.push.apply(store, docs);
                    return [2 /*return*/];
                });
            }); }),
            syncIndexes: jest.fn(),
        };
        var service = new product_design_service_1.ProductDesignService({ syncIndexes: jest.fn() }, pdMeasureModel, {}, {}, {}, { getProductDesignMeasureId: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ++seq];
            }); }); }) }, { notifyAfterDocumentsUploaded: jest.fn() }, {});
        return { service: service, pdMeasureModel: pdMeasureModel, store: store };
    }
    it('submitting same payload twice does not increase row count', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, store, normalizedRows, first, second;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = buildServiceWithMeasureStore(), service = _a.service, store = _a.store;
                    normalizedRows = service.normalizeUniqueMeasures([
                        { measuresImplemented: 'Use solar', benefitsAchieved: 'Less CO2' },
                    ]);
                    return [4 /*yield*/, service.upsertMeasuresByUrn({
                            urnNo: 'URN-1',
                            vendorObjectId: vendorObjectId,
                            effectiveProductDesignId: 1,
                            normalizedMeasures: normalizedRows,
                            now: now,
                            session: {},
                        })];
                case 1:
                    first = _b.sent();
                    return [4 /*yield*/, service.upsertMeasuresByUrn({
                            urnNo: 'URN-1',
                            vendorObjectId: vendorObjectId,
                            effectiveProductDesignId: 1,
                            normalizedMeasures: normalizedRows,
                            now: now,
                            session: {},
                        })];
                case 2:
                    second = _b.sent();
                    expect(first).toEqual({ inserted: 1, skipped: 0 });
                    expect(second).toEqual({ inserted: 0, skipped: 1 });
                    expect(store).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('mixed old and new rows only insert new unique rows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, service, store, normalizedRows, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = buildServiceWithMeasureStore([
                        {
                            normalizedMeasures: 'use solar',
                            normalizedBenefits: 'less co2',
                        },
                    ]), service = _a.service, store = _a.store;
                    normalizedRows = service.normalizeUniqueMeasures([
                        { measuresImplemented: 'Use Solar', benefitsAchieved: 'Less CO2' },
                        { measuresImplemented: 'Rainwater harvest', benefitsAchieved: 'Save water' },
                    ]);
                    return [4 /*yield*/, service.upsertMeasuresByUrn({
                            urnNo: 'URN-1',
                            vendorObjectId: vendorObjectId,
                            effectiveProductDesignId: 1,
                            normalizedMeasures: normalizedRows,
                            now: now,
                            session: {},
                        })];
                case 1:
                    result = _b.sent();
                    expect(result).toEqual({ inserted: 1, skipped: 1 });
                    expect(store).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('accepts row with only benefitsAchieved filled', function () {
        var service = buildServiceWithMeasureStore().service;
        var normalizedRows = service.normalizeUniqueMeasures([
            { measuresImplemented: '', benefitsAchieved: 'ssdfds' },
        ]);
        expect(normalizedRows).toHaveLength(1);
        expect(normalizedRows[0].benefitsAchieved).toBe('ssdfds');
        expect(normalizedRows[0].measuresImplemented).toBe('');
    });
    it('accepts vendor alias keys measures and benefits', function () {
        var service = buildServiceWithMeasureStore().service;
        var normalizedRows = service.normalizeUniqueMeasures([
            { measures: 'LED upgrade', benefits: '' },
        ]);
        expect(normalizedRows).toHaveLength(1);
        expect(normalizedRows[0].measuresImplemented).toBe('LED upgrade');
        expect(normalizedRows[0].benefitsAchieved).toBe('');
    });
    it('treats whitespace and case variants as duplicates', function () {
        var service = buildServiceWithMeasureStore().service;
        var normalizedRows = service.normalizeUniqueMeasures([
            { measuresImplemented: ' Use Solar ', benefitsAchieved: ' Less CO2 ' },
            { measuresImplemented: 'use solar', benefitsAchieved: 'less co2' },
        ]);
        expect(normalizedRows).toHaveLength(1);
        expect(normalizedRows[0]).toMatchObject({
            measuresImplemented: 'Use Solar',
            benefitsAchieved: 'Less CO2',
            normalizedMeasures: 'use solar',
            normalizedBenefits: 'less co2',
        });
    });
});
