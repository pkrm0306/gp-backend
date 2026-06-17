export const FINAL_REVIEW_META_SEPARATOR = '\n\n---FINAL_REVIEW_META---\n\n';

export const PROCESS_COMMENT_SECTION_FIELDS = [
  'productDesign',
  'productPerformance',
  'manfacturingProcess',
  'wasteManagement',
  'lifeCycleApproach',
  'productStewardship',
  'productInnovation',
  'rawMaterials31',
  'rawMaterials32',
  'rawMaterials33',
  'rawMaterials34',
  'rawMaterials35',
  'rawMaterials36',
  'rawMaterials37',
  'rawMaterials38',
  'rawMaterials39',
  'rawMaterials310',
  'rawMaterials311',
  'rawMaterials312',
  'rawMaterials313',
  'rawMaterials314',
  'rawMaterials315',
] as const;

export type ParsedSectionCommentPayload = {
  adminComment: string | null;
  commentHtml: string | null;
  technicalReview: string | null;
  finalReview: string | null;
  credits: string | number | null;
  maxCredits: string | number | null;
  technicalHtml: string | null;
  finalHtml: string | null;
};

export function parseSectionCommentPayload(
  packed?: string | null,
): ParsedSectionCommentPayload {
  const raw = String(packed ?? '');
  const separatorIndex = raw.indexOf(FINAL_REVIEW_META_SEPARATOR);
  let adminComment = raw.trim();
  let meta: Record<string, unknown> = {};

  if (separatorIndex >= 0) {
    adminComment = raw.slice(0, separatorIndex).trim();
    const metaRaw = raw
      .slice(separatorIndex + FINAL_REVIEW_META_SEPARATOR.length)
      .trim();
    if (metaRaw) {
      try {
        const parsed = JSON.parse(metaRaw);
        if (parsed && typeof parsed === 'object') {
          meta = parsed as Record<string, unknown>;
        }
      } catch {
        meta = {};
      }
    }
  }

  const technicalReview = String(
    meta.technicalHtml ?? meta.technicalReview ?? '',
  ).trim();
  const finalReview = String(meta.finalHtml ?? meta.finalReview ?? '').trim();
  const credits = meta.credits ?? null;
  const maxCredits = meta.maxCredits ?? null;

  return {
    adminComment: adminComment || null,
    commentHtml: adminComment || null,
    technicalReview: technicalReview || null,
    finalReview: finalReview || null,
    credits:
      credits === '' || credits == null
        ? null
        : (credits as string | number),
    maxCredits:
      maxCredits === '' || maxCredits == null
        ? null
        : (maxCredits as string | number),
    technicalHtml: technicalReview || null,
    finalHtml: finalReview || null,
  };
}

export function buildSectionCommentPayload(params: {
  adminComment?: string | null;
  technicalReview?: string | null;
  finalReview?: string | null;
  credits?: string | number | null;
  maxCredits?: string | number | null;
}): string {
  const adminComment = String(params.adminComment ?? '').trim();
  const meta = {
    technicalHtml: String(params.technicalReview ?? '').trim() || undefined,
    finalHtml: String(params.finalReview ?? '').trim() || undefined,
    credits:
      params.credits === '' || params.credits == null
        ? undefined
        : String(params.credits),
    maxCredits:
      params.maxCredits === '' || params.maxCredits == null
        ? undefined
        : String(params.maxCredits),
  };

  const hasMeta = Object.values(meta).some(
    (value) => value != null && String(value).trim() !== '',
  );

  if (!hasMeta) {
    return adminComment;
  }

  return `${adminComment}${FINAL_REVIEW_META_SEPARATOR}${JSON.stringify(meta)}`;
}

export function formatProcessCommentsForApi(
  doc: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!doc) {
    return null;
  }

  const sectionReviews: Record<string, ParsedSectionCommentPayload> = {};
  for (const field of PROCESS_COMMENT_SECTION_FIELDS) {
    const packed = doc[field];
    if (typeof packed === 'string' && packed.trim() !== '') {
      sectionReviews[field] = parseSectionCommentPayload(packed);
    }
  }

  return {
    ...doc,
    sectionReviews,
  };
}
