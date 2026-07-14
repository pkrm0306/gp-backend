import {
  buildDynamicProgressSteps,
  buildVendorProgressTracking,
  CERTIFICATION_JOURNEY_STEP_COUNT,
  resolveJourneyStepStatuses,
} from './vendor-progress.util';

describe('vendor-progress.util', () => {
  it('always returns 11 certification journey steps (renewal excluded)', () => {
    const steps = buildDynamicProgressSteps(0, []);
    expect(steps).toHaveLength(CERTIFICATION_JOURNEY_STEP_COUNT);
    expect(steps.some((step) => /renewal/i.test(step.label))).toBe(false);
  });

  it('marks only completed steps for urnStatus 3', () => {
    const statuses = resolveJourneyStepStatuses(3);
    expect(statuses.filter((status) => status === 'completed')).toHaveLength(3);
    expect(statuses[3]).toBe('active');
    expect(statuses.slice(4).every((status) => status === 'pending')).toBe(true);
  });

  it('marks all steps complete when urnStatus is certified (11)', () => {
    const statuses = resolveJourneyStepStatuses(11);
    expect(statuses.every((status) => status === 'completed')).toBe(true);
  });

  it('maps urnStatus 4 to review step as active with legacy submission complete', () => {
    const steps = buildDynamicProgressSteps(4, []);
    expect(steps[6]?.label).toBe('Process Forms Submission');
    expect(steps[6]?.status).toBe('completed');
    expect(steps[7]?.status).toBe('active');
    expect(steps[8]?.status).toBe('pending');
  });

  it('computes percent complete from completed steps only', () => {
    const tracking = buildVendorProgressTracking({
      urnNo: 'URN-TEST-001',
      urnStatus: 3,
      activityLogs: [],
    });

    expect(tracking.progressSteps).toHaveLength(CERTIFICATION_JOURNEY_STEP_COUNT);
    expect(tracking.percentComplete).toBe(27);
    expect(tracking.nextStep?.activitiesId).toBe(3);
    expect(tracking.latestStepCompleted?.activitiesId).toBe(2);
  });
});
