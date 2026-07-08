import { ObjectId, type Db, type AnyBulkWriteOperation } from 'mongodb';
import type { IdMapEntry } from './types';

const COLLECTION = 'migration_id_map';
const FLUSH_THRESHOLD = 2000;

export class IdMapService {
  private cache = new Map<string, ObjectId>();
  private pending: AnyBulkWriteOperation[] = [];
  private dryRun = false;

  constructor(private readonly db: Db) {}

  setDryRun(value: boolean): void {
    this.dryRun = value;
  }

  private key(mysqlTable: string, mysqlId: number): string {
    return `${mysqlTable}:${mysqlId}`;
  }

  async ensureIndexes(): Promise<void> {
    const col = this.db.collection(COLLECTION);
    await col.createIndex(
      { mysqlTable: 1, mysqlId: 1 },
      { unique: true, name: 'uniq_mysql_table_id' },
    );
    await col.createIndex({ mongoCollection: 1, mongoId: 1 });
    await col.createIndex({ legacyNumericId: 1, mongoCollection: 1 });
  }

  /** Registers a mapping. Updates cache immediately; DB write is buffered + bulk-flushed. */
  async register(entry: Omit<IdMapEntry, 'migratedAt'>): Promise<void> {
    this.cache.set(this.key(entry.mysqlTable, entry.mysqlId), entry.mongoId);
    if (this.dryRun) return;

    const doc: IdMapEntry = { ...entry, migratedAt: new Date() };
    this.pending.push({
      updateOne: {
        filter: { mysqlTable: entry.mysqlTable, mysqlId: entry.mysqlId },
        update: { $set: doc },
        upsert: true,
      },
    });

    if (this.pending.length >= FLUSH_THRESHOLD) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.dryRun || this.pending.length === 0) return;
    const ops = this.pending;
    this.pending = [];
    await this.db.collection(COLLECTION).bulkWrite(ops, { ordered: false });
  }

  async resolve(
    mysqlTable: string,
    mysqlId: number | null | undefined,
  ): Promise<ObjectId | null> {
    if (mysqlId === null || mysqlId === undefined || mysqlId === 0) {
      return null;
    }
    const id = Number(mysqlId);
    if (!Number.isFinite(id) || id <= 0) return null;

    const cached = this.cache.get(this.key(mysqlTable, id));
    if (cached) return cached;

    if (this.dryRun) return null;

    const row = await this.db.collection(COLLECTION).findOne({
      mysqlTable,
      mysqlId: id,
    });
    if (!row?.mongoId) return null;
    const oid = row.mongoId as ObjectId;
    this.cache.set(this.key(mysqlTable, id), oid);
    return oid;
  }

  async countByTable(mysqlTable: string): Promise<number> {
    return this.db.collection(COLLECTION).countDocuments({ mysqlTable });
  }

  async preloadTable(mysqlTable: string): Promise<void> {
    const cursor = this.db.collection(COLLECTION).find({ mysqlTable });
    for await (const row of cursor) {
      this.cache.set(
        this.key(mysqlTable, row.mysqlId as number),
        row.mongoId as ObjectId,
      );
    }
  }
}
