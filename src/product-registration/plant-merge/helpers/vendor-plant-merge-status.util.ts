import { Model } from 'mongoose';
import {
  PlantMergeAudit,
  PlantMergeAuditDocument,
} from '../schemas/plant-merge-audit.schema';
import {
  PLANT_MERGE_STATUS,
  PLANT_MERGE_STRATEGY_URN_COPY,
} from '../plant-merge.constants';
import { normalizeTrimmedValue } from '../../helpers/merge-eligibility.shared';

export type VendorPlantMergeSourceInfo = {
  targetEoiNo: string;
  targetUrnNo: string;
};

export function plantMergeSourceLookupKey(urnNo: string, eoiNo: string): string {
  return `${normalizeTrimmedValue(urnNo)}|${normalizeTrimmedValue(eoiNo)}`;
}

export async function loadVendorPlantMergeSourceIndex(
  plantMergeAuditModel: Model<PlantMergeAuditDocument>,
  pairs: Array<{ urnNo: string; eoiNo: string }>,
): Promise<Map<string, VendorPlantMergeSourceInfo>> {
  const uniquePairs = new Map<string, { urnNo: string; eoiNo: string }>();
  for (const pair of pairs) {
    const urnNo = normalizeTrimmedValue(pair.urnNo);
    const eoiNo = normalizeTrimmedValue(pair.eoiNo);
    if (!urnNo || !eoiNo) continue;
    uniquePairs.set(plantMergeSourceLookupKey(urnNo, eoiNo), { urnNo, eoiNo });
  }

  const index = new Map<string, VendorPlantMergeSourceInfo>();
  const pairList = [...uniquePairs.values()];
  if (pairList.length === 0) {
    return index;
  }

  const rows = await plantMergeAuditModel
    .find({
      mergeStrategy: PLANT_MERGE_STRATEGY_URN_COPY,
      mergeStatus: PLANT_MERGE_STATUS.COMPLETED,
      $or: pairList.map((pair) => ({ urnNo: pair.urnNo, eoiNo: pair.eoiNo })),
    })
    .select('urnNo eoiNo targetUrnNo targetEoiNo mergedAt')
    .sort({ mergedAt: -1 })
    .lean()
    .exec();

  for (const row of rows) {
    const urnNo = normalizeTrimmedValue(String(row.urnNo ?? ''));
    const eoiNo = normalizeTrimmedValue(String(row.eoiNo ?? ''));
    const targetEoiNo = normalizeTrimmedValue(String(row.targetEoiNo ?? ''));
    const targetUrnNo = normalizeTrimmedValue(String(row.targetUrnNo ?? ''));
    if (!urnNo || !eoiNo || !targetEoiNo) continue;

    const key = plantMergeSourceLookupKey(urnNo, eoiNo);
    if (!index.has(key)) {
      index.set(key, { targetEoiNo, targetUrnNo });
    }
  }

  return index;
}
