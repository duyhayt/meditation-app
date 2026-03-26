import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type LayoutChangeEvent,
  type GestureResponderEvent
} from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { AppIcon } from '@/components/common/AppIcon';
import { AppIconButton } from '@/components/common/AppIconButton';
import { AppModal } from '@/components/common/AppModal';
import { SkeletonBlock } from '@/components/common/SkeletonBlock';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { resolveAppImageSource } from '@/assets/image-registry';
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

function getSleepTimerInputValue(remainingMillis: number): string {
  if (remainingMillis <= 0) {
    return '30';
  }

  return String(Math.max(1, Math.ceil(remainingMillis / 60_000)));
}

function formatSleepTimerRemaining(value: number): string {
  const totalSeconds = Math.max(0, Math.ceil(value / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function AudioPlayerScreen({ route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const audioService = useAudioService();
  const playback = usePlaybackSnapshot();
  const [sleepTimerVisible, setSleepTimerVisible] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(
    getSleepTimerInputValue(playback.sleepTimerRemainingMillis)
  );
  const [progressTrackWidth, setProgressTrackWidth] = useState(0);
  const [scrubPositionMillis, setScrubPositionMillis] = useState<number | null>(null);
  const sourceQuery = useResolvedContentSource(route.params.contentType, route.params.contentId);
  const downloadMutation = useDownloadContentMutation(
    route.params.contentType,
    route.params.contentId
  );
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
  const isCurrentTrack =
    playback.contentType === route.params.contentType &&
    playback.contentId === route.params.contentId &&
    playback.status !== 'idle';

  useEffect(() => {
    if (isCurrentTrack) {
      return;
    }

    void audioService.load({
      contentType: route.params.contentType,
      contentId: route.params.contentId,
      autoPlay: true
    });
  }, [audioService, route.params.contentId, route.params.contentType]);

  useEffect(() => {
    if (!sleepTimerVisible) {
      return;
    }

    setSleepTimerMinutes(getSleepTimerInputValue(playback.sleepTimerRemainingMillis));
  }, [playback.sleepTimerRemainingMillis, sleepTimerVisible]);

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
  const displayPositionMillis = scrubPositionMillis ?? playback.positionMillis;
  const progressRatio =
    playback.durationMillis > 0 ? Math.min(1, displayPositionMillis / playback.durationMillis) : 0;
  const sleepTimerActive = playback.sleepTimerRemainingMillis > 0;
  const parsedSleepTimerMinutes = Number.parseInt(sleepTimerMinutes, 10);
  const sleepTimerDurationMillis =
    Number.isFinite(parsedSleepTimerMinutes) && parsedSleepTimerMinutes > 0
      ? parsedSleepTimerMinutes * 60_000
      : null;
  const artworkSource = resolveAppImageSource(playback.artworkUri ?? metadata?.artworkUri ?? null);
  const showSkeleton = (sourceQuery.isLoading || playback.status === 'loading') && !metadata;

  const getSeekPositionMillis = (locationX: number): number => {
    if (playback.durationMillis <= 0 || progressTrackWidth <= 0) {
      return 0;
    }

    const clampedRatio = Math.min(1, Math.max(0, locationX / progressTrackWidth));
    return Math.round(clampedRatio * playback.durationMillis);
  };

  const handleProgressTrackLayout = (event: LayoutChangeEvent) => {
    setProgressTrackWidth(event.nativeEvent.layout.width);
  };

  const handleScrubUpdate = (event: GestureResponderEvent) => {
    setScrubPositionMillis(getSeekPositionMillis(event.nativeEvent.locationX));
  };

  const handleScrubComplete = (event: GestureResponderEvent) => {
    const nextPositionMillis = getSeekPositionMillis(event.nativeEvent.locationX);
    setScrubPositionMillis(nextPositionMillis);
    void audioService.seekTo(nextPositionMillis).finally(() => {
      setScrubPositionMillis(null);
    });
  };

  return (
    <Screen
      contentStyle={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.lg
        }
      ]}
      safeAreaEdges={['top', 'left', 'right', 'bottom']}
    >
      <View style={styles.layout}>
        <AppHeader
          title={playback.title ?? 'Unknown'}
          eyebrow={playerLabel}
          showBackButton
          rightSlot={
            <View style={styles.headerActions}>
              <AppIconButton
                icon="timer"
                active={sleepTimerActive}
                onPress={() => setSleepTimerVisible(true)}
              />
              <AppIconButton
                icon="favorite"
                active={metadata?.isFavorite}
                onPress={() => void toggleFavoriteMutation.mutateAsync()}
              />
              <AppIconButton
                icon="download"
                active={playback.sourceKind === 'downloaded'}
                onPress={() =>
                  playback.sourceKind === 'downloaded'
                    ? void removeDownloadMutation.mutateAsync()
                    : void downloadMutation.mutateAsync()
                }
              />
            </View>
          }
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
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

          {showSkeleton ? (
            <View style={styles.mainContent}>
              <View style={styles.coverContainer}>
                <SkeletonBlock width="100%" height={320} radius={theme.radius.xl ?? 24} />
              </View>
              <View style={styles.infoContainer}>
                <SkeletonBlock width="70%" height={28} />
                <SkeletonBlock width="40%" height={16} />
              </View>
              <View style={styles.progressContainer}>
                <SkeletonBlock width="100%" height={6} radius={theme.radius.pill} />
                <View style={styles.progressMeta}>
                  <SkeletonBlock width={40} height={12} />
                  <SkeletonBlock width={40} height={12} />
                </View>
              </View>
            </View>
          ) : null}

          {metadata ? (
            <View style={styles.mainContent}>
              <View style={styles.coverContainer}>
                {artworkSource ? (
                  <Image
                    source={artworkSource}
                    resizeMode="cover"
                    style={[styles.coverImage, { borderRadius: theme.radius.xl ?? 24 }]}
                  />
                ) : (
                  <View
                    style={[
                      styles.coverPlaceholder,
                      {
                        backgroundColor: theme.colors.surfaceElevated,
                        borderRadius: theme.radius.xl ?? 24
                      }
                    ]}
                  >
                    <AppIcon name="play" size={64} color={theme.colors.textSecondary} />
                  </View>
                )}
              </View>

              <View style={styles.infoContainer}>
                <AppText variant="title" numberOfLines={2} style={styles.titleText}>
                  {playback.title ?? 'Unknown'}
                </AppText>
                <AppText
                  variant="body"
                  color={theme.colors.textSecondary}
                  style={styles.subtitleText}
                >
                  {sourceLabel}
                </AppText>
              </View>

              <View style={styles.progressContainer}>
                <View
                  accessibilityRole="adjustable"
                  onLayout={handleProgressTrackLayout}
                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onResponderGrant={handleScrubUpdate}
                  onResponderMove={handleScrubUpdate}
                  onResponderRelease={handleScrubComplete}
                  onResponderTerminate={handleScrubComplete}
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
                        width: `${Math.max(progressRatio * 100, 0)}%`,
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.radius.pill
                      }
                    ]}
                  />
                  <View
                    style={[
                      styles.progressThumb,
                      {
                        left: `${Math.max(progressRatio * 100, 0)}%`,
                        backgroundColor: theme.colors.textPrimary
                      }
                    ]}
                  />
                </View>
                <View style={styles.progressMeta}>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    {formatClockFromMillis(displayPositionMillis)}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    {playback.durationMillis > 0
                      ? formatClockFromMillis(playback.durationMillis)
                      : t('audio.loopLabel')}
                  </AppText>
                </View>
              </View>

              {playback.errorMessage ? (
                <EmptyState title={t('audio.errorTitle')} description={playback.errorMessage} />
              ) : null}
            </View>
          ) : null}
        </ScrollView>

        {metadata && !showSkeleton ? (
          <View style={styles.transportDock}>
            <View style={styles.transportRow}>
              <TransportButton
                icon="rewind15"
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
                icon="forward15"
                onPress={() => void audioService.seekBy(15_000)}
                disabled={isUnavailable}
              />
            </View>
          </View>
        ) : null}
      </View>

      <AppModal visible={sleepTimerVisible} onClose={() => setSleepTimerVisible(false)}>
        <View style={styles.modalContent}>
          <AppText variant="title">{t('audio.sleepTimerTitle')}</AppText>
          <AppText variant="bodySmall">{t('audio.sleepTimerDescription')}</AppText>
          <View style={styles.timerAdjustRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setSleepTimerMinutes((current) =>
                  String(Math.max(1, (Number.parseInt(current, 10) || 0) - 5))
                )
              }
              style={({ pressed }) => [
                styles.timerAdjustButton,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.pill,
                  opacity: pressed ? 0.84 : 1
                }
              ]}
            >
              <AppText variant="title">-5</AppText>
            </Pressable>
            <View
              style={[
                styles.timerInputWrap,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.xl
                }
              ]}
            >
              <TextInput
                value={sleepTimerMinutes}
                onChangeText={(value) => setSleepTimerMinutes(value.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                inputMode="numeric"
                style={[styles.timerInput, { color: theme.colors.textPrimary }]}
              />
              <AppText variant="bodySmall" color={theme.colors.textSecondary}>
                {t('common.minutesShort', { count: parsedSleepTimerMinutes || 0 })}
              </AppText>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setSleepTimerMinutes((current) =>
                  String(Math.min(24 * 60, (Number.parseInt(current, 10) || 0) + 5))
                )
              }
              style={({ pressed }) => [
                styles.timerAdjustButton,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.pill,
                  opacity: pressed ? 0.84 : 1
                }
              ]}
            >
              <AppText variant="title">+5</AppText>
            </Pressable>
          </View>
          <AppButton
            label={t('audio.sleepTimerSet')}
            disabled={!sleepTimerDurationMillis}
            onPress={() => {
              if (!sleepTimerDurationMillis) {
                return;
              }

              void audioService.setSleepTimer(sleepTimerDurationMillis);
              setSleepTimerVisible(false);
            }}
          />
          {sleepTimerActive ? (
            <AppButton
              label={t('audio.sleepTimerClear')}
              variant="ghost"
              onPress={() => {
                void audioService.clearSleepTimer();
                setSleepTimerVisible(false);
              }}
            />
          ) : null}
        </View>
      </AppModal>
    </Screen>
  );
}

