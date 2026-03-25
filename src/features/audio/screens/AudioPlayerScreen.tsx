import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { AppIcon } from '@/components/common/AppIcon';
import { AppIconButton } from '@/components/common/AppIconButton';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Screen } from '@/components/ui/Screen';
import {
  useDownloadContentMutation,
  usePlaybackSnapshot,
  useRemoveDownloadedContentMutation,
  useResolvedContentSource,
  useToggleFavoriteMutation
} from '@/features/content/hooks/use-content-queries';
import { useTheme } from '@/hooks/useTheme';
import { useAudioService } from '@/providers/ServicesProvider';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AudioPlayer'>;

function formatClockFromMillis(value: number): string {
  const totalSeconds = Math.max(0, Math.floor(value / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function AudioPlayerScreen({ route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const audioService = useAudioService();
  const playback = usePlaybackSnapshot();
  const sourceQuery = useResolvedContentSource(route.params.contentType, route.params.contentId);
  const downloadMutation = useDownloadContentMutation(route.params.contentType, route.params.contentId);
  const removeDownloadMutation = useRemoveDownloadedContentMutation(
    route.params.contentType,
    route.params.contentId
  );
  const toggleFavoriteMutation = useToggleFavoriteMutation(
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

  const playerLabel =
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
  const isUnavailable = playback.status === 'error' || playback.sourceKind === 'unavailable';
  const progressRatio =
    playback.durationMillis > 0
      ? Math.min(1, playback.positionMillis / playback.durationMillis)
      : 0;

  return (
    <Screen
      scrollable
      contentStyle={[
        styles.content,
        {
          flexGrow: 1,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.xxxl + theme.spacing.lg
        }
      ]}
      safeAreaEdges={['top', 'left', 'right', 'bottom']}
    >
      <View
        style={[
          styles.backdropOne,
          {
            backgroundColor: theme.colors.heroGlow,
            borderRadius: theme.radius.pill
          }
        ]}
      />
      <View
        style={[
          styles.backdropTwo,
          {
            backgroundColor: theme.colors.heroAccent,
            borderRadius: theme.radius.pill
          }
        ]}
      />

      <AppHeader
        title={playback.title ?? 'Unknown'}
        eyebrow={playerLabel}
        subtitle={sourceLabel}
        showBackButton
        rightSlot={
          <View style={styles.headerActions}>
            <AppIconButton
              icon="favorite"
              onPress={() => void toggleFavoriteMutation.mutateAsync()}
            />
            <AppIconButton
              icon="download"
              onPress={() =>
                playback.sourceKind === 'downloaded'
                  ? void removeDownloadMutation.mutateAsync()
                  : void downloadMutation.mutateAsync()
              }
            />
          </View>
        }
      />

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
          <AppCard elevated style={styles.coverCard}>
            <Image
              source={{ uri: playback.artworkUri ?? metadata.artworkUri }}
              resizeMode="cover"
              style={[styles.coverImage, { borderRadius: theme.radius.xl }]}
            />
          </AppCard>
          <AppCard elevated style={styles.progressCard}>
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: theme.colors.divider,
                  borderRadius: theme.radius.pill
                }
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(progressRatio * 100, 4)}%`,
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.radius.pill
                  }
                ]}
              />
            </View>
            <View style={styles.progressMeta}>
              <AppText variant="caption">{formatClockFromMillis(playback.positionMillis)}</AppText>
              <AppText variant="caption">
                {playback.durationMillis > 0
                  ? formatClockFromMillis(playback.durationMillis)
                  : t('audio.loopLabel')}
              </AppText>
            </View>
          </AppCard>

          <View style={styles.bottomSpacer} />

          <View style={styles.transportRow}>
            <TransportButton
              icon="history"
              onPress={() => void audioService.seekBy(-15_000)}
              disabled={isUnavailable}
            />
            <PlayButton
              icon={playback.status === 'playing' ? 'pause' : 'play'}
              onPress={() =>
                playback.status === 'playing'
                  ? void audioService.pause()
                  : void audioService.play()
              }
              disabled={isUnavailable}
            />
            <TransportButton
              icon="history"
              onPress={() => void audioService.seekBy(15_000)}
              disabled={isUnavailable}
              mirrored
            />
          </View>

          {playback.errorMessage ? (
            <EmptyState title={t('audio.errorTitle')} description={playback.errorMessage} />
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

function TransportButton({
  icon,
  onPress,
  disabled = false,
  mirrored = false
}: {
  icon: 'history';
  onPress: () => void;
  disabled?: boolean;
  mirrored?: boolean;
}): React.JSX.Element {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.transportButton,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.pill,
          opacity: disabled ? 0.5 : pressed ? 0.86 : 1
        }
      ]}
    >
      <AppIcon
        name={icon}
        color={theme.colors.textPrimary}
        size={theme.iconSize.lg}
      />
      {mirrored ? <View style={styles.mirrorHint} /> : null}
    </Pressable>
  );
}

function PlayButton({
  icon,
  onPress,
  disabled = false
}: {
  icon: 'play' | 'pause';
  onPress: () => void;
  disabled?: boolean;
}): React.JSX.Element {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.playButton,
        {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
          borderRadius: theme.radius.pill,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1
        }
      ]}
    >
      <AppIcon name={icon} color={theme.colors.textOnPrimary} size={theme.iconSize.xl} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10
  },
  coverCard: {
    padding: 10,
    marginTop: 2
  },
  coverImage: {
    width: '100%',
    aspectRatio: 1
  },
  metaCard: {
    gap: 12
  },
  metaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  metaCopy: {
    flex: 1,
    gap: 4
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  progressCard: {
    gap: 8,
    marginTop: 120
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%'
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 24
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 12,
    marginBottom: 4
  },
  transportButton: {
    width: 64,
    height: 64,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  mirrorHint: {
    width: 0,
    height: 0
  },
  playButton: {
    width: 78,
    height: 78,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdropOne: {
    position: 'absolute',
    top: 8,
    right: -18,
    width: 120,
    height: 120,
    opacity: 0.28
  },
  backdropTwo: {
    position: 'absolute',
    top: 220,
    left: -24,
    width: 96,
    height: 96,
    opacity: 0.22
  }
});
