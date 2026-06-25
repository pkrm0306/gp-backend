import {
  computeReductionWithFallbackPercent,
  roundFixed,
  ENERGY_CONSUMPTION_RATIO_DECIMALS,
} from './mp-energy-consumption-calculations.util';

export const MANUFACTURING_ENERGY_WEIGHTED_FORMULA =
  'Weighted average of Row 16 (Reduction in Overall SEC) by sum of ecd production in reporting year';

export const MANUFACTURING_WATER_WEIGHTED_FORMULA =
  'Weighted average of Row 4 (Reduction in Specific Water Consumption) by sum of wcd production in reporting year';

export const MANUFACTURING_RENEWABLE_WEIGHTED_FORMULA =
  '[(Sum of row 2 (Offsite Renewable Energy Consumed) & row 6 (Total Renewable Energy Consumed) from Table: Renewable Energy) / (Sum of row 14 (Total Energy Consumption) from Energy Consumption Details for reporting year)] × 100';

export type ManufacturingWeightedTotals = {
  overallEnergyReductionPercent: number;
  overallWaterReductionPercent: number;
  overallRenewablePercent: number;
};

function yearNumber(unit: Record<string, unknown>, key: string): number {
  const raw = unit[key];
  const n = typeof raw === 'number' ? raw : Number(String(raw ?? '').trim());
  return Number.isFinite(n) ? n : 0;
}

function readStoredBulkNumber(
  unit: Record<string, unknown>,
  camelKey: string,
  snakeKey: string,
): number | null {
  const raw = unit[camelKey] ?? unit[snakeKey];
  if (raw == null || raw === '') return null;
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  return Number.isFinite(n) ? n : null;
}

function specificRatio(numerator: number, denominator: number): number | null {
  if (!denominator || !Number.isFinite(numerator)) return null;
  return roundFixed(numerator / denominator, ENERGY_CONSUMPTION_RATIO_DECIMALS);
}

function electricToKcal(electric: number, unit: unknown): number {
  const normalized = String(unit ?? 'kWh')
    .trim()
    .toLowerCase();
  const kwh = normalized === 'mwh' ? electric * 1000 : electric;
  return kwh * 2750;
}

/** Row 14 — total energy (kCal), unrounded sum-friendly (matches admin/vendor tables). */
export function computeTotalEnergyRow14Kcal(
  unit: Record<string, unknown>,
  year: 1 | 2 | 3,
): number {
  let thermal = 0;
  for (const fuel of [1, 2, 3] as const) {
    thermal +=
      yearNumber(unit, `ecdThermalFuel${fuel}Year${year}`) *
      yearNumber(unit, `ecdCalorificFuel${fuel}Year${year}`);
  }
  const electric = yearNumber(unit, `ecdElectricYear${year}`);
  return thermal + electricToKcal(electric, unit.ecdElectricUnit);
}

/** Renewable table row 6 — onsite total renewable energy consumed (kCal). */
export function renewableOnsiteRow6Kcal(unit: Record<string, unknown>): number {
  const baseKwh =
    yearNumber(unit, 'reSolarPhotovoltaic') + yearNumber(unit, 'reWind');
  const others = yearNumber(unit, 'reOthers');
  const othersUnit = String(unit.reOthersUnit ?? 'kWh')
    .trim()
    .toLowerCase();
  const othersKwh = othersUnit === 'kcal' ? 0 : others;
  const othersKcal = othersUnit === 'kcal' ? others : 0;
  return (
    (baseKwh + othersKwh) * 2750 +
    yearNumber(unit, 'reBiomass') +
    yearNumber(unit, 'reSolarThermal') +
    othersKcal
  );
}

/** Renewable table row 2 — offsite renewable energy consumed (kCal). */
export function renewableOffsiteRow2Kcal(unit: Record<string, unknown>): number {
  return yearNumber(unit, 'offsiteRenewablePower') * 2750;
}

