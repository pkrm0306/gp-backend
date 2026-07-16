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
var core_1 = require("@nestjs/core");
var rxjs_1 = require("rxjs");
var audit_entry_factory_1 = require("./audit-entry.factory");
var audit_http_interceptor_1 = require("./audit-http.interceptor");
var audit_route_map_1 = require("./audit-route-map");
var audit_status_resolver_service_1 = require("./audit-status-resolver.service");
var audit_value_transformer_service_1 = require("./audit-value-transformer.service");
describe('AuditHttpInterceptor integration', function () {
    it('records one centralized audit entry after a successful mutation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var record, interceptor, req, res, context, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    record = jest.fn().mockResolvedValue(undefined);
                    interceptor = new audit_http_interceptor_1.AuditHttpInterceptor({ record: record }, new core_1.Reflector(), auditEntryFactory());
                    req = {
                        method: 'POST',
                        originalUrl: '/payments',
                        url: '/payments',
                        body: { urn_no: 'URN-1', paymentStatus: 0 },
                        headers: { 'x-request-id': 'request-1' },
                        ip: '127.0.0.1',
                        socket: {},
                    };
                    res = {
                        statusCode: 201,
                        setHeader: jest.fn(),
                    };
                    context = httpContext(req, res);
                    next = { handle: function () { return (0, rxjs_1.of)({ ok: true }); } };
                    return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(interceptor.intercept(context, next))];
                case 1:
                    _a.sent();
                    expect(record).toHaveBeenCalledTimes(1);
                    expect(record.mock.calls[0][0]).toMatchObject({
                        action: 'PAYMENT_CREATED',
                        outcome: 'success',
                        module: 'payment',
                        action_type: 'create',
                        entity_name: 'URN-1',
                        http_method: 'POST',
                        route: '/payments',
                        status_code: 201,
                        request: { correlation_id: 'request-1' },
                    });
                    expect(record.mock.calls[0][0].metadata.audit_event_id).toEqual(expect.any(String));
                    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'request-1');
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not record non-mutating requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var record, interceptor, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    record = jest.fn().mockResolvedValue(undefined);
                    interceptor = new audit_http_interceptor_1.AuditHttpInterceptor({ record: record }, new core_1.Reflector(), auditEntryFactory());
                    req = {
                        method: 'GET',
                        originalUrl: '/payments',
                        url: '/payments',
                        headers: {},
                        socket: {},
                    };
                    res = {
                        statusCode: 200,
                        setHeader: jest.fn(),
                    };
                    return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(interceptor.intercept(httpContext(req, res), { handle: function () { return (0, rxjs_1.of)({}); } }))];
                case 1:
                    _a.sent();
                    expect(record).not.toHaveBeenCalled();
                    expect(res.setHeader).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not record listing requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var record, interceptor, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    record = jest.fn().mockResolvedValue(undefined);
                    interceptor = new audit_http_interceptor_1.AuditHttpInterceptor({ record: record }, new core_1.Reflector(), auditEntryFactory());
                    req = {
                        method: 'POST',
                        originalUrl: '/api/admin/products/list',
                        url: '/api/admin/products/list',
                        body: { page: 1, limit: 20 },
                        headers: {},
                        ip: '127.0.0.1',
                        socket: {},
                    };
                    res = {
                        statusCode: 200,
                        setHeader: jest.fn(),
                    };
                    return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(interceptor.intercept(httpContext(req, res), {
                            handle: function () { return (0, rxjs_1.of)({ success: true, data: [] }); },
                        }))];
                case 1:
                    _a.sent();
                    expect(record).not.toHaveBeenCalled();
                    expect(res.setHeader).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips non-final rows in legacy raw-materials bulk uploads', function () { return __awaiter(void 0, void 0, void 0, function () {
        var record, interceptor, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    record = jest.fn().mockResolvedValue(undefined);
                    interceptor = new audit_http_interceptor_1.AuditHttpInterceptor({ record: record }, new core_1.Reflector(), auditEntryFactory());
                    req = {
                        method: 'POST',
                        originalUrl: '/raw-materials-hazardous-products',
                        url: '/raw-materials-hazardous-products',
                        body: {
                            urnNo: 'URN-1',
                            rowIndex: '0',
                            totalRows: '3',
                            productsName: 'Paint',
                        },
                        headers: { 'x-request-id': 'request-bulk-row-0' },
                        ip: '127.0.0.1',
                        socket: {},
                    };
                    res = {
                        statusCode: 201,
                        setHeader: jest.fn(),
                    };
                    return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(interceptor.intercept(httpContext(req, res), {
                            handle: function () { return (0, rxjs_1.of)({ success: true }); },
                        }))];
                case 1:
                    _a.sent();
                    expect(record).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('records one summary entry for the final row in a legacy raw-materials bulk upload', function () { return __awaiter(void 0, void 0, void 0, function () {
        var record, interceptor, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    record = jest.fn().mockResolvedValue(undefined);
                    interceptor = new audit_http_interceptor_1.AuditHttpInterceptor({ record: record }, new core_1.Reflector(), auditEntryFactory());
                    req = {
                        method: 'POST',
                        originalUrl: '/raw-materials-hazardous-products',
                        url: '/raw-materials-hazardous-products',
                        body: {
                            urnNo: 'URN-1',
                            rowIndex: '2',
                            totalRows: '3',
                            productsName: 'Adhesive',
                        },
                        headers: { 'x-request-id': 'request-bulk-row-2' },
                        ip: '127.0.0.1',
                        socket: {},
                    };
                    res = {
                        statusCode: 201,
                        setHeader: jest.fn(),
                    };
                    return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(interceptor.intercept(httpContext(req, res), {
                            handle: function () { return (0, rxjs_1.of)({ success: true }); },
                        }))];
                case 1:
                    _a.sent();
                    expect(record).toHaveBeenCalledTimes(1);
                    expect(record.mock.calls[0][0]).toMatchObject({
                        module: 'raw_materials',
                        description: 'Raw materials hazardous products bulk upload completed',
                        new_values: {
                            urnNo: 'URN-1',
                            operation: 'bulk_upload',
                            completedRows: 3,
                            totalRows: 3,
                        },
                        metadata: {
                            business_event_type: 'raw_materials_hazardous_products_bulk_upload',
                            consolidated: true,
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
function auditEntryFactory() {
    var statusResolver = new audit_status_resolver_service_1.AuditStatusResolver();
    var valueTransformer = new audit_value_transformer_service_1.AuditValueTransformer(statusResolver);
    return new audit_entry_factory_1.AuditEntryFactory(new audit_route_map_1.AuditRouteMapper(valueTransformer), valueTransformer);
}
function httpContext(req, res) {
    var TestController = /** @class */ (function () {
        function TestController() {
        }
        return TestController;
    }());
    var handler = function () { return undefined; };
    return {
        getType: function () { return 'http'; },
        switchToHttp: function () { return ({
            getRequest: function () { return req; },
            getResponse: function () { return res; },
        }); },
        getHandler: function () { return handler; },
        getClass: function () { return TestController; },
    };
}
