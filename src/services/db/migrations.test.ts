import { databaseMigrations, getLatestSchemaVersion, runMigrations } from './migrations';
import type { SQLiteExecutor } from './sqlite.types';

describe('database migrations', () => {
  it('applies the Phase 2 offline-first schema when starting from version 0', async () => {
    const executedSql: string[] = [];
    const database: SQLiteExecutor = {
      execAsync: async (source) => {
        executedSql.push(source);
      },
      getFirstAsync: async () => null,
      getAllAsync: async () => [],
      runAsync: async () => ({ lastInsertRowId: 0, changes: 0 })
    };

    const appliedVersion = await runMigrations(database, 0);
    const sql = executedSql.join('\n');

    expect(appliedVersion).toBe(getLatestSchemaVersion());
    expect(databaseMigrations).toHaveLength(2);
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS app_settings');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS activity_logs');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS categories');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS meditations');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS downloads');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS favorites');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS reminders');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS sync_metadata');
  });
});
