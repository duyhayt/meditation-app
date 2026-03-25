import { seedDevelopmentDatabase } from './seed.service';
import type { SQLiteExecutor } from './sqlite.types';

describe('seed service', () => {
  it('populates content, offline metadata, and dev helper rows', async () => {
    const runAsync = vi.fn(async () => ({ lastInsertRowId: 0, changes: 1 }));
    const database: SQLiteExecutor = {
      execAsync: async () => undefined,
      getFirstAsync: async () => null,
      getAllAsync: async () => [],
      runAsync
    };

    await seedDevelopmentDatabase(database);

    const sql = runAsync.mock.calls
      .map((call: unknown[]) => String(call.at(0) ?? ''))
      .join('\n');

    expect(sql).toContain('INSERT INTO categories');
    expect(sql).toContain('INSERT INTO meditations');
    expect(sql).toContain('INSERT INTO courses');
    expect(sql).toContain('INSERT INTO course_lessons');
    expect(sql).toContain('INSERT INTO breathing_exercises');
    expect(sql).toContain('INSERT INTO sleep_sounds');
    expect(sql).toContain('INSERT INTO downloads');
    expect(sql).toContain('INSERT INTO favorites');
    expect(sql).toContain('INSERT INTO session_history');
    expect(sql).toContain('INSERT INTO daily_progress');
    expect(sql).toContain('INSERT INTO reminders');
    expect(sql).toContain('INSERT INTO sync_metadata');
  });
});
