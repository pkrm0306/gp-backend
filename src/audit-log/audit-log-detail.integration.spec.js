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
var testing_1 = require("@nestjs/testing");
var mongoose_1 = require("mongoose");
var audit_log_admin_controller_1 = require("./audit-log-admin.controller");
var audit_log_service_1 = require("./audit-log.service");
describe('AuditLogAdminController detail integration', function () {
    var controller;
    var findById = jest.fn();
    var list = jest.fn();
    var filterOptions = jest.fn();
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findById.mockReset();
                    list.mockReset();
                    filterOptions.mockReset();
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            controllers: [audit_log_admin_controller_1.AuditLogAdminController],
                            providers: [
                                {
                                    provide: audit_log_service_1.AuditLogService,
                                    useValue: { findById: findById, list: list, filterOptions: filterOptions },
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    controller = module.get(audit_log_admin_controller_1.AuditLogAdminController);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns a consistent JSON-safe detail DTO when snapshots are missing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new mongoose_1.Types.ObjectId().toString();
                    findById.mockResolvedValue({
                        _id: id,
                        occurred_at: new Date('2026-06-09T05:30:00.000Z'),
                        action: 'HTTP_MUTATION',
                        outcome: 'success',
                        module: 'product',
                        action_type: 'create',
                        description: 'Product / process data created',
                        performed_by: { name: 'Admin User' },
                        route: '/products',
                        http_method: 'POST',
                        status_code: 201,
                    });
                    return [4 /*yield*/, controller.detail(id)];
                case 1:
                    response = _a.sent();
                    expect(response).toMatchObject({
                        success: true,
                        message: 'Audit log detail retrieved',
                        data: {
                            id: id,
                            action: 'HTTP_MUTATION',
                            outcome: 'success',
                            module: 'product',
                            module_display: 'Product',
                            action_type: 'create',
                            action_display: 'create',
                            old_values: null,
                            new_values: null,
                            changes: null,
                            metadata: null,
                            user_display: 'Admin User',
                        },
                    });
                    expect(function () { return JSON.stringify(response); }).not.toThrow();
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns active audit filter options with pagination metadata', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filterOptions.mockResolvedValue({
                        modules: [{ value: 'product', label: 'Product', count: 5 }],
                        action_types: [{ value: 'update', label: 'update', count: 5 }],
                        actions: [{ value: 'HTTP_MUTATION', label: 'HTTP_MUTATION', count: 5 }],
                        users: [{ value: 'Admin User', label: 'Admin User', count: 5 }],
                        pagination: {
                            page: 1,
                            limit: 20,
                            totalCount: 1,
                            totalPages: 1,
                        },
                        from: new Date('2026-06-01T00:00:00.000Z'),
                        to: new Date('2026-06-09T00:00:00.000Z'),
                    });
                    return [4 /*yield*/, controller.filters({ page: 1, limit: 20 })];
                case 1:
                    response = _a.sent();
                    expect(filterOptions).toHaveBeenCalledWith({ page: 1, limit: 20 });
                    expect(response).toEqual({
                        success: true,
                        message: 'Audit filter options retrieved',
                        data: {
                            modules: [{ value: 'product', label: 'Product', count: 5 }],
                            action_types: [{ value: 'update', label: 'update', count: 5 }],
                            actions: [{ value: 'HTTP_MUTATION', label: 'HTTP_MUTATION', count: 5 }],
                            users: [{ value: 'Admin User', label: 'Admin User', count: 5 }],
                        },
                        pagination: {
                            page: 1,
                            limit: 20,
                            totalCount: 1,
                            totalPages: 1,
                        },
                        meta: {
                            page: 1,
                            limit: 20,
                            totalCount: 1,
                            totalPages: 1,
                            from: '2026-06-01T00:00:00.000Z',
                            to: '2026-06-09T00:00:00.000Z',
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects invalid audit detail ids', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(controller.detail('not-an-object-id')).rejects.toBeInstanceOf(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    expect(findById).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns not found when the audit detail record is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = new mongoose_1.Types.ObjectId().toString();
                    findById.mockResolvedValue(null);
                    return [4 /*yield*/, expect(controller.detail(id)).rejects.toBeInstanceOf(common_1.NotFoundException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
