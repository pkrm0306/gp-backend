import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLogService } from './audit-log.service';
import { AUDIT_ACTION } from './audit-actions';
import { AuditLog } from './schemas/audit-log.schema';
import { Category } from '../categories/schemas/category.schema';
import { Sector } from '../sectors/schemas/sector.schema';
import { Manufacturer } from '../manufacturers/schemas/manufacturer.schema';
import { Country } from '../countries/schemas/country.schema';
import { State } from '../states/schemas/state.schema';
import { Standard } from '../standards/schemas/standard.schema';
import { Product } from '../product-registration/schemas/product.schema';
import { Role } from '../rbac/schemas/role.schema';
import { VendorUser } from '../vendor-users/schemas/vendor-user.schema';
import { AuditLookupResolver } from './audit-lookup-resolver.service';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';
import { AuditPayloadPresenter } from './audit-payload-presenter.service';

describe('AuditLogService', () => {
  let service: AuditLogService;
  const createMock = jest.fn().mockResolvedValue({ _id: 'x' });
  const execMock = jest.fn().mockResolvedValue([]);
  const countDocumentsMock = jest.fn().mockReturnValue({ exec: execMock });
  const auditFindExecMock = jest.fn();
  const auditFindByIdExecMock = jest.fn();
  const auditAggregateExecMock = jest.fn();
  const lookupFindExecMock = jest.fn().mockResolvedValue([]);
  const auditFindMock = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: auditFindExecMock,
  });
  const auditFindByIdMock = jest.fn().mockReturnValue({
    lean: jest.fn().mockReturnThis(),
    exec: auditFindByIdExecMock,
  });
  const auditAggregateMock = jest.fn().mockReturnValue({
    exec: auditAggregateExecMock,
  });
  const lookupModelMock = {
    find: jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: lookupFindExecMock,
      }),
    }),
  };

  beforeEach(async () => {
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        AuditLookupResolver,
        AuditStatusResolver,
        AuditValueTransformer,
        AuditPayloadPresenter,
        {
          provide: getModelToken(AuditLog.name),
          useValue: {
            create: createMock,
            find: auditFindMock,
            findById: auditFindByIdMock,
            aggregate: auditAggregateMock,
            countDocuments: countDocumentsMock,
          },
        },
        { provide: getModelToken(Category.name), useValue: lookupModelMock },
        { provide: getModelToken(Sector.name), useValue: lookupModelMock },
        {
          provide: getModelToken(Manufacturer.name),
          useValue: lookupModelMock,
        },
        { provide: getModelToken(Country.name), useValue: lookupModelMock },
        { provide: getModelToken(State.name), useValue: lookupModelMock },
        { provide: getModelToken(Standard.name), useValue: lookupModelMock },
        { provide: getModelToken(Product.name), useValue: lookupModelMock },
        { provide: getModelToken(Role.name), useValue: lookupModelMock },
        { provide: getModelToken(VendorUser.name), useValue: lookupModelMock },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  it('inserts audit document on record()', async () => {
    await service.record({
      action: AUDIT_ACTION.HTTP_MUTATION,
      outcome: 'success',
      http_method: 'POST',
      route: '/test',
      status_code: 200,
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock.mock.calls[0][0].action).toBe(AUDIT_ACTION.HTTP_MUTATION);
  });

  it('does not throw when create fails', async () => {
    createMock.mockRejectedValueOnce(new Error('db down'));
    await expect(
      service.record({
        action: AUDIT_ACTION.AUTH_LOGIN,
        outcome: 'failure',
      }),
    ).resolves.toBeUndefined();
  });

  it('skips duplicate audit event inserts without throwing', async () => {
    createMock.mockRejectedValueOnce({ code: 11000, message: 'duplicate key' });

    await expect(
      service.record({
        action: AUDIT_ACTION.HTTP_MUTATION,
        outcome: 'success',
        metadata: { audit_event_id: 'event-1' },
      }),
    ).resolves.toBeUndefined();
  });

  it('appends failure and success events without changing prior history', async () => {
    await service.record({
      action: AUDIT_ACTION.PAYMENT_UPDATED,
      outcome: 'failure',
      resource: { type: 'Payment', id: 'URN-1', urn_no: 'URN-1' },
      metadata: { audit_event_id: 'event-failure' },
      new_values: { paymentStatus: 3 },
    });
    await service.record({
      action: AUDIT_ACTION.PAYMENT_UPDATED,
      outcome: 'success',
      resource: { type: 'Payment', id: 'URN-1', urn_no: 'URN-1' },
      metadata: { audit_event_id: 'event-success' },
      new_values: { paymentStatus: 1 },
    });

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
  });

  it('supports transaction-scoped insert-only audit records', async () => {
    const session = { id: 'session-1' } as never;

    await service.record(
      {
        action: AUDIT_ACTION.HTTP_MUTATION,
        outcome: 'success',
        metadata: { audit_event_id: 'event-transaction' },
      },
      { session },
    );

    expect(createMock).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          action: AUDIT_ACTION.HTTP_MUTATION,
          outcome: 'success',
          metadata: { audit_event_id: 'event-transaction' },
        }),
      ],
      { session },
    );
  });

  it('can fail the surrounding transaction when requested', async () => {
    const error = new Error('transaction insert failed');
    createMock.mockRejectedValueOnce(error);

    await expect(
      service.record(
        {
          action: AUDIT_ACTION.HTTP_MUTATION,
          outcome: 'failure',
        },
        { throwOnError: true },
      ),
    ).rejects.toThrow(error);
  });

  it('removes ignored system and calculated fields before insert', async () => {
    await service.record({
      action: AUDIT_ACTION.HTTP_MUTATION,
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
    });

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
  });

  it('maps updateStatusTo to a display label in list new_values', async () => {
    auditFindExecMock.mockResolvedValueOnce([
      {
        action: AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED,
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
        action: AUDIT_ACTION.PAYMENT_UPDATED,
        outcome: 'success',
        new_values: {
          paymentStatus: 1,
        },
      },
      {
        action: AUDIT_ACTION.PAYMENT_UPDATED,
        outcome: 'success',
        new_values: {
          paymentStatus: 2,
        },
      },
      {
        action: AUDIT_ACTION.PAYMENT_UPDATED,
        outcome: 'success',
        new_values: {
          paymentStatus: 3,
        },
      },
    ]);
    execMock.mockResolvedValueOnce(4);

    const result = await service.list({});

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
  });

  it('returns only active modules in paginated filter options', async () => {
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
          { _id: AUDIT_ACTION.HTTP_MUTATION, count: 3 },
          { _id: AUDIT_ACTION.PAYMENT_UPDATED, count: 2 },
        ],
        users: [
          { _id: '507f1f77bcf86cd799439011', label: 'Admin User', count: 3 },
          { _id: '507f1f77bcf86cd799439012', label: 'vendor@example.com', count: 2 },
        ],
        actionsTotal: [{ count: 4 }],
      },
    ]);

    const result = await service.filterOptions({
      page: 2,
      limit: 2,
      from: '2026-06-01T00:00:00.000Z',
      to: '2026-06-09T00:00:00.000Z',
    });

    expect(result.modules).toEqual([
      { value: 'product', label: 'Product', count: 5 },
      { value: 'proposal', label: 'Proposal', count: 2 },
    ]);
    expect(result.modules).not.toContainEqual(
      expect.objectContaining({ value: 'website' }),
    );
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
  });

  it('builds filter options with a single optimized aggregation pipeline', async () => {
    auditAggregateExecMock.mockResolvedValueOnce([
      {
        modules: [],
        action_types: [],
        actions: [],
        users: [],
        actionsTotal: [],
      },
    ]);

    await service.filterOptions({
      page: 3,
      limit: 10,
      module: 'product',
      action_type: 'update',
      actor_user_id: 'user-1',
      urn_no: 'URN-1',
      from: '2026-06-01T00:00:00.000Z',
      to: '2026-06-09T00:00:00.000Z',
    });

    expect(auditAggregateMock).toHaveBeenCalledTimes(1);
    const pipeline = auditAggregateMock.mock.calls[0][0];
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
    expect(pipeline[1].$facet.actions).toEqual(
      expect.arrayContaining([{ $skip: 20 }, { $limit: 10 }]),
    );
    expect(pipeline[1].$facet.users).toEqual(
      expect.arrayContaining([{ $skip: 20 }, { $limit: 10 }]),
    );
  });

  it('transforms enums, foreign keys, and changes for audit API output', async () => {
    auditFindExecMock.mockResolvedValueOnce([
      {
        action: AUDIT_ACTION.PAYMENT_UPDATED,
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

    const result = await service.list({});

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
    expect(result.items[0].old_values).not.toHaveProperty(
      'processManufacturingStatus',
    );
    expect(result.items[0].new_values).not.toHaveProperty(
      'processManufacturingStatus',
    );
    expect(result.items[0].changes).not.toHaveProperty(
      'processManufacturingStatus',
    );
  });

  it('filters audit list rows by actor user id, email, or display name', async () => {
    auditFindExecMock.mockResolvedValueOnce([
      {
        action: AUDIT_ACTION.AUTH_LOGIN,
        performed_by: { name: 'Prabhas Miraki', email: 'prabhas@example.com' },
      },
    ]);
    execMock.mockResolvedValueOnce(1);

    await service.list({ actor_user_id: 'Prabhas Miraki' });

    const filter = auditFindMock.mock.calls[0][0];
    expect(filter.$or).toEqual(
      expect.arrayContaining([
        { 'performed_by.name': /^Prabhas Miraki$/i },
        { 'performed_by.email': /^Prabhas Miraki$/i },
      ]),
    );
  });

  it('resolves product references to names with deleted-product fallbacks in list output', async () => {
    auditFindExecMock.mockResolvedValueOnce([
      {
        action: AUDIT_ACTION.HTTP_MUTATION,
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

    const result = await service.list({});

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
  });

  it('resolves productsToBeCertified JSON productIds to product names in list output', async () => {
    auditFindExecMock.mockResolvedValueOnce([
      {
        action: AUDIT_ACTION.PAYMENT_UPDATED,
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

    const result = await service.list({});

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
  });

  it('returns detail snapshots from the audit record without current entity lookup', async () => {
    const id = '507f1f77bcf86cd799439011';
    auditFindByIdExecMock.mockResolvedValueOnce({
      _id: id,
      action: AUDIT_ACTION.PAYMENT_UPDATED,
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

    const result = await service.findById(id);

    expect(lookupFindExecMock).not.toHaveBeenCalled();
    expect(result?.old_values).toEqual({
      category_id: 1,
      paymentType: 'Registration',
      productStatus: 'Submitted',
      reviewStatus: 'Pending',
    });
    expect(result?.new_values).toEqual({
      category_id: 2,
      paymentType: 'Certification',
      productStatus: 'Certified',
      reviewStatus: 'Approved',
    });
    expect(result?.changes).toEqual({
      category_id: { before: 1, after: 2 },
      paymentType: { before: 'Registration', after: 'Certification' },
      productStatus: { before: 'Submitted', after: 'Certified' },
      reviewStatus: { before: 'Pending', after: 'Approved' },
    });
  });

  it('resolves product references in detail output without looking up other foreign keys', async () => {
    const id = '507f1f77bcf86cd799439012';
    auditFindByIdExecMock.mockResolvedValueOnce({
      _id: id,
      action: AUDIT_ACTION.HTTP_MUTATION,
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

    const result = await service.findById(id);

    expect(lookupFindExecMock).toHaveBeenCalledTimes(1);
    expect(result?.old_values).toEqual({
      category_id: 1,
      productId: 'Eco Paint',
    });
    expect(result?.new_values).toEqual({
      category_id: 2,
      productId: 'Deleted product (999)',
    });
    expect(result?.changes).toEqual({
      category_id: { before: 1, after: 2 },
      productId: { before: 'Eco Paint', after: 'Deleted product (999)' },
    });
  });
});
