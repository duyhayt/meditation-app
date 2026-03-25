import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  AppSettingRecord,
  AudioSourceType,
  CategoryRecord,
  ContentEntityType,
  CourseLessonRecord,
  CourseRecord,
  DailyProgressRecord,
  DownloadRecord,
  DownloadStatus,
  FavoriteRecord,
  MeditationRecord,
  OfflineContentMetadataRecord,
  ResolvedContentSourceKind,
  ReminderRecord,
  SessionHistoryRecord,
  BreathingExerciseRecord,
  SleepSoundRecord
} from '@/domain/database';
import type { AppLanguage } from '@/localization';

export type LanguageService = {
  getCurrentLanguage: () => AppLanguage;
  applyLanguage: (language: AppLanguage) => Promise<void>;
  setLanguage: (language: AppLanguage) => Promise<void>;
  toggleLanguage: () => Promise<AppLanguage>;
};

export type DateTimeService = {
  formatDateTime: (value: string, locale?: string) => string;
};

export type LoggerService = {
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

export type DatabaseService = {
  initialize: () => Promise<void>;
  getDatabase: () => Promise<SQLiteDatabase>;
  getSchemaVersion: () => Promise<number>;
};

export type LocalFileStorageService = {
  getDownloadsDirectory: () => Promise<string>;
  getDownloadFileUri: (contentType: ContentEntityType, contentId: string) => Promise<string>;
  fileExists: (uri: string | null | undefined) => Promise<boolean>;
  deleteFile: (uri: string) => Promise<void>;
  copyBundledAssetToDownloads: (
    bundledAssetName: string,
    contentType: ContentEntityType,
    contentId: string
  ) => Promise<string>;
};

export type AudioPlaybackSnapshot = {
  contentType: ContentEntityType | null;
  contentId: string | null;
  title: string | null;
  artworkUri: string | null;
  status: 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'error';
  sourceKind: ResolvedContentSourceKind;
  sourceUri: string | null;
  durationMillis: number;
  positionMillis: number;
  progressRatio: number;
  isBuffering: boolean;
  errorMessage: string | null;
};

export type ResolvedPlayableSource = {
  kind: ResolvedContentSourceKind;
  audioType: AudioSourceType | null;
  uri: string | null;
  metadata: OfflineContentMetadataRecord | null;
};

export type AudioService = {
  getSnapshot: () => AudioPlaybackSnapshot;
  subscribe: (listener: () => void) => () => void;
  resolvePlayableSource: (
    contentType: ContentEntityType,
    contentId: string
  ) => Promise<ResolvedPlayableSource>;
  load: (params: {
    contentType: ContentEntityType;
    contentId: string;
    autoPlay?: boolean;
  }) => Promise<AudioPlaybackSnapshot>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  seekBy: (deltaMillis: number) => Promise<void>;
  stop: () => Promise<void>;
};

export type DownloadService = {
  downloadContent: (
    contentType: ContentEntityType,
    contentId: string
  ) => Promise<DownloadRecord | null>;
  removeDownloadedContent: (contentType: ContentEntityType, contentId: string) => Promise<void>;
};

export type NotificationSchedulerService = {
  scheduleReminder: (params: {
    reminderId: string;
    label: string;
    timeOfDay: string;
    daysOfWeek: string;
  }) => Promise<void>;
  cancelReminder: (reminderId: string) => Promise<void>;
};

export type ReminderService = {
  saveReminder: (params: {
    id?: string;
    label: string;
    timeOfDay: string;
    daysOfWeek: string;
    contentType?: ContentEntityType | null;
    contentId?: string | null;
    isEnabled: boolean;
  }) => Promise<ReminderRecord>;
  setReminderEnabled: (reminderId: string, isEnabled: boolean) => Promise<void>;
};

export type SettingsRepository = {
  list: () => Promise<AppSettingRecord[]>;
  getByKey: (key: string) => Promise<AppSettingRecord | null>;
  upsert: (key: string, value: string, valueType: AppSettingRecord['valueType']) => Promise<AppSettingRecord>;
};

export type ContentRepository = {
  listCategories: () => Promise<CategoryRecord[]>;
  listMeditations: (categoryId?: string) => Promise<MeditationRecord[]>;
  getMeditationById: (meditationId: string) => Promise<MeditationRecord | null>;
  listCourses: () => Promise<CourseRecord[]>;
  getCourseById: (courseId: string) => Promise<CourseRecord | null>;
  listCourseLessons: (courseId: string) => Promise<CourseLessonRecord[]>;
  getCourseLessonById: (lessonId: string) => Promise<CourseLessonRecord | null>;
  listBreathingExercises: () => Promise<BreathingExerciseRecord[]>;
  listSleepSounds: () => Promise<SleepSoundRecord[]>;
  getOfflineContentMetadata: (
    contentType: ContentEntityType,
    contentId: string
  ) => Promise<OfflineContentMetadataRecord | null>;
};

export type FavoritesRepository = {
  list: () => Promise<FavoriteRecord[]>;
  isFavorite: (contentType: ContentEntityType, contentId: string) => Promise<boolean>;
  add: (contentType: ContentEntityType, contentId: string) => Promise<FavoriteRecord>;
  remove: (contentType: ContentEntityType, contentId: string) => Promise<void>;
  toggle: (contentType: ContentEntityType, contentId: string) => Promise<boolean>;
};

export type DownloadsRepository = {
  list: () => Promise<DownloadRecord[]>;
  getByContent: (contentType: ContentEntityType, contentId: string) => Promise<DownloadRecord | null>;
  upsert: (params: {
    contentType: ContentEntityType;
    contentId: string;
    audioType: AudioSourceType;
    downloadStatus: DownloadStatus;
    remoteUrl?: string | null;
    localFileUri?: string | null;
    fileSizeBytes?: number | null;
    progressPercent?: number;
    version?: number;
    lastError?: string | null;
  }) => Promise<DownloadRecord>;
  remove: (contentType: ContentEntityType, contentId: string) => Promise<void>;
};

export type SessionHistoryRepository = {
  listRecent: (limit?: number) => Promise<SessionHistoryRecord[]>;
  getLastPlayed: () => Promise<SessionHistoryRecord | null>;
  add: (params: {
    contentType: ContentEntityType;
    contentId: string;
    sourceType: AudioSourceType;
    startedAt: string;
    endedAt?: string | null;
    progressSeconds: number;
    completionRatio: number;
    isCompleted: boolean;
  }) => Promise<SessionHistoryRecord>;
};

export type DailyProgressRepository = {
  listRecent: (limit?: number) => Promise<DailyProgressRecord[]>;
  upsert: (params: {
    progressDate: string;
    totalMeditationSeconds: number;
    completedSessions: number;
    streakQualified: boolean;
    lastSessionAt?: string | null;
  }) => Promise<DailyProgressRecord>;
};

export type RemindersRepository = {
  list: () => Promise<ReminderRecord[]>;
  upsert: (params: {
    id?: string;
    label: string;
    timeOfDay: string;
    daysOfWeek: string;
    contentType?: ContentEntityType | null;
    contentId?: string | null;
    isEnabled: boolean;
    lastTriggeredAt?: string | null;
  }) => Promise<ReminderRecord>;
  setEnabled: (reminderId: string, isEnabled: boolean) => Promise<void>;
};

export type AppServices = {
  languageService: LanguageService;
  dateTimeService: DateTimeService;
  loggerService: LoggerService;
  databaseService: DatabaseService;
  localFileStorageService: LocalFileStorageService;
  audioService: AudioService;
  downloadService: DownloadService;
  notificationSchedulerService: NotificationSchedulerService;
  reminderService: ReminderService;
  settingsRepository: SettingsRepository;
  contentRepository: ContentRepository;
  favoritesRepository: FavoritesRepository;
  downloadsRepository: DownloadsRepository;
  sessionHistoryRepository: SessionHistoryRepository;
  dailyProgressRepository: DailyProgressRepository;
  remindersRepository: RemindersRepository;
};
