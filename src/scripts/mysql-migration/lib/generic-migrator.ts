import { ObjectId } from 'mongodb';
import type { RowDataPacket } from 'mysql2';
import { mapProcessCommentsColumn, snakeToCamel } from './snake-to-camel';
import {
  parseMysqlDate,
  parseMysqlDateRequired,
  normalizeUrn,
} from './transforms';
import type {
  MigrationContext,
  MigrationResult,
  TableDefinition,
} from './types';
import { countMysqlRows, streamMysqlRows } from './mysql-source';
import { insertBatches } from './mongo-target';

function resolveMongoField(
  definition: TableDefinition,
  mysqlColumn: string,
): string | null {
  if (definition.skipColumns?.includes(mysqlColumn)) return null;
  if (definition.columnMap?.[mysqlColumn]) {
    return definition.columnMap[mysqlColumn];
  }
  if (definition.preserveColumns?.includes(mysqlColumn)) {
    return mysqlColumn;
  }
  if (definition.mysqlTable === 'process_comments') {
    return mapProcessCommentsColumn(mysqlColumn);
  }
  return snakeToCamel(mysqlColumn);
}

function transformValue(
  mysqlColumn: string,
  value: unknown,
  definition: TableDefinition,
): unknown {
  if (definition.dateColumns?.includes(mysqlColumn)) {
    const required =
      mysqlColumn === 'created_date' || mysqlColumn === 'updated_date';
    return required ? parseMysqlDateRequired(value) : parseMysqlDate(value);
  }
  if (mysqlColumn === 'urn_no') {
    return normalizeUrn(value);
  }
  return value;
}

export async function runGenericMigrator(
  ctx: MigrationContext,
  definition: TableDefinition,
): Promise<MigrationResult> {
  const {
    mysqlTable,
    mongoCollection,
    mysqlPk,
    numericIdField,
    foreignKeys = [],
  } = definition;

  const mysqlRows = await countMysqlRows(ctx.mysql, mysqlTable);
  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  const notes: string[] = [];

  for await (const batch of streamMysqlRows(
    ctx.mysql,
    mysqlTable,
    mysqlPk,
    ctx.config.batchSize,
  )) {
    const docs: Record<string, unknown>[] = [];

    for (const row of batch as RowDataPacket[]) {
      try {
        const legacyId = Number(row[mysqlPk]);
        if (!Number.isFinite(legacyId)) {
          skipped++;
          continue;
        }

        const mongoId = new ObjectId();
        const doc: Record<string, unknown> = {
          _id: mongoId,
          [numericIdField]: legacyId,
          ...definition.staticFields,
        };

        for (const [mysqlColumn, rawValue] of Object.entries(row)) {
          if (mysqlColumn === mysqlPk) continue;
          const mongoField = resolveMongoField(definition, mysqlColumn);
          if (!mongoField) continue;
          doc[mongoField] = transformValue(mysqlColumn, rawValue, definition);
        }

        for (const fk of foreignKeys) {
          const rawFk = row[fk.mysqlColumn];
          const resolved = await ctx.idMap.resolve(fk.refTable, Number(rawFk));
          if (!resolved) {
            if (fk.optional) {
              continue;
            }
            notes.push(
              `Missing FK ${fk.mysqlColumn}=${rawFk} for ${mysqlTable}.${legacyId}`,
            );
            errors++;
            continue;
          }
          doc[fk.mongoField] = resolved;
        }

        docs.push(doc);

        // register() warms the in-memory cache in both modes and only persists
        // to Mongo when not in dry-run, so downstream FK resolution works in dry runs too.
        await ctx.idMap.register({
          mysqlTable,
          mysqlId: legacyId,
          mongoCollection,
          mongoId,
          numericIdField,
          legacyNumericId: legacyId,
        });
      } catch (err) {
        errors++;
        notes.push(`Row error in ${mysqlTable}: ${(err as Error).message}`);
      }
    }

    inserted += await insertBatches(
      ctx.mongo,
      mongoCollection,
      docs,
      ctx.dryRun,
    );
  }

  return {
    mysqlTable,
    mongoCollection,
    mysqlRows,
    inserted,
    skipped,
    errors,
    notes: notes.length ? [...new Set(notes)].slice(0, 20) : undefined,
  };
}
