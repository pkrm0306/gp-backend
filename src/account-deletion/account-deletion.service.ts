import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import { AdminListAccountDeletionQueryDto } from './dto/admin-list-account-deletion-query.dto';
import { CreateAccountDeletionRequestDto } from './dto/create-account-deletion-request.dto';
import { ReviewAccountDeletionRequestDto } from './dto/review-account-deletion-request.dto';
import {
  AccountDeletionRequest,
  AccountDeletionRequestDocument,
  AccountDeletionStatus,
} from './schemas/account-deletion-request.schema';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type RequestWithVendor = Record<string, unknown> & {
  vendorName?: string;
};

@Injectable()
export class AccountDeletionService {
  private readonly logger = new Logger(AccountDeletionService.name);

  constructor(
    @InjectModel(AccountDeletionRequest.name)
    private accountDeletionModel: Model<AccountDeletionRequestDocument>,
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    private readonly manufacturersService: ManufacturersService,
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

  private manufacturerIdFromRequest(doc: {
    vendorId?: Types.ObjectId | string;
  }): string {
    return String(doc.vendorId ?? '').trim();
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
    query: AdminListAccountDeletionQueryDto,
  ): FilterQuery<AccountDeletionRequestDocument> {
    const and: FilterQuery<AccountDeletionRequestDocument>[] = [];

    if (query.search?.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      and.push({
        $or: [
          { requestNo: regex },
          { reason: regex },
          { description: regex },
          { adminRemarks: regex },
        ],
      });
    }

    if (query.status) {
      and.push({ status: query.status });
    }

    if (query.reason?.trim()) {
      and.push({ reason: query.reason.trim() });
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
  ): Promise<RequestWithVendor[]> {
    const map = await this.vendorNameMap(this.collectVendorObjectIds(items));
    return items.map((item) => ({
      ...item,
      vendorName: map.get(String(item.vendorId ?? '')) || '—',
    }));
  }

  async findAllForVendor(
    vendorId: string,
  ): Promise<AccountDeletionRequestDocument[]> {
    const vendorObjectId = this.toVendorObjectId(vendorId);
    return this.accountDeletionModel
      .find({ vendorId: vendorObjectId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOneForVendor(
    id: string,
    vendorId: string,
  ): Promise<AccountDeletionRequestDocument> {
    const requestObjectId = this.toObjectId(id, 'request ID');
    const vendorObjectId = this.toVendorObjectId(vendorId);

    const doc = await this.accountDeletionModel
      .findOne({
        _id: requestObjectId,
        vendorId: vendorObjectId,
      })
      .exec();

    if (!doc) {
      throw new NotFoundException('Account deletion request not found');
    }

    return doc;
  }

  async createForVendor(
    vendorId: string,
    dto: CreateAccountDeletionRequestDto,
  ): Promise<AccountDeletionRequestDocument> {
    const vendorObjectId = this.toVendorObjectId(vendorId);

    const openRequest = await this.accountDeletionModel
      .findOne({
        vendorId: vendorObjectId,
        status: {
          $in: [
            AccountDeletionStatus.Requested,
            AccountDeletionStatus.Approved,
          ],
        },
      })
      .exec();

    if (openRequest) {
      throw new BadRequestException(
        `You already have an open account deletion request (${openRequest.requestNo}) with status ${openRequest.status}`,
      );
    }

    const doc = new this.accountDeletionModel({
      vendorId: vendorObjectId,
      reason: dto.reason.trim(),
      description: String(dto.description ?? '').trim(),
      confirmed: true,
      status: AccountDeletionStatus.Requested,
      adminRemarks: '',
      reviewedBy: null,
      reviewedAt: null,
    });

    const saved = await doc.save();

    this.scheduleNotification('notifyAccountDeletionRequested', () =>
      this.lifecycleNotification.notifyAccountDeletionRequested({
        manufacturerId: vendorId,
        requestId: String(saved._id),
        requestNo: saved.requestNo,
        reason: saved.reason,
      }),
    );

    return saved;
  }

  async findAllForAdmin(query: AdminListAccountDeletionQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const filter = this.buildAdminListFilter(query);

    const [items, total] = await Promise.all([
      this.accountDeletionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.accountDeletionModel.countDocuments(filter).exec(),
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
    const requestObjectId = this.toObjectId(id, 'request ID');
    const doc = await this.accountDeletionModel
      .findById(requestObjectId)
      .lean()
      .exec();

    if (!doc) {
      throw new NotFoundException('Account deletion request not found');
    }

    return this.withVendorName(doc);
  }

  /**
   * Soft-deletes the vendor account when marking Completed (blocks login, hides
   * website products, frees email for re-registration). Never permanently deletes rows.
   */
  async reviewForAdmin(
    id: string,
    dto: ReviewAccountDeletionRequestDto,
    adminUserId: string,
  ): Promise<AccountDeletionRequestDocument> {
    const requestObjectId = this.toObjectId(id, 'request ID');
    const doc = await this.accountDeletionModel.findById(requestObjectId).exec();

    if (!doc) {
      throw new NotFoundException('Account deletion request not found');
    }

    if (
      doc.status === AccountDeletionStatus.Rejected ||
      doc.status === AccountDeletionStatus.Completed
    ) {
      throw new BadRequestException(
        `This request is already ${doc.status} and cannot be updated`,
      );
    }

    const remarks = String(dto.adminRemarks ?? '').trim();
    const manufacturerId = this.manufacturerIdFromRequest(doc);
    const reviewerId = this.toObjectId(adminUserId, 'admin user ID');

    if (dto.status === AccountDeletionStatus.Approved) {
      if (doc.status !== AccountDeletionStatus.Requested) {
        throw new BadRequestException(
          'Only requests with status Requested can be approved',
        );
      }
      doc.status = AccountDeletionStatus.Approved;
      if (remarks) doc.adminRemarks = remarks;
      doc.reviewedBy = reviewerId;
      doc.reviewedAt = new Date();
      const saved = await doc.save();

      if (manufacturerId) {
        this.scheduleNotification('notifyAccountDeletionApproved', () =>
          this.lifecycleNotification.notifyAccountDeletionApproved({
            manufacturerId,
            requestNo: saved.requestNo,
            reason: saved.reason,
          }),
        );
      }
      return saved;
    }

    if (dto.status === AccountDeletionStatus.Rejected) {
      if (doc.status !== AccountDeletionStatus.Requested) {
        throw new BadRequestException(
          'Only requests with status Requested can be rejected',
        );
      }
      if (!remarks) {
        throw new BadRequestException('Admin remarks are required when rejecting');
      }
      doc.status = AccountDeletionStatus.Rejected;
      doc.adminRemarks = remarks;
      doc.reviewedBy = reviewerId;
      doc.reviewedAt = new Date();
      const saved = await doc.save();

      if (manufacturerId) {
        this.scheduleNotification('notifyAccountDeletionRejected', () =>
          this.lifecycleNotification.notifyAccountDeletionRejected({
            manufacturerId,
            requestNo: saved.requestNo,
            reason: saved.reason,
            adminRemarks: saved.adminRemarks,
          }),
        );
      }
      return saved;
    }

    // Completed — soft-delete account outcomes (login block, hide products, free email).
    if (doc.status !== AccountDeletionStatus.Approved) {
      throw new BadRequestException(
        'Only approved requests can be marked Completed',
      );
    }

    if (!manufacturerId) {
      throw new BadRequestException(
        'Account deletion request has no linked manufacturer',
      );
    }

    await this.manufacturersService.softDeleteAccountAfterDeletionRequest(
      manufacturerId,
    );

    doc.status = AccountDeletionStatus.Completed;
    if (remarks) doc.adminRemarks = remarks;
    doc.reviewedBy = reviewerId;
    doc.reviewedAt = new Date();
    const saved = await doc.save();

    this.scheduleNotification('notifyAccountDeletionCompleted', () =>
      this.lifecycleNotification.notifyAccountDeletionCompleted({
        manufacturerId,
        requestNo: saved.requestNo,
        reason: saved.reason,
      }),
    );
    return saved;
  }
}