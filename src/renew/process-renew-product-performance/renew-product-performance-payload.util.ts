import { normalizeTestReportRow } from '../../common/form-partial-field.util';

export type RenewTestReportRow = {
  productName: string;
  testReportFileName: string;
  eoiNo?: string;
};

export function mapRenewProductDocument(
  doc: Record<string, unknown>,
): Record<string, unknown> {
  return {
    _id: doc._id,
    productDocumentId: doc.productDocumentId,
    vendorId: doc.vendorId,
    urnNo: doc.urnNo,
    eoiNo: doc.eoiNo,
    documentForm: doc.documentForm,
    documentFormSubsection: doc.documentFormSubsection,
    formPrimaryId: doc.formPrimaryId,
    documentName: doc.documentName,
    documentOriginalName: doc.documentOriginalName,
    documentLink: doc.documentLink,
    createdDate: doc.createdDate,
    updatedDate: doc.updatedDate,
  };
}

export function resolveRowTestReports(
  row: Record<string, unknown> | null | undefined,
  eoiNo?: string,
): RenewTestReportRow[] {
  if (!row) {
    return [];
  }

  const embedded = Array.isArray(row.testReports) ? row.testReports : [];
  if (embedded.length > 0) {
    return embedded
      .map((entry) => {
        const normalized = normalizeTestReportRow(entry as Record<string, unknown>);
        return {
          productName: normalized.productName,
          testReportFileName: normalized.testReportFileName,
          ...(eoiNo ? { eoiNo } : {}),
        };
      })
      .filter((r) => r.productName.trim() || r.testReportFileName.trim());
  }

  const productName = String(row.productName ?? '').trim();
  const testReportFileName = String(row.testReportFileName ?? '').trim();
  if (!productName && !testReportFileName) {
    return [];
  }

  return [
    {
      productName,
      testReportFileName,
      ...(eoiNo ? { eoiNo } : {}),
    },
  ];
}

export function parseIncomingRenewTestReports(
  raw: unknown,
  defaultProductName?: string,
  defaultEoiNo?: string,
): RenewTestReportRow[] {
  if (raw === undefined || raw === null) {
    return [];
  }

  let rows: Array<Record<string, unknown>> = [];
  if (Array.isArray(raw)) {
    rows = raw as Array<Record<string, unknown>>;
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      rows = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object'
          ? [parsed as Record<string, unknown>]
          : [];
    } catch {
      return [];
    }
  } else if (typeof raw === 'object') {
    rows = [raw as Record<string, unknown>];
  }

  const seen = new Set<string>();
  const result: RenewTestReportRow[] = [];
  for (const row of rows) {
    const normalized = normalizeTestReportRow(row);
    const productName = (normalized.productName || defaultProductName || '').trim();
    const testReportFileName = normalized.testReportFileName.trim();
    const eoiNo =
      String(row.eoiNo ?? row.eoi_no ?? '').trim() ||
      defaultEoiNo?.trim() ||
      undefined;
    if (!productName && !testReportFileName) {
      continue;
    }
    const key = `${eoiNo ?? ''}__${productName.toLowerCase()}__${testReportFileName.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({
      productName,
      testReportFileName,
      ...(eoiNo ? { eoiNo } : {}),
    });
  }
  return result;
}

const EMPTY_PRODUCT_KEY = '__default__';
const EMPTY_FILE_KEY = '__unnamed__';

export function normalizedProductNameKey(productName?: string): string {
  return String(productName ?? '').trim().toLowerCase() || EMPTY_PRODUCT_KEY;
}

export function normalizedTestReportFileNameKey(testReportFileName?: string): string {
  return String(testReportFileName ?? '').trim().toLowerCase() || EMPTY_FILE_KEY;
}

export function isMeaningfulRenewTestReportRow(
  productName: string,
  testReportFileName: string,
): boolean {
  return Boolean(productName.trim() || testReportFileName.trim());
}

export type NormalizedRenewTestReportRow = RenewTestReportRow & {
  normalizedProductName: string;
  normalizedTestReportFileName: string;
};

export function normalizeIncomingRenewTestReportsForReplace(
  raw: unknown,
  defaultEoiNo?: string,
): NormalizedRenewTestReportRow[] {
  const parsed = parseIncomingRenewTestReports(raw, undefined, defaultEoiNo);
  const seen = new Set<string>();
  const result: NormalizedRenewTestReportRow[] = [];

  for (const row of parsed) {
    if (!isMeaningfulRenewTestReportRow(row.productName, row.testReportFileName)) {
      continue;
    }
    const normalizedProductName = normalizedProductNameKey(row.productName);
    const normalizedTestReportFileName = normalizedTestReportFileNameKey(
      row.testReportFileName,
    );
    const key = `${row.eoiNo ?? ''}__${normalizedProductName}__${normalizedTestReportFileName}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({
      ...row,
      normalizedProductName,
      normalizedTestReportFileName,
    });
  }
  return result;
}

