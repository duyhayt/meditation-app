import { createDateTimeService } from '@/services/date-time/date-time.service';
import { createDatabaseService } from '@/services/db/database.service';
import { createLanguageService } from '@/services/language/language.service';
import { createLoggerService } from '@/services/logging/logger.service';
import { createSettingsRepository } from '@/services/settings/settings.repository';

import type { AppServices } from './types';

export function createAppServices(): AppServices {
  const loggerService = createLoggerService();
  const databaseService = createDatabaseService({ loggerService });

  return {
    languageService: createLanguageService(),
    dateTimeService: createDateTimeService(),
    loggerService,
    databaseService,
    settingsRepository: createSettingsRepository({ databaseService })
  };
}
