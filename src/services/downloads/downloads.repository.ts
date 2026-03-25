import type { DownloadRecord } from '@/domain/database';
import { createId, getNowIsoString } from '@/services/db/db.utils';
import { upsertSyncMetadata, writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, DownloadsRepository } from '@/services/di/types';

type DownloadRow = {
  id: string;
  content_type: DownloadRecord['contentType'];
  content_id: string;
  audio_type: DownloadRecord['audioType'];
  download_status: DownloadRecord['downloadStatus'];
  remote_url: string | null;
  local_file_uri: string | null;
  file_size_bytes: number | null;
  progress_percent: number;
  version: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: DownloadRow): DownloadRecord {
  return {
    id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    audioType: row.audio_type,
    downloadStatus: row.download_status,
    remoteUrl: row.remote_url,
    localFileUri: row.local_file_uri,
    fileSizeBytes: row.file_size_bytes,
    progressPercent: row.progress_percent,
    version: row.version,
    lastError: row.last_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createDownloadsRepository(deps: { databaseService: DatabaseService }): DownloadsRepository {
  return {
    list: async () => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<DownloadRow>(
        'SELECT * FROM downloads ORDER BY updated_at DESC'
      );
      return rows.map(mapRow);
    },
    getByContent: async (contentType, contentId) => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<DownloadRow>(
        'SELECT * FROM downloads WHERE content_type = ? AND content_id = ?',
        contentType,
        contentId
      );
      return row ? mapRow(row) : null;
    },
    upsert: async ({
      contentType,
      contentId,
      audioType,
      downloadStatus,
      remoteUrl = null,
      localFileUri = null,
      fileSizeBytes = null,
      progressPercent = 0,
      version = 1,
      lastError = null
    }) => {
      const database = await deps.databaseService.getDatabase();
      const now = getNowIsoString();
      const current = await database.getFirstAsync<DownloadRow>(
        'SELECT * FROM downloads WHERE content_type = ? AND content_id = ?',
        contentType,
        contentId
      );

      const record: DownloadRecord = {
        id: current?.id ?? createId('download'),
        contentType,
        contentId,
        audioType,
        downloadStatus,
        remoteUrl,
        localFileUri,
        fileSizeBytes,
        progressPercent,
        version,
        lastError,
        createdAt: current?.created_at ?? now,
        updatedAt: now
      };

      await database.runAsync(
        `
          INSERT INTO downloads (
            id, content_type, content_id, audio_type, download_status, remote_url,
            local_file_uri, file_size_bytes, progress_percent, version, last_error, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(content_type, content_id) DO UPDATE SET
            audio_type = excluded.audio_type,
            download_status = excluded.download_status,
            remote_url = excluded.remote_url,
            local_file_uri = excluded.local_file_uri,
            file_size_bytes = excluded.file_size_bytes,
            progress_percent = excluded.progress_percent,
            version = excluded.version,
            last_error = excluded.last_error,
            updated_at = excluded.updated_at
        `,
        record.id,
        record.contentType,
        record.contentId,
        record.audioType,
        record.downloadStatus,
        record.remoteUrl,
        record.localFileUri,
        record.fileSizeBytes,
        record.progressPercent,
        record.version,
        record.lastError,
        record.createdAt,
        record.updatedAt
      );

      await writeActivityLog({
        database,
        entityType: 'download',
        entityId: `${contentType}:${contentId}`,
        action: downloadStatus,
        payload: { audioType, progressPercent, localFileUri, lastError }
      });
      await upsertSyncMetadata({
        database,
        entityType: 'download',
        entityId: `${contentType}:${contentId}`
      });

      return record;
    },
    remove: async (contentType, contentId) => {
      const database = await deps.databaseService.getDatabase();
      await database.runAsync(
        'DELETE FROM downloads WHERE content_type = ? AND content_id = ?',
        contentType,
        contentId
      );
      await writeActivityLog({
        database,
        entityType: 'download',
        entityId: `${contentType}:${contentId}`,
        action: 'removed'
      });
      await upsertSyncMetadata({
        database,
        entityType: 'download',
        entityId: `${contentType}:${contentId}`
      });
    }
  };
}
