import type { FavoriteRecord } from '@/domain/database';
import { createId, getNowIsoString } from '@/services/db/db.utils';
import { upsertSyncMetadata, writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, FavoritesRepository } from '@/services/di/types';

type FavoriteRow = {
  id: string;
  content_type: FavoriteRecord['contentType'];
  content_id: string;
  created_at: string;
  updated_at: string;
};

function mapRow(row: FavoriteRow): FavoriteRecord {
  return {
    id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createFavoritesRepository(deps: { databaseService: DatabaseService }): FavoritesRepository {
  const isFavorite = async (contentType: FavoriteRecord['contentType'], contentId: string) => {
    const database = await deps.databaseService.getDatabase();
    const row = await database.getFirstAsync<{ id: string }>(
      'SELECT id FROM favorites WHERE content_type = ? AND content_id = ?',
      contentType,
      contentId
    );
    return Boolean(row);
  };

  const add = async (contentType: FavoriteRecord['contentType'], contentId: string) => {
    const database = await deps.databaseService.getDatabase();
    const now = getNowIsoString();
    const existing = await database.getFirstAsync<FavoriteRow>(
      'SELECT * FROM favorites WHERE content_type = ? AND content_id = ?',
      contentType,
      contentId
    );
    const record = {
      id: existing?.id ?? createId('favorite'),
      contentType,
      contentId,
      createdAt: existing?.created_at ?? now,
      updatedAt: now
    };

    await database.runAsync(
      `
        INSERT INTO favorites (id, content_type, content_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(content_type, content_id) DO UPDATE SET
          updated_at = excluded.updated_at
      `,
      record.id,
      record.contentType,
      record.contentId,
      record.createdAt,
      record.updatedAt
    );

    await writeActivityLog({
      database,
      entityType: 'favorite',
      entityId: `${contentType}:${contentId}`,
      action: 'added'
    });
    await upsertSyncMetadata({
      database,
      entityType: 'favorite',
      entityId: `${contentType}:${contentId}`
    });

    return record;
  };

  const remove = async (contentType: FavoriteRecord['contentType'], contentId: string) => {
    const database = await deps.databaseService.getDatabase();
    await database.runAsync(
      'DELETE FROM favorites WHERE content_type = ? AND content_id = ?',
      contentType,
      contentId
    );
    await writeActivityLog({
      database,
      entityType: 'favorite',
      entityId: `${contentType}:${contentId}`,
      action: 'removed'
    });
    await upsertSyncMetadata({
      database,
      entityType: 'favorite',
      entityId: `${contentType}:${contentId}`
    });
  };

  return {
    list: async () => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<FavoriteRow>(
        'SELECT * FROM favorites ORDER BY updated_at DESC'
      );
      return rows.map(mapRow);
    },
    isFavorite,
    add,
    remove,
    toggle: async (contentType, contentId) => {
      const existing = await isFavorite(contentType, contentId);

      if (existing) {
        await remove(contentType, contentId);
        return false;
      }

      await add(contentType, contentId);
      return true;
    }
  };
}
