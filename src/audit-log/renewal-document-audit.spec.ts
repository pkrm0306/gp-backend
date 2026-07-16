import {
  AUDIT_MISSING_FILE_LABEL,
  hasAuditFilePayload,
  isRenewalDocumentAudit,
  projectAuditFileUploads,
  projectAuditFilesFromValues,
  scrubAuditFilePlaceholderFields,
  withAuditFileDisplay,
} from './audit-file-presentation.util';
import {
  filterAuditResponseFields,
  filterAuditResponseMetadata,
} from './audit-response-suppressed-fields';
import {
  AuditEntryFactory,
  type AuditableRequest,
} from './audit-entry.factory';
import { AuditRouteMapper } from './audit-route-map';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';
import { AuditPayloadPresenter } from './audit-payload-presenter.service';
import { AuditLookupResolver } from './audit-lookup-resolver.service';

describe('audit-file-presentation.util', () => {
  it('projects multer file_uploads with correct field labels', () => {
    expect(
      projectAuditFileUploads({
        file_uploads: [
          {
            field: 'files',
            original_name: 'performance-report.pdf',
            mimetype: 'application/pdf',
            size: 4096,
          },
          {
            field: 'energyConservationSupportingDocumentsFile',
            original_name: 'conservation.pdf',
            mimetype: 'application/pdf',
            size: 1024,
          },
          {
            field: 'files',
            original_name: '',
            mimetype: 'application/pdf',
          },
        ],
      }),
    ).toEqual([
      {
        documentType: 'Product performance documents',
        fileName: 'performance-report.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 4096,
        status: 'available',
      },
      {
        documentType: 'Energy conservation supporting documents',
        fileName: 'conservation.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024,
        status: 'available',
      },
      {
        documentType: 'Product performance documents',
        fileName: AUDIT_MISSING_FILE_LABEL,
        mimeType: 'application/pdf',
        status: 'missing',
      },
    ]);
  });

  it('projects deleted / missing file rows from value snapshots', () => {
    expect(
      projectAuditFilesFromValues({
        urnNo: 'URN-1',
        sectionKey: 'manufacturing',
        fileName: 'old-brochure.pdf',
        documentStatus: 'deleted',
      }),
    ).toEqual([
      {
        documentType: 'manufacturing',
        fileName: 'old-brochure.pdf',
        status: 'deleted',
      },
    ]);

    expect(
      projectAuditFilesFromValues({
        urnNo: 'URN-1',
        documentStatus: 'deleted',
      }),
    ).toEqual([
      {
        documentType: 'Document',
        fileName: AUDIT_MISSING_FILE_LABEL,
        status: 'deleted',
      },
    ]);
  });

  it('scrubs unrelated renewal file fields and empty placeholders', () => {
    expect(
      scrubAuditFilePlaceholderFields({
        urnNo: 'URN-1',
        existingDocumentIds: [11, 22],
        files: null,
        energyConservationSupportingDocumentsFileName: '',
        portableWaterDemand: '100 KL',
      }),
    ).toEqual({
      urnNo: 'URN-1',
      portableWaterDemand: '100 KL',
    });
  });

  it('merges uploads and test reports into uploadedDocuments', () => {
    expect(
      withAuditFileDisplay(
        {
          urnNo: 'URN-PP-1',
          existingDocumentIds: [9],
          files: null,
          testReports: [
            {
              productName: 'Eco Paint',
              testReportFileName: 'lab-result.pdf',
            },
          ],
        },
        {
          file_uploads: [
            {
              field: 'files',
              original_name: 'new-scan.pdf',
              mimetype: 'application/pdf',
              size: 512,
            },
          ],
        },
      ),
    ).toEqual({
      urnNo: 'URN-PP-1',
      uploadedDocuments: [
        {
          documentType: 'Product performance documents',
          fileName: 'new-scan.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 512,
          status: 'available',
        },
        {
          documentType: 'Test reports',
          fileName: 'lab-result.pdf',
          status: 'available',
        },
      ],
    });
  });

  it('detects renewal document audits', () => {
    expect(
      isRenewalDocumentAudit({
        route: '/renew/process-product-performance',
      }),
    ).toBe(true);
    expect(
      isRenewalDocumentAudit({
        route: '/api/renew/documents/42',
        description: 'Renewal document deleted',
      }),
    ).toBe(true);
    expect(
      isRenewalDocumentAudit({
        route: '/renew/process-manufacturing',
      }),
    ).toBe(false);
  });

  it('detects audit file payloads for projection gates', () => {
    expect(
      hasAuditFilePayload(
        undefined,
        { file_uploads: [{ original_name: 'a.pdf' }] },
      ),
    ).toBe(true);
    expect(hasAuditFilePayload({ urnNo: 'URN-1' }, {})).toBe(false);
  });
});

