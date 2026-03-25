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
          <ContentBadge label="Enabled" icon="timer" />
          <ContentBadge label="Morning" icon="sparkles" />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">Daily morning reminder</AppText>
          <AppText variant="bodySmall">07:00 • A softer start to the day.</AppText>
        </View>
      </AppCard>

      <AppCard elevated style={styles.card}>
        <View style={styles.badges}>
          <ContentBadge label="Planned" icon="moon" />
          <ContentBadge label="Night" icon="sparkles" />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">Evening wind-down reminder</AppText>
          <AppText variant="bodySmall">21:30 • Return to calm before bed.</AppText>
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
