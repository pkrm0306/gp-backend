import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sector, SectorDocument } from './schemas/sector.schema';
import {
  SectorIdCounter,
  SectorIdCounterDocument,
  SECTOR_ID_COUNTER_KEY,
} from './schemas/sector-id-counter.schema';
import { ListSectorsQueryDto } from './dto/list-sectors-query.dto';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { UpdateSectorStatusDto } from './dto/update-sector-status.dto';
import { RedisService } from '../common/redis/redis.service';

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
export class SectorsService implements OnModuleInit {
  private readonly logger = new Logger(SectorsService.name);

  constructor(
    @InjectModel(Sector.name)
    private sectorModel: Model<SectorDocument>,
    @InjectModel(SectorIdCounter.name)
    private counterModel: Model<SectorIdCounterDocument>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  private getSectorListCacheTtlSeconds(): number {
    const ttl = parseInt(
      this.configService.get<string>('SECTOR_LIST_CACHE_TTL_SECONDS') ||
        this.configService.get<string>('CACHE_TTL_SECONDS') ||
        '60',
      10,
    );
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
  }

  private buildSectorListCacheKey(query: ListSectorsQueryDto): string {
    const normalized = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: String(query.search || '').trim().toLowerCase(),
      status: query.status ?? null,
      sortBy: query.sortBy ?? 'id',
      order: query.order === 'desc' ? 'desc' : 'asc',
    };
    return this.redisService.buildKey('sectors', 'list', JSON.stringify(normalized));
  }

  private async invalidateSectorListCache(): Promise<void> {
    await this.redisService
      .deleteByPattern(this.redisService.buildKey('sectors', 'list', '*'))
      .catch((error) => {
        this.logger.warn(
          `Failed to invalidate sector list cache: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
  }

  async onModuleInit(): Promise<void> {
    await this.syncSectorIdCounter();
  }

  private async getMaxSectorIdFromCollection(): Promise<number> {
    const agg = await this.sectorModel
      .aggregate([{ $group: { _id: null, maxId: { $max: '$id' } } }])
      .exec();
    const max = agg[0]?.maxId;
    return typeof max === 'number' && Number.isFinite(max) ? max : 0;
  }

  private async syncSectorIdCounter(): Promise<void> {
    const maxFromDocs = await this.getMaxSectorIdFromCollection();
    const existing = await this.counterModel
      .findOne({ _id: SECTOR_ID_COUNTER_KEY })
      .lean()
      .exec();
    const currentSeq = existing?.seq ?? 0;
    const seed = Math.max(currentSeq, maxFromDocs);
    await this.counterModel
      .updateOne(
        { _id: SECTOR_ID_COUNTER_KEY },
        { $set: { seq: seed } },
        { upsert: true },
      )
      .exec();
  }

  private async nextSectorId(): Promise<number> {
    const doc = await this.counterModel
      .findOneAndUpdate(
        { _id: SECTOR_ID_COUNTER_KEY },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      )
      .exec();
    if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
      throw new Error('Failed to allocate sector id');
    }
    return doc.seq;
  }

  parseSectorId(param: string): number {
    const n = parseInt(param, 10);
    if (!Number.isFinite(n) || n < 1) {
      throw new BadRequestException('Invalid sector id');
    }
    return n;
  }

  private notDeletedFilter(): Record<string, unknown> {
    return {
      $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
    };
  }

  private buildListFilter(query: ListSectorsQueryDto): Record<string, unknown> {
    const base = this.notDeletedFilter();
    const and: Record<string, unknown>[] = [base];

    if (query.search !== undefined && query.search.trim() !== '') {
      and.push({
        name: { $regex: new RegExp(escapeRegex(query.search.trim()), 'i') },
      });
    }
    if (query.status !== undefined) {
      and.push({ status: query.status });
    }

    if (and.length === 1) {
      return and[0];
    }
    return { $and: and };
  }

  async findAllPaginated(query: ListSectorsQueryDto) {
    const cacheKey = this.buildSectorListCacheKey(query);
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
        `Sector list cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'id';
    const order = query.order ?? 'asc';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const filter = this.buildListFilter(query);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.sectorModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.sectorModel.countDocuments(filter).exec(),
    ]);

    const response = {
      message: 'Sectors retrieved successfully',
      data,
      total,
      page,
      limit,
    };
    this.redisService
      .set(cacheKey, response, this.getSectorListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Sector list cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return response;
  }

  async findOneById(id: number) {
    const doc = await this.sectorModel
      .findOne({ id, ...this.notDeletedFilter() })
      .lean()
      .exec();
    if (!doc) {
      throw new NotFoundException('Sector not found');
    }
    return doc;
  }

  async create(dto: CreateSectorDto) {
    const now = new Date();
    const sectorId = await this.nextSectorId();
    const doc = await this.sectorModel.create({
      id: sectorId,
      name: dto.name.trim(),
      description: dto.description?.trim() ?? '',
      status: dto.status ?? 1,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    });
    const created = doc.toObject();
    await this.invalidateSectorListCache();
    return created;
  }

  async update(id: number, dto: UpdateSectorDto) {
    if (
      dto.name === undefined &&
      dto.description === undefined &&
      dto.status === undefined
    ) {
      throw new BadRequestException(
        'Provide name, description and/or status to update',
      );
    }
    const set: Record<string, unknown> = { updated_at: new Date() };
    if (dto.name !== undefined) {
      set.name = dto.name.trim();
    }
    if (dto.description !== undefined) {
      set.description = dto.description.trim();
    }
    if (dto.status !== undefined) {
      set.status = dto.status;
    }

    const updated = await this.sectorModel
      .findOneAndUpdate(
        { id, ...this.notDeletedFilter() },
        { $set: set },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Sector not found');
    }
    await this.invalidateSectorListCache();
    return updated;
  }

  async updateStatus(id: number, dto: UpdateSectorStatusDto) {
    const updated = await this.sectorModel
      .findOneAndUpdate(
        { id, ...this.notDeletedFilter() },
        { $set: { status: dto.status, updated_at: new Date() } },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Sector not found');
    }
    await this.invalidateSectorListCache();
    return updated;
  }

  async softDelete(id: number) {
    const updated = await this.sectorModel
      .findOneAndUpdate(
        { id, ...this.notDeletedFilter() },
        { $set: { deleted_at: new Date(), updated_at: new Date() } },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Sector not found');
    }
    await this.invalidateSectorListCache();
    return updated;
  }

  /** CSV rows for non-deleted sectors; same filters as list (search, status) — no pagination */
  async buildCsvExport(query: ListSectorsQueryDto): Promise<string> {
    const sortBy = query.sortBy ?? 'id';
    const order = query.order ?? 'asc';
    const sort: Record<string, 1 | -1> = {
      [sortBy]: order === 'desc' ? -1 : 1,
    };
    const filter = this.buildListFilter(query);
    const rows = await this.sectorModel.find(filter).sort(sort).lean().exec();

    const header = [
      'id',
      'name',
      'description',
      'status',
      'created_at',
      'updated_at',
    ];
    const lines = [
      header.join(','),
      ...rows.map((r) =>
        [r.id, r.name, r.description, r.status, r.created_at, r.updated_at]
          .map(csvEscape)
          .join(','),
      ),
    ];
    return lines.join('\r\n');
  }
}
