import type { TagRecord } from '@/domain/database';
import { createId, getNowIsoString } from '@/services/db/db.utils';
import { upsertSyncMetadata, writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, LoggerService } from '@/services/di/types';

type TagRow = {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
};

function mapTagRow(row: TagRow): TagRecord {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createTagsRepository(deps: {
  databaseService: DatabaseService;
  loggerService: LoggerService;
}) {
  return {
    list: async (): Promise<TagRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<TagRow>('SELECT * FROM tags ORDER BY name COLLATE NOCASE ASC');
      return rows.map(mapTagRow);
    },
    listByDebtId: async (debtId: string): Promise<TagRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<TagRow>(
        `
          SELECT tags.*
          FROM tags
          INNER JOIN debt_tags ON debt_tags.tag_id = tags.id
          WHERE debt_tags.debt_id = ?
          ORDER BY tags.name COLLATE NOCASE ASC
        `,
        debtId
      );
      return rows.map(mapTagRow);
    },
    create: async (name: string, color: string | null): Promise<TagRecord> => {
      const database = await deps.databaseService.getDatabase();
      const id = createId('tag');
      const now = getNowIsoString();
      await database.runAsync(
        'INSERT INTO tags (id, name, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        id,
        name,
        color,
        now,
        now
      );
      await writeActivityLog({ database, entityType: 'tag', entityId: id, action: 'created', payload: { name, color } });
      await upsertSyncMetadata({ database, entityType: 'tag', entityId: id });
      deps.loggerService.info('Tag created', { id });
      return { id, name, color, createdAt: now, updatedAt: now };
    },
    assignToDebt: async (debtId: string, tagId: string): Promise<void> => {
      const database = await deps.databaseService.getDatabase();
      const now = getNowIsoString();
      await database.runAsync(
        'INSERT OR IGNORE INTO debt_tags (debt_id, tag_id, created_at, updated_at) VALUES (?, ?, ?, ?)',
        debtId,
        tagId,
        now,
        now
      );
      await writeActivityLog({ database, entityType: 'debt_tag', entityId: `${debtId}:${tagId}`, action: 'assigned' });
    }
  };
}
