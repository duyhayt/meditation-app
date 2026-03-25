import { File, Paths } from 'expo-file-system';
import { z } from 'zod';

import { APP_NAME } from '@/config/constants';
import type { DatabaseService, BackupRestoreService, LoggerService } from '@/services/di/types';

const tableNames = [
  'contacts',
  'debts',
  'payments',
  'reminders',
  'tags',
  'debt_tags',
  'attachments',
  'app_settings',
  'activity_logs',
  'sync_metadata'
] as const;

const BackupSchema = z.object({
  meta: z.object({
    appName: z.string(),
    schemaVersion: z.number(),
    exportedAt: z.string()
  }),
  data: z.record(z.string(), z.array(z.record(z.string(), z.union([z.string(), z.number(), z.null()]))))
});

type BackupPayload = z.infer<typeof BackupSchema>;

function buildBackupFileName(timestamp: string): string {
  return `debt-note-backup-${timestamp.replace(/[:.]/g, '-')}.json`;
}

async function readTable(databaseService: DatabaseService, tableName: string) {
  const database = await databaseService.getDatabase();
  return database.getAllAsync<Record<string, string | number | null>>(`SELECT * FROM ${tableName}`);
}

async function clearTables(databaseService: DatabaseService): Promise<void> {
  const database = await databaseService.getDatabase();
  await database.execAsync('PRAGMA foreign_keys = OFF;');
  for (const table of [...tableNames].reverse()) {
    await database.runAsync(`DELETE FROM ${table}`);
  }
  await database.execAsync('PRAGMA foreign_keys = ON;');
}

async function insertRows(
  databaseService: DatabaseService,
  tableName: string,
  rows: Array<Record<string, string | number | null>>
): Promise<void> {
  const database = await databaseService.getDatabase();

  for (const row of rows) {
    const keys = Object.keys(row);
    if (!keys.length) {
      continue;
    }
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map((key) => row[key]);
    await database.runAsync(
      `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
      ...values
    );
  }
}

export function createBackupRestoreService(deps: {
  databaseService: DatabaseService;
  loggerService: LoggerService;
}): BackupRestoreService {
  return {
    exportBackup: async () => {
      const schemaVersion = await deps.databaseService.getSchemaVersion();
      const exportedAt = new Date().toISOString();
      const dataEntries = await Promise.all(
        tableNames.map(async (tableName) => [tableName, await readTable(deps.databaseService, tableName)] as const)
      );
      const payload: BackupPayload = {
        meta: {
          appName: APP_NAME,
          schemaVersion,
          exportedAt
        },
        data: Object.fromEntries(dataEntries)
      };

      const backupDirectory = Paths.document;
      const backupFile = new File(backupDirectory, buildBackupFileName(exportedAt));
      if (!backupDirectory.exists) {
        backupDirectory.create();
      }
      if (backupFile.exists) {
        backupFile.delete();
      }
      backupFile.create();
      backupFile.write(JSON.stringify(payload, null, 2));
      deps.loggerService.info('Backup exported', { uri: backupFile.uri });

      return {
        uri: backupFile.uri,
        fileName: backupFile.name,
        exportedAt,
        schemaVersion
      };
    },
    importBackup: async (fileUri: string) => {
      const sourceFile = new File(fileUri);
      const raw = await sourceFile.text();
      const payload = BackupSchema.parse(JSON.parse(raw));

      await clearTables(deps.databaseService);
      for (const tableName of tableNames) {
        await insertRows(deps.databaseService, tableName, payload.data[tableName] ?? []);
      }
      deps.loggerService.info('Backup restored', { uri: fileUri, schemaVersion: payload.meta.schemaVersion });

      return {
        importedAt: new Date().toISOString(),
        schemaVersion: payload.meta.schemaVersion,
        fileName: sourceFile.name,
        restoredSettings: payload.data.app_settings ?? []
      };
    }
  };
}
