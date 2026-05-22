import { BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  assertSupportingDesignFileTypes,
  isAllowedSupportingDesignFile,
} from '../../product-design/product-design-upload.util';

export const RAW_MATERIALS_AT_LEAST_ONE_MESSAGE =
  'Please fill in at least one field in the form before continuing.';

/** Align with product-design / payments; vendor URNs exceed legacy 20-char DTO limits. */
export const RAW_MATERIALS_URN_MAX_LENGTH = 64;

export const RAW_MATERIALS_EOI_NO_MAX_LENGTH = 32;

/** Read a single string from multipart/form-data or JSON body fields. */
export function parseRawMaterialsFormString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return String(value[0]);
  }
  return String(value);
}

export function parseRequiredRawMaterialsUrn(body: Record<string, unknown>): string {
  const urnNo = parseRawMaterialsFormString(body.urnNo)?.trim() ?? '';
  if (!urnNo) {
    throw new BadRequestException('URN number is required');
  }
  if (urnNo.length > RAW_MATERIALS_URN_MAX_LENGTH) {
    throw new BadRequestException(
      `urnNo must be shorter than or equal to ${RAW_MATERIALS_URN_MAX_LENGTH} characters`,
    );
  }
  return urnNo;
}

export function isAllowedRawMaterialsDocument(file: Express.Multer.File): boolean {
  return isAllowedSupportingDesignFile(file);
}

export function assertRawMaterialsDocumentTypes(
  files: Express.Multer.File[],
): void {
  assertSupportingDesignFileTypes(files);
}

export function parseMultipartJsonArray(
  value: unknown,
  fieldLabel = 'units',
): unknown[] {
  if (value === undefined || value === null || value === '') {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        throw new BadRequestException(
          `Invalid ${fieldLabel} format. Expected JSON array.`,
        );
      }
      return parsed;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new BadRequestException(
        `Invalid ${fieldLabel} format. Expected JSON array.`,
      );
    }
  }
  throw new BadRequestException(
    `Invalid ${fieldLabel} format. Expected JSON array.`,
  );
}

/**
 * Unit numeric fields where 0 is treated as empty for "at least one field" checks.
 * Saving with year/yeardata = 0 is allowed; strict year > 0 is deferred (see assertUnitYearFieldsPositive).
 */
export const RAW_MATERIALS_UNIT_NUMERIC_KEYS = new Set([
  'year',
  'yeardata1',
  'yeardata2',
  'yeardata3',
  'unit1',
  'unit2',
  'year1',
  'year1a',
  'year1b',
  'year1c',
  'year2',
  'year2a',
  'year2b',
  'year2c',
  'year3',
  'year3a',
  'year3b',
  'year3c',
]);

export function isMeaningfulFieldValue(
  value: unknown,
  fieldKey?: string,
): boolean {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return false;
    }
    if (fieldKey && RAW_MATERIALS_UNIT_NUMERIC_KEYS.has(fieldKey)) {
      const n = Number(trimmed);
      return Number.isFinite(n) && n > 0;
    }
    return true;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return false;
    }
    if (fieldKey && RAW_MATERIALS_UNIT_NUMERIC_KEYS.has(fieldKey)) {
      return value > 0;
    }
    return value !== 0;
  }
  if (typeof value === 'boolean') {
    return true;
  }
  return false;
}

/**
 * Deferred: manufacturer / unit year and yeardata must be > 0 when provided.
 * Left commented so partial saves stay allowed until product re-enables the rule.
 */
export function assertUnitYearFieldsPositive(
  units: Array<Record<string, unknown>>,
): void {
  // for (const unit of units) {
  //   for (const key of ['year', 'yeardata1', 'yeardata2', 'yeardata3']) {
  //     if (
  //       unit[key] !== undefined &&
  //       unit[key] !== null &&
  //       unit[key] !== ''
  //     ) {
  //       const n = Number(unit[key]);
  //       if (Number.isFinite(n) && n <= 0) {
  //         throw new BadRequestException(
  //           `${key} must be greater than 0 for each unit`,
  //         );
  //       }
  //     }
  //   }
  // }
}

export function hasAnyMeaningfulRow(
  rows: Array<Record<string, unknown>> | undefined,
  keys?: string[],
): boolean {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }
  return rows.some((row) => {
    if (!row || typeof row !== 'object') {
      return false;
    }
    const fields = keys ?? Object.keys(row);
    return fields.some((key) => isMeaningfulFieldValue(row[key], key));
  });
}

export function filterMeaningfulRows<T extends Record<string, unknown>>(
  rows: T[] | undefined,
  keys: string[],
): T[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.filter((row) =>
    keys.some((key) => isMeaningfulFieldValue(row[key], key)),
  );
}

export function hasAnyTrimmedText(
  ...values: Array<string | undefined | null>
): boolean {
  return values.some((v) => String(v ?? '').trim() !== '');
}

