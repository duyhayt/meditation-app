import { createAudioService } from '@/services/audio/audio.service';
import { createContentRepository } from '@/services/content/content.repository';
import { createDateTimeService } from '@/services/date-time/date-time.service';
import { createDatabaseService } from '@/services/db/database.service';
import { createDownloadService } from '@/services/downloads/download.service';
import { createDownloadsRepository } from '@/services/downloads/downloads.repository';
import { createFavoritesRepository } from '@/services/favorites/favorites.repository';
import { createLocalFileStorageService } from '@/services/files/local-file-storage.service';
import { createSessionHistoryRepository } from '@/services/history/session-history.repository';
import { createLanguageService } from '@/services/language/language.service';
import { createLoggerService } from '@/services/logging/logger.service';
import { createLocalNotificationService } from '@/services/notifications/local-notification.service';
import { createDailyProgressRepository } from '@/services/progress/daily-progress.repository';
import { createReminderService } from '@/services/reminders/reminder.service';
import { createRemindersRepository } from '@/services/reminders/reminders.repository';
import { createSettingsRepository } from '@/services/settings/settings.repository';

import type { AppServices } from './types';

export function createAppServices(): AppServices {
  const loggerService = createLoggerService();
  const databaseService = createDatabaseService({ loggerService });
  const localFileStorageService = createLocalFileStorageService();
  const contentRepository = createContentRepository({ databaseService });
  const downloadsRepository = createDownloadsRepository({ databaseService });
  const sessionHistoryRepository = createSessionHistoryRepository({ databaseService });
  const remindersRepository = createRemindersRepository({ databaseService });
  const notificationSchedulerService = createLocalNotificationService({ loggerService });
  const reminderService = createReminderService({
    remindersRepository,
    notificationSchedulerService
  });
  const audioService = createAudioService({
    contentRepository,
    sessionHistoryRepository,
    localFileStorageService,
    loggerService
  });
  const downloadService = createDownloadService({
    downloadsRepository,
    contentRepository,
    localFileStorageService,
    loggerService
  });

  return {
    languageService: createLanguageService(),
    dateTimeService: createDateTimeService(),
    loggerService,
    databaseService,
    localFileStorageService,
    audioService,
    downloadService,
    notificationSchedulerService,
    reminderService,
    settingsRepository: createSettingsRepository({ databaseService }),
    contentRepository,
    favoritesRepository: createFavoritesRepository({ databaseService }),
    downloadsRepository,
    sessionHistoryRepository,
    dailyProgressRepository: createDailyProgressRepository({ databaseService }),
    remindersRepository
  };
}
