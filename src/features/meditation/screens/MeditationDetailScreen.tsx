import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { getMeditationById } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MeditationDetail'>;

export function MeditationDetailScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const meditation = getMeditationById(route.params.meditationId);

  return (
    <MeditationScreen
      title={t('meditate.detailTitle')}
      subtitle={meditation?.description ?? t('meditate.detailSubtitle')}
      heroImageUri={meditation?.coverImageUri}
      heroTitle={meditation?.title ?? t('meditate.detailTitle')}
      heroSubtitle={meditation?.description ?? t('meditate.detailSubtitle')}
      heroEyebrow={t('meditate.detailHeroEyebrow', { teacher: meditation?.teacher ?? '', count: meditation?.durationMinutes ?? 0 })}
      heroSize="compact"
      showBackButton
    >
      <View style={styles.badges}>
        <ContentBadge label={t('common.minutesShort', { count: meditation?.durationMinutes ?? 0 })} icon="timer" />
        <ContentBadge label={meditation?.level ?? t('meditate.beginner')} icon="sparkles" />
        <ContentBadge label={meditation?.teacher ?? ''} icon="profile" />
      </View>

      <View style={styles.actions}>
        <AppButton
          label={t('common.playNow')}
          iconLeft="play"
          onPress={() =>
            navigation.navigate('AudioPlayer', {
              contentId: route.params.meditationId,
              contentType: 'meditation'
            })
          }
        />
        <AppButton
          label={t('common.setReminder')}
          iconLeft="reminder"
          variant="secondary"
          onPress={() => navigation.navigate('ReminderCenter')}
        />
      </View>

      <SectionHeader title={t('meditate.whySectionTitle')} description={t('meditate.whySectionDescription')} />
      <AppCard elevated style={styles.noteCard}>
        <View style={styles.badges}>
          <ContentBadge label={t('meditate.detailUiBadge')} icon="sparkles" />
          <ContentBadge label={t('meditate.immersiveBadge')} icon="favorite" />
        </View>
        <View style={styles.noteText}>
          <AppText variant="title">{t('meditate.noteTitle')}</AppText>
          <AppText variant="bodySmall">
            {t('meditate.noteDescription')}
          </AppText>
        </View>
      </AppCard>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  actions: {
    gap: 12
  },
  noteCard: {
    gap: 10
  },
  noteText: {
    gap: 4
  }
});