function TransportButton({
  icon,
  onPress,
  disabled = false
}: {
  icon: 'rewind15' | 'forward15';
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
        styles.transportButton,
        {
          opacity: disabled ? 0.4 : pressed ? 0.6 : 1
        }
      ]}
    >
      <AppIcon name={icon} color={theme.colors.textPrimary} size={36} />
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
          opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 6
        }
      ]}
    >
      <AppIcon name={icon} color={theme.colors.textOnPrimary} size={42} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  layout: {
    flex: 1,
    flexDirection: 'column'
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 16
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4
  },
  coverContainer: {
    alignSelf: 'center',
    width: '85%',
    maxWidth: 380,
    aspectRatio: 1,
    marginTop: 8,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10
  },
  coverImage: {
    width: '100%',
    height: '100%'
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginBottom: 36,
    alignItems: 'flex-start',
    gap: 4
  },
  titleText: {
    fontWeight: '700'
  },
  subtitleText: {
    fontWeight: '500'
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 16
  },
  progressTrack: {
    height: 6,
    justifyContent: 'center',
    marginBottom: 12
  },
  progressFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0
  },
  progressThumb: {
    width: 14,
    height: 14,
    position: 'absolute',
    top: -4,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: -7
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  transportDock: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36
  },
  transportButton: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    gap: 16
  },
  timerAdjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  timerAdjustButton: {
    width: 56,
    height: 56,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerInputWrap: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 2
  },
  timerInput: {
    fontSize: 28,
    fontWeight: '700',
    padding: 0
  }
});
