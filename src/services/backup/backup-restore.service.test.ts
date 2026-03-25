import { createBackupRestoreService } from './backup-restore.service';

const fileStore = new Map<string, string>();

vi.mock('expo-file-system', () => {
  class MockDirectory {
    uri: string;
    exists = true;

    constructor(...uris: Array<string | { uri: string }>) {
      this.uri = uris.map((part) => (typeof part === 'string' ? part : part.uri)).join('/');
    }

    create() {
      this.exists = true;
    }
  }

  class MockFile {
    uri: string;

    constructor(...uris: Array<string | { uri: string }>) {
      this.uri = uris.map((part) => (typeof part === 'string' ? part : part.uri)).join('/');
    }

    get exists() {
      return fileStore.has(this.uri);
    }

    get name() {
      return this.uri.split('/').pop() ?? 'file.json';
    }

    create() {
      fileStore.set(this.uri, '');
    }

    delete() {
      fileStore.delete(this.uri);
    }

    write(content: string) {
      fileStore.set(this.uri, content);
    }

    async text() {
      return fileStore.get(this.uri) ?? '';
    }

    static async pickFileAsync() {
      return new MockFile('picked-backup.json');
    }
  }

  return {
    File: MockFile,
    Paths: {
      document: new MockDirectory('document')
    }
  };
});

describe('backup restore service', () => {
  beforeEach(() => {
    fileStore.clear();
  });

  it('exports JSON snapshot and restores it back into the database', async () => {
    const tables = new Map<string, Array<Record<string, string | number | null>>>([
      ['contacts', [{ id: 'contact_1', name: 'Alice', phone: null }]],
      ['debts', [{ id: 'debt_1', contact_id: 'contact_1', title: 'Loan' }]],
      ['payments', []],
      ['reminders', []],
      ['tags', []],
      ['debt_tags', []],
      ['attachments', []],
      ['app_settings', [{ key: 'language', value: 'vi', value_type: 'string' }]],
      ['activity_logs', []],
      ['sync_metadata', []]
    ]);

    const getAllAsync = vi.fn(async (query: string) => {
      const match = query.match(/SELECT \* FROM (\w+)/);
      return match ? (tables.get(match[1]) ?? []) : [];
    });

    const runAsync = vi.fn(async (query: string, ...params: Array<string | number | null>) => {
      if (query.startsWith('DELETE FROM')) {
        const table = query.replace('DELETE FROM ', '').trim();
        tables.set(table, []);
      }

      if (query.startsWith('INSERT INTO')) {
        const match = query.match(/INSERT INTO (\w+) \((.+)\) VALUES/);
        if (match) {
          const table = match[1];
          const keys = match[2].split(',').map((item) => item.trim());
          const row = Object.fromEntries(keys.map((key, index) => [key, params[index] ?? null]));
          tables.set(table, [...(tables.get(table) ?? []), row]);
        }
      }

      return { lastInsertRowId: 0, changes: 1 };
    });

    const service = createBackupRestoreService({
      databaseService: {
        initialize: async () => undefined,
        getDatabase: async () =>
          ({
            getAllAsync,
            runAsync,
            execAsync: vi.fn(async () => undefined),
            getFirstAsync: vi.fn(async () => null)
          }) as never,
        getSchemaVersion: async () => 2
      },
      loggerService: {
        info: vi.fn(),
        error: vi.fn()
      }
    });

    const backup = await service.exportBackup();
    expect(backup.fileName).toContain('debt-note-backup-');
    expect(fileStore.get(backup.uri)).toContain('"appName": "Debt Note App"');

    tables.set('contacts', []);
    tables.set('debts', []);
    tables.set('app_settings', []);

    const restoreResult = await service.importBackup(backup.uri);
    expect(restoreResult.schemaVersion).toBe(2);
    expect(tables.get('contacts')).toHaveLength(1);
    expect(tables.get('debts')).toHaveLength(1);
    expect(tables.get('app_settings')?.[0]?.key).toBe('language');
  });
});
