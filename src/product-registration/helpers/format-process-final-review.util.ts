export type ProcessFinalReviewPayload = {
  _id?: unknown;
  processFinalReviewId?: number;
  urnNo?: string;
  vendorId?: unknown;
  technicalReview: string | null;
  finalReview: string | null;
  minCredits: number | null;
  maxCredits: number | null;
  technical_review: string | null;
  final_review: string | null;
  min_credits: number | null;
  max_credits: number | null;
  createdDate?: unknown;
  updatedDate?: unknown;
};

export function formatProcessFinalReviewPayload(
  row: Record<string, unknown> | null | undefined,
): ProcessFinalReviewPayload | null {
  if (!row) {
    return null;
  }

  const technicalReview = String(
    row.technicalReview ?? row.technical_review ?? '',
  ).trim();
  const finalReview = String(
    row.finalReview ?? row.final_review ?? '',
  ).trim();
  const minRaw = row.minCredits ?? row.min_credits;
  const maxRaw = row.maxCredits ?? row.max_credits;
  const minCredits =
    minRaw === '' || minRaw == null ? null : Number(minRaw);
  const maxCredits =
    maxRaw === '' || maxRaw == null ? null : Number(maxRaw);

  return {
    _id: row._id,
    processFinalReviewId:
      row.processFinalReviewId != null
        ? Number(row.processFinalReviewId)
        : undefined,
    urnNo: row.urnNo != null ? String(row.urnNo) : undefined,
    vendorId: row.vendorId,
    technicalReview: technicalReview || null,
    finalReview: finalReview || null,
    minCredits: Number.isFinite(minCredits) ? minCredits : null,
    maxCredits: Number.isFinite(maxCredits) ? maxCredits : null,
    technical_review: technicalReview || null,
    final_review: finalReview || null,
    min_credits: Number.isFinite(minCredits) ? minCredits : null,
    max_credits: Number.isFinite(maxCredits) ? maxCredits : null,
    createdDate: row.createdDate,
    updatedDate: row.updatedDate,
  };
}
