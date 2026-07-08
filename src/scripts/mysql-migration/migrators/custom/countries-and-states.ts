import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { fetchAllMysqlRows, countMysqlRows } from '../../lib/mysql-source';
import { insertBatches } from '../../lib/mongo-target';
import {
  parseMysqlDateRequired,
  trimString,
  normalizeEmail,
} from '../../lib/transforms';
import type { MigrationContext, MigrationResult } from '../../lib/types';

const INDIA_COUNTRY_ID = 101;

export async function migrateCountriesAndStates(
  ctx: MigrationContext,
): Promise<MigrationResult> {
  const mysqlTable = 'states';
  const mongoCollection = 'states';
  const mysqlRows = await countMysqlRows(ctx.mysql, mysqlTable);

  let countryId = new ObjectId();
  if (!ctx.dryRun) {
    const existingCountry = await ctx.mongo
      .collection('countries')
      .findOne({ id: INDIA_COUNTRY_ID });

    if (existingCountry?._id) {
      countryId = existingCountry._id as ObjectId;
      await ctx.mongo.collection('countries').updateOne(
        { _id: countryId },
        {
          $set: {
            id: INDIA_COUNTRY_ID,
            countryName: 'India',
            countryCode: 'IN',
            country_code: 'IN',
            updatedAt: new Date(),
          },
        },
      );
    } else {
      await ctx.mongo.collection('countries').insertOne({
        _id: countryId,
        id: INDIA_COUNTRY_ID,
        countryName: 'India',
        countryCode: 'IN',
        country_code: 'IN',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  // register()/meta.set() warm caches in both modes; DB writes only happen when not dry-run.
  await ctx.idMap.register({
    mysqlTable: 'countries',
    mysqlId: INDIA_COUNTRY_ID,
    mongoCollection: 'countries',
    mongoId: countryId,
    numericIdField: 'id',
    legacyNumericId: INDIA_COUNTRY_ID,
  });
  await ctx.meta.set('defaultCountryMongoId', countryId.toHexString());

  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, 'id');
  const docs: Record<string, unknown>[] = [];
  let errors = 0;

  for (const row of rows as RowDataPacket[]) {
    const legacyStateId = Number(row.id);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      legacyStateId,
      countryId,
      country_id: Number(row.country_id ?? INDIA_COUNTRY_ID),
      stateName: trimString(row.name),
      stateCode: row.state_code != null ? String(row.state_code) : undefined,
      createdAt: parseMysqlDateRequired(row.created_at),
      updatedAt: parseMysqlDateRequired(row.updated_at ?? row.created_at),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyStateId,
      mongoCollection,
      mongoId,
      numericIdField: 'legacyStateId',
      legacyNumericId: legacyStateId,
    });
  }

  const inserted = await insertBatches(ctx.mongo, mongoCollection, docs, ctx.dryRun);

  return {
    mysqlTable,
    mongoCollection,
    mysqlRows,
    inserted,
    skipped: 0,
    errors,
    notes: ['Seeded countries.id=101 (India) from states.country_id'],
  };
}
