import { BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  hasPartialRawMaterialsProductRow,
  normalizeRawMaterialsProductRow,
  pickTrimmedString,
} from '../form-partial-field.util';
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
export function parseMultipartBoolean(value: unknown): boolean {
  if (value === undefined || value === null || value === '') {
    return false;
  }
  const normalized = String(value).trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

/** Re-export for rowIndex / totalRows on per-row hazardous product POSTs. */
export { parseMultipartNonNegativeInt } from '../../product-design/product-design-upload.util';

/**
 * Delete all product table rows for this URN before insert when:
 * - replaceTable=true, or rowIndex=0, or legacy single POST (no handshake fields).
 */
/** Product-table steps: hazardous products, formaldehyde, solvents products, etc. */
export function shouldReplaceRawMaterialsTableBeforeInsert(
  body: Record<string, unknown>,
): boolean {
  if (parseMultipartBoolean(body.replaceTable)) {
    return true;
  }
  const rowIndexRaw = body.rowIndex;
  if (rowIndexRaw !== undefined && rowIndexRaw !== null && rowIndexRaw !== '') {
    const rowIndex = Number(String(rowIndexRaw).trim());
    return Number.isFinite(rowIndex) && rowIndex === 0;
  }
  const hasHandshake =
    body.replaceTable !== undefined ||
    body.rowIndex !== undefined ||
    body.totalRows !== undefined;
  return !hasHandshake;
}

/** @deprecated Use shouldReplaceRawMaterialsTableBeforeInsert */
export const shouldReplaceHazardousProductsTableBeforeInsert =
  shouldReplaceRawMaterialsTableBeforeInsert;

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

/** Unit grid numeric fields used for row validation and response normalization. */
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

export const RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS = [
  'year',
  'unit1',
  'unit2',
  'yeardata1',
  'yeardata2',
  'yeardata3',
] as const;

export const RAW_MATERIALS_MANUFACTURING_UNIT_NUMERIC_KEYS = [
  'year',
  'yeardata1',
  'yeardata2',
  'yeardata3',
] as const;

export const RAW_MATERIALS_ADDITIVES_NUMERIC_KEYS = [
  'year',
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
] as const;

/** Coerce vendor numeric input when a fallback is required (e.g. computed totals). */
export function coerceRawMaterialsNumeric(
  value: unknown,
  fallback = 0,
): number {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Parse a unit-grid numeric field from vendor input.
 * Empty / omitted → null (unset). Explicit 0 is stored as 0.
 */
export function parseRawMaterialsUnitNumericInput(
  value: unknown,
): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function computeRawMaterialsYeardata3(
  yeardata1: number | null,
  yeardata2: number | null,
): number | null {
  if (yeardata1 === null || yeardata2 === null) {
    return null;
  }
  if (yeardata1 > 0) {
    return Math.round((yeardata2 / yeardata1) * 10000) / 100;
  }
  return 0;
}

export function mapRawMaterialsStandardGridUnitForSave(
  unit: Record<string, unknown>,
): {
  unitName: string;
  year: number | null;
  unit1: number | null;
  unit2: number | null;
  yeardata1: number | null;
  yeardata2: number | null;
  yeardata3: number | null;
} {
  const yeardata1 = parseRawMaterialsUnitNumericInput(unit.yeardata1);
  const yeardata2 = parseRawMaterialsUnitNumericInput(unit.yeardata2);
  return {
    unitName: String(unit.unitName ?? '').trim(),
    year: parseRawMaterialsUnitNumericInput(unit.year),
    unit1: parseRawMaterialsUnitNumericInput(unit.unit1),
    unit2: parseRawMaterialsUnitNumericInput(unit.unit2),
    yeardata1,
    yeardata2,
    yeardata3: computeRawMaterialsYeardata3(yeardata1, yeardata2),
  };
}

export function mapRawMaterialsManufacturingUnitForSave(
  unit: Record<string, unknown>,
): {
  unitName: string;
  year: number | null;
  yeardata1: number | null;
  yeardata2: number | null;
  yeardata3: number | null;
} {
  return {
    unitName: String(unit.unitName ?? '').trim(),
    year: parseRawMaterialsUnitNumericInput(unit.year),
    yeardata1: parseRawMaterialsUnitNumericInput(unit.yeardata1),
    yeardata2: parseRawMaterialsUnitNumericInput(unit.yeardata2),
    yeardata3: parseRawMaterialsUnitNumericInput(unit.yeardata3),
  };
}

export function mapRawMaterialsAdditivesUnitForSave(
  unit: Record<string, unknown>,
): {
  unitName: string;
  year: number | null;
  year1: number | null;
  year1a: number | null;
  year1b: number | null;
  year1c: number | null;
  year2: number | null;
  year2a: number | null;
  year2b: number | null;
  year2c: number | null;
  year3: number | null;
  year3a: number | null;
  year3b: number | null;
  year3c: number | null;
  psc: string;
  coc: string;
  percentcoc: string;
} {
  return {
    unitName: String(unit.unitName ?? '').trim(),
    year: parseRawMaterialsUnitNumericInput(unit.year),
    year1: parseRawMaterialsUnitNumericInput(unit.year1),
    year1a: parseRawMaterialsUnitNumericInput(unit.year1a),
    year1b: parseRawMaterialsUnitNumericInput(unit.year1b),
    year1c: parseRawMaterialsUnitNumericInput(unit.year1c),
    year2: parseRawMaterialsUnitNumericInput(unit.year2),
    year2a: parseRawMaterialsUnitNumericInput(unit.year2a),
    year2b: parseRawMaterialsUnitNumericInput(unit.year2b),
    year2c: parseRawMaterialsUnitNumericInput(unit.year2c),
    year3: parseRawMaterialsUnitNumericInput(unit.year3),
    year3a: parseRawMaterialsUnitNumericInput(unit.year3a),
    year3b: parseRawMaterialsUnitNumericInput(unit.year3b),
    year3c: parseRawMaterialsUnitNumericInput(unit.year3c),
    psc: String(unit.psc ?? '').trim(),
    coc: String(unit.coc ?? '').trim(),
    percentcoc: String(unit.percentcoc ?? '').trim(),
  };
}

/** Sum nullable operands; returns null when every operand is unset. */
export function sumNullableRawMaterialsNumerics(
  ...values: Array<number | null | undefined>
): number | null {
  if (values.every((value) => value === undefined || value === null)) {
    return null;
  }
  return values.reduce<number>(
    (sum, value) => sum + (value === null || value === undefined ? 0 : value),
    0,
  );
}

/** Serialize unit numerics: explicit 0 stays 0; unset/null fields return null. */
export function withRawMaterialsNumericFields<
  T extends Record<string, unknown>,
>(row: T, numericKeys: readonly string[]): T {
  const out = { ...row } as Record<string, unknown>;
  for (const key of numericKeys) {
    const value = out[key];
    if (value === undefined || value === null) {
      out[key] = null;
      continue;
    }
    const n = Number(value);
    if (Number.isFinite(n)) {
      out[key] = n;
    } else {
      out[key] = null;
    }
  }
  return out as T;
}

export function normalizeRawMaterialsStandardGridUnits<
  T extends Record<string, unknown>,
>(rows: T[] | null | undefined): T[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map((row) =>
    withRawMaterialsNumericFields(row, RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS),
  );
}

export function normalizeRawMaterialsManufacturingUnits<
  T extends Record<string, unknown>,
>(rows: T[] | null | undefined): T[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map((row) =>
    withRawMaterialsNumericFields(
      row,
      RAW_MATERIALS_MANUFACTURING_UNIT_NUMERIC_KEYS,
    ),
  );
}

export function normalizeRawMaterialsAdditivesUnits<
  T extends Record<string, unknown>,
>(rows: T[] | null | undefined): T[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map((row) =>
    withRawMaterialsNumericFields(row, RAW_MATERIALS_ADDITIVES_NUMERIC_KEYS),
  );
}

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
      return Number.isFinite(Number(trimmed));
    }
    return true;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value);
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

