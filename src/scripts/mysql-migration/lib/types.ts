import type { Connection } from 'mysql2/promise';
import type { Db, ObjectId } from 'mongodb';
import type { IdMapService } from './id-map';

export interface MigrationConfig {
  mysqlHost: string;
  mysqlPort: number;
  mysqlUser: string;
  mysqlPassword: string;
  mysqlDatabase: string;
  migrationMongoUri: string;
  appMongoUri?: string;
  batchSize: number;
  dryRun: boolean;
  allowLiveTarget: boolean;
}

export interface MigrationContext {
  mysql: Connection;
  mongo: Db;
  idMap: IdMapService;
  config: MigrationConfig;
  dryRun: boolean;
  meta: MigrationMetaStore;
}

export interface MigrationResult {
  mysqlTable: string;
  mongoCollection: string;
  mysqlRows: number;
  inserted: number;
  skipped: number;
  errors: number;
  notes?: string[];
}

export interface MigrationMetaStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  setDryRun?(value: boolean): void;
}

export interface TableForeignKey {
  mysqlColumn: string;
  /** MySQL table used in migration_id_map lookup */
  refTable: string;
  mongoField: string;
  optional?: boolean;
}

export interface TableDefinition {
  mysqlTable: string;
  mongoCollection: string;
  phase: number;
  /** MySQL primary key column */
  mysqlPk: string;
  /** Numeric legacy id field stored on Mongo document */
  numericIdField: string;
  /** `generic` or custom handler key */
  handler: 'generic' | string;
  foreignKeys?: TableForeignKey[];
  /** mysql column -> mongo field */
  columnMap?: Record<string, string>;
  /** mysql columns copied as-is (snake_case preserved) */
  preserveColumns?: string[];
  /** mysql columns to skip */
  skipColumns?: string[];
  /** Treat as date/datetime */
  dateColumns?: string[];
  /** Static fields added to every document */
  staticFields?: Record<string, unknown>;
  dependsOn?: string[];
  notes?: string;
}

export interface MigrationHandler {
  definition: TableDefinition;
  migrate(ctx: MigrationContext): Promise<MigrationResult>;
}

export interface IdMapEntry {
  mysqlTable: string;
  mysqlId: number;
  mongoCollection: string;
  mongoId: ObjectId;
  numericIdField: string;
  legacyNumericId: number;
  migratedAt: Date;
}
