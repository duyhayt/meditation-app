import type { ReminderRecord } from '@/domain/database';
import { createId, fromSqliteBoolean, getNowIsoString, toSqliteBoolean } from '@/services/db/db.utils';
import { upsertSyncMetadata, writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, RemindersRepository } from '@/services/di/types';

type ReminderRow = {
  id: string;
  label: string;
  time_of_day: string;
  days_of_week: string;
  content_type: ReminderRecord['contentType'];
  content_id: string | null;
  is_enabled: number;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: ReminderRow): ReminderRecord {
  return {
    id: row.id,
    label: row.label,
    timeOfDay: row.time_of_day,
    daysOfWeek: row.days_of_week,
    contentType: row.content_type,
    contentId: row.content_id,
    isEnabled: fromSqliteBoolean(row.is_enabled),
    lastTriggeredAt: row.last_triggered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createRemindersRepository(deps: { databaseService: DatabaseService }): RemindersRepository {
  return {
    list: async () => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<ReminderRow>(
        'SELECT * FROM reminders ORDER BY time_of_day ASC, label ASC'
      );
      return rows.map(mapRow);
    },
    upsert: async ({
      id,
      label,
      timeOfDay,
      daysOfWeek,
      contentType = null,
      contentId = null,
      isEnabled,
      lastTriggeredAt = null
    }) => {
      const database = await deps.databaseService.getDatabase();
      const now = getNowIsoString();
      const current = id
        ? await database.getFirstAsync<ReminderRow>('SELECT * FROM reminders WHERE id = ?', id)
        : null;

      const record: ReminderRecord = {
        id: current?.id ?? id ?? createId('reminder'),
        label,
        timeOfDay,
        daysOfWeek,
        contentType,
        contentId,
        isEnabled,
        lastTriggeredAt,
        createdAt: current?.created_at ?? now,
        updatedAt: now
      };

      await database.runAsync(
        `
          INSERT INTO reminders (
            id, label, time_of_day, days_of_week, content_type, content_id,
            is_enabled, last_triggered_at, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            label = excluded.label,
            time_of_day = excluded.time_of_day,
            days_of_week = excluded.days_of_week,
            content_type = excluded.content_type,
            content_id = excluded.content_id,
            is_enabled = excluded.is_enabled,
            last_triggered_at = excluded.last_triggered_at,
            updated_at = excluded.updated_at
        `,
        record.id,
        record.label,
        record.timeOfDay,
        record.daysOfWeek,
        record.contentType,
        record.contentId,
        toSqliteBoolean(record.isEnabled),
        record.lastTriggeredAt,
        record.createdAt,
        record.updatedAt
      );

      await writeActivityLog({
        database,
        entityType: 'reminder',
        entityId: record.id,
        action: current ? 'updated' : 'created',
        payload: { label, timeOfDay, daysOfWeek, contentType, contentId, isEnabled }
      });
      await upsertSyncMetadata({
        database,
        entityType: 'reminder',
        entityId: record.id
      });

      return record;
    },
    setEnabled: async (reminderId, isEnabled) => {
      const database = await deps.databaseService.getDatabase();
      const now = getNowIsoString();
      await database.runAsync(
        'UPDATE reminders SET is_enabled = ?, updated_at = ? WHERE id = ?',
        toSqliteBoolean(isEnabled),
        now,
        reminderId
      );
      await writeActivityLog({
        database,
        entityType: 'reminder',
        entityId: reminderId,
        action: isEnabled ? 'enabled' : 'disabled'
      });
      await upsertSyncMetadata({
        database,
        entityType: 'reminder',
        entityId: reminderId
      });
    }
  };
}
