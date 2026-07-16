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
var audit_log_admin_controller_1 = require("./audit-log-admin.controller");
var audit_friendlies_1 = require("./audit-friendlies");
var audit_route_map_1 = require("./audit-route-map");
var audit_status_resolver_service_1 = require("./audit-status-resolver.service");
var audit_value_transformer_service_1 = require("./audit-value-transformer.service");
describe('audit module resolution', function () {
    var routeMapper;
    beforeEach(function () {
        var statusResolver = new audit_status_resolver_service_1.AuditStatusResolver();
        var valueTransformer = new audit_value_transformer_service_1.AuditValueTransformer(statusResolver);
        routeMapper = new audit_route_map_1.AuditRouteMapper(valueTransformer);
    });
    it('does not classify urn_status 4 as reject', function () {
        var result = routeMapper.map('PATCH', '/api/admin/products/urn-status', request({
            urnNo: 'URN-1',
            updateStatusType: 'urn_status',
            updateStatusTo: 4,
        }), 'success');
        expect(result.action_type).toBe('update');
        expect(result.description).toBe('Certification / URN status updated');
    });
    it('classifies vendor send-back and payment rejection correctly', function () {
        var sentBack = routeMapper.map('PATCH', '/api/admin/products/urn-status', request({
            updateStatusType: 'urn_status',
            updateStatusTo: 5,
        }), 'success');
        var paymentRejected = routeMapper.map('PATCH', '/api/admin/products/urn-status', request({
            updateStatusType: 'urn_status',
            updateStatusTo: 9,
        }), 'success');
        expect(sentBack.action_type).toBe('reject');
        expect(paymentRejected.action_type).toBe('reject');
    });
    it('maps vendor proposal approval to the proposal module', function () {
        var result = routeMapper.map('PATCH', '/payments/URN-1/vendor-proposal-approval', request({
            vendorProposalApprovalStatus: 1,
            paymentType: 'registration',
        }), 'success');
        expect(result).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.PROPOSAL,
            action_type: 'approve',
            description: 'Proposal approved',
            entity_name: 'URN-1',
        });
    });
    it('maps vendor proposal rejection to the proposal module', function () {
        var result = routeMapper.map('PATCH', '/payments/URN-2/vendor-proposal-approval', request({
            vendorProposalApprovalStatus: 2,
            paymentType: 'registration',
            proposalRejectionRemarks: 'Revise proposal',
        }), 'success');
        expect(result).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.PROPOSAL,
            action_type: 'reject',
            description: 'Proposal rejected',
            entity_name: 'URN-2',
        });
    });
    it('resolves centralized module display names', function () {
        expect((0, audit_friendlies_1.auditModuleDisplayName)(audit_friendlies_1.AUDIT_MODULE.PROPOSAL)).toBe('Proposal');
        expect((0, audit_friendlies_1.auditModuleDisplayName)(audit_friendlies_1.AUDIT_MODULE.CATEGORY)).toBe('Category');
        expect((0, audit_friendlies_1.auditModuleDisplayName)(audit_friendlies_1.AUDIT_MODULE.SECTOR)).toBe('Sector');
        expect((0, audit_friendlies_1.auditModuleDisplayName)(audit_friendlies_1.AUDIT_MODULE.STANDARD)).toBe('Standard');
        expect((0, audit_friendlies_1.auditModuleDisplayName)(audit_friendlies_1.AUDIT_MODULE.RAW_MATERIALS)).toBe('Raw Materials');
        expect((0, audit_friendlies_1.auditModuleDisplayName)('custom_module')).toBe('Custom Module');
        expect((0, audit_friendlies_1.auditModuleDisplayName)(undefined)).toBeNull();
    });
    it('maps category controller routes to the category module', function () {
        var create = routeMapper.map('POST', '/addcategory', request({ category_name: 'Paints' }), 'success');
        var update = routeMapper.map('PUT', '/categories/123', request({ category_name: 'Adhesives' }), 'success');
        var status = routeMapper.map('PATCH', '/categories/123/status', request({ category_name: 'Paints', status: 1 }), 'success');
        var remove = routeMapper.map('DELETE', '/categories/123', request({}), 'success');
        expect(create).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: 'create',
            description: 'Category created',
            entity_name: 'Paints',
        });
        expect(update).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: 'update',
            description: 'Category updated',
            entity_name: 'Adhesives',
        });
        expect(status).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: 'update',
            description: 'Category status updated',
            entity_name: 'Paints',
        });
        expect(remove).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.CATEGORY,
            action_type: 'delete',
            description: 'Category deleted',
            entity_name: '123',
        });
    });
    it('maps sector controller routes to the sector module', function () {
        var create = routeMapper.map('POST', '/api/sectors', request({ name: 'Building Materials' }), 'success');
        var update = routeMapper.map('PUT', '/api/sectors/123', request({ name: 'Construction' }), 'success');
        var status = routeMapper.map('PATCH', '/api/sectors/123/status', request({ status: 1 }), 'success');
        var remove = routeMapper.map('DELETE', '/api/sectors/123', request({}), 'success');
        expect(create).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.SECTOR,
            action_type: 'create',
            description: 'Sector created',
            entity_name: 'Building Materials',
        });
        expect(update).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.SECTOR,
            action_type: 'update',
            description: 'Sector updated',
            entity_name: 'Construction',
        });
        expect(status).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.SECTOR,
            action_type: 'update',
            description: 'Sector status updated',
            entity_name: '123',
        });
        expect(remove).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.SECTOR,
            action_type: 'delete',
            description: 'Sector deleted',
            entity_name: '123',
        });
    });
    it('maps standard controller routes to the standard module', function () {
        var create = routeMapper.map('POST', '/api/standards', request({ name: 'GreenPro Standard' }), 'success');
        var edit = routeMapper.map('PATCH', '/api/standards/123/edit', request({ name: 'Updated Standard' }), 'success');
        var status = routeMapper.map('PATCH', '/api/standards/123/status', request({ status: 1 }), 'success');
        var remove = routeMapper.map('DELETE', '/api/standards/123', request({}), 'success');
        expect(create).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: 'create',
            description: 'Standard created',
            entity_name: 'GreenPro Standard',
        });
        expect(edit).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: 'update',
            description: 'Standard updated',
            entity_name: 'Updated Standard',
        });
        expect(status).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: 'update',
            description: 'Standard status updated',
            entity_name: '123',
        });
        expect(remove).toMatchObject({
            module: audit_friendlies_1.AUDIT_MODULE.STANDARD,
            action_type: 'delete',
            description: 'Standard deleted',
            entity_name: '123',
        });
    });
    it('returns module display name in admin audit API rows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = new audit_log_admin_controller_1.AuditLogAdminController({
                        list: jest.fn().mockResolvedValue({
                            items: [
                                {
                                    action: 'HTTP_MUTATION',
                                    outcome: 'success',
                                    module: audit_friendlies_1.AUDIT_MODULE.PROPOSAL,
                                    action_type: 'approve',
                                    description: 'Proposal approved',
                                    performed_by: { name: 'Vendor User' },
                                    new_values: { vendorProposalApprovalStatus: 1 },
                                },
                            ],
                            total: 1,
                            page: 1,
                            limit: 20,
                            pages: 1,
                            from: new Date('2026-06-01T00:00:00.000Z'),
                            to: new Date('2026-06-09T00:00:00.000Z'),
                        }),
                    });
                    return [4 /*yield*/, controller.list({})];
                case 1:
                    response = _a.sent();
                    expect(response.data[0]).toMatchObject({
                        module: audit_friendlies_1.AUDIT_MODULE.PROPOSAL,
                        module_display: 'Proposal',
                        action_display: 'approve',
                        user_display: 'Vendor User',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
function request(body) {
    return {
        body: body,
    };
}
