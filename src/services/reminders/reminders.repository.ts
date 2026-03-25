import type { ReminderRecord, ReminderStatus } from '@/domain/database';
import {
  createId,
  fromSqliteBoolean,
  getNowIsoString,
  toSqliteBoolean
} from '@/services/db/db.utils';
import { upsertSyncMetadata, writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, LoggerService } from '@/services/di/types';

type ReminderRow = {
  id: string;
  debt_id: string;
  remind_at: string;
  channel: 'local';
  status: ReminderStatus;
  note: string | null;
  is_enabled: number;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
};

type CreateReminderInput = Omit<ReminderRecord, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateReminderInput = Partial<Omit<ReminderRecord, 'id' | 'createdAt' | 'updatedAt'>>;

function mapReminderRow(row: ReminderRow): ReminderRecord {
  return {
    id: row.id,
    debtId: row.debt_id,
    remindAt: row.remind_at,
    channel: row.channel,
    status: row.status,
    note: row.note,
    isEnabled: fromSqliteBoolean(row.is_enabled),
    lastTriggeredAt: row.last_triggered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createRemindersRepository(deps: {
  databaseService: DatabaseService;
  loggerService: LoggerService;
}) {
  return {
    list: async (): Promise<ReminderRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<ReminderRow>(
        'SELECT * FROM reminders ORDER BY remind_at ASC, created_at DESC'
      );
      return rows.map(mapReminderRow);
    },
    listUpcoming: async (limit = 5): Promise<ReminderRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<ReminderRow>(
        `
          SELECT *
          FROM reminders
          WHERE is_enabled = 1 AND status = 'pending'
          ORDER BY remind_at ASC, created_at DESC
          LIMIT ?
        `,
        limit
      );
      return rows.map(mapReminderRow);
    },
    getById: async (id: string): Promise<ReminderRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<ReminderRow>('SELECT * FROM reminders WHERE id = ?', id);
      return row ? mapReminderRow(row) : null;
    },
    listByDebtId: async (debtId: string): Promise<ReminderRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<ReminderRow>(
        'SELECT * FROM reminders WHERE debt_id = ? ORDER BY remind_at ASC',
        debtId
      );
      return rows.map(mapReminderRow);
    },
    create: async (input: CreateReminderInput): Promise<ReminderRecord> => {
      const database = await deps.databaseService.getDatabase();
      const id = createId('reminder');
      const now = getNowIsoString();

      await database.runAsync(
        'INSERT INTO reminders (id, debt_id, remind_at, channel, status, note, is_enabled, last_triggered_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id,
        input.debtId,
        input.remindAt,
        input.channel,
        input.status,
        input.note,
        toSqliteBoolean(input.isEnabled),
        input.lastTriggeredAt,
        now,
        now
      );

      await writeActivityLog({
        database,
        entityType: 'reminder',
        entityId: id,
        action: 'created',
        payload: input
      });
      await upsertSyncMetadata({ database, entityType: 'reminder', entityId: id });
      deps.loggerService.info('Reminder created', { id });

      return { id, ...input, createdAt: now, updatedAt: now };
    },
    update: async (id: string, input: UpdateReminderInput): Promise<ReminderRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<ReminderRow>('SELECT * FROM reminders WHERE id = ?', id);

      if (!row) {
        return null;
      }

      const current = mapReminderRow(row);
      const next: ReminderRecord = {
        ...current,
        ...input,
        updatedAt: getNowIsoString()
      };

      await database.runAsync(
        'UPDATE reminders SET debt_id = ?, remind_at = ?, channel = ?, status = ?, note = ?, is_enabled = ?, last_triggered_at = ?, updated_at = ? WHERE id = ?',
        next.debtId,
        next.remindAt,
        next.channel,
        next.status,
        next.note,
        toSqliteBoolean(next.isEnabled),
        next.lastTriggeredAt,
        next.updatedAt,
        id
      );

      await writeActivityLog({
        database,
        entityType: 'reminder',
        entityId: id,
        action: 'updated',
        payload: input
      });
      await upsertSyncMetadata({ database, entityType: 'reminder', entityId: id });

      return next;
    },
    updateStatus: async (id: string, status: ReminderStatus): Promise<ReminderRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<ReminderRow>('SELECT * FROM reminders WHERE id = ?', id);

      if (!row) {
        return null;
      }

      const updatedAt = getNowIsoString();
      const lastTriggeredAt = status === 'sent' ? updatedAt : row.last_triggered_at;

      await database.runAsync(
        'UPDATE reminders SET status = ?, last_triggered_at = ?, updated_at = ? WHERE id = ?',
        status,
        lastTriggeredAt,
        updatedAt,
        id
      );

      await writeActivityLog({
        database,
        entityType: 'reminder',
        entityId: id,
        action: 'status_updated',
        payload: { status }
      });
      await upsertSyncMetadata({ database, entityType: 'reminder', entityId: id });

      return {
        ...mapReminderRow(row),
        status,
        lastTriggeredAt,
        updatedAt
      };
    },
    remove: async (id: string): Promise<void> => {
      const database = await deps.databaseService.getDatabase();
      await database.runAsync('DELETE FROM reminders WHERE id = ?', id);
      await writeActivityLog({ database, entityType: 'reminder', entityId: id, action: 'deleted' });
      await upsertSyncMetadata({ database, entityType: 'reminder', entityId: id });
    }
  };
}
