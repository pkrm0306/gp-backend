import {
  canAdminSaveUncertifiedProcessComments,
  PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS,
  resolveProcessCommentsBlockReason,
} from './process-comments-lock.util';

describe('process-comments-lock.util', () => {
  it('allows save during admin review and before certification payment submit', () => {
    expect(canAdminSaveUncertifiedProcessComments({ urnStatus: 4, productStatus: 1 })).toBe(
      true,
    );
    expect(canAdminSaveUncertifiedProcessComments({ urnStatus: 6, productStatus: 1 })).toBe(
      true,
    );
    expect(
      canAdminSaveUncertifiedProcessComments({
        urnStatus: PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS - 1,
        productStatus: 1,
      }),
    ).toBe(true);
  });

  it('blocks save after vendor submits certification payment for review', () => {
    expect(
      canAdminSaveUncertifiedProcessComments({
        urnStatus: PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS,
        productStatus: 1,
      }),
    ).toBe(false);
    expect(canAdminSaveUncertifiedProcessComments({ urnStatus: 11, productStatus: 1 })).toBe(
      false,
    );
  });

  it('returns lock message when comments are blocked', () => {
    expect(
      resolveProcessCommentsBlockReason({
        urnStatus: 8,
        productStatus: 1,
      }),
    ).toContain('certification payment');
  });
});
