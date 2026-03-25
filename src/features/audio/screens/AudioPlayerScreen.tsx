import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ContentBadge } from '@/components/common/ContentBadge';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AudioPlayer'>;

export function AudioPlayerScreen({ route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const isSleep = route.params.contentType === 'sleep_sound';
  const imageUri = isSleep ? mediaLibrary.moonSky : mediaLibrary.sunriseMeditation;

  return (
    <MeditationScreen
      title={t('meditate.playerTitle')}
      subtitle={t('meditate.playerSubtitle')}
      heroImageUri={imageUri}
      heroTitle="A calmer full-screen player"
      heroSubtitle="Large visual cover, fewer controls, and stronger focus on playback state."
      heroEyebrow={route.params.contentType}
      heroSize="compact"
      showBackButton
    >
      <AppCard elevated style={styles.playerCard}>
        <View style={styles.badges}>
          <ContentBadge label="12:34 remaining" icon="timer" />
          <ContentBadge label={route.params.contentId} icon="headphones" />
        </View>
      </AppCard>
      <View style={styles.controls}>
        <AppButton label="Resume" iconLeft="play" />
        <AppButton label="Pause" iconLeft="pause" variant="secondary" />
        <AppButton label="Download later" iconLeft="download" variant="outline" />
      </View>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  playerCard: {
    gap: 8
  },
  controls: {
    gap: 12
  }
});
