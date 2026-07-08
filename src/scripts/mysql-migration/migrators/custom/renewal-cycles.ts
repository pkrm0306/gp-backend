import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { fetchAllMysqlRows } from '../../lib/mysql-source';
import { insertBatches } from '../../lib/mongo-target';
import { normalizeUrn, trimString } from '../../lib/transforms';
import type { MigrationContext, MigrationResult } from '../../lib/types';

/**
 * Synthesizes renewal_cycles from products with renew activity + renew payments.
 * MySQL has no renewal_cycles table.
 */
export async function migrateRenewalCycles(
  ctx: MigrationContext,
): Promise<MigrationResult> {
  const mongoCollection = 'renewal_cycles';
  const products = await fetchAllMysqlRows(ctx.mysql, 'products', 'product_id');
  const payments = await fetchAllMysqlRows(ctx.mysql, 'payment_details', 'payment_id');

  const renewPaymentsByUrn = new Map<string, RowDataPacket[]>();
  for (const p of payments as RowDataPacket[]) {
    if (trimString(p.payment_type) !== 'renew') continue;
    const urn = normalizeUrn(p.urn_no);
    if (!urn) continue;
    const list = renewPaymentsByUrn.get(urn) ?? [];
    list.push(p);
    renewPaymentsByUrn.set(urn, list);
  }

  const docs: Record<string, unknown>[] = [];
  let syntheticId = 1;

  for (const row of products as RowDataPacket[]) {
    const urn = normalizeUrn(row.urn_no);
    if (!urn) continue;

    const renewStatus = Number(row.product_renew_status ?? 0);
    const renewPayments = renewPaymentsByUrn.get(urn) ?? [];
    if (renewStatus === 0 && renewPayments.length === 0) continue;

    const vendorOid = await ctx.idMap.resolve('vendors', Number(row.vendor_id));
    const cycles = Math.max(1, renewPayments.length || (renewStatus > 0 ? 1 : 0));

    for (let cycleNo = 1; cycleNo <= cycles; cycleNo++) {
      const legacyRenewalCycleId = syntheticId++;
      const mongoId = new ObjectId();
      const payment = renewPayments[cycleNo - 1];

      docs.push({
        _id: mongoId,
        legacyRenewalCycleId,
        urnNo: urn,
        vendorId: vendorOid ?? undefined,
        cycleNo,
        status: renewStatus >= 2 ? 'completed' : 'in_progress',
        legacyProductId: Number(row.product_id),
        legacyPaymentId: payment ? Number(payment.payment_id) : undefined,
        synthesized: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ctx.idMap.register({
        mysqlTable: 'renewal_cycles',
        mysqlId: legacyRenewalCycleId,
        mongoCollection,
        mongoId,
        numericIdField: 'legacyRenewalCycleId',
        legacyNumericId: legacyRenewalCycleId,
      });
    }
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  return {
    mysqlTable: 'renewal_cycles',
    mongoCollection,
    mysqlRows: docs.length,
    inserted,
    skipped: 0,
    errors: 0,
    notes: ['Synthetic cycles from product_renew_status + renew payments'],
  };
}
