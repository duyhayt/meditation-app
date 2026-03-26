import {
  breathingExercises,
  courseLessons,
  meditationCategories,
  meditationCourses,
  meditations,
  sleepSounds
} from '@/features/meditation/data/phase-one-content';
import { toSqliteBoolean } from '@/services/db/db.utils';

import type { SQLiteExecutor } from './sqlite.types';

const CONTENT_SEED_VERSION = 4;
const DEV_FIXTURE_VERSION = 1;

function getDefaultTimestamp(): string {
  return '2026-03-25T00:00:00.000Z';
}

export function getLatestContentSeedVersion(): number {
  return CONTENT_SEED_VERSION;
}

export function getLatestDevFixtureVersion(): number {
  return DEV_FIXTURE_VERSION;
}

export async function seedCoreContent(database: SQLiteExecutor): Promise<void> {
  const now = getDefaultTimestamp();

  for (const [index, category] of meditationCategories.entries()) {
    await database.runAsync(
      `
        INSERT INTO categories (
          id, title, subtitle, duration_label, cover_image_uri, ambient_label, tone,
          sort_order, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          subtitle = excluded.subtitle,
          duration_label = excluded.duration_label,
          cover_image_uri = excluded.cover_image_uri,
          ambient_label = excluded.ambient_label,
          tone = excluded.tone,
          sort_order = excluded.sort_order,
          updated_at = excluded.updated_at
      `,
      category.id,
      category.title,
      category.subtitle,
      category.durationLabel,
      category.coverImageUri,
      category.ambientLabel,
      category.tone,
      index,
      now,
      now
    );
  }

  for (const meditation of meditations) {
    await database.runAsync(
      `
        INSERT INTO meditations (
          id, category_id, title, description, duration_minutes, teacher, level,
          cover_image_uri, thumbnail_uri, tone, audio_type, stream_url, bundled_asset_name,
          content_version, audio_version, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          category_id = excluded.category_id,
          title = excluded.title,
          description = excluded.description,
          duration_minutes = excluded.duration_minutes,
          teacher = excluded.teacher,
          level = excluded.level,
          cover_image_uri = excluded.cover_image_uri,
          thumbnail_uri = excluded.thumbnail_uri,
          tone = excluded.tone,
          audio_type = excluded.audio_type,
          stream_url = excluded.stream_url,
          bundled_asset_name = excluded.bundled_asset_name,
          content_version = excluded.content_version,
          audio_version = excluded.audio_version,
          updated_at = excluded.updated_at
      `,
      meditation.id,
      meditation.categoryId,
      meditation.title,
      meditation.description,
      meditation.durationMinutes,
      meditation.teacher,
      meditation.level,
      meditation.coverImageUri,
      meditation.thumbnailUri,
      meditation.tone,
      'stream',
      `https://cdn.example.com/audio/meditations/${meditation.id}.mp3`,
      `meditation/${meditation.id}.wav`,
      1,
      1,
      now,
      now
    );
  }

  for (const course of meditationCourses) {
    await database.runAsync(
      `
        INSERT INTO courses (
          id, title, description, lesson_count, total_minutes, cover_image_uri,
          tone, content_version, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          description = excluded.description,
          lesson_count = excluded.lesson_count,
          total_minutes = excluded.total_minutes,
          cover_image_uri = excluded.cover_image_uri,
          tone = excluded.tone,
          content_version = excluded.content_version,
          updated_at = excluded.updated_at
      `,
      course.id,
      course.title,
      course.description,
      course.lessonCount,
      course.totalMinutes,
      course.coverImageUri,
      course.tone,
      1,
      now,
      now
    );
  }

  for (const [index, lesson] of courseLessons.entries()) {
    await database.runAsync(
      `
        INSERT INTO course_lessons (
          id, course_id, title, duration_minutes, cover_image_uri, tone, audio_type,
          stream_url, bundled_asset_name, content_version, audio_version, sort_order, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          course_id = excluded.course_id,
          title = excluded.title,
          duration_minutes = excluded.duration_minutes,
          cover_image_uri = excluded.cover_image_uri,
          tone = excluded.tone,
          audio_type = excluded.audio_type,
          stream_url = excluded.stream_url,
          bundled_asset_name = excluded.bundled_asset_name,
          content_version = excluded.content_version,
          audio_version = excluded.audio_version,
          sort_order = excluded.sort_order,
          updated_at = excluded.updated_at
      `,
      lesson.id,
      lesson.courseId,
      lesson.title,
      lesson.durationMinutes,
      lesson.coverImageUri,
      lesson.tone,
      'stream',
      `https://cdn.example.com/audio/course-lessons/${lesson.id}.mp3`,
      `course/${lesson.id}.wav`,
      1,
      1,
      index,
      now,
      now
    );
  }

  for (const exercise of breathingExercises) {
    await database.runAsync(
      `
        INSERT INTO breathing_exercises (
          id, title, pattern, duration_label, duration_seconds, cover_image_uri, tone,
          audio_type, stream_url, bundled_asset_name, content_version, audio_version, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          pattern = excluded.pattern,
          duration_label = excluded.duration_label,
          duration_seconds = excluded.duration_seconds,
          cover_image_uri = excluded.cover_image_uri,
          tone = excluded.tone,
          audio_type = excluded.audio_type,
          stream_url = excluded.stream_url,
          bundled_asset_name = excluded.bundled_asset_name,
          content_version = excluded.content_version,
          audio_version = excluded.audio_version,
          updated_at = excluded.updated_at
      `,
      exercise.id,
      exercise.title,
      exercise.pattern,
      exercise.durationLabel,
      Number.parseInt(exercise.durationLabel, 10) * 60,
      exercise.coverImageUri,
      exercise.tone,
      'bundled',
      null,
      `breathing/${exercise.id}.mp3`,
      1,
      1,
      now,
      now
    );
  }

  for (const sound of sleepSounds) {
    const durationSeconds =
      sound.durationSeconds ??
      (sound.durationLabel === 'Loop' ? null : Number.parseInt(sound.durationLabel, 10) * 60);

    await database.runAsync(
      `
        INSERT INTO sleep_sounds (
          id, title, description, duration_label, duration_seconds, cover_image_uri, tone,
          audio_type, stream_url, bundled_asset_name, content_version, audio_version, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          description = excluded.description,
          duration_label = excluded.duration_label,
          duration_seconds = excluded.duration_seconds,
          cover_image_uri = excluded.cover_image_uri,
          tone = excluded.tone,
          audio_type = excluded.audio_type,
          stream_url = excluded.stream_url,
          bundled_asset_name = excluded.bundled_asset_name,
          content_version = excluded.content_version,
          audio_version = excluded.audio_version,
          updated_at = excluded.updated_at
      `,
      sound.id,
      sound.title,
      sound.description,
      sound.durationLabel,
      durationSeconds,
      sound.coverImageUri,
      sound.tone,
      sound.audioType ?? 'stream',
      sound.streamUrl ?? `https://cdn.example.com/audio/sleep-sounds/${sound.id}.mp3`,
      sound.bundledAssetName ?? `sleep/${sound.id}.wav`,
      1,
      1,
      now,
      now
    );
  }
}

