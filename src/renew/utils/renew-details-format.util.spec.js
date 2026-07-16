"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renew_details_format_util_1 = require("./renew-details-format.util");
describe('renew-details-format.util documents', function () {
    it('mergeRenewDocumentSources dedupes by productDocumentId', function () {
        var merged = (0, renew_details_format_util_1.mergeRenewDocumentSources)([{ productDocumentId: 1, documentName: 'a.pdf', urnNo: 'URN-1' }], [{ productDocumentId: 1, documentName: 'a.pdf', urnNo: 'URN-1' }], [{ productDocumentId: 2, documentName: 'b.pdf', urnNo: 'URN-1' }]);
        expect(merged).toHaveLength(2);
        expect((0, renew_details_format_util_1.dedupeRenewDocuments)([{ productDocumentId: 3, urnNo: 'U' }])).toHaveLength(1);
    });
});
describe('renew-details-format.util performance read', function () {
    it('falls back to embedded header.testReports when child rows are empty', function () {
        var header = {
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
        var resolved = (0, renew_details_format_util_1.resolveRenewPerformanceTestReportRows)(header, []);
        expect(resolved).toHaveLength(1);
        expect(resolved[0].productName).toBe('skjsdkjssd');
        expect(resolved[0].eoiNo).toBe('GPPMI003026');
        var section = (0, renew_details_format_util_1.buildPerformanceSection)(header, [], [], 'cycle1');
        expect(section.product_performance).not.toBeNull();
        expect(section.product_performance.testReports).toHaveLength(1);
        expect(section.product_performance_test_reports).toHaveLength(1);
    });
    it('spreadProductPerformanceToDetailRows filters testReports by EOI', function () {
        var performance = {
            urnNo: 'URN-1',
            renewalType: 1,
            productPerformanceStatus: 0,
            testReportFiles: 2,
            testReports: [
                { productName: 'A', testReportFileName: '', eoiNo: 'EOI-A' },
                { productName: 'B', testReportFileName: '', eoiNo: 'EOI-B' },
            ],
        };
        var rows = [
            { product_details: { eoiNo: 'EOI-A', productName: 'Prod A' } },
            { product_details: { eoiNo: 'EOI-B', productName: 'Prod B' } },
        ];
        (0, renew_details_format_util_1.spreadProductPerformanceToDetailRows)(rows, performance);
        var row0Perf = rows[0].product_performance;
        expect(row0Perf.testReports).toHaveLength(1);
        expect(row0Perf.testReports[0].eoiNo).toBe('EOI-A');
    });
});
