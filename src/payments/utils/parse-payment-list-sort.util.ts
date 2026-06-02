export type PaymentListSortOrder = 'asc' | 'desc';

export interface ParsedPaymentListSort {
  sortBy: string;
  sortOrder: PaymentListSortOrder;
}

const DEFAULT: ParsedPaymentListSort = {
  sortBy: 'createdDate',
  sortOrder: 'desc',
};

/** API / client field names → `payment_details` document paths */
const SORT_FIELD_MAP: Record<string, string> = {
  createdAt: 'createdDate',
  createdDate: 'createdDate',
  updatedAt: 'updatedDate',
  updatedDate: 'updatedDate',
  paymentId: 'paymentId',
  quoteTotal: 'quoteTotal',
  urnNo: 'urnNo',
  paymentReferenceNo: 'paymentReferenceNo',
  paymentStatus: 'paymentStatus',
  paymentType: 'paymentType',
};

export function mapPaymentListSortField(field: string): string {
  const key = field.trim();
  return SORT_FIELD_MAP[key] ?? key;
}

/**
 * Accepts `asc` | `desc`, or `field:asc` | `field:desc` (e.g. `createdAt:desc`).
 */
export function parsePaymentListSort(raw: unknown): ParsedPaymentListSort {
  if (raw === undefined || raw === null || raw === '') {
    return { ...DEFAULT };
  }

  const s = String(raw).trim();
  if (!s) return { ...DEFAULT };

  const lower = s.toLowerCase();
  if (lower === 'asc' || lower === 'desc') {
    return { sortBy: DEFAULT.sortBy, sortOrder: lower };
  }

  const colonIdx = s.indexOf(':');
  if (colonIdx > 0) {
    const field = s.slice(0, colonIdx).trim();
    const order = s.slice(colonIdx + 1).trim().toLowerCase();
    if (order === 'asc' || order === 'desc') {
      return {
        sortBy: mapPaymentListSortField(field),
        sortOrder: order,
      };
    }
  }

  return { ...DEFAULT };
}

export function buildPaymentListMongoSort(
  parsed: ParsedPaymentListSort,
): Record<string, 1 | -1> {
  const dir: 1 | -1 = parsed.sortOrder === 'asc' ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [parsed.sortBy]: dir };
  if (parsed.sortBy !== 'paymentId') {
    sort.paymentId = dir;
  }
  return sort;
}
