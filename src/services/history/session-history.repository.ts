import type { SessionHistoryRecord } from '@/domain/database';
import { createId, fromSqliteBoolean, getNowIsoString, toSqliteBoolean } from '@/services/db/db.utils';
import { writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, SessionHistoryRepository } from '@/services/di/types';

type SessionHistoryRow = {
  id: string;
  content_type: SessionHistoryRecord['contentType'];
  content_id: string;
  source_type: SessionHistoryRecord['sourceType'];
  started_at: string;
  ended_at: string | null;
  progress_seconds: number;
  completion_ratio: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
};

function mapRow(row: SessionHistoryRow): SessionHistoryRecord {
  return {
    id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    sourceType: row.source_type,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    progressSeconds: row.progress_seconds,
    completionRatio: row.completion_ratio,
    isCompleted: fromSqliteBoolean(row.is_completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createSessionHistoryRepository(deps: {
  databaseService: DatabaseService;
}): SessionHistoryRepository {
  return {
    listRecent: async (limit = 20) => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<SessionHistoryRow>(
        'SELECT * FROM session_history ORDER BY started_at DESC LIMIT ?',
        limit
      );
      return rows.map(mapRow);
    },
    getLastPlayed: async () => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<SessionHistoryRow>(
        'SELECT * FROM session_history ORDER BY started_at DESC LIMIT 1'
      );
      return row ? mapRow(row) : null;
    },
    add: async ({
      contentType,
      contentId,
      sourceType,
      startedAt,
      endedAt = null,
      progressSeconds,
      completionRatio,
      isCompleted
    }) => {
      const database = await deps.databaseService.getDatabase();
      const now = getNowIsoString();
      const record: SessionHistoryRecord = {
        id: createId('session'),
        contentType,
        contentId,
        sourceType,
        startedAt,
        endedAt,
        progressSeconds,
        completionRatio,
        isCompleted,
        createdAt: now,
        updatedAt: now
      };

      await database.runAsync(
        `
          INSERT INTO session_history (
            id, content_type, content_id, source_type, started_at, ended_at, progress_seconds,
            completion_ratio, is_completed, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        record.id,
        record.contentType,
        record.contentId,
        record.sourceType,
        record.startedAt,
        record.endedAt,
        record.progressSeconds,
        record.completionRatio,
        toSqliteBoolean(record.isCompleted),
        record.createdAt,
        record.updatedAt
      );

      await writeActivityLog({
        database,
        entityType: 'session_history',
        entityId: record.id,
        action: 'recorded',
        payload: { contentType, contentId, progressSeconds, completionRatio, isCompleted }
      });

      return record;
    }
  };
}
