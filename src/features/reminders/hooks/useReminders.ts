import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useReminderSchedulerService, useRemindersRepository } from '@/providers/ServicesProvider';

const REMINDERS_QUERY_KEY = ['reminders'] as const;

export function useRemindersQuery() {
  const repository = useRemindersRepository();

  return useQuery({
    queryKey: REMINDERS_QUERY_KEY,
    queryFn: () => repository.list()
  });
}

export function useReminderDetailQuery(reminderId?: string) {
  const repository = useRemindersRepository();

  return useQuery({
    queryKey: [...REMINDERS_QUERY_KEY, reminderId],
    enabled: Boolean(reminderId),
    queryFn: () => repository.getById(reminderId as string)
  });
}

export function useCreateReminderMutation() {
  const repository = useRemindersRepository();
  const scheduler = useReminderSchedulerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.create,
    onSuccess: async (reminder) => {
      await scheduler.syncReminder(reminder);
      void queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reminders', 'upcoming'] });
    }
  });
}

export function useUpdateReminderMutation() {
  const repository = useRemindersRepository();
  const scheduler = useReminderSchedulerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; changes: Parameters<typeof repository.update>[1] }) =>
      repository.update(input.id, input.changes),
    onSuccess: async (reminder) => {
      if (reminder) {
        await scheduler.syncReminder(reminder);
        void queryClient.setQueryData([...REMINDERS_QUERY_KEY, reminder.id], reminder);
      }
      void queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reminders', 'upcoming'] });
    }
  });
}

export function useUpdateReminderStatusMutation() {
  const repository = useRemindersRepository();
  const scheduler = useReminderSchedulerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; status: 'pending' | 'sent' | 'dismissed' | 'completed' }) =>
      repository.updateStatus(input.id, input.status),
    onSuccess: async (reminder) => {
      if (reminder) {
        await scheduler.syncReminder(reminder);
      }
      void queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reminders', 'upcoming'] });
    }
  });
}

export function useDeleteReminderMutation() {
  const repository = useRemindersRepository();
  const scheduler = useReminderSchedulerService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminderId: string) => {
      await repository.remove(reminderId);
      await scheduler.removeReminder(reminderId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reminders', 'upcoming'] });
    }
  });
}
