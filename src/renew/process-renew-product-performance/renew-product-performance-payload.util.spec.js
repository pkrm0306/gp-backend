"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renew_product_performance_payload_util_1 = require("./renew-product-performance-payload.util");
describe('renew-product-performance-payload.util', function () {
    it('applies default eoiNo from form when row omits it', function () {
        var rows = (0, renew_product_performance_payload_util_1.parseIncomingRenewTestReports)(JSON.stringify([{ productName: 'Widget', testReportFileName: 'report-a' }]), undefined, 'EOI-1');
        expect(rows).toEqual([
            {
                productName: 'Widget',
                testReportFileName: 'report-a',
                eoiNo: 'EOI-1',
            },
        ]);
    });
    it('parses testReports JSON with eoiNo', function () {
        var rows = (0, renew_product_performance_payload_util_1.parseIncomingRenewTestReports)(JSON.stringify([
            {
                productName: 'Widget',
                testReportFileName: 'report-a',
                eoiNo: 'EOI-1',
            },
        ]));
        expect(rows).toEqual([
            {
                productName: 'Widget',
                testReportFileName: 'report-a',
                eoiNo: 'EOI-1',
            },
        ]);
    });
    it('resolves embedded and legacy single-field rows', function () {
        expect((0, renew_product_performance_payload_util_1.resolveRowTestReports)({
            testReports: [{ productName: 'A', testReportFileName: 'f1' }],
        })).toHaveLength(1);
        expect((0, renew_product_performance_payload_util_1.resolveRowTestReports)({
            productName: 'B',
            testReportFileName: 'f2',
        })).toEqual([{ productName: 'B', testReportFileName: 'f2' }]);
    });
    it('groups reports by eoi using product name fallback', function () {
        var grouped = (0, renew_product_performance_payload_util_1.groupTestReportsByEoi)([{ productName: 'Alpha', testReportFileName: 'r1' }], [{ eoiNo: 'EOI-A', productName: 'Alpha' }]);
        expect(grouped.get('EOI-A')).toEqual([
            { productName: 'Alpha', testReportFileName: 'r1', eoiNo: 'EOI-A' },
        ]);
    });
});
describe('renew testReports full replace', function () {
    it('dedupes and preserves exact client row count', function () {
        var rows = (0, renew_product_performance_payload_util_1.normalizeIncomingRenewTestReportsForReplace)([
            { productName: 'A', testReportFileName: 'r1', eoiNo: 'E1' },
            { productName: 'B', testReportFileName: 'r2', eoiNo: 'E2' },
            { productName: 'C', testReportFileName: 'r3', eoiNo: 'E3' },
            { productName: 'D', testReportFileName: 'r4', eoiNo: 'E4' },
        ]);
        expect(rows).toHaveLength(4);
        var afterDelete = (0, renew_product_performance_payload_util_1.normalizeIncomingRenewTestReportsForReplace)([
            { productName: 'A', testReportFileName: 'r1', eoiNo: 'E1' },
            { productName: 'B', testReportFileName: 'r2', eoiNo: 'E2' },
            { productName: 'D', testReportFileName: 'r4', eoiNo: 'E4' },
        ]);
        expect(afterDelete).toHaveLength(3);
    });
    it('accepts test_reports snake_case via parseIncomingRenewTestReports', function () {
        var rows = (0, renew_product_performance_payload_util_1.parseIncomingRenewTestReports)(JSON.stringify([{ productName: 'X', testReportFileName: 'y' }]));
        expect(rows).toHaveLength(1);
    });
    it('allows partial rows (name-only or file-only)', function () {
        expect((0, renew_product_performance_payload_util_1.normalizeIncomingRenewTestReportsForReplace)([
            { productName: '', testReportFileName: 'report-a' },
            { productName: 'Widget', testReportFileName: '' },
        ])).toHaveLength(2);
    });
});
