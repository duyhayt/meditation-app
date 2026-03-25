import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  AppSettingRecord,
  ContactRecord,
  DebtRecord,
  DebtSummary,
  PaymentRecord,
  ReminderRecord,
  TagRecord
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

export type BackupExportResult = {
  uri: string;
  fileName: string;
  exportedAt: string;
  schemaVersion: number;
};

export type BackupImportResult = {
  importedAt: string;
  schemaVersion: number;
  fileName: string;
  restoredSettings: Array<Record<string, string | number | null>>;
};

export type BackupRestoreService = {
  exportBackup: () => Promise<BackupExportResult>;
  importBackup: (fileUri: string) => Promise<BackupImportResult>;
};

export type ContactsRepository = {
  list: () => Promise<ContactRecord[]>;
  getById: (id: string) => Promise<ContactRecord | null>;
  create: (input: Omit<ContactRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ContactRecord>;
  update: (
    id: string,
    input: Partial<Omit<ContactRecord, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<ContactRecord | null>;
  remove: (id: string) => Promise<void>;
};

export type DebtsRepository = {
  list: () => Promise<DebtRecord[]>;
  getById: (id: string) => Promise<DebtRecord | null>;
  create: (
    input: Omit<DebtRecord, 'id' | 'paidAmount' | 'remainingAmount' | 'status' | 'createdAt' | 'updatedAt'> & {
      paidAmount?: number;
    }
  ) => Promise<DebtRecord>;
  update: (
    id: string,
    input: Partial<
      Omit<DebtRecord, 'id' | 'paidAmount' | 'remainingAmount' | 'status' | 'createdAt' | 'updatedAt'> & {
        paidAmount?: number;
      }
    >
  ) => Promise<DebtRecord | null>;
  remove: (id: string) => Promise<void>;
  recomputeDebtSnapshot: (debtId: string) => Promise<DebtRecord | null>;
};

export type PaymentsRepository = {
  listByDebtId: (debtId: string) => Promise<PaymentRecord[]>;
  create: (input: Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PaymentRecord>;
};

export type RemindersRepository = {
  list: () => Promise<ReminderRecord[]>;
  listUpcoming: (limit?: number) => Promise<ReminderRecord[]>;
  getById: (id: string) => Promise<ReminderRecord | null>;
  listByDebtId: (debtId: string) => Promise<ReminderRecord[]>;
  create: (input: Omit<ReminderRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ReminderRecord>;
  update: (
    id: string,
    input: Partial<Omit<ReminderRecord, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<ReminderRecord | null>;
  updateStatus: (id: string, status: ReminderRecord['status']) => Promise<ReminderRecord | null>;
  remove: (id: string) => Promise<void>;
};

export type ReminderSchedulerService = {
  reconcile: () => Promise<void>;
  syncReminder: (reminder: ReminderRecord) => Promise<void>;
  removeReminder: (reminderId: string) => Promise<void>;
};

export type TagsRepository = {
  list: () => Promise<TagRecord[]>;
  listByDebtId: (debtId: string) => Promise<TagRecord[]>;
  create: (name: string, color: string | null) => Promise<TagRecord>;
  assignToDebt: (debtId: string, tagId: string) => Promise<void>;
};

export type SettingsRepository = {
  list: () => Promise<AppSettingRecord[]>;
  getByKey: (key: string) => Promise<AppSettingRecord | null>;
  upsert: (key: string, value: string, valueType: AppSettingRecord['valueType']) => Promise<AppSettingRecord>;
};

export type DebtStatusBreakdown = {
  unpaidCount: number;
  partialCount: number;
  paidCount: number;
  overdueCount: number;
};

export type StatisticsRepository = {
  getSummary: () => Promise<DebtSummary>;
  getStatusBreakdown: () => Promise<DebtStatusBreakdown>;
};

export type AppServices = {
  languageService: LanguageService;
  dateTimeService: DateTimeService;
  loggerService: LoggerService;
  databaseService: DatabaseService;
  backupRestoreService: BackupRestoreService;
  contactsRepository: ContactsRepository;
  debtsRepository: DebtsRepository;
  paymentsRepository: PaymentsRepository;
  remindersRepository: RemindersRepository;
  reminderSchedulerService: ReminderSchedulerService;
  tagsRepository: TagsRepository;
  settingsRepository: SettingsRepository;
  statisticsRepository: StatisticsRepository;
};
