import { Types } from 'mongoose';
import { CronJobType } from '../schemas/cron-email-log.schema';

export type EligibleExpiryProduct = {
  productId: number;
  eoiNo: string;
  urnNo: string;
  productName: string;
  productStatus: number;
  productRenewStatus: number;
  urnStatus: number;
  renewCycleNo?: number | null;
  validtillDate: Date;
  firstNotifyDate?: Date | null;
  secondNotifyDate?: Date | null;
  thirdNotifyDate?: Date | null;
  vendorId: Types.ObjectId;
  vendorName?: string | null;
  vendorEmail?: string | null;
  vendorPhone?: string | null;
  vendorDesignation?: string | null;
  vendorGst?: string | null;
  vendorStatus?: number | null;
  categoryName?: string | null;
  manufacturerName?: string | null;
  vendorProductCount?: number;
};

export type CronJobRunResult = {
  success: boolean;
  jobType: CronJobType;
  processed: number;
  sent: number;
  skipped: number;
  failed: number;
  deactivated: number;
  errors: Array<{ productId?: number; urnNo?: string; message: string }>;
};
