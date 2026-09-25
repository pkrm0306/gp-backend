/**
 * How many days before validtillDate a certified product becomes
 * eligible for the Renewal tab / renew lists / “expiring soon” windows
 * that share this business rule.
 */
export const RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY = 90;

/** `now + RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY` (calendar days via Date#setDate). */
export function renewEligibilityThresholdDate(asOf: Date = new Date()): Date {
  const threshold = new Date(asOf);
  threshold.setDate(
    threshold.getDate() + RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY,
  );
  return threshold;
}
