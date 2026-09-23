import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
} from '../../renew/constants/product-status.constants';
import {
  PRODUCT_RENEW_STATUS,
} from '../../renew/constants/renewal-urn-status.constants';
import { matchActiveProducts } from './active-product.filter';
import {
  isOngoingRenewalProduct,
  ONGOING_RENEWAL_URN_STATUSES,
} from './certified-product.filter';

/** Certified EOI status shown on the public website when still active. */
export const WEBSITE_PUBLIC_CERTIFIED_PRODUCT_STATUS = PRODUCT_STATUS_CERTIFIED;

/**
 * After `validtillDate`, ongoing renewal / discontinued products stay on the
 * public website for this many calendar months, then are omitted.
 */
export const PUBLIC_RENEWAL_VISIBILITY_MONTHS = 6;

/**
 * After `validtillDate`, expired certified products that are not renewing stay
 * visible (non-clickable) for this many calendar months.
 */
export const PUBLIC_EXPIRY_GRACE_MONTHS = 3;

export const PUBLIC_PRODUCT_RENEWAL_MESSAGE =
  'This product is undergoing renewal';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Calendar month add; clamp day to last day of target month. */
export function addCalendarMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDayOfMonth = new Date(
    d.getFullYear(),
    d.getMonth() + 1,
    0,
  ).getDate();
  d.setDate(Math.min(day, lastDayOfMonth));
  return startOfDay(d);
}

export function subCalendarMonths(date: Date, months: number): Date {
  return addCalendarMonths(date, -months);
}

function toIsoDate(value: Date | string | null | undefined): string | null {
  if (value == null || value === '') return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function parseDate(value: Date | string | null | undefined): Date | null {
  if (value == null || value === '') return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export type PublicWebsiteProductVisibilityInput = {
  productStatus?: number | null;
  certifiedDate?: Date | string | null;
  validtillDate?: Date | string | null;
  urnStatus?: number | null;
  productRenewStatus?: number | null;
};

export type PublicWebsiteProductVisibilityFlags = {
  productStatus: number;
  /** Canonical certification start (`certifiedDate`). */
  certifiedDate: string | null;
  /** Alias of `certifiedDate` for frontend “valid from” copy. */
  validFrom: string | null;
  validtillDate: string | null;
  isUnderRenewal: boolean;
  isPublicClickable: boolean;
  renewalMessage: string | null;
};

/**
 * Mongo match for products that may appear on the public website.
 *
 * Includes:
 * - Certified + still valid
 * - Certified + ongoing renewal while `validtillDate` is within the last 6 months (or null)
 * - Certified + expired within 3-month grace (not renewing)
 * - Discontinued (`productStatus` 4) while `validtillDate` is within the last 6 months
 *
 * Uses `$and` so it does not clash with `matchActiveProducts` `$or` (is_deleted).
 */
export function matchWebsitePublicCertifiedProducts(
  criteria: Record<string, unknown> = {},
  now = new Date(),
): Record<string, unknown> {
  const renewalFloor = subCalendarMonths(startOfDay(now), PUBLIC_RENEWAL_VISIBILITY_MONTHS);
  const graceFloor = subCalendarMonths(startOfDay(now), PUBLIC_EXPIRY_GRACE_MONTHS);

  return matchActiveProducts({
    ...criteria,
    $and: [
      {
        $or: [
          {
            productStatus: PRODUCT_STATUS_CERTIFIED,
            $or: [
              { validtillDate: null },
              { validtillDate: { $exists: false } },
              { validtillDate: { $gte: now } },
            ],
          },
          {
            productStatus: PRODUCT_STATUS_CERTIFIED,
            $and: [
              {
                $or: [
                  { urnStatus: { $in: [...ONGOING_RENEWAL_URN_STATUSES] } },
                  { productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS },
                ],
              },
              {
                $or: [
                  { validtillDate: null },
                  { validtillDate: { $exists: false } },
                  { validtillDate: { $gte: renewalFloor } },
                ],
              },
            ],
          },
          {
            productStatus: PRODUCT_STATUS_CERTIFIED,
            validtillDate: { $lt: now, $gte: graceFloor },
            urnStatus: { $nin: [...ONGOING_RENEWAL_URN_STATUSES] },
            productRenewStatus: { $ne: PRODUCT_RENEW_STATUS.IN_PROGRESS },
          },
          {
            productStatus: PRODUCT_STATUS_DISCONTINUED,
            validtillDate: { $gte: renewalFloor },
          },
        ],
      },
    ],
  });
}

/**
 * Same visibility as {@link matchWebsitePublicCertifiedProducts}.
 * Kept as a named alias for call sites that previously meant “active public”.
 */
export function matchWebsitePublicActiveCertifiedProducts(
  criteria: Record<string, unknown> = {},
  now = new Date(),
): Record<string, unknown> {
  return matchWebsitePublicCertifiedProducts(criteria, now);
}

export function isPublicWebsiteProductVisible(
  product: PublicWebsiteProductVisibilityInput,
  now = new Date(),
): boolean {
  const productStatus = Number(product.productStatus ?? 0);
  const validtill = parseDate(product.validtillDate);
  const ongoing = isOngoingRenewalProduct({
    urnStatus: product.urnStatus,
    productRenewStatus: product.productRenewStatus,
  });
  const renewalFloor = subCalendarMonths(
    startOfDay(now),
    PUBLIC_RENEWAL_VISIBILITY_MONTHS,
  );
  const graceFloor = subCalendarMonths(
    startOfDay(now),
    PUBLIC_EXPIRY_GRACE_MONTHS,
  );

  if (productStatus === PRODUCT_STATUS_CERTIFIED) {
    if (!validtill || validtill.getTime() >= now.getTime()) {
      return true;
    }
    if (ongoing && validtill.getTime() >= renewalFloor.getTime()) {
      return true;
    }
    if (
      !ongoing &&
      validtill.getTime() < now.getTime() &&
      validtill.getTime() >= graceFloor.getTime()
    ) {
      return true;
    }
    return false;
  }

  if (productStatus === PRODUCT_STATUS_DISCONTINUED) {
    return Boolean(validtill && validtill.getTime() >= renewalFloor.getTime());
  }

  return false;
}

/**
 * UI flags for public list/search/detail. Call only for products that already
 * pass {@link isPublicWebsiteProductVisible} / {@link matchWebsitePublicCertifiedProducts}.
 */
export function computePublicWebsiteProductVisibilityFlags(
  product: PublicWebsiteProductVisibilityInput,
  now = new Date(),
): PublicWebsiteProductVisibilityFlags {
  const productStatus = Number(product.productStatus ?? 0);
  const certifiedDate = toIsoDate(product.certifiedDate);
  const validtillDate = toIsoDate(product.validtillDate);
  const validtill = parseDate(product.validtillDate);
  const ongoing = isOngoingRenewalProduct({
    urnStatus: product.urnStatus,
    productRenewStatus: product.productRenewStatus,
  });
  const pastValid =
    validtill != null && validtill.getTime() < now.getTime();

  const isUnderRenewal =
    ongoing ||
    productStatus === PRODUCT_STATUS_DISCONTINUED ||
    (productStatus === PRODUCT_STATUS_CERTIFIED && pastValid);

  return {
    productStatus,
    certifiedDate,
    validFrom: certifiedDate,
    validtillDate,
    isUnderRenewal,
    isPublicClickable: !isUnderRenewal,
    renewalMessage: isUnderRenewal ? PUBLIC_PRODUCT_RENEWAL_MESSAGE : null,
  };
}
