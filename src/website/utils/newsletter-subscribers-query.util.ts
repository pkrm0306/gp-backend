/** Newest of createdAt / updatedAt — used so re-subscribes surface at the top of the list. */
export function newsletterSubscriberActivityMs(
  row: Record<string, unknown>,
): number {
  const updated = Date.parse(String(row.updatedAt ?? ''));
  const created = Date.parse(String(row.createdAt ?? ''));
  return Math.max(
    Number.isFinite(updated) ? updated : 0,
    Number.isFinite(created) ? created : 0,
  );
}

export function newsletterSubscriberActivityDate(
  row: Record<string, unknown>,
): Date | null {
  const ms = newsletterSubscriberActivityMs(row);
  return ms > 0 ? new Date(ms) : null;
}

/**
 * Merge subscriber rows by email, keeping the most recently active document
 * when the same email exists in both `newslettersubscribers` and
 * `newsletter_subscribers`.
 */
export function absorbNewsletterSubscriberRows(
  byEmail: Map<string, Record<string, unknown>>,
  rows: unknown[],
): void {
  for (const row of rows ?? []) {
    const email = String((row as { email?: string })?.email ?? '')
      .trim()
      .toLowerCase();
    if (!email) continue;
    const next = row as Record<string, unknown>;
    const existing = byEmail.get(email);
    if (
      !existing ||
      newsletterSubscriberActivityMs(next) >=
        newsletterSubscriberActivityMs(existing)
    ) {
      byEmail.set(email, next);
    }
  }
}

export function sortNewsletterSubscribersByActivity(
  rows: Record<string, unknown>[],
): Record<string, unknown>[] {
  return [...rows].sort((a, b) => {
    const delta =
      newsletterSubscriberActivityMs(b) - newsletterSubscriberActivityMs(a);
    if (delta !== 0) return delta;
    return String(b._id ?? '').localeCompare(String(a._id ?? ''));
  });
}

export const NEWSLETTER_SUBSCRIBER_COLLECTIONS = [
  'newslettersubscribers',
  'newsletter_subscribers',
] as const;
