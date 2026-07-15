import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import { assertFromDateNotLaterThanToDate } from '../common/validators/date-range.validator';
import { AdminListGrievancesQueryDto } from './dto/admin-list-grievances-query.dto';
import { CreateGrievanceDto } from './dto/create-grievance.dto';
import { RespondGrievanceDto } from './dto/respond-grievance.dto';
import {
  Grievance,
  GrievanceDocument,
  GrievanceStatus,
} from './schemas/grievance.schema';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type GrievanceWithVendor = Record<string, unknown> & {
  vendorName?: string;
};

@Injectable()
export class GrievancesService {
  private readonly logger = new Logger(GrievancesService.name);

  constructor(
    @InjectModel(Grievance.name)
    private grievanceModel: Model<GrievanceDocument>,
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    private readonly lifecycleNotification: LifecycleNotificationService,
  ) {}

  private toObjectId(id: string, label = 'ID'): Types.ObjectId {
    const trimmed = String(id ?? '').trim();
    if (!Types.ObjectId.isValid(trimmed)) {
      throw new BadRequestException(`Invalid ${label} format`);
    }
    return new Types.ObjectId(trimmed);
  }

  private toVendorObjectId(vendorId: string): Types.ObjectId {
    return this.toObjectId(vendorId, 'vendor ID');
  }

  private manufacturerIdFromGrievance(grievance: {
    vendorId?: Types.ObjectId | string;
  }): string {
    return String(grievance.vendorId ?? '').trim();
  }

  private scheduleNotification(
    label: string,
    task: () => Promise<void>,
  ): void {
    void task().catch((err) =>
      this.logger.warn(
        `[${label}] notification failed: ${(err as Error)?.message || 'unknown error'}`,
      ),
    );
  }

  private endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private buildAdminListFilter(
    query: AdminListGrievancesQueryDto,
  ): FilterQuery<GrievanceDocument> {
    assertFromDateNotLaterThanToDate(query.from, query.to);

    const and: FilterQuery<GrievanceDocument>[] = [];

    if (query.search?.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      and.push({
        $or: [
          { grievanceNo: regex },
          { subject: regex },
          { category: regex },
          { description: regex },
        ],
      });
    }

    if (query.status) {
      and.push({ status: query.status });
    }

    if (query.category?.trim()) {
      and.push({ category: query.category.trim() });
    }

    if (query.from || query.to) {
      const createdAt: { $gte?: Date; $lte?: Date } = {};
      if (query.from) {
        createdAt.$gte = this.startOfDay(new Date(query.from));
      }
      if (query.to) {
        createdAt.$lte = this.endOfDay(new Date(query.to));
      }
      and.push({ createdAt });
    }

    if (and.length === 0) return {};
    if (and.length === 1) return and[0];
    return { $and: and };
  }

  private async vendorNameMap(
    vendorIds: Types.ObjectId[],
  ): Promise<Map<string, string>> {
    const unique = [
      ...new Map(vendorIds.map((id) => [String(id), id])).values(),
    ];
    if (unique.length === 0) return new Map();

    const rows = await this.manufacturerModel
      .find({ _id: { $in: unique } })
      .select({
        manufacturerName: 1,
        vendor_name: 1,
        vendor_email: 1,
        vendor_phone: 1,
      })
      .lean()
      .exec();

    const map = new Map<string, string>();
    for (const row of rows) {
      const name =
        String(row.manufacturerName ?? '').trim() ||
        String(row.vendor_name ?? '').trim();
      if (name) map.set(String(row._id), name);
    }
    return map;
  }

  private async vendorDetailsMap(
    vendorIds: Types.ObjectId[],
  ): Promise<
    Map<
      string,
      { vendorName: string; vendorEmail?: string; vendorPhone?: string }
    >
  > {
    const unique = [
      ...new Map(vendorIds.map((id) => [String(id), id])).values(),
    ];
    if (unique.length === 0) return new Map();

    const rows = await this.manufacturerModel
      .find({ _id: { $in: unique } })
      .select({
        manufacturerName: 1,
        vendor_name: 1,
        vendor_email: 1,
        vendor_phone: 1,
      })
      .lean()
      .exec();

    const map = new Map<
      string,
      { vendorName: string; vendorEmail?: string; vendorPhone?: string }
    >();
    for (const row of rows) {
      const vendorName =
        String(row.manufacturerName ?? '').trim() ||
        String(row.vendor_name ?? '').trim() ||
        '—';
      map.set(String(row._id), {
        vendorName,
        vendorEmail: String(row.vendor_email ?? '').trim() || undefined,
        vendorPhone: String(row.vendor_phone ?? '').trim() || undefined,
      });
    }
    return map;
  }

  private collectVendorObjectIds(
    items: Array<Record<string, unknown>>,
  ): Types.ObjectId[] {
    const ids: Types.ObjectId[] = [];
    for (const item of items) {
      const raw = item.vendorId;
      if (raw instanceof Types.ObjectId) {
        ids.push(raw);
      } else if (typeof raw === 'string' && Types.ObjectId.isValid(raw)) {
        ids.push(new Types.ObjectId(raw));
      }
    }
    return ids;
  }

  private async withVendorName<T extends { vendorId?: Types.ObjectId }>(
    doc: T,
  ): Promise<
    T & {
      vendorName: string;
      vendorEmail?: string;
      vendorPhone?: string;
    }
  > {
    const vendorId = doc.vendorId;
    if (!vendorId) {
      return { ...doc, vendorName: '—' };
    }
    const map = await this.vendorDetailsMap([vendorId]);
    const details = map.get(String(vendorId));
    return {
      ...doc,
      vendorName: details?.vendorName || '—',
      vendorEmail: details?.vendorEmail,
      vendorPhone: details?.vendorPhone,
    };
  }