export async function seedDevelopmentDatabase(database: SQLiteExecutor): Promise<void> {
  const now = getDefaultTimestamp();

  await seedCoreContent(database);

  await database.runAsync(
    `
      INSERT INTO favorites (id, content_type, content_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(content_type, content_id) DO UPDATE SET updated_at = excluded.updated_at
    `,
    'favorite_seed_intro',
    'meditation',
    meditations[0].id,
    now,
    now
  );

  await database.runAsync(
    `
      INSERT INTO downloads (
        id, content_type, content_id, audio_type, download_status, remote_url, local_file_uri,
        file_size_bytes, progress_percent, version, last_error, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(content_type, content_id) DO UPDATE SET
        download_status = excluded.download_status,
        remote_url = excluded.remote_url,
        local_file_uri = excluded.local_file_uri,
        file_size_bytes = excluded.file_size_bytes,
        progress_percent = excluded.progress_percent,
        version = excluded.version,
        updated_at = excluded.updated_at
    `,
    'download_seed_intro',
    'meditation',
    meditations[0].id,
    'stream',
    'failed',
    `https://cdn.example.com/audio/meditations/${meditations[0].id}.mp3`,
    null,
    null,
    0,
    1,
    'Seed download placeholder - use DownloadService to cache locally.',
    now,
    now
  );

  await database.runAsync(
    `
      INSERT INTO session_history (
        id, content_type, content_id, source_type, started_at, ended_at, progress_seconds,
        completion_ratio, is_completed, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO NOTHING
    `,
    'session_seed_recent',
    'meditation',
    meditations[0].id,
    'downloaded',
    '2026-03-24T06:00:00.000Z',
    '2026-03-24T06:05:00.000Z',
    300,
    1,
    toSqliteBoolean(true),
    now,
    now
  );

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
    'progress_seed_today',
    '2026-03-24',
    900,
    2,
    toSqliteBoolean(true),
    '2026-03-24T21:10:00.000Z',
    now,
    now
  );

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
        updated_at = excluded.updated_at
    `,
    'reminder_seed_morning',
    'Morning calm',
    '06:30',
    '1,2,3,4,5',
    'meditation',
    meditations[0].id,
    toSqliteBoolean(true),
    null,
    now,
    now
  );

  await database.runAsync(
    `
      INSERT INTO sync_metadata (
        id, entity_type, entity_id, sync_state, last_synced_at, dirty, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(entity_type, entity_id) DO UPDATE SET
        sync_state = excluded.sync_state,
        last_synced_at = excluded.last_synced_at,
        dirty = excluded.dirty,
        updated_at = excluded.updated_at
    `,
    'sync_seed_favorite',
    'favorite',
    `meditation:${meditations[0].id}`,
    'local_only',
    null,
    toSqliteBoolean(true),
    now,
    now
  );
}
