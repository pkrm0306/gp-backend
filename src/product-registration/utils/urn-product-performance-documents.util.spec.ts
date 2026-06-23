import {
  collectUrnScopedProductPerformanceDocuments,
  collectUrnScopedProductPerformanceDocumentsFromSources,
  isUrnProductPerformanceDocument,
  mergeRenewProductPerformanceDocumentsOntoDetailRows,
} from './urn-product-performance-documents.util';

describe('urn-product-performance-documents.util', () => {
  it('accepts performance test report docs', () => {
    expect(
      isUrnProductPerformanceDocument({
        documentForm: 'product_performance',
        documentFormSubsection: 'test_report_files',
      }),
    ).toBe(true);
  });

  it('merges product_performance_documents with all_urn_product_documents', () => {
    const docs = collectUrnScopedProductPerformanceDocuments({
      product_performance_documents: [
        { productDocumentId: 1, documentForm: 'product_performance', documentFormSubsection: 'test_report_files' },
      ],
      all_urn_product_documents: [
        { productDocumentId: 2, documentForm: 'product_performance', documentFormSubsection: 'test_report_files' },
        { productDocumentId: 3, documentForm: 'process_manufacturing', documentFormSubsection: 'energy_consumption_documents' },
      ],
    });
    expect(docs.map((doc) => doc.productDocumentId)).toEqual([1, 2]);
  });

  it('merges renew payload documents onto primary detail row', () => {
    const rows = mergeRenewProductPerformanceDocumentsOntoDetailRows(
      [
        {
          product_performance_documents: [
            {
              productDocumentId: 1,
              documentForm: 'product_performance',
              documentFormSubsection: 'test_report_files',
            },
          ],
        },
      ],
      {
        product_performance_documents: [
          {
            productDocumentId: 2,
            documentForm: 'product_performance',
            documentFormSubsection: 'test_report_files',
          },
          {
            productDocumentId: 3,
            documentForm: 'product_performance',
            documentFormSubsection: 'test_report_files',
          },
        ],
      },
    );
    expect(rows[0]?.product_performance_documents).toHaveLength(3);
  });
});
