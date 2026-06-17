import {
  buildUrnMilestones,
  computeEndToEndDays,
  computeStageDurationsFromMilestones,
  daysBetween,
  mapActivityIdToTimingStage,
} from './admin-dashboard-certification-timing.util';

describe('admin-dashboard-certification-timing.util', () => {
  it('maps activity ids to timing stages', () => {
    expect(mapActivityIdToTimingStage(0)).toBe('urn');
    expect(mapActivityIdToTimingStage(1)).toBe('eoi');
    expect(mapActivityIdToTimingStage(4)).toBe('payment');
    expect(mapActivityIdToTimingStage(6)).toBe('review');
    expect(mapActivityIdToTimingStage(7)).toBe('verified');
    expect(mapActivityIdToTimingStage(10)).toBe('certified');
  });

  it('computes stage durations from milestones', () => {
    const milestones = buildUrnMilestones(
      [
        { activities_id: 0, created_at: new Date('2026-01-01') },
        { activities_id: 1, created_at: new Date('2026-01-04') },
        { activities_id: 5, created_at: new Date('2026-01-09') },
      ],
      new Date('2026-01-15'),
    );

    const durations = computeStageDurationsFromMilestones(milestones);
    expect(durations.get('urn')).toBe(3);
    expect(durations.get('eoi')).toBe(5);
    expect(durations.get('review')).toBe(6);
  });

  it('computes end-to-end certification days', () => {
    const milestones = buildUrnMilestones(
      [{ activities_id: 0, created_at: new Date('2026-01-01') }],
      new Date('2026-01-21'),
    );
    expect(computeEndToEndDays(milestones, new Date('2026-01-21'))).toBe(20);
    expect(daysBetween(new Date('2026-01-01'), new Date('2026-01-04'))).toBe(3);
  });
});
