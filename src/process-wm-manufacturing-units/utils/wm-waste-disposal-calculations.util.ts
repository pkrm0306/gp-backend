import {
  computeReductionWithFallbackPercent,
  computeSpecificConsumptionRatio,
  formatMultipledConsumptionValues,
  roundFixed,
} from '../../process-mp-manufacturing-units/utils/mp-energy-consumption-calculations.util';
import { normalizeWmManufacturingUnitNumericInputs } from './wm-manufacturing-unit-numeric-fields.util';

export function computeWmWasteDisposalDerivedFields(
  unit: Record<string, unknown>,
): {
  calculateBulkRshwdMultipled: string;
  calculateBulkRshwd: number | null;
  calculateBulkRsnhwdMultipled: string;
  calculateBulkRsnhwd: number | null;
  specificHazardousWasteDisposalYear1: number | null;
  specificHazardousWasteDisposalYear2: number | null;
  specificHazardousWasteDisposalYear3: number | null;
  reductionInSpecificHazardousWasteDisposalYear1: number | null;
  reductionInSpecificHazardousWasteDisposalYear2: number | null;
  reductionInSpecificHazardousWasteDisposalYear3: number | null;
  specificNonHazardousWasteDisposalYear1: number | null;
  specificNonHazardousWasteDisposalYear2: number | null;
  specificNonHazardousWasteDisposalYear3: number | null;
  reductionInSpecificNonHazardousWasteDisposalYear1: number | null;
  reductionInSpecificNonHazardousWasteDisposalYear2: number | null;
  reductionInSpecificNonHazardousWasteDisposalYear3: number | null;
} {
  const normalized = normalizeWmManufacturingUnitNumericInputs(unit);

  const shwdYear1 = computeSpecificConsumptionRatio(
    normalized.hazardousWasteQuantityYear1,
    normalized.hazardousWasteProductionYear1,
  );
  const shwdYear2 = computeSpecificConsumptionRatio(
    normalized.hazardousWasteQuantityYear2,
    normalized.hazardousWasteProductionYear2,
  );
  const shwdYear3 = computeSpecificConsumptionRatio(
    normalized.hazardousWasteQuantityYear3,
    normalized.hazardousWasteProductionYear3,
  );

  const snhwdYear1 = computeSpecificConsumptionRatio(
    normalized.nonHazardousWasteWaterYear1,
    normalized.nonHazardousWasteProductionYear1,
  );
  const snhwdYear2 = computeSpecificConsumptionRatio(
    normalized.nonHazardousWasteWaterYear2,
    normalized.nonHazardousWasteProductionYear2,
  );
  const snhwdYear3 = computeSpecificConsumptionRatio(
    normalized.nonHazardousWasteWaterYear3,
    normalized.nonHazardousWasteProductionYear3,
  );

  const rshwdReduction = computeReductionWithFallbackPercent(
    shwdYear1,
    shwdYear2,
    shwdYear3,
  );
  const rsnhwdReduction = computeReductionWithFallbackPercent(
    snhwdYear1,
    snhwdYear2,
    snhwdYear3,
  );

  const hazProd3 = normalized.hazardousWasteProductionYear3;
  const nonHazProd3 = normalized.nonHazardousWasteProductionYear3;

  return {
    calculateBulkRshwdMultipled: formatVendorWasteBulkMultipled(
      rshwdReduction,
      hazProd3,
      [shwdYear1, shwdYear2, shwdYear3],
    ),
    calculateBulkRshwd: rshwdReduction,
    calculateBulkRsnhwdMultipled: formatVendorWasteBulkMultipled(
      rsnhwdReduction,
      nonHazProd3,
      [snhwdYear1, snhwdYear2, snhwdYear3],
    ),
    calculateBulkRsnhwd: rsnhwdReduction,
    specificHazardousWasteDisposalYear1: shwdYear1,
    specificHazardousWasteDisposalYear2: shwdYear2,
    specificHazardousWasteDisposalYear3: shwdYear3,
    reductionInSpecificHazardousWasteDisposalYear1: rshwdReduction,
    reductionInSpecificHazardousWasteDisposalYear2: null,
    reductionInSpecificHazardousWasteDisposalYear3: null,
    specificNonHazardousWasteDisposalYear1: snhwdYear1,
    specificNonHazardousWasteDisposalYear2: snhwdYear2,
    specificNonHazardousWasteDisposalYear3: snhwdYear3,
    reductionInSpecificNonHazardousWasteDisposalYear1: rsnhwdReduction,
    reductionInSpecificNonHazardousWasteDisposalYear2: null,
    reductionInSpecificNonHazardousWasteDisposalYear3: null,
  };
}

