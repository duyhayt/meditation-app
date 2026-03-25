import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { breathingExercises } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'BreathingSession'>;

export function BreathingSessionScreen({ route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const exercise = breathingExercises.find((item) => item.id === route.params.exerciseId);

  return (
    <MeditationScreen
      title={t('breathing.sessionTitle')}
      subtitle={t('breathing.sessionSubtitle')}
      heroImageUri={exercise?.coverImageUri}
      heroTitle={exercise?.title ?? t('breathing.sessionTitle')}
      heroSubtitle={exercise?.pattern ?? t('breathing.sessionSubtitle')}
      heroEyebrow={t('breathing.sessionHeroEyebrow')}
      showBackButton
    >
      <View style={styles.center}>
        <AppText variant="display">{t('breathing.countdownLabel')}</AppText>
        <ContentBadge label={exercise?.pattern ?? ''} icon="breath" />
      </View>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  }
});
