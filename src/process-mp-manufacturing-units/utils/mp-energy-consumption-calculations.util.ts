export const ENERGY_CONSUMPTION_RATIO_DECIMALS = 2;

const ECD_NUMERIC_FIELDS = [
  'ecdProductionYear1',
  'ecdProductionYear2',
  'ecdProductionYear3',
  'ecdElectricYear1',
  'ecdElectricYear2',
  'ecdElectricYear3',
  'wcdProductionYear1',
  'wcdProductionYear2',
  'wcdProductionYear3',
  'wcdWaterYear1',
  'wcdWaterYear2',
  'wcdWaterYear3',
] as const;

export function roundFixed(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return NaN;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function toPositiveNumber(raw: unknown): number | null {
  if (raw === undefined || raw === null || raw === '') return null;
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

const THERMAL_FUEL_INDICES = [1, 2, 3] as const;
const THERMAL_YEAR_SUFFIXES = [1, 2, 3] as const;

/** Coerce string/number year columns before ratio math. */
export function normalizeMpManufacturingUnitEnergyInputs(
  unit: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...unit };
  for (const field of ECD_NUMERIC_FIELDS) {
    const raw = out[field];
    if (raw === undefined || raw === null || raw === '') continue;
    const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
    if (Number.isFinite(n)) {
      out[field] = n;
    }
  }
  for (const year of THERMAL_YEAR_SUFFIXES) {
    for (const fuel of THERMAL_FUEL_INDICES) {
      for (const prefix of ['ecdThermalFuel', 'ecdCalorificFuel'] as const) {
        const field = `${prefix}${fuel}Year${year}`;
        const raw = out[field];
        if (raw === undefined || raw === null || raw === '') continue;
        const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
        if (Number.isFinite(n)) {
          out[field] = n;
        }
      }
    }
  }
  return out;
}

/** Row 11 — sum(thermal fuel × calorific value) per year, rounded to 2 decimals. */
export function computeTotalThermalEnergyConsumptionForYear(
  unit: Record<string, unknown>,
  year: (typeof THERMAL_YEAR_SUFFIXES)[number],
): number | null {
  let total = 0;
  let hasAny = false;

  for (const fuel of THERMAL_FUEL_INDICES) {
    const thermal = toPositiveNumber(unit[`ecdThermalFuel${fuel}Year${year}`]);
    const calorific = toPositiveNumber(
      unit[`ecdCalorificFuel${fuel}Year${year}`],
    );
    if (thermal === null || calorific === null) continue;
    total += thermal * calorific;
    hasAny = true;
  }

  if (!hasAny) return null;
  return roundFixed(total, ENERGY_CONSUMPTION_RATIO_DECIMALS);
}

/** Specific consumption = numerator / denominator, rounded to 2 decimals (row 3). */
export function computeSpecificConsumptionRatio(
  numerator: unknown,
  denominator: unknown,
): number | null {
  const n = toPositiveNumber(numerator);
  const d = toPositiveNumber(denominator);
  if (n === null || d === null || d === 0) return null;
  return roundFixed(n / d, ENERGY_CONSUMPTION_RATIO_DECIMALS);
}

/**
 * Row 4 — reduction in specific consumption (%), shown in the first year column only.
 * Uses **rounded** row-3 values (year 1 vs year 3), not full-precision ratios.
 */
export function computeReductionInSpecificConsumptionPercent(
  firstYearRatio: number | null,
  lastYearRatio: number | null,
): number | null {
  if (
    firstYearRatio === null ||
    lastYearRatio === null ||
    firstYearRatio <= 0
  ) {
    return null;
  }
  return roundFixed(
    ((firstYearRatio - lastYearRatio) / firstYearRatio) * 100,
    ENERGY_CONSUMPTION_RATIO_DECIMALS,
  );
}

function electricConsumptionToKcal(
  electric: number,
  unit: unknown,
): number {
  const normalized = String(unit ?? 'kWh')
    .trim()
    .toLowerCase();
  const kwh = normalized === 'mwh' ? electric * 1000 : electric;
  return kwh * 2750;
}

/** Row 14 — total energy (electric kCal + thermal kCal) per year. */
export function computeTotalEnergyConsumptionForYear(
  unit: Record<string, unknown>,
  year: (typeof THERMAL_YEAR_SUFFIXES)[number],
): number | null {
  const thermal = computeTotalThermalEnergyConsumptionForYear(unit, year);
  const electric = toPositiveNumber(unit[`ecdElectricYear${year}`]);
  if (thermal === null && electric === null) {
    return null;
  }
  const electricKcal =
    electric === null
      ? 0
      : electricConsumptionToKcal(electric, unit.ecdElectricUnit);
  return roundFixed((thermal ?? 0) + electricKcal, ENERGY_CONSUMPTION_RATIO_DECIMALS);
}

/** Row 15 — overall specific energy consumption (kCal / production unit). */
export function computeOverallSpecificEnergyConsumptionForYear(
  unit: Record<string, unknown>,
  year: (typeof THERMAL_YEAR_SUFFIXES)[number],
): number | null {
  return computeSpecificConsumptionRatio(
    computeTotalEnergyConsumptionForYear(unit, year),
    unit[`ecdProductionYear${year}`],
  );
}

/** Vendor-aligned reduction: prefer base year 1, else year 2, vs reporting year. */
export function computeReductionWithFallbackPercent(
  baseYear1: number | null,
  baseYear2: number | null,
  reportingYear: number | null,
): number | null {
  if (baseYear1 !== null && baseYear1 > 0 && reportingYear !== null) {
    return computeReductionInSpecificConsumptionPercent(
      baseYear1,
      reportingYear,
    );
  }
  if (baseYear2 !== null && baseYear2 > 0 && reportingYear !== null) {
    return computeReductionInSpecificConsumptionPercent(
      baseYear2,
      reportingYear,
    );
  }
  return null;
}

export function formatMultipledConsumptionValues(
  values: Array<number | null>,
): string {
  return values
    .map((value) =>
      value === null ? '' : value.toFixed(ENERGY_CONSUMPTION_RATIO_DECIMALS),
    )
    .join(',');
}

export function parseMultipledConsumptionValues(
  raw: string | null | undefined,
): Array<number | null> {
  if (!raw || !String(raw).trim()) return [null, null, null];
  return String(raw)
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return null;
      const n = Number(trimmed);
      return Number.isFinite(n) ? n : null;
    });
}

