import {
  filterAuditResponseChanges,
  filterAuditResponseFields,
  filterAuditResponseMetadata,
  isAuditResponseSuppressedFieldKey,
  isExpiredProductReactivateAudit,
  isRenewalPaymentDecisionAudit,
  omitSuppressedAuditResponseChanges,
  omitSuppressedAuditResponseFields,
} from './audit-response-suppressed-fields';
import { toAuditLogResponseDto } from './dto/audit-log-response.dto';
import { AUDIT_ACTION } from './audit-actions';

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

  it('does not flag business status keys', () => {
    expect(isAuditResponseSuppressedFieldKey('urnStatus')).toBe(false);
    expect(isAuditResponseSuppressedFieldKey('productStatus')).toBe(false);
    expect(isAuditResponseSuppressedFieldKey('paymentStatus')).toBe(false);
    expect(isAuditResponseSuppressedFieldKey('status')).toBe(false);
  });

  it('flags API envelope response fields for all modules', () => {
    expect(isAuditResponseSuppressedFieldKey('success')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('message')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('meta')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('statusCode')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('httpStatus')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('isSuccess')).toBe(true);
  });

  it('omits API envelope fields from unmatched module snapshots', () => {
    expect(
      filterAuditResponseFields({
        category_name: 'Paints',
        status: 1,
        success: true,
        message: 'Category updated',
        meta: { requestId: 'r1' },
      }),
    ).toEqual({
      category_name: 'Paints',
      status: 1,
    });
  });

  it('flags internal id / system keys on the denylist', () => {
    expect(isAuditResponseSuppressedFieldKey('renewalCycleId')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('paymentId')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('vendorId')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('audit_event_id')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('body_fields')).toBe(true);
  });

  it('flags internal renewal workflow fields on the denylist', () => {
    expect(isAuditResponseSuppressedFieldKey('renewalType')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('renewal_type')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('productPerformanceStatus')).toBe(
      true,
    );
    expect(isAuditResponseSuppressedFieldKey('existingDocumentIds')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('existing_document_ids')).toBe(
      true,
    );
  });

  it('hides renewalType from responses without a domain policy match', () => {
    expect(
      filterAuditResponseFields({
        urnNo: 'URN-1',
        renewalType: 2,
        productPerformanceStatus: 1,
        existingDocumentIds: [9],
        portableWaterDemand: '100 KL',
      }),
    ).toEqual({
      urnNo: 'URN-1',
      portableWaterDemand: '100 KL',
    });
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

describe('Renewal Payment Approval response field policy', () => {
  const renewalCtx = {
    action: 'PAYMENT_UPDATED',
    module: 'payment',
    description: 'Renewal payment approved',
    metadata: {
      business_event_type: 'renewal_payment_decision',
      consolidated: true,
      audit_event_id: 'renewal-payment:approve:abc',
      audit_source: 'payments_patch',
      related_domain_events: ['payment_update'],
      duration_ms: 42,
      body_fields: ['paymentStatus', 'renewalCycleId'],
      renewal_payment_decision: 'approve',
    },
  };

  it('detects renewal payment decision audits', () => {
    expect(isRenewalPaymentDecisionAudit(renewalCtx)).toBe(true);
    expect(
      isRenewalPaymentDecisionAudit({
        description: 'Renewal payment rejected',
      }),
    ).toBe(true);
    expect(
      isRenewalPaymentDecisionAudit({
        action: 'PAYMENT_UPDATED',
        description: 'Payment record updated',
      }),
    ).toBe(false);
  });

  it('keeps only business-facing renewal approval values', () => {
    const filtered = filterAuditResponseFields(
      {
        urnNo: 'URN-RENEW-1',
        paymentType: 'Renewal',
        paymentStatus: 'Payment Approve',
        urnStatus: 'Renewal Payment Approved',
        renewalCycleId: '6a1edd713ec5008b997aca94',
        paymentId: 991,
        vendorId: 'v-1',
        manufacturerId: 'm-1',
        updatedDate: '2026-07-15T00:00:00.000Z',
        quoteTotal: 12000,
        sessionId: 'sess',
      },
      renewalCtx,
    );
    expect(filtered).toEqual({
      urnNo: 'URN-RENEW-1',
      paymentType: 'Renewal',
      paymentStatus: 'Payment Approve',
      urnStatus: 'Renewal Payment Approved',
    });
    expect(Object.keys(filtered ?? {})).toEqual([
      'urnNo',
      'paymentType',
      'paymentStatus',
      'urnStatus',
    ]);
  });

  it('keeps rejection remarks for renew payment reject', () => {
    const rejectCtx = {
      ...renewalCtx,
      description: 'Renewal payment rejected',
      metadata: {
        ...renewalCtx.metadata,
        renewal_payment_decision: 'reject',
      },
    };

    expect(
      filterAuditResponseFields(
        {
          urnNo: 'URN-1',
          paymentType: 'Renewal',
          paymentStatus: 'Payment Rejected',
          paymentRejectionRemarks: 'Incomplete proof',
          renewalCycleId: 'cycle-1',
        },
        rejectCtx,
      ),
    ).toEqual({
      urnNo: 'URN-1',
      paymentType: 'Renewal',
      paymentStatus: 'Payment Rejected',
      paymentRejectionRemarks: 'Incomplete proof',
    });
  });

  it('filters renewal approval changes to business keys only', () => {
    expect(
      filterAuditResponseChanges(
        {
          paymentStatus: { before: 'Paid', after: 'Payment Approve' },
          renewalCycleId: { before: null, after: 'cycle-1' },
          vendorId: { before: 'a', after: 'b' },
        },
        renewalCtx,
      ),
    ).toEqual({
      paymentStatus: { before: 'Paid', after: 'Payment Approve' },
    });
  });

  it('strips internal renewal metadata from API responses', () => {
    expect(filterAuditResponseMetadata(renewalCtx.metadata, renewalCtx)).toBeUndefined();
  });

  it('keeps only error_message in renewal metadata when present', () => {
    expect(
      filterAuditResponseMetadata(
        {
          ...renewalCtx.metadata,
          error_message: 'Cannot approve payment',
        },
        renewalCtx,
      ),
    ).toEqual({
      error_message: 'Cannot approve payment',
    });
  });

  it('strips framework metadata keys from non-renewal audits', () => {
    const meta = {
      duration_ms: 12,
      body_fields: ['paymentStatus'],
      audit_event_id: 'uuid-1',
      business_event_type: 'generic_payment_update',
      file_uploads: [{ originalname: 'a.pdf' }],
    };
    expect(
      filterAuditResponseMetadata(meta, {
        action: 'PAYMENT_UPDATED',
        description: 'Payment record updated',
        metadata: meta,
      }),
    ).toEqual({
      audit_event_id: 'uuid-1',
      business_event_type: 'generic_payment_update',
    });
  });

  it('shapes renewal approval detail DTO without internal fields', () => {
    const dto = toAuditLogResponseDto({
      _id: '507f1f77bcf86cd799439011',
      occurred_at: new Date('2026-07-15T10:00:00.000Z'),
      action: 'PAYMENT_UPDATED',
      outcome: 'success',
      module: 'payment',
      action_type: 'approve',
      description: 'Renewal payment approved',
      performed_by: { name: 'Admin User' },
      // Presenter already filtered — DTO must not reintroduce stripped keys
      old_values: {
        paymentStatus: 'Paid',
      },
      new_values: {
        urnNo: 'URN-RENEW-1',
        paymentType: 'Renewal',
        paymentStatus: 'Payment Approve',
        urnStatus: 'Renewal Payment Approved',
      },
      changes: {
        paymentStatus: { before: 'Paid', after: 'Payment Approve' },
      },
      metadata: null,
      route: '/payments/URN-RENEW-1',
      http_method: 'PATCH',
      status_code: 200,
      __v: 0,
      unwanted_framework_field: true,
    });

    expect(dto).toEqual({
      id: '507f1f77bcf86cd799439011',
      occurred_at: '2026-07-15T10:00:00.000Z',
      action: 'PAYMENT_UPDATED',
      outcome: 'success',
      module: 'payment',
      module_display: 'Payment',
      action_type: 'approve',
      action_display: 'approve',
      entity_name: null,
      description: 'Renewal payment approved',
      performed_by: { name: 'Admin User' },
      old_values: { paymentStatus: 'Paid' },
      new_values: {
        urnNo: 'URN-RENEW-1',
        paymentType: 'Renewal',
        paymentStatus: 'Payment Approve',
        urnStatus: 'Renewal Payment Approved',
      },
      http_method: 'PATCH',
      route: '/payments/URN-RENEW-1',
      status_code: 200,
      actor: null,
      resource: null,
      request: null,
      changes: {
        paymentStatus: { before: 'Paid', after: 'Payment Approve' },
      },
      metadata: null,
      user_display: 'Admin User',
    });
    expect(dto).not.toHaveProperty('__v');
    expect(dto).not.toHaveProperty('unwanted_framework_field');
  });
});

describe('Expired Product audit response field policy', () => {
  const expiredCtx = {
    action: AUDIT_ACTION.EXPIRED_REACTIVATE_PRODUCT,
    module: 'product',
    description: 'Expired product reactivated to certified',
    route: '/api/admin/products/expired-reactivate/product',
    metadata: {
      duration_ms: 50,
      body_fields: ['urnNo', 'productId'],
      audit_event_id: 'uuid-expired',
    },
  };

  it('detects expired product reactivate audits by action, route, and description', () => {
    expect(isExpiredProductReactivateAudit(expiredCtx)).toBe(true);
    expect(
      isExpiredProductReactivateAudit({
        action: AUDIT_ACTION.EXPIRED_REACTIVATE_URN,
      }),
    ).toBe(true);
    expect(
      isExpiredProductReactivateAudit({
        action: 'HTTP_MUTATION',
        route: '/api/admin/products/expired-reactivate/urn',
      }),
    ).toBe(true);
    expect(
      isExpiredProductReactivateAudit({
        description: 'Expired product reactivated to certified',
      }),
    ).toBe(true);
    expect(
      isExpiredProductReactivateAudit({
        action: 'PAYMENT_UPDATED',
        description: 'Payment record updated',
      }),
    ).toBe(false);
  });

  it('keeps only business-facing expired product status-transition fields', () => {
    expect(
      filterAuditResponseFields(
        {
          urnNo: 'URN-EXP-1',
          eoiNo: 'EOI-1',
          fromStatus: 'Expired',
          toStatus: 'Certified',
          productStatus: 'Certified',
          validtillDate: '15 Jul 2027',
          productId: '507f1f77bcf86cd799439011',
          firstNotifyDate: '2027-01-01T00:00:00.000Z',
          secondNotifyDate: '2027-03-01T00:00:00.000Z',
          thirdNotifyDate: '2027-06-01T00:00:00.000Z',
          updatedAt: '2026-07-15T10:00:00.000Z',
          message: 'Product reactivated',
          success: true,
          manufacturerId: 'm-1',
        },
        expiredCtx,
      ),
    ).toEqual({
      urnNo: 'URN-EXP-1',
      eoiNo: 'EOI-1',
      fromStatus: 'Expired',
      toStatus: 'Certified',
      productStatus: 'Certified',
      validtillDate: '15 Jul 2027',
    });
  });

  it('filters expired product changes to status transition fields only', () => {
    expect(
      filterAuditResponseChanges(
        {
          fromStatus: { before: null, after: 'Expired' },
          productStatus: { before: 'Expired', after: 'Certified' },
          toStatus: { before: null, after: 'Certified' },
          firstNotifyDate: {
            before: null,
            after: '2027-01-01T00:00:00.000Z',
          },
        },
        expiredCtx,
      ),
    ).toEqual({
      fromStatus: { before: null, after: 'Expired' },
      productStatus: { before: 'Expired', after: 'Certified' },
      toStatus: { before: null, after: 'Certified' },
    });
  });

  it('strips framework metadata for expired product audits', () => {
    expect(
      filterAuditResponseMetadata(expiredCtx.metadata, expiredCtx),
    ).toBeUndefined();
  });
});
