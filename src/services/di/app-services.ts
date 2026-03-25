import { createBackupRestoreService } from '@/services/backup/backup-restore.service';
import { createContactsRepository } from '@/services/contacts/contacts.repository';
import { createDateTimeService } from '@/services/date-time/date-time.service';
import { createDatabaseService } from '@/services/db/database.service';
import { createDebtsRepository } from '@/services/debts/debts.repository';
import { createLanguageService } from '@/services/language/language.service';
import { createLoggerService } from '@/services/logging/logger.service';
import { createPaymentsRepository } from '@/services/payments/payments.repository';
import { createReminderSchedulerService } from '@/services/reminder-scheduler/reminder-scheduler.service';
import { createRemindersRepository } from '@/services/reminders/reminders.repository';
import { createSettingsRepository } from '@/services/settings/settings.repository';
import { createStatisticsRepository } from '@/services/statistics/statistics.repository';
import { createTagsRepository } from '@/services/tags/tags.repository';

import type { AppServices } from './types';

export function createAppServices(): AppServices {
  const loggerService = createLoggerService();
  const databaseService = createDatabaseService({ loggerService });
  const contactsRepository = createContactsRepository({ databaseService, loggerService });
  const debtsRepository = createDebtsRepository({ databaseService, loggerService });
  const remindersRepository = createRemindersRepository({ databaseService, loggerService });

  return {
    languageService: createLanguageService(),
    dateTimeService: createDateTimeService(),
    loggerService,
    databaseService,
    backupRestoreService: createBackupRestoreService({ databaseService, loggerService }),
    contactsRepository,
    debtsRepository,
    paymentsRepository: createPaymentsRepository({ databaseService, debtsRepository, loggerService }),
    remindersRepository,
    reminderSchedulerService: createReminderSchedulerService({ remindersRepository, loggerService }),
    tagsRepository: createTagsRepository({ databaseService, loggerService }),
    settingsRepository: createSettingsRepository({ databaseService }),
    statisticsRepository: createStatisticsRepository({ databaseService })
  };
}
