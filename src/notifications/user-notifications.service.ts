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
import { ListVendorNotificationsQueryDto } from './dto/list-vendor-notifications-query.dto';
import {
  buildVendorNotificationUnreadCountWhere,
  buildVendorNotificationWhere,
  mapVendorNotificationRow,
  unreadSeenFilter,
} from './helpers/user-notification.util';

@Injectable()
export class UserNotificationsService {
  constructor(
    @InjectModel(UserNotification.name)
    private readonly userNotificationModel: Model<UserNotificationDocument>,
  ) {}

  private activeUserFilter(userId: string): Record<string, unknown> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    return {
      user_id: new Types.ObjectId(userId),
      deleted_at: null,
    };
  }

  private mergeWhere(
    ...parts: Record<string, unknown>[]
  ): Record<string, unknown> {
    const and: Record<string, unknown>[] = [];
    const merged: Record<string, unknown> = {};
    for (const part of parts) {
      for (const [key, value] of Object.entries(part)) {
        if (key === '$or' || key === '$and') {
          and.push({ [key]: value });
        } else if (merged[key] !== undefined) {
          and.push({ [key]: merged[key] }, { [key]: value });
          delete merged[key];
        } else {
          merged[key] = value;
        }
      }
    }
    if (and.length === 0) return merged;
    return { ...merged, $and: and };
  }

  async listForUser(userId: string, query: ListVendorNotificationsQueryDto) {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 20);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;
    const skip = (safePage - 1) * safeLimit;

    const base = this.activeUserFilter(userId);
    const where = this.mergeWhere(base, buildVendorNotificationWhere(query));
    const unreadWhere = this.mergeWhere(
      base,
      buildVendorNotificationUnreadCountWhere(query),
    );

    const [totalCount, unreadCount, rows] = await Promise.all([
      this.userNotificationModel.countDocuments(where).exec(),
      this.userNotificationModel.countDocuments(unreadWhere).exec(),
      this.userNotificationModel
        .find(where)
        .sort({ created_at: -1, _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
    ]);

    return {
      data: (rows ?? []).map((n) =>
        mapVendorNotificationRow(n as Record<string, unknown>),
      ),
      totalCount,
      unreadCount,
      currentPage: safePage,
      totalPages: Math.max(1, Math.ceil(totalCount / safeLimit) || 1),
    };
  }

  async markSeen(userId: string, notificationId: string) {
    if (!notificationId?.trim()) {
      throw new BadRequestException('Notification id is required');
    }
    if (!Types.ObjectId.isValid(notificationId.trim())) {
      throw new BadRequestException('Invalid notification id');
    }

    const updated = await this.userNotificationModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(notificationId.trim()),
          ...this.activeUserFilter(userId),
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

  async markAllSeen(
    userId: string,
  ): Promise<{ success: true; markedCount: number }> {
    const result = await this.userNotificationModel
      .updateMany(
        this.mergeWhere(this.activeUserFilter(userId), unreadSeenFilter()),
        { $set: { seen: 1 } },
      )
      .exec();

    return {
      success: true,
      markedCount: result.modifiedCount ?? 0,
    };
  }
}