describe('Renewal document audit — write + present', () => {
  const factory = (() => {
    const statusResolver = new AuditStatusResolver();
    const valueTransformer = new AuditValueTransformer(statusResolver);
    return new AuditEntryFactory(
      new AuditRouteMapper(valueTransformer),
      valueTransformer,
    );
  })();

  function request(params: {
    method: string;
    originalUrl: string;
    body?: Record<string, unknown>;
    query?: Record<string, unknown>;
    files?: Express.Multer.File[];
    response?: unknown;
  }): AuditableRequest {
    const req = {
      method: params.method,
      originalUrl: params.originalUrl,
      url: params.originalUrl,
      body: params.body ?? {},
      query: params.query ?? {},
      headers: {},
      socket: {},
      files: params.files,
    } as AuditableRequest;
    if (params.response !== undefined) {
      req.__auditResponseBody = params.response;
    }
    return req;
  }

  it('writes renewal product-performance upload with file_uploads metadata', () => {
    const req = request({
      method: 'POST',
      originalUrl: '/renew/process-product-performance',
      body: {
        urnNo: 'URN-PP-1',
        renewalCycleId: 'cycle-1',
        existingDocumentIds: '[1,2]',
      },
      files: [
        {
          fieldname: 'files',
          originalname: 'performance.pdf',
          mimetype: 'application/pdf',
          size: 2048,
        } as Express.Multer.File,
      ],
      response: {
        success: true,
        data: {
          urnNo: 'URN-PP-1',
          renewalCycleId: 'cycle-1',
          testReports: [
            { productName: 'Tile', testReportFileName: 'tile-lab.pdf' },
          ],
        },
      },
    });

    const entry = factory.create({
      req,
      method: 'POST',
      resolvedPath: '/renew/process-product-performance',
      pathNorm: factory.normalizePath('/renew/process-product-performance'),
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.description).toBe('Renewal product performance saved');
    expect(entry.metadata).toMatchObject({
      business_event_type: 'renewal_document',
      renewal_document_event: 'upload',
    });
    expect(entry.metadata?.file_uploads).toEqual([
      expect.objectContaining({
        field: 'files',
        original_name: 'performance.pdf',
      }),
    ]);
    expect(entry.new_values).toMatchObject({
      urnNo: 'URN-PP-1',
    });
    expect(entry.new_values).not.toHaveProperty('existingDocumentIds');
  });

  it('writes renewal document delete with file name when available', () => {
    const req = request({
      method: 'DELETE',
      originalUrl: '/renew/documents/55',
      query: {
        urnNo: 'URN-DEL-1',
        sectionKey: 'waste-management',
        renewalCycleId: 'cycle-1',
      },
      response: {
        success: true,
        data: {
          documentId: 55,
          urnNo: 'URN-DEL-1',
          sectionKey: 'waste-management',
          fileName: 'wm-proof.pdf',
          documentTag: 'wm-docs',
          documentStatus: 'deleted',
        },
      },
    });

    const entry = factory.create({
      req,
      method: 'DELETE',
      resolvedPath: '/renew/documents/55',
      pathNorm: factory.normalizePath('/renew/documents/55'),
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.description).toBe('Renewal document deleted');
    expect(entry.action_type).toBe('delete');
    expect(entry.new_values).toEqual({
      urnNo: 'URN-DEL-1',
      sectionKey: 'waste-management',
      documentTag: 'wm-docs',
      fileName: 'wm-proof.pdf',
      documentStatus: 'deleted',
    });
  });

  it('writes delete without inventing a file name when metadata is missing', () => {
    const req = request({
      method: 'DELETE',
      originalUrl: '/renew/documents/9',
      query: {
        urnNo: 'URN-DEL-2',
        sectionKey: 'innovation',
        renewalCycleId: 'cycle-2',
      },
      response: {
        success: true,
        data: {
          documentId: 9,
          urnNo: 'URN-DEL-2',
          sectionKey: 'innovation',
          documentStatus: 'deleted',
        },
      },
    });

    const entry = factory.create({
      req,
      method: 'DELETE',
      resolvedPath: '/renew/documents/9',
      pathNorm: '/renew/documents/9',
      outcome: 'success',
      statusCode: 200,
      startedAt: Date.now(),
    });

    expect(entry.new_values).toEqual({
      urnNo: 'URN-DEL-2',
      sectionKey: 'innovation',
      documentStatus: 'deleted',
    });
    expect(entry.new_values).not.toHaveProperty('fileName');
  });
});

describe('Renewal document audit — response presentation', () => {
  const presenter = new AuditPayloadPresenter(
    {
      collectValues: () => new Map(),
      onlyModels: () => new Map(),
      resolveLookupLabels: async () => new Map(),
      resolveLabel: () => undefined,
    } as unknown as AuditLookupResolver,
    new AuditValueTransformer(new AuditStatusResolver()),
  );

  it('presents product-performance upload without File unavailable placeholders', async () => {
    const presented = await presenter.presentOne({
      action: 'HTTP_MUTATION',
      outcome: 'success',
      module: 'process',
      description: 'Renewal product performance saved',
      route: '/renew/process-product-performance',
      new_values: {
        urnNo: 'URN-PP-1',
        existingDocumentIds: [1, 2],
        files: null,
        eoiNo: 'EOI-1',
        renewalType: 1,
        testReports: [
          { productName: 'Paint', testReportFileName: 'paint.pdf' },
        ],
      },
      metadata: {
        business_event_type: 'renewal_document',
        file_uploads: [
          {
            field: 'files',
            original_name: 'upload.pdf',
            mimetype: 'application/pdf',
            size: 100,
          },
        ],
        duration_ms: 12,
      },
    });

    expect(presented?.new_values).toEqual({
      urnNo: 'URN-PP-1',
      uploadedDocuments: [
        {
          documentType: 'Product performance documents',
          fileName: 'upload.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 100,
          status: 'available',
        },
        {
          documentType: 'Test reports',
          fileName: 'paint.pdf',
          status: 'available',
        },
      ],
    });
    expect(presented?.metadata).toBeUndefined();
  });

  it('presents deleted document with available file name', async () => {
    const presented = await presenter.presentOne({
      action: 'HTTP_MUTATION',
      outcome: 'success',
      module: 'document',
      description: 'Renewal document deleted',
      route: '/renew/documents/55',
      new_values: {
        urnNo: 'URN-DEL-1',
        sectionKey: 'waste-management',
        fileName: 'wm-proof.pdf',
        documentStatus: 'deleted',
        renewalCycleId: 'cycle-1',
      },
      metadata: {
        business_event_type: 'renewal_document',
        renewal_document_event: 'delete',
      },
    });

    expect(presented?.new_values).toEqual({
      urnNo: 'URN-DEL-1',
      sectionKey: 'waste-management',
      documentStatus: 'deleted',
      uploadedDocuments: [
        {
          documentType: 'waste-management',
          fileName: 'wm-proof.pdf',
          status: 'deleted',
        },
      ],
    });
  });

  it('presents deleted / missing file gracefully as Unavailable', async () => {
    const presented = await presenter.presentOne({
      action: 'HTTP_MUTATION',
      outcome: 'success',
      description: 'Renewal document deleted',
      route: '/api/renew/documents/9',
      new_values: {
        urnNo: 'URN-DEL-2',
        sectionKey: 'innovation',
        documentStatus: 'deleted',
      },
      metadata: { business_event_type: 'renewal_document' },
    });

    expect(presented?.new_values).toEqual({
      urnNo: 'URN-DEL-2',
      sectionKey: 'innovation',
      documentStatus: 'deleted',
      uploadedDocuments: [
        {
          documentType: 'innovation',
          fileName: AUDIT_MISSING_FILE_LABEL,
          status: 'deleted',
        },
      ],
    });
  });

  it('filters renewal document snapshots through response policy', () => {
    const ctx = {
      description: 'Renewal product performance saved',
      route: '/renew/process-product-performance',
      metadata: { business_event_type: 'renewal_document' },
    };
    expect(
      filterAuditResponseFields(
        {
          urnNo: 'URN-1',
          uploadedDocuments: [
            { documentType: 'Document', fileName: 'a.pdf', status: 'available' },
          ],
          existingDocumentIds: [1],
          eoiNo: 'EOI',
          renewalType: 2,
          productPerformanceStatus: 1,
        },
        ctx,
      ),
    ).toEqual({
      urnNo: 'URN-1',
      uploadedDocuments: [
        { documentType: 'Document', fileName: 'a.pdf', status: 'available' },
      ],
    });
    expect(filterAuditResponseMetadata(ctx.metadata, ctx)).toBeUndefined();
  });

  it.each([
    '/renew/process-manufacturing',
    '/api/renew/process-waste-management',
    '/renew/process-life-cycle-approach',
    '/renew/process-product-stewardship',
    '/renew/process-innovation',
    '/renew/process-product-performance',
  ])(
    'hides renewalType and other internal workflow fields for %s',
    (route) => {
      const filtered = filterAuditResponseFields(
        {
          urnNo: 'URN-RENEW-1',
          renewalType: 1,
          productPerformanceStatus: 2,
          existingDocumentIds: [10, 20],
          renewalCycleId: 'cycle-hidden',
          energyConservationSupportingDocumentsFileName: 'Pack',
          uploadedDocuments: [
            {
              documentType: 'Energy conservation supporting documents',
              fileName: 'pack.pdf',
              status: 'available',
            },
          ],
        },
        {
          route,
          module: 'process',
          description: 'Process data created',
          metadata: { body_fields: ['urnNo', 'renewalType'] },
        },
      );

      expect(filtered).not.toHaveProperty('renewalType');
      expect(filtered).not.toHaveProperty('productPerformanceStatus');
      expect(filtered).not.toHaveProperty('existingDocumentIds');
      expect(filtered).not.toHaveProperty('renewalCycleId');
      expect(filtered?.urnNo).toBe('URN-RENEW-1');
      expect(filtered?.uploadedDocuments).toEqual([
        {
          documentType: 'Energy conservation supporting documents',
          fileName: 'pack.pdf',
          status: 'available',
        },
      ]);
    },
  );
});
