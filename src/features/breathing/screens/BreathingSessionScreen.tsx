import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'BreathingSession'>;

export function BreathingSessionScreen({ route }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S09" title={t('breathing.sessionTitle')} subtitle={t('breathing.sessionSubtitle')}>
      <View style={styles.circle}>
        <AppText variant="display">4</AppText>
        <AppText variant="bodySmall">{route.params.exerciseId}</AppText>
      </View>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  circle: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  }
});
