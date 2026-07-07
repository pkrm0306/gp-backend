import { Model } from 'mongoose';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../../renew/schemas/renewal-cycle.schema';
import { normalizeTrimmedValue } from './merge-eligibility.shared';

export async function hasInProgressRenewalCycle(
  renewalCycleModel: Model<RenewalCycleDocument>,
  urnNo: string,
): Promise<boolean> {
  const trimmed = normalizeTrimmedValue(urnNo);
  if (!trimmed) return false;
  const count = await renewalCycleModel.countDocuments({
    urnNo: trimmed,
    status: RenewalCycleStatus.IN_PROGRESS,
  });
  return count > 0;
}

export type RenewalCycleModel = Model<RenewalCycleDocument>;
