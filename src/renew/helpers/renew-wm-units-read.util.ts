import { Model } from 'mongoose';
import {
  ProcessWmManufacturingUnit,
  ProcessWmManufacturingUnitDocument,
} from '../../process-wm-manufacturing-units/schemas/process-wm-manufacturing-unit.schema';
import {
  ProcessRenewWmManufacturingUnit,
  ProcessRenewWmManufacturingUnitDocument,
} from '../schemas/process-renew-wm-manufacturing-unit.schema';
import { RenewalCycleDocument } from '../schemas/renewal-cycle.schema';
import { buildRenewProcessHeaderFilter } from './renew-cycle-scope.util';
import { formatRenewWmManufacturingUnitForDetails } from '../utils/renew-details-format.util';

/**
 * Load renewal WM units for read APIs. When the active cycle has no renew rows yet,
 * fall back to certified `process_wm_manufacturing_units` so admin/vendor review
 * can show the last submitted waste data until the vendor saves renewal WM units.
 */
export async function findRenewWmUnitsForRead(
  renewWmModel: Model<ProcessRenewWmManufacturingUnitDocument>,
  certWmModel: Model<ProcessWmManufacturingUnitDocument>,
  urnNo: string,
  cycle: RenewalCycleDocument | null,
): Promise<Array<Record<string, unknown>>> {
  const trimmedUrn = urnNo.trim();
  const cycleFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);

  let rows: Array<Record<string, unknown>> = await renewWmModel
    .find(cycleFilter)
    .sort({ processRenewWmManufacturingUnitId: 1 })
    .lean()
    .exec();

  if (rows.length === 0 && cycle?._id) {
    const cycleId = String(cycle._id);
    rows = await renewWmModel
      .find({
        urnNo: trimmedUrn,
        $or: [
          { renewalCycleId: cycle._id },
          { renewalCycleId: cycleId },
          { renewalCycleId: null },
          { renewalCycleId: { $exists: false } },
        ],
      })
      .sort({ processRenewWmManufacturingUnitId: 1 })
      .lean()
      .exec();
  }

  if (rows.length === 0) {
    rows = await certWmModel
      .find({ urnNo: trimmedUrn })
      .sort({ processWmManufacturingUnitId: 1 })
      .lean()
      .exec();
  }

  return rows.map((row) =>
    formatRenewWmManufacturingUnitForDetails(row as Record<string, unknown>),
  );
}
