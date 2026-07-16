import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserNotification,
  UserNotificationDocument,
} from './schemas/user-notification.schema';
import { ListNotificationsQueryDto } from '../admin/dto/list-notifications-query.dto';
import {
  buildAdminNotificationRangeWhere,
  isNotificationSeen,
  normalizeSeenToNumber,
  readSeenFilter,
  unreadSeenFilter,
} from '../admin/helpers/admin-notification.util';

@Injectable()
export class VendorNotificationFeedService {
  constructor(
    @InjectModel(UserNotification.name)
    private readonly userNotificationModel: Model<UserNotificationDocument>,
  ) {}

  async listForUser(userId: string, query: ListNotificationsQueryDto) {
    if (!Types.ObjectId.isValid(String(userId ?? '').trim())) {
      throw new BadRequestException('Invalid user id');
    }
    const userObjectId = new Types.ObjectId(String(userId).trim());

    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 20);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
    const skip = (safePage - 1) * safeLimit;

    const rangeWhere = this.mapCreatedAtRange(
      buildAdminNotificationRangeWhere(query),
    );

    const baseWhere: Record<string, unknown> = {
      user_id: userObjectId,
      deleted_at: null,
      ...rangeWhere,
    };

    const listWhere: Record<string, unknown> = { ...baseWhere };
    if (query.seen === true) {
      Object.assign(listWhere, this.mapSeenFilter(readSeenFilter()));
    } else if (query.seen === false) {
      Object.assign(listWhere, this.mapSeenFilter(unreadSeenFilter()));
    }

    const unreadWhere: Record<string, unknown> = {
      ...baseWhere,
      ...this.mapSeenFilter(unreadSeenFilter()),
    };

    const [totalCount, unreadCount, rows] = await Promise.all([
      this.userNotificationModel.countDocuments(listWhere).exec(),
      this.userNotificationModel.countDocuments(unreadWhere).exec(),
      this.userNotificationModel
        .find(listWhere)
        .sort({ created_at: -1, _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
    ]);

    return {
      data: (rows ?? []).map((n) => this.mapRow(n as Record<string, unknown>)),
      totalCount,
      unreadCount,
      currentPage: safePage,
      totalPages: Math.max(1, Math.ceil(totalCount / safeLimit) || 1),
    };
  }

  async markSeen(userId: string, notificationId: string) {
    if (!Types.ObjectId.isValid(String(userId ?? '').trim())) {
      throw new BadRequestException('Invalid user id');
    }
    if (!Types.ObjectId.isValid(String(notificationId ?? '').trim())) {
      throw new BadRequestException('Invalid notification id');
    }

    const updated = await this.userNotificationModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(notificationId.trim()),
          user_id: new Types.ObjectId(userId.trim()),
          deleted_at: null,
        },
        { $set: { seen: 1 } },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Notification not found');
    }

    return {
      success: true as const,
      id: String(updated._id),
      seen: 1 as const,
    };
  }

  async markAllSeen(userId: string) {
    if (!Types.ObjectId.isValid(String(userId ?? '').trim())) {
      throw new BadRequestException('Invalid user id');
    }

    const result = await this.userNotificationModel
      .updateMany(
        {
          user_id: new Types.ObjectId(userId.trim()),
          deleted_at: null,
          ...this.mapSeenFilter(unreadSeenFilter()),
        },
        { $set: { seen: 1 } },
      )
      .exec();

    return {
      success: true as const,
      markedCount: result.modifiedCount ?? 0,
    };
  }

  /** Admin utils use `createdAt`; vendor feed uses `created_at`. */
  private mapCreatedAtRange(where: Record<string, unknown>): Record<string, unknown> {
    if (!where.createdAt) {
      return {};
    }
    return { created_at: where.createdAt };
  }

  private mapSeenFilter(filter: Record<string, unknown>): Record<string, unknown> {
    return filter;
  }

  private mapRow(n: Record<string, unknown>) {
    return {
      _id: String(n._id),
      id: String(n._id),
      numericId: n.id ?? null,
      title: String(n.title ?? ''),
      message: String(n.content ?? ''),
      content: String(n.content ?? ''),
      type: String(n.type ?? 'info'),
      notifyType: String(n.notify_type ?? ''),
      source: 'system',
      name: 'System',
      role: 'Vendor',
      seen: normalizeSeenToNumber(n.seen),
      seenAt: isNotificationSeen(n.seen) ? (n.updated_at ?? n.created_at ?? null) : null,
      createdAt: n.created_at ?? null,
    };
  }
}
