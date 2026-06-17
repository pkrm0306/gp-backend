/**
 * Site visits share `products.urnStatus` with certification workflow.
 * Status 5 marks site-visit-in-progress only while process forms are still open (3).
 * Once the vendor has submitted for review (>= 4), adding a visit must not change stage.
 */
export function resolveSiteVisitUrnStatusAfterCreate(
  currentMaxStatus: number,
): { shouldUpdate: boolean; nextStatus: number } {
  if (currentMaxStatus === 3) {
    return { shouldUpdate: true, nextStatus: 5 };
  }
  return { shouldUpdate: false, nextStatus: currentMaxStatus };
}
