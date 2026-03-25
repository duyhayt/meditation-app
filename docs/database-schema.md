# Database Schema - Meditation App Phase 2

Schema version hien tai: `2`.

## Bang noi dung

### `categories`
- PK: `id`
- Muc dich: nhom guided meditation/sleep collection hien thi tren home va meditate flow
- Index: `(tone, sort_order, title)`

### `meditations`
- PK: `id`
- FK: `category_id -> categories.id`
- Muc dich: guided meditation chinh
- Cot offline-first:
  - `audio_type`: `bundled | stream | downloaded`
  - `stream_url`
  - `bundled_asset_name`
  - `content_version`
  - `audio_version`
- Index: `category_id`, `(audio_type, audio_version)`

### `courses`
- PK: `id`
- Muc dich: khoa hoc thiền
- Cot quan trong: `lesson_count`, `total_minutes`, `content_version`
- Index: `title`

### `course_lessons`
- PK: `id`
- FK: `course_id -> courses.id`
- Muc dich: lesson trong khoa hoc, co audio metadata rieng
- Index: `(course_id, sort_order, title)`

### `breathing_exercises`
- PK: `id`
- Muc dich: bai breathing session
- Cot quan trong: `duration_seconds`, `audio_type`, `bundled_asset_name`
- Index: `(duration_seconds, title)`

### `sleep_sounds`
- PK: `id`
- Muc dich: sound ambient/white noise
- Cot quan trong: `duration_label`, `duration_seconds`, `audio_type`
- Index: `title`

## Bang hanh vi nguoi dung

### `session_history`
- PK: `id`
- Muc dich: luu history playback/session de phuc vu continue last session va history screen
- Cot quan trong:
  - `content_type`
  - `source_type`
  - `progress_seconds`
  - `completion_ratio`
  - `is_completed`
- Index: `(started_at DESC, content_type, content_id)`

### `daily_progress`
- PK: `id`
- Unique: `progress_date`
- Muc dich: tong hop progress/ngay de tinh streak va dashboard
- Cot quan trong:
  - `total_meditation_seconds`
  - `completed_sessions`
  - `streak_qualified`
- Index: `progress_date DESC`

### `favorites`
- PK: `id`
- Unique: `(content_type, content_id)`
- Muc dich: danh sach favorite local
- Index: `updated_at DESC`

### `downloads`
- PK: `id`
- Unique: `(content_type, content_id)`
- Muc dich: metadata cho download manager va offline playback
- Cot quan trong:
  - `download_status`: `queued | downloading | completed | failed`
  - `audio_type`
  - `remote_url`
  - `local_file_uri`
  - `progress_percent`
  - `version`
- Luu y: khong luu binary audio trong SQLite
- Index:
  - `(download_status, updated_at DESC)`
  - `local_file_uri`

### `reminders`
- PK: `id`
- Muc dich: data model cho local reminder center
- Cot quan trong:
  - `time_of_day`
  - `days_of_week`
  - `content_type`, `content_id`
  - `is_enabled`
- Index: `(is_enabled, time_of_day)`

## Bang he thong

### `app_settings`
- PK: `key`
- Muc dich: setting local can dong bo voi app preferences va cac phase sau

### `activity_logs`
- PK: `id`
- Muc dich: audit trail local cho cac thao tac repository
- Index: `(entity_type, entity_id, created_at DESC)`

### `sync_metadata`
- PK: `id`
- Unique: `(entity_type, entity_id)`
- Muc dich: giu metadata de mo rong sync phase sau
- Cot quan trong:
  - `sync_state`: `local_only | pending_upload | synced | conflict`
  - `dirty`
  - `last_synced_at`
- Index: `(sync_state, dirty, updated_at DESC)`

### `app_metadata`
- PK: `key`
- Muc dich: internal metadata cho migration runner va dev seed version

## Dev Seed

- Dev seed duoc apply idempotent khi app chay o development mode.
- Nguon data hien tai den tu [src/features/meditation/data/phase-one-content.ts](/Users/duyha/Desktop/super-app/meditation-app/src/features/meditation/data/phase-one-content.ts).
- Seed bao gom content, favorite mau, 1 download mau, 1 session history mau, 1 daily progress mau, 1 reminder mau, va sync metadata mau.
