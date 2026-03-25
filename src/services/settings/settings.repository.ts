import type { AppSettingRecord } from '@/domain/database';
import { getNowIsoString } from '@/services/db/db.utils';
import { writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService } from '@/services/di/types';

type AppSettingRow = {
  key: string;
  value: string;
  value_type: AppSettingRecord['valueType'];
  created_at: string;
  updated_at: string;
};

function mapRow(row: AppSettingRow): AppSettingRecord {
  return {
    key: row.key,
    value: row.value,
    valueType: row.value_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createSettingsRepository(deps: { databaseService: DatabaseService }) {
  return {
    list: async (): Promise<AppSettingRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<AppSettingRow>('SELECT * FROM app_settings ORDER BY key ASC');
      return rows.map(mapRow);
    },
    getByKey: async (key: string): Promise<AppSettingRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<AppSettingRow>('SELECT * FROM app_settings WHERE key = ?', key);
      return row ? mapRow(row) : null;
    },
    upsert: async (key: string, value: string, valueType: AppSettingRecord['valueType']): Promise<AppSettingRecord> => {
      const database = await deps.databaseService.getDatabase();
      const now = getNowIsoString();
      const current = await database.getFirstAsync<AppSettingRow>('SELECT * FROM app_settings WHERE key = ?', key);
      const createdAt = current?.created_at ?? now;

      await database.runAsync(
        `
          INSERT INTO app_settings (key, value, value_type, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET
            value = excluded.value,
            value_type = excluded.value_type,
            updated_at = excluded.updated_at
        `,
        key,
        value,
        valueType,
        createdAt,
        now
      );

      await writeActivityLog({ database, entityType: 'app_setting', entityId: key, action: 'upserted', payload: { value, valueType } });

      return {
        key,
        value,
        valueType,
        createdAt,
        updatedAt: now
      };
    }
  };
}
