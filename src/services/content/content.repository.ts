import type {
  BreathingExerciseRecord,
  CategoryRecord,
  ContentEntityType,
  CourseLessonRecord,
  CourseRecord,
  MeditationRecord,
  OfflineContentMetadataRecord,
  SleepSoundRecord
} from '@/domain/database';
import type { DatabaseService } from '@/services/di/types';

type CategoryRow = {
  id: string;
  title: string;
  subtitle: string;
  duration_label: string;
  cover_image_uri: string;
  ambient_label: string;
  tone: CategoryRecord['tone'];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type MeditationRow = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  teacher: string;
  level: MeditationRecord['level'];
  cover_image_uri: string;
  thumbnail_uri: string;
  tone: MeditationRecord['tone'];
  audio_type: MeditationRecord['audioType'];
  stream_url: string | null;
  bundled_asset_name: string | null;
  content_version: number;
  audio_version: number;
  created_at: string;
  updated_at: string;
};

type CourseRow = {
  id: string;
  title: string;
  description: string;
  lesson_count: number;
  total_minutes: number;
  cover_image_uri: string;
  tone: CourseRecord['tone'];
  content_version: number;
  created_at: string;
  updated_at: string;
};

type CourseLessonRow = {
  id: string;
  course_id: string;
  title: string;
  duration_minutes: number;
  cover_image_uri: string;
  tone: CourseLessonRecord['tone'];
  audio_type: CourseLessonRecord['audioType'];
  stream_url: string | null;
  bundled_asset_name: string | null;
  content_version: number;
  audio_version: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type BreathingExerciseRow = {
  id: string;
  title: string;
  pattern: string;
  duration_label: string;
  duration_seconds: number;
  cover_image_uri: string;
  tone: BreathingExerciseRecord['tone'];
  audio_type: BreathingExerciseRecord['audioType'];
  stream_url: string | null;
  bundled_asset_name: string | null;
  content_version: number;
  audio_version: number;
  created_at: string;
  updated_at: string;
};

type SleepSoundRow = {
  id: string;
  title: string;
  description: string;
  duration_label: string;
  duration_seconds: number | null;
  cover_image_uri: string;
  tone: SleepSoundRecord['tone'];
  audio_type: SleepSoundRecord['audioType'];
  stream_url: string | null;
  bundled_asset_name: string | null;
  content_version: number;
  audio_version: number;
  created_at: string;
  updated_at: string;
};

type OfflineMetadataRow = {
  content_id: string;
  title: string;
  artwork_uri: string;
  tone: OfflineContentMetadataRecord['tone'];
  duration_seconds: number | null;
  audio_type: OfflineContentMetadataRecord['audioType'];
  stream_url: string | null;
  bundled_asset_name: string | null;
  local_file_uri: string | null;
  download_status: OfflineContentMetadataRecord['downloadStatus'];
  content_version: number;
  audio_version: number;
  is_favorite: number;
  updated_at: string;
};

function mapCategory(row: CategoryRow): CategoryRecord {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    durationLabel: row.duration_label,
    coverImageUri: row.cover_image_uri,
    ambientLabel: row.ambient_label,
    tone: row.tone,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapMeditation(row: MeditationRow): MeditationRecord {
  return {
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    description: row.description,
    durationMinutes: row.duration_minutes,
    teacher: row.teacher,
    level: row.level,
    coverImageUri: row.cover_image_uri,
    thumbnailUri: row.thumbnail_uri,
    tone: row.tone,
    audioType: row.audio_type,
    streamUrl: row.stream_url,
    bundledAssetName: row.bundled_asset_name,
    contentVersion: row.content_version,
    audioVersion: row.audio_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCourse(row: CourseRow): CourseRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    lessonCount: row.lesson_count,
    totalMinutes: row.total_minutes,
    coverImageUri: row.cover_image_uri,
    tone: row.tone,
    contentVersion: row.content_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCourseLesson(row: CourseLessonRow): CourseLessonRecord {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    durationMinutes: row.duration_minutes,
    coverImageUri: row.cover_image_uri,
    tone: row.tone,
    audioType: row.audio_type,
    streamUrl: row.stream_url,
    bundledAssetName: row.bundled_asset_name,
    contentVersion: row.content_version,
    audioVersion: row.audio_version,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapBreathingExercise(row: BreathingExerciseRow): BreathingExerciseRecord {
  return {
    id: row.id,
    title: row.title,
    pattern: row.pattern,
    durationLabel: row.duration_label,
    durationSeconds: row.duration_seconds,
    coverImageUri: row.cover_image_uri,
    tone: row.tone,
    audioType: row.audio_type,
    streamUrl: row.stream_url,
    bundledAssetName: row.bundled_asset_name,
    contentVersion: row.content_version,
    audioVersion: row.audio_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSleepSound(row: SleepSoundRow): SleepSoundRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    durationLabel: row.duration_label,
    durationSeconds: row.duration_seconds,
    coverImageUri: row.cover_image_uri,
    tone: row.tone,
    audioType: row.audio_type,
    streamUrl: row.stream_url,
    bundledAssetName: row.bundled_asset_name,
    contentVersion: row.content_version,
    audioVersion: row.audio_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapOfflineMetadata(
  contentType: ContentEntityType,
  row: OfflineMetadataRow
): OfflineContentMetadataRecord {
  return {
    contentType,
    contentId: row.content_id,
    title: row.title,
    artworkUri: row.artwork_uri,
    tone: row.tone,
    durationSeconds: row.duration_seconds,
    audioType: row.audio_type,
    streamUrl: row.stream_url,
    bundledAssetName: row.bundled_asset_name,
    localFileUri: row.local_file_uri,
    downloadStatus: row.download_status,
    contentVersion: row.content_version,
    audioVersion: row.audio_version,
    isFavorite: row.is_favorite === 1,
    isAvailableOffline: Boolean(row.local_file_uri),
    updatedAt: row.updated_at
  };
}

const offlineMetadataQueries: Record<ContentEntityType, string> = {
  meditation: `
    SELECT
      meditations.id AS content_id,
      meditations.title,
      meditations.cover_image_uri AS artwork_uri,
      meditations.tone,
      meditations.duration_minutes * 60 AS duration_seconds,
      meditations.audio_type,
      meditations.stream_url,
      meditations.bundled_asset_name,
      downloads.local_file_uri,
      downloads.download_status,
      meditations.content_version,
      meditations.audio_version,
      CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite,
      meditations.updated_at
    FROM meditations
    LEFT JOIN downloads
      ON downloads.content_type = 'meditation' AND downloads.content_id = meditations.id
    LEFT JOIN favorites
      ON favorites.content_type = 'meditation' AND favorites.content_id = meditations.id
    WHERE meditations.id = ?
  `,
  course_lesson: `
    SELECT
      course_lessons.id AS content_id,
      course_lessons.title,
      course_lessons.cover_image_uri AS artwork_uri,
      course_lessons.tone,
      course_lessons.duration_minutes * 60 AS duration_seconds,
      course_lessons.audio_type,
      course_lessons.stream_url,
      course_lessons.bundled_asset_name,
      downloads.local_file_uri,
      downloads.download_status,
      course_lessons.content_version,
      course_lessons.audio_version,
      CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite,
      course_lessons.updated_at
    FROM course_lessons
    LEFT JOIN downloads
      ON downloads.content_type = 'course_lesson' AND downloads.content_id = course_lessons.id
    LEFT JOIN favorites
      ON favorites.content_type = 'course_lesson' AND favorites.content_id = course_lessons.id
    WHERE course_lessons.id = ?
  `,
  breathing_exercise: `
    SELECT
      breathing_exercises.id AS content_id,
      breathing_exercises.title,
      breathing_exercises.cover_image_uri AS artwork_uri,
      breathing_exercises.tone,
      breathing_exercises.duration_seconds,
      breathing_exercises.audio_type,
      breathing_exercises.stream_url,
      breathing_exercises.bundled_asset_name,
      downloads.local_file_uri,
      downloads.download_status,
      breathing_exercises.content_version,
      breathing_exercises.audio_version,
      CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite,
      breathing_exercises.updated_at
    FROM breathing_exercises
    LEFT JOIN downloads
      ON downloads.content_type = 'breathing_exercise' AND downloads.content_id = breathing_exercises.id
    LEFT JOIN favorites
      ON favorites.content_type = 'breathing_exercise' AND favorites.content_id = breathing_exercises.id
    WHERE breathing_exercises.id = ?
  `,
  sleep_sound: `
    SELECT
      sleep_sounds.id AS content_id,
      sleep_sounds.title,
      sleep_sounds.cover_image_uri AS artwork_uri,
      sleep_sounds.tone,
      sleep_sounds.duration_seconds,
      sleep_sounds.audio_type,
      sleep_sounds.stream_url,
      sleep_sounds.bundled_asset_name,
      downloads.local_file_uri,
      downloads.download_status,
      sleep_sounds.content_version,
      sleep_sounds.audio_version,
      CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite,
      sleep_sounds.updated_at
    FROM sleep_sounds
    LEFT JOIN downloads
      ON downloads.content_type = 'sleep_sound' AND downloads.content_id = sleep_sounds.id
    LEFT JOIN favorites
      ON favorites.content_type = 'sleep_sound' AND favorites.content_id = sleep_sounds.id
    WHERE sleep_sounds.id = ?
  `
};

export function createContentRepository(deps: { databaseService: DatabaseService }) {
  return {
    listCategories: async (): Promise<CategoryRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<CategoryRow>(
        'SELECT * FROM categories ORDER BY sort_order ASC, title ASC'
      );
      return rows.map(mapCategory);
    },
    listMeditations: async (categoryId?: string): Promise<MeditationRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = categoryId
        ? await database.getAllAsync<MeditationRow>(
            'SELECT * FROM meditations WHERE category_id = ? ORDER BY duration_minutes ASC, title ASC',
            categoryId
          )
        : await database.getAllAsync<MeditationRow>(
            'SELECT * FROM meditations ORDER BY duration_minutes ASC, title ASC'
          );
      return rows.map(mapMeditation);
    },
    getMeditationById: async (meditationId: string): Promise<MeditationRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<MeditationRow>(
        'SELECT * FROM meditations WHERE id = ?',
        meditationId
      );
      return row ? mapMeditation(row) : null;
    },
    listCourses: async (): Promise<CourseRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<CourseRow>(
        'SELECT * FROM courses ORDER BY title ASC'
      );
      return rows.map(mapCourse);
    },
    getCourseById: async (courseId: string): Promise<CourseRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<CourseRow>(
        'SELECT * FROM courses WHERE id = ?',
        courseId
      );
      return row ? mapCourse(row) : null;
    },
    listCourseLessons: async (courseId: string): Promise<CourseLessonRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<CourseLessonRow>(
        'SELECT * FROM course_lessons WHERE course_id = ? ORDER BY sort_order ASC, title ASC',
        courseId
      );
      return rows.map(mapCourseLesson);
    },
    getCourseLessonById: async (lessonId: string): Promise<CourseLessonRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<CourseLessonRow>(
        'SELECT * FROM course_lessons WHERE id = ?',
        lessonId
      );
      return row ? mapCourseLesson(row) : null;
    },
    listBreathingExercises: async (): Promise<BreathingExerciseRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<BreathingExerciseRow>(
        'SELECT * FROM breathing_exercises ORDER BY duration_seconds ASC, title ASC'
      );
      return rows.map(mapBreathingExercise);
    },
    listSleepSounds: async (): Promise<SleepSoundRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<SleepSoundRow>(
        'SELECT * FROM sleep_sounds ORDER BY title ASC'
      );
      return rows.map(mapSleepSound);
    },
    getOfflineContentMetadata: async (
      contentType: ContentEntityType,
      contentId: string
    ): Promise<OfflineContentMetadataRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<OfflineMetadataRow>(
        offlineMetadataQueries[contentType],
        contentId
      );
      return row ? mapOfflineMetadata(contentType, row) : null;
    }
  };
}
