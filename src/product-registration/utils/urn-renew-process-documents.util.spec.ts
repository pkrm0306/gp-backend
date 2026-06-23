import {
  collectUrnScopedManufacturingProcessDocuments,
  finalizeUrnProcessDocumentFieldsOnDetailRows,
  isUrnInnovationProcessDocument,
  isUrnManufacturingProcessDocument,
  isUrnWasteManagementProcessDocument,
  mergeAllRenewProcessDocumentsOntoDetailRows,
} from './urn-renew-process-documents.util';

describe('urn-renew-process-documents.util', () => {
  it('accepts manufacturing process docs by subsection', () => {
    expect(
      isUrnManufacturingProcessDocument({
        documentForm: 'process_manufacturing',
        documentFormSubsection: 'energy_consumption_documents',
      }),
    ).toBe(true);
  });

  it('accepts waste management supporting docs', () => {
    expect(
      isUrnWasteManagementProcessDocument({
        documentForm: 'process_waste_management',
        documentFormSubsection: 'wm_supporting_documents',
      }),
    ).toBe(true);
  });

  it('accepts innovation implementation docs', () => {
    expect(
      isUrnInnovationProcessDocument({
        documentForm: 'process_innovation',
        documentFormSubsection: 'innovation_implementation_documents',
      }),
    ).toBe(true);
  });

  it('collects manufacturing docs from all_renew_product_documents', () => {
    const docs = collectUrnScopedManufacturingProcessDocuments({
      process_manufacturing_documents: [
        {
          productDocumentId: 1,
          documentForm: 'process_manufacturing',
          documentFormSubsection: 'energy_consumption_documents',
        },
      ],
      all_renew_product_documents: [
        {
          productDocumentId: 2,
          documentForm: 'process_manufacturing',
          documentFormSubsection: 'energy_conservation_supporting_documents',
        },
        {
          productDocumentId: 3,
          documentForm: 'product_performance',
          documentFormSubsection: 'test_report_files',
        },
      ],
    });
    expect(docs.map((doc) => doc.productDocumentId)).toEqual([1, 2]);
  });

  it('merges renew process documents onto primary detail row', () => {
    const rows = mergeAllRenewProcessDocumentsOntoDetailRows(
      [
        {
          process_manufacturing_documents: [
            {
              productDocumentId: 1,
              documentForm: 'process_manufacturing',
              documentFormSubsection: 'energy_consumption_documents',
            },
          ],
          process_waste_management_documents: [],
          process_innovation_documents: [],
        },
      ],
      {
        process_manufacturing_documents: [
          {
            productDocumentId: 2,
            documentForm: 'process_manufacturing',
            documentFormSubsection: 'energy_conservation_supporting_documents',
          },
        ],
        process_waste_management_documents: [
          {
            productDocumentId: 3,
            documentForm: 'process_waste_management',
            documentFormSubsection: 'wm_supporting_documents',
          },
        ],
        process_innovation_documents: [
          {
            productDocumentId: 4,
            documentForm: 'process_innovation',
            documentFormSubsection: 'innovation_implementation_documents',
          },
        ],
      },
    );

    expect(rows[0]?.process_manufacturing_documents).toHaveLength(2);
    expect(rows[0]?.process_waste_management_documents).toHaveLength(1);
    expect(rows[0]?.process_innovation_documents).toHaveLength(1);
  });

  it('finalize unions cert and renew buckets onto section arrays', () => {
    const rows = finalizeUrnProcessDocumentFieldsOnDetailRows(
      [
        {
          process_manufacturing_documents: [
            {
              productDocumentId: 1,
              documentForm: 'process_manufacturing',
              documentFormSubsection: 'energy_consumption_documents',
            },
          ],
        },
      ],
      [
        {
          all_renew_product_documents: [
            {
              productDocumentId: 2,
              documentForm: 'process_manufacturing',
              documentFormSubsection: 'energy_conservation_supporting_documents',
            },
            {
              productDocumentId: 3,
              documentForm: 'process_manufacturing',
              documentFormSubsection: 'energy_conservation_supporting_documents',
            },
          ],
        },
      ],
    );

    expect(rows[0]?.process_manufacturing_documents).toHaveLength(3);
  });
});
