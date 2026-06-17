import type {
  VendorDashboardKpiCard,
  VendorDashboardRecentActivityItem,
  VendorRecentActivityType,
} from './vendor-dashboard.types';

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function vendorActiveProductMatch(
  vendorId: unknown,
): Record<string, unknown> {
  return {
    vendorId,
    productType: 0,
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
  };
}

export function calcTrendPercent(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export function trendDirection(
  trendPercent: number,
): 'up' | 'down' | 'flat' {
  if (trendPercent > 0) return 'up';
  if (trendPercent < 0) return 'down';
  return 'flat';
}

export function buildKpiCard(input: {
  key: VendorDashboardKpiCard['key'];
  label: string;
  value: number;
  currentMonth: number;
  previousMonth: number;
  subLabel?: string;
  format?: 'number' | 'currency';
}): VendorDashboardKpiCard {
  const trendPercent = calcTrendPercent(input.currentMonth, input.previousMonth);
  return {
    key: input.key,
    label: input.label,
    value: input.value,
    trendPercent,
    trendDirection: trendDirection(trendPercent),
    subLabel: input.subLabel,
    currency: input.format === 'currency' ? 'INR' : undefined,
    format: input.format ?? 'number',
  };
}

export function monthShortLabel(month: number): string {
  return MONTH_SHORT[Math.max(0, Math.min(11, month - 1))] ?? `M${month}`;
}

export function mapRecentEoiStatus(
  productStatus: number,
  urnStatus: number,
): {
  statusKey: string;
  status: string;
  statusVariant: 'success' | 'warning' | 'danger' | 'info';
} {
  if (productStatus === 2) {
    return { statusKey: 'certified', status: 'Certified', statusVariant: 'success' };
  }
  if (productStatus === 3) {
    return { statusKey: 'rejected', status: 'Rejected', statusVariant: 'danger' };
  }
  if (productStatus === 0) {
    return { statusKey: 'pending', status: 'Pending', statusVariant: 'warning' };
  }
  if (productStatus === 1 && urnStatus >= 1 && urnStatus <= 4) {
    return { statusKey: 'approved', status: 'Approved', statusVariant: 'success' };
  }
  return {
    statusKey: 'under_review',
    status: 'Under Review',
    statusVariant: 'warning',
  };
}

export function suggestAxisMax(maxValue: number): number {
  if (maxValue <= 0) return 10;
  if (maxValue <= 10) return 10;
  if (maxValue <= 24) return 24;
  if (maxValue <= 32) return 32;
  if (maxValue <= 100) return Math.ceil(maxValue / 10) * 10;
  return Math.ceil(maxValue / 100) * 100;
}

export function formatRelativeTime(from: Date, now = new Date()): string {
  const diffMs = now.getTime() - from.getTime();
  if (diffMs < 0) return 'just now';
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function mapActivityLogToRecentItem(input: {
  id: string;
  activity: string;
  activitiesId: number;
  urnNo: string;
  productName?: string | null;
  createdAt: Date;
  now?: Date;
}): VendorDashboardRecentActivityItem {
  const type = inferActivityType(input.activity, input.activitiesId);
  const productLabel = input.productName?.trim() || 'product';
  const message = buildActivityMessage(type, input.activity, productLabel, input.urnNo);

  return {
    id: input.id,
    type,
    message,
    occurredAt: input.createdAt.toISOString(),
    relativeTimeLabel: formatRelativeTime(input.createdAt, input.now),
    metadata: {
      urnNo: input.urnNo,
      productName: input.productName ?? null,
      activitiesId: input.activitiesId,
    },
  };
}

function inferActivityType(
  activity: string,
  activitiesId: number,
): VendorRecentActivityType {
  const text = activity.toLowerCase();
  if (
    text.includes('payment') ||
    text.includes('fee') ||
    activitiesId === 3 ||
    activitiesId === 9
  ) {
    return 'payment';
  }
  if (
    text.includes('renew') ||
    text.includes('expir') ||
    text.includes('due')
  ) {
    return 'alert';
  }
  if (
    text.includes('reject') ||
    text.includes('re-upload') ||
    text.includes('document') ||
    text.includes('required')
  ) {
    return 'requirement';
  }
  if (
    text.includes('approve') ||
    activitiesId === 1 ||
    activitiesId === 11
  ) {
    return 'productApproval';
  }
  return 'submission';
}

function buildActivityMessage(
  type: VendorRecentActivityType,
  activity: string,
  productName: string,
  urnNo: string,
): string {
  const trimmed = activity.trim();
  if (type === 'productApproval') {
    return `Product '${productName}' approved`;
  }
  if (type === 'payment') {
    if (trimmed.toLowerCase().includes('payment')) return trimmed;
    return `Payment update recorded for ${urnNo}`;
  }
  if (type === 'requirement') {
    if (trimmed) return trimmed;
    return `Document re-upload required for ${urnNo}`;
  }
  if (type === 'alert') {
    if (trimmed) return trimmed;
    return `Certification renewal due`;
  }
  if (trimmed.toLowerCase().includes('registration')) {
    return `${trimmed} for ${productName}`;
  }
  if (trimmed) return trimmed;
  return `EOI submitted for review`;
}
