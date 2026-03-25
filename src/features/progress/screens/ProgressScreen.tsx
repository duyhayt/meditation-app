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
      heroTitle={t('progress.heroTitle')}
      heroSubtitle={t('progress.heroSubtitle')}
      heroEyebrow={t('progress.heroEyebrow')}
      heroSize="compact"
      showBackButton
    >
      <View style={styles.section}>
        <SectionHeader title={t('progress.sectionTitle')} description={t('progress.sectionDescription')} />
        <View style={styles.stack}>
          <MeditationCard title={t('progress.streakTitle')} subtitle={t('progress.streakSubtitle')} durationLabel={t('progress.streakDuration')} metaLabel={t('progress.streakMeta')} imageUri={mediaLibrary.sunriseMeditation} tone="course" />
          <MeditationCard title={t('progress.minutesTitle')} subtitle={t('progress.minutesSubtitle')} durationLabel={t('progress.minutesDuration')} metaLabel={t('progress.minutesMeta')} imageUri={mediaLibrary.clouds} />
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
