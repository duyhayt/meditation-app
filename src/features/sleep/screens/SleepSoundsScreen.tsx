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
      heroTitle="Night sounds for deeper rest"
      heroSubtitle="A darker, softer visual language separates sleep from the rest of the app."
      heroEyebrow="Sleep"
      heroSize="compact"
    >
      <View style={styles.section}>
        <SectionHeader title="Ambient collection" description="Moonlit cards, deeper overlays, and calmer metadata help this tab feel distinct." />
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
