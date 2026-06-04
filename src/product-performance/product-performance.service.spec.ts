import { Types } from 'mongoose';
import { ProductPerformanceService } from './product-performance.service';
import { CreateProductPerformanceDto } from './dto/create-product-performance.dto';

describe('ProductPerformanceService test report rows', () => {
  function buildService() {
    return new ProductPerformanceService(
      { syncIndexes: jest.fn() } as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      { getProductPerformanceId: jest.fn(), getProductDocumentId: jest.fn() } as any,
      {} as any,
    );
  }

  it('accepts row with only testReportFileName filled', () => {
    const service = buildService();
    const dto: CreateProductPerformanceDto = {
      urnNo: 'URN-1',
      testReports: [{ productName: '', testReportFileName: 'report-a.pdf' }],
    };
    const rows = (service as any).parseIncomingTestReportRows(dto);
    expect(rows).toHaveLength(1);
    expect(rows[0].productName).toBe('');
    expect(rows[0].testReportFileName).toBe('report-a.pdf');
  });

  it('accepts row with only productName filled', () => {
    const service = buildService();
    const dto: CreateProductPerformanceDto = {
      urnNo: 'URN-1',
      testReports: [{ productName: 'Widget', testReportFileName: '' }],
    };
    const rows = (service as any).parseIncomingTestReportRows(dto);
    expect(rows).toHaveLength(1);
    expect(rows[0].productName).toBe('Widget');
    expect(rows[0].testReportFileName).toBe('');
  });

  it('does not create table rows from upload filenames when testReports is empty', () => {
    const service = buildService();
    const dto: CreateProductPerformanceDto = { urnNo: 'URN-1', testReports: [] };
    const rows = (service as any).parseIncomingTestReportRows(dto);
    expect(rows).toHaveLength(0);
  });

  it('accepts vendor alias testReportReference', () => {
    const service = buildService();
    const dto: CreateProductPerformanceDto = {
      urnNo: 'URN-1',
      testReports: [
        { productName: 'Panel', testReportReference: 'IEC 2026' } as any,
      ],
    };
    const rows = (service as any).parseIncomingTestReportRows(dto);
    expect(rows).toHaveLength(1);
    expect(rows[0].testReportFileName).toBe('IEC 2026');
  });

  it('dedupes identical normalized pairs', () => {
    const service = buildService();
    const dto: CreateProductPerformanceDto = {
      urnNo: 'URN-1',
      testReports: [
        { productName: 'A', testReportFileName: 'R1' },
        { productName: 'a', testReportFileName: 'r1' },
      ],
    };
    const rows = (service as any).parseIncomingTestReportRows(dto);
    expect(rows).toHaveLength(1);
  });
});

describe('ProductPerformanceService', () => {
  it('is defined', () => {
    expect(ProductPerformanceService).toBeDefined();
  });
});