function hasAnyPartialRawMaterialsProductRow(
  rows?: Array<Record<string, unknown>>,
): boolean {
  if (!Array.isArray(rows)) {
    return false;
  }
  return rows.some((row) =>
    hasPartialRawMaterialsProductRow(
      normalizeRawMaterialsProductRow(
        row && typeof row === 'object' ? row : undefined,
      ),
    ),
  );
}

export const RAW_MATERIALS_SAVE_METADATA_BODY_KEYS = new Set([
  'urnNo',
  'urn_no',
  'vendorId',
  'vendor_id',
  'eoiNo',
  'eoi_no',
  'replaceTable',
  'rowIndex',
  'totalRows',
  'existingDocumentIds',
  'existing_document_ids',
  'prohibitedFlameSolventsFileName',
  'formaldehydeFileName',
  'recycledContentFileName',
  'regionalMaterialsFileName',
  'utilizationRmcFileName',
]);

/** Resolve vendor product-table rows from multipart/JSON body (many alias shapes). */
export function resolveRawMaterialsProductsPayload(
  body: Record<string, unknown>,
): Array<Record<string, unknown>> {
  const candidates: unknown[] = [
    body.products,
    body.productRows,
    body.product_rows,
    body.rows,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const rows = candidate.filter(
        (row) => row && typeof row === 'object',
      ) as Array<Record<string, unknown>>;
      if (rows.length > 0) {
        return rows;
      }
      continue;
    }
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      const parsed = parseMultipartJsonArray(candidate, 'products');
      if (parsed.length > 0) {
        return parsed as Array<Record<string, unknown>>;
      }
    }
  }

  if (
    body.product &&
    typeof body.product === 'object' &&
    !Array.isArray(body.product)
  ) {
    return [body.product as Record<string, unknown>];
  }

  if (hasPartialRawMaterialsProductRow(normalizeRawMaterialsProductRow(body))) {
    return [body];
  }

  return [];
}

