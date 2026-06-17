import {
  buildVendorUrnTabAccess,
  isVendorFinalReviewProcessLock,
  resolveVendorProcessEditBlockReason,
} from './vendor-urn-tab-access.util';

describe('vendor-urn-tab-access.util', () => {
  it('locks process tabs after admin final submit until certification fee approved', () => {
    expect(isVendorFinalReviewProcessLock(6, 0)).toBe(true);
    expect(isVendorFinalReviewProcessLock(10, 0)).toBe(true);
    expect(isVendorFinalReviewProcessLock(11, 0)).toBe(false);
  });

  it('keeps quick view and payment enabled while process tabs are locked', () => {
    const access = buildVendorUrnTabAccess({
      urnNo: 'URN-1',
      urnStatus: 7,
      productRenewStatus: 0,
    });

    expect(access.processTabsLocked).toBe(true);
    expect(access.enabledTabs).toEqual(['quick_view', 'payment']);
    expect(access.tabs.quick_view.enabled).toBe(true);
    expect(access.tabs.payment.enabled).toBe(true);
    expect(access.tabs.product_design.enabled).toBe(false);
    expect(access.tabs.raw_materials.enabled).toBe(false);
  });

  it('allows process tabs during vendor resubmit corrections (status 5)', () => {
    const access = buildVendorUrnTabAccess({
      urnNo: 'URN-1',
      urnStatus: 5,
      productRenewStatus: 0,
    });

    expect(access.processTabsLocked).toBe(false);
    expect(access.enabledTabs).toContain('product_design');
  });

  it('blocks process edits with final-review lock message for status 6+', () => {
    expect(
      resolveVendorProcessEditBlockReason({ urnStatus: 6, productRenewStatus: 0 }),
    ).toMatch(/final review and certification fee approval/i);
  });
});
