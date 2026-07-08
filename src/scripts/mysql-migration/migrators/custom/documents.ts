import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { countMysqlRows, streamMysqlRows } from '../../lib/mysql-source';
import { insertBatches, recordSkipped } from '../../lib/mongo-target';
import {
  normalizeUrn,
  parseMysqlDateRequired,
  trimString,
} from '../../lib/transforms';
import type { MigrationContext, MigrationResult } from '../../lib/types';

export async function migrateDocuments(ctx: MigrationContext): Promise<MigrationResult> {
  const mysqlTable = 'all_product_documents';
  const mongoCollection = 'all_product_documents';
  const mysqlRows = await countMysqlRows(ctx.mysql, mysqlTable);
  let inserted = 0;
  let errors = 0;
  const notes: string[] = [];

  for await (const batch of streamMysqlRows(
    ctx.mysql,
    mysqlTable,
    'product_document_id',
    ctx.config.batchSize,
  )) {
    const docs: Record<string, unknown>[] = [];

    for (const row of batch as RowDataPacket[]) {
      const productDocumentId = Number(row.product_document_id);
      const vendorOid = await ctx.idMap.resolve('vendors', Number(row.vendor_id));
      if (!vendorOid) {
        errors++;
        await recordSkipped(
          ctx.mongo,
          mysqlTable,
          productDocumentId,
          `missing vendor ${row.vendor_id}`,
          row,
          ctx.dryRun,
        );
        continue;
      }

      const mongoId = new ObjectId();
      docs.push({
        _id: mongoId,
        productDocumentId,
        vendorId: vendorOid,
        urnNo: normalizeUrn(row.urn_no),
        eoiNo: trimString(row.eoi_no) || undefined,
        documentForm: trimString(row.document_form),
        documentFormSubsection: trimString(row.document_form_subsection) || undefined,
        formPrimaryId: Number(row.form_primary_id ?? 0),
        documentName: trimString(row.document_name),
        documentOriginalName: trimString(row.document_original_name),
        documentLink: trimString(row.document_link),
        legacyDocumentLink: trimString(row.document_link),
        createdDate: parseMysqlDateRequired(row.created_date),
        updatedDate: parseMysqlDateRequired(row.updated_date),
      });

      await ctx.idMap.register({
        mysqlTable,
        mysqlId: productDocumentId,
        mongoCollection,
        mongoId,
        numericIdField: 'productDocumentId',
        legacyNumericId: productDocumentId,
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
    notes: errors ? [`${errors} rows skipped due to missing vendor FK`] : undefined,
  };
}