function readPersistedBulkNumber(raw: unknown): number | null {
  if (raw == null || raw === '') return null;
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  return Number.isFinite(n) ? n : null;
}

function readPersistedBulkMultipled(raw: unknown): string | null {
  if (raw == null) return null;
  const value = String(raw).trim();
  return value ? value : null;
}

/** Vendor stores `bulkReduction × productionYear3` as a single number string. */
function formatVendorWasteBulkMultipled(
  reduction: number | null,
  productionYear3: unknown,
  specificYearCsvFallback: Array<number | null>,
): string {
  const prod = readPersistedBulkNumber(productionYear3);
  if (reduction !== null && prod !== null && prod > 0) {
    return String(roundFixed(reduction * prod, 4));
  }
  return formatMultipledConsumptionValues(specificYearCsvFallback);
}

export function enrichWmManufacturingUnitCalculations<
  T extends Record<string, unknown>,
>(unit: T): T {
  const derived = computeWmWasteDisposalDerivedFields(unit);
  const persistedRshwd = readPersistedBulkNumber(unit.calculateBulkRshwd);
  const persistedRsnhwd = readPersistedBulkNumber(unit.calculateBulkRsnhwd);
  const persistedRshwdMultipled = readPersistedBulkMultipled(
    unit.calculateBulkRshwdMultipled,
  );
  const persistedRsnhwdMultipled = readPersistedBulkMultipled(
    unit.calculateBulkRsnhwdMultipled,
  );

  return {
    ...unit,
    calculateBulkRshwdMultipled:
      persistedRshwdMultipled ?? derived.calculateBulkRshwdMultipled,
    calculateBulkRshwd: persistedRshwd ?? derived.calculateBulkRshwd,
    calculateBulkRsnhwdMultipled:
      persistedRsnhwdMultipled ?? derived.calculateBulkRsnhwdMultipled,
    calculateBulkRsnhwd: persistedRsnhwd ?? derived.calculateBulkRsnhwd,
    wasteDisposalDetails: {
      specificHazardousWasteDisposal: {
        year1: derived.specificHazardousWasteDisposalYear1,
        year2: derived.specificHazardousWasteDisposalYear2,
        year3: derived.specificHazardousWasteDisposalYear3,
      },
      reductionInSpecificHazardousWasteDisposal: {
        year1: derived.reductionInSpecificHazardousWasteDisposalYear1,
        year2: derived.reductionInSpecificHazardousWasteDisposalYear2,
        year3: derived.reductionInSpecificHazardousWasteDisposalYear3,
      },
      specificNonHazardousWasteDisposal: {
        year1: derived.specificNonHazardousWasteDisposalYear1,
        year2: derived.specificNonHazardousWasteDisposalYear2,
        year3: derived.specificNonHazardousWasteDisposalYear3,
      },
      reductionInSpecificNonHazardousWasteDisposal: {
        year1: derived.reductionInSpecificNonHazardousWasteDisposalYear1,
        year2: derived.reductionInSpecificNonHazardousWasteDisposalYear2,
        year3: derived.reductionInSpecificNonHazardousWasteDisposalYear3,
      },
    },
  };
}

export function pickPersistedWmCalculationFields(
  unit: Record<string, unknown>,
): Pick<
  Record<string, unknown>,
  | 'calculateBulkRshwd'
  | 'calculateBulkRshwdMultipled'
  | 'calculateBulkRsnhwd'
  | 'calculateBulkRsnhwdMultipled'
> {
  return {
    calculateBulkRshwd: unit.calculateBulkRshwd ?? null,
    calculateBulkRshwdMultipled: unit.calculateBulkRshwdMultipled ?? '',
    calculateBulkRsnhwd: unit.calculateBulkRsnhwd ?? null,
    calculateBulkRsnhwdMultipled: unit.calculateBulkRsnhwdMultipled ?? '',
  };
}
