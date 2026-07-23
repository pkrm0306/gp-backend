import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export function normalizeNumberArray(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const source = Array.isArray(value) ? value : String(value).split(',');
  const parsed = source
    .map((v) => Number(String(v).trim()))
    .filter((v) => Number.isFinite(v));
  return parsed.length > 0 ? parsed : undefined;
}

export function normalizeStringArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const source = Array.isArray(value) ? value : String(value).split(',');
  const parsed = source
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);
  return parsed.length > 0 ? parsed : undefined;
}

export function normalizeMongoIdArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const source = Array.isArray(value) ? value : String(value).split(',');
  const valid = source
    .map((entry) => normalizeOptionalMongoId(entry))
    .filter((id): id is string => Boolean(id));
  return valid.length > 0 ? valid : undefined;
}

export function normalizeOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const v = String(value).trim();
  return v === '' ? undefined : v;
}

/** Optional Mongo `_id` filter — empty/invalid/sentinel values become `undefined` (no 400). */
export function normalizeOptionalMongoId(value: unknown): string | undefined {
  const v = normalizeOptionalString(value);
  if (!v) {
    return undefined;
  }
  const lower = v.toLowerCase();
  if (
    lower === 'all' ||
    lower === 'null' ||
    lower === 'undefined' ||
    lower === 'none' ||
    lower === 'any'
  ) {
    return undefined;
  }
  return /^[a-fA-F0-9]{24}$/.test(v) ? v : undefined;
}

/** Certified valid-till filter: `YYYY-MM` (month + year only). */
export const ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN =
  /^\d{4}-(0[1-9]|1[0-2])$/;

