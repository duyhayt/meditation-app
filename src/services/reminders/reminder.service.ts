import type {
  NotificationSchedulerService,
  ReminderService,
  RemindersRepository
} from '@/services/di/types';

export function createReminderService(deps: {
  remindersRepository: RemindersRepository;
  notificationSchedulerService: NotificationSchedulerService;
}): ReminderService {
  return {
    saveReminder: async (params) => {
      const reminder = await deps.remindersRepository.upsert(params);

      if (reminder.isEnabled) {
        await deps.notificationSchedulerService.scheduleReminder({
          reminderId: reminder.id,
          label: reminder.label,
          timeOfDay: reminder.timeOfDay,
          daysOfWeek: reminder.daysOfWeek
        });
      } else {
        await deps.notificationSchedulerService.cancelReminder(reminder.id);
      }

      return reminder;
    },
    setReminderEnabled: async (reminderId, isEnabled) => {
      await deps.remindersRepository.setEnabled(reminderId, isEnabled);

      if (isEnabled) {
        const reminders = await deps.remindersRepository.list();
        const reminder = reminders.find((item) => item.id === reminderId);

        if (reminder) {
          await deps.notificationSchedulerService.scheduleReminder({
            reminderId: reminder.id,
            label: reminder.label,
            timeOfDay: reminder.timeOfDay,
            daysOfWeek: reminder.daysOfWeek
          });
        }

        return;
      }

      await deps.notificationSchedulerService.cancelReminder(reminderId);
    }
  };
}
