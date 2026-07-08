import type { MigrationConfig } from './types';

export function assertMigrationTargetSafe(config: MigrationConfig): void {
  if (!config.migrationMongoUri) {
    throw new Error(
      'MIGRATION_MONGO_URI is required. Use a separate MongoDB database for migration testing — never your live app DB.',
    );
  }

  if (!config.appMongoUri) {
    return;
  }

  const normalize = (uri: string) => uri.replace(/\/+$/, '');
  const sameUri =
    normalize(config.migrationMongoUri) === normalize(config.appMongoUri);

  if (sameUri && !config.allowLiveTarget) {
    throw new Error(
      'MIGRATION_MONGO_URI matches MONGODB_URI (live app database). ' +
        'Set ALLOW_LIVE_TARGET=true only if you intentionally target production.',
    );
  }
}
