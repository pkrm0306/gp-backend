import {
  isAuditResponseSuppressedFieldKey,
  omitSuppressedAuditResponseChanges,
  omitSuppressedAuditResponseFields,
} from './audit-response-suppressed-fields';

describe('audit-response-suppressed-fields', () => {
  it('flags process tab workflow status keys', () => {
    expect(isAuditResponseSuppressedFieldKey('processManufacturingStatus')).toBe(
      true,
    );
    expect(isAuditResponseSuppressedFieldKey('process_innovation_status')).toBe(
      true,
    );
    expect(isAuditResponseSuppressedFieldKey('productStewardshipStatus')).toBe(
      true,
    );
    expect(
      isAuditResponseSuppressedFieldKey('processLifeCycleApproachStatus'),
    ).toBe(true);
    expect(
      isAuditResponseSuppressedFieldKey('processManufacturingStatusLabel'),
    ).toBe(true);
  });

  it('does not flag unrelated status keys', () => {
    expect(isAuditResponseSuppressedFieldKey('urnStatus')).toBe(false);
    expect(isAuditResponseSuppressedFieldKey('productStatus')).toBe(false);
  });

  it('flags waste management workflow status for audit responses', () => {
    expect(
      isAuditResponseSuppressedFieldKey('processWasteManagementStatus'),
    ).toBe(true);
    expect(
      isAuditResponseSuppressedFieldKey('process_waste_management_status'),
    ).toBe(true);
  });

  it('omits suppressed keys from audit value snapshots in API output', () => {
    expect(
      omitSuppressedAuditResponseFields({
        urnNo: 'URN-1',
        processManufacturingStatus: 'In Progress',
        productStewardshipStatus: 'Completed',
        processInnovationStatus: 2,
        processLifeCycleApproachStatus: 1,
        processWasteManagementStatus: 'In Progress',
        productName: 'Tile',
      }),
    ).toEqual({
      urnNo: 'URN-1',
      productName: 'Tile',
    });
  });

  it('omits suppressed keys from audit change pairs in API output', () => {
    expect(
      omitSuppressedAuditResponseChanges({
        productName: { before: 'A', after: 'B' },
        processInnovationStatus: { before: 1, after: 2 },
      }),
    ).toEqual({
      productName: { before: 'A', after: 'B' },
    });
  });
});
