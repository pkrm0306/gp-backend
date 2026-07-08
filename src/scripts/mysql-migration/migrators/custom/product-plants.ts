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

const DEFAULT_CITY = 'Unknown';

export async function migrateProductPlants(
  ctx: MigrationContext,
): Promise<MigrationResult> {
  const mysqlTable = 'product_plants';
  const mongoCollection = 'product_plants';
  const mysqlRows = await countMysqlRows(ctx.mysql, mysqlTable);
  let inserted = 0;
  let errors = 0;
  const notes: string[] = [];

  const defaultCountryHex = (await ctx.meta.get('defaultCountryMongoId')) as
    | string
    | undefined;
  const defaultCountryId = defaultCountryHex
    ? new ObjectId(defaultCountryHex)
    : null;

  for await (const batch of streamMysqlRows(
    ctx.mysql,
    mysqlTable,
    'product_plant_id',
    ctx.config.batchSize,
  )) {
    const docs: Record<string, unknown>[] = [];

    for (const row of batch as RowDataPacket[]) {
      const productPlantId = Number(row.product_plant_id);
      const productOid = await ctx.idMap.resolve('products', Number(row.product_id));
      const vendorOid = await ctx.idMap.resolve('vendors', Number(row.vendor_id));
      const categoryOid = await ctx.idMap.resolve('categories', Number(row.category_id));
      const manufacturerOid = await ctx.idMap.resolve(
        'manufacturers',
        Number(row.manufacturer_id),
      );

      const stateLegacyId = Number(String(row.state ?? '').trim());
      const stateOid = await ctx.idMap.resolve('states', stateLegacyId);

      if (!productOid || !vendorOid || !categoryOid || !manufacturerOid) {
        errors++;
        notes.push(`plant ${productPlantId}: missing product/vendor/category/mfr FK`);
        await recordSkipped(
          ctx.mongo,
          mysqlTable,
          productPlantId,
          'missing product/vendor/category/manufacturer FK',
          row,
          ctx.dryRun,
        );
        continue;
      }
      if (!stateOid) {
        errors++;
        notes.push(`plant ${productPlantId}: unresolved state id=${row.state}`);
        await recordSkipped(
          ctx.mongo,
          mysqlTable,
          productPlantId,
          `unresolved state '${row.state}' (null/empty/out-of-range)`,
          row,
          ctx.dryRun,
        );
        continue;
      }
      if (!defaultCountryId) {
        errors++;
        notes.push('defaultCountryMongoId missing — run states migration first');
        continue;
      }

      const mongoId = new ObjectId();
      docs.push({
        _id: mongoId,
        productPlantId,
        productId: productOid,
        vendorId: vendorOid,
        categoryId: categoryOid,
        manufacturerId: manufacturerOid,
        urnNo: normalizeUrn(row.urn_no),
        eoiNo: trimString(row.eoi_no),
        plantName: trimString(row.plant_name) || 'Plant',
        plantLocation: trimString(row.plant_location),
        countryId: defaultCountryId,
        stateId: stateOid,
        city: trimString(row.city) || DEFAULT_CITY,
        plantStatus: Number(row.plant_status ?? 1),
        createdDate: parseMysqlDateRequired(row.created_date),
        legacyStateId: stateLegacyId,
        legacyAdditionalPlantInfo: trimString(row.additional_plant_info) || undefined,
      });

      await ctx.idMap.register({
        mysqlTable,
        mysqlId: productPlantId,
        mongoCollection,
        mongoId,
        numericIdField: 'productPlantId',
        legacyNumericId: productPlantId,
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
    notes: [...new Set(notes)].slice(0, 25),
  };
}