/** Row 16 — reduction in overall SEC (%), prefer persisted `calculateBulkSec`. */
export function energyConsumptionRow16Percent(
  unit: Record<string, unknown>,
): number {
  const stored = readStoredBulkNumber(unit, 'calculateBulkSec', 'calculate_bulk_sec');
  if (stored != null) return stored;

  const sec1 = specificRatio(
    computeTotalEnergyRow14Kcal(unit, 1),
    yearNumber(unit, 'ecdProductionYear1'),
  );
  const sec2 = specificRatio(
    computeTotalEnergyRow14Kcal(unit, 2),
    yearNumber(unit, 'ecdProductionYear2'),
  );
  const sec3 = specificRatio(
    computeTotalEnergyRow14Kcal(unit, 3),
    yearNumber(unit, 'ecdProductionYear3'),
  );

  return computeReductionWithFallbackPercent(sec1, sec2, sec3) ?? 0;
}

/** Row 4 — reduction in specific water consumption (%), prefer persisted `calculateBulkSwc`. */
export function waterConsumptionRow4Percent(
  unit: Record<string, unknown>,
): number {
  const stored = readStoredBulkNumber(unit, 'calculateBulkSwc', 'calculate_bulk_swc');
  if (stored != null) return stored;

  const sw1 = specificRatio(
    yearNumber(unit, 'wcdWaterYear1'),
    yearNumber(unit, 'wcdProductionYear1'),
  );
  const sw2 = specificRatio(
    yearNumber(unit, 'wcdWaterYear2'),
    yearNumber(unit, 'wcdProductionYear2'),
  );
  const sw3 = specificRatio(
    yearNumber(unit, 'wcdWaterYear3'),
    yearNumber(unit, 'wcdProductionYear3'),
  );

  return computeReductionWithFallbackPercent(sw1, sw2, sw3) ?? 0;
}

function weightedAverageRowByReportingProduction(
  units: Array<Record<string, unknown>>,
  rowPercent: (unit: Record<string, unknown>) => number,
  productionYearKey: 'ecdProductionYear3' | 'wcdProductionYear3',
): number {
  let weightedSum = 0;
  let weightTotal = 0;

  for (const unit of units) {
    const weight = yearNumber(unit, productionYearKey);
    if (weight <= 0) continue;
    weightedSum += rowPercent(unit) * weight;
    weightTotal += weight;
  }

  if (weightTotal <= 0) return 0;
  return roundFixed(weightedSum / weightTotal, ENERGY_CONSUMPTION_RATIO_DECIMALS);
}

/** URN-level manufacturing footer metrics (admin read model). */
export function buildManufacturingWeightedTotals(
  units: Array<Record<string, unknown>>,
): ManufacturingWeightedTotals {
  if (units.length === 0) {
    return {
      overallEnergyReductionPercent: 0,
      overallWaterReductionPercent: 0,
      overallRenewablePercent: 0,
    };
  }

  let sumRenewableKcal = 0;
  let sumTotalEnergyYear3 = 0;

  for (const unit of units) {
    sumRenewableKcal +=
      renewableOnsiteRow6Kcal(unit) + renewableOffsiteRow2Kcal(unit);
    sumTotalEnergyYear3 += computeTotalEnergyRow14Kcal(unit, 3);
  }

  return {
    overallEnergyReductionPercent: weightedAverageRowByReportingProduction(
      units,
      energyConsumptionRow16Percent,
      'ecdProductionYear3',
    ),
    overallWaterReductionPercent: weightedAverageRowByReportingProduction(
      units,
      waterConsumptionRow4Percent,
      'wcdProductionYear3',
    ),
    overallRenewablePercent:
      sumTotalEnergyYear3 > 0
        ? roundFixed(
            (sumRenewableKcal / sumTotalEnergyYear3) * 100,
            ENERGY_CONSUMPTION_RATIO_DECIMALS,
          )
        : 0,
  };
}
