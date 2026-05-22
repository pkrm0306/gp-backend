/**
 * Vendor partial-row helpers (see vendor/lib/formPartialFieldFilled.ts).
 * Any one non-empty column in a row counts as “filled” — not all columns required.
 */

export function pickTrimmedString(
  row: Record<string, unknown> | undefined,
  keys: string[],
): string {
  if (!row || typeof row !== 'object') {
    return '';
  }
  for (const key of keys) {
    const value = row[key];
    if (value === undefined || value === null) {
      continue;
    }
    const trimmed = String(value).trim();
    if (trimmed !== '') {
      return trimmed;
    }
  }
  return '';
}

/** Product Design — measures row: either column may be filled. */
export function normalizeMeasureBenefitRow(
  row: Record<string, unknown> | undefined,
): { measuresImplemented: string; benefitsAchieved: string } {
  return {
    measuresImplemented: pickTrimmedString(row, [
      'measuresImplemented',
      'measures',
      'measure',
    ]),
    benefitsAchieved: pickTrimmedString(row, [
      'benefitsAchieved',
      'benefits',
      'benefit',
    ]),
  };
}

export function hasPartialMeasureBenefitRow(
  row: Record<string, unknown> | undefined,
): boolean {
  const n = normalizeMeasureBenefitRow(row);
  return Boolean(n.measuresImplemented || n.benefitsAchieved);
}

/** Product Performance — test report row: either column may be filled. */
export function normalizeTestReportRow(
  row: Record<string, unknown> | undefined,
): { productName: string; testReportFileName: string } {
  return {
    productName: pickTrimmedString(row, [
      'productName',
      'product_name',
      'productsName',
    ]),
    testReportFileName: pickTrimmedString(row, [
      'testReportFileName',
      'test_report_file_name',
      'testReportReference',
      'testReport',
      'productsTestReport',
    ]),
  };
}

export function hasPartialTestReportRow(
  row: Record<string, unknown> | undefined,
): boolean {
  const n = normalizeTestReportRow(row);
  return Boolean(n.productName || n.testReportFileName);
}

/** Raw Materials — hazardous / formaldehyde / solvents product row. */
export function normalizeRawMaterialsProductRow(
  row: Record<string, unknown> | undefined,
): { productName: string; testReportReference: string } {
  return {
    productName: pickTrimmedString(row, [
      'productName',
      'productsName',
      'product_name',
    ]),
    testReportReference: pickTrimmedString(row, [
      'testReportReference',
      'productsTestReport',
      'testReport',
      'testReportFileName',
    ]),
  };
}

export function hasPartialRawMaterialsProductRow(
  row: Record<string, unknown> | undefined,
): boolean {
  const n = normalizeRawMaterialsProductRow(row);
  return Boolean(n.productName || n.testReportReference);
}

export function normalizeMeasureBenefitRows(
  rows: Array<Record<string, unknown>> | undefined,
): Array<{ measuresImplemented: string; benefitsAchieved: string }> {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map((row) => normalizeMeasureBenefitRow(row));
}

export function normalizeTestReportRows(
  rows: Array<Record<string, unknown>> | undefined,
): Array<{ productName: string; testReportFileName: string }> {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map((row) => normalizeTestReportRow(row));
}
