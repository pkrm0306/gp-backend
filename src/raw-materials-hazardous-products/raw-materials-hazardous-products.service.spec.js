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
var raw_materials_upload_util_1 = require("../common/raw-materials/raw-materials-upload.util");
var raw_materials_hazardous_products_service_1 = require("./raw-materials-hazardous-products.service");
var audit_actions_1 = require("../audit-log/audit-actions");
var audit_friendlies_1 = require("../audit-log/audit-friendlies");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
describe('hazardous products replace handshake', function () {
    it('replaces when replaceTable is true', function () {
        expect((0, raw_materials_upload_util_1.shouldReplaceRawMaterialsTableBeforeInsert)({ replaceTable: 'true' })).toBe(true);
    });
    it('replaces when rowIndex is 0', function () {
        expect((0, raw_materials_upload_util_1.shouldReplaceRawMaterialsTableBeforeInsert)({
            rowIndex: '0',
            totalRows: '3',
        })).toBe(true);
    });
    it('does not replace when rowIndex > 0', function () {
        expect((0, raw_materials_upload_util_1.shouldReplaceRawMaterialsTableBeforeInsert)({
            rowIndex: '1',
            totalRows: '3',
        })).toBe(false);
    });
    it('replaces legacy single POST without handshake fields', function () {
        expect((0, raw_materials_upload_util_1.shouldReplaceRawMaterialsTableBeforeInsert)({ urnNo: 'URN-1' })).toBe(true);
    });
});
describe('RawMaterialsHazardousProductsService delete auditing', function () {
    var vendorId = '507f1f77bcf86cd799439011';
    var session = { id: 'session-1' };
    var findExec = jest.fn();
    var deleteMany = jest.fn();
    var auditRecord = jest.fn();
    function service() {
        var model = {
            find: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                session: jest.fn().mockReturnThis(),
                exec: findExec,
            }),
            deleteMany: deleteMany,
        };
        return new raw_materials_hazardous_products_service_1.RawMaterialsHazardousProductsService(model, {}, {}, {}, {}, {}, { record: auditRecord });
    }
    beforeEach(function () {
        findExec.mockReset();
        deleteMany.mockReset();
        auditRecord.mockReset();
        deleteMany.mockResolvedValue({ deletedCount: 1 });
        auditRecord.mockResolvedValue(undefined);
    });
    it('captures deleted rows before delete and records a transaction-scoped audit event', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    row = {
                        _id: 'row-1',
                        urnNo: 'URN-1',
                        vendorId: vendorId,
                        productsName: 'Paint',
                        productsTestReport: 'Report 1',
                    };
                    findExec.mockResolvedValueOnce([row]);
                    return [4 /*yield*/, service().deleteAllProductsForUrn('URN-1', vendorId, session, {
                            user_id: 'user-1',
                            name: 'Vendor User',
                            email: 'vendor@example.com',
                            role: 'vendor',
                            vendor_id: vendorId,
                        })];
                case 1:
                    _a.sent();
                    expect(deleteMany).toHaveBeenCalledTimes(1);
                    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({
                        action: audit_actions_1.AUDIT_ACTION.RAW_MATERIALS_DELETED,
                        module: audit_friendlies_1.AUDIT_MODULE.RAW_MATERIALS,
                        action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.DELETE,
                        entity_name: 'URN-1',
                        performed_by: {
                            user_id: 'user-1',
                            name: 'Vendor User',
                            email: 'vendor@example.com',
                        },
                        old_values: {
                            records: [row],
                            count: 1,
                        },
                        actor: expect.objectContaining({
                            user_id: 'user-1',
                            role: 'vendor',
                            vendor_id: vendorId,
                        }),
                        resource: {
                            type: 'RawMaterialsHazardousProducts',
                            id: 'URN-1',
                            urn_no: 'URN-1',
                        },
                        metadata: {
                            tab: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                            documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                            deletion_type: 'replace_or_clear',
                        },
                    }), { session: session });
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not create a delete audit event when no rows were deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findExec.mockResolvedValueOnce([]);
                    return [4 /*yield*/, service().deleteAllProductsForUrn('URN-1', vendorId, session)];
                case 1:
                    _a.sent();
                    expect(deleteMany).toHaveBeenCalledTimes(1);
                    expect(auditRecord).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
