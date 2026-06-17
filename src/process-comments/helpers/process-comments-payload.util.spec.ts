import {
  buildSectionCommentPayload,
  parseSectionCommentPayload,
  FINAL_REVIEW_META_SEPARATOR,
} from './process-comments-payload.util';

describe('process-comments-payload.util', () => {
  it('parses packed admin comment with review meta', () => {
    const packed = `rreeerr${FINAL_REVIEW_META_SEPARATOR}{"technicalHtml":"dddd","credits":"132","maxCredits":"12"}`;
    expect(parseSectionCommentPayload(packed)).toMatchObject({
      adminComment: 'rreeerr',
      technicalReview: 'dddd',
      finalReview: null,
      credits: '132',
      maxCredits: '12',
    });
  });

  it('builds packed payload with meta separator', () => {
    const packed = buildSectionCommentPayload({
      adminComment: 'note',
      technicalReview: 'tech',
      credits: 10,
      maxCredits: 20,
    });
    expect(packed).toContain(FINAL_REVIEW_META_SEPARATOR);
    expect(parseSectionCommentPayload(packed)).toMatchObject({
      adminComment: 'note',
      technicalReview: 'tech',
      credits: '10',
      maxCredits: '20',
    });
  });
});
