import type { SQLiteDatabase } from 'expo-sqlite';

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

export type AppSettingRecord = {
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  createdAt: string;
  updatedAt: string;
};

export type SettingsRepository = {
  list: () => Promise<AppSettingRecord[]>;
  getByKey: (key: string) => Promise<AppSettingRecord | null>;
  upsert: (key: string, value: string, valueType: AppSettingRecord['valueType']) => Promise<AppSettingRecord>;
};

export type AppServices = {
  languageService: LanguageService;
  dateTimeService: DateTimeService;
  loggerService: LoggerService;
  databaseService: DatabaseService;
  settingsRepository: SettingsRepository;
};
