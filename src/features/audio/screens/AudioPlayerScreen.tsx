import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ContentBadge } from '@/components/common/ContentBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  useDownloadContentMutation,
  usePlaybackSnapshot,
  useRemoveDownloadedContentMutation,
  useResolvedContentSource
} from '@/features/content/hooks/use-content-queries';
import { useAudioService } from '@/providers/ServicesProvider';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AudioPlayer'>;

export function AudioPlayerScreen({ route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const audioService = useAudioService();
  const playback = usePlaybackSnapshot();
  const sourceQuery = useResolvedContentSource(route.params.contentType, route.params.contentId);
  const downloadMutation = useDownloadContentMutation(route.params.contentType, route.params.contentId);
  const removeDownloadMutation = useRemoveDownloadedContentMutation(
    route.params.contentType,
    route.params.contentId
  );
  const resolvedSource = sourceQuery.data;
  const metadata = resolvedSource?.metadata ?? null;

  useEffect(() => {
    void audioService.load({
      contentType: route.params.contentType,
      contentId: route.params.contentId,
      autoPlay: true
    });

    return () => {
      void audioService.stop();
    };
  }, [audioService, route.params.contentId, route.params.contentType]);

  const heroEyebrow =
    route.params.contentType === 'sleep_sound'
      ? t('audio.contentTypeSleepSound')
      : route.params.contentType === 'course_lesson'
        ? t('audio.contentTypeCourseLesson')
        : route.params.contentType === 'breathing_exercise'
          ? t('audio.contentTypeBreathing')
          : t('audio.contentTypeMeditation');
  const sourceLabel =
    playback.sourceKind === 'downloaded'
      ? t('common.downloaded')
      : playback.sourceKind === 'bundled'
        ? t('common.bundled')
        : playback.sourceKind === 'stream'
          ? t('common.streaming')
          : t('common.unavailable');
  const durationLabel =
    playback.durationMillis > 0
      ? t('common.minutesShort', { count: Math.max(1, Math.round(playback.durationMillis / 60000)) })
      : t('audio.loopLabel');
  const progressLabel =
    playback.durationMillis > 0
      ? t('audio.progressLabel', {
          current: Math.floor(playback.positionMillis / 1000),
          total: Math.floor(playback.durationMillis / 1000)
        })
      : t('audio.readyToPlay');
  const isUnavailable = playback.status === 'error' || playback.sourceKind === 'unavailable';

  return (
    <MeditationScreen
      title={t('meditate.playerTitle')}
      subtitle={playback.title ?? metadata?.title ?? t('meditate.playerSubtitle')}
      heroImageUri={playback.artworkUri ?? metadata?.artworkUri ?? undefined}
      heroTitle={playback.title ?? metadata?.title ?? t('audio.heroTitle')}
      heroSubtitle={
        isUnavailable ? t('audio.unavailableSourceDescription') : t('audio.heroSubtitle')
      }
      heroEyebrow={heroEyebrow}
      heroSize="compact"
      showBackButton
    >
      {sourceQuery.isLoading || playback.status === 'loading' ? (
        <LoadingState label={t('common.loadingPlayback')} />
      ) : null}
      {sourceQuery.isError || (!metadata && playback.status !== 'loading') ? (
        <EmptyState
          title={t('meditate.playerTitle')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => {
            void sourceQuery.refetch();
            void audioService.load({
              contentType: route.params.contentType,
              contentId: route.params.contentId,
              autoPlay: true
            });
          }}
        />
      ) : null}
      {metadata ? (
        <>
          <AppCard elevated style={styles.playerCard}>
            <View style={styles.badges}>
              <ContentBadge label={durationLabel} icon="timer" />
              <ContentBadge label={sourceLabel} icon="headphones" />
              <ContentBadge label={progressLabel} icon="continue" />
            </View>
          </AppCard>
          <View style={styles.controls}>
            <AppButton
              label={playback.status === 'playing' ? t('audio.pause') : t('audio.resume')}
              iconLeft={playback.status === 'playing' ? 'pause' : 'play'}
              disabled={isUnavailable}
              onPress={() =>
                playback.status === 'playing'
                  ? void audioService.pause()
                  : void audioService.play()
              }
            />
            <AppButton
              label={t('audio.seekBack')}
              variant="secondary"
              disabled={isUnavailable}
              onPress={() => void audioService.seekBy(-15_000)}
            />
            <AppButton
              label={t('audio.seekForward')}
              variant="secondary"
              disabled={isUnavailable}
              onPress={() => void audioService.seekBy(15_000)}
            />
            <AppButton
              label={
                playback.sourceKind === 'downloaded'
                  ? t('audio.removeDownload')
                  : t('audio.downloadForOffline')
              }
              iconLeft="download"
              variant="outline"
              loading={downloadMutation.isPending || removeDownloadMutation.isPending}
              onPress={() =>
                playback.sourceKind === 'downloaded'
                  ? void removeDownloadMutation.mutateAsync()
                  : void downloadMutation.mutateAsync()
              }
            />
          </View>
          {playback.errorMessage ? (
            <EmptyState
              title={t('audio.errorTitle')}
              description={playback.errorMessage}
            />
          ) : null}
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
  playerCard: {
    gap: 8
  },
  controls: {
    gap: 12
  }
});
