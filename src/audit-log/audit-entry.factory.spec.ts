import { Request } from 'express';
import { AuditEntryFactory, AuditableRequest } from './audit-entry.factory';
import { AUDIT_ACTION } from './audit-actions';
import { AuditRouteMapper } from './audit-route-map';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';

describe('AuditEntryFactory', () => {
  let factory: AuditEntryFactory;

  beforeEach(() => {
    const statusResolver = new AuditStatusResolver();
    const valueTransformer = new AuditValueTransformer(statusResolver);
    const routeMapper = new AuditRouteMapper(valueTransformer);
    factory = new AuditEntryFactory(routeMapper, valueTransformer);
  });

  it('creates backward-compatible audit entries with sanitized snapshots', () => {
    const req = request({
      method: 'POST',
      originalUrl: '/addcategory',
      body: {
        category_name: 'Paint',
        password: 'secret',
        updatedDate: '2026-06-09T00:00:00.000Z',
        quoteTotal: 11800,
        _id: 'db-id',
      },
      user: {
        userId: 'u1',
        name: 'Admin User',
        email: 'admin@example.com',
      },
    });
    const pathNorm = factory.normalizePath(req.originalUrl);
    req.auditCorrelationId = 'request-1';
    req.auditEventId = 'event-1';

    const entry = factory.create({
      req,
      method: req.method,
      resolvedPath: req.originalUrl,
      pathNorm,
      outcome: 'success',
      statusCode: 201,
      startedAt: Date.now(),
    });

    expect(entry.action).toBe(AUDIT_ACTION.HTTP_MUTATION);
    expect(entry.module).toBe('category');
    expect(entry.action_type).toBe('create');
    expect(entry.performed_by).toEqual({
      user_id: 'u1',
      name: 'Admin User',
      email: 'admin@example.com',
    });
    expect(entry.new_values).toEqual({ category_name: 'Paint' });
    expect(entry.metadata).toMatchObject({
      audit_event_id: 'event-1',
      body_fields: ['category_name'],
    });
    expect(entry.request?.correlation_id).toBe('request-1');
  });

  it('supports before and after snapshots with computed changes', () => {
    const req = request({
      method: 'PATCH',
      originalUrl: '/api/admin/products/urn-status',
      body: {
        urnNo: 'URN-1',
        updateStatusType: 'urn_status',
        updateStatusTo: 11,
      },
    });
    req.auditCorrelationId = 'request-2';
    req.auditEventId = 'event-2';
    req.__auditOldValues = { updateStatusTo: 8 };
    req.__auditNewValues = { updateStatusTo: 11 };

    const entry = factory.create({
      req,
      method: req.method,
      resolvedPath: req.originalUrl,
      pathNorm: factory.normalizePath(req.originalUrl),
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.action).toBe(AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED);
    expect(entry.old_values).toEqual({ updateStatusTo: 8 });
    expect(entry.new_values).toEqual({ updateStatusTo: 11 });
    expect(entry.changes).toEqual({
      updateStatusTo: { before: 8, after: 11 },
    });
    expect(entry.resource).toEqual({
      type: 'Product',
      id: 'URN-1',
      urn_no: 'URN-1',
    });
  });

  it('uses successful update response as after snapshot when explicit new values are absent', () => {
    const req = request({
      method: 'PATCH',
      originalUrl: '/payments/URN-1',
      body: { paymentStatus: 1 },
    });
    req.auditCorrelationId = 'request-response-snapshot';
    req.auditEventId = 'event-response-snapshot';
    req.__auditOldValues = {
      paymentStatus: 1,
      paymentType: 'registration',
      updatedDate: '2026-06-08T00:00:00.000Z',
      quoteTotal: 1000,
    };
    req.__auditResponseBody = {
      success: true,
      data: {
        paymentStatus: 2,
        paymentType: 'certification',
        updatedDate: '2026-06-09T00:00:00.000Z',
        quoteTotal: 1200,
      },
    };

    const entry = factory.create({
      req,
      method: req.method,
      resolvedPath: req.originalUrl,
      pathNorm: factory.normalizePath(req.originalUrl),
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.old_values).toEqual({
      paymentStatus: 1,
      paymentType: 'registration',
    });
    expect(entry.new_values).toEqual({
      paymentStatus: 2,
      paymentType: 'certification',
    });
    expect(entry.changes).toEqual({
      paymentStatus: { before: 1, after: 2 },
      paymentType: { before: 'registration', after: 'certification' },
    });
  });

  it('audits uploaded files once in standardized metadata without storing buffers', () => {
    const req = request({
      method: 'PATCH',
      originalUrl: '/payments/URN-1',
      body: { paymentStatus: 1 },
      file: {
        fieldname: 'proposal_file',
        originalname: 'proposal.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('file'),
      } as Express.Multer.File,
    });
    req.auditCorrelationId = 'request-3';
    req.auditEventId = 'event-3';

    const entry = factory.create({
      req,
      method: req.method,
      resolvedPath: req.originalUrl,
      pathNorm: factory.normalizePath(req.originalUrl),
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.action).toBe(AUDIT_ACTION.PAYMENT_UPDATED);
    expect(entry.action_type).toBe('update');
    expect(entry.new_values).toEqual({ paymentStatus: 1 });
    expect(entry.metadata?.file_uploads).toEqual([
      {
        field: 'proposal_file',
        original_name: 'proposal.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      },
    ]);
  });

  it('summarizes the final row of a raw-materials bulk upload as one business event', () => {
    const req = request({
      method: 'POST',
      originalUrl: '/raw-materials-hazardous-products',
      body: {
        urnNo: 'URN-1',
        rowIndex: '2',
        totalRows: '3',
        batchId: 'batch-1',
        productsName: 'Paint',
      },
    });
    req.auditCorrelationId = 'request-bulk';

    const entry = factory.create({
      req,
      method: req.method,
      resolvedPath: req.originalUrl,
      pathNorm: factory.normalizePath(req.originalUrl),
      outcome: 'success',
      statusCode: 201,
      startedAt: Date.now(),
    });

    expect(entry.module).toBe('raw_materials');
    expect(entry.action_type).toBe('update');
    expect(entry.description).toBe(
      'Raw materials hazardous products bulk upload completed',
    );
    expect(entry.entity_name).toBe('URN-1');
    expect(entry.new_values).toEqual({
      urnNo: 'URN-1',
      operation: 'bulk_upload',
      completedRows: 3,
      totalRows: 3,
    });
    expect(entry.resource).toEqual({
      type: 'RawMaterialsHazardousProducts',
      id: 'URN-1',
      urn_no: 'URN-1',
    });
    expect(entry.metadata).toMatchObject({
      business_event_type: 'raw_materials_hazardous_products_bulk_upload',
      consolidated: true,
      row_index: 2,
      total_rows: 3,
      audit_event_id: expect.stringMatching(
        /^raw-materials-hazardous-products:bulk:/,
      ),
    });
  });

  it('creates a consolidated proposal rejection audit summary', () => {
    const req = request({
      method: 'PATCH',
      originalUrl: '/payments/URN-1/vendor-proposal-approval',
      body: {
        paymentType: 'registration',
        vendorProposalApprovalStatus: 2,
        proposalRejectionRemarks: 'Please revise amount',
      },
    });
    req.auditCorrelationId = 'request-proposal';

    const entry = factory.create({
      req,
      method: req.method,
      resolvedPath: req.originalUrl,
      pathNorm: factory.normalizePath(req.originalUrl),
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.module).toBe('proposal');
    expect(entry.action_type).toBe('reject');
    expect(entry.description).toBe('Proposal rejected by vendor');
    expect(entry.new_values).toEqual({
      urnNo: 'urn-1',
      paymentType: 'registration',
      vendorProposalApprovalStatus: 2,
      decision: 'rejected',
      proposalRejectionRemarks: 'Please revise amount',
    });
    expect(entry.old_values).toEqual({
      urnNo: 'urn-1',
      paymentType: 'registration',
      vendorProposalApprovalStatus: 0,
      decision: 'pending',
    });
    expect(entry.metadata).toMatchObject({
      business_event_type: 'vendor_proposal_review',
      consolidated: true,
      related_domain_events: ['payment_update', 'activity_timeline_entry'],
      audit_event_id: expect.stringMatching(/^proposal-review:/),
    });
  });

  it('records product text saves as content events without response status fields', () => {
    const req = request({
      method: 'PUT',
      originalUrl: '/product-registration/507f1f77bcf86cd799439011',
      body: {
        urnNo: 'URN-1',
        eoiNo: 'EOI-1',
        productName: 'Eco Paint',
        productDetails: 'Updated product description',
        productStatus: 2,
        urnStatus: 7,
      },
    });
    req.__auditResponseBody = {
      status: 'success',
      data: {
        productName: 'Eco Paint',
        productDetails: 'Updated product description',
        productStatus: 2,
        urnStatus: 7,
      },
    };

    const entry = factory.create({
      req,
      method: req.method,
      resolvedPath: req.originalUrl,
      pathNorm: factory.normalizePath(req.originalUrl),
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.module).toBe('product');
    expect(entry.action_type).toBe('update');
    expect(entry.description).toBe('Product content saved');
    expect(entry.metadata).toMatchObject({
      business_event_type: 'product_content_save',
      content_event: true,
    });
    expect(entry.new_values).toEqual({
      urnNo: 'URN-1',
      eoiNo: 'EOI-1',
      productName: 'Eco Paint',
      productDetails: 'Updated product description',
    });
    expect(entry.new_values).not.toHaveProperty('productStatus');
    expect(entry.new_values).not.toHaveProperty('urnStatus');
  });

  it('records product uploads separately from text content saves', () => {
    const req = request({
      method: 'PATCH',
      originalUrl: '/api/admin/products/certified/507f1f77bcf86cd799439011',
      body: {
        urnNo: 'URN-1',
        eoiNo: 'EOI-1',
        productName: 'Eco Paint',
        productStatus: 2,
        urnStatus: 7,
      },
      file: {
        fieldname: 'productImage',
        originalname: 'product.png',
        mimetype: 'image/png',
        size: 2048,
        buffer: Buffer.from('image'),
      } as Express.Multer.File,
    });

    const entry = factory.create({
      req,
      method: req.method,
      resolvedPath: req.originalUrl,
      pathNorm: factory.normalizePath(req.originalUrl),
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.description).toBe('Product document uploaded');
    expect(entry.resource).toEqual({
      type: 'ProductDocument',
      id: 'URN-1',
      urn_no: 'URN-1',
    });
    expect(entry.metadata).toMatchObject({
      business_event_type: 'product_document_upload',
      content_event: true,
      file_uploads: [
        {
          field: 'productImage',
          original_name: 'product.png',
          mimetype: 'image/png',
          size: 2048,
        },
      ],
    });
    expect(entry.new_values).toEqual({
      urnNo: 'URN-1',
      eoiNo: 'EOI-1',
      productName: 'Eco Paint',
    });
  });

  it('does not record explicit no-op status changes', () => {
    const req = request({
      method: 'PATCH',
      originalUrl: '/api/admin/products/urn-status',
      body: {
        urnNo: 'URN-1',
        updateStatusType: 'urn_status',
        updateStatusTo: 4,
      },
    });
    req.__auditOldValues = { updateStatusTo: 4 };
    req.__auditNewValues = { updateStatusTo: 4 };

    expect(
      factory.shouldRecordHttpAudit({
        req,
        method: req.method,
        pathNorm: factory.normalizePath(req.originalUrl),
        outcome: 'success',
      }),
    ).toBe(false);
  });

  it('skips non-mutating and excluded routes', () => {
    expect(factory.shouldAudit('GET', '/payments')).toBe(false);
    expect(factory.shouldAudit('POST', '/auth/refresh')).toBe(false);
    expect(
      factory.shouldAudit(
        'POST',
        '/api/cron/certification-expiry/deactivation-mail',
      ),
    ).toBe(false);
    expect(
      factory.shouldAudit(
        'PATCH',
        '/api/admin/products/expired-reactivate/product',
      ),
    ).toBe(false);
    expect(
      factory.shouldAudit(
        'PATCH',
        '/api/admin/products/expired-reactivate/urn',
      ),
    ).toBe(false);
    expect(factory.shouldAudit('POST', '/payments')).toBe(true);
    expect(factory.shouldAudit('DELETE', '/categories/1')).toBe(true);
  });

  it('skips listing, search, export, and audit-log read routes', () => {
    expect(factory.shouldAudit('POST', '/api/admin/products/list')).toBe(false);
    expect(
      factory.shouldAudit('POST', '/api/admin/products/list/filter-options'),
    ).toBe(false);
    expect(factory.shouldAudit('GET', '/admin/audit-log')).toBe(false);
    expect(factory.shouldAudit('GET', '/admin/banner/list')).toBe(false);
    expect(factory.shouldAudit('GET', '/api/sectors/export')).toBe(false);
    expect(factory.shouldAudit('PATCH', '/payments/urn-1')).toBe(true);
  });
});

function request(params: {
  method: string;
  originalUrl: string;
  body?: Record<string, unknown>;
  user?: Record<string, unknown>;
  file?: Express.Multer.File;
}): AuditableRequest {
  return {
    method: params.method,
    originalUrl: params.originalUrl,
    url: params.originalUrl,
    body: params.body,
    headers: {},
    user: params.user,
    file: params.file,
    ip: '127.0.0.1',
    socket: {},
  } as unknown as AuditableRequest & Request;
}
