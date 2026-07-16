"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var audit_response_suppressed_fields_1 = require("./audit-response-suppressed-fields");
describe('audit-response-suppressed-fields', function () {
    it('flags process tab workflow status keys', function () {
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('processManufacturingStatus')).toBe(true);
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('process_innovation_status')).toBe(true);
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('productStewardshipStatus')).toBe(true);
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('processLifeCycleApproachStatus')).toBe(true);
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('processManufacturingStatusLabel')).toBe(true);
    });
    it('does not flag unrelated status keys', function () {
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('urnStatus')).toBe(false);
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('productStatus')).toBe(false);
    });
    it('flags waste management workflow status for audit responses', function () {
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('processWasteManagementStatus')).toBe(true);
        expect((0, audit_response_suppressed_fields_1.isAuditResponseSuppressedFieldKey)('process_waste_management_status')).toBe(true);
    });
    it('omits suppressed keys from audit value snapshots in API output', function () {
        expect((0, audit_response_suppressed_fields_1.omitSuppressedAuditResponseFields)({
            urnNo: 'URN-1',
            processManufacturingStatus: 'In Progress',
            productStewardshipStatus: 'Completed',
            processInnovationStatus: 2,
            processLifeCycleApproachStatus: 1,
            processWasteManagementStatus: 'In Progress',
            productName: 'Tile',
        })).toEqual({
            urnNo: 'URN-1',
            productName: 'Tile',
        });
    });
    it('omits suppressed keys from audit change pairs in API output', function () {
        expect((0, audit_response_suppressed_fields_1.omitSuppressedAuditResponseChanges)({
            productName: { before: 'A', after: 'B' },
            processInnovationStatus: { before: 1, after: 2 },
        })).toEqual({
            productName: { before: 'A', after: 'B' },
        });
    });
});
