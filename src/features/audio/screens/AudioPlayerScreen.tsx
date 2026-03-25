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
  const heroEyebrow =
    route.params.contentType === 'sleep_sound'
      ? t('audio.contentTypeSleepSound')
      : route.params.contentType === 'course_lesson'
        ? t('audio.contentTypeCourseLesson')
        : t('audio.contentTypeMeditation');

  return (
    <MeditationScreen
      title={t('meditate.playerTitle')}
      subtitle={t('meditate.playerSubtitle')}
      heroImageUri={imageUri}
      heroTitle={t('audio.heroTitle')}
      heroSubtitle={t('audio.heroSubtitle')}
      heroEyebrow={heroEyebrow}
      heroSize="compact"
      showBackButton
    >
      <AppCard elevated style={styles.playerCard}>
        <View style={styles.badges}>
          <ContentBadge label={t('audio.remainingLabel')} icon="timer" />
          <ContentBadge label={route.params.contentId} icon="headphones" />
        </View>
      </AppCard>
      <View style={styles.controls}>
        <AppButton label={t('audio.resume')} iconLeft="play" />
        <AppButton label={t('audio.pause')} iconLeft="pause" variant="secondary" />
        <AppButton label={t('audio.downloadLater')} iconLeft="download" variant="outline" />
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
