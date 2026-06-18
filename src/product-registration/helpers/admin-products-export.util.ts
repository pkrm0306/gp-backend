import * as ExcelJS from 'exceljs';

export const ADMIN_PRODUCTS_EXPORT_EOI_HEADERS = [
  'Manufacturer Name',
  'Email',
  'Phone',
  'URN No',
  'EOI No',
  'Product Name',
  'Category Name',
  'Product Status Label',
  'Created Date',
] as const;

export const ADMIN_PRODUCTS_EXPORT_EOI_KEYS = [
  'manufacturerName',
  'email',
  'phone',
  'urnNo',
  'eoiNo',
  'productName',
  'categoryName',
  'statusLabel',
  'createdDate',
] as const;

const ADMIN_PRODUCTS_EXPORT_EOI_WIDTHS = [30, 28, 18, 28, 24, 32, 24, 20, 24];

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function mapAdminProductsExportEoiRow(row: Record<string, unknown>) {
  return {
    manufacturerName: String(row.manufacturerName ?? ''),
    email: String(row.email ?? row.vendor_email ?? ''),
    phone: String(row.phone ?? row.vendor_phone ?? ''),
    urnNo: String(row.urnNo ?? ''),
    eoiNo: String(row.eoiNo ?? ''),
    productName: String(row.productName ?? ''),
    categoryName: String(row.categoryName ?? ''),
    statusLabel: String(row.statusLabel ?? ''),
    createdDate: row.createdDate ? String(row.createdDate) : '',
  };
}

export function writeAdminProductsEoiWorksheetHeaders(
  ws: ExcelJS.Worksheet,
  manufacturerWidth = 30,
): void {
  const widths = [...ADMIN_PRODUCTS_EXPORT_EOI_WIDTHS];
  widths[0] = manufacturerWidth;

  ws.columns = ADMIN_PRODUCTS_EXPORT_EOI_KEYS.map((key, index) => ({
    header: ADMIN_PRODUCTS_EXPORT_EOI_HEADERS[index],
    key,
    width: widths[index],
  }));

  const headerRow = ws.getRow(1);
  headerRow.values = [...ADMIN_PRODUCTS_EXPORT_EOI_HEADERS];
  headerRow.font = { bold: true };
  headerRow.commit();
  ws.views = [{ state: 'frozen', ySplit: 1, activeCell: 'A2' }];
}

export function buildAdminProductsExportCsv(
  eoiRows: Array<Record<string, unknown>>,
): string {
  const lines = [ADMIN_PRODUCTS_EXPORT_EOI_HEADERS.map(csvEscape).join(',')];
  for (const row of eoiRows) {
    const mapped = mapAdminProductsExportEoiRow(row);
    lines.push(
      ADMIN_PRODUCTS_EXPORT_EOI_KEYS.map((key) =>
        csvEscape(mapped[key as keyof typeof mapped]),
      ).join(','),
    );
  }
  return `${lines.join('\r\n')}\r\n`;
}

export async function buildAdminProductsExportXlsxBuffer(
  eoiRows: Array<Record<string, unknown>>,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Products Export');
  writeAdminProductsEoiWorksheetHeaders(ws);

  for (const row of eoiRows) {
    ws.addRow(mapAdminProductsExportEoiRow(row));
  }

  const raw = await workbook.xlsx.writeBuffer();
  return Buffer.isBuffer(raw) ? raw : Buffer.from(raw as ArrayBuffer);
}
