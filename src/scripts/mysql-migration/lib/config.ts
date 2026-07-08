import * as fs from 'fs';
import * as path from 'path';
import type { MigrationConfig } from './types';

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function loadMigrationConfig(): MigrationConfig {
  const root = path.resolve(__dirname, '../../../..');
  loadEnvFile(path.join(root, '.env.migration'));
  loadEnvFile(path.join(root, '.env'));

  const migrationMongoUri =
    process.env.MIGRATION_MONGO_URI?.trim() ||
    process.env.MONGODB_MIGRATION_URI?.trim() ||
    '';

  return {
    mysqlHost: process.env.MYSQL_MIGRATION_HOST?.trim() || '127.0.0.1',
    mysqlPort: Number(process.env.MYSQL_MIGRATION_PORT || 3307),
    mysqlUser: process.env.MYSQL_MIGRATION_USER?.trim() || 'greenpro',
    mysqlPassword:
      process.env.MYSQL_MIGRATION_PASSWORD !== undefined
        ? process.env.MYSQL_MIGRATION_PASSWORD.trim()
        : 'greenpro',
    mysqlDatabase: process.env.MYSQL_MIGRATION_DATABASE?.trim() || 'greenpro',
    migrationMongoUri,
    appMongoUri: process.env.MONGODB_URI?.trim(),
    batchSize: Number(process.env.MIGRATION_BATCH_SIZE || 500),
    dryRun: ['1', 'true', 'yes'].includes(
      String(process.env.MIGRATION_DRY_RUN || '').toLowerCase(),
    ),
    allowLiveTarget: ['1', 'true', 'yes'].includes(
      String(process.env.ALLOW_LIVE_TARGET || '').toLowerCase(),
    ),
  };
}
