import * as SQLite from 'expo-sqlite';

import { getLatestSchemaVersion, runMigrations } from '@/services/db/migrations';
import { getLatestSeedVersion, seedDevelopmentDatabase } from '@/services/db/seed.service';
import type { DatabaseService, LoggerService } from '@/services/di/types';

const DATABASE_NAME = 'meditation-app.db';
const REQUIRED_CORE_TABLES = [
  'app_settings',
  'activity_logs',
  'categories',
  'meditations',
  'downloads',
  'favorites',
  'sync_metadata'
] as const;

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initializationPromise: Promise<void> | null = null;

function isDevelopmentEnvironment(): boolean {
  if (typeof __DEV__ !== 'undefined') {
    return __DEV__;
  }

  return process.env.NODE_ENV === 'development';
}

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

async function readMetadataValue(database: SQLite.SQLiteDatabase, key: string): Promise<string | null> {
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ?',
    key
  );

  return row?.value ?? null;
}

async function writeMetadataValue(
  database: SQLite.SQLiteDatabase,
  key: string,
  value: string
): Promise<void> {
  await database.runAsync(
    `
      INSERT INTO app_metadata (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
    key,
    value
  );
}

async function readSchemaVersion(database: SQLite.SQLiteDatabase): Promise<number> {
  return Number((await readMetadataValue(database, 'schema_version')) ?? '0');
}

async function writeSchemaVersion(database: SQLite.SQLiteDatabase, schemaVersion: number): Promise<void> {
  await writeMetadataValue(database, 'schema_version', String(schemaVersion));
}

async function readSeedVersion(database: SQLite.SQLiteDatabase): Promise<number> {
  return Number((await readMetadataValue(database, 'dev_seed_version')) ?? '0');
}

async function writeSeedVersion(database: SQLite.SQLiteDatabase, seedVersion: number): Promise<void> {
  await writeMetadataValue(database, 'dev_seed_version', String(seedVersion));
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
          deps.loggerService.info('Detected incomplete database schema, replaying migrations', {
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

        if (isDevelopmentEnvironment()) {
          const currentSeedVersion = await readSeedVersion(database);
          const latestSeedVersion = getLatestSeedVersion();

          if (currentSeedVersion < latestSeedVersion) {
            await seedDevelopmentDatabase(database);
            await writeSeedVersion(database, latestSeedVersion);
            deps.loggerService.info('Development seed applied', {
              from: currentSeedVersion,
              to: latestSeedVersion
            });
          }
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