export function computeEnergyConsumptionDerivedFields(
  unit: Record<string, unknown>,
): {
  calculateBulkTecMultipled: string;
  calculateBulkStecMultipled: string;
  calculateBulkStec: number | null;
  calculateBulkSecMultipled: string;
  calculateBulkSec: number | null;
  calculateBulkSwcMultipled: string;
  calculateBulkSwc: number | null;
  totalThermalEnergyConsumptionYear1: number | null;
  totalThermalEnergyConsumptionYear2: number | null;
  totalThermalEnergyConsumptionYear3: number | null;
  specificThermalEnergyConsumptionYear1: number | null;
  specificThermalEnergyConsumptionYear2: number | null;
  specificThermalEnergyConsumptionYear3: number | null;
  reductionInSpecificThermalEnergyConsumptionYear1: number | null;
  reductionInSpecificThermalEnergyConsumptionYear2: number | null;
  reductionInSpecificThermalEnergyConsumptionYear3: number | null;
  specificElectricalEnergyConsumptionYear1: number | null;
  specificElectricalEnergyConsumptionYear2: number | null;
  specificElectricalEnergyConsumptionYear3: number | null;
  reductionInSpecificElectricalEnergyConsumptionYear1: number | null;
  reductionInSpecificElectricalEnergyConsumptionYear2: number | null;
  reductionInSpecificElectricalEnergyConsumptionYear3: number | null;
  specificWaterConsumptionYear1: number | null;
  specificWaterConsumptionYear2: number | null;
  specificWaterConsumptionYear3: number | null;
  reductionInSpecificWaterConsumptionYear1: number | null;
  reductionInSpecificWaterConsumptionYear2: number | null;
  reductionInSpecificWaterConsumptionYear3: number | null;
} {
  const normalized = normalizeMpManufacturingUnitEnergyInputs(unit);

  const totalThermalYear1 = computeTotalThermalEnergyConsumptionForYear(
    normalized,
    1,
  );
  const totalThermalYear2 = computeTotalThermalEnergyConsumptionForYear(
    normalized,
    2,
  );
  const totalThermalYear3 = computeTotalThermalEnergyConsumptionForYear(
    normalized,
    3,
  );

  const stecYear1 = computeSpecificConsumptionRatio(
    totalThermalYear1,
    normalized.ecdProductionYear1,
  );
  const stecYear2 = computeSpecificConsumptionRatio(
    totalThermalYear2,
    normalized.ecdProductionYear2,
  );
  const stecYear3 = computeSpecificConsumptionRatio(
    totalThermalYear3,
    normalized.ecdProductionYear3,
  );

  const stecReduction = computeReductionInSpecificConsumptionPercent(
    stecYear1,
    stecYear3,
  );

  const secYear1 = computeSpecificConsumptionRatio(
    normalized.ecdElectricYear1,
    normalized.ecdProductionYear1,
  );
  const secYear2 = computeSpecificConsumptionRatio(
    normalized.ecdElectricYear2,
    normalized.ecdProductionYear2,
  );
  const secYear3 = computeSpecificConsumptionRatio(
    normalized.ecdElectricYear3,
    normalized.ecdProductionYear3,
  );

  const swcYear1 = computeSpecificConsumptionRatio(
    normalized.wcdWaterYear1,
    normalized.wcdProductionYear1,
  );
  const swcYear2 = computeSpecificConsumptionRatio(
    normalized.wcdWaterYear2,
    normalized.wcdProductionYear2,
  );
  const swcYear3 = computeSpecificConsumptionRatio(
    normalized.wcdWaterYear3,
    normalized.wcdProductionYear3,
  );

  const secReduction = computeReductionInSpecificConsumptionPercent(
    secYear1,
    secYear3,
  );
  const overallSecYear1 = computeOverallSpecificEnergyConsumptionForYear(
    normalized,
    1,
  );
  const overallSecYear2 = computeOverallSpecificEnergyConsumptionForYear(
    normalized,
    2,
  );
  const overallSecYear3 = computeOverallSpecificEnergyConsumptionForYear(
    normalized,
    3,
  );
  const overallSecReduction = computeReductionWithFallbackPercent(
    overallSecYear1,
    overallSecYear2,
    overallSecYear3,
  );
  const swcReduction = computeReductionWithFallbackPercent(
    swcYear1,
    swcYear2,
    swcYear3,
  );

  return {
    calculateBulkTecMultipled: formatMultipledConsumptionValues([
      totalThermalYear1,
      totalThermalYear2,
      totalThermalYear3,
    ]),
    calculateBulkStecMultipled: formatMultipledConsumptionValues([
      stecYear1,
      stecYear2,
      stecYear3,
    ]),
    calculateBulkStec: stecReduction,
    calculateBulkSecMultipled: formatMultipledConsumptionValues([
      overallSecYear1,
      overallSecYear2,
      overallSecYear3,
    ]),
    calculateBulkSec: overallSecReduction,
    calculateBulkSwcMultipled: formatMultipledConsumptionValues([
      swcYear1,
      swcYear2,
      swcYear3,
    ]),
    calculateBulkSwc: swcReduction,
    totalThermalEnergyConsumptionYear1: totalThermalYear1,
    totalThermalEnergyConsumptionYear2: totalThermalYear2,
    totalThermalEnergyConsumptionYear3: totalThermalYear3,
    specificThermalEnergyConsumptionYear1: stecYear1,
    specificThermalEnergyConsumptionYear2: stecYear2,
    specificThermalEnergyConsumptionYear3: stecYear3,
    reductionInSpecificThermalEnergyConsumptionYear1: stecReduction,
    reductionInSpecificThermalEnergyConsumptionYear2: null,
    reductionInSpecificThermalEnergyConsumptionYear3: null,
    specificElectricalEnergyConsumptionYear1: secYear1,
    specificElectricalEnergyConsumptionYear2: secYear2,
    specificElectricalEnergyConsumptionYear3: secYear3,
    reductionInSpecificElectricalEnergyConsumptionYear1: secReduction,
    reductionInSpecificElectricalEnergyConsumptionYear2: null,
    reductionInSpecificElectricalEnergyConsumptionYear3: null,
    specificWaterConsumptionYear1: swcYear1,
    specificWaterConsumptionYear2: swcYear2,
    specificWaterConsumptionYear3: swcYear3,
    reductionInSpecificWaterConsumptionYear1: swcReduction,
    reductionInSpecificWaterConsumptionYear2: null,
    reductionInSpecificWaterConsumptionYear3: null,
  };
}

