"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSiteVisitUrnStatusAfterCreate = resolveSiteVisitUrnStatusAfterCreate;
/**
 * Site visits share `products.urnStatus` with certification workflow.
 * Status 5 marks site-visit-in-progress only while process forms are still open (3).
 * Once the vendor has submitted for review (>= 4), adding a visit must not change stage.
 */
function resolveSiteVisitUrnStatusAfterCreate(currentMaxStatus) {
    if (currentMaxStatus === 3) {
        return { shouldUpdate: true, nextStatus: 5 };
    }
    return { shouldUpdate: false, nextStatus: currentMaxStatus };
}
