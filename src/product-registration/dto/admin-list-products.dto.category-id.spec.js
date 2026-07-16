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
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var admin_list_products_dto_1 = require("./admin-list-products.dto");
describe('AdminListProductsDto category & building filters', function () {
    it('accepts category_id for uncertified list filter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        status: [0, 1],
                        category_id: '507f1f77bcf86cd799439011',
                        page: 1,
                        limit: 10,
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.category_id).toBe('507f1f77bcf86cd799439011');
                    return [2 /*return*/];
            }
        });
    }); });
    it('accepts category_ids multiselect', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        status: [0, 1],
                        category_ids: [
                            '507f1f77bcf86cd799439011',
                            '507f1f77bcf86cd799439012',
                        ],
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.category_ids).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('accepts building_ids multiselect for sector filter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        status: [0, 1],
                        building_ids: [1, 2],
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.building_ids).toEqual([1, 2]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('accepts valid_till month+year alias for certified list filter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        status: [2],
                        valid_till: '2026-12',
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.valid_till).toBe('2026-12');
                    return [2 /*return*/];
            }
        });
    }); });
    it('normalizes legacy YYYY-MM-DD to YYYY-MM on valid_till_date', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        status: [2],
                        valid_till_date: '2026-12-31',
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.valid_till_date).toBe('2026-12');
                    return [2 /*return*/];
            }
        });
    }); });
    it('accepts validTillMonthYear and validtillDate aliases', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        status: [2],
                        validTillMonthYear: '2026-12',
                        validtillDate: '2026-12',
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.validTillMonthYear).toBe('2026-12');
                    expect(dto.validtillDate).toBe('2026-12');
                    return [2 /*return*/];
            }
        });
    }); });
    it('accepts valid_till_month with valid_till_year for certified list filter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        status: [2],
                        valid_till_month: 12,
                        valid_till_year: 2026,
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.valid_till_month).toBe(12);
                    expect(dto.valid_till_year).toBe(2026);
                    return [2 /*return*/];
            }
        });
    }); });
    it('accepts validTillMonth with validTillYear for certified list filter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        status: [2],
                        validTillMonth: 12,
                        validTillYear: 2026,
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.validTillMonth).toBe(12);
                    expect(dto.validTillYear).toBe(2026);
                    return [2 /*return*/];
            }
        });
    }); });
    it('ignores invalid categoryId instead of returning 400', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        categoryId: 'all',
                        page: 1,
                        limit: 12,
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.categoryId).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('ignores empty categoryId and invalid category_ids entries', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dto, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = (0, class_transformer_1.plainToInstance)(admin_list_products_dto_1.AdminListProductsDto, {
                        categoryId: '',
                        category_ids: ['all', 'invalid', '507f1f77bcf86cd799439011'],
                        page: 1,
                        limit: 12,
                    });
                    return [4 /*yield*/, (0, class_validator_1.validate)(dto, {
                            whitelist: true,
                            forbidNonWhitelisted: true,
                        })];
                case 1:
                    errors = _a.sent();
                    expect(errors).toEqual([]);
                    expect(dto.categoryId).toBeUndefined();
                    expect(dto.category_ids).toEqual(['507f1f77bcf86cd799439011']);
                    return [2 /*return*/];
            }
        });
    }); });
});