export function hasAnyMeaningfulRawMaterialsSavePayload(
  body: Record<string, unknown>,
): boolean {
  if (hasAnyMeaningfulReduceEnvironmentalSavePayload(body)) {
    return true;
  }
  if (
    hasAnyPartialRawMaterialsProductRow(resolveRawMaterialsProductsPayload(body))
  ) {
    return true;
  }
  if (hasPartialRawMaterialsProductRow(normalizeRawMaterialsProductRow(body))) {
    return true;
  }
  return hasAnyMeaningfulBodyField(
    body,
    new Set([
      ...RAW_MATERIALS_SAVE_METADATA_BODY_KEYS,
      'products',
      'productRows',
      'product_rows',
      'rows',
      'product',
      'units',
      'mines',
    ]),
  );
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
  if (hasAnyPartialRawMaterialsProductRow(params.rows)) {
    return;
  }
  if (
    Array.isArray(params.rows) &&
    params.rows.some((row) => hasPartialReduceEnvironmentalRow(row))
  ) {
    return;
  }
  const body = params.body;
  if (
    body &&
    hasPartialRawMaterialsProductRow(normalizeRawMaterialsProductRow(body))
  ) {
    return;
  }
  if (body && hasAnyMeaningfulRawMaterialsSavePayload(body)) {
    return;
  }
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

export const RAW_MATERIALS_REDUCE_ENVIRONMENTAL_ROW_KEYS = [
  'location',
  'enhancementOfMinesLife',
  'topsoilConservation',
  'waterTableManagement',
  'restorationOfSpentMines',
  'greenBeltDevelopmentAndBioDiversity',
] as const;

/** Normalize reduce-environmental row keys (vendor may send `locations` plural). */
export function normalizeReduceEnvironmentalUnitRow(
  row: Record<string, unknown>,
): Record<string, string> {
  return {
    location: pickTrimmedString(row, [
      'location',
      'locations',
      'mineLocation',
      'mine_location',
    ]),
    enhancementOfMinesLife: pickTrimmedString(row, [
      'enhancementOfMinesLife',
      'enhancement_of_mines_life',
      'enhancementOfMineLife',
      'minesLifeEnhancement',
    ]),
    topsoilConservation: pickTrimmedString(row, [
      'topsoilConservation',
      'topsoil_conservation',
    ]),
    waterTableManagement: pickTrimmedString(row, [
      'waterTableManagement',
      'water_table_management',
    ]),
    restorationOfSpentMines: pickTrimmedString(row, [
      'restorationOfSpentMines',
      'restoration_of_spent_mines',
      'restorationOfSpentMine',
    ]),
    greenBeltDevelopmentAndBioDiversity: pickTrimmedString(row, [
      'greenBeltDevelopmentAndBioDiversity',
      'green_belt_development_and_bio_diversity',
      'greenBeltDevelopmentAndBiodiversity',
      'green_belt_development_and_biodiversity',
      'greenBeltDevelopment',
      'bioDiversity',
    ]),
  };
}

export function hasPartialReduceEnvironmentalRow(
  row: Record<string, unknown> | undefined,
): boolean {
  const normalized = normalizeReduceEnvironmentalUnitRow(
    row && typeof row === 'object' ? row : {},
  );
  return RAW_MATERIALS_REDUCE_ENVIRONMENTAL_ROW_KEYS.some(
    (key) => normalized[key].trim() !== '',
  );
}

export function legacyReduceEnvironmentalRowFromDto(
  dto: Record<string, unknown>,
): Record<string, string> {
  return normalizeReduceEnvironmentalUnitRow(dto);
}

/** True when client sent `units` or `mines` (including `[]` to clear all rows). */
export function hasExplicitReduceEnvironmentalArray(
  body: Record<string, unknown>,
): boolean {
  const unitsSent =
    body.units !== undefined && body.units !== null && body.units !== '';
  const minesSent =
    body.mines !== undefined && body.mines !== null && body.mines !== '';
  return unitsSent || minesSent;
}

export function resolveReduceEnvironmentalUnits(
  dto: Record<string, unknown>,
  rowKeys: string[],
): Array<Record<string, string>> {
  if (hasExplicitReduceEnvironmentalArray(dto)) {
    const unitsRaw = parseMultipartJsonArray(dto.units, 'units');
    const minesRaw = parseMultipartJsonArray(dto.mines, 'mines');
    const arraySource =
      dto.units !== undefined && dto.units !== null && dto.units !== ''
        ? unitsRaw
        : minesRaw;
    const fromArray = arraySource.map((row) =>
      normalizeReduceEnvironmentalUnitRow(
        row && typeof row === 'object' ? (row as Record<string, unknown>) : {},
      ),
    );
    const meaningfulFromArray = filterMeaningfulRows(
      fromArray,
      rowKeys,
    ) as Array<Record<string, string>>;
    if (meaningfulFromArray.length > 0) {
      return meaningfulFromArray;
    }
  }
  const legacy = legacyReduceEnvironmentalRowFromDto(dto);
  return filterMeaningfulRows([legacy], rowKeys) as Array<Record<string, string>>;
}

export function hasAnyMeaningfulReduceEnvironmentalSavePayload(
  body: Record<string, unknown>,
  rowKeys: readonly string[] = RAW_MATERIALS_REDUCE_ENVIRONMENTAL_ROW_KEYS,
): boolean {
  if (
    hasAnyTrimmedText(
      parseRawMaterialsFormString(body.reduceEnvironmentalFileName),
      parseRawMaterialsFormString(body.reduce_environmental_file_name),
    )
  ) {
    return true;
  }
  return resolveReduceEnvironmentalUnits(body, [...rowKeys]).length > 0;
}

export function applyRawMaterialsUtilizationRmcAliases<
  T extends Record<string, unknown>,
>(row: T): T {
  const out = { ...row } as Record<string, unknown>;
  for (const mat of ['Iron', 'Steel', 'Copper', 'Recycled', 'Aggregate']) {
    for (const yr of [1, 2, 3, 4]) {
      const canonical = `percentYear${yr}Subsititution${mat}`;
      const legacy = `percentYear${yr}Subsitution${mat}`;
      if (out[legacy] === undefined && out[canonical] !== undefined) {
        out[legacy] = out[canonical];
      }
    }
  }
  for (const yr of [1, 2, 3, 4]) {
    const canonical = `plantYear${yr}PercentSubstitution`;
    const legacy = `plantYear${yr}PercentSubsitution`;
    if (out[legacy] === undefined && out[canonical] !== undefined) {
      out[legacy] = out[canonical];
    }
  }
  return out as T;
}

const RAW_MATERIALS_UTILIZATION_RMC_META_KEYS = new Set([
  '_id',
  'rawMaterialsUtilizationRmcId',
  'urnNo',
  'vendorId',
  'createdDate',
  'updatedDate',
]);

export function normalizeRawMaterialsUtilizationRmcRow<
  T extends Record<string, unknown>,
>(row: T): T {
  const aliased = applyRawMaterialsUtilizationRmcAliases(row);
  const numericKeys = Object.keys(aliased).filter(
    (key) => !RAW_MATERIALS_UTILIZATION_RMC_META_KEYS.has(key),
  );
  return withRawMaterialsNumericFields(aliased, numericKeys);
}

export function normalizeRawMaterialsUtilizationRmcRows<
  T extends Record<string, unknown>,
>(rows: T[] | null | undefined): T[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map((row) => normalizeRawMaterialsUtilizationRmcRow(row));
}

export {
  rawMaterialsMultipartMemoryMulterOptions,
} from '../upload/multer-universal.config';

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
