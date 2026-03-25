export type ContentTone = 'meditation' | 'sleep' | 'breathing' | 'course';

export type ContentEntityType =
  | 'meditation'
  | 'course_lesson'
  | 'breathing_exercise'
  | 'sleep_sound';

export type AudioSourceType = 'bundled' | 'stream' | 'downloaded';
export type DownloadStatus = 'queued' | 'downloading' | 'completed' | 'failed';
export type SyncState = 'local_only' | 'pending_upload' | 'synced' | 'conflict';
export type MeditationLevel = 'Beginner' | 'Intermediate';

export type AppSettingRecord = {
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  createdAt: string;
  updatedAt: string;
};

export type CategoryRecord = {
  id: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  coverImageUri: string;
  ambientLabel: string;
  tone: ContentTone;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MeditationRecord = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  durationMinutes: number;
  teacher: string;
  level: MeditationLevel;
  coverImageUri: string;
  thumbnailUri: string;
  tone: ContentTone;
  audioType: AudioSourceType;
  streamUrl: string | null;
  bundledAssetName: string | null;
  contentVersion: number;
  audioVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseRecord = {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  totalMinutes: number;
  coverImageUri: string;
  tone: ContentTone;
  contentVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseLessonRecord = {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  coverImageUri: string;
  tone: ContentTone;
  audioType: AudioSourceType;
  streamUrl: string | null;
  bundledAssetName: string | null;
  contentVersion: number;
  audioVersion: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type BreathingExerciseRecord = {
  id: string;
  title: string;
  pattern: string;
  durationLabel: string;
  durationSeconds: number;
  coverImageUri: string;
  tone: ContentTone;
  audioType: AudioSourceType;
  streamUrl: string | null;
  bundledAssetName: string | null;
  contentVersion: number;
  audioVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type SleepSoundRecord = {
  id: string;
  title: string;
  description: string;
  durationLabel: string;
  durationSeconds: number | null;
  coverImageUri: string;
  tone: ContentTone;
  audioType: AudioSourceType;
  streamUrl: string | null;
  bundledAssetName: string | null;
  contentVersion: number;
  audioVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type FavoriteRecord = {
  id: string;
  contentType: ContentEntityType;
  contentId: string;
  createdAt: string;
  updatedAt: string;
};

export type DownloadRecord = {
  id: string;
  contentType: ContentEntityType;
  contentId: string;
  audioType: AudioSourceType;
  downloadStatus: DownloadStatus;
  remoteUrl: string | null;
  localFileUri: string | null;
  fileSizeBytes: number | null;
  progressPercent: number;
  version: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReminderRecord = {
  id: string;
  label: string;
  timeOfDay: string;
  daysOfWeek: string;
  contentType: ContentEntityType | null;
  contentId: string | null;
  isEnabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SessionHistoryRecord = {
  id: string;
  contentType: ContentEntityType;
  contentId: string;
  sourceType: AudioSourceType;
  startedAt: string;
  endedAt: string | null;
  progressSeconds: number;
  completionRatio: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DailyProgressRecord = {
  id: string;
  progressDate: string;
  totalMeditationSeconds: number;
  completedSessions: number;
  streakQualified: boolean;
  lastSessionAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SyncMetadataRecord = {
  id: string;
  entityType: string;
  entityId: string;
  syncState: SyncState;
  lastSyncedAt: string | null;
  dirty: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OfflineContentMetadataRecord = {
  contentType: ContentEntityType;
  contentId: string;
  title: string;
  artworkUri: string;
  tone: ContentTone;
  durationSeconds: number | null;
  audioType: AudioSourceType;
  streamUrl: string | null;
  bundledAssetName: string | null;
  localFileUri: string | null;
  downloadStatus: DownloadStatus | null;
  contentVersion: number;
  audioVersion: number;
  isFavorite: boolean;
  isAvailableOffline: boolean;
  updatedAt: string;
};

export type ResolvedContentSourceKind = 'downloaded' | 'bundled' | 'stream' | 'unavailable';
