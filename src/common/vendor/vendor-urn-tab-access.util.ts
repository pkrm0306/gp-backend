import { ADMIN_FINAL_SUBMIT_URN_STATUS } from '../../product-registration/constants/category-change.constants';
import {
  ADMIN_REVIEW_URN_STATUS,
  VENDOR_RESUBMIT_URN_STATUS,
} from '../../product-registration/constants/urn-tab-review.constants';
import { shouldUseRenewWorkflowForUrn } from '../../renew/constants/renewal-urn-status.constants';

/** Certification fee approved — vendor process tabs may open again (read-only when certified). */
export const VENDOR_CERTIFICATION_FEE_APPROVED_URN_STATUS = 11;

export const VENDOR_ALWAYS_ENABLED_TAB_KEYS = [
  'quick_view',
  'payment',
] as const;

export const VENDOR_PROCESS_TAB_KEYS = [
  'product_design',
  'product_performance',
  'manufacturing_process',
  'waste_management',
  'life_cycle_approach',
  'product_stewardship',
  'innovation',
  'raw_materials',
] as const;

export type VendorAlwaysEnabledTabKey =
  (typeof VENDOR_ALWAYS_ENABLED_TAB_KEYS)[number];
export type VendorProcessTabKey = (typeof VENDOR_PROCESS_TAB_KEYS)[number];
export type VendorUrnTabKey = VendorAlwaysEnabledTabKey | VendorProcessTabKey;

export const VENDOR_URN_FINAL_REVIEW_PROCESS_LOCK_MESSAGE =
  'Process forms are locked while admin completes final review and certification fee approval.';

export function isVendorFinalReviewProcessLock(
  urnStatus: number,
  productRenewStatus?: number | null,
): boolean {
  if (
    shouldUseRenewWorkflowForUrn({
      urnStatus,
      productRenewStatus,
    })
  ) {
    return false;
  }
  return (
    urnStatus >= ADMIN_FINAL_SUBMIT_URN_STATUS &&
    urnStatus < VENDOR_CERTIFICATION_FEE_APPROVED_URN_STATUS
  );
}

export function resolveVendorProcessEditBlockReason(params: {
  urnStatus?: number | null;
  productRenewStatus?: number | null;
}): string | null {
  const urnStatus = Number(params.urnStatus ?? 0);
  const productRenewStatus = params.productRenewStatus;

  if (
    shouldUseRenewWorkflowForUrn({
      urnStatus,
      productRenewStatus,
    })
  ) {
    return null;
  }

  if (urnStatus === ADMIN_REVIEW_URN_STATUS) {
    return 'This URN is submitted for review and cannot be edited.';
  }

  if (isVendorFinalReviewProcessLock(urnStatus, productRenewStatus)) {
    return VENDOR_URN_FINAL_REVIEW_PROCESS_LOCK_MESSAGE;
  }

  return null;
}

export function isVendorProcessTabNavigationLocked(params: {
  urnStatus: number;
  productRenewStatus?: number | null;
}): boolean {
  const urnStatus = Number(params.urnStatus ?? 0);
  if (
    shouldUseRenewWorkflowForUrn({
      urnStatus,
      productRenewStatus: params.productRenewStatus,
    })
  ) {
    return false;
  }
  if (urnStatus === VENDOR_RESUBMIT_URN_STATUS) {
    return false;
  }
  return (
    urnStatus === ADMIN_REVIEW_URN_STATUS ||
    isVendorFinalReviewProcessLock(urnStatus, params.productRenewStatus)
  );
}

export function buildVendorUrnTabAccess(params: {
  urnNo: string;
  urnStatus: number;
  productRenewStatus?: number | null;
}): {
  urnNo: string;
  urnStatus: number;
  quickViewEnabled: true;
  paymentEnabled: true;
  processTabsLocked: boolean;
  restrictProcessTabs: boolean;
  lockReason: string | null;
  enabledTabs: VendorUrnTabKey[];
  disabledTabs: VendorProcessTabKey[];
  tabs: Record<VendorUrnTabKey, { enabled: boolean; readOnly: boolean }>;
} {
  const { urnNo } = params;
  const urnStatus = Number(params.urnStatus ?? 0);
  const productRenewStatus = params.productRenewStatus;
  const lockReason = resolveVendorProcessEditBlockReason({
    urnStatus,
    productRenewStatus,
  });
  const processTabsLocked = isVendorProcessTabNavigationLocked({
    urnStatus,
    productRenewStatus,
  });

  const enabledTabs: VendorUrnTabKey[] = [...VENDOR_ALWAYS_ENABLED_TAB_KEYS];
  const disabledTabs: VendorProcessTabKey[] = [];
  const tabs = {} as Record<
    VendorUrnTabKey,
    { enabled: boolean; readOnly: boolean }
  >;

  for (const key of VENDOR_ALWAYS_ENABLED_TAB_KEYS) {
    tabs[key] = { enabled: true, readOnly: false };
  }

  for (const key of VENDOR_PROCESS_TAB_KEYS) {
    const enabled = !processTabsLocked;
    tabs[key] = { enabled, readOnly: !enabled };
    if (enabled) {
      enabledTabs.push(key);
    } else {
      disabledTabs.push(key);
    }
  }

  return {
    urnNo,
    urnStatus,
    quickViewEnabled: true,
    paymentEnabled: true,
    processTabsLocked,
    restrictProcessTabs: processTabsLocked,
    lockReason,
    enabledTabs,
    disabledTabs,
    tabs,
  };
}
