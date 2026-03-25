import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import {
  useRemindersQuery,
  useSaveReminderMutation,
  useSetReminderEnabledMutation
} from '@/features/content/hooks/use-content-queries';
import { useTheme } from '@/hooks/useTheme';

const presetDaysOptions = [
  { label: 'Mon-Fri', value: '1,2,3,4,5' },
  { label: 'Every day', value: '0,1,2,3,4,5,6' },
  { label: 'Weekend', value: '0,6' }
] as const;

const presetTimeOptions = [
  { label: '06:30', value: '06:30' },
  { label: '12:00', value: '12:00' },
  { label: '21:30', value: '21:30' }
] as const;

export function ReminderCenterScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const remindersQuery = useRemindersQuery();
  const saveReminderMutation = useSaveReminderMutation();
  const setReminderEnabledMutation = useSetReminderEnabledMutation();
  const [label, setLabel] = useState('Evening reset');
  const [timeOfDay, setTimeOfDay] = useState('21:30');
  const [daysOfWeek, setDaysOfWeek] = useState('0,1,2,3,4,5,6');

  const reminders = remindersQuery.data ?? [];

  return (
    <MeditationScreen
      title={t('reminders.title')}
      subtitle={t('reminders.subtitle')}
      showBackButton
      decorativeBackground={false}
    >
      {remindersQuery.isLoading ? <LoadingState label={t('common.loadingReminders')} /> : null}
      {remindersQuery.isError ? (
        <EmptyState
          title={t('reminders.title')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void remindersQuery.refetch()}
        />
      ) : null}

      {!remindersQuery.isLoading && !remindersQuery.isError ? (
        <>
          <AppCard elevated style={styles.formCard}>
            <View style={styles.copy}>
              <AppText variant="title">{t('reminders.createTitle')}</AppText>
              <AppText variant="bodySmall">{t('reminders.createSubtitle')}</AppText>
            </View>
            <TextField
              label={t('reminders.labelField')}
              value={label}
              onChangeText={setLabel}
              placeholder={t('reminders.labelPlaceholder')}
            />
            <SelectField
              label={t('reminders.timeField')}
              value={timeOfDay}
              options={presetTimeOptions.map((option) => ({
                label: option.label,
                value: option.value
              }))}
              onChange={setTimeOfDay}
            />
            <SelectField
              label={t('reminders.daysField')}
              value={daysOfWeek}
              options={presetDaysOptions.map((option) => ({
                label: option.label,
                value: option.value
              }))}
              onChange={setDaysOfWeek}
            />
            <AppButton
              label={t('reminders.saveAction')}
              iconLeft="reminder"
              loading={saveReminderMutation.isPending}
              onPress={() =>
                void saveReminderMutation.mutateAsync({
                  label,
                  timeOfDay,
                  daysOfWeek,
                  isEnabled: true
                })
              }
            />
          </AppCard>

          {reminders.length === 0 ? (
            <EmptyState
              title={t('reminders.emptyTitle')}
              description={t('reminders.emptyDescription')}
            />
          ) : null}

          {reminders.map((reminder) => (
            <AppCard key={reminder.id} elevated style={styles.card}>
              <View style={styles.row}>
                <View style={styles.badges}>
                  <ContentBadge
                    label={reminder.isEnabled ? t('reminders.enabled') : t('reminders.disabled')}
                    icon="timer"
                  />
                  <ContentBadge label={reminder.timeOfDay} icon="calendar" />
                </View>
                <Switch
                  value={reminder.isEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={theme.colors.white}
                  onValueChange={(value) =>
                    void setReminderEnabledMutation.mutateAsync({
                      reminderId: reminder.id,
                      isEnabled: value
                    })
                  }
                />
              </View>
              <View style={styles.copy}>
                <AppText variant="title">{reminder.label}</AppText>
                <AppText variant="bodySmall">
                  {t('reminders.scheduleSummary', { time: reminder.timeOfDay, days: reminder.daysOfWeek })}
                </AppText>
              </View>
            </AppCard>
          ))}
        </>
      ) : null}
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: 12
  },
  card: {
    gap: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  copy: {
    gap: 4
  }
});
