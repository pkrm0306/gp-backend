import { ListNotificationsQueryDto } from '../dto/list-notifications-query.dto';

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

export function buildAdminNotificationRangeWhere(
  query: ListNotificationsQueryDto,
): Record<string, unknown> {
  const now = new Date();
  const where: Record<string, unknown> = {};

  switch (query?.range) {
    case 'today': {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      where.createdAt = { $gte: start };
      break;
    }
    case 'week': {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      where.createdAt = { $gte: start };
      break;
    }
    case '30d': {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      where.createdAt = { $gte: start };
      break;
    }
    case '90d': {
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      where.createdAt = { $gte: start };
      break;
    }
    default:
      break;
  }

  return where;
}

/** Range window + optional `seen` list filter (for paginated rows). */
export function buildAdminNotificationWhere(
  query: ListNotificationsQueryDto,
): Record<string, unknown> {
  const where = buildAdminNotificationRangeWhere(query);

  if (query.seen === true) {
    Object.assign(where, readSeenFilter());
  } else if (query.seen === false) {
    Object.assign(where, unreadSeenFilter());
  }

  return where;
}

/** Unread count for bell badge: same `range`, ignores `seen` query param. */
export function buildAdminNotificationUnreadCountWhere(
  query: ListNotificationsQueryDto,
): Record<string, unknown> {
  return {
    ...buildAdminNotificationRangeWhere(query),
    ...unreadSeenFilter(),
  };
}

export function mapAdminNotificationRow(n: Record<string, unknown>) {
  const actorName = String(n.actorName ?? '').trim();
  const source = String(n.source ?? 'system').trim();

  return {
    _id: String(n._id),
    id: String(n._id),
    title: String(n.title ?? ''),
    message: String(n.message ?? ''),
    type: String(n.type ?? 'info'),
    source,
    referenceType: n.referenceType ?? null,
    referenceId: n.referenceId ?? null,
    actorName: actorName || null,
    name: actorName || 'System',
    role: source === 'manufacturer' ? 'Manufacturer' : 'Admin',
    seen: normalizeSeenToNumber(n.seen),
    seenAt: n.seenAt ?? null,
    createdAt: n.createdAt ?? null,
  };
}
