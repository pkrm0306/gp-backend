import {
  buildRequiredReviewSlots,
  parseVisibleRawMaterialSteps,
} from './urn-tab-review.util';

describe('urn-tab-review.util', () => {
  it('parses empty CSV as all 15 steps', () => {
    expect(parseVisibleRawMaterialSteps('')).toEqual(
      Array.from({ length: 15 }, (_, i) => i + 1),
    );
  });

  it('parses CSV list', () => {
    expect(parseVisibleRawMaterialSteps('1,2,5,7')).toEqual([1, 2, 5, 7]);
  });

  it('builds 7 process + visible raw material slots', () => {
    const slots = buildRequiredReviewSlots([1, 7]);
    expect(slots.filter((s) => s.stepId === null)).toHaveLength(7);
    expect(slots.filter((s) => s.tabKey === 'raw-materials')).toHaveLength(2);
  });
});
