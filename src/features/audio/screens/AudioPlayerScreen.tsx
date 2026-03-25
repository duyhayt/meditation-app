import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { Button } from '@/components/ui/Button';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AudioPlayer'>;

export function AudioPlayerScreen({ route }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S07" title={t('meditate.playerTitle')} subtitle={t('meditate.playerSubtitle')}>
      <View style={styles.player}>
        <AppText variant="display">12:34</AppText>
        <AppText variant="bodySmall">
          {route.params.contentType} • {route.params.contentId}
        </AppText>
      </View>
      <View style={styles.controls}>
        <Button label="Resume" />
        <Button label="Download later" variant="secondary" />
      </View>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  player: {
    alignItems: 'center',
    gap: 8
  },
  controls: {
    gap: 12
  }
});
