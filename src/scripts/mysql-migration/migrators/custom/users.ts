import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { fetchAllMysqlRows } from '../../lib/mysql-source';
import { insertBatches, recordSkipped } from '../../lib/mongo-target';
import {
  normalizeEmail,
  parseMysqlDateRequired,
  trimString,
} from '../../lib/transforms';
import type { MigrationContext, MigrationResult } from '../../lib/types';

export async function migrateUsers(
  ctx: MigrationContext,
  targetTable: 'admin' | 'vendor_users' | 'team_members',
): Promise<MigrationResult> {
  switch (targetTable) {
    case 'admin':
      return migrateAdminUsers(ctx);
    case 'vendor_users':
      return migrateVendorUsers(ctx);
    case 'team_members':
      return migrateTeamMembers(ctx);
    default:
      throw new Error(`Unknown users table: ${targetTable}`);
  }
}

async function migrateAdminUsers(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'admin';
  const mongoCollection = 'users';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'id');
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyAdminId = Number(row.id);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacyAdminId,
      type: 'admin',
      name: trimString(row.name),
      email: normalizeEmail(row.email),
      phone: trimString(row.mobile),
      username: trimString(row.username),
      password: trimString(row.password),
      legacyPasswordHash: trimString(row.password),
      legacyPasswordAlgo: 'md5',
      status: Number(row.status ?? 1),
      adminGstNo: trimString(row.admin_gst_no),
      legacyRole: trimString(row.role) || undefined,
      legacyAccess: trimString(row.access) || undefined,
      image: trimString(row.image) || undefined,
      createdAt: parseMysqlDateRequired(row.created_date),
      updatedAt: parseMysqlDateRequired(row.updated_date),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyAdminId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyAdminId',
      legacyNumericId: legacyAdminId,
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
    notes: ['Passwords stored as legacy MD5 — plan force-reset or verifier before live cutover'],
  };
}

async function migrateVendorUsers(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'vendor_users';
  const mongoCollection = 'users';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'vendor_user_id');
  const docs: Record<string, unknown>[] = [];
  let errors = 0;
  const notes: string[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyVendorUserId = Number(row.vendor_user_id);
    const legacyVendorId = Number(row.vendor_id);
    const manufacturerOid = await ctx.idMap.resolve('vendors', legacyVendorId);
    if (!manufacturerOid) {
      errors++;
      notes.push(`vendor_user ${legacyVendorUserId}: missing vendor ${legacyVendorId}`);
      await recordSkipped(
        ctx.mongo,
        mysqlTable,
        legacyVendorUserId,
        `missing vendor ${legacyVendorId}`,
        row,
        ctx.dryRun,
      );
      continue;
    }

    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacyVendorUserId,
      type: trimString(row.vendor_user_type) || 'vendor',
      manufacturerId: manufacturerOid,
      vendorId: manufacturerOid,
      name: trimString(row.vendor_user_name),
      email: normalizeEmail(row.vendor_user_email),
      phone: trimString(row.vendor_user_phone),
      password: trimString(row.vendor_user_password),
      legacyPasswordHash: trimString(row.vendor_user_password),
      legacyPasswordAlgo: 'md5',
      status: Number(row.vendor_user_status ?? 1),
      createdAt: parseMysqlDateRequired(row.created_date),
      updatedAt: parseMysqlDateRequired(row.updated_date),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyVendorUserId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyVendorUserId',
      legacyNumericId: legacyVendorUserId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return {
    mysqlTable,
    mongoCollection,
    mysqlRows: rows.length,
    inserted,
    skipped: 0,
    errors,
    notes,
  };
}

async function migrateTeamMembers(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'team_members';
  const mongoCollection = 'users';
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'team_member_id');
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyTeamMemberId = Number(row.team_member_id);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacyTeamMemberId,
      type: 'staff',
      team: 'administrative',
      showOnWebsite: Number(row.team_member_status ?? 1) === 1,
      name: trimString(row.team_member_name),
      email: normalizeEmail(row.team_member_email),
      phone: trimString(row.team_member_phone),
      designation: trimString(row.team_member_designation),
      image: trimString(row.team_member_image),
      vendor_facebook: trimString(row.team_member_facebook_url) || undefined,
      vendor_twitter: trimString(row.team_member_twitter_url) || undefined,
      vendor_linkedin: trimString(row.team_member_linkedin_url) || undefined,
      status: Number(row.team_member_status ?? 1),
      createdAt: parseMysqlDateRequired(row.created_date),
      updatedAt: parseMysqlDateRequired(row.updated_date),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyTeamMemberId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyTeamMemberId',
      legacyNumericId: legacyTeamMemberId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return { mysqlTable, mongoCollection, mysqlRows: rows.length, inserted, skipped: 0, errors: 0 };
}
