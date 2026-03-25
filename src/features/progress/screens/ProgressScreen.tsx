import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';

export function ProgressScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('progress.title')}
      subtitle={t('progress.subtitle')}
      heroImageUri={mediaLibrary.mountainLake}
      heroTitle="Progress should feel encouraging"
      heroSubtitle="Larger insight cards and calmer spacing make stats feel motivating instead of clinical."
      heroEyebrow="Progress"
      heroSize="compact"
      showBackButton
    >
      <View style={styles.section}>
        <SectionHeader title="Habit signals" description="A calmer rhythm between insight cards makes stats easier to scan." />
        <View style={styles.stack}>
          <MeditationCard title="Daily streak" subtitle="A more visual card for streaks and daily habit confidence." durationLabel="1 day" metaLabel="5 min goal" imageUri={mediaLibrary.sunriseMeditation} tone="course" />
          <MeditationCard title="Mindful minutes" subtitle="Daily progress and completion rules will attach here in later phases." durationLabel="24 min" metaLabel="This week" imageUri={mediaLibrary.clouds} />
        </View>
      </View>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10
  },
  stack: {
    gap: 16
  }
});
