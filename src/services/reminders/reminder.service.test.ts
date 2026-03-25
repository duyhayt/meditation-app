import { createReminderService } from './reminder.service';

describe('reminder service', () => {
  it('schedules enabled reminders after saving', async () => {
    const reminder = {
      id: 'reminder_1',
      label: 'Evening reset',
      timeOfDay: '21:30',
      daysOfWeek: '0,1,2,3,4,5,6',
      contentType: null,
      contentId: null,
      isEnabled: true,
      lastTriggeredAt: null,
      createdAt: '2026-03-26T00:00:00.000Z',
      updatedAt: '2026-03-26T00:00:00.000Z'
    };

    const notificationSchedulerService = {
      scheduleReminder: vi.fn(async () => undefined),
      cancelReminder: vi.fn(async () => undefined)
    };

    const service = createReminderService({
      remindersRepository: {
        upsert: vi.fn(async () => reminder),
        setEnabled: vi.fn(async () => undefined),
        list: vi.fn(async () => [reminder])
      },
      notificationSchedulerService
    });

    const result = await service.saveReminder({
      label: reminder.label,
      timeOfDay: reminder.timeOfDay,
      daysOfWeek: reminder.daysOfWeek,
      isEnabled: true
    });

    expect(result).toEqual(reminder);
    expect(notificationSchedulerService.scheduleReminder).toHaveBeenCalledWith({
      reminderId: reminder.id,
      label: reminder.label,
      timeOfDay: reminder.timeOfDay,
      daysOfWeek: reminder.daysOfWeek
    });
  });
});
