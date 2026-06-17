import { resolveSiteVisitUrnStatusAfterCreate } from './urn-site-visit-workflow.util';

describe('resolveSiteVisitUrnStatusAfterCreate', () => {
  it('moves process-form-in-progress (3) to site-visit-in-progress (5)', () => {
    expect(resolveSiteVisitUrnStatusAfterCreate(3)).toEqual({
      shouldUpdate: true,
      nextStatus: 5,
    });
  });

  it('does not change status after vendor submit for review (4)', () => {
    expect(resolveSiteVisitUrnStatusAfterCreate(4)).toEqual({
      shouldUpdate: false,
      nextStatus: 4,
    });
  });

  it('does not downgrade later workflow stages (6+)', () => {
    expect(resolveSiteVisitUrnStatusAfterCreate(6)).toEqual({
      shouldUpdate: false,
      nextStatus: 6,
    });
  });

  it('does not bump early payment stages (0–2)', () => {
    for (const status of [0, 1, 2]) {
      expect(resolveSiteVisitUrnStatusAfterCreate(status)).toEqual({
        shouldUpdate: false,
        nextStatus: status,
      });
    }
  });
});
