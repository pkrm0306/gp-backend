/**
 * REPORT ONLY — do not run against production without explicit approval.
 *
 * Existing doc_versions were inflated because trackDocumentVersionChange did
 * `latestVersionNo + 1` on every upload/save. Lifecycle versioning now owns
 * version numbers (Admin Resend / renew start), so historical V3/V4/V5… on many
 * URNs do not match true review-cycle counts.
 *
 * Observed (2026-09-10 inspect): 27+ URNs with max versionNo >= 3, including
 * URN-20260909131058 (product_design eco/supporting at V4 from per-save bumps),
 * and outliers up to V21 (URN-20260807112243).
 *
 * Proposed backfill (NOT applied):
 * 1. For each URN, reconstruct review cycles from activity_log / urnStatus
 *    transitions to 5 (cert resend) and 16 (renew resend), plus renew payment
 *    approved as first renew Vn.
 * 2. Cluster doc_versions by createdAt windows between those events.
 * 3. Remap each cluster to the lifecycle Vn for that window (many files → same Vn).
 * 4. Set products.documentLifecycleVersionNo = max remapped Vn.
 * 5. Drop legacy unique index streamId_1_versionNo_1 (now done on API boot).
 *
 * Risks:
 * - Ambiguous clustering when saves lack intervening Admin Resend events.
 * - Payment streams mixed with cert streams on the same URN counter.
 * - Irreversible without a backup of doc_versions / doc_streams.
 *
 * Recommendation: leave historical rows as-is for now; seed the new counter from
 * max(existing versionNo) so new writes continue from current max; run a curated
 * repair script only for URNs that need clean History for audits.
 */
export {};
