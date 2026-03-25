import type { SQLiteExecutor } from './sqlite.types';

export type DatabaseMigration = {
  version: number;
  description: string;
  up: (database: SQLiteExecutor) => Promise<void>;
};

const migration1Sql = `
  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    value_type TEXT NOT NULL CHECK(value_type IN ('string', 'number', 'boolean', 'json')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    payload_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_activity_logs_entity
    ON activity_logs(entity_type, entity_id, created_at DESC);
`;

const migration2Sql = `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    duration_label TEXT NOT NULL,
    cover_image_uri TEXT NOT NULL,
    ambient_label TEXT NOT NULL,
    tone TEXT NOT NULL CHECK(tone IN ('meditation', 'sleep', 'breathing', 'course')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_categories_tone_sort
    ON categories(tone, sort_order, title);

  CREATE TABLE IF NOT EXISTS meditations (
    id TEXT PRIMARY KEY NOT NULL,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    teacher TEXT NOT NULL,
    level TEXT NOT NULL CHECK(level IN ('Beginner', 'Intermediate')),
    cover_image_uri TEXT NOT NULL,
    thumbnail_uri TEXT NOT NULL,
    tone TEXT NOT NULL CHECK(tone IN ('meditation', 'sleep', 'breathing', 'course')),
    audio_type TEXT NOT NULL CHECK(audio_type IN ('bundled', 'stream', 'downloaded')),
    stream_url TEXT,
    bundled_asset_name TEXT,
    content_version INTEGER NOT NULL DEFAULT 1,
    audio_version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_meditations_category
    ON meditations(category_id, duration_minutes, title);
  CREATE INDEX IF NOT EXISTS idx_meditations_audio
    ON meditations(audio_type, audio_version);

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    lesson_count INTEGER NOT NULL,
    total_minutes INTEGER NOT NULL,
    cover_image_uri TEXT NOT NULL,
    tone TEXT NOT NULL CHECK(tone IN ('meditation', 'sleep', 'breathing', 'course')),
    content_version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_courses_title
    ON courses(title);

  CREATE TABLE IF NOT EXISTS course_lessons (
    id TEXT PRIMARY KEY NOT NULL,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    cover_image_uri TEXT NOT NULL,
    tone TEXT NOT NULL CHECK(tone IN ('meditation', 'sleep', 'breathing', 'course')),
    audio_type TEXT NOT NULL CHECK(audio_type IN ('bundled', 'stream', 'downloaded')),
    stream_url TEXT,
    bundled_asset_name TEXT,
    content_version INTEGER NOT NULL DEFAULT 1,
    audio_version INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_course_lessons_course
    ON course_lessons(course_id, sort_order, title);

  CREATE TABLE IF NOT EXISTS breathing_exercises (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    pattern TEXT NOT NULL,
    duration_label TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    cover_image_uri TEXT NOT NULL,
    tone TEXT NOT NULL CHECK(tone IN ('meditation', 'sleep', 'breathing', 'course')),
    audio_type TEXT NOT NULL CHECK(audio_type IN ('bundled', 'stream', 'downloaded')),
    stream_url TEXT,
    bundled_asset_name TEXT,
    content_version INTEGER NOT NULL DEFAULT 1,
    audio_version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_breathing_duration
    ON breathing_exercises(duration_seconds, title);

  CREATE TABLE IF NOT EXISTS sleep_sounds (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_label TEXT NOT NULL,
    duration_seconds INTEGER,
    cover_image_uri TEXT NOT NULL,
    tone TEXT NOT NULL CHECK(tone IN ('meditation', 'sleep', 'breathing', 'course')),
    audio_type TEXT NOT NULL CHECK(audio_type IN ('bundled', 'stream', 'downloaded')),
    stream_url TEXT,
    bundled_asset_name TEXT,
    content_version INTEGER NOT NULL DEFAULT 1,
    audio_version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sleep_sounds_title
    ON sleep_sounds(title);

  CREATE TABLE IF NOT EXISTS session_history (
    id TEXT PRIMARY KEY NOT NULL,
    content_type TEXT NOT NULL CHECK(content_type IN ('meditation', 'course_lesson', 'breathing_exercise', 'sleep_sound')),
    content_id TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK(source_type IN ('bundled', 'stream', 'downloaded')),
    started_at TEXT NOT NULL,
    ended_at TEXT,
    progress_seconds INTEGER NOT NULL DEFAULT 0,
    completion_ratio REAL NOT NULL DEFAULT 0,
    is_completed INTEGER NOT NULL DEFAULT 0 CHECK(is_completed IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_session_history_recent
    ON session_history(started_at DESC, content_type, content_id);

  CREATE TABLE IF NOT EXISTS daily_progress (
    id TEXT PRIMARY KEY NOT NULL,
    progress_date TEXT NOT NULL UNIQUE,
    total_meditation_seconds INTEGER NOT NULL DEFAULT 0,
    completed_sessions INTEGER NOT NULL DEFAULT 0,
    streak_qualified INTEGER NOT NULL DEFAULT 0 CHECK(streak_qualified IN (0, 1)),
    last_session_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_daily_progress_date
    ON daily_progress(progress_date DESC);

  CREATE TABLE IF NOT EXISTS downloads (
    id TEXT PRIMARY KEY NOT NULL,
    content_type TEXT NOT NULL CHECK(content_type IN ('meditation', 'course_lesson', 'breathing_exercise', 'sleep_sound')),
    content_id TEXT NOT NULL,
    audio_type TEXT NOT NULL CHECK(audio_type IN ('bundled', 'stream', 'downloaded')),
    download_status TEXT NOT NULL CHECK(download_status IN ('queued', 'downloading', 'completed', 'failed')),
    remote_url TEXT,
    local_file_uri TEXT,
    file_size_bytes INTEGER,
    progress_percent INTEGER NOT NULL DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 1,
    last_error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(content_type, content_id)
  );

  CREATE INDEX IF NOT EXISTS idx_downloads_status
    ON downloads(download_status, updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_downloads_local_file
    ON downloads(local_file_uri);

  CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY NOT NULL,
    content_type TEXT NOT NULL CHECK(content_type IN ('meditation', 'course_lesson', 'breathing_exercise', 'sleep_sound')),
    content_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(content_type, content_id)
  );

  CREATE INDEX IF NOT EXISTS idx_favorites_recent
    ON favorites(updated_at DESC);

  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY NOT NULL,
    label TEXT NOT NULL,
    time_of_day TEXT NOT NULL,
    days_of_week TEXT NOT NULL,
    content_type TEXT CHECK(content_type IN ('meditation', 'course_lesson', 'breathing_exercise', 'sleep_sound')),
    content_id TEXT,
    is_enabled INTEGER NOT NULL DEFAULT 1 CHECK(is_enabled IN (0, 1)),
    last_triggered_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_reminders_schedule
    ON reminders(is_enabled, time_of_day);

  CREATE TABLE IF NOT EXISTS sync_metadata (
    id TEXT PRIMARY KEY NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    sync_state TEXT NOT NULL CHECK(sync_state IN ('local_only', 'pending_upload', 'synced', 'conflict')),
    last_synced_at TEXT,
    dirty INTEGER NOT NULL DEFAULT 1 CHECK(dirty IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(entity_type, entity_id)
  );

  CREATE INDEX IF NOT EXISTS idx_sync_metadata_state
    ON sync_metadata(sync_state, dirty, updated_at DESC);
`;

export const databaseMigrations: DatabaseMigration[] = [
  {
    version: 1,
    description: 'Create Phase 1 application shell schema',
    up: async (database) => {
      await database.execAsync(migration1Sql);
    }
  },
  {
    version: 2,
    description: 'Create meditation offline-first content schema and metadata tables',
    up: async (database) => {
      await database.execAsync(migration2Sql);
    }
  }
];

export function getLatestSchemaVersion(): number {
  return databaseMigrations[databaseMigrations.length - 1]?.version ?? 0;
}

export async function runMigrations(database: SQLiteExecutor, currentVersion: number): Promise<number> {
  let appliedVersion = currentVersion;

  for (const migration of databaseMigrations) {
    if (migration.version > currentVersion) {
      await migration.up(database);
      appliedVersion = migration.version;
    }
  }

  return appliedVersion;
}
