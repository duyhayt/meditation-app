import type { SQLiteExecutor } from './sqlite.types';

export type DatabaseMigration = {
  version: number;
  description: string;
  up: (database: SQLiteExecutor) => Promise<void>;
};

const migration1Sql = `
  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    value_type TEXT NOT NULL CHECK(value_type IN ('string', 'number', 'boolean', 'json')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    payload_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id, created_at DESC);
`;

export const databaseMigrations: DatabaseMigration[] = [
  {
    version: 1,
    description: 'Create Phase 1 application shell schema',
    up: async (database) => {
      await database.execAsync(migration1Sql);
    }
  }
];

export function getLatestSchemaVersion(): number {
  return databaseMigrations[databaseMigrations.length - 1]?.version ?? 0;
}

export async function runMigrations(database: SQLiteExecutor, currentVersion: number): Promise<number> {
  let appliedVersion = currentVersion;

  for (const migration of databaseMigrations) {
    if (migration.version > currentVersion) {
      await migration.up(database);
      appliedVersion = migration.version;
    }
  }

  return appliedVersion;
}
