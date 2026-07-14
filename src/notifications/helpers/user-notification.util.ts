import { ListVendorNotificationsQueryDto } from '../dto/list-vendor-notifications-query.dto';

/** Mongo filter: unread (`seen` is 0, false, or missing). */
export function unreadSeenFilter(): Record<string, unknown> {
  return {
    $or: [{ seen: 0 }, { seen: false }, { seen: { $exists: false } }],
  };
}

/** Mongo filter: read (`seen` is 1 or true). */
export function readSeenFilter(): Record<string, unknown> {
  return { $or: [{ seen: 1 }, { seen: true }] };
}

export function isNotificationSeen(value: unknown): boolean {
  return value === 1 || value === true;
}

/** API/storage convention: `0` = unseen, `1` = seen. */
export function normalizeSeenToNumber(value: unknown): 0 | 1 {
  return isNotificationSeen(value) ? 1 : 0;
}

export function buildVendorNotificationRangeWhere(
  query: ListVendorNotificationsQueryDto,
): Record<string, unknown> {
  const now = new Date();
  const where: Record<string, unknown> = {};

  switch (query?.range) {
    case 'today': {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      where.created_at = { $gte: start };
      break;
    }
    case 'week': {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      where.created_at = { $gte: start };
      break;
    }
    case '30d': {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      where.created_at = { $gte: start };
      break;
    }
    case '90d': {
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      where.created_at = { $gte: start };
      break;
    }
    default:
      break;
  }

  return where;
}

export function buildVendorNotificationWhere(
  query: ListVendorNotificationsQueryDto,
): Record<string, unknown> {
  const where = buildVendorNotificationRangeWhere(query);

  if (query.seen === true) {
    Object.assign(where, readSeenFilter());
  } else if (query.seen === false) {
    Object.assign(where, unreadSeenFilter());
  }

  return where;
}

export function buildVendorNotificationUnreadCountWhere(
  query: ListVendorNotificationsQueryDto,
): Record<string, unknown> {
  return {
    ...buildVendorNotificationRangeWhere(query),
    ...unreadSeenFilter(),
  };
}

export function mapVendorNotificationRow(n: Record<string, unknown>) {
  const notifyType = String(n.notify_type ?? '').trim();
  return {
    _id: String(n._id),
    id: String(n._id),
    numericId: typeof n.id === 'number' ? n.id : Number(n.id) || null,
    title: String(n.title ?? ''),
    message: String(n.content ?? n.message ?? ''),
    type: String(n.type ?? 'info'),
    notify_type: notifyType || null,
    source: 'system',
    name: 'GreenPro',
    role: 'System',
    actorName: 'GreenPro',
    seen: normalizeSeenToNumber(n.seen),
    seenAt: null,
    createdAt: n.created_at ?? n.createdAt ?? null,
  };
}
