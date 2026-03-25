import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  useDownloadContentMutation,
  useMeditationDetailQuery,
  useResolvedContentSource,
  useRemoveDownloadedContentMutation,
  useToggleFavoriteMutation
} from '@/features/content/hooks/use-content-queries';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MeditationDetail'>;

export function MeditationDetailScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const meditationQuery = useMeditationDetailQuery(route.params.meditationId);
  const metadataQuery = useResolvedContentSource('meditation', route.params.meditationId);
  const toggleFavoriteMutation = useToggleFavoriteMutation('meditation', route.params.meditationId);
  const downloadMutation = useDownloadContentMutation('meditation', route.params.meditationId);
  const removeDownloadMutation = useRemoveDownloadedContentMutation('meditation', route.params.meditationId);
  const meditation = meditationQuery.data;
  const resolvedSource = metadataQuery.data;
  const metadata = resolvedSource?.metadata ?? null;
  const favoriteLabel = metadata?.isFavorite ? t('favorites.removeAction') : t('favorites.saveAction');
  const sourceLabel =
    resolvedSource?.kind === 'downloaded'
      ? t('common.downloaded')
      : resolvedSource?.kind === 'bundled'
        ? t('common.bundled')
        : resolvedSource?.kind === 'stream'
        ? t('common.streaming')
        : t('common.unavailable');
  const canRemoveDownload = resolvedSource?.kind === 'downloaded';

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
      {meditationQuery.isLoading ? <LoadingState label={t('common.loadingSessionDetail')} /> : null}
      {meditationQuery.isError || !meditation ? (
        <EmptyState
          title={t('meditate.detailTitle')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => {
            void meditationQuery.refetch();
            void metadataQuery.refetch();
          }}
        />
      ) : null}

      {meditation ? (
        <>
      <View style={styles.badges}>
        <ContentBadge label={t('common.minutesShort', { count: meditation?.durationMinutes ?? 0 })} icon="timer" />
        <ContentBadge label={meditation?.level ?? t('meditate.beginner')} icon="sparkles" />
        <ContentBadge label={meditation?.teacher ?? ''} icon="profile" />
        <ContentBadge label={sourceLabel} icon="download" />
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
          label={canRemoveDownload ? t('audio.removeDownload') : t('audio.downloadForOffline')}
          iconLeft="download"
          variant="outline"
          loading={downloadMutation.isPending || removeDownloadMutation.isPending}
          onPress={() =>
            canRemoveDownload
              ? void removeDownloadMutation.mutateAsync()
              : void downloadMutation.mutateAsync()
          }
        />
        <AppButton
          label={favoriteLabel}
          iconLeft="favorite"
          variant={metadata?.isFavorite ? 'secondary' : 'outline'}
          loading={toggleFavoriteMutation.isPending}
          onPress={() => void toggleFavoriteMutation.mutateAsync()}
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
        </>
      ) : null}
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
