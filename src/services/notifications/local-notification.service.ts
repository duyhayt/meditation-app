import type { LoggerService, NotificationSchedulerService } from '@/services/di/types';

export function createLocalNotificationService(deps: {
  loggerService: LoggerService;
}): NotificationSchedulerService {
  return {
    scheduleReminder: async ({ reminderId, label, timeOfDay, daysOfWeek }) => {
      deps.loggerService.info('Reminder scheduling is abstracted for a later notification implementation', {
        reminderId,
        label,
        timeOfDay,
        daysOfWeek
      });
    },
    cancelReminder: async (reminderId) => {
      deps.loggerService.info('Reminder cancellation is abstracted for a later notification implementation', {
        reminderId
      });
    }
  };
}
