/** Lightweight response types for optimized Admin Dashboard endpoints. */

export type DashboardPendingActionPriority = 'critical' | 'high' | 'medium' | 'low';

export type DashboardPendingActionKey =
  | 'manufacturerApprovals'
  | 'productApprovals'
  | 'registrationPaymentApprovals'
  | 'documentVerification'
  | 'certificationPaymentApprovals'
  | 'renewalPaymentApprovals'
  | 'renewalDocumentVerification';

export type DashboardPendingActionRow = {
  id: string;
  key: DashboardPendingActionKey;
  action: string;
  pendingCount: number;
  priority: DashboardPendingActionPriority;
  sla: string;
  slaHoursRemaining: number;
  assignedTeam: string;
  quickActionLabel: string;
  href: string;
};

export type DashboardActivityVendorRow = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  registeredAt: string;
  status: string;
  statusTone: string;
  href: string;
};

export type DashboardActivityApplicationRow = {
  id: string;
  urnNo: string;
  manufacturerName: string;
  totalEoi: number;
  createdAt: string;
  href: string;
};

export type DashboardActivityPaymentRow = {
  id: string;
  transactionId: string;
  companyName: string;
  paymentType: string;
  paymentMode: string;
  amount: number;
  currency: 'INR';
  paidAt: string;
  status: string;
  statusTone: string;
  href: string;
};

export type DashboardActivityRenewalRow = {
  id: string;
  eoiNo: string;
  urnNo: string;
  productName: string;
  categoryName: string;
  sectorName: string;
  manufacturerName: string;
  expiresAt: string;
  daysRemaining: number;
  status: string;
  statusTone: string;
  href: string;
};

export type DashboardActivityCenterPayload = {
  vendors: DashboardActivityVendorRow[];
  applications: DashboardActivityApplicationRow[];
  payments: DashboardActivityPaymentRow[];
  renewals: DashboardActivityRenewalRow[];
  generatedAt: string;
};

export type DashboardSmartAlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export type DashboardSmartAlert = {
  id: string;
  key: string;
  title: string;
  message: string;
  severity: DashboardSmartAlertSeverity;
  timestamp: string;
  actionLabel: string;
  href: string;
  count?: number;
};

export type DashboardOperationalInsightCard = {
  key: string;
  label: string;
  valueDays: number;
  previousDays: number;
  changePercent: number;
  unit: 'days';
  slaThresholdDays: number;
  href?: string;
};

export type DashboardReportFormat = 'pdf' | 'xlsx' | 'csv';

export type DashboardReportCard = {
  key: string;
  title: string;
  description: string;
  lastGeneratedAt: string | null;
  formats: DashboardReportFormat[];
  downloadPath: string;
};

/** Aggregated operational signals from a minimal set of DB $facet queries. */
export type DashboardOpsSignals = {
  vendorsAwaitingApproval: number;
  productsPendingReview: number;
  registrationPaymentsPending: number;
  documentVerificationPending: number;
  certificationPaymentsPending: number;
  renewalPaymentsPending: number;
  renewalDocumentVerificationPending: number;
  paymentsPendingVerification: number;
  certificatesExpiringSoon: number;
  assessmentBacklog: number;
  renewalsDue: number;
  rejectedProducts: number;
  revenueCurrent: number;
  revenuePrevious: number;
  revenueChangePercent: number;
  avgVendorApprovalDays: number;
  avgProductReviewDays: number;
  avgAssessmentDays: number;
  avgCertificationDays: number;
  avgPaymentVerificationDays: number;
  avgRenewalProcessingDays: number;
  /** Previous comparable period averages for operational insights % change. */
  prevAvgVendorApprovalDays: number;
  prevAvgCertificationDays: number;
  prevAvgPaymentVerificationDays: number;
  prevAvgRenewalProcessingDays: number;
};
