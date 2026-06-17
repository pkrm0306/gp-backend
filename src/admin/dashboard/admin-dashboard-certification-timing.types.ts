import type {
  CertificationTimingBreakdownKey,
  CertificationTimingStageKey,
} from '../utils/admin-dashboard-certification-timing.util';

export interface CertificationTimingStageItem {
  key: CertificationTimingStageKey;
  label: string;
  order: number;
  avgDays: number;
  /** Number of URNs/manufacturers that contributed to this stage average */
  sampleCount: number;
}

export interface CertificationTimingBreakdownItem {
  key: CertificationTimingBreakdownKey;
  label: string;
  order: number;
  avgDays: number;
  sampleCount: number;
}

export interface AdminDashboardCertificationTiming {
  timeAtStage: {
    title: string;
    subtitle: string;
    unit: 'days';
    stages: CertificationTimingStageItem[];
  };
  avgTimeToCertification: {
    title: string;
    subtitle: string;
    unit: 'days';
    avgDays: number;
    sampleCount: number;
    breakdown: CertificationTimingBreakdownItem[];
  };
}
