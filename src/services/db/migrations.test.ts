import { databaseMigrations, getLatestSchemaVersion, runMigrations } from './migrations';
import type { SQLiteExecutor } from './sqlite.types';

describe('database migrations', () => {
  it('applies the full core schema when starting from version 0', async () => {
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
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS contacts');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS debts');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS payments');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS reminders');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS tags');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS debt_tags');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS attachments');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS app_settings');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS activity_logs');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS sync_metadata');
    expect(sql).toContain('CREATE INDEX IF NOT EXISTS idx_reminders_active_queue');
  });
});
