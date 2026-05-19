/** URN lifecycle labels (matches ProductRegistrationService activity log). */
export const URN_STATUS_LABELS: Readonly<Record<number, string>> = {
  0: 'Proposal Pending',
  1: 'Registration Payment',
  2: 'Approve Registration Fee',
  3: 'Process Form In Progress',
  4: 'Process Form Submitted',
  5: 'Vendor Response',
  6: 'Final Verification',
  7: 'Certificate Payment',
  8: 'Approve Certificate Fee',
  9: 'Payment Rejected',
  10: 'Approved Certificate Fee',
  11: 'Certificate Published',
};

export function urnStatusLabel(status: number): string {
  return URN_STATUS_LABELS[status] ?? `Unknown (${status})`;
}

export function manufacturerStatusKey(status: number): string {
  switch (status) {
    case 1:
      return 'verified';
    case 2:
      return 'unverified';
    default:
      return 'inactivePending';
  }
}
