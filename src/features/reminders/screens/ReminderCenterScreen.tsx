import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { useDebtsQuery } from '@/features/debts/hooks/useDebts';
import { ReminderForm } from '@/features/reminders/components/reminder-form';
import {
  useCreateReminderMutation,
  useDeleteReminderMutation,
  useRemindersQuery,
  useUpdateReminderMutation,
  useUpdateReminderStatusMutation
} from '@/features/reminders/hooks/useReminders';
import { useTheme } from '@/hooks/useTheme';
import type { RootStackParamList } from '@/types/navigation';

export function ReminderCenterScreen(): React.JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'ReminderCenter'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const theme = useTheme();
  const remindersQuery = useRemindersQuery();
  const debtsQuery = useDebtsQuery();
  const createMutation = useCreateReminderMutation();
  const updateMutation = useUpdateReminderMutation();
  const updateStatusMutation = useUpdateReminderStatusMutation();
  const deleteMutation = useDeleteReminderMutation();

  const debtMap = useMemo(
    () => new Map((debtsQuery.data ?? []).map((debt) => [debt.id, debt])),
    [debtsQuery.data]
  );

  const filteredReminders = useMemo(() => {
    if (!route.params?.debtId) {
      return remindersQuery.data ?? [];
    }

    return (remindersQuery.data ?? []).filter((item) => item.debtId === route.params?.debtId);
  }, [remindersQuery.data, route.params?.debtId]);

  if (remindersQuery.isLoading || debtsQuery.isLoading) {
    return <LoadingView label={t('common.loading')} />;
  }

  if (remindersQuery.isError || debtsQuery.isError) {
    return (
      <ErrorState
        message={remindersQuery.error?.message ?? debtsQuery.error?.message ?? 'Reminder center unavailable'}
        onRetry={() => {
          void remindersQuery.refetch();
          void debtsQuery.refetch();
        }}
      />
    );
  }

  return (
    <Screen scrollable>
      <SectionHeader
        eyebrow={t('reminders.title')}
        title={t('reminders.title')}
        description={route.params?.debtId ? t('reminders.filteredDescription') : t('reminders.subtitle')}
      />

      <AppCard elevated>
        <ReminderForm
          debts={debtsQuery.data ?? []}
          defaultValues={{ debtId: route.params?.debtId ?? debtsQuery.data?.[0]?.id ?? '' }}
          submitLabel={t('common.save')}
          loading={createMutation.isPending}
          onSubmit={async (values) => {
            await createMutation.mutateAsync({
              debtId: values.debtId,
              remindAt: values.remindAt,
              note: values.note || null,
              channel: 'local',
              status: values.status,
              isEnabled: values.isEnabled === 'enabled',
              lastTriggeredAt: null
            });
          }}
        />
      </AppCard>

      <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.md }}>
        <AppText variant="title">{t('reminders.listTitle')}</AppText>
        {!filteredReminders.length ? (
          <EmptyState title={t('reminders.title')} description={t('reminders.emptyDescription')} />
        ) : (
          <FlatList
            data={filteredReminders}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const debt = debtMap.get(item.debtId);
              const statusLabel =
                item.status === 'pending'
                  ? t('reminders.statusPending')
                  : item.status === 'sent'
                    ? t('reminders.statusSent')
                    : item.status === 'dismissed'
                      ? t('reminders.statusDismissed')
                      : t('reminders.statusCompleted');

              return (
                <AppCard style={{ marginBottom: theme.spacing.md }}>
                  <View style={{ gap: theme.spacing.sm }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1, gap: theme.spacing.xs }}>
                        <AppText variant="title">{debt?.title ?? t('reminders.reminderForDebt')}</AppText>
                        <AppText variant="bodySmall">{item.remindAt}</AppText>
                      </View>
                      <StatusBadge status={item.status === 'completed' ? 'paid' : item.status === 'sent' ? 'partial' : item.status === 'dismissed' ? 'overdue' : 'unpaid'} label={statusLabel} />
                    </View>
                    <AppText variant="bodySmall">{item.note || t('common.noNote')}</AppText>
                    <AppText variant="bodySmall">{item.isEnabled ? t('reminders.enabled') : t('reminders.disabled')}</AppText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                      <AppButton
                        label={t('reminders.markSent')}
                        variant="secondary"
                        fullWidth={false}
                        onPress={() => void updateStatusMutation.mutateAsync({ id: item.id, status: 'sent' })}
                      />
                      <AppButton
                        label={t('reminders.markDone')}
                        variant="secondary"
                        fullWidth={false}
                        onPress={() => void updateStatusMutation.mutateAsync({ id: item.id, status: 'completed' })}
                      />
                      <AppButton
                        label={item.isEnabled ? t('reminders.toggleOff') : t('reminders.toggleOn')}
                        variant="outline"
                        fullWidth={false}
                        onPress={() =>
                          void updateMutation.mutateAsync({
                            id: item.id,
                            changes: { isEnabled: !item.isEnabled }
                          })
                        }
                      />
                      <AppButton
                        label={t('common.delete')}
                        variant="danger"
                        loading={deleteMutation.isPending}
                        fullWidth={false}
                        onPress={() => void deleteMutation.mutateAsync(item.id)}
                      />
                    </View>
                    {debt ? (
                      <AppButton
                        label={t('debts.detailTitle')}
                        variant="outline"
                        onPress={() => navigation.navigate('DebtDetail', { debtId: debt.id })}
                      />
                    ) : null}
                  </View>
                </AppCard>
              );
            }}
          />
        )}
      </View>
    </Screen>
  );
}
