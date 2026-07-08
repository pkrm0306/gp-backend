/**
 * GreenPro MySQL → MongoDB migration orchestrator.
 *
 * IMPORTANT: Targets MIGRATION_MONGO_URI only (separate DB). Does not touch live app DB.
 *
 * Usage:
 *   npm run migrate:mysql:list
 *   npm run migrate:mysql:analyze
 *   npm run migrate:mysql -- --phase 1
 *   npm run migrate:mysql -- --table products
 *   npm run migrate:mysql -- --all
 *   npm run migrate:mysql:validate
 */
import { loadMigrationConfig } from './lib/config';
import { assertMigrationTargetSafe } from './lib/migration-guard';
import { connectMysql } from './lib/mysql-source';
import {
  connectMigrationMongo,
  ensureMigrationMetaIndexes,
} from './lib/mongo-target';
import { IdMapService } from './lib/id-map';
import {
  listMigrationTables,
  runMigrationPhase,
  runMigrationTable,
} from './lib/migration-runner';
import { MIGRATION_PHASES } from './lib/table-registry';

function parseArgs(argv: string[]) {
  const phaseEq = argv.find((a) => a.startsWith('--phase='));
  const phaseIdx = argv.indexOf('--phase');
  const phaseFromSpace =
    phaseIdx >= 0 && argv[phaseIdx + 1] ? Number(argv[phaseIdx + 1]) : undefined;
  const tableEq = argv.find((a) => a.startsWith('--table='));
  const tableIdx = argv.indexOf('--table');
  const tableFromSpace =
    tableIdx >= 0 && argv[tableIdx + 1] ? argv[tableIdx + 1] : undefined;
  const all = argv.includes('--all');
  const list = argv.includes('--list');
  const dryRun = argv.includes('--dry-run');
  const fresh = argv.includes('--fresh');
  return {
    phase: phaseEq ? Number(phaseEq.split('=')[1]) : phaseFromSpace,
    table: tableEq ? tableEq.split('=')[1] : tableFromSpace,
    all,
    list,
    dryRun,
    fresh,
  };
}

async function resetMigrationDatabase(db: import('mongodb').Db): Promise<void> {
  const collections = await db.listCollections().toArray();
  for (const c of collections) {
    await db.collection(c.name).drop().catch(() => undefined);
  }
  console.log(`Reset: dropped ${collections.length} collections from migration DB`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadMigrationConfig();
  if (args.dryRun) config.dryRun = true;

  if (args.list) {
    console.log('Migration tables (phase order):\n');
    for (const p of MIGRATION_PHASES) {
      console.log(`Phase ${p.phase}: ${p.label}`);
      for (const t of listMigrationTables().filter((x) => x.phase === p.phase)) {
        console.log(
          `  - ${t.mysqlTable} → ${t.mongoCollection} [${t.handler}] pk=${t.mysqlPk} numeric=${t.numericIdField}`,
        );
      }
    }
    return;
  }

  assertMigrationTargetSafe(config);
  console.log(`Migration target: ${config.migrationMongoUri.replace(/\/\/.*@/, '//***@')}`);
  console.log(`MySQL source: ${config.mysqlHost}:${config.mysqlPort}/${config.mysqlDatabase}`);
  if (config.dryRun) console.log('DRY RUN — no Mongo writes');

  const mysql = await connectMysql(config);
  const { client, db, meta } = await connectMigrationMongo(config);
  const idMap = new IdMapService(db);
  idMap.setDryRun(config.dryRun);
  meta.setDryRun?.(config.dryRun);

  try {
    if (args.fresh && !config.dryRun) {
      await resetMigrationDatabase(db);
    }

    if (!config.dryRun) {
      await idMap.ensureIndexes();
      await ensureMigrationMetaIndexes(db);
    }

    const ctx = {
      mysql,
      mongo: db,
      idMap,
      config,
      dryRun: config.dryRun,
      meta,
    };

    if (args.table) {
      await runMigrationTable(ctx, args.table);
      await idMap.flush();
    } else if (args.all) {
      for (const p of MIGRATION_PHASES) {
        await runMigrationPhase(ctx, p.phase);
        await idMap.flush();
      }
    } else if (args.phase !== undefined) {
      await runMigrationPhase(ctx, args.phase);
      await idMap.flush();
    } else {
      console.log('\nProvide --list, --phase=N, --table=name, or --all');
      console.log('Example: npm run migrate:mysql -- --phase 1');
      process.exitCode = 1;
    }

    await idMap.flush();
    console.log('\nMigration run finished.');
  } finally {
    await idMap.flush().catch(() => undefined);
    await mysql.end();
    await client.close();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
