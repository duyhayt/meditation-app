import type { ReminderRecord } from '@/domain/database';
import type { LoggerService, ReminderSchedulerService, RemindersRepository } from '@/services/di/types';

export function createReminderSchedulerService(deps: {
  remindersRepository: RemindersRepository;
  loggerService: LoggerService;
}): ReminderSchedulerService {
  return {
    reconcile: async () => {
      const reminders = await deps.remindersRepository.list();
      const activeCount = reminders.filter((item) => item.isEnabled && item.status === 'pending').length;
      deps.loggerService.info('Reminder scheduler reconciled', { activeCount });
    },
    syncReminder: async (reminder: ReminderRecord) => {
      deps.loggerService.info('Reminder scheduler synced reminder', {
        id: reminder.id,
        remindAt: reminder.remindAt,
        enabled: reminder.isEnabled,
        status: reminder.status
      });
    },
    removeReminder: async (reminderId: string) => {
      deps.loggerService.info('Reminder scheduler removed reminder', { reminderId });
    }
  };
}
