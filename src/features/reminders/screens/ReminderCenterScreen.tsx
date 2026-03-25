import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function ReminderCenterScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('reminders.title')}
      subtitle={t('reminders.subtitle')}
      showBackButton
      decorativeBackground={false}
    >
      <AppCard elevated style={styles.card}>
        <View style={styles.badges}>
          <ContentBadge label={t('reminders.enabled')} icon="timer" />
          <ContentBadge label={t('reminders.morning')} icon="sparkles" />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">{t('reminders.dailyMorningTitle')}</AppText>
          <AppText variant="bodySmall">{t('reminders.dailyMorningSubtitle')}</AppText>
        </View>
      </AppCard>

      <AppCard elevated style={styles.card}>
        <View style={styles.badges}>
          <ContentBadge label={t('reminders.planned')} icon="moon" />
          <ContentBadge label={t('reminders.night')} icon="sparkles" />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">{t('reminders.eveningTitle')}</AppText>
          <AppText variant="bodySmall">{t('reminders.eveningSubtitle')}</AppText>
        </View>
      </AppCard>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  card: {
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
