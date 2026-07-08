import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { fetchAllMysqlRows, countMysqlRows } from '../../lib/mysql-source';
import { insertBatches } from '../../lib/mongo-target';
import {
  normalizeUrn,
  parseDecimalNumber,
  parseJsonArray,
  parseMysqlDate,
  parseMysqlDateRequired,
  trimString,
} from '../../lib/transforms';
import type { MigrationContext, MigrationResult } from '../../lib/types';

export async function migratePayments(
  ctx: MigrationContext,
  targetTable: 'payment_details' | 'online_payment_details',
): Promise<MigrationResult> {
  if (targetTable === 'online_payment_details') {
    return migrateOnlinePayments(ctx);
  }
  return migratePaymentDetails(ctx);
}

async function migratePaymentDetails(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'payment_details';
  const mongoCollection = 'payment_details';
  const mysqlRows = await countMysqlRows(ctx.mysql, mysqlTable);
  let inserted = 0;
  let errors = 0;
  const notes: string[] = [];

  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'payment_id');
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const paymentId = Number(row.payment_id);
    const vendorOid = await ctx.idMap.resolve('vendors', Number(row.vendor_id));
    if (!vendorOid) {
      errors++;
      notes.push(`payment ${paymentId}: missing vendor ${row.vendor_id}`);
      continue;
    }

    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      paymentId,
      urnNo: normalizeUrn(row.urn_no),
      vendorId: vendorOid,
      quoteAmount: parseDecimalNumber(row.quote_amount),
      quoteGstAmount: parseDecimalNumber(row.quote_gst_amount),
      quoteTdsAmount: parseDecimalNumber(row.quote_tds_amount),
      quoteTotal: parseDecimalNumber(row.quote_total),
      proposalFile: trimString(row.proposal_file) || undefined,
      adminGstNo: trimString(row.admin_gst_no),
      vendorGstNo: trimString(row.vendor_gst_no),
      paymentType: trimString(row.payment_type) || 'registration',
      paymentMode: trimString(row.payment_mode) || undefined,
      onlinePaymentId: Number(row.online_payment_id ?? 0),
      paymentReferenceNo: trimString(row.payment_reference_no) || undefined,
      paymentChequeDate: parseMysqlDate(row.payment_cheque_date),
      chequeOrDdFile: trimString(row.cheque_or_dd_file) || undefined,
      tdsFile: trimString(row.tds_file) || undefined,
      productsToBeCertified: parseJsonArray(row.products_to_be_certified),
      paymentStatus: Number(row.payment_status ?? 0),
      createdDate: parseMysqlDateRequired(row.created_date),
      updatedDate: parseMysqlDateRequired(row.updated_date),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: paymentId,
      mongoCollection,
      mongoId,
      numericIdField: 'paymentId',
      legacyNumericId: paymentId,
    });
  }

  inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return { mysqlTable, mongoCollection, mysqlRows, inserted, skipped: 0, errors, notes };
}

async function migrateOnlinePayments(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'online_payment_details';
  const mongoCollection = 'migration_online_payments';
  const mysqlRows = await countMysqlRows(ctx.mysql, mysqlTable);

  if (mysqlRows === 0) {
    return {
      mysqlTable,
      mongoCollection,
      mysqlRows: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      notes: ['Table empty or not present in source'],
    };
  }

  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'online_payment_id');
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyOnlinePaymentId = Number(row.online_payment_id);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacyOnlinePaymentId,
      ...row,
      pgJsonResponse: row.pg_json_response ?? row.pgJsonResponse,
      migratedAt: new Date(),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyOnlinePaymentId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyOnlinePaymentId',
      legacyNumericId: legacyOnlinePaymentId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return {
    mysqlTable,
    mongoCollection,
    mysqlRows,
    inserted,
    skipped: 0,
    errors: 0,
    notes: ['Stored in migration_online_payments — embed on payment_details at cutover if needed'],
  };
}
