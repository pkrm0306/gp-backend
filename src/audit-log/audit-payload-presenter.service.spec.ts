import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditPayloadPresenter } from './audit-payload-presenter.service';
import { AuditLookupResolver } from './audit-lookup-resolver.service';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';
import { AUDIT_ACTION } from './audit-actions';
import { Category } from '../categories/schemas/category.schema';
import { Sector } from '../sectors/schemas/sector.schema';
import { Manufacturer } from '../manufacturers/schemas/manufacturer.schema';
import { Country } from '../countries/schemas/country.schema';
import { State } from '../states/schemas/state.schema';
import { Standard } from '../standards/schemas/standard.schema';
import { Product } from '../product-registration/schemas/product.schema';
import { Role } from '../rbac/schemas/role.schema';
import { VendorUser } from '../vendor-users/schemas/vendor-user.schema';
import { toAuditLogResponseDto } from './dto/audit-log-response.dto';

describe('AuditPayloadPresenter', () => {
  let presenter: AuditPayloadPresenter;
  const lookupFindExecMock = jest.fn().mockResolvedValue([]);
  const lookupModelMock = {
    find: jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: lookupFindExecMock,
      }),
    }),
  };

  beforeEach(async () => {
    lookupFindExecMock.mockReset();
    lookupFindExecMock.mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditPayloadPresenter,
        AuditLookupResolver,
        AuditStatusResolver,
        AuditValueTransformer,
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

    presenter = module.get(AuditPayloadPresenter);
  });

  it('presents list rows with full FK enrichment and human-readable enums', async () => {
    lookupFindExecMock.mockResolvedValueOnce([
      { category_id: 2, category_name: 'Adhesive' },
    ]);

    const [row] = await presenter.presentMany([
      {
        action: AUDIT_ACTION.PAYMENT_UPDATED,
        outcome: 'success',
        module: 'payment',
        description: 'Payment record updated',
        old_values: { paymentType: 'registration', category_id: 1 },
        new_values: {
          paymentType: 'certification',
          paymentStatus: 2,
          category_id: 2,
          isActive: true,
        },
        changes: {
          paymentStatus: { before: 1, after: 2 },
        },
        metadata: {
          duration_ms: 40,
          body_fields: ['paymentStatus'],
          audit_event_id: 'event-1',
        },
      },
    ]);

    expect(row.new_values).toEqual({
      paymentType: 'Certification',
      paymentStatus: 'Payment Approve',
      category_id: 'Adhesive',
      isActive: 'Yes',
    });
    expect(row.metadata).toEqual({ audit_event_id: 'event-1' });
  });

  it('keeps category ids raw on detail (product-only lookup scope)', async () => {
    lookupFindExecMock.mockResolvedValueOnce([
      { productId: 101, productName: 'Eco Paint' },
    ]);

    const row = await presenter.presentOne(
      {
        action: AUDIT_ACTION.PAYMENT_UPDATED,
        outcome: 'success',
        description: 'Payment record updated',
        new_values: {
          category_id: 2,
          paymentType: 'certification',
          productsToBeCertified: [101],
        },
      },
      { lookupScope: 'product' },
    );

    expect(row?.new_values).toEqual({
      category_id: 2,
      paymentType: 'Certification',
      productsToBeCertified: 'Eco Paint',
    });
  });

  it('applies renewal allowlist once then produces a clean DTO', async () => {
    const presented = await presenter.presentOne({
      _id: '507f1f77bcf86cd799439011',
      action: AUDIT_ACTION.PAYMENT_UPDATED,
      outcome: 'success',
      module: 'payment',
      action_type: 'approve',
      description: 'Renewal payment approved',
      performed_by: { name: 'Admin' },
      occurred_at: new Date('2026-07-15T10:00:00.000Z'),
      new_values: {
        urnNo: 'URN-1',
        paymentType: 'renew',
        paymentStatus: 2,
        urnStatus: 14,
        renewalCycleId: 'cycle-1',
        paymentId: 9,
      },
      metadata: {
        business_event_type: 'renewal_payment_decision',
        consolidated: true,
        duration_ms: 12,
        audit_event_id: 'renewal-payment:approve:x',
      },
      route: '/payments/URN-1',
      http_method: 'PATCH',
      status_code: 200,
    });

    const dto = toAuditLogResponseDto(
      presented as unknown as Record<string, unknown>,
    );

    expect(dto.new_values).toEqual({
      urnNo: 'URN-1',
      paymentType: 'Renewal',
      paymentStatus: 'Payment Approve',
      urnStatus: 'Renewal Payment Approved',
    });
    expect(Object.keys(dto.new_values ?? {})).toEqual([
      'urnNo',
      'paymentType',
      'paymentStatus',
      'urnStatus',
    ]);
    expect(dto.metadata).toBeNull();
    expect(dto.occurred_at).toBe('2026-07-15T10:00:00.000Z');
    expect(dto).not.toHaveProperty('__v');
  });

  it('filters expired product reactivation to status-transition fields only', async () => {
    const presented = await presenter.presentOne({
      _id: '507f1f77bcf86cd799439022',
      action: AUDIT_ACTION.EXPIRED_REACTIVATE_PRODUCT,
      outcome: 'success',
      module: 'product',
      action_type: 'update',
      description: 'Expired product reactivated to certified',
      route: '/api/admin/products/expired-reactivate/product',
      occurred_at: new Date('2026-07-15T10:00:00.000Z'),
      old_values: {
        fromStatus: 4,
        productStatus: 4,
      },
      new_values: {
        toStatus: 2,
        productStatus: 2,
        urnNo: 'URN-EXP-1',
        eoiNo: 'EOI-9',
        firstNotifyDate: '2027-01-15T00:00:00.000Z',
        updatedAt: '2026-07-15T10:00:00.000Z',
        message: 'Product reactivated',
      },
      metadata: {
        duration_ms: 33,
        body_fields: ['urnNo', 'productId'],
        business_event_type: 'expired_to_certified',
      },
      http_method: 'PATCH',
      status_code: 200,
    });

    expect(presented?.old_values).toEqual({
      fromStatus: 'Expired',
      productStatus: 'Expired',
    });
    expect(presented?.new_values).toEqual({
      urnNo: 'URN-EXP-1',
      eoiNo: 'EOI-9',
      productStatus: 'Certified',
      toStatus: 'Certified',
    });
    expect(Object.keys(presented?.new_values ?? {})).toEqual([
      'urnNo',
      'eoiNo',
      'productStatus',
      'toStatus',
    ]);
    expect(presented?.metadata).toBeUndefined();

    const dto = toAuditLogResponseDto(
      presented as unknown as Record<string, unknown>,
    );
    expect(dto.occurred_at).toBe('2026-07-15T10:00:00.000Z');
    expect(dto.description).toBe('Expired product reactivated to certified');
    expect(dto.new_values).toEqual({
      urnNo: 'URN-EXP-1',
      eoiNo: 'EOI-9',
      productStatus: 'Certified',
      toStatus: 'Certified',
    });
  });

  it('projects supporting document uploads and strips internal process fields', async () => {
    const presented = await presenter.presentOne({
      action: 'HTTP_MUTATION',
      outcome: 'success',
      module: 'process',
      action_type: 'create',
      description: 'Process data created',
      route: '/process-manufacturing',
      occurred_at: new Date('2026-07-15T10:00:00.000Z'),
      old_values: undefined,
      new_values: {
        urnNo: 'URN-MFG-1',
        portableWaterDemand: '120 KL/day',
        totalEnergyConsumption: 5000,
        energyConservationSupportingDocumentsFileName: 'Conservation Pack',
        energyConservationSupportingDocuments: 1,
        energyConsumptionDocuments: 0,
        processManufacturingId: 99,
        processManufacturingStatus: 1,
        vendorId: '507f1f77bcf86cd799439011',
      },
      metadata: {
        duration_ms: 15,
        body_fields: ['urnNo', 'energyConservationSupportingDocumentsFileName'],
        file_uploads: [
          {
            field: 'energyConservationSupportingDocumentsFile',
            original_name: 'boiler.pdf',
            mimetype: 'application/pdf',
            size: 4096,
          },
        ],
        audit_event_id: 'uuid-mfg-1',
      },
    });

    expect(presented?.new_values).toEqual({
      urnNo: 'URN-MFG-1',
      portableWaterDemand: '120 KL/day',
      totalEnergyConsumption: 5000,
      energyConservationSupportingDocumentsFileName: 'Conservation Pack',
      energyConservationSupportingDocuments: 'Yes',
      energyConsumptionDocuments: 'No',
      uploadedDocuments: [
        {
          documentType: 'Energy conservation supporting documents',
          fileName: 'boiler.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 4096,
          status: 'available',
        },
      ],
    });
    expect(presented?.metadata).toBeUndefined();
  });
});
