import { BadRequestException } from '@nestjs/common';
import { parseOptionalDecimalNumber } from '../../common/utils/parse-optional-number.util';

/** Numeric columns on process_wm_manufacturing_units (waste tables). */
export const WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS = [
  'hazardousWasteProductionYear1',
  'hazardousWasteProductionYear2',
  'hazardousWasteProductionYear3',
  'hazardousWasteQuantityYear1',
  'hazardousWasteQuantityYear2',
  'hazardousWasteQuantityYear3',
  'nonHazardousWasteProductionYear1',
  'nonHazardousWasteProductionYear2',
  'nonHazardousWasteProductionYear3',
  'nonHazardousWasteWaterYear1',
  'nonHazardousWasteWaterYear2',
  'nonHazardousWasteWaterYear3',
] as const;

function labelForField(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());
}

export function normalizeWmManufacturingUnitNumericInputs(
  unit: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...unit };
  for (const field of WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS) {
    const parsed = parseOptionalDecimalNumber(out[field]);
    if (parsed !== undefined) {
      out[field] = parsed;
    }
  }
  return out;
}

/** Rejects negative numbers on waste-management table fields (vendor save). */
export function assertWmManufacturingUnitNonNegativeNumbers(
  payload: Record<string, unknown>,
): void {
  const fieldErrors: Record<string, string> = {};
  const issues: { field: string; message: string }[] = [];

  for (const field of WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS) {
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
          : 'Values in the waste management table cannot be negative',
      fieldErrors,
      issues,
    });
  }
}
