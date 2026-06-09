import { Injectable } from '@nestjs/common';

const URN_STATUS_LABELS: Record<number, string> = {
  0: 'Proposal Pending',
  1: 'Registration Payment Pending',
  2: 'Approve Registration Payment Pending',
  3: 'Process Form In Progress',
  4: 'Check Process Forms',
  5: 'Vendor Response Pending',
  6: 'Final Verification Pending',
  7: 'Certificate Payment Pending',
  8: 'Approve Certificate Fee',
  9: 'Payment Rejected',
  11: 'Certification Fee Approved',
  12: 'Renewal Payment Pending',
  13: 'Renewal Payment Verification Pending',
  14: 'Renewal Payment Approved',
  15: 'Renewal Forms Review Pending',
  16: 'Renewal Vendor Response Pending',
  17: 'Renewal Final Verification Pending',
};

const PAYMENT_STATUS_LABELS: Record<number, string> = {
  0: 'Payment Pending',
  1: 'Paid',
  2: 'Payment Approve',
  3: 'Payment Rejected',
};

const PRODUCT_STATUS_LABELS: Record<number, string> = {
  0: 'Pending',
  1: 'Submitted',
  2: 'Certified',
  3: 'Rejected',
  4: 'Expired',
};

const PRODUCT_RENEW_STATUS_LABELS: Record<number, string> = {
  0: 'Not Renewed',
  1: 'Renewal In Progress',
  2: 'Renewed',
};

const PROPOSAL_STATUS_LABELS: Record<number, string> = {
  0: 'Proposal Pending',
  1: 'Proposal Approved',
  2: 'Proposal Rejected',
};

const WORKFLOW_STATUS_LABELS: Record<number, string> = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
};

const PROCESS_WORKFLOW_STATUS_LABELS: Record<number, string> = {
  0: 'Pending',
  1: 'In Progress',
  2: 'Completed',
  3: 'Rejected',
};

const URN_STATUS_KEYS = new Set(['updatestatusto', 'urnstatus']);
const PAYMENT_STATUS_KEYS = new Set(['paymentstatus']);
const PRODUCT_STATUS_KEYS = new Set(['productstatus']);
const PRODUCT_RENEW_STATUS_KEYS = new Set(['productrenewstatus']);
const PROPOSAL_STATUS_KEYS = new Set([
  'vendorproposalapprovalstatus',
  'proposalstatus',
  'proposalapprovalstatus',
]);
const WORKFLOW_STATUS_KEYS = new Set([
  'reviewstatus',
  'workflowstatus',
  'tabreviewstatus',
  'sectionreviewstatus',
]);

@Injectable()
export class AuditStatusResolver {
  resolve(key: string, value: unknown): string | undefined {
    const normalizedKey = this.normalizeKey(key);
    if (URN_STATUS_KEYS.has(normalizedKey)) {
      return this.labelFromMap(URN_STATUS_LABELS, value);
    }
    if (PAYMENT_STATUS_KEYS.has(normalizedKey)) {
      return this.labelFromMap(PAYMENT_STATUS_LABELS, value);
    }
    if (PRODUCT_STATUS_KEYS.has(normalizedKey)) {
      return this.labelFromMap(PRODUCT_STATUS_LABELS, value);
    }
    if (PRODUCT_RENEW_STATUS_KEYS.has(normalizedKey)) {
      return this.labelFromMap(PRODUCT_RENEW_STATUS_LABELS, value);
    }
    if (PROPOSAL_STATUS_KEYS.has(normalizedKey)) {
      return this.labelFromMap(PROPOSAL_STATUS_LABELS, value);
    }
    if (WORKFLOW_STATUS_KEYS.has(normalizedKey)) {
      return this.labelFromMap(WORKFLOW_STATUS_LABELS, value);
    }
    if (this.isProcessWorkflowStatusKey(normalizedKey)) {
      return this.labelFromMap(PROCESS_WORKFLOW_STATUS_LABELS, value);
    }
    return undefined;
  }

  normalizeKey(key: string): string {
    return key.replace(/\[\]$/g, '').toLowerCase();
  }

  private isProcessWorkflowStatusKey(key: string): boolean {
    return (
      key.endsWith('status') &&
      (key.startsWith('process') ||
        key.startsWith('rawmaterials') ||
        key.startsWith('productperformance') ||
        key.startsWith('productstewardship'))
    );
  }

  private labelFromMap(
    labels: Record<number, string>,
    value: unknown,
  ): string | undefined {
    const status =
      typeof value === 'number'
        ? value
        : typeof value === 'string' && value.trim() !== ''
          ? Number(value)
          : NaN;
    if (!Number.isInteger(status)) {
      return undefined;
    }
    return labels[status];
  }
}
