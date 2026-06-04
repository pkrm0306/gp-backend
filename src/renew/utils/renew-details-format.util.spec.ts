import {
  buildPerformanceSection,
  dedupeRenewDocuments,
  mergeRenewDocumentSources,
  resolveRenewPerformanceTestReportRows,
  spreadProductPerformanceToDetailRows,
} from './renew-details-format.util';

describe('renew-details-format.util documents', () => {
  it('mergeRenewDocumentSources dedupes by productDocumentId', () => {
    const merged = mergeRenewDocumentSources(
      [{ productDocumentId: 1, documentName: 'a.pdf', urnNo: 'URN-1' }],
      [{ productDocumentId: 1, documentName: 'a.pdf', urnNo: 'URN-1' }],
      [{ productDocumentId: 2, documentName: 'b.pdf', urnNo: 'URN-1' }],
    );
    expect(merged).toHaveLength(2);
    expect(dedupeRenewDocuments([{ productDocumentId: 3, urnNo: 'U' }])).toHaveLength(1);
  });
});

describe('renew-details-format.util performance read', () => {
  it('falls back to embedded header.testReports when child rows are empty', () => {
    const header = {
      _id: 'hdr1',
      urnNo: 'URN-1',
      renewalCycleId: 'cycle1',
      processRenewProductPerformanceId: 3,
      renewalType: 1,
      productPerformanceStatus: 0,
      testReports: [
        {
          _id: 'emb1',
          productName: 'skjsdkjssd',
          testReportFileName: '',
          eoiNo: 'GPPMI003026',
        },
      ],
    };

    const resolved = resolveRenewPerformanceTestReportRows(header, []);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].productName).toBe('skjsdkjssd');
    expect(resolved[0].eoiNo).toBe('GPPMI003026');

    const section = buildPerformanceSection(header, [], [], 'cycle1');
    expect(section.product_performance).not.toBeNull();
    expect(
      (section.product_performance as { testReports: unknown[] }).testReports,
    ).toHaveLength(1);
    expect(section.product_performance_test_reports).toHaveLength(1);
  });

  it('spreadProductPerformanceToDetailRows filters testReports by EOI', () => {
    const performance = {
      urnNo: 'URN-1',
      renewalType: 1,
      productPerformanceStatus: 0,
      testReportFiles: 2,
      testReports: [
        { productName: 'A', testReportFileName: '', eoiNo: 'EOI-A' },
        { productName: 'B', testReportFileName: '', eoiNo: 'EOI-B' },
      ],
    };
    const rows: Array<Record<string, unknown>> = [
      { product_details: { eoiNo: 'EOI-A', productName: 'Prod A' } },
      { product_details: { eoiNo: 'EOI-B', productName: 'Prod B' } },
    ];
    spreadProductPerformanceToDetailRows(rows, performance);
    const row0Perf = rows[0].product_performance as {
      testReports: Array<{ eoiNo: string }>;
    };
    expect(row0Perf.testReports).toHaveLength(1);
    expect(row0Perf.testReports[0].eoiNo).toBe('EOI-A');
  });
});
