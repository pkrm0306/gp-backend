import {
  isAllowedSupportingDocumentField,
  isSupportingDocumentAttachmentFlagKey,
  isSupportingDocumentAudit,
  labelSupportingDocumentUploadField,
  projectSupportingDocumentUploads,
  resolveSupportingDocumentAttachmentLabel,
  withSupportingDocumentUploadDisplay,
} from './audit-supporting-documents.util';
import {
  filterAuditResponseFields,
  filterAuditResponseMetadata,
} from './audit-response-suppressed-fields';

describe('audit-supporting-documents.util', () => {
  it('detects manufacturing and sibling process supporting-document routes', () => {
    expect(
      isSupportingDocumentAudit({
        route: '/process-manufacturing',
        module: 'process',
      }),
    ).toBe(true);
    expect(
      isSupportingDocumentAudit({
        route: '/api/renew/process-waste-management',
        module: 'other',
      }),
    ).toBe(true);
    expect(
      isSupportingDocumentAudit({
        route: '/process-innovation',
        module: 'process',
      }),
    ).toBe(true);
    expect(
      isSupportingDocumentAudit({
        route: '/payments',
        module: 'payment',
      }),
    ).toBe(false);
  });

  it('allowlists business fields and rejects internal ids/status keys', () => {
    expect(isAllowedSupportingDocumentField('urnNo')).toBe(true);
    expect(
      isAllowedSupportingDocumentField(
        'energyConservationSupportingDocumentsFileName',
      ),
    ).toBe(true);
    expect(
      isAllowedSupportingDocumentField('energyConservationSupportingDocuments'),
    ).toBe(true);
    expect(isAllowedSupportingDocumentField('uploadedDocuments')).toBe(true);
    expect(isAllowedSupportingDocumentField('portableWaterDemand')).toBe(true);
    expect(isAllowedSupportingDocumentField('processManufacturingId')).toBe(
      false,
    );
    expect(isAllowedSupportingDocumentField('processManufacturingStatus')).toBe(
      false,
    );
    expect(isAllowedSupportingDocumentField('vendorId')).toBe(false);
  });

  it('labels upload fields for manufacturing and sibling modules', () => {
    expect(
      labelSupportingDocumentUploadField(
        'energyConservationSupportingDocumentsFile',
      ),
    ).toBe('Energy conservation supporting documents');
    expect(
      labelSupportingDocumentUploadField('energyConsumptionDocumentsFile'),
    ).toBe('Energy consumption documents');
    expect(labelSupportingDocumentUploadField('wmSupportingDocumentsFile')).toBe(
      'Waste management supporting documents',
    );
  });

  it('projects stored file_uploads into clear uploadedDocuments entries', () => {
    expect(
      projectSupportingDocumentUploads({
        file_uploads: [
          {
            field: 'energyConservationSupportingDocumentsFile',
            original_name: 'conservation.pdf',
            mimetype: 'application/pdf',
            size: 1024,
          },
          {
            field: 'energyConsumptionDocumentsFile',
            original_name: 'consumption.xlsx',
            mimetype:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 2048,
          },
        ],
      }),
    ).toEqual([
      {
        documentType: 'Energy conservation supporting documents',
        fileName: 'conservation.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024,
        status: 'available',
      },
      {
        documentType: 'Energy consumption documents',
        fileName: 'consumption.xlsx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        sizeBytes: 2048,
        status: 'available',
      },
    ]);
  });

  it('resolves attachment flag enums to Yes/No', () => {
    expect(isSupportingDocumentAttachmentFlagKey('wmSupportingDocuments')).toBe(
      true,
    );
    expect(
      isSupportingDocumentAttachmentFlagKey('processManufacturingStatus'),
    ).toBe(false);
    expect(resolveSupportingDocumentAttachmentLabel(1)).toBe('Yes');
    expect(resolveSupportingDocumentAttachmentLabel('0')).toBe('No');
  });
});

describe('Supporting Document audit response policy', () => {
  const manufacturingCtx = {
    action: 'HTTP_MUTATION',
    module: 'process',
    description: 'Process data created',
    route: '/process-manufacturing',
    metadata: {
      duration_ms: 20,
      body_fields: ['urnNo', 'energyConservationSupportingDocumentsFileName'],
      file_uploads: [
        {
          field: 'energyConservationSupportingDocumentsFile',
          original_name: 'doc.pdf',
        },
      ],
      audit_event_id: 'uuid-1',
    },
  };

  it('filters manufacturing snapshots to business fields only', () => {
    expect(isSupportingDocumentAudit(manufacturingCtx)).toBe(true);
    const enriched = withSupportingDocumentUploadDisplay(
      {
        urnNo: 'URN-1',
        portableWaterDemand: '100 KL',
        energyConservationSupportingDocumentsFileName: 'Conservation Pack',
        energyConservationSupportingDocuments: 'Yes',
        processManufacturingId: 55,
        processManufacturingStatus: 'Completed',
        vendorId: 'v-1',
      },
      manufacturingCtx.metadata,
    );

    expect(
      filterAuditResponseFields(enriched, manufacturingCtx),
    ).toEqual({
      urnNo: 'URN-1',
      portableWaterDemand: '100 KL',
      energyConservationSupportingDocumentsFileName: 'Conservation Pack',
      energyConservationSupportingDocuments: 'Yes',
      uploadedDocuments: [
        {
          documentType: 'Energy conservation supporting documents',
          fileName: 'doc.pdf',
          status: 'available',
        },
      ],
    });
  });

  it('strips raw file_uploads from metadata while keeping storage intact upstream', () => {
    expect(filterAuditResponseMetadata(manufacturingCtx.metadata, manufacturingCtx)).toBeUndefined();
  });
});
