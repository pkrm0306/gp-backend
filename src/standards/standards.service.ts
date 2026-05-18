import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Model } from 'mongoose';
import { deleteUploadedFile, uploadFile } from '../utils/upload-file.util';
import { Standard, StandardDocument } from './schemas/standard.schema';
import {
  StandardIdCounter,
  StandardIdCounterDocument,
  STANDARD_ID_COUNTER_KEY,
} from './schemas/standard-id-counter.schema';
import { ListStandardsQueryDto } from './dto/list-standards-query.dto';
import { CreateStandardMultipartDto } from './dto/create-standard-multipart.dto';
import { UpdateStandardMultipartDto } from './dto/update-standard-multipart.dto';
import { UpdateStandardStatusDto } from './dto/update-standard-status.dto';
import { RedisService } from '../common/redis/redis.service';
import { CategoriesService } from '../categories/categories.service';
import { SectorsService } from '../sectors/sectors.service';
import {
  StandardCategory,
  StandardCategoryDocument,
} from './schemas/standard-category.schema';
import {
  hasExplicitCategoryIdFields,
} from './utils/merge-category-ids.util';
import {
  hasExplicitSectorAssignmentFields,
  mergeSectorIdsFromFormObject,
} from './utils/merge-sector-ids-from-form.util';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function csvEscape(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = value instanceof Date ? value.toISOString() : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

@Injectable()
export class StandardsService implements OnModuleInit {
  private readonly logger = new Logger(StandardsService.name);

  constructor(
    @InjectModel(Standard.name)
    private standardModel: Model<StandardDocument>,
    @InjectModel(StandardIdCounter.name)
    private counterModel: Model<StandardIdCounterDocument>,
    @InjectModel(StandardCategory.name)
    private standardCategoryModel: Model<StandardCategoryDocument>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly categoriesService: CategoriesService,
    private readonly sectorsService: SectorsService,
  ) {}

  private getStandardListCacheTtlSeconds(): number {
    const ttl = parseInt(
      this.configService.get<string>('STANDARD_LIST_CACHE_TTL_SECONDS') ||
        this.configService.get<string>('CACHE_TTL_SECONDS') ||
        '60',
      10,
    );
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
  }

  private buildStandardListCacheKey(query: ListStandardsQueryDto): string {
    const normalized = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: String(query.search || '').trim().toLowerCase(),
      resource_standard_type: String(query.resource_standard_type || '')
        .trim()
        .toLowerCase(),
      category_id: query.category_id ?? null,
      sector: query.sector ?? null,
      status: query.status ?? null,
      sortBy: query.sortBy ?? 'id',
      order: query.order === 'desc' ? 'desc' : 'asc',
    };
    return this.redisService.buildKey(
      'standards',
      'list',
      JSON.stringify(normalized),
    );
  }

  private async invalidateStandardListCache(): Promise<void> {
    await this.redisService
      .deleteByPattern(this.redisService.buildKey('standards', 'list', '*'))
      .catch((error) => {
        this.logger.warn(
          `Failed to invalidate standard list cache: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
  }

  async onModuleInit(): Promise<void> {
    this.ensureUploadDir();
    await this.syncStandardIdCounter();
    await this.backfillStandardCategoriesFromLegacy().catch((error) => {
      this.logger.warn(
        `standard_categories backfill skipped: ${(error as Error)?.message || 'unknown error'}`,
      );
    });
  }

  ensureUploadDir(): void {
    const dir = join(process.cwd(), 'uploads', 'standards');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  private async getMaxStandardIdFromCollection(): Promise<number> {
    const agg = await this.standardModel
      .aggregate([{ $group: { _id: null, maxId: { $max: '$id' } } }])
      .exec();
    const max = agg[0]?.maxId;
    return typeof max === 'number' && Number.isFinite(max) ? max : 0;
  }

  private async syncStandardIdCounter(): Promise<void> {
    const maxFromDocs = await this.getMaxStandardIdFromCollection();
    const existing = await this.counterModel
      .findOne({ _id: STANDARD_ID_COUNTER_KEY })
      .lean()
      .exec();
    const currentSeq = existing?.seq ?? 0;
    const seed = Math.max(currentSeq, maxFromDocs);
    await this.counterModel
      .updateOne(
        { _id: STANDARD_ID_COUNTER_KEY },
        { $set: { seq: seed } },
        { upsert: true },
      )
      .exec();
  }

  private async nextStandardId(): Promise<number> {
    const doc = await this.counterModel
      .findOneAndUpdate(
        { _id: STANDARD_ID_COUNTER_KEY },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      )
      .exec();
    if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
      throw new Error('Failed to allocate standard id');
    }
    return doc.seq;
  }

  parseStandardId(param: string): number {
    const n = parseInt(param, 10);
    if (!Number.isFinite(n) || n < 1) {
      throw new BadRequestException('Invalid standard id');
    }
    return n;
  }

  /** Resolves path `categoryId` to numeric `category_id` stored on standards (see CategoriesService). */
  async resolveCategoryIdForByCategoryRoute(param: string): Promise<number> {
    return this.categoriesService.resolveNumericCategoryKey(param);
  }

  /** Path `sectorId` must be a positive integer sector `id` (GET /api/sectors). */
  parseStandardSectorPathParam(param: string): number {
    const n = parseInt(String(param ?? '').trim(), 10);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
      throw new BadRequestException('Invalid sector id');
    }
    return n;
  }

  private async categoryIdsForSectorsOrThrow(
    sectorIds: number[],
  ): Promise<number[]> {
    const uniqueSectorOrder: number[] = [];
    const seenSectors = new Set<number>();
    for (const sid of sectorIds) {
      if (!Number.isInteger(sid) || sid < 1) continue;
      if (seenSectors.has(sid)) continue;
      seenSectors.add(sid);
      uniqueSectorOrder.push(sid);
    }
    if (!uniqueSectorOrder.length) {
      throw new BadRequestException(
        'At least one valid sector id is required (GET /api/sectors).',
      );
    }
    const categoryOut: number[] = [];
    const seenCategories = new Set<number>();
    for (const sectorId of uniqueSectorOrder) {
      await this.sectorsService.assertSectorExists(sectorId);
      const ids =
        await this.categoriesService.listNumericCategoryIdsBySector(sectorId);
      if (!ids.length) {
        throw new BadRequestException(
          `No categories exist for sector ${sectorId}; create categories under that sector first.`,
        );
      }
      for (const cid of ids) {
        if (seenCategories.has(cid)) continue;
        seenCategories.add(cid);
        categoryOut.push(cid);
      }
    }
    return categoryOut;
  }

  private mergedSectorIdsFromCreateOrUpdate(
    dto: CreateStandardMultipartDto | UpdateStandardMultipartDto,
    raw?: Record<string, unknown>,
  ): number[] {
    return mergeSectorIdsFromFormObject({
      ...(dto as object),
      ...(raw ?? {}),
    });
  }

  private explicitSectorAssignmentInUpdate(
    dto: UpdateStandardMultipartDto,
    raw?: Record<string, unknown>,
  ): boolean {
    if (hasExplicitSectorAssignmentFields(raw)) {
      return true;
    }
    const d = dto as Record<string, unknown>;
    if (d.sectors !== undefined && d.sectors !== null) {
      return true;
    }
    if (d.sector !== undefined && d.sector !== null && d.sector !== '') {
      return true;
    }
    return false;
  }

  private async buildListFilter(
    query: ListStandardsQueryDto,
  ): Promise<Record<string, unknown>> {
    const parts: Record<string, unknown>[] = [];

    if (query.search !== undefined && query.search.trim() !== '') {
      parts.push({
        name: { $regex: new RegExp(escapeRegex(query.search.trim()), 'i') },
      });
    }
    if (
      query.resource_standard_type !== undefined &&
      query.resource_standard_type.trim() !== ''
    ) {
      const t = query.resource_standard_type.trim();
      parts.push({
        resource_standard_type: {
          $regex: new RegExp(`^${escapeRegex(t)}$`, 'i'),
        },
      });
    }
    if (query.status !== undefined) {
      parts.push({ status: query.status });
    }
    if (
      query.category_id !== undefined &&
      Number.isInteger(query.category_id) &&
      query.category_id >= 1
    ) {
      const cid = query.category_id;
      const linked = await this.standardCategoryModel
        .distinct('standard_id', { category_id: cid })
        .exec();
      const linkedIds = (linked ?? []).filter(
        (x): x is number => typeof x === 'number' && Number.isInteger(x),
      );
      parts.push({
        $or: [{ category_id: cid }, { id: { $in: linkedIds } }],
      });
    }
    if (
      query.sector !== undefined &&
      Number.isInteger(query.sector) &&
      query.sector >= 1
    ) {
      const catIds =
        await this.categoriesService.listNumericCategoryIdsBySector(
          query.sector,
        );
      if (!catIds.length) {
        parts.push({ id: { $in: [] as number[] } });
      } else {
        const linked = await this.standardCategoryModel
          .distinct('standard_id', { category_id: { $in: catIds } })
          .exec();
        const linkedIds = (linked ?? []).filter(
          (x): x is number => typeof x === 'number' && Number.isInteger(x),
        );
        parts.push({
          $or: [
            { category_id: { $in: catIds } },
            { id: { $in: linkedIds } },
          ],
        });
      }
    }

    if (parts.length === 0) {
      return {};
    }
    if (parts.length === 1) {
      return parts[0];
    }
    return { $and: parts };
  }

  private async replaceStandardCategories(
    standardId: number,
    categoryIds: number[],
  ): Promise<void> {
    await this.standardCategoryModel
      .deleteMany({ standard_id: standardId })
      .exec();
    if (!categoryIds.length) {
      return;
    }
    await this.standardCategoryModel.insertMany(
      categoryIds.map((category_id) => ({
        standard_id: standardId,
        category_id,
      })),
      { ordered: true },
    );
  }

  private async loadCategoryIdsMapByStandardIds(
    standardIds: number[],
  ): Promise<Map<number, number[]>> {
    const map = new Map<number, number[]>();
    for (const id of standardIds) {
      map.set(id, []);
    }
    if (!standardIds.length) {
      return map;
    }
    const rows = await this.standardCategoryModel
      .find({ standard_id: { $in: standardIds } })
      .sort({ _id: 1 })
      .select('standard_id category_id')
      .lean()
      .exec();
    for (const r of rows) {
      const sid = r.standard_id as number;
      const cur = map.get(sid) ?? [];
      cur.push(r.category_id as number);
      map.set(sid, cur);
    }
    return map;
  }

  private effectiveCategoryIdsForDoc(
    doc: { id?: number; category_id?: number | null },
    map: Map<number, number[]>,
  ): number[] {
    const sid = doc.id;
    if (typeof sid !== 'number' || !Number.isInteger(sid)) {
      return [];
    }
    const fromJoin = map.get(sid) ?? [];
    if (fromJoin.length) {
      return fromJoin;
    }
    if (
      typeof doc.category_id === 'number' &&
      Number.isInteger(doc.category_id) &&
      doc.category_id >= 1
    ) {
      return [doc.category_id];
    }
    return [];
  }

  private async attachCategoriesToStandardDocs<
    T extends { id?: number; category_id?: number | null },
  >(
    docs: T[],
  ): Promise<
    Array<
      T & {
        category_ids: number[];
        categories: { id: number; name: string }[];
        category_id: number | null;
        category_name: string | null;
        /** Primary category's sector id (GET /api/sectors `id`) for admin sector dropdown. */
        sector_id: number | null;
        sector_ids: number[];
        sector_name: string | null;
      }
    >
  > {
    const ids = docs
      .map((d) => (typeof d.id === 'number' && Number.isInteger(d.id) ? d.id : null))
      .filter((x): x is number => x !== null);
    const map = await this.loadCategoryIdsMapByStandardIds(ids);
    const allCatIds = new Set<number>();
    for (const d of docs) {
      for (const c of this.effectiveCategoryIdsForDoc(d, map)) {
        allCatIds.add(c);
      }
    }
    const nameMap = await this.categoriesService.getCategoryNamesByNumericIds([
      ...allCatIds,
    ]);
    const catToSector =
      await this.categoriesService.getCategorySectorsByNumericIds([
        ...allCatIds,
      ]);
    const allSectorIds = new Set<number>();
    for (const cid of allCatIds) {
      const s = catToSector.get(cid);
      if (typeof s === 'number' && Number.isInteger(s) && s >= 1) {
        allSectorIds.add(s);
      }
    }
    const sectorNameMap = await this.sectorsService.getSectorNamesByNumericIds([
      ...allSectorIds,
    ]);

    return docs.map((d) => {
      const category_ids = this.effectiveCategoryIdsForDoc(d, map);
      const categories = category_ids.map((id) => ({
        id,
        name: nameMap.get(id) ?? '',
      }));
      const primary = category_ids[0] ?? null;
      const docSectorIds = new Set<number>();
      for (const cid of category_ids) {
        const s = catToSector.get(cid);
        if (typeof s === 'number' && Number.isInteger(s) && s >= 1) {
          docSectorIds.add(s);
        }
      }
      const sector_ids = [...docSectorIds].sort((a, b) => a - b);
      let sector_id: number | null = null;
      let sector_name: string | null = null;
      if (primary !== null) {
        const sid = catToSector.get(primary);
        if (typeof sid === 'number' && Number.isInteger(sid) && sid >= 1) {
          sector_id = sid;
          sector_name = sectorNameMap.get(sid) ?? null;
        }
      }
      return {
        ...d,
        category_ids,
        categories,
        category_id: primary,
        category_name: primary !== null ? nameMap.get(primary) ?? null : null,
        sector_id,
        sector_ids,
        sector_name,
      };
    });
  }

  private async backfillStandardCategoriesFromLegacy(): Promise<void> {
    const cursor = this.standardModel
      .find({ category_id: { $exists: true, $ne: null } })
      .select('id category_id')
      .lean()
      .cursor();
    let upserts = 0;
    for await (const row of cursor) {
      const sid = row.id as number;
      const cid = row.category_id as number;
      if (
        !Number.isInteger(sid) ||
        sid < 1 ||
        !Number.isInteger(cid) ||
        cid < 1
      ) {
        continue;
      }
      const res = await this.standardCategoryModel.updateOne(
        { standard_id: sid, category_id: cid },
        { $setOnInsert: { standard_id: sid, category_id: cid } },
        { upsert: true },
      );
      if (res.upsertedCount) {
        upserts += 1;
      }
    }
    if (upserts > 0) {
      this.logger.log(
        `Backfilled ${upserts} standard_categories row(s) from legacy category_id`,
      );
    }
  }

  private ensureDescriptionField<T extends { description?: unknown }>(
    doc: T,
  ): Omit<T, 'description'> & { description: string } {
    return {
      ...doc,
      description: typeof doc.description === 'string' ? doc.description : '',
    };
  }

  async findAllPaginated(query: ListStandardsQueryDto) {
    const cacheKey = this.buildStandardListCacheKey(query);
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: unknown[];
        total: number;
        page: number;
        limit: number;
      }>(cacheKey);
      if (cached && Array.isArray(cached.data)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Standard list cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'id';
    const order = query.order ?? 'asc';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const filter = await this.buildListFilter(query);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.standardModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.standardModel.countDocuments(filter).exec(),
    ]);

    const withMeta = rows.map((d) =>
      this.ensureDescriptionField(this.enrichStandardFileUrl(d)),
    );
    const data = await this.attachCategoriesToStandardDocs(withMeta);

    const response = {
      message: 'Standards retrieved successfully',
      data,
      total,
      page,
      limit,
    };
    this.redisService
      .set(cacheKey, response, this.getStandardListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Standard list cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return response;
  }

  /** List standards scoped to a sector (path); validates sector id exists. */
  async findAllPaginatedForSectorPath(
    sectorIdParam: string,
    query: ListStandardsQueryDto,
  ) {
    const sid = this.parseStandardSectorPathParam(sectorIdParam);
    await this.sectorsService.assertSectorExists(sid);
    return this.findAllPaginated({ ...query, sector: sid });
  }

  async findOneById(id: number) {
    const doc = await this.standardModel.findOne({ id }).lean().exec();
    if (!doc) {
      throw new NotFoundException('Standard not found');
    }
    const withMeta = this.ensureDescriptionField(this.enrichStandardFileUrl(doc));
    const [enriched] = await this.attachCategoriesToStandardDocs([withMeta]);
    return enriched;
  }

  /** Legacy rows may omit file_url; derive local URL from filename when needed. */
  private enrichStandardFileUrl<
    T extends { filename?: string; file_url?: string; storage_type?: string },
  >(doc: T): T & { file_url?: string } {
    if (doc.file_url) {
      return doc;
    }
    if (doc.storage_type === 's3') {
      return doc;
    }
    if (doc.filename) {
      const path = doc.filename.replace(/^\/+/, '');
      return {
        ...doc,
        file_url: `/uploads/${path.split('/').map(encodeURIComponent).join('/')}`,
      };
    }
    return doc;
  }

  private fileMetaForDelete(doc: StandardDocument) {
    const storage_type = doc.storage_type ?? 'local';
    return {
      storage_type: storage_type as 'local' | 's3',
      s3_key: doc.s3_key,
      relativePath: doc.filename.replace(/^\/+/, ''),
    };
  }

  async create(
    dto: CreateStandardMultipartDto,
    file: Express.Multer.File,
    rawBody?: Record<string, unknown>,
  ) {
    if (!file) {
      throw new BadRequestException(
        'File is required (field name: file). Allowed: PDF, JPG, PNG. Max 10MB.',
      );
    }
    if (hasExplicitCategoryIdFields(rawBody)) {
      throw new BadRequestException(
        'Category fields are no longer accepted. Send **sector** only (numeric id from GET /api/sectors).',
      );
    }
    const upload = await uploadFile(file, 'standards');
    const now = new Date();
    const numericId = await this.nextStandardId();

    const mergedSectors = this.mergedSectorIdsFromCreateOrUpdate(
      dto,
      rawBody,
    );
    if (!mergedSectors.length) {
      throw new BadRequestException(
        'Select at least one **sector** (multiselect): send **sectors** as a JSON array (e.g. [1,2]), repeated **sectors** / **sectors[]**, or **sector_ids** — numeric ids from GET /api/sectors. Legacy single **sector** is also accepted.',
      );
    }
    const merged = await this.categoryIdsForSectorsOrThrow(mergedSectors);
    await this.categoriesService.assertNumericCategoriesExist(merged);
    const primary = merged[0]!;

    const doc = await this.standardModel.create({
      id: numericId,
      category_id: primary,
      name: dto.name.trim(),
      description: dto.description?.trim() ?? '',
      resource_standard_type: dto.resource_standard_type.trim(),
      status: dto.status ?? 1,
      filename: upload.relativePath,
      file_url: upload.fileUrl,
      storage_type: upload.storage,
      s3_key: upload.s3Key,
      original_filename: file.originalname || upload.fileName,
      created_at: now,
      updated_at: now,
    });
    await this.replaceStandardCategories(numericId, merged);
    const created = this.ensureDescriptionField(
      this.enrichStandardFileUrl(doc.toObject()),
    );
    await this.invalidateStandardListCache();
    const [enriched] = await this.attachCategoriesToStandardDocs([created]);
    return enriched;
  }

  async update(
    id: number,
    dto: UpdateStandardMultipartDto,
    file?: Express.Multer.File,
    rawBody?: Record<string, unknown>,
  ) {
    const existing = await this.standardModel.findOne({ id }).exec();
    if (!existing) {
      throw new NotFoundException('Standard not found');
    }

    if (hasExplicitCategoryIdFields(rawBody)) {
      throw new BadRequestException(
        'Category fields are no longer accepted. Send **sector** only (numeric id from GET /api/sectors).',
      );
    }

    const explicitSector = this.explicitSectorAssignmentInUpdate(dto, rawBody);
    const mergedSectors = this.mergedSectorIdsFromCreateOrUpdate(dto, rawBody);

    const hasText =
      (dto.name !== undefined && dto.name.trim() !== '') ||
      dto.description !== undefined ||
      (dto.resource_standard_type !== undefined &&
        dto.resource_standard_type.trim() !== '') ||
      dto.status !== undefined ||
      explicitSector;
    if (!hasText && !file) {
      throw new BadRequestException('No fields to update');
    }

    const set: Record<string, unknown> = { updated_at: new Date() };

    if (dto.name !== undefined && dto.name.trim() !== '') {
      set.name = dto.name.trim();
    }
    if (dto.description !== undefined) {
      set.description = dto.description.trim();
    }
    if (
      dto.resource_standard_type !== undefined &&
      dto.resource_standard_type.trim() !== ''
    ) {
      set.resource_standard_type = dto.resource_standard_type.trim();
    }
    if (dto.status !== undefined) {
      set.status = dto.status;
    }

    let mergedForCategories: number[] | null = null;
    if (explicitSector) {
      if (!mergedSectors.length) {
        throw new BadRequestException(
          'When updating sector assignment, send at least one sector id (**sectors** multiselect or legacy **sector**).',
        );
      }
      mergedForCategories =
        await this.categoryIdsForSectorsOrThrow(mergedSectors);
      await this.categoriesService.assertNumericCategoriesExist(mergedForCategories);
      set.category_id = mergedForCategories[0];
    }

    if (file) {
      await deleteUploadedFile(this.fileMetaForDelete(existing));
      const upload = await uploadFile(file, 'standards');
      set.filename = upload.relativePath;
      set.file_url = upload.fileUrl;
      set.storage_type = upload.storage;
      set.s3_key = upload.s3Key ?? null;
      set.original_filename = file.originalname || upload.fileName;
    }

    const updated = await this.standardModel
      .findOneAndUpdate({ id }, { $set: set }, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Standard not found');
    }
    if (mergedForCategories) {
      await this.replaceStandardCategories(id, mergedForCategories);
    }
    const response = this.ensureDescriptionField(this.enrichStandardFileUrl(updated));
    await this.invalidateStandardListCache();
    const [enriched] = await this.attachCategoriesToStandardDocs([response]);
    return enriched;
  }

  async updateStatus(id: number, dto: UpdateStandardStatusDto) {
    const updated = await this.standardModel
      .findOneAndUpdate(
        { id },
        { $set: { status: dto.status, updated_at: new Date() } },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Standard not found');
    }
    const response = this.ensureDescriptionField(this.enrichStandardFileUrl(updated));
    await this.invalidateStandardListCache();
    const [enriched] = await this.attachCategoriesToStandardDocs([response]);
    return enriched;
  }

  async remove(id: number) {
    const existing = await this.standardModel.findOne({ id }).exec();
    if (!existing) {
      throw new NotFoundException('Standard not found');
    }
    await deleteUploadedFile(this.fileMetaForDelete(existing));
    await this.standardCategoryModel.deleteMany({ standard_id: id }).exec();
    await this.standardModel.deleteOne({ id }).exec();
    await this.invalidateStandardListCache();
  }

  async buildCsvExport(query: ListStandardsQueryDto): Promise<string> {
    const sortBy = query.sortBy ?? 'id';
    const order = query.order ?? 'asc';
    const sort: Record<string, 1 | -1> = {
      [sortBy]: order === 'desc' ? -1 : 1,
    };
    const filter = await this.buildListFilter(query);
    const rows = await this.standardModel.find(filter).sort(sort).lean().exec();
    const stdIds = rows
      .map((r) => r.id)
      .filter((x): x is number => typeof x === 'number' && Number.isInteger(x));
    const joinMap = await this.loadCategoryIdsMapByStandardIds(stdIds);
    const allIds = new Set<number>();
    for (const r of rows) {
      for (const c of this.effectiveCategoryIdsForDoc(r, joinMap)) {
        allIds.add(c);
      }
    }
    const nameMap = await this.categoriesService.getCategoryNamesByNumericIds([
      ...allIds,
    ]);
    const catToSector =
      await this.categoriesService.getCategorySectorsByNumericIds([
        ...allIds,
      ]);
    const allSectorIds = new Set<number>();
    for (const cid of allIds) {
      const s = catToSector.get(cid);
      if (typeof s === 'number' && Number.isInteger(s) && s >= 1) {
        allSectorIds.add(s);
      }
    }
    const sectorNameMap = await this.sectorsService.getSectorNamesByNumericIds([
      ...allSectorIds,
    ]);

    const header = [
      'id',
      'category_ids',
      'category_names',
      'category_id',
      'category_name',
      'sector_id',
      'sector_name',
      'name',
      'description',
      'filename',
      'file_url',
      'storage_type',
      'original_filename',
      'resource_standard_type',
      'status',
      'created_at',
      'updated_at',
    ];
    const lines = [
      header.join(','),
      ...rows.map((r) => {
        const e = this.enrichStandardFileUrl(r);
        const cids = this.effectiveCategoryIdsForDoc(e, joinMap);
        const cnames = cids.map((id) => nameMap.get(id) ?? '').join('; ');
        const primary = cids[0] ?? null;
        const primaryName = primary !== null ? nameMap.get(primary) ?? '' : '';
        let sectorIdVal: number | string = '';
        let sectorNameVal = '';
        if (primary !== null) {
          const sid = catToSector.get(primary);
          if (typeof sid === 'number' && Number.isInteger(sid) && sid >= 1) {
            sectorIdVal = sid;
            sectorNameVal = sectorNameMap.get(sid) ?? '';
          }
        }
        return [
          e.id,
          cids.join(';'),
          cnames,
          primary ?? '',
          primaryName,
          sectorIdVal,
          sectorNameVal,
          e.name,
          e.description ?? '',
          e.filename,
          e.file_url ?? '',
          e.storage_type ?? 'local',
          e.original_filename,
          e.resource_standard_type,
          e.status,
          e.created_at,
          e.updated_at,
        ]
          .map(csvEscape)
          .join(',');
      }),
    ];
    return lines.join('\r\n');
  }
}
