import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { fetchAllMysqlRows } from '../../lib/mysql-source';
import { insertBatches } from '../../lib/mongo-target';
import {
  normalizeEmail,
  parseMysqlDate,
  parseMysqlDateRequired,
  trimString,
} from '../../lib/transforms';
import type { MigrationContext, MigrationResult } from '../../lib/types';

async function getPlatformVendorId(ctx: MigrationContext): Promise<ObjectId> {
  const cached = (await ctx.meta.get('platformVendorMongoId')) as string | undefined;
  if (cached) return new ObjectId(cached);

  const existing = ctx.dryRun
    ? null
    : await ctx.mongo.collection('manufacturers').findOne({
        vendor_email: 'platform-cms@migration.greenpro.local',
      });
  if (existing?._id) {
    await ctx.meta.set('platformVendorMongoId', existing._id.toString());
    return existing._id as ObjectId;
  }

  const mongoId = new ObjectId();
  if (!ctx.dryRun) {
    await ctx.mongo.collection('manufacturers').insertOne({
      _id: mongoId,
      legacyVendorId: 0,
      manufacturerName: 'GreenPro Platform (CMS)',
      vendor_name: 'GreenPro Platform',
      vendor_email: 'platform-cms@migration.greenpro.local',
      vendor_phone: '0000000000',
      vendor_status: 1,
      manufacturerStatus: 1,
      vendorPortalEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await ctx.meta.set('platformVendorMongoId', mongoId.toHexString());
  return mongoId;
}

export async function migrateCms(
  ctx: MigrationContext,
  targetTable: 'banners' | 'contacts' | 'subscription_list' | 'notifications',
): Promise<MigrationResult> {
  switch (targetTable) {
    case 'banners':
      return migrateBanners(ctx);
    case 'contacts':
      return migrateContacts(ctx);
    case 'subscription_list':
      return migrateSubscriptions(ctx);
    case 'notifications':
      return migrateNotifications(ctx);
    default:
      throw new Error(`Unknown CMS table: ${targetTable}`);
  }
}

async function migrateBanners(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'banners';
  const mongoCollection = 'banners';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'banner_id');
  const platformVendorId = await getPlatformVendorId(ctx);
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyBannerId = Number(row.banner_id);
    const mongoId = new ObjectId();
    const image = trimString(row.banner_image);
    docs.push({
      _id: mongoId,
      legacyBannerId,
      vendorId: platformVendorId,
      heading: trimString(row.banner_heading),
      description: trimString(row.banner_description),
      banner_image: image,
      imageUrl: image ? `/uploads/banners/${image}` : '',
      imageSource: 'manual_url',
      sequenceNumber: legacyBannerId,
      status: Number(row.banner_status ?? 1),
      createdAt: parseMysqlDateRequired(row.created_date),
      updatedAt: parseMysqlDateRequired(row.updated_date),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyBannerId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyBannerId',
      legacyNumericId: legacyBannerId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return {
    mysqlTable,
    mongoCollection,
    mysqlRows: rows.length,
    inserted,
    skipped: 0,
    errors: 0,
    notes: ['Legacy banners assigned platform CMS vendorId'],
  };
}

async function migrateContacts(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'contacts';
  const mongoCollection = 'contactmessages';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'contact_id');
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyContactId = Number(row.contact_id);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacyContactId,
      inquiryType: 'contact',
      name: trimString(row.contact_name),
      email: normalizeEmail(row.contact_email),
      phoneNumber: trimString(row.contact_phone),
      subject: trimString(row.contact_subject),
      message: trimString(row.contact_message),
      legacyStatus: Number(row.contact_status ?? 0),
      createdAt: parseMysqlDateRequired(row.created_date),
      updatedAt: parseMysqlDateRequired(row.updated_date),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyContactId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyContactId',
      legacyNumericId: legacyContactId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return { mysqlTable, mongoCollection, mysqlRows: rows.length, inserted, skipped: 0, errors: 0 };
}

function mapSubscriptionType(type: number): string[] {
  if (type === 1) return ['Green Products'];
  if (type === 2) return ['Events'];
  return ['Green Products', 'Events'];
}

async function migrateSubscriptions(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'subscription_list';
  const mongoCollection = 'newslettersubscribers';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'subscription_id');
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacySubscriptionId = Number(row.subscription_id);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacySubscriptionId,
      email: normalizeEmail(row.email_id),
      subscribedFor: mapSubscriptionType(Number(row.subscription_type ?? 3)),
      status: Number(row.subscription_status ?? 1),
      createdAt: parseMysqlDateRequired(row.created_date),
      updatedAt: parseMysqlDateRequired(row.updated_date),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacySubscriptionId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacySubscriptionId',
      legacyNumericId: legacySubscriptionId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return { mysqlTable, mongoCollection, mysqlRows: rows.length, inserted, skipped: 0, errors: 0 };
}

async function migrateNotifications(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'notifications';
  const mongoCollection = 'notifications';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'id');
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyNotificationId = Number(row.id);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacyNotificationId,
      title: trimString(row.title),
      content: trimString(row.content),
      legacyNotifyType: trimString(row.notify_type) || undefined,
      legacyUserId: row.user_id != null ? Number(row.user_id) : undefined,
      seen: Number(row.seen ?? 0) === 1,
      createdAt: parseMysqlDateRequired(row.created_at),
      updatedAt: parseMysqlDate(row.updated_at),
      deletedAt: parseMysqlDate(row.deleted_at),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyNotificationId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyNotificationId',
      legacyNumericId: legacyNotificationId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return { mysqlTable, mongoCollection, mysqlRows: rows.length, inserted, skipped: 0, errors: 0 };
}
