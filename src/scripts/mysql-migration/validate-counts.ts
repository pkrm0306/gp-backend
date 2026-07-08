/**
 * Compare MySQL row counts vs migration MongoDB collection counts.
 */
import { loadMigrationConfig } from './lib/config';
import { assertMigrationTargetSafe } from './lib/migration-guard';
import { connectMysql, countMysqlRows } from './lib/mysql-source';
import { connectMigrationMongo, countMongoCollection } from './lib/mongo-target';
import { TABLE_REGISTRY } from './lib/table-registry';

async function main() {
  const config = loadMigrationConfig();
  assertMigrationTargetSafe(config);

  const mysql = await connectMysql(config);
  const { client, db } = await connectMigrationMongo(config);

  try {
    console.log('Table validation (MySQL vs migration Mongo):\n');
    console.log(
      `${'MySQL Table'.padEnd(40)} ${'Mongo Collection'.padEnd(35)} MySQL  Mongo  Match`,
    );
    console.log('-'.repeat(100));

    const seenCollections = new Set<string>();
    let mismatches = 0;

    for (const def of TABLE_REGISTRY) {
      if (def.mysqlTable === 'renewal_cycles') continue;
      if (def.handler === 'custom:manufacturers-vendors' && def.mysqlTable === 'vendors') {
        continue;
      }

      let mysqlCount = 0;
      try {
        mysqlCount = await countMysqlRows(mysql, def.mysqlTable);
      } catch {
        mysqlCount = -1;
      }

      const mongoKey = `${def.mongoCollection}:${def.handler}`;
      let mongoCount = -1;
      if (!seenCollections.has(mongoKey) || def.handler !== 'custom:manufacturers-vendors') {
        try {
          if (def.mysqlTable === 'vendors') {
            mongoCount = await db.collection('manufacturers').countDocuments({
              legacyVendorId: { $exists: true },
            });
          } else {
            mongoCount = await countMongoCollection(db, def.mongoCollection);
          }
        } catch {
          mongoCount = -1;
        }
        seenCollections.add(mongoKey);
      }

      const match =
        mysqlCount >= 0 && mongoCount >= 0 && mysqlCount === mongoCount ? 'OK' : 'DIFF';
      if (match === 'DIFF' && mysqlCount > 0) mismatches++;

      console.log(
        `${def.mysqlTable.padEnd(40)} ${def.mongoCollection.padEnd(35)} ${String(mysqlCount).padStart(5)}  ${String(mongoCount).padStart(5)}  ${match}`,
      );
    }

    const idMapCount = await db.collection('migration_id_map').countDocuments();
    console.log('-'.repeat(100));
    console.log(`migration_id_map entries: ${idMapCount}`);
    console.log(`Collections with count mismatch (non-empty source): ${mismatches}`);
  } finally {
    await mysql.end();
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
