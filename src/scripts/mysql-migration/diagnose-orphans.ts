/**
 * Diagnose orphaned foreign keys in the MySQL source before migration.
 * Usage: npx ts-node -r tsconfig-paths/register src/scripts/mysql-migration/diagnose-orphans.ts
 */
import { loadMigrationConfig } from './lib/config';
import { connectMysql } from './lib/mysql-source';
import type { RowDataPacket } from 'mysql2';

async function q(conn: any, sql: string): Promise<RowDataPacket[]> {
  const [rows] = await conn.query(sql);
  return rows as RowDataPacket[];
}

async function main() {
  const config = loadMigrationConfig();
  const conn = await connectMysql(config);
  try {
    console.log('states.id range & sample:');
    console.table(
      await q(conn, 'SELECT MIN(id) AS mn, MAX(id) AS mx, COUNT(*) AS c FROM states'),
    );
    console.table(await q(conn, 'SELECT id, name FROM states ORDER BY id LIMIT 10'));

    console.log('\nDistinct plant.state values (top 20 by frequency):');
    console.table(
      await q(
        conn,
        'SELECT state, COUNT(*) AS c FROM product_plants GROUP BY state ORDER BY c DESC LIMIT 20',
      ),
    );

    console.log('\nplant.state values that DO match a states.id:');
    console.table(
      await q(
        conn,
        'SELECT COUNT(*) AS matching FROM product_plants pp WHERE EXISTS (SELECT 1 FROM states s WHERE s.id=pp.state)',
      ),
    );

    console.log('\nDoes plant.state match states by name or state_code instead of id?');
    console.table(
      await q(
        conn,
        'SELECT COUNT(*) AS match_by_name FROM product_plants pp WHERE EXISTS (SELECT 1 FROM states s WHERE s.name=pp.state)',
      ),
    );
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
