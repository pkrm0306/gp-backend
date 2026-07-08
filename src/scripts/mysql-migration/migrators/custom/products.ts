import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { countMysqlRows, streamMysqlRows } from '../../lib/mysql-source';
import { insertBatches, recordSkipped } from '../../lib/mongo-target';
import {
  normalizeUrn,
  parseMysqlDate,
  parseMysqlDateRequired,
  trimString,
} from '../../lib/transforms';
import type { MigrationContext, MigrationResult } from '../../lib/types';

export async function migrateProducts(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'products';
  const mongoCollection = 'products';
  const mysqlRows = await countMysqlRows(ctx.mysql, mysqlTable);
  let inserted = 0;
  let errors = 0;
  const notes: string[] = [];

  for await (const batch of streamMysqlRows(
    ctx.mysql,
    mysqlTable,
    'product_id',
    ctx.config.batchSize,
  )) {
    const docs: Record<string, unknown>[] = [];

    for (const row of batch as RowDataPacket[]) {
      const productId = Number(row.product_id);
      const categoryOid = await ctx.idMap.resolve('categories', Number(row.category_id));
      const vendorOid = await ctx.idMap.resolve('vendors', Number(row.vendor_id));
      const manufacturerOid = await ctx.idMap.resolve(
        'manufacturers',
        Number(row.manufacturer_id),
      );

      if (!categoryOid || !vendorOid || !manufacturerOid) {
        errors++;
        notes.push(`product ${productId}: missing FK (cat/vendor/mfr)`);
        await recordSkipped(
          ctx.mongo,
          mysqlTable,
          productId,
          'missing FK (category/vendor/manufacturer)',
          row,
          ctx.dryRun,
        );
        continue;
      }

      const mongoId = new ObjectId();
      const eoiNo = trimString(row.eoi_no);
      docs.push({
        _id: mongoId,
        productId,
        categoryId: categoryOid,
        vendorId: vendorOid,
        manufacturerId: manufacturerOid,
        eoiNo,
        eoiSequence: eoiNo.length >= 3 ? Number(eoiNo.slice(-3)) : undefined,
        urnNo: normalizeUrn(row.urn_no),
        productName: trimString(row.product_name),
        productImage: trimString(row.product_image),
        plantCount: Number(row.plant_count ?? 0),
        productDetails: trimString(row.product_details),
        productType: Number(row.product_type ?? 0),
        productStatus: Number(row.product_status ?? 0),
        productRenewStatus: Number(row.product_renew_status ?? 0),
        renewedDate: parseMysqlDate(row.renewed_date),
        urnStatus: Number(row.urn_status ?? 0),
        assessmentReportUrl: trimString(row.assessment_report_url) || undefined,
        rejectedDetails: row.rejected_details
          ? String(row.rejected_details)
          : undefined,
        certifiedDate: parseMysqlDate(row.certified_date),
        validtillDate: parseMysqlDate(row.validtill_date),
        firstNotifyDate: parseMysqlDate(row.first_notify_date),
        secondNotifyDate: parseMysqlDate(row.second_notify_date),
        thirdNotifyDate: parseMysqlDate(row.third_notify_date),
        createdDate: parseMysqlDateRequired(row.created_date),
        updatedDate: parseMysqlDateRequired(row.updated_date),
      });

      await ctx.idMap.register({
        mysqlTable,
        mysqlId: productId,
        mongoCollection,
        mongoId,
        numericIdField: 'productId',
        legacyNumericId: productId,
      });
    }

    inserted += await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);
  }

  return {
    mysqlTable,
    mongoCollection,
    mysqlRows,
    inserted,
    skipped: 0,
    errors,
    notes: notes.slice(0, 20),
  };
}
