import type { MigrationContext, MigrationResult, TableDefinition } from './types';
import { getTableDefinition, getTablesByPhase } from './table-registry';
import { runTableMigration } from '../migrators';

export async function runMigrationPhase(
  ctx: MigrationContext,
  phase: number,
): Promise<MigrationResult[]> {
  const tables = getTablesByPhase(phase);
  const results: MigrationResult[] = [];

  for (const definition of tables) {
    console.log(
      `\n▶ Phase ${phase} — ${definition.mysqlTable} → ${definition.mongoCollection} (${definition.handler})`,
    );
    const result = await runTableMigration(ctx, definition);
    results.push(result);
    console.log(
      `  MySQL rows: ${result.mysqlRows} | inserted: ${result.inserted} | errors: ${result.errors}`,
    );
    if (result.notes?.length) {
      for (const note of result.notes.slice(0, 5)) {
        console.log(`  note: ${note}`);
      }
    }
  }

  return results;
}

export async function runMigrationTable(
  ctx: MigrationContext,
  mysqlTable: string,
): Promise<MigrationResult> {
  const definition = getTableDefinition(mysqlTable);
  if (!definition) {
    throw new Error(`Unknown table: ${mysqlTable}`);
  }
  return runTableMigration(ctx, definition);
}

export function listMigrationTables(): TableDefinition[] {
  return getTablesByPhase();
}
