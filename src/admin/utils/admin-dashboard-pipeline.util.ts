/**
 * Admin dashboard certification pipeline (6 steps) — labels match the admin UI stepper.
 * Counts **EOI/product rows** (not distinct URNs):
 * - Stages 1–5: `productStatus ∈ {0,1}` grouped by `urnStatus` buckets
 * - Stage 6 (Certified): active certified EOIs (`productStatus = 2`, not expired)
 */
export const ADMIN_URN_PIPELINE_STEPS = [
  {
    key: 'eoi_submitted',
    label: 'EOI Submitted',
    order: 1,
    urnStatuses: [0],
  },
  {
    key: 'registration_payment_done',
    label: 'Registration Payment Done',
    order: 2,
    urnStatuses: [1, 2],
  },
  {
    key: 'process_form_in_progress',
    label: 'Process Form In Progress',
    order: 3,
    urnStatuses: [3, 4, 5],
  },
  {
    key: 'form_verification_done',
    label: 'Form Verification Done',
    order: 4,
    urnStatuses: [6],
  },
  {
    key: 'certification_fee_pending',
    label: 'Certification Fee Pending',
    order: 5,
    urnStatuses: [7, 8, 9, 10],
  },
  {
    key: 'certified',
    label: 'Certified',
    order: 6,
    urnStatuses: [11],
  },
] as const;

export type AdminUrnPipelineStepKey =
  (typeof ADMIN_URN_PIPELINE_STEPS)[number]['key'];

const URN_STATUS_TO_PIPELINE = new Map<number, AdminUrnPipelineStepKey>();
for (const step of ADMIN_URN_PIPELINE_STEPS) {
  for (const status of step.urnStatuses) {
    URN_STATUS_TO_PIPELINE.set(status, step.key);
  }
}

export function mapUrnStatusToPipelineStep(
  urnStatus: number,
): AdminUrnPipelineStepKey | null {
  return URN_STATUS_TO_PIPELINE.get(urnStatus) ?? null;
}

export function buildUrnPipelineChart(
  byUrnStatus: Array<{ status: number; count: number }>,
): Array<{
  key: AdminUrnPipelineStepKey;
  label: string;
  order: number;
  count: number;
}> {
  const counts = new Map<AdminUrnPipelineStepKey, number>();
  for (const step of ADMIN_URN_PIPELINE_STEPS) {
    counts.set(step.key, 0);
  }
  for (const row of byUrnStatus) {
    const stepKey = mapUrnStatusToPipelineStep(row.status);
    if (!stepKey) continue;
    counts.set(stepKey, (counts.get(stepKey) ?? 0) + (row.count ?? 0));
  }
  return ADMIN_URN_PIPELINE_STEPS.map((step) => ({
    key: step.key,
    label: step.label,
    order: step.order,
    count: counts.get(step.key) ?? 0,
  }));
}
