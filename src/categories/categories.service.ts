import {
  BadRequestException,
  ConflictException,
  Injectable,
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
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { ProductPlant, ProductPlantDocument } from '../product-registration/schemas/product-plant.schema';
import {
  CategoryIdCounter,
  CategoryIdCounterDocument,
  CATEGORY_ID_COUNTER_KEY,
} from './schemas/category-id-counter.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories-query.dto';
import { UpdateCategoryStatusDto } from './dto/update-category-status.dto';
import { UpdateCategoryMultipartDto } from './dto/update-category-multipart.dto';

/** Listing row: Mongo lean doc plus computed image URL */
export type CategoryListItem = Record<string, unknown> & {
  category_image_url: string | null;
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function numericFromMax(value: unknown): number {
  if (value == null) return NaN;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value === 'object' && value !== null && typeof (value as { toNumber?: () => number }).toNumber === 'function') {
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
  ) {}

  async onModuleInit(): Promise<void> {
    this.ensureCategoryUploadDirs();
    await this.backfillCategoryNameNormalized();
    await this.dedupeCategoryNameNormalized();
    await this.syncCategoryIdCounterFromCategories();
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
      const display = formatCategoryDisplayName(String(doc.category_name ?? ''));
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
    if (err instanceof MongoServerError && (err as MongoServerError).code === 11000) {
      const pattern = (err as MongoServerError).keyPattern as
        | Record<string, unknown>
        | undefined;
      if (pattern && Object.prototype.hasOwnProperty.call(pattern, 'category_name_normalized')) {
        throw new ConflictException('A category with this name already exists');
      }
    }
  }

  private async assertCategoryNameUnique(
    normalized: string,
    excludeId?: Types.ObjectId,
  ): Promise<void> {
    const filter: Record<string, unknown> = { category_name_normalized: normalized };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const existing = await this.categoryModel.findOne(filter).select('_id').lean().exec();
    if (existing) {
      throw new ConflictException('A category with this name already exists');
    }
  }

  /** Ensures project/uploads/categories exists (matches main.ts static /uploads/) */
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
    const port = this.configService.get<string>('PORT') || process.env.PORT || '3000';
    return `http://localhost:${port}`;
  }

  /**
   * Full URL for category_image served under /uploads/ (see main.ts useStaticAssets).
   * If category_image is already an http(s) URL, returns it unchanged.
   * The file must exist on disk under project/uploads/ or the browser will get 404.
   */
  resolveCategoryImageUrl(categoryImage: string | undefined | null): string | null {
    if (categoryImage == null || String(categoryImage).trim() === '') {
      return null;
    }
    const raw = String(categoryImage).trim();
    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }
    const pathPart = raw.replace(/^\/+/, '');
    const underUploads = pathPart.startsWith('uploads/') ? pathPart : `uploads/${pathPart}`;
    const segments = underUploads.split('/').map((s) => encodeURIComponent(s));
    return `${this.getApiBaseUrl()}/${segments.join('/')}`;
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
    const existing = await this.counterModel.findOne({ _id: CATEGORY_ID_COUNTER_KEY }).lean().exec();
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
      category_image_url: this.resolveCategoryImageUrl(plain.category_image as string | undefined),
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
    return this.toCategoryResponse(updated.toObject() as unknown as Record<string, unknown>);
  }

  async update(id: string, dto: UpdateCategoryMultipartDto, image?: { filename: string }) {
    const oid = this.parseCategoryObjectId(id);
    const existing = await this.categoryModel.findById(oid).exec();
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    const hasFieldUpdate =
      (dto.category_name !== undefined && String(dto.category_name).trim() !== '') ||
      dto.category_raw_material_forms !== undefined ||
      dto.category_status !== undefined ||
      dto.sector !== undefined ||
      !!image;

    if (!hasFieldUpdate) {
      throw new BadRequestException('No fields to update');
    }

    const set: Record<string, unknown> = { updated_date: this.formatUpdatedDate() };

    if (dto.category_name !== undefined && String(dto.category_name).trim() !== '') {
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
      set.category_image = `categories/${image.filename}`;
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
    return this.toCategoryResponse(updated.toObject() as unknown as Record<string, unknown>);
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
  }
}
