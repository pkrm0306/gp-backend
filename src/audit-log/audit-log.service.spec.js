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
var testing_1 = require("@nestjs/testing");
var mongoose_1 = require("@nestjs/mongoose");
var audit_log_service_1 = require("./audit-log.service");
var audit_actions_1 = require("./audit-actions");
var audit_log_schema_1 = require("./schemas/audit-log.schema");
var category_schema_1 = require("../categories/schemas/category.schema");
var sector_schema_1 = require("../sectors/schemas/sector.schema");
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var country_schema_1 = require("../countries/schemas/country.schema");
var state_schema_1 = require("../states/schemas/state.schema");
var standard_schema_1 = require("../standards/schemas/standard.schema");
var product_schema_1 = require("../product-registration/schemas/product.schema");
var role_schema_1 = require("../rbac/schemas/role.schema");
var vendor_user_schema_1 = require("../vendor-users/schemas/vendor-user.schema");
var audit_lookup_resolver_service_1 = require("./audit-lookup-resolver.service");
var audit_status_resolver_service_1 = require("./audit-status-resolver.service");
var audit_value_transformer_service_1 = require("./audit-value-transformer.service");
describe('AuditLogService', function () {
    var service;
    var createMock = jest.fn().mockResolvedValue({ _id: 'x' });
    var execMock = jest.fn().mockResolvedValue([]);
    var countDocumentsMock = jest.fn().mockReturnValue({ exec: execMock });
    var auditFindExecMock = jest.fn();
    var auditFindByIdExecMock = jest.fn();
    var auditAggregateExecMock = jest.fn();
    var lookupFindExecMock = jest.fn().mockResolvedValue([]);
    var auditFindMock = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: auditFindExecMock,
    });
    var auditFindByIdMock = jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: auditFindByIdExecMock,
    });
    var auditAggregateMock = jest.fn().mockReturnValue({
        exec: auditAggregateExecMock,
    });
    var lookupModelMock = {
        find: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: lookupFindExecMock,
            }),
        }),
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createMock.mockReset();
                    createMock.mockResolvedValue({ _id: 'x' });
                    execMock.mockClear();
                    countDocumentsMock.mockClear();
                    auditFindMock.mockClear();
                    auditFindExecMock.mockReset();
                    auditFindExecMock.mockResolvedValue([]);
                    auditFindByIdMock.mockClear();
                    auditFindByIdExecMock.mockReset();
                    auditFindByIdExecMock.mockResolvedValue(null);
                    auditAggregateMock.mockClear();
                    auditAggregateExecMock.mockReset();
                    auditAggregateExecMock.mockResolvedValue([]);
                    lookupFindExecMock.mockReset();
                    lookupFindExecMock.mockResolvedValue([]);
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                audit_log_service_1.AuditLogService,
                                audit_lookup_resolver_service_1.AuditLookupResolver,
                                audit_status_resolver_service_1.AuditStatusResolver,
                                audit_value_transformer_service_1.AuditValueTransformer,
                                {
                                    provide: (0, mongoose_1.getModelToken)(audit_log_schema_1.AuditLog.name),
                                    useValue: {
                                        create: createMock,
                                        find: auditFindMock,
                                        findById: auditFindByIdMock,
                                        aggregate: auditAggregateMock,
                                        countDocuments: countDocumentsMock,
                                    },
                                },
                                { provide: (0, mongoose_1.getModelToken)(category_schema_1.Category.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(sector_schema_1.Sector.name), useValue: lookupModelMock },
                                {
                                    provide: (0, mongoose_1.getModelToken)(manufacturer_schema_1.Manufacturer.name),
                                    useValue: lookupModelMock,
                                },
                                { provide: (0, mongoose_1.getModelToken)(country_schema_1.Country.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(state_schema_1.State.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(standard_schema_1.Standard.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(product_schema_1.Product.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(role_schema_1.Role.name), useValue: lookupModelMock },
                                { provide: (0, mongoose_1.getModelToken)(vendor_user_schema_1.VendorUser.name), useValue: lookupModelMock },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(audit_log_service_1.AuditLogService);
                    return [2 /*return*/];
            }
        });
    }); });
    it('inserts audit document on record()', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.record({
                        action: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION,
                        outcome: 'success',
                        http_method: 'POST',
                        route: '/test',
                        status_code: 200,
                    })];
                case 1:
                    _a.sent();
                    expect(createMock).toHaveBeenCalledTimes(1);
                    expect(createMock.mock.calls[0][0].action).toBe(audit_actions_1.AUDIT_ACTION.HTTP_MUTATION);
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not throw when create fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createMock.mockRejectedValueOnce(new Error('db down'));
                    return [4 /*yield*/, expect(service.record({
                            action: audit_actions_1.AUDIT_ACTION.AUTH_LOGIN,
                            outcome: 'failure',
                        })).resolves.toBeUndefined()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips duplicate audit event inserts without throwing', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createMock.mockRejectedValueOnce({ code: 11000, message: 'duplicate key' });
                    return [4 /*yield*/, expect(service.record({
                            action: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION,
                            outcome: 'success',
                            metadata: { audit_event_id: 'event-1' },
                        })).resolves.toBeUndefined()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('appends failure and success events without changing prior history', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.record({
                        action: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED,
                        outcome: 'failure',
                        resource: { type: 'Payment', id: 'URN-1', urn_no: 'URN-1' },
                        metadata: { audit_event_id: 'event-failure' },
                        new_values: { paymentStatus: 3 },
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, service.record({
                            action: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED,
                            outcome: 'success',
                            resource: { type: 'Payment', id: 'URN-1', urn_no: 'URN-1' },
                            metadata: { audit_event_id: 'event-success' },
                            new_values: { paymentStatus: 1 },
                        })];
                case 2:
                    _a.sent();
                    expect(createMock).toHaveBeenCalledTimes(2);
                    expect(createMock.mock.calls[0][0]).toMatchObject({
                        outcome: 'failure',
                        metadata: { audit_event_id: 'event-failure' },
                        new_values: { paymentStatus: 3 },
                    });
                    expect(createMock.mock.calls[1][0]).toMatchObject({
                        outcome: 'success',
                        metadata: { audit_event_id: 'event-success' },
                        new_values: { paymentStatus: 1 },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('supports transaction-scoped insert-only audit records', function () { return __awaiter(void 0, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = { id: 'session-1' };
                    return [4 /*yield*/, service.record({
                            action: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION,
                            outcome: 'success',
                            metadata: { audit_event_id: 'event-transaction' },
                        }, { session: session })];
                case 1:
                    _a.sent();
                    expect(createMock).toHaveBeenCalledWith([
                        expect.objectContaining({
                            action: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION,
                            outcome: 'success',
                            metadata: { audit_event_id: 'event-transaction' },
                        }),
                    ], { session: session });
                    return [2 /*return*/];
            }
        });
    }); });
    it('can fail the surrounding transaction when requested', function () { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    error = new Error('transaction insert failed');
                    createMock.mockRejectedValueOnce(error);
                    return [4 /*yield*/, expect(service.record({
                            action: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION,
                            outcome: 'failure',
                        }, { throwOnError: true })).rejects.toThrow(error)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('removes ignored system and calculated fields before insert', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.record({
                        action: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION,
                        outcome: 'success',
                        old_values: {
                            _id: 'old-id',
                            paymentStatus: 1,
                            updatedDate: '2026-06-08T00:00:00.000Z',
                            quoteTotal: 1000,
                            records: [
                                {
                                    _id: 'nested-id',
                                    productsName: 'Paint',
                                    updatedDate: '2026-06-08T00:00:00.000Z',
                                },
                            ],
                        },
                        new_values: {
                            _id: 'new-id',
                            paymentStatus: 2,
                            updatedDate: '2026-06-09T00:00:00.000Z',
                            quoteTotal: 1200,
                            records: [
                                {
                                    _id: 'nested-id-2',
                                    productsName: 'Adhesive',
                                    updatedDate: '2026-06-09T00:00:00.000Z',
                                },
                            ],
                        },
                        changes: {
                            paymentStatus: { before: 1, after: 2 },
                            updatedDate: {
                                before: '2026-06-08T00:00:00.000Z',
                                after: '2026-06-09T00:00:00.000Z',
                            },
                            quoteTotal: { before: 1000, after: 1200 },
                        },
                    })];
                case 1:
                    _a.sent();
                    expect(createMock.mock.calls[0][0].old_values).toEqual({
                        paymentStatus: 1,
                        records: [{ productsName: 'Paint' }],
                    });
                    expect(createMock.mock.calls[0][0].new_values).toEqual({
                        paymentStatus: 2,
                        records: [{ productsName: 'Adhesive' }],
                    });
                    expect(createMock.mock.calls[0][0].changes).toEqual({
                        paymentStatus: { before: 1, after: 2 },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('maps updateStatusTo to a display label in list new_values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auditFindExecMock.mockResolvedValueOnce([
                        {
                            action: audit_actions_1.AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED,
                            outcome: 'success',
                            old_values: {
                                updateStatusTo: 8,
                                paymentStatus: 0,
                            },
                            new_values: {
                                updateStatusTo: 11,
                                urnStatus: 7,
                                paymentStatus: 0,
                            },
                        },
                        {
                            action: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED,
                            outcome: 'success',
                            new_values: {
                                paymentStatus: 1,
                            },
                        },
                        {
                            action: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED,
                            outcome: 'success',
                            new_values: {
                                paymentStatus: 2,
                            },
                        },
                        {
                            action: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED,
                            outcome: 'success',
                            new_values: {
                                paymentStatus: 3,
                            },
                        },
                    ]);
                    execMock.mockResolvedValueOnce(4);
                    return [4 /*yield*/, service.list({})];
                case 1:
                    result = _a.sent();
                    expect(result.items[0].new_values).toEqual({
                        updateStatusTo: 'Certification Fee Approved',
                        urnStatus: 'Certificate Payment Pending',
                        paymentStatus: 'Payment Pending',
                    });
                    expect(result.items[0].old_values).toEqual({
                        updateStatusTo: 'Approve Certificate Fee',
                        paymentStatus: 'Payment Pending',
                    });
                    expect(result.items[1].new_values).toEqual({
                        paymentStatus: 'Paid',
                    });
                    expect(result.items[2].new_values).toEqual({
                        paymentStatus: 'Payment Approve',
                    });
                    expect(result.items[3].new_values).toEqual({
                        paymentStatus: 'Payment Rejected',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns only active modules in paginated filter options', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auditAggregateExecMock.mockResolvedValueOnce([
                        {
                            modules: [
                                { _id: 'product', count: 5 },
                                { _id: 'proposal', count: 2 },
                            ],
                            action_types: [
                                { _id: 'update', count: 4 },
                                { _id: 'reject', count: 1 },
                            ],
                            actions: [
                                { _id: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION, count: 3 },
                                { _id: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED, count: 2 },
                            ],
                            users: [
                                { _id: '507f1f77bcf86cd799439011', label: 'Admin User', count: 3 },
                                { _id: '507f1f77bcf86cd799439012', label: 'vendor@example.com', count: 2 },
                            ],
                            actionsTotal: [{ count: 4 }],
                        },
                    ]);
                    return [4 /*yield*/, service.filterOptions({
                            page: 2,
                            limit: 2,
                            from: '2026-06-01T00:00:00.000Z',
                            to: '2026-06-09T00:00:00.000Z',
                        })];
                case 1:
                    result = _a.sent();
                    expect(result.modules).toEqual([
                        { value: 'product', label: 'Product', count: 5 },
                        { value: 'proposal', label: 'Proposal', count: 2 },
                    ]);
                    expect(result.modules).not.toContainEqual(expect.objectContaining({ value: 'website' }));
                    expect(result.action_types).toEqual([
                        { value: 'update', label: 'update', count: 4 },
                        { value: 'reject', label: 'reject', count: 1 },
                    ]);
                    expect(result.actions).toHaveLength(2);
                    expect(result.users).toEqual([
                        {
                            value: '507f1f77bcf86cd799439011',
                            label: 'Admin User',
                            count: 3,
                        },
                        {
                            value: '507f1f77bcf86cd799439012',
                            label: 'vendor@example.com',
                            count: 2,
                        },
                    ]);
                    expect(result.pagination).toEqual({
                        page: 2,
                        limit: 2,
                        totalCount: 4,
                        totalPages: 2,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('builds filter options with a single optimized aggregation pipeline', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pipeline;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auditAggregateExecMock.mockResolvedValueOnce([
                        {
                            modules: [],
                            action_types: [],
                            actions: [],
                            users: [],
                            actionsTotal: [],
                        },
                    ]);
                    return [4 /*yield*/, service.filterOptions({
                            page: 3,
                            limit: 10,
                            module: 'product',
                            action_type: 'update',
                            actor_user_id: 'user-1',
                            urn_no: 'URN-1',
                            from: '2026-06-01T00:00:00.000Z',
                            to: '2026-06-09T00:00:00.000Z',
                        })];
                case 1:
                    _a.sent();
                    expect(auditAggregateMock).toHaveBeenCalledTimes(1);
                    pipeline = auditAggregateMock.mock.calls[0][0];
                    expect(pipeline[0]).toEqual({
                        $match: expect.objectContaining({
                            module: 'product',
                            action_type: 'update',
                            'resource.urn_no': 'URN-1',
                            $or: expect.arrayContaining([
                                { 'actor.user_id': 'user-1' },
                                { 'performed_by.user_id': 'user-1' },
                                { 'actor.vendor_id': 'user-1' },
                                { 'actor.manufacturer_id': 'user-1' },
                                { 'performed_by.email': /^user-1$/i },
                                { 'performed_by.name': /^user-1$/i },
                            ]),
                        }),
                    });
                    expect(pipeline[1].$facet.actions).toEqual(expect.arrayContaining([{ $skip: 20 }, { $limit: 10 }]));
                    expect(pipeline[1].$facet.users).toEqual(expect.arrayContaining([{ $skip: 20 }, { $limit: 10 }]));
                    return [2 /*return*/];
            }
        });
    }); });
    it('transforms enums, foreign keys, and changes for audit API output', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auditFindExecMock.mockResolvedValueOnce([
                        {
                            action: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED,
                            outcome: 'success',
                            old_values: {
                                category_id: 1,
                                paymentType: 'registration',
                                paymentMode: 'cheque_or_dd',
                                vendorProposalApprovalStatus: 0,
                                productStatus: 1,
                                productRenewStatus: 0,
                                reviewStatus: 0,
                                processManufacturingStatus: 1,
                                updatedDate: '2026-06-08T00:00:00.000Z',
                                quoteTotal: 1000,
                            },
                            new_values: {
                                category_id: 2,
                                paymentType: 'certification',
                                paymentMode: 'neft_or_rtgs',
                                vendorProposalApprovalStatus: 1,
                                productStatus: 2,
                                productRenewStatus: 1,
                                reviewStatus: 1,
                                processManufacturingStatus: 2,
                                updatedDate: '2026-06-09T00:00:00.000Z',
                                quoteTotal: 1200,
                            },
                            changes: {
                                category_id: { before: 1, after: 2 },
                                paymentType: { before: 'registration', after: 'certification' },
                                paymentMode: { before: 'cheque_or_dd', after: 'neft_or_rtgs' },
                                vendorProposalApprovalStatus: { before: 0, after: 1 },
                                paymentStatus: { before: 1, after: 2 },
                                productStatus: { before: 1, after: 2 },
                                productRenewStatus: { before: 0, after: 1 },
                                reviewStatus: { before: 0, after: 1 },
                                processManufacturingStatus: { before: 1, after: 2 },
                                updatedDate: {
                                    before: '2026-06-08T00:00:00.000Z',
                                    after: '2026-06-09T00:00:00.000Z',
                                },
                                quoteTotal: { before: 1000, after: 1200 },
                            },
                        },
                    ]);
                    lookupFindExecMock.mockResolvedValueOnce([
                        { category_id: 1, category_name: 'Paints' },
                        { category_id: 2, category_name: 'Adhesives' },
                    ]);
                    execMock.mockResolvedValueOnce(1);
                    return [4 /*yield*/, service.list({})];
                case 1:
                    result = _a.sent();
                    expect(result.items[0].old_values).toEqual({
                        category_id: 'Paints',
                        paymentType: 'Registration',
                        paymentMode: 'Cheque / DD',
                        vendorProposalApprovalStatus: 'Proposal Pending',
                        productStatus: 'Submitted',
                        productRenewStatus: 'Not Renewed',
                        reviewStatus: 'Pending',
                    });
                    expect(result.items[0].new_values).toEqual({
                        category_id: 'Adhesives',
                        paymentType: 'Certification',
                        paymentMode: 'NEFT / RTGS',
                        vendorProposalApprovalStatus: 'Proposal Approved',
                        productStatus: 'Certified',
                        productRenewStatus: 'Renewal In Progress',
                        reviewStatus: 'Approved',
                    });
                    expect(result.items[0].changes).toEqual({
                        category_id: { before: 'Paints', after: 'Adhesives' },
                        paymentType: { before: 'Registration', after: 'Certification' },
                        paymentMode: { before: 'Cheque / DD', after: 'NEFT / RTGS' },
                        vendorProposalApprovalStatus: {
                            before: 'Proposal Pending',
                            after: 'Proposal Approved',
                        },
                        paymentStatus: { before: 'Paid', after: 'Payment Approve' },
                        productStatus: { before: 'Submitted', after: 'Certified' },
                        productRenewStatus: {
                            before: 'Not Renewed',
                            after: 'Renewal In Progress',
                        },
                        reviewStatus: { before: 'Pending', after: 'Approved' },
                    });
                    expect(result.items[0].old_values).not.toHaveProperty('processManufacturingStatus');
                    expect(result.items[0].new_values).not.toHaveProperty('processManufacturingStatus');
                    expect(result.items[0].changes).not.toHaveProperty('processManufacturingStatus');
                    return [2 /*return*/];
            }
        });
    }); });
    it('filters audit list rows by actor user id, email, or display name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var filter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auditFindExecMock.mockResolvedValueOnce([
                        {
                            action: audit_actions_1.AUDIT_ACTION.AUTH_LOGIN,
                            performed_by: { name: 'Prabhas Miraki', email: 'prabhas@example.com' },
                        },
                    ]);
                    execMock.mockResolvedValueOnce(1);
                    return [4 /*yield*/, service.list({ actor_user_id: 'Prabhas Miraki' })];
                case 1:
                    _a.sent();
                    filter = auditFindMock.mock.calls[0][0];
                    expect(filter.$or).toEqual(expect.arrayContaining([
                        { 'performed_by.name': /^Prabhas Miraki$/i },
                        { 'performed_by.email': /^Prabhas Miraki$/i },
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    it('resolves product references to names with deleted-product fallbacks in list output', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auditFindExecMock.mockResolvedValueOnce([
                        {
                            action: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION,
                            outcome: 'success',
                            old_values: {
                                productId: 101,
                                productIds: [101, 999],
                                rows: [{ productId: 102 }],
                            },
                            new_values: {
                                productId: 102,
                                product_ids: [101, 102],
                                rows: [{ productId: 999 }],
                            },
                            changes: {
                                productId: { before: 101, after: 102 },
                                rows: {
                                    before: [{ productId: 102 }],
                                    after: [{ productId: 999 }],
                                },
                            },
                        },
                    ]);
                    lookupFindExecMock.mockResolvedValueOnce([
                        { productId: 101, productName: 'Eco Paint' },
                        { productId: 102, productName: 'Green Adhesive' },
                    ]);
                    execMock.mockResolvedValueOnce(1);
                    return [4 /*yield*/, service.list({})];
                case 1:
                    result = _a.sent();
                    expect(lookupFindExecMock).toHaveBeenCalledTimes(1);
                    expect(result.items[0].old_values).toEqual({
                        productId: 'Eco Paint',
                        productIds: ['Eco Paint', 'Deleted product (999)'],
                        rows: [{ productId: 'Green Adhesive' }],
                    });
                    expect(result.items[0].new_values).toEqual({
                        productId: 'Green Adhesive',
                        product_ids: ['Eco Paint', 'Green Adhesive'],
                        rows: [{ productId: 'Deleted product (999)' }],
                    });
                    expect(result.items[0].changes).toEqual({
                        productId: { before: 'Eco Paint', after: 'Green Adhesive' },
                        rows: {
                            before: [{ productId: 'Green Adhesive' }],
                            after: [{ productId: 'Deleted product (999)' }],
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('resolves productsToBeCertified JSON productIds to product names in list output', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auditFindExecMock.mockResolvedValueOnce([
                        {
                            action: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED,
                            outcome: 'success',
                            module: 'payment',
                            old_values: {
                                paymentType: 'certification',
                                productsToBeCertified: '[101]',
                            },
                            new_values: {
                                paymentType: 'certification',
                                paymentStatus: 2,
                                productsToBeCertified: '[101,102]',
                            },
                            changes: {
                                paymentStatus: { before: 1, after: 2 },
                                productsToBeCertified: { before: '[101]', after: '[101,102]' },
                            },
                        },
                    ]);
                    lookupFindExecMock.mockResolvedValueOnce([
                        { productId: 101, productName: 'Eco Paint' },
                        { productId: 102, productName: 'Green Adhesive' },
                    ]);
                    execMock.mockResolvedValueOnce(1);
                    return [4 /*yield*/, service.list({})];
                case 1:
                    result = _a.sent();
                    expect(result.items[0].old_values).toEqual({
                        paymentType: 'Certification',
                        productsToBeCertified: 'Eco Paint',
                    });
                    expect(result.items[0].new_values).toEqual({
                        paymentType: 'Certification',
                        paymentStatus: 'Payment Approve',
                        productsToBeCertified: 'Eco Paint, Green Adhesive',
                    });
                    expect(result.items[0].changes).toEqual({
                        paymentStatus: { before: 'Paid', after: 'Payment Approve' },
                        productsToBeCertified: {
                            before: 'Eco Paint',
                            after: 'Eco Paint, Green Adhesive',
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns detail snapshots from the audit record without current entity lookup', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = '507f1f77bcf86cd799439011';
                    auditFindByIdExecMock.mockResolvedValueOnce({
                        _id: id,
                        action: audit_actions_1.AUDIT_ACTION.PAYMENT_UPDATED,
                        outcome: 'success',
                        old_values: {
                            category_id: 1,
                            paymentType: 'registration',
                            productStatus: 1,
                            reviewStatus: 0,
                            updatedDate: '2026-06-08T00:00:00.000Z',
                        },
                        new_values: {
                            category_id: 2,
                            paymentType: 'certification',
                            productStatus: 2,
                            reviewStatus: 1,
                            updatedDate: '2026-06-09T00:00:00.000Z',
                        },
                        changes: {
                            category_id: { before: 1, after: 2 },
                            paymentType: { before: 'registration', after: 'certification' },
                            productStatus: { before: 1, after: 2 },
                            reviewStatus: { before: 0, after: 1 },
                            updatedDate: {
                                before: '2026-06-08T00:00:00.000Z',
                                after: '2026-06-09T00:00:00.000Z',
                            },
                        },
                    });
                    lookupFindExecMock.mockResolvedValueOnce([
                        { category_id: 1, category_name: 'Current Paint Name' },
                        { category_id: 2, category_name: 'Current Adhesive Name' },
                    ]);
                    return [4 /*yield*/, service.findById(id)];
                case 1:
                    result = _a.sent();
                    expect(lookupFindExecMock).not.toHaveBeenCalled();
                    expect(result === null || result === void 0 ? void 0 : result.old_values).toEqual({
                        category_id: 1,
                        paymentType: 'Registration',
                        productStatus: 'Submitted',
                        reviewStatus: 'Pending',
                    });
                    expect(result === null || result === void 0 ? void 0 : result.new_values).toEqual({
                        category_id: 2,
                        paymentType: 'Certification',
                        productStatus: 'Certified',
                        reviewStatus: 'Approved',
                    });
                    expect(result === null || result === void 0 ? void 0 : result.changes).toEqual({
                        category_id: { before: 1, after: 2 },
                        paymentType: { before: 'Registration', after: 'Certification' },
                        productStatus: { before: 'Submitted', after: 'Certified' },
                        reviewStatus: { before: 'Pending', after: 'Approved' },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('resolves product references in detail output without looking up other foreign keys', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = '507f1f77bcf86cd799439012';
                    auditFindByIdExecMock.mockResolvedValueOnce({
                        _id: id,
                        action: audit_actions_1.AUDIT_ACTION.HTTP_MUTATION,
                        outcome: 'success',
                        old_values: {
                            category_id: 1,
                            productId: 101,
                        },
                        new_values: {
                            category_id: 2,
                            productId: 999,
                        },
                        changes: {
                            category_id: { before: 1, after: 2 },
                            productId: { before: 101, after: 999 },
                        },
                    });
                    lookupFindExecMock.mockResolvedValueOnce([
                        { productId: 101, productName: 'Eco Paint' },
                    ]);
                    return [4 /*yield*/, service.findById(id)];
                case 1:
                    result = _a.sent();
                    expect(lookupFindExecMock).toHaveBeenCalledTimes(1);
                    expect(result === null || result === void 0 ? void 0 : result.old_values).toEqual({
                        category_id: 1,
                        productId: 'Eco Paint',
                    });
                    expect(result === null || result === void 0 ? void 0 : result.new_values).toEqual({
                        category_id: 2,
                        productId: 'Deleted product (999)',
                    });
                    expect(result === null || result === void 0 ? void 0 : result.changes).toEqual({
                        category_id: { before: 1, after: 2 },
                        productId: { before: 'Eco Paint', after: 'Deleted product (999)' },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
