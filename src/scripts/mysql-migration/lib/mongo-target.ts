import { MongoClient, type Db } from 'mongodb';
import type { MigrationConfig, MigrationMetaStore } from './types';

const META_COLLECTION = 'migration_meta';

class DbMetaStore implements MigrationMetaStore {
  private memory = new Map<string, unknown>();
  private dryRun = false;

  constructor(private readonly db: Db) {}

  setDryRun(value: boolean): void {
    this.dryRun = value;
  }

  async get(key: string): Promise<unknown> {
    if (this.memory.has(key)) return this.memory.get(key);
    const row = await this.db.collection(META_COLLECTION).findOne({ key });
    if (row?.value !== undefined) this.memory.set(key, row.value);
    return row?.value;
  }

  async set(key: string, value: unknown): Promise<void> {
    // Cache in memory in all modes so dry runs resolve meta-dependent lookups.
    this.memory.set(key, value);
    if (this.dryRun) return;
    await this.db.collection(META_COLLECTION).updateOne(
      { key },
      { $set: { key, value, updatedAt: new Date() } },
      { upsert: true },
    );
  }
}

export async function connectMigrationMongo(config: MigrationConfig): Promise<{
  client: MongoClient;
  db: Db;
  meta: MigrationMetaStore;
}> {
  const client = new MongoClient(config.migrationMongoUri);
  await client.connect();
  const dbName = new URL(config.migrationMongoUri).pathname.replace(/^\//, '');
  const db = client.db(dbName || 'greenpro_migration');
  return { client, db, meta: new DbMetaStore(db) };
}

export async function ensureMigrationMetaIndexes(db: Db): Promise<void> {
  await db
    .collection(META_COLLECTION)
    .createIndex({ key: 1 }, { unique: true, name: 'uniq_meta_key' });
}

export async function insertBatches<T extends Record<string, unknown>>(
  db: Db,
  collection: string,
  docs: T[],
  dryRun: boolean,
): Promise<number> {
  if (!docs.length) return 0;
  if (dryRun) return docs.length;
  await db.collection(collection).insertMany(docs, { ordered: false });
  return docs.length;
}

export async function countMongoCollection(
  db: Db,
  collection: string,
): Promise<number> {
  return db.collection(collection).countDocuments();
}

const SKIPPED_COLLECTION = 'migration_skipped';

/**
 * Captures a source row that could not be migrated (e.g. missing FK / draft data)
 * so nothing is silently lost. No-op in dry-run mode.
 */
export async function recordSkipped(
  db: Db,
  sourceTable: string,
  legacyId: number | string,
  reason: string,
  row: Record<string, unknown>,
  dryRun: boolean,
): Promise<void> {
  if (dryRun) return;
  await db.collection(SKIPPED_COLLECTION).insertOne({
    sourceTable,
    legacyId,
    reason,
    payload: row,
    skippedAt: new Date(),
  });
}
