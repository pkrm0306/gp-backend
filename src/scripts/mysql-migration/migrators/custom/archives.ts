import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { fetchAllMysqlRows } from '../../lib/mysql-source';
import { insertBatches } from '../../lib/mongo-target';
import type { MigrationContext, MigrationResult, TableDefinition } from '../../lib/types';

export async function migrateArchives(
  ctx: MigrationContext,
  definition: TableDefinition,
): Promise<MigrationResult> {
  const { mysqlTable, mongoCollection, mysqlPk } = definition;
  const rows = await fetchAllMysqlRows(ctx.mysql, mysqlTable, mysqlPk);
  const docs: Record<string, unknown>[] = [];

  for (const row of rows as RowDataPacket[]) {
    const legacyId = Number(row[mysqlPk]);
    const mongoId = new ObjectId();
    docs.push({
      _id: mongoId,
      archiveSourceTable: mysqlTable,
      legacyRowId: legacyId,
      payload: { ...row },
      migratedAt: new Date(),
    });

    await ctx.idMap.register({
      mysqlTable,
      mysqlId: legacyId,
      mongoCollection,
      mongoId,
      numericIdField: definition.numericIdField,
      legacyNumericId: legacyId,
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
    notes: [`Archived to ${mongoCollection} — no direct MERN collection`],
  };
}
