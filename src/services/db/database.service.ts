import * as SQLite from 'expo-sqlite';

import { getLatestSchemaVersion, runMigrations } from '@/services/db/migrations';
import type { DatabaseService, LoggerService } from '@/services/di/types';

const DATABASE_NAME = 'meditation-app.db';
const REQUIRED_CORE_TABLES = ['app_settings', 'activity_logs'] as const;

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initializationPromise: Promise<void> | null = null;

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

async function ensureMetadataTable(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}

async function readSchemaVersion(database: SQLite.SQLiteDatabase): Promise<number> {
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ?',
    'schema_version'
  );

  return Number(row?.value ?? '0');
}

async function writeSchemaVersion(database: SQLite.SQLiteDatabase, schemaVersion: number): Promise<void> {
  await database.runAsync(
    `
      INSERT INTO app_metadata (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
    'schema_version',
    String(schemaVersion)
  );
}

async function hasRequiredCoreTables(database: SQLite.SQLiteDatabase): Promise<boolean> {
  const placeholders = REQUIRED_CORE_TABLES.map(() => '?').join(', ');
  const rows = await database.getAllAsync<{ name: string }>(
    `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name IN (${placeholders})
    `,
    ...REQUIRED_CORE_TABLES
  );

  return rows.length === REQUIRED_CORE_TABLES.length;
}

export function createDatabaseService(deps: { loggerService: LoggerService }): DatabaseService {
  const initialize = async () => {
    if (!initializationPromise) {
      initializationPromise = (async () => {
        const database = await openDatabase();
        await ensureMetadataTable(database);

        const currentVersion = await readSchemaVersion(database);
        const coreSchemaReady = await hasRequiredCoreTables(database);
        const effectiveVersion = coreSchemaReady ? currentVersion : 0;

        if (!coreSchemaReady && currentVersion > 0) {
          deps.loggerService.info('Detected incomplete Phase 1 schema, replaying shell migrations', {
            storedVersion: currentVersion
          });
        }

        const latestVersion = await runMigrations(database, effectiveVersion);

        if (latestVersion !== currentVersion || !coreSchemaReady) {
          await writeSchemaVersion(database, latestVersion);
          deps.loggerService.info('Database migrated', {
            from: currentVersion,
            to: latestVersion,
            repairedLegacySchema: !coreSchemaReady
          });
        }
      })().catch((error) => {
        initializationPromise = null;
        throw error;
      });
    }

    return initializationPromise;
  };

  return {
    initialize,
    getDatabase: async () => {
      await initialize();
      return openDatabase();
    },
    getSchemaVersion: async () => {
      await initialize();
      const database = await openDatabase();
      return readSchemaVersion(database);
    }
  };
}

export const DATABASE_SCHEMA_VERSION = getLatestSchemaVersion();