export function toPublicRenewTestReports(
  rows: RenewTestReportRow[],
): RenewTestReportRow[] {
  return rows.map((r) => ({
    productName: r.productName,
    testReportFileName: r.testReportFileName,
    ...(r.eoiNo ? { eoiNo: r.eoiNo } : {}),
  }));
}

export function buildRowsFromAuthoritativeTestReports(
  products: Array<{ eoiNo: string; productName: string; productStatus: number }>,
  testReports: RenewTestReportRow[],
  header: Record<string, unknown> | null,
  documents: Array<Record<string, unknown>>,
  urnNo: string,
): Array<Record<string, unknown>> {
  const byEoi = groupTestReportsByEoi(
    testReports,
    products.map((p) => ({ eoiNo: p.eoiNo, productName: p.productName })),
  );

  const processRenewProductPerformanceId = header?.processRenewProductPerformanceId;
  const productPerformanceStatus = Number(header?.productPerformanceStatus ?? 0);
  const renewalType = Number(header?.renewalType ?? 0);
  const testReportFiles = Math.max(
    Number(header?.testReportFiles ?? documents.length),
    testReports.length,
  );

  return products.map((product) => {
    const nested = (byEoi.get(product.eoiNo) ?? []).map(({ productName, testReportFileName }) => ({
      productName,
      testReportFileName,
      eoiNo: product.eoiNo,
    }));
    const rowDocuments = documents.filter(
      (d) => !d.eoiNo || d.eoiNo === product.eoiNo,
    );
    return {
      _id: header?._id,
      processRenewProductPerformanceId,
      urnNo,
      eoiNo: product.eoiNo,
      productName: product.productName,
      productPerformanceStatus,
      renewalType,
      testReportFiles,
      testReports: nested,
      documents: rowDocuments,
    };
  });
}

export function groupTestReportsByEoi(
  reports: RenewTestReportRow[],
  products: Array<{ eoiNo: string; productName: string }>,
): Map<string, RenewTestReportRow[]> {
  const byEoi = new Map<string, RenewTestReportRow[]>();
  const nameToEoi = new Map<string, string>();
  for (const p of products) {
    nameToEoi.set(p.productName.trim().toLowerCase(), p.eoiNo);
    byEoi.set(p.eoiNo, []);
  }

  for (const report of reports) {
    let eoiNo = report.eoiNo?.trim();
    if (!eoiNo && report.productName.trim()) {
      eoiNo = nameToEoi.get(report.productName.trim().toLowerCase());
    }
    if (!eoiNo && products.length === 1) {
      eoiNo = products[0].eoiNo;
    }
    if (!eoiNo) {
      continue;
    }
    const list = byEoi.get(eoiNo) ?? [];
    list.push({
      productName: report.productName,
      testReportFileName: report.testReportFileName,
      eoiNo,
    });
    byEoi.set(eoiNo, list);
  }

  return byEoi;
}
