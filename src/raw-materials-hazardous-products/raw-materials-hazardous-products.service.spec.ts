import { shouldReplaceRawMaterialsTableBeforeInsert } from '../common/raw-materials/raw-materials-upload.util';
import { RawMaterialsHazardousProductsService } from './raw-materials-hazardous-products.service';
import { AUDIT_ACTION } from '../audit-log/audit-actions';
import { AUDIT_ACTION_TYPE, AUDIT_MODULE } from '../audit-log/audit-friendlies';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';

describe('hazardous products replace handshake', () => {
  it('replaces when replaceTable is true', () => {
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({ replaceTable: 'true' }),
    ).toBe(true);
  });

  it('replaces when rowIndex is 0', () => {
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({
        rowIndex: '0',
        totalRows: '3',
      }),
    ).toBe(true);
  });

  it('does not replace when rowIndex > 0', () => {
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({
        rowIndex: '1',
        totalRows: '3',
      }),
    ).toBe(false);
  });

  it('replaces legacy single POST without handshake fields', () => {
    expect(shouldReplaceRawMaterialsTableBeforeInsert({ urnNo: 'URN-1' })).toBe(
      true,
    );
  });
});

describe('RawMaterialsHazardousProductsService delete auditing', () => {
  const vendorId = '507f1f77bcf86cd799439011';
  const session = { id: 'session-1' } as never;
  const findExec = jest.fn();
  const deleteMany = jest.fn();
  const auditRecord = jest.fn();

  function service() {
    const model = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        session: jest.fn().mockReturnThis(),
        exec: findExec,
      }),
      deleteMany,
    };
    return new RawMaterialsHazardousProductsService(
      model as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { record: auditRecord } as never,
    );
  }

  beforeEach(() => {
    findExec.mockReset();
    deleteMany.mockReset();
    auditRecord.mockReset();
    deleteMany.mockResolvedValue({ deletedCount: 1 });
    auditRecord.mockResolvedValue(undefined);
  });

  it('captures deleted rows before delete and records a transaction-scoped audit event', async () => {
    const row = {
      _id: 'row-1',
      urnNo: 'URN-1',
      vendorId,
      productsName: 'Paint',
      productsTestReport: 'Report 1',
    };
    findExec.mockResolvedValueOnce([row]);

    await service().deleteAllProductsForUrn('URN-1', vendorId, session, {
      user_id: 'user-1',
      name: 'Vendor User',
      email: 'vendor@example.com',
      role: 'vendor',
      vendor_id: vendorId,
    });

    expect(deleteMany).toHaveBeenCalledTimes(1);
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AUDIT_ACTION.RAW_MATERIALS_DELETED,
        module: AUDIT_MODULE.RAW_MATERIALS,
        action_type: AUDIT_ACTION_TYPE.DELETE,
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
          tab: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
          documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
          deletion_type: 'replace_or_clear',
        },
      }),
      { session },
    );
  });

  it('does not create a delete audit event when no rows were deleted', async () => {
    findExec.mockResolvedValueOnce([]);

    await service().deleteAllProductsForUrn('URN-1', vendorId, session);

    expect(deleteMany).toHaveBeenCalledTimes(1);
    expect(auditRecord).not.toHaveBeenCalled();
  });
});