  private async withVendorNames(
    items: Array<Record<string, unknown>>,
  ): Promise<GrievanceWithVendor[]> {
    const map = await this.vendorNameMap(this.collectVendorObjectIds(items));
    return items.map((item) => ({
      ...item,
      vendorName: map.get(String(item.vendorId ?? '')) || '—',
    }));
  }

  async findAllForVendor(vendorId: string): Promise<GrievanceDocument[]> {
    const vendorObjectId = this.toVendorObjectId(vendorId);
    return this.grievanceModel
      .find({ vendorId: vendorObjectId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOneForVendor(
    id: string,
    vendorId: string,
  ): Promise<GrievanceDocument> {
    const grievanceObjectId = this.toObjectId(id, 'grievance ID');
    const vendorObjectId = this.toVendorObjectId(vendorId);

    const grievance = await this.grievanceModel
      .findOne({
        _id: grievanceObjectId,
        vendorId: vendorObjectId,
      })
      .exec();

    if (!grievance) {
      throw new NotFoundException('Grievance not found');
    }

    return grievance;
  }

  async createForVendor(
    vendorId: string,
    dto: CreateGrievanceDto,
  ): Promise<GrievanceDocument> {
    const vendorObjectId = this.toVendorObjectId(vendorId);

    const grievance = new this.grievanceModel({
      vendorId: vendorObjectId,
      category: dto.category.trim(),
      subject: dto.subject.trim(),
      description: dto.description.trim(),
      ...(dto.attachment !== undefined && dto.attachment !== null
        ? { attachment: String(dto.attachment).trim() }
        : {}),
      status: GrievanceStatus.Pending,
      adminResponse: '',
      respondedBy: null,
      respondedAt: null,
    });

    const saved = await grievance.save();

    this.scheduleNotification('notifyGrievanceCreated', () =>
      this.lifecycleNotification.notifyGrievanceCreated({
        manufacturerId: vendorId,
        grievanceId: String(saved._id),
        grievanceNo: saved.grievanceNo,
        subject: saved.subject,
        category: saved.category,
      }),
    );

    return saved;
  }

  async findAllForAdmin(query: AdminListGrievancesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const filter = this.buildAdminListFilter(query);

    const [items, total] = await Promise.all([
      this.grievanceModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.grievanceModel.countDocuments(filter).exec(),
    ]);

    const enriched = await this.withVendorNames(
      items as unknown as Array<Record<string, unknown>>,
    );

    return {
      items: enriched,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit) || 1),
    };
  }

  async findOneForAdmin(id: string) {
    const grievanceObjectId = this.toObjectId(id, 'grievance ID');
    const grievance = await this.grievanceModel
      .findById(grievanceObjectId)
      .lean()
      .exec();

    if (!grievance) {
      throw new NotFoundException('Grievance not found');
    }

    return this.withVendorName(grievance);
  }

  async respondForAdmin(
    id: string,
    dto: RespondGrievanceDto,
    adminUserId: string,
  ): Promise<GrievanceDocument> {
    const grievanceObjectId = this.toObjectId(id, 'grievance ID');
    const grievance = await this.grievanceModel
      .findById(grievanceObjectId)
      .exec();

    if (!grievance) {
      throw new NotFoundException('Grievance not found');
    }

    if (grievance.status === GrievanceStatus.Closed) {
      throw new ConflictException(
        'This grievance is closed and cannot be modified',
      );
    }

    const existingResponse = String(grievance.adminResponse ?? '').trim();
    const incomingResponse = String(dto.adminResponse ?? '').trim();
    const manufacturerId = this.manufacturerIdFromGrievance(grievance);

    // Already has a response: allow Close only, without changing the response text.
    if (existingResponse) {
      if (dto.status !== GrievanceStatus.Closed) {
        throw new BadRequestException(
          'A response has already been submitted for this grievance',
        );
      }
      grievance.status = GrievanceStatus.Closed;
      const saved = await grievance.save();

      if (manufacturerId) {
        this.scheduleNotification('notifyGrievanceClosed', () =>
          this.lifecycleNotification.notifyGrievanceClosed({
            manufacturerId,
            grievanceNo: saved.grievanceNo,
            subject: saved.subject,
            category: saved.category,
          }),
        );
      }

      return saved;
    }

    if (!incomingResponse) {
      throw new BadRequestException('Admin response is required');
    }

    const responderId = this.toObjectId(adminUserId, 'admin user ID');
    grievance.adminResponse = incomingResponse;
    grievance.respondedBy = responderId;
    grievance.respondedAt = new Date();
    grievance.status = dto.status;

    const saved = await grievance.save();

    if (manufacturerId) {
      if (saved.status === GrievanceStatus.Closed) {
        this.scheduleNotification('notifyGrievanceClosed', () =>
          this.lifecycleNotification.notifyGrievanceClosed({
            manufacturerId,
            grievanceNo: saved.grievanceNo,
            subject: saved.subject,
            category: saved.category,
          }),
        );
      } else {
        this.scheduleNotification('notifyGrievanceResponded', () =>
          this.lifecycleNotification.notifyGrievanceResponded({
            manufacturerId,
            grievanceNo: saved.grievanceNo,
            subject: saved.subject,
            category: saved.category,
          }),
        );
      }
    }

    return saved;
  }
}
