"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY = void 0;
exports.renewEligibilityThresholdDate = renewEligibilityThresholdDate;
/**
 * How many days before validtillDate a certified product becomes
 * eligible for the Renewal tab / renew lists / “expiring soon” windows
 * that share this business rule.
 */
exports.RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY = 90;
/** `now + RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY` (calendar days via Date#setDate). */
function renewEligibilityThresholdDate(asOf) {
    if (asOf === void 0) { asOf = new Date(); }
    var threshold = new Date(asOf);
    threshold.setDate(threshold.getDate() + exports.RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY);
    return threshold;
}
