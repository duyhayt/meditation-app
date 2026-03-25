import { createId, getNowIsoString, toSqliteBoolean } from './db.utils';
import type { SQLiteExecutor } from './sqlite.types';

export async function writeActivityLog(params: {
  database: SQLiteExecutor;
  entityType: string;
  entityId: string;
  action: string;
  payload?: unknown;
}): Promise<void> {
  const now = getNowIsoString();

  await params.database.runAsync(
    'INSERT INTO activity_logs (id, entity_type, entity_id, action, payload_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    createId('activity'),
    params.entityType,
    params.entityId,
    params.action,
    params.payload ? JSON.stringify(params.payload) : null,
    now,
    now
  );
}

export async function upsertSyncMetadata(params: {
  database: SQLiteExecutor;
  entityType: string;
  entityId: string;
  syncState?: 'local_only' | 'pending_upload' | 'synced' | 'conflict';
  dirty?: boolean;
  lastSyncedAt?: string | null;
}): Promise<void> {
  const now = getNowIsoString();

  await params.database.runAsync(
    `
      INSERT INTO sync_metadata (id, entity_type, entity_id, sync_state, last_synced_at, dirty, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(entity_type, entity_id) DO UPDATE SET
        sync_state = excluded.sync_state,
        last_synced_at = excluded.last_synced_at,
        dirty = excluded.dirty,
        updated_at = excluded.updated_at
    `,
    createId('sync'),
    params.entityType,
    params.entityId,
    params.syncState ?? 'local_only',
    params.lastSyncedAt ?? null,
    toSqliteBoolean(params.dirty ?? true),
    now,
    now
  );
}
