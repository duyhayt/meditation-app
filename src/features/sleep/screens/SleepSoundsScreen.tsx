import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { sleepSounds } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

export function SleepSoundsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MeditationScreen eyebrow="S10" title={t('sleep.title')} subtitle={t('sleep.subtitle')}>
      {sleepSounds.map((sound) => (
        <FeatureCard
          key={sound.id}
          icon="wave"
          eyebrow={sound.durationLabel}
          title={sound.title}
          description={sound.description}
          meta="Open player"
          onPress={() =>
            navigation.navigate('AudioPlayer', {
              contentId: sound.id,
              contentType: 'sleep_sound'
            })
          }
        />
      ))}
    </MeditationScreen>
  );
}
