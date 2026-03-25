import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { SleepCard } from '@/components/meditation/SleepCard';
import { useSleepSoundsQuery } from '@/features/content/hooks/use-content-queries';
import type { RootStackParamList } from '@/types/navigation';

export function SleepSoundsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const sleepQuery = useSleepSoundsQuery();
  const sounds = sleepQuery.data ?? [];

  return (
    <MeditationScreen
      title={t('sleep.title')}
      subtitle={t('sleep.subtitle')}
      heroImageUri={sounds[0]?.coverImageUri}
      heroTitle={t('sleep.heroTitle')}
      heroSubtitle={t('sleep.heroSubtitle')}
      heroEyebrow={t('sleep.heroEyebrow')}
      heroSize="compact"
    >
      {sleepQuery.isLoading ? <LoadingState label={t('common.loadingSleepSounds')} /> : null}
      {sleepQuery.isError ? (
        <EmptyState
          title={t('sleep.title')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void sleepQuery.refetch()}
        />
      ) : null}
      {!sleepQuery.isLoading && !sleepQuery.isError ? (
        <View style={styles.section}>
          <SectionHeader title={t('sleep.sectionTitle')} description={t('sleep.sectionDescription')} />
          <View style={styles.stack}>
            {sounds.map((sound) => (
              <SleepCard
                key={sound.id}
                title={sound.title}
                subtitle={sound.description}
                durationLabel={sound.durationLabel}
                imageUri={sound.coverImageUri}
                onPress={() =>
                  navigation.navigate('AudioPlayer', {
                    contentId: sound.id,
                    contentType: 'sleep_sound'
                  })
                }
              />
            ))}
          </View>
        </View>
      ) : null}
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
