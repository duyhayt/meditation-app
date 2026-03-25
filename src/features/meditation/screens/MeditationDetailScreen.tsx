import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { Button } from '@/components/ui/Button';
import { getMeditationById } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MeditationDetail'>;

export function MeditationDetailScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const meditation = getMeditationById(route.params.meditationId);

  return (
    <MeditationScreen
      eyebrow="S06"
      title={t('meditate.detailTitle')}
      subtitle={meditation?.description ?? t('meditate.detailSubtitle')}
    >
      <View style={styles.actions}>
        <Button
          label="Play now"
          onPress={() =>
            navigation.navigate('AudioPlayer', {
              contentId: route.params.meditationId,
              contentType: 'meditation'
            })
          }
        />
        <Button label="Set reminder" variant="secondary" onPress={() => navigation.navigate('ReminderCenter')} />
      </View>

      <AppText variant="title">{meditation?.title ?? 'Meditation session'}</AppText>
      <FeatureCard
        icon="favorite"
        eyebrow={`${meditation?.durationMinutes ?? 0} min`}
        title="Favorites + downloads are scaffolded next"
        description="Phase 1 focuses on flow, navigation, design tokens, theme, and multilingual foundations."
        meta={meditation?.teacher}
      />
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12
  }
});
