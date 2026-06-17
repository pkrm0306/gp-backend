import { formatProcessFinalReviewPayload } from './format-process-final-review.util';

describe('formatProcessFinalReviewPayload', () => {
  it('returns null for empty input', () => {
    expect(formatProcessFinalReviewPayload(null)).toBeNull();
    expect(formatProcessFinalReviewPayload(undefined)).toBeNull();
  });

  it('formats camelCase and snake_case aliases', () => {
    const out = formatProcessFinalReviewPayload({
      technicalReview: 'Technical notes',
      finalReview: 'Final notes',
      minCredits: 52,
      maxCredits: 88,
    });
    expect(out).toMatchObject({
      technicalReview: 'Technical notes',
      finalReview: 'Final notes',
      minCredits: 52,
      maxCredits: 88,
      technical_review: 'Technical notes',
      final_review: 'Final notes',
      min_credits: 52,
      max_credits: 88,
    });
  });
});
