import { Model } from 'mongoose';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitDocument,
} from '../../process-mp-manufacturing-units/schemas/process-mp-manufacturing-unit.schema';
import {
  ProcessRenewMpManufacturingUnit,
  ProcessRenewMpManufacturingUnitDocument,
} from '../schemas/process-renew-mp-manufacturing-unit.schema';
import { RenewalCycleDocument } from '../schemas/renewal-cycle.schema';
import { buildRenewProcessHeaderFilter } from './renew-cycle-scope.util';
import { formatRenewMpManufacturingUnitForDetails } from '../utils/renew-details-format.util';

/** True when an MP unit row has a name and/or energy/water/production metrics. */
export function isSubstantiveMpUnitProp(row: Record<string, unknown>): boolean {
  const name = String(row.unitName ?? row.unit_name ?? '').trim();
  if (name) return true;
  const numericKeys = [
    'ecdProductionYear1',
    'ecd_production_year1',
    'ecdProductionYear2',
    'ecd_production_year2',
    'ecdProductionYear3',
    'ecd_production_year3',
    'ecdElectricYear1',
    'ecd_electric_year1',
    'ecdElectricYear2',
    'ecd_electric_year2',
    'ecdElectricYear3',
    'ecd_electric_year3',
    'wcdProductionYear1',
    'wcd_production_year1',
    'wcdProductionYear2',
    'wcd_production_year2',
    'wcdProductionYear3',
    'wcd_production_year3',
    'wcdWaterYear1',
    'wcd_water_year1',
    'wcdWaterYear2',
    'wcd_water_year2',
    'wcdWaterYear3',
    'wcd_water_year3',
  ];
  return numericKeys.some((key) => {
    const raw = row[key];
    if (raw === undefined || raw === null || raw === '') return false;
    return Number.isFinite(Number(raw));
  });
}

function formatMpUnitRows(
  rows: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return rows.map((row) => formatRenewMpManufacturingUnitForDetails(row));
}

function pickSubstantiveFormatted(
  rows: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  const formatted = formatMpUnitRows(rows);
  return formatted.filter((row) => isSubstantiveMpUnitProp(row));
}

/**
 * Load renewal MP units for read APIs. When the active cycle has no renew rows yet,
 * fall back to certified `process_mp_manufacturing_units` so admin certified browse /
 * review can show the last submitted manufacturing-unit metrics.
 * Empty cert shells (blank name, null metrics) are never returned — callers treat
 * those as "no units" and can fetch renew-by-URN separately.
 */
export async function findRenewMpUnitsForRead(
  renewMpModel: Model<ProcessRenewMpManufacturingUnitDocument>,
  certMpModel: Model<ProcessMpManufacturingUnitDocument>,
  urnNo: string,
  cycle: RenewalCycleDocument | null,
): Promise<Array<Record<string, unknown>>> {
  const trimmedUrn = urnNo.trim();
  const cycleFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);

  let rows: Array<Record<string, unknown>> = await renewMpModel
    .find(cycleFilter)
    .sort({ processRenewMpManufacturingUnitId: 1 })
    .lean()
    .exec();

  let substantive = pickSubstantiveFormatted(rows);
  if (substantive.length > 0) return substantive;

  if (cycle?._id) {
    const cycleId = String(cycle._id);
    rows = await renewMpModel
      .find({
        urnNo: trimmedUrn,
        $or: [
          { renewalCycleId: cycle._id },
          { renewalCycleId: cycleId },
          { renewalCycleId: null },
          { renewalCycleId: { $exists: false } },
        ],
      })
      .sort({ processRenewMpManufacturingUnitId: 1 })
      .lean()
      .exec();
    substantive = pickSubstantiveFormatted(rows);
    if (substantive.length > 0) return substantive;
  }

  // URN-wide renew search (cycle filter missed rows tagged to another cycle id shape).
  rows = await renewMpModel
    .find({ urnNo: trimmedUrn })
    .sort({ processRenewMpManufacturingUnitId: 1 })
    .lean()
    .exec();
  substantive = pickSubstantiveFormatted(rows);
  if (substantive.length > 0) return substantive;

  rows = await certMpModel
    .find({ urnNo: trimmedUrn })
    .sort({ processMpManufacturingUnitId: 1 })
    .lean()
    .exec();
  return pickSubstantiveFormatted(rows);
}
