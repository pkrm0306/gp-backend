import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AnyBulkWriteOperation, Model, Types } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { Category, CategoryDocument } from './schemas/category.schema';
import {
  formatCategoryDisplayName,
  normalizeCategoryNameKey,
} from './category-name-normalize';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../product-registration/schemas/product-plant.schema';
import {
  CategoryIdCounter,
  CategoryIdCounterDocument,
  CATEGORY_ID_COUNTER_KEY,
} from './schemas/category-id-counter.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories-query.dto';
import { UpdateCategoryStatusDto } from './dto/update-category-status.dto';
import { UpdateCategoryMultipartDto } from './dto/update-category-multipart.dto';
import { RedisService } from '../common/redis/redis.service';
import { resolvePublicUploadUrl, uploadFile } from '../utils/upload-file.util';
import { matchWebsitePublicCertifiedProducts } from '../product-registration/constants/website-public-product.filter';

/** Listing row: Mongo lean doc plus computed image URL */
export type CategoryListItem = Record<string, unknown> & {
  category_image_url: string | null;
  categoryImageUrl?: string | null;
  category_product_count?: number;
  category_manufacturer_count?: number;
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function numericFromMax(value: unknown): number {
  if (value == null) return NaN;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toNumber?: () => number }).toNumber === 'function'
  ) {
    try {
      return (value as { toNumber: () => number }).toNumber();
    } catch {
      return NaN;
    }
  }
  const n = parseFloat(String(value));
  return Number.isFinite(n) ? n : NaN;
}

