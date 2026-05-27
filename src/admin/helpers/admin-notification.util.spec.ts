import {
  buildAdminNotificationWhere,
  buildAdminNotificationUnreadCountWhere,
  isNotificationSeen,
  mapAdminNotificationRow,
} from './admin-notification.util';

describe('admin-notification.util', () => {
  it('maps seen as 0|1 and exposes _id', () => {
    const row = mapAdminNotificationRow({
      _id: '674a1b2c3d4e5f6789012345',
      title: 'New Registration',
      message: 'Hello',
      seen: 0,
      actorName: 'Acme Co',
      source: 'manufacturer',
      createdAt: new Date('2026-05-20T10:30:00.000Z'),
    });
    expect(row._id).toBe('674a1b2c3d4e5f6789012345');
    expect(row.seen).toBe(0);
    expect(row.name).toBe('Acme Co');
    expect(row.role).toBe('Manufacturer');
  });

  it('treats seen 1 as read', () => {
    expect(isNotificationSeen(1)).toBe(true);
    expect(isNotificationSeen(0)).toBe(false);
    expect(mapAdminNotificationRow({ _id: 'a', title: 't', message: 'm', seen: 1 }).seen).toBe(1);
  });

  it('applies optional seen filter without breaking range', () => {
    const unreadList = buildAdminNotificationWhere({
      range: 'week',
      seen: false,
    });
    expect(unreadList.createdAt).toBeDefined();
    expect(unreadList.$or).toBeDefined();

    const unreadCountWhere = buildAdminNotificationUnreadCountWhere({
      range: 'week',
      seen: false,
    });
    expect(unreadCountWhere.createdAt).toBeDefined();
    expect(unreadCountWhere.$or).toBeDefined();
  });
});
