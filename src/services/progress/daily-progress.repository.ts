import type { DailyProgressRecord } from '@/domain/database';
import { createId, fromSqliteBoolean, getNowIsoString, toSqliteBoolean } from '@/services/db/db.utils';
import { writeActivityLog } from '@/services/db/internal-metadata';
import type { DailyProgressRepository, DatabaseService } from '@/services/di/types';

type DailyProgressRow = {
  id: string;
  progress_date: string;
  total_meditation_seconds: number;
  completed_sessions: number;
  streak_qualified: number;
  last_session_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: DailyProgressRow): DailyProgressRecord {
  return {
    id: row.id,
    progressDate: row.progress_date,
    totalMeditationSeconds: row.total_meditation_seconds,
    completedSessions: row.completed_sessions,
    streakQualified: fromSqliteBoolean(row.streak_qualified),
    lastSessionAt: row.last_session_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createDailyProgressRepository(deps: {
  databaseService: DatabaseService;
}): DailyProgressRepository {
  return {
    listRecent: async (limit = 14) => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<DailyProgressRow>(
        'SELECT * FROM daily_progress ORDER BY progress_date DESC LIMIT ?',
        limit
      );
      return rows.map(mapRow);
    },
    upsert: async ({
      progressDate,
      totalMeditationSeconds,
      completedSessions,
      streakQualified,
      lastSessionAt = null
    }) => {
      const database = await deps.databaseService.getDatabase();
      const now = getNowIsoString();
      const current = await database.getFirstAsync<DailyProgressRow>(
        'SELECT * FROM daily_progress WHERE progress_date = ?',
        progressDate
      );

      const record: DailyProgressRecord = {
        id: current?.id ?? createId('progress'),
        progressDate,
        totalMeditationSeconds,
        completedSessions,
        streakQualified,
        lastSessionAt,
        createdAt: current?.created_at ?? now,
        updatedAt: now
      };

      await database.runAsync(
        `
          INSERT INTO daily_progress (
            id, progress_date, total_meditation_seconds, completed_sessions,
            streak_qualified, last_session_at, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(progress_date) DO UPDATE SET
            total_meditation_seconds = excluded.total_meditation_seconds,
            completed_sessions = excluded.completed_sessions,
            streak_qualified = excluded.streak_qualified,
            last_session_at = excluded.last_session_at,
            updated_at = excluded.updated_at
        `,
        record.id,
        record.progressDate,
        record.totalMeditationSeconds,
        record.completedSessions,
        toSqliteBoolean(record.streakQualified),
        record.lastSessionAt,
        record.createdAt,
        record.updatedAt
      );

      await writeActivityLog({
        database,
        entityType: 'daily_progress',
        entityId: record.progressDate,
        action: 'upserted',
        payload: {
          totalMeditationSeconds,
          completedSessions,
          streakQualified,
          lastSessionAt
        }
      });

      return record;
    }
  };
}
