import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { SleepCard } from '@/components/meditation/SleepCard';
import { sleepSounds } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

export function SleepSoundsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MeditationScreen
      title={t('sleep.title')}
      subtitle={t('sleep.subtitle')}
      heroImageUri={sleepSounds[0]?.coverImageUri}
      heroTitle={t('sleep.heroTitle')}
      heroSubtitle={t('sleep.heroSubtitle')}
      heroEyebrow={t('sleep.heroEyebrow')}
      heroSize="compact"
    >
      <View style={styles.section}>
        <SectionHeader title={t('sleep.sectionTitle')} description={t('sleep.sectionDescription')} />
        <View style={styles.stack}>
          {sleepSounds.map((sound) => (
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