function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @InjectModel(CategoryIdCounter.name)
    private counterModel: Model<CategoryIdCounterDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private productPlantModel: Model<ProductPlantDocument>,
    private configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  private getCategoryListCacheTtlSeconds(): number {
    const ttl = parseInt(
      this.configService.get<string>('CATEGORY_LIST_CACHE_TTL_SECONDS') ||
        this.configService.get<string>('CACHE_TTL_SECONDS') ||
        '60',
      10,
    );
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
  }

  private buildCategoryListCacheKey(query: ListCategoriesQueryDto): string {
    const normalized = {
      sector: query.sector ?? null,
      sectors: String(query.sectors || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .sort()
        .join(','),
      status: query.status ?? null,
      raw_material: String(query.raw_material || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .sort()
        .join(','),
      sort: query.sort === 'desc' ? 'desc' : 'asc',
    };
    return this.redisService.buildKey('categories', 'list', JSON.stringify(normalized));
  }

  private async invalidateCategoryListCache(): Promise<void> {
    await this.redisService
      .deleteByPattern(this.redisService.buildKey('categories', 'list', '*'))
      .catch((error) => {
      this.logger.warn(
        `Failed to invalidate category list cache: ${(error as Error)?.message || 'unknown error'}`,
      );
    });
  }

  async onModuleInit(): Promise<void> {
    this.ensureCategoryUploadDirs();
    await this.backfillCategoryNameNormalized();
    await this.dedupeCategoryNameNormalized();
    await this.syncCategoryIdCounterFromCategories();
    const shouldSyncIndexes =
      String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
      'true';
    if (!shouldSyncIndexes) return;
    try {
      await this.categoryModel.syncIndexes();
    } catch (err) {
      console.error(
        '[categories] syncIndexes failed — duplicate normalized names or DB issue:',
        err,
      );
    }
  }

  /**
   * If legacy data contains duplicates for category_name_normalized, a UNIQUE index build will fail.
   * This step makes duplicates unique by appending "-<shortId>" to all but the newest document.
   */
  private async dedupeCategoryNameNormalized(): Promise<void> {
    const dupGroups = await this.categoryModel
      .aggregate([
        {
          $match: {
            category_name_normalized: { $exists: true, $nin: [null, ''] },
          },
        },
        {
          $group: {
            _id: '$category_name_normalized',
            ids: { $push: '$_id' },
            count: { $sum: 1 },
          },
        },
        { $match: { count: { $gt: 1 } } },
      ])
      .exec();

    if (!dupGroups?.length) return;

    const ops: AnyBulkWriteOperation<CategoryDocument>[] = [];

    for (const g of dupGroups) {
      const ids: Types.ObjectId[] = (g?.ids ?? []).filter(Boolean);
      if (ids.length < 2) continue;

      // Keep the newest as-is (highest _id), rewrite the rest.
      const sorted = [...ids].sort((a, b) => (String(a) < String(b) ? -1 : 1));
      const keep = sorted[sorted.length - 1];
      const rewrite = sorted.slice(0, -1);

      for (const id of rewrite) {
        const shortId = String(id).slice(-6);
        const base = String(g._id);
        const next = `${base}-${shortId}`;
        ops.push({
          updateOne: {
            filter: { _id: id },
            update: { $set: { category_name_normalized: next } },
          },
        });
      }

      // Ensure the kept doc still has the base (in case it was rewritten earlier).
      ops.push({
        updateOne: {
          filter: { _id: keep },
          update: { $set: { category_name_normalized: String(g._id) } },
        },
      });
    }

    if (ops.length > 0) {
      await this.categoryModel.bulkWrite(ops, { ordered: false });
    }
  }

  /** Ensures category_name_normalized exists for legacy rows before unique index sync */
  private async backfillCategoryNameNormalized(): Promise<void> {
    const cursor = this.categoryModel
      .find({
        $or: [
          { category_name_normalized: { $exists: false } },
          { category_name_normalized: null },
          { category_name_normalized: '' },
        ],
      })
      .select('_id category_name')
      .cursor();

    const ops: AnyBulkWriteOperation<CategoryDocument>[] = [];

    for await (const doc of cursor) {
      const display = formatCategoryDisplayName(
        String(doc.category_name ?? ''),
      );
      const key = normalizeCategoryNameKey(display);
      if (!key) continue;
      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { category_name_normalized: key } },
        },
      });
    }

    if (ops.length > 0) {
      await this.categoryModel.bulkWrite(ops, { ordered: false });
    }
  }

  private rethrowIfDuplicateCategoryName(err: unknown): void {
    if (
      err instanceof MongoServerError &&
      (err as MongoServerError).code === 11000
    ) {
      const pattern = (err as MongoServerError).keyPattern as
        | Record<string, unknown>
        | undefined;
      if (
        pattern &&
        Object.prototype.hasOwnProperty.call(
          pattern,
          'category_name_normalized',
        )
      ) {
        throw new ConflictException('A category with this name already exists');
      }
    }
  }

  private async assertCategoryNameUnique(
    normalized: string,
    excludeId?: Types.ObjectId,
  ): Promise<void> {
    const filter: Record<string, unknown> = {
      category_name_normalized: normalized,
    };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const existing = await this.categoryModel
      .findOne(filter)
      .select('_id')
      .lean()
      .exec();
    if (existing) {
      throw new ConflictException('A category with this name already exists');
    }
  }

  /** Ensures project/uploads/categories exists (matches main.ts /uploads static mount) */
  ensureCategoryUploadDirs(): void {
    const dir = join(process.cwd(), 'uploads', 'categories');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  /** Public base for absolute image URLs (set API_BASE_URL in production). */
  private getApiBaseUrl(): string {
    const fromEnv = this.configService.get<string>('API_BASE_URL')?.trim();
    if (fromEnv) return fromEnv.replace(/\/$/, '');
    const port =
      this.configService.get<string>('PORT') || process.env.PORT || '3000';
    return `http://localhost:${port}`;
  }

  /**
   * Full URL for category_image served under /uploads/ (see main.ts express.static mount).
   * If category_image is already an http(s) URL, returns it unchanged.
   * The file must exist on disk under project/uploads/ or the browser will get 404.
   */
  resolveCategoryImageUrl(
    categoryImage: string | undefined | null,
  ): string | null {
    return resolvePublicUploadUrl(categoryImage, this.getApiBaseUrl());
  }

  private buildFindFilter(
    query: ListCategoriesQueryDto,
    options?: { enableMultiSector?: boolean },
  ): Record<string, unknown> {
    const filter: Record<string, unknown> = {};
    const enableMultiSector = options?.enableMultiSector ?? false;

    if (enableMultiSector) {
      const sectors = (query.sectors ?? '')
        .split(',')
        .map((v) => parseInt(v.trim(), 10))
        .filter((n) => Number.isFinite(n) && n > 0);
      if (sectors.length > 0) {
        filter.sector = { $in: sectors };
      } else if (query.sector !== undefined && query.sector !== null) {
        filter.sector = query.sector;
      }
    } else if (query.sector !== undefined && query.sector !== null) {
      filter.sector = query.sector;
    }
    if (query.status !== undefined && query.status !== null) {
      filter.category_status = query.status;
    }

    const rawMaterialTokens = (query.raw_material ?? '')
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    if (rawMaterialTokens.length > 0) {
      filter.$or = rawMaterialTokens.map((token) => ({
        category_raw_material_forms: {
          $regex: new RegExp(`(^|,)\\s*${escapeRegex(token)}\\s*(,|$)`),
        },
      }));
    }
    return filter;
  }

  async findAll(query: ListCategoriesQueryDto): Promise<CategoryListItem[]> {
    const cacheKey = this.buildCategoryListCacheKey(query);
    try {
      const cached = await this.redisService.get<CategoryListItem[]>(cacheKey);
      if (Array.isArray(cached)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Category list cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const filter = this.buildFindFilter(query, { enableMultiSector: true });
    const sortOrder = query.sort === 'desc' ? -1 : 1;
    const rows = await this.categoryModel
      .find(filter)
      .sort({ category_name: sortOrder })
      .lean()
      .exec();
    const out: CategoryListItem[] = [];
    for (const doc of rows) {
      out.push({
        ...(doc as Record<string, unknown>),
        category_image_url: this.resolveCategoryImageUrl(doc.category_image),
      });
    }
    this.redisService
      .set(cacheKey, out, this.getCategoryListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Category list cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return out;
  }

  private async countWebsitePublicProductsAndManufacturersByCategory(
    categoryIds: Types.ObjectId[],
  ): Promise<
    Map<
      string,
      {
        category_product_count: number;
        category_manufacturer_count: number;
      }
    >
  > {
    if (!categoryIds.length) {
      return new Map();
    }

    const rows = await this.productModel
      .aggregate<{
        _id: Types.ObjectId;
        category_product_count: number;
        category_manufacturer_count: number;
      }>([
        {
          $match: matchWebsitePublicCertifiedProducts({
            categoryId: { $in: categoryIds },
          }),
        },
        {
          $group: {
            _id: '$categoryId',
            category_product_count: { $sum: 1 },
            manufacturerIds: { $addToSet: '$manufacturerId' },
          },
        },
        {
          $project: {
            category_product_count: 1,
            category_manufacturer_count: { $size: '$manufacturerIds' },
          },
        },
      ])
      .exec();

    const out = new Map<
      string,
      {
        category_product_count: number;
        category_manufacturer_count: number;
      }
    >();
    for (const row of rows) {
      out.set(String(row._id), {
        category_product_count: row.category_product_count,
        category_manufacturer_count: row.category_manufacturer_count,
      });
    }
    return out;
  }

  /**
   * Public website categories listing: only categories with at least one certified,
   * non–soft-deleted product (same scope as the website product grid).
   */
  async findAllForWebsitePublic(
    query: ListCategoriesQueryDto,
  ): Promise<CategoryListItem[]> {
    const cacheKey = this.redisService.buildKey(
      'categories',
      'list',
      'website-public-certified-products-v3',
      JSON.stringify({
        sector: query.sector ?? null,
        sectors: String(query.sectors || '')
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
          .sort()
          .join(','),
        status: query.status ?? null,
        raw_material: String(query.raw_material || '')
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
          .sort()
          .join(','),
        sort: query.sort === 'desc' ? 'desc' : 'asc',
      }),
    );
    try {
      const cached = await this.redisService.get<CategoryListItem[]>(cacheKey);
      if (Array.isArray(cached)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Website public category list cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const categoryIds = await this.productModel
      .distinct('categoryId', matchWebsitePublicCertifiedProducts())
      .exec();
    if (!categoryIds.length) {
      return [];
    }

    const filter = this.buildFindFilter(query, { enableMultiSector: true });
    filter._id = { $in: categoryIds };
    if (query.status === undefined || query.status === null) {
      filter.category_status = 1;
    }

    const sortOrder = query.sort === 'desc' ? -1 : 1;
    const rows = await this.categoryModel
      .find(filter)
      .sort({ category_name: sortOrder })
      .lean()
      .exec();

    const categoryObjectIds = rows.map((doc) => doc._id as Types.ObjectId);
    const countsByCategoryId =
      await this.countWebsitePublicProductsAndManufacturersByCategory(
        categoryObjectIds,
      );

    const out: CategoryListItem[] = rows.map((doc) => {
      const counts = countsByCategoryId.get(String(doc._id)) ?? {
        category_product_count: 0,
        category_manufacturer_count: 0,
      };
      const category_image_url = this.resolveCategoryImageUrl(doc.category_image);
      return {
        ...(doc as Record<string, unknown>),
        category_image: category_image_url ?? doc.category_image ?? null,
        category_image_url,
        categoryImageUrl: category_image_url,
        ...counts,
      };
    });

    this.redisService
      .set(cacheKey, out, this.getCategoryListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website public category list cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });

    return out;
  }

  async buildCsvExport(query: ListCategoriesQueryDto): Promise<string> {
    const filter = this.buildFindFilter(query);
    const sortOrder = query.sort === 'desc' ? -1 : 1;
    const rows = await this.categoryModel
      .find(filter)
      .sort({ category_name: sortOrder })
      .lean()
      .exec();

    const header = [
      'category_id',
      'category_name',
      'category_image',
      'category_image_url',
      'category_raw_material_forms',
      'category_status',
      'sector',
      'created_date',
      'updated_date',
    ];

    const lines = [
      header.join(','),
      ...rows.map((r) =>
        [
          r.category_id,
          r.category_name,
          r.category_image ?? '',
          this.resolveCategoryImageUrl(r.category_image) ?? '',
          r.category_raw_material_forms ?? '',
          r.category_status,
          r.sector,
          r.created_date ?? '',
          r.updated_date ?? '',
        ]
          .map(csvEscape)
          .join(','),
      ),
    ];

    return lines.join('\r\n');
  }

  /** Max numeric category_id in categories (legacy string/int/long values). */
  private async getMaxCategoryIdFromCollection(): Promise<number> {
    const agg = await this.categoryModel
      .aggregate([
        { $match: { category_id: { $exists: true, $ne: null } } },
        {
          $addFields: {
            _n: {
              $convert: {
                input: '$category_id',
                to: 'double',
                onError: null,
                onNull: null,
              },
            },
          },
        },
        { $match: { _n: { $gt: 0 } } },
        { $group: { _id: null, maxId: { $max: '$_n' } } },
      ])
      .exec();
    const max = numericFromMax(agg[0]?.maxId as unknown);
    return Number.isFinite(max) && max > 0 ? Math.floor(max) : 0;
  }

  /** Ensure counter seq is at least max(existing category_id) so the next $inc is unique. */
  private async syncCategoryIdCounterFromCategories(): Promise<void> {
    const maxFromDocs = await this.getMaxCategoryIdFromCollection();
    const existing = await this.counterModel
      .findOne({ _id: CATEGORY_ID_COUNTER_KEY })
      .lean()
      .exec();
    const currentSeq = existing?.seq ?? 0;
    const seed = Math.max(currentSeq, maxFromDocs);
    await this.counterModel
      .updateOne(
        { _id: CATEGORY_ID_COUNTER_KEY },
        { $set: { seq: seed } },
        { upsert: true },
      )
      .exec();
  }

  /** Atomic next id — never derived from the request body */
  private async nextCategoryIdFromCounter(): Promise<number> {
    const doc = await this.counterModel
      .findOneAndUpdate(
        { _id: CATEGORY_ID_COUNTER_KEY },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      )
      .exec();
    if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
      throw new Error('Failed to allocate category_id');
    }
    return doc.seq;
  }

  private formatCreatedDate(): string {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }

  private formatUpdatedDate(): string {
    const d = new Date();
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  async create(dto: CreateCategoryDto) {
    const displayName = formatCategoryDisplayName(dto.category_name);
    if (!displayName) {
      throw new BadRequestException('Category name is required');
    }
    const category_name_normalized = normalizeCategoryNameKey(displayName);
    await this.assertCategoryNameUnique(category_name_normalized);

    const created_date = this.formatCreatedDate();
    const updated_date = this.formatUpdatedDate();

    const category_id = await this.nextCategoryIdFromCounter();

    let doc: CategoryDocument;
    try {
      doc = await this.categoryModel.create({
        category_name: displayName,
        category_name_normalized,
        category_image: dto.category_image,
        category_raw_material_forms: dto.category_raw_material_forms,
        category_status: dto.category_status ?? 1,
        sector: dto.sector ?? 1,
        created_date,
        updated_date,
        category_id,
      });
    } catch (err) {
      this.rethrowIfDuplicateCategoryName(err);
      throw err;
    }
    const plain = doc.toObject();
    await this.invalidateCategoryListCache();
    return {
      ...plain,
      category_image_url: this.resolveCategoryImageUrl(plain.category_image),
    };
  }

  private parseCategoryObjectId(id: string): Types.ObjectId {
    const trimmed = id?.trim();
    if (!trimmed || !Types.ObjectId.isValid(trimmed)) {
      throw new BadRequestException('Invalid category id');
    }
    return new Types.ObjectId(trimmed);
  }

  private toCategoryResponse(plain: Record<string, unknown>) {
    return {
      ...plain,
      category_image_url: this.resolveCategoryImageUrl(
        plain.category_image as string | undefined,
      ),
    };
  }

  async updateStatus(id: string, dto: UpdateCategoryStatusDto) {
    const oid = this.parseCategoryObjectId(id);
    const updated = await this.categoryModel
      .findOneAndUpdate(
        { _id: oid },
        {
          $set: {
            category_status: dto.category_status,
            updated_date: this.formatUpdatedDate(),
          },
        },
        { new: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    await this.invalidateCategoryListCache();
    return this.toCategoryResponse(
      updated.toObject() as unknown as Record<string, unknown>,
    );
  }

  async update(
    id: string,
    dto: UpdateCategoryMultipartDto,
    image?: Express.Multer.File,
  ) {
    const oid = this.parseCategoryObjectId(id);
    const existing = await this.categoryModel.findById(oid).exec();
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    const hasFieldUpdate =
      (dto.category_name !== undefined &&
        String(dto.category_name).trim() !== '') ||
      dto.category_raw_material_forms !== undefined ||
      dto.category_status !== undefined ||
      dto.sector !== undefined ||
      !!image;

    if (!hasFieldUpdate) {
      throw new BadRequestException('No fields to update');
    }

    const set: Record<string, unknown> = {
      updated_date: this.formatUpdatedDate(),
    };

    if (
      dto.category_name !== undefined &&
      String(dto.category_name).trim() !== ''
    ) {
      const displayName = formatCategoryDisplayName(dto.category_name);
      if (!displayName) {
        throw new BadRequestException('Category name cannot be empty');
      }
      const category_name_normalized = normalizeCategoryNameKey(displayName);
      await this.assertCategoryNameUnique(category_name_normalized, oid);
      set.category_name = displayName;
      set.category_name_normalized = category_name_normalized;
    }
    if (dto.category_raw_material_forms !== undefined) {
      set.category_raw_material_forms = dto.category_raw_material_forms;
    }
    if (dto.category_status !== undefined) {
      set.category_status = dto.category_status;
    }
    if (dto.sector !== undefined) {
      set.sector = dto.sector;
    }
    if (image) {
      const uploaded = await uploadFile(image, 'categories');
      set.category_image = uploaded.fileUrl;
    }

    let updated: CategoryDocument | null;
    try {
      updated = await this.categoryModel
        .findOneAndUpdate({ _id: oid }, { $set: set }, { new: true })
        .exec();
    } catch (err) {
      this.rethrowIfDuplicateCategoryName(err);
      throw err;
    }
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    await this.invalidateCategoryListCache();
    return this.toCategoryResponse(
      updated.toObject() as unknown as Record<string, unknown>,
    );
  }

  async remove(id: string) {
    const oid = this.parseCategoryObjectId(id);
    const existing = await this.categoryModel.findById(oid).exec();
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    const [productCount, plantCount] = await Promise.all([
      this.productModel.countDocuments({ categoryId: oid }).exec(),
      this.productPlantModel.countDocuments({ categoryId: oid }).exec(),
    ]);
    if (productCount > 0 || plantCount > 0) {
      throw new ConflictException(
        'Products exist under this category; remove or reassign them before deleting.',
      );
    }

    await this.categoryModel.deleteOne({ _id: oid }).exec();
    await this.invalidateCategoryListCache();
  }

  /**
   * Resolve `category_name` for numeric ids returned by GET /categories (`category_id`).
   */
  async getCategoryNamesByNumericIds(
    categoryIds: Array<number | undefined | null>,
  ): Promise<Map<number, string>> {
    const unique = [
      ...new Set(
        categoryIds.filter(
          (x): x is number =>
            typeof x === 'number' && Number.isInteger(x) && x >= 1,
        ),
      ),
    ];
    if (!unique.length) {
      return new Map();
    }
    const rows = await this.categoryModel
      .find({ category_id: { $in: unique } })
      .select('category_id category_name')
      .lean()
      .exec();
    return new Map(
      rows.map((r) => [r.category_id as number, r.category_name as string]),
    );
  }

  /**
   * Numeric `category_id` values for categories in a sector (GET /categories `sector` field).
   * Sorted ascending by `category_id`.
   */
  async listNumericCategoryIdsBySector(sectorId: number): Promise<number[]> {
    if (!Number.isInteger(sectorId) || sectorId < 1) {
      return [];
    }
    const rows = await this.categoryModel
      .find({ sector: sectorId })
      .select('category_id')
      .sort({ category_id: 1 })
      .lean()
      .exec();
    return rows
      .map((r) => r.category_id as number)
      .filter(
        (x): x is number =>
          typeof x === 'number' && Number.isInteger(x) && x >= 1,
      );
  }

  /** Maps numeric `category_id` → sector id from the categories collection. */
  async getCategorySectorsByNumericIds(
    categoryIds: Array<number | undefined | null>,
  ): Promise<Map<number, number>> {
    const unique = [
      ...new Set(
        categoryIds.filter(
          (x): x is number =>
            typeof x === 'number' && Number.isInteger(x) && x >= 1,
        ),
      ),
    ];
    if (!unique.length) {
      return new Map();
    }
    const rows = await this.categoryModel
      .find({ category_id: { $in: unique } })
      .select('category_id sector')
      .lean()
      .exec();
    const m = new Map<number, number>();
    for (const r of rows) {
      const cid = r.category_id as number;
      const sec =
        typeof r.sector === 'number' && Number.isFinite(r.sector)
          ? Math.floor(r.sector)
          : 1;
      m.set(cid, sec);
    }
    return m;
  }

  /**
   * For standards filters: numeric `category_id` from GET /categories, or MongoDB category `_id`
   * (24-char hex) when the client uses document ids in URLs.
   */
  async resolveNumericCategoryKey(param: string): Promise<number> {
    const trimmed = String(param ?? '').trim();
    if (!trimmed) {
      throw new BadRequestException('Invalid category id');
    }
    if (Types.ObjectId.isValid(trimmed)) {
      const doc = await this.categoryModel
        .findById(new Types.ObjectId(trimmed))
        .select('category_id')
        .lean()
        .exec();
      if (
        !doc ||
        typeof doc.category_id !== 'number' ||
        !Number.isInteger(doc.category_id) ||
        doc.category_id < 1
      ) {
        throw new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Unknown category_id',
        });
      }
      return doc.category_id;
    }
    const n = parseInt(trimmed, 10);
    if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) {
      throw new BadRequestException('Invalid category id');
    }
    await this.assertNumericCategoryExists(n);
    return n;
  }

  /** Ensures a row exists with this numeric `category_id` (categories collection). */
  async assertNumericCategoryExists(categoryId: number): Promise<void> {
    const ok = await this.categoryModel.exists({ category_id: categoryId });
    if (!ok) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Unknown category_id',
        category_id: categoryId,
      });
    }
  }

  /** Ensures every numeric `category_id` exists (batch). */
  async assertNumericCategoriesExist(categoryIds: number[]): Promise<void> {
    const unique = [
      ...new Set(
        categoryIds.filter(
          (x): x is number =>
            typeof x === 'number' && Number.isInteger(x) && x >= 1,
        ),
      ),
    ];
    if (unique.length === 0) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'At least one valid category_id is required',
      });
    }
    const count = await this.categoryModel
      .countDocuments({ category_id: { $in: unique } })
      .exec();
    if (count !== unique.length) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'One or more category_id values are unknown',
      });
    }
  }
}
