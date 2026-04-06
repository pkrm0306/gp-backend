import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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
  constructor(
    @InjectModel(Standard.name)
    private standardModel: Model<StandardDocument>,
    @InjectModel(StandardIdCounter.name)
    private counterModel: Model<StandardIdCounterDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    this.ensureUploadDir();
    await this.syncStandardIdCounter();
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
    const existing = await this.counterModel.findOne({ _id: STANDARD_ID_COUNTER_KEY }).lean().exec();
    const currentSeq = existing?.seq ?? 0;
    const seed = Math.max(currentSeq, maxFromDocs);
    await this.counterModel
      .updateOne({ _id: STANDARD_ID_COUNTER_KEY }, { $set: { seq: seed } }, { upsert: true })
      .exec();
  }

  private async nextStandardId(): Promise<number> {
    const doc = await this.counterModel
      .findOneAndUpdate({ _id: STANDARD_ID_COUNTER_KEY }, { $inc: { seq: 1 } }, { new: true, upsert: true })
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

  private buildListFilter(query: ListStandardsQueryDto): Record<string, unknown> {
    const parts: Record<string, unknown>[] = [];

    if (query.search !== undefined && query.search.trim() !== '') {
      parts.push({ name: { $regex: new RegExp(escapeRegex(query.search.trim()), 'i') } });
    }
    if (query.resource_standard_type !== undefined && query.resource_standard_type.trim() !== '') {
      const t = query.resource_standard_type.trim();
      parts.push({
        resource_standard_type: { $regex: new RegExp(`^${escapeRegex(t)}$`, 'i') },
      });
    }
    if (query.status !== undefined) {
      parts.push({ status: query.status });
    }

    if (parts.length === 0) {
      return {};
    }
    if (parts.length === 1) {
      return parts[0];
    }
    return { $and: parts };
  }

  async findAllPaginated(query: ListStandardsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'id';
    const order = query.order ?? 'asc';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const filter = this.buildListFilter(query);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.standardModel.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
      this.standardModel.countDocuments(filter).exec(),
    ]);

    const data = rows.map((d) => this.enrichStandardFileUrl(d));

    return {
      message: 'Standards retrieved successfully',
      data,
      total,
      page,
      limit,
    };
  }

  async findOneById(id: number) {
    const doc = await this.standardModel.findOne({ id }).lean().exec();
    if (!doc) {
      throw new NotFoundException('Standard not found');
    }
    return this.enrichStandardFileUrl(doc);
  }

  /** Legacy rows may omit file_url; derive local URL from filename when needed. */
  private enrichStandardFileUrl<T extends { filename?: string; file_url?: string; storage_type?: string }>(
    doc: T,
  ): T & { file_url?: string } {
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

  async create(dto: CreateStandardMultipartDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'File is required (field name: file). Allowed: PDF, JPG, PNG. Max 10MB.',
      );
    }
    const upload = await uploadFile(file, 'standards');
    const now = new Date();
    const numericId = await this.nextStandardId();

    const doc = await this.standardModel.create({
      id: numericId,
      name: dto.name.trim(),
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
    return this.enrichStandardFileUrl(doc.toObject());
  }

  async update(id: number, dto: UpdateStandardMultipartDto, file?: Express.Multer.File) {
    const existing = await this.standardModel.findOne({ id }).exec();
    if (!existing) {
      throw new NotFoundException('Standard not found');
    }

    const hasText =
      (dto.name !== undefined && dto.name.trim() !== '') ||
      (dto.resource_standard_type !== undefined && dto.resource_standard_type.trim() !== '') ||
      dto.status !== undefined;
    if (!hasText && !file) {
      throw new BadRequestException('No fields to update');
    }

    const set: Record<string, unknown> = { updated_at: new Date() };

    if (dto.name !== undefined && dto.name.trim() !== '') {
      set.name = dto.name.trim();
    }
    if (dto.resource_standard_type !== undefined && dto.resource_standard_type.trim() !== '') {
      set.resource_standard_type = dto.resource_standard_type.trim();
    }
    if (dto.status !== undefined) {
      set.status = dto.status;
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
    return this.enrichStandardFileUrl(updated);
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
    return this.enrichStandardFileUrl(updated);
  }

  async remove(id: number) {
    const existing = await this.standardModel.findOne({ id }).exec();
    if (!existing) {
      throw new NotFoundException('Standard not found');
    }
    await deleteUploadedFile(this.fileMetaForDelete(existing));
    await this.standardModel.deleteOne({ id }).exec();
  }

  async buildCsvExport(query: ListStandardsQueryDto): Promise<string> {
    const sortBy = query.sortBy ?? 'id';
    const order = query.order ?? 'asc';
    const sort: Record<string, 1 | -1> = { [sortBy]: order === 'desc' ? -1 : 1 };
    const filter = this.buildListFilter(query);
    const rows = await this.standardModel.find(filter).sort(sort).lean().exec();

    const header = [
      'id',
      'name',
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
        return [
          e.id,
          e.name,
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
