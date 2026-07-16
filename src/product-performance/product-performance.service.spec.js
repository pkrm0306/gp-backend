"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_performance_service_1 = require("./product-performance.service");
describe('ProductPerformanceService test report rows', function () {
    function buildService() {
        return new product_performance_service_1.ProductPerformanceService({ syncIndexes: jest.fn() }, {}, {}, {}, {}, { getProductPerformanceId: jest.fn(), getProductDocumentId: jest.fn() }, {});
    }
    it('accepts row with only testReportFileName filled', function () {
        var service = buildService();
        var dto = {
            urnNo: 'URN-1',
            testReports: [{ productName: '', testReportFileName: 'report-a.pdf' }],
        };
        var rows = service.parseIncomingTestReportRows(dto);
        expect(rows).toHaveLength(1);
        expect(rows[0].productName).toBe('');
        expect(rows[0].testReportFileName).toBe('report-a.pdf');
    });
    it('accepts row with only productName filled', function () {
        var service = buildService();
        var dto = {
            urnNo: 'URN-1',
            testReports: [{ productName: 'Widget', testReportFileName: '' }],
        };
        var rows = service.parseIncomingTestReportRows(dto);
        expect(rows).toHaveLength(1);
        expect(rows[0].productName).toBe('Widget');
        expect(rows[0].testReportFileName).toBe('');
    });
    it('does not create table rows from upload filenames when testReports is empty', function () {
        var service = buildService();
        var dto = { urnNo: 'URN-1', testReports: [] };
        var rows = service.parseIncomingTestReportRows(dto);
        expect(rows).toHaveLength(0);
    });
    it('accepts vendor alias testReportReference', function () {
        var service = buildService();
        var dto = {
            urnNo: 'URN-1',
            testReports: [
                { productName: 'Panel', testReportReference: 'IEC 2026' },
            ],
        };
        var rows = service.parseIncomingTestReportRows(dto);
        expect(rows).toHaveLength(1);
        expect(rows[0].testReportFileName).toBe('IEC 2026');
    });
    it('dedupes identical normalized pairs', function () {
        var service = buildService();
        var dto = {
            urnNo: 'URN-1',
            testReports: [
                { productName: 'A', testReportFileName: 'R1' },
                { productName: 'a', testReportFileName: 'r1' },
            ],
        };
        var rows = service.parseIncomingTestReportRows(dto);
        expect(rows).toHaveLength(1);
    });
});
describe('ProductPerformanceService', function () {
    it('is defined', function () {
        expect(product_performance_service_1.ProductPerformanceService).toBeDefined();
    });
});
