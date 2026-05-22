/** Multipart field names accepted for test report file uploads. */
export const PRODUCT_PERFORMANCE_UPLOAD_FIELD_NAMES = new Set([
  'files',
  'testReportFile',
  'testReportFiles',
  'file',
]);

export const PERFORMANCE_TEST_REPORT_SUBSECTION = 'test_report_files';

export { parseMultipartJsonIdArray } from '../product-design/product-design-upload.util';

export function collectProductPerformanceUploadFiles(
  files?: Express.Multer.File[],
): Express.Multer.File[] {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }
  return files.filter((f) => {
    if (!f?.originalname && !(f?.size > 0) && !f?.buffer?.length) {
      return false;
    }
    const field = String(f.fieldname ?? 'files');
    return PRODUCT_PERFORMANCE_UPLOAD_FIELD_NAMES.has(field);
  });
}

export function labelFromUploadFile(
  file: Express.Multer.File,
  index: number,
): string {
  const stem = String(file.originalname ?? '')
    .replace(/\.[^/.]+$/, '')
    .trim();
  return stem || `Test report ${index + 1}`;
}

/** True when at least one new file or one test report row has productName or testReportFileName. */
export function hasAtLeastOneProductPerformanceFieldFilled(params: {
  testReports?: Array<{
    productName?: string;
    testReportFileName?: string;
  }>;
  uploadedFiles: Express.Multer.File[];
}): boolean {
  if (params.uploadedFiles.length > 0) {
    return true;
  }
  const rows = params.testReports ?? [];
  return rows.some(
    (row) =>
      String(row?.productName ?? '').trim() ||
      String(row?.testReportFileName ?? '').trim(),
  );
}
