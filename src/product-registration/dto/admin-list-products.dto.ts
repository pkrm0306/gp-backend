import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
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
  const arr = normalizeStringArray(value);
  if (!arr) return undefined;
  const valid = arr.filter((id) => /^[a-fA-F0-9]{24}$/.test(id));
  return valid.length > 0 ? valid : undefined;
}

export function normalizeOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const v = String(value).trim();
  return v === '' ? undefined : v;
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
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  categoryId?: string;

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
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  manufacturerId?: string;

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
    description: 'Created date start (ISO date string). Alias: fromDate',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Created date end (ISO date string). Alias: toDate',
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
    description: 'Filter by valid till year',
    example: 2026,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  validTillYear?: number;

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
      'Plant country Mongo `_id`. Use with `stateIds` / state multiselect (states from `GET /states?countryId=`).',
    example: '507f1f77bcf86cd799439010',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  countryId?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `countryId`.',
    example: '507f1f77bcf86cd799439010',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  country_id?: string;

  @ApiPropertyOptional({
    description: 'Plant state ID',
    example: '507f1f77bcf86cd799439013',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  stateId?: string;

  @ApiPropertyOptional({
    description:
      'Alias for `stateId` when value is a **24-char hex** Mongo ObjectId. Otherwise treated as a **state name** substring filter on plant `stateName` (see `state_name`).',
    example: '507f1f77bcf86cd799439013',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description:
      'Filter plants by **state name** (case-insensitive partial match on plant `stateName`). Takes precedence over non-ObjectId `state` as a name filter.',
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
    description: 'Snake_case alias of `sectorIds`.',
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
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  productId?: string;
}