/** Apply derived SEC/SWC fields on save and API responses. */
export function enrichMpManufacturingUnitCalculations<
  T extends Record<string, unknown>,
>(unit: T): T {
  const derived = computeEnergyConsumptionDerivedFields(unit);
  return {
    ...unit,
    calculateBulkTecMultipled: derived.calculateBulkTecMultipled,
    calculateBulkStecMultipled: derived.calculateBulkStecMultipled,
    calculateBulkStec: derived.calculateBulkStec,
    calculateBulkSecMultipled: derived.calculateBulkSecMultipled,
    calculateBulkSec: derived.calculateBulkSec,
    calculateBulkSwcMultipled: derived.calculateBulkSwcMultipled,
    calculateBulkSwc: derived.calculateBulkSwc,
    energyConsumptionDetails: {
      totalThermalEnergyConsumption: {
        year1: derived.totalThermalEnergyConsumptionYear1,
        year2: derived.totalThermalEnergyConsumptionYear2,
        year3: derived.totalThermalEnergyConsumptionYear3,
      },
      specificThermalEnergyConsumption: {
        year1: derived.specificThermalEnergyConsumptionYear1,
        year2: derived.specificThermalEnergyConsumptionYear2,
        year3: derived.specificThermalEnergyConsumptionYear3,
      },
      reductionInSpecificThermalEnergyConsumption: {
        year1: derived.reductionInSpecificThermalEnergyConsumptionYear1,
        year2: derived.reductionInSpecificThermalEnergyConsumptionYear2,
        year3: derived.reductionInSpecificThermalEnergyConsumptionYear3,
      },
      specificElectricalEnergyConsumption: {
        year1: derived.specificElectricalEnergyConsumptionYear1,
        year2: derived.specificElectricalEnergyConsumptionYear2,
        year3: derived.specificElectricalEnergyConsumptionYear3,
      },
      reductionInSpecificElectricalEnergyConsumption: {
        year1: derived.reductionInSpecificElectricalEnergyConsumptionYear1,
        year2: derived.reductionInSpecificElectricalEnergyConsumptionYear2,
        year3: derived.reductionInSpecificElectricalEnergyConsumptionYear3,
      },
      specificWaterConsumption: {
        year1: derived.specificWaterConsumptionYear1,
        year2: derived.specificWaterConsumptionYear2,
        year3: derived.specificWaterConsumptionYear3,
      },
      reductionInSpecificWaterConsumption: {
        year1: derived.reductionInSpecificWaterConsumptionYear1,
        year2: derived.reductionInSpecificWaterConsumptionYear2,
        year3: derived.reductionInSpecificWaterConsumptionYear3,
      },
    },
  };
}

export function pickPersistedEnergyCalculationFields(
  unit: Record<string, unknown>,
): Pick<
  Record<string, unknown>,
  | 'calculateBulkTecMultipled'
  | 'calculateBulkStec'
  | 'calculateBulkStecMultipled'
  | 'calculateBulkSec'
  | 'calculateBulkSecMultipled'
  | 'calculateBulkSwc'
  | 'calculateBulkSwcMultipled'
> {
  return {
    calculateBulkTecMultipled: unit.calculateBulkTecMultipled ?? '',
    calculateBulkStec: unit.calculateBulkStec ?? null,
    calculateBulkStecMultipled: unit.calculateBulkStecMultipled ?? '',
    calculateBulkSec: unit.calculateBulkSec ?? null,
    calculateBulkSecMultipled: unit.calculateBulkSecMultipled ?? '',
    calculateBulkSwc: unit.calculateBulkSwc ?? null,
    calculateBulkSwcMultipled: unit.calculateBulkSwcMultipled ?? '',
  };
}
