const mockDatabase = {
  execAsync: vi.fn(async () => undefined),
  getFirstAsync: vi.fn(async (query: string) => {
    if (query.includes('SELECT value FROM app_metadata')) {
      return { value: '1' };
    }

    return null;
  }),
  getAllAsync: vi.fn(async () => []),
  runAsync: vi.fn(async () => ({ lastInsertRowId: 0, changes: 1 }))
};

vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(async () => mockDatabase)
}));

import { createDatabaseService } from './database.service';

describe('database service', () => {
  beforeEach(() => {
    mockDatabase.execAsync.mockClear();
    mockDatabase.getFirstAsync.mockClear();
    mockDatabase.getAllAsync.mockClear();
    mockDatabase.runAsync.mockClear();
  });

  it('replays baseline migrations when schema version exists but core tables are missing', async () => {
    const loggerService = {
      info: vi.fn(),
      error: vi.fn()
    };

    const service = createDatabaseService({ loggerService });
    await service.initialize();

    const sql = mockDatabase.execAsync.mock.calls
      .map((call: unknown[]) => String(call.at(0) ?? ''))
      .join('\n');

    expect(sql).toContain('CREATE TABLE IF NOT EXISTS debts');
    expect(sql).toContain('CREATE INDEX IF NOT EXISTS idx_reminders_active_queue');
    expect(mockDatabase.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO app_metadata'),
      'schema_version',
      '2'
    );
  });
});