export function assertAtLeastOneRawMaterialsField(params: {
  files?: Express.Multer.File[];
  textValues?: Array<string | undefined | null>;
  rows?: Array<Record<string, unknown>>;
  rowKeys?: string[];
  body?: Record<string, unknown>;
  bodyKeys?: string[];
  /** Saved documents on URN for this step (vendor counts as filled). */
  retainedDocumentCount?: number;
  /** Persisted table/text rows already on URN for this step. */
  persistedRecordCount?: number;
}): void {
  if ((params.retainedDocumentCount ?? 0) > 0) {
    return;
  }
  if ((params.persistedRecordCount ?? 0) > 0) {
    return;
  }
  const files = params.files ?? [];
  if (files.length > 0) {
    return;
  }
  if (hasAnyTrimmedText(...(params.textValues ?? []))) {
    return;
  }
  if (hasAnyMeaningfulRow(params.rows, params.rowKeys)) {
    return;
  }
  const body = params.body;
  const bodyKeys = params.bodyKeys ?? [];
  if (
    body &&
    bodyKeys.some((key) => isMeaningfulFieldValue(body[key], key))
  ) {
    return;
  }
  throw new BadRequestException(RAW_MATERIALS_AT_LEAST_ONE_MESSAGE);
}

/** Count persisted rows for a vendor URN (tables, product rows, text records). */
export async function countVendorUrnDocuments(
  model: Model<any>,
  urnNo: string,
  vendorId: string,
): Promise<number> {
  if (!Types.ObjectId.isValid(vendorId)) {
    return 0;
  }
  return model
    .countDocuments({
      urnNo: urnNo.trim(),
      vendorId: new Types.ObjectId(vendorId),
    })
    .exec();
}

export function pickUploadFile(
  uploadedFiles: Express.Multer.File[] | undefined,
  preferredFieldNames: string[],
): Express.Multer.File | undefined {
  if (!uploadedFiles?.length) {
    return undefined;
  }
  return (
    uploadedFiles.find((f) => preferredFieldNames.includes(f.fieldname)) ??
    uploadedFiles[0]
  );
}

/** Normalize reduce-environmental row keys (vendor may send `locations` plural). */
export function normalizeReduceEnvironmentalUnitRow(
  row: Record<string, unknown>,
): Record<string, string> {
  return {
    location:
      parseRawMaterialsFormString(row.location)?.trim() ??
      parseRawMaterialsFormString(row.locations)?.trim() ??
      '',
    enhancementOfMinesLife:
      parseRawMaterialsFormString(row.enhancementOfMinesLife)?.trim() ?? '',
    topsoilConservation:
      parseRawMaterialsFormString(row.topsoilConservation)?.trim() ?? '',
    waterTableManagement:
      parseRawMaterialsFormString(row.waterTableManagement)?.trim() ?? '',
    restorationOfSpentMines:
      parseRawMaterialsFormString(row.restorationOfSpentMines)?.trim() ?? '',
    greenBeltDevelopmentAndBioDiversity:
      parseRawMaterialsFormString(row.greenBeltDevelopmentAndBioDiversity)?.trim() ??
      '',
  };
}

export function legacyReduceEnvironmentalRowFromDto(
  dto: Record<string, unknown>,
): Record<string, string> {
  return normalizeReduceEnvironmentalUnitRow({
    location: dto.location,
    locations: dto.locations,
    enhancementOfMinesLife: dto.enhancementOfMinesLife,
    topsoilConservation: dto.topsoilConservation,
    waterTableManagement: dto.waterTableManagement,
    restorationOfSpentMines: dto.restorationOfSpentMines,
    greenBeltDevelopmentAndBioDiversity: dto.greenBeltDevelopmentAndBioDiversity,
  });
}

export function resolveReduceEnvironmentalUnits(
  dto: Record<string, unknown>,
  rowKeys: string[],
): Array<Record<string, string>> {
  const unitsRaw = parseMultipartJsonArray(dto.units, 'units');
  const minesRaw = parseMultipartJsonArray(dto.mines, 'mines');
  const arraySource = unitsRaw.length > 0 ? unitsRaw : minesRaw;
  const fromArray = arraySource.map((row) =>
    normalizeReduceEnvironmentalUnitRow(
      row && typeof row === 'object' ? (row as Record<string, unknown>) : {},
    ),
  );
  const meaningfulFromArray = filterMeaningfulRows(fromArray, rowKeys) as Array<
    Record<string, string>
  >;
  if (meaningfulFromArray.length > 0) {
    return meaningfulFromArray;
  }
  const legacy = legacyReduceEnvironmentalRowFromDto(dto);
  return filterMeaningfulRows([legacy], rowKeys) as Array<Record<string, string>>;
}

export function collectAllUploadFiles(
  uploadedFiles?: Express.Multer.File[],
): Express.Multer.File[] {
  if (!uploadedFiles?.length) {
    return [];
  }
  return uploadedFiles.filter(
    (f) =>
      f?.originalname ||
      (f?.size ?? 0) > 0 ||
      (f?.buffer?.length ?? 0) > 0,
  );
}

/** True when any non-metadata body field has a meaningful value (Step 15 grid). */
export function hasAnyMeaningfulBodyField(
  body: Record<string, unknown>,
  excludeKeys: Set<string> = new Set([
    'urnNo',
    'vendorId',
    'utilizationRmcFileName',
    'existingDocumentIds',
  ]),
): boolean {
  for (const [key, value] of Object.entries(body)) {
    if (excludeKeys.has(key)) {
      continue;
    }
    if (isMeaningfulFieldValue(value, key)) {
      return true;
    }
  }
  return false;
}
