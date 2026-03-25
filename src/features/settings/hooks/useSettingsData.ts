import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useBackupRestoreService, useSettingsRepository } from '@/providers/ServicesProvider';

export function useAppSettingsQuery() {
  const repository = useSettingsRepository();

  return useQuery({
    queryKey: ['app-settings'],
    queryFn: () => repository.list()
  });
}

export function useUpsertAppSettingMutation() {
  const repository = useSettingsRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { key: string; value: string; valueType: 'string' | 'number' | 'boolean' | 'json' }) =>
      repository.upsert(input.key, input.value, input.valueType),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    }
  });
}

export function useExportBackupMutation() {
  const service = useBackupRestoreService();

  return useMutation({
    mutationFn: () => service.exportBackup()
  });
}

export function useImportBackupMutation() {
  const service = useBackupRestoreService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileUri: string) => service.importBackup(fileUri),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contacts'] });
      void queryClient.invalidateQueries({ queryKey: ['debts'] });
      void queryClient.invalidateQueries({ queryKey: ['payments'] });
      void queryClient.invalidateQueries({ queryKey: ['reminders'] });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
      void queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    }
  });
}
