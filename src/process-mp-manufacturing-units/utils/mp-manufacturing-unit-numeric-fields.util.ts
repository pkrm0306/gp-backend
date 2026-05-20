import { BadRequestException } from '@nestjs/common';

/** Numeric columns on process_mp_manufacturing_units (energy / water / renewable). */
export const MP_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS = [
  'ecdProductionYear1',
  'ecdProductionYear2',
  'ecdProductionYear3',
  'ecdElectricYear1',
  'ecdElectricYear2',
  'ecdElectricYear3',
  'ecdThermalFuel1Year1',
  'ecdThermalFuel1Year2',
  'ecdThermalFuel1Year3',
  'ecdThermalFuel2Year1',
  'ecdThermalFuel2Year2',
  'ecdThermalFuel2Year3',
  'ecdThermalFuel3Year1',
  'ecdThermalFuel3Year2',
  'ecdThermalFuel3Year3',
  'ecdCalorificFuel1Year1',
  'ecdCalorificFuel1Year2',
  'ecdCalorificFuel1Year3',
  'ecdCalorificFuel2Year1',
  'ecdCalorificFuel2Year2',
  'ecdCalorificFuel2Year3',
  'ecdCalorificFuel3Year1',
  'ecdCalorificFuel3Year2',
  'ecdCalorificFuel3Year3',
  'wcdProductionYear1',
  'wcdProductionYear2',
  'wcdProductionYear3',
  'wcdWaterYear1',
  'wcdWaterYear2',
  'wcdWaterYear3',
  'reSolarPhotovoltaic',
  'reWind',
  'reBiomass',
  'reSolarThermal',
  'reOthers',
  'offsiteRenewablePower',
  'calculateBulkSec',
  'calculateBulkSwc',
] as const;

const FIELD_LABELS: Partial<Record<string, string>> = {
  ecdProductionYear1: 'Production year 1',
  ecdProductionYear2: 'Production year 2',
  ecdProductionYear3: 'Production year 3',
  ecdElectricYear1: 'Electric energy year 1',
  ecdElectricYear2: 'Electric energy year 2',
  ecdElectricYear3: 'Electric energy year 3',
};

function labelForField(field: string): string {
  return (
    FIELD_LABELS[field] ??
    field.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
  );
}

/** Rejects negative numbers on energy-consumption table fields (vendor save). */
export function assertMpManufacturingUnitNonNegativeNumbers(
  payload: Record<string, unknown>,
): void {
  const fieldErrors: Record<string, string> = {};
  const issues: { field: string; message: string }[] = [];

  for (const field of MP_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS) {
    const raw = payload[field];
    if (raw === undefined || raw === null || raw === '') continue;
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n)) {
      const message = `${labelForField(field)} must be a valid number`;
      fieldErrors[field] = message;
      issues.push({ field, message });
      continue;
    }
    if (n < 0) {
      const message = `${labelForField(field)} cannot be negative`;
      fieldErrors[field] = message;
      issues.push({ field, message });
    }
  }

  if (issues.length > 0) {
    throw new BadRequestException({
      code: 'VALIDATION_ERROR',
      message:
        issues.length === 1
          ? issues[0].message
          : 'Values in the energy consumption table cannot be negative',
      fieldErrors,
      issues,
    });
  }
}
