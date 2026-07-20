import {
  buildSectionCommentPayload,
  parseSectionCommentPayload,
  FINAL_REVIEW_META_SEPARATOR,
  hasMeaningfulProcessCommentValue,
  stripHtmlToPlainText,
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

  it('hasMeaningfulProcessCommentValue rejects empty primary comment', () => {
    expect(hasMeaningfulProcessCommentValue('')).toBe(false);
    expect(hasMeaningfulProcessCommentValue('<p></p>')).toBe(false);
    expect(hasMeaningfulProcessCommentValue('   ')).toBe(false);
    expect(hasMeaningfulProcessCommentValue('<p>Review note</p>')).toBe(true);
  });

  it('hasMeaningfulProcessCommentValue ignores technical-only meta without primary text', () => {
    const packed = buildSectionCommentPayload({
      adminComment: '',
      technicalReview: 'tech only',
    });
    expect(stripHtmlToPlainText('')).toBe('');
    expect(hasMeaningfulProcessCommentValue(packed)).toBe(false);
  });
});