export function normalizeAdminListValidTillMonthYearString(
  value: unknown,
): string | undefined {
  const v = normalizeOptionalString(value);
  if (!v) {
    return undefined;
  }
  const match = /^(\d{4}-(0[1-9]|1[0-2]))/.exec(v);
  return match ? match[1] : v;
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export class AdminListProductsDto {
  /**
   * UI-only fields some admin clients send; not used by the API.
   * Whitelisted so ValidationPipe `forbidNonWhitelisted` does not reject the body.
   * Clients may send camelCase or snake_case.
   */
  @Allow()
  urnStatusLabels?: unknown;

  @Allow()
  urn_status_labels?: unknown;

  /**
   * Numeric URN workflow filter (`products.urnStatus`).
   * Whitelisted with `@Allow()` so ValidationPipe `forbidNonWhitelisted` accepts deep-link bodies.
   * Service normalizes to number[] when present.
   */
  @Allow()
  urnStatuses?: unknown;

  @Allow()
  urnStatus?: unknown;

  @Allow()
  urn_status?: unknown;

  @ApiPropertyOptional({
    description:
      'EOI **productStatus** filter (same as `productStatus` / `product_status`). Values: **0** Pending, **1** Submitted, **2** Certified, **3** Rejected, **4** Expired (certified past validtill). ' +
      'Omitted or empty → server uses `[0, 1]` for admin list/export. This filters **per EOI row** on `products.productStatus`, not manufacturer/vendor status.',
    type: [Number],
    example: [0, 1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  status?: number[];

  @ApiPropertyOptional({
    description: 'Alias of `status` — EOI `productStatus` codes **0–4**.',
    type: [Number],
    example: [0, 1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  productStatus?: number[];

  @ApiPropertyOptional({
    description: 'Alias of `status` — EOI `product_status` / productStatus codes **0–4** (snake_case).',
    type: [Number],
    example: [0, 1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  product_status?: number[];

  @ApiPropertyOptional({
    description: 'Product type filter: 0=online, 1=offline',
    enum: [0, 1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  @IsIn([0, 1])
  product_type?: 0 | 1;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalMongoId(value))
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `categoryId` (single category filter).',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalMongoId(value))
  @IsMongoId()
  category_id?: string;

  @ApiPropertyOptional({
    description:
      'Multi-select category filter (Mongo category `_id` values). Takes precedence over `categoryId` when non-empty.',
    type: [String],
    example: ['507f1f77bcf86cd799439011'],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `categoryIds`.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  category_ids?: string[];

  @ApiPropertyOptional({
    description: 'Manufacturer ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalMongoId(value))
  @IsMongoId()
  manufacturerId?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `manufacturerId`.',
    example: '507f1f77bcf86cd799439012',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalMongoId(value))
  @IsMongoId()
  manufacturer_id?: string;

  @ApiPropertyOptional({
    description:
      'Multi-select manufacturer filter by Mongo `_id`. Takes precedence over `manufacturerId` when non-empty.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  manufacturerIds?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `manufacturerIds`.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  manufacturer_ids?: string[];

  @ApiPropertyOptional({
    description:
      'Multi-select Assigned Staff filter by team member Mongo `_id` (active SPOC allocation).',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  spocIds?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `spocIds`.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  spoc_ids?: string[];

  @ApiPropertyOptional({
    description: 'Alias of `spocIds` (Assigned Staff filter).',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  staffIds?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `staffIds`.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  staff_ids?: string[];

  @ApiPropertyOptional({
    description: 'Alias of `spocIds` (Assigned Staff filter).',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  assignedStaffIds?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `assignedStaffIds`.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  assigned_staff_ids?: string[];

  @ApiPropertyOptional({
    description:
      'Multi-select manufacturer filter by exact `manufacturerName` (use labels from filter-options).',
    type: [String],
    example: ['ABC Solar Pvt Ltd'],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeStringArray(value))
  @IsArray()
  @IsString({ each: true })
  manufacturerNames?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `manufacturerNames`.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeStringArray(value))
  @IsArray()
  @IsString({ each: true })
  manufacturer_names?: string[];

  @ApiPropertyOptional({
    description:
      'Date range start (ISO / YYYY-MM-DD). For most lists filters `createdDate`. ' +
      'For rejected-only lists (`status: [3]`) filters `rejectedAt` (fallback `updatedDate`) — same as Rejection Trend.',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    description:
      'Date range end (ISO / YYYY-MM-DD). For most lists filters `createdDate`. ' +
      'For rejected-only lists (`status: [3]`) filters `rejectedAt` (fallback `updatedDate`) — same as Rejection Trend.',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Alias for from',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Alias for to',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({
    description:
      'Certified date range start (ISO date / YYYY-MM-DD). Filters on `products.certifiedDate`.',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  certifiedFrom?: string;

  @ApiPropertyOptional({
    description:
      'Certified date range end (ISO date / YYYY-MM-DD). Filters on `products.certifiedDate` (inclusive end of day).',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsString()
  certifiedTo?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `certifiedFrom`.',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  certified_from?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `certifiedTo`.',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsString()
  certified_to?: string;

  @ApiPropertyOptional({
    description: 'Alias of `certifiedFrom`.',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  certifiedFromDate?: string;

  @ApiPropertyOptional({
    description: 'Alias of `certifiedTo`.',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsString()
  certifiedToDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by valid till year',
    example: 2026,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  validTillYear?: number;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `validTillYear`.',
    example: 2026,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  valid_till_year?: number;

  @ApiPropertyOptional({
    description:
      'Certified products: month (1–12) for valid-till filter. Pair with `validTillYear` when the UI uses separate month/year pickers.',
    example: 12,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  @Min(1)
  @Max(12)
  validTillMonth?: number;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `validTillMonth`.',
    example: 12,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  @Min(1)
  @Max(12)
  valid_till_month?: number;

  @ApiPropertyOptional({
    description:
      'Multi-select valid-till year filter. Takes precedence over `validTillYear` when non-empty.',
    type: [Number],
    example: [2024, 2025],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  validTillYears?: number[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `validTillYears`.',
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  valid_till_years?: number[];

  @ApiPropertyOptional({
    description:
      'Certified products: filter by **valid till month + year** (`YYYY-MM`). Use a month/year picker in the UI (no day).',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  validTillMonthYear?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `validTillMonthYear`.',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  valid_till_month_year?: string;

  @ApiPropertyOptional({
    description:
      'Alias of `validTillMonthYear` (legacy name; value must be `YYYY-MM`, not a full date).',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  validTillDate?: string;

  @ApiPropertyOptional({
    description: 'Alias of `validTillMonthYear`.',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  validTill?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `validTillMonthYear` (`valid_till`).',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  valid_till?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `validTillMonthYear` (`valid_till_date`).',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  valid_till_date?: string;

  @ApiPropertyOptional({
    description:
      'DB-style camelCase alias of `validTillMonthYear` (`validtillDate` — lowercase `t` in till).',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  validtillDate?: string;

  @ApiPropertyOptional({
    description: 'DB-style snake_case alias of `validTillMonthYear` (`validtill_date`).',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  validtill_date?: string;

  @ApiPropertyOptional({
    description:
      'Optional valid-till range start (inclusive, `YYYY-MM`). Use with `validTillTo` for a month/year range.',
    example: '2026-01',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  validTillFrom?: string;

  @ApiPropertyOptional({
    description:
      'Optional valid-till range end (inclusive, `YYYY-MM`). Use with `validTillFrom` for a month/year range.',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  validTillTo?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `validTillFrom`.',
    example: '2026-01',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  valid_till_from?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `validTillTo`.',
    example: '2026-12',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeAdminListValidTillMonthYearString(value))
  @Matches(ADMIN_LIST_VALID_TILL_MONTH_YEAR_PATTERN)
  valid_till_to?: string;

  @ApiPropertyOptional({
    description:
      'Plant country Mongo `_id`. Pair with free-text `state` / `city` filters on the list body.',
    example: '507f1f77bcf86cd799439010',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalMongoId(value))
  @IsMongoId()
  countryId?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `countryId`.',
    example: '507f1f77bcf86cd799439010',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalMongoId(value))
  @IsMongoId()
  country_id?: string;

  @ApiPropertyOptional({
    description: 'Plant state ID',
    example: '507f1f77bcf86cd799439013',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalMongoId(value))
  @IsMongoId()
  stateId?: string;

  @ApiPropertyOptional({
    description:
      'Plant **state name** (free text, case-insensitive partial match on any plant for the EOI). Use a text input in the UI, not a dropdown. `state_name` is a snake_case alias.',
    example: 'Telangana',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description:
      'Snake_case alias of `state` — free-text state name search (partial match).',
    example: 'Telangana',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  state_name?: string;

  @ApiPropertyOptional({
    description:
      'Multi-select plant state ids (Mongo). Use with `countryId`. Takes precedence over single `stateId` when non-empty.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  stateIds?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `stateIds`.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  state_ids?: string[];

  @ApiPropertyOptional({
    description:
      'Multi-select plant state names (exact match on resolved plant `stateName`, case-insensitive).',
    type: [String],
    example: ['Karnataka', 'Telangana'],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeStringArray(value))
  @IsArray()
  @IsString({ each: true })
  stateNames?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `stateNames`.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeStringArray(value))
  @IsArray()
  @IsString({ each: true })
  state_names?: string[];

  @ApiPropertyOptional({
    description:
      'Plant **city** (free text, case-insensitive partial match on any plant for the EOI). Use a text input in the UI, not a dropdown.',
    example: 'Mumbai',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `city` (free-text plant city filter).',
    example: 'Mumbai',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  city_name?: string;

  @ApiPropertyOptional({
    description:
      'Deprecated multi-select cities. Prefer single `city` text filter. Still supported for backward compatibility.',
    type: [String],
    example: ['Bengaluru', 'Mumbai'],
    deprecated: true,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeStringArray(value))
  @IsArray()
  @IsString({ each: true })
  cities?: string[];

  @ApiPropertyOptional({
    description:
      'Filter EOIs whose category `sector` id matches (`categories.sector`). Single value; use `sectorIds` / `sector_ids` for multiple.',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  sectorId?: number;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `sectorId`.',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  sector_id?: number;

  @ApiPropertyOptional({
    description:
      'Filter by multiple category sector ids (comma-separated or array). Takes precedence over `sectorId` / `sector_id` when non-empty.',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  sectorIds?: number[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `sectorIds` (Building / sector multiselect).',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  sector_ids?: number[];

  @ApiPropertyOptional({
    description:
      'UI alias of `sectorIds` — **Building** sector multiselect (numeric sector ids from `GET /api/sectors`).',
    type: [Number],
    example: [1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  buildingIds?: number[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `buildingIds`.',
    type: [Number],
    example: [1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  building_ids?: number[];

  @ApiPropertyOptional({
    description: 'UI alias of `buildingIds` / `sectorIds`.',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  buildings?: number[];

  @ApiPropertyOptional({
    description: 'Single Building / sector id (alias of `sectorId`).',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  buildingId?: number;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `buildingId`.',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  building_id?: number;

  @ApiPropertyOptional({
    description: 'Single Building / sector id (alias of `sectorId`).',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  building?: number;

  @ApiPropertyOptional({
    description:
      'Global search on eoiNo, urnNo, productName, manufacturerName, email, phone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Response grouping: manufacturer (default, paginates manufacturers) or urn (legacy flat URN groups)',
    enum: ['manufacturer', 'urn'],
    default: 'manufacturer',
  })
  @IsOptional()
  @IsIn(['manufacturer', 'urn'])
  groupBy?: 'manufacturer' | 'urn' = 'manufacturer';

  @ApiPropertyOptional({
    enum: [
      'createdDate',
      'createdAt',
      'validTill',
      'productName',
      'eoiNo',
      'urnNo',
      'manufacturerName',
    ],
    default: 'createdDate',
  })
  @IsOptional()
  @IsIn([
    'createdDate',
    'createdAt',
    'validTill',
    'productName',
    'eoiNo',
    'urnNo',
    'manufacturerName',
  ])
  sortBy?:
    | 'createdDate'
    | 'createdAt'
    | 'validTill'
    | 'productName'
    | 'eoiNo'
    | 'urnNo'
    | 'manufacturerName' = 'createdDate';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Alias for sortOrder',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description:
      'Public website only: when user picks a product from search suggestions, pass its MongoDB _id.',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalMongoId(value))
  @IsMongoId()
  productId?: string;
}
