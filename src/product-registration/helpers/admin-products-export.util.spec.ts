import * as ExcelJS from 'exceljs';
import {
  ADMIN_PRODUCTS_EXPORT_EOI_HEADERS,
  buildAdminProductsExportCsv,
  buildAdminProductsExportXlsxBuffer,
} from './admin-products-export.util';

describe('admin-products-export.util', () => {
  it('builds CSV with headers only when no rows match filters', () => {
    const csv = buildAdminProductsExportCsv([]);
    const lines = csv.trim().split(/\r?\n/);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe(ADMIN_PRODUCTS_EXPORT_EOI_HEADERS.join(','));
  });

  it('builds XLSX with visible header row when no rows match filters', async () => {
    const buffer = await buildAdminProductsExportXlsxBuffer([]);
    expect(buffer.length).toBeGreaterThan(0);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
    const ws = workbook.getWorksheet('Products Export');
    expect(ws).toBeTruthy();
    expect(ws?.rowCount).toBeGreaterThanOrEqual(1);
    expect(String(ws?.getRow(1).getCell(1).value)).toBe('Manufacturer Name');
    expect(String(ws?.getRow(1).getCell(2).value)).toBe('Email');
    expect(ws?.actualRowCount).toBe(1);
  });
});
