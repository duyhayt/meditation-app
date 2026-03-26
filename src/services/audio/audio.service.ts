import type { EmitterSubscription } from 'react-native';
import TrackPlayer, {
  AndroidAudioContentType,
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  IOSCategory,
  IOSCategoryMode,
  IOSCategoryOptions,
  State,
  type AddTrack
} from 'react-native-track-player';

import { resolveAppImageModule } from '@/assets/image-registry';
import type { ContentEntityType, OfflineContentMetadataRecord } from '@/domain/database';
import { getBundledAudioModule } from '@/services/audio/bundled-audio';
import {
  getSleepTimerTargetEpochMs,
  setSleepTimerTargetEpochMs
} from '@/services/audio/sleep-timer.storage';
import type {
  AudioPlaybackSnapshot,
  AudioService,
  ContentRepository,
  LocalFileStorageService,
  LoggerService,
  ResolvedPlayableSource,
  SessionHistoryRepository
} from '@/services/di/types';

const JUMP_INTERVAL_SECONDS = 15;
const PROGRESS_EVENT_INTERVAL_SECONDS = 1;

const INITIAL_SNAPSHOT: AudioPlaybackSnapshot = {
  contentType: null,
  contentId: null,
  title: null,
  artworkUri: null,
  status: 'idle',
  sourceKind: 'unavailable',
  sourceUri: null,
  durationMillis: 0,
  positionMillis: 0,
  progressRatio: 0,
  isBuffering: false,
  errorMessage: null,
  sleepTimerEndsAt: null,
  sleepTimerRemainingMillis: 0
};

function getCompletionRatio(positionMillis: number, durationMillis: number): number {
  if (!durationMillis) {
    return 0;
  }

  return Math.min(1, positionMillis / durationMillis);
}

function isSessionCompleted(contentType: ContentEntityType, progressRatio: number): boolean {
  if (contentType === 'sleep_sound') {
    return false;
  }

  return progressRatio >= 0.8;
}

async function createPlaybackSource(
  localFileStorageService: LocalFileStorageService,
  metadata: OfflineContentMetadataRecord | null
): Promise<ResolvedPlayableSource> {
  if (!metadata) {
    return {
      kind: 'unavailable',
      audioType: null,
      uri: null,
      metadata: null
    };
  }

  if (metadata.localFileUri && (await localFileStorageService.fileExists(metadata.localFileUri))) {
    return {
      kind: 'downloaded',
      audioType: 'downloaded',
      uri: metadata.localFileUri,
      metadata
    };
  }

  if (metadata.bundledAssetName && getBundledAudioModule(metadata.bundledAssetName)) {
    return {
      kind: 'bundled',
      audioType: 'bundled',
      uri: metadata.bundledAssetName,
      metadata
    };
  }

  if (metadata.streamUrl) {
    return {
      kind: 'stream',
      audioType: 'stream',
      uri: metadata.streamUrl,
      metadata
    };
  }

  return {
    kind: 'unavailable',
    audioType: metadata.audioType,
    uri: null,
    metadata
  };
}

function mapTrackPlayerState(state: State): AudioPlaybackSnapshot['status'] {
  switch (state) {
    case State.Loading:
    case State.Buffering:
      return 'loading';
    case State.Playing:
      return 'playing';
    case State.Paused:
    case State.Stopped:
    case State.Ended:
      return 'paused';
    case State.Error:
      return 'error';
    case State.Ready:
      return 'ready';
    case State.None:
    default:
      return 'idle';
  }
}

function getTrackArtistLabel(contentType: ContentEntityType): string {
  switch (contentType) {
    case 'sleep_sound':
      return 'Sleep sound';
    case 'course_lesson':
      return 'Course lesson';
    case 'breathing_exercise':
      return 'Breathing exercise';
    case 'meditation':
    default:
      return 'Meditation';
  }
}

function toTrack(resolvedSource: ResolvedPlayableSource): AddTrack {
  const artwork = (resolveAppImageModule(resolvedSource.metadata?.artworkUri) ??
    resolvedSource.metadata?.artworkUri ??
    undefined) as AddTrack['artwork'];

  if (resolvedSource.kind === 'bundled' && resolvedSource.metadata?.bundledAssetName) {
    const moduleId = getBundledAudioModule(resolvedSource.metadata.bundledAssetName);

    if (moduleId) {
      return {
        id: `${resolvedSource.metadata.contentType}:${resolvedSource.metadata.contentId}`,
        url: moduleId as unknown as AddTrack['url'],
        title: resolvedSource.metadata.title,
        artist: getTrackArtistLabel(resolvedSource.metadata.contentType),
        album: 'RN Template',
        description: resolvedSource.metadata.tone,
        artwork,
        duration: resolvedSource.metadata.durationSeconds ?? undefined
      };
    }
  }

  if (!resolvedSource.uri || !resolvedSource.metadata) {
    throw new Error('No playable source URI is available');
  }

  return {
    id: `${resolvedSource.metadata.contentType}:${resolvedSource.metadata.contentId}`,
    url: resolvedSource.uri,
    title: resolvedSource.metadata.title,
    artist: getTrackArtistLabel(resolvedSource.metadata.contentType),
    album: 'RN Template',
    description: resolvedSource.metadata.tone,
    artwork,
    duration: resolvedSource.metadata.durationSeconds ?? undefined
  };
}

export function createAudioService(deps: {
  contentRepository: ContentRepository;
  sessionHistoryRepository: SessionHistoryRepository;
  localFileStorageService: LocalFileStorageService;
  loggerService: LoggerService;
}): AudioService {
  let snapshot = INITIAL_SNAPSHOT;
  const listeners = new Set<() => void>();
  let sessionStartedAt: string | null = null;
  let setupPromise: Promise<void> | null = null;
  let subscriptions: EmitterSubscription[] = [];
  let sleepTimerInterval: ReturnType<typeof setInterval> | null = null;

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const setSnapshot = (next: AudioPlaybackSnapshot) => {
    snapshot = next;
    emit();
  };

  const updateSnapshot = (updater: (current: AudioPlaybackSnapshot) => AudioPlaybackSnapshot) => {
    snapshot = updater(snapshot);
    emit();
  };

  const stopSleepTimerTicker = () => {
    if (!sleepTimerInterval) {
      return;
    }

    clearInterval(sleepTimerInterval);
    sleepTimerInterval = null;
  };

  const syncSleepTimerState = async (shouldPauseWhenExpired = true) => {
    const targetEpochMs = await getSleepTimerTargetEpochMs();
    const remainingMillis = targetEpochMs ? Math.max(0, targetEpochMs - Date.now()) : 0;

    if (targetEpochMs && remainingMillis <= 0) {
      await setSleepTimerTargetEpochMs(null);
      stopSleepTimerTicker();

      updateSnapshot((current) => ({
        ...current,
        sleepTimerEndsAt: null,
        sleepTimerRemainingMillis: 0
      }));

      if (shouldPauseWhenExpired) {
        try {
          await TrackPlayer.pause();
        } catch (error) {
          deps.loggerService.error('Failed to pause playback after sleep timer elapsed', error);
        }
      }

      return;
    }

    updateSnapshot((current) => ({
      ...current,
      sleepTimerEndsAt: targetEpochMs ? new Date(targetEpochMs).toISOString() : null,
      sleepTimerRemainingMillis: remainingMillis
    }));

    if (targetEpochMs && !sleepTimerInterval) {
      sleepTimerInterval = setInterval(() => {
        void syncSleepTimerState();
      }, 1000);
    }

    if (!targetEpochMs) {
      stopSleepTimerTicker();
    }
  };

  const persistSession = async () => {
    if (!snapshot.contentType || !snapshot.contentId || !sessionStartedAt) {
      return;
    }

    if (snapshot.positionMillis <= 0 && snapshot.durationMillis <= 0) {
      return;
    }

    try {
      const progressRatio = getCompletionRatio(snapshot.positionMillis, snapshot.durationMillis);
      await deps.sessionHistoryRepository.add({
        contentType: snapshot.contentType,
        contentId: snapshot.contentId,
        sourceType:
          snapshot.sourceKind === 'stream'
            ? 'stream'
            : snapshot.sourceKind === 'unavailable'
              ? 'stream'
              : 'downloaded',
        startedAt: sessionStartedAt,
        endedAt: new Date().toISOString(),
        progressSeconds: Math.floor(snapshot.positionMillis / 1000),
        completionRatio: progressRatio,
        isCompleted: isSessionCompleted(snapshot.contentType, progressRatio)
      });
      sessionStartedAt = null;
    } catch (error) {
      deps.loggerService.error('Failed to persist audio session', error);
    }
  };

  const syncSnapshotFromPlayer = async () => {
    try {
      const [playbackState, progress, activeTrack] = await Promise.all([
        TrackPlayer.getPlaybackState(),
        TrackPlayer.getProgress(),
        TrackPlayer.getActiveTrack()
      ]);

      const resolvedDurationMillis = Math.floor(
        (progress.duration || activeTrack?.duration || 0) * 1000
      );
      const durationMillis = resolvedDurationMillis > 0 ? resolvedDurationMillis : 0;
      const positionMillis = Math.floor(progress.position * 1000);

      updateSnapshot((current) => ({
        ...current,
        title: activeTrack?.title ?? current.title,
        artworkUri:
          typeof activeTrack?.artwork === 'string' ? activeTrack.artwork : current.artworkUri,
        status: mapTrackPlayerState(playbackState.state),
        durationMillis,
        positionMillis,
        progressRatio: getCompletionRatio(positionMillis, durationMillis),
        isBuffering: playbackState.state === State.Buffering,
        errorMessage: playbackState.state === State.Error ? playbackState.error.message : null
      }));

      await syncSleepTimerState();
    } catch (error) {
      deps.loggerService.error('Failed to synchronize audio snapshot', error);
    }
  };

  const attachPlayerListeners = () => {
    if (subscriptions.length > 0) {
      return;
    }

    subscriptions = [
      TrackPlayer.addEventListener(Event.PlaybackState, () => {
        void syncSnapshotFromPlayer();
      }),
      TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => {
        void syncSnapshotFromPlayer();
      }),
      TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, () => {
        void syncSnapshotFromPlayer();
      }),
      TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
        void syncSnapshotFromPlayer();
        void persistSession();
      }),
      TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
        updateSnapshot((current) => ({
          ...current,
          status: 'error',
          isBuffering: false,
          errorMessage: event.message
        }));
      })
    ];
  };

  const ensurePlayerSetup = async () => {
    if (!setupPromise) {
      setupPromise = (async () => {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
          autoUpdateMetadata: true,
          iosCategory: IOSCategory.Playback,
          iosCategoryMode: IOSCategoryMode.SpokenAudio,
          iosCategoryOptions: [IOSCategoryOptions.AllowAirPlay],
          androidAudioContentType: AndroidAudioContentType.Speech
        });

        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback
          },
          progressUpdateEventInterval: PROGRESS_EVENT_INTERVAL_SECONDS,
          forwardJumpInterval: JUMP_INTERVAL_SECONDS,
          backwardJumpInterval: JUMP_INTERVAL_SECONDS,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SeekTo,
            Capability.JumpForward,
            Capability.JumpBackward
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SeekTo,
            Capability.JumpForward,
            Capability.JumpBackward
          ],
          compactCapabilities: [Capability.JumpBackward, Capability.Play, Capability.JumpForward]
        });

        attachPlayerListeners();
      })().catch((error) => {
        setupPromise = null;
        throw error;
      });
    }

    await setupPromise;
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    resolvePlayableSource: async (contentType, contentId) => {
      const metadata = await deps.contentRepository.getOfflineContentMetadata(
        contentType,
        contentId
      );
      return createPlaybackSource(deps.localFileStorageService, metadata);
    },
    load: async ({ contentType, contentId, autoPlay = true }) => {
      const resolvedSource = await (async () => {
        const metadata = await deps.contentRepository.getOfflineContentMetadata(
          contentType,
          contentId
        );
        return createPlaybackSource(deps.localFileStorageService, metadata);
      })();

      await ensurePlayerSetup();
      await persistSession();

      if (!resolvedSource.metadata || resolvedSource.kind === 'unavailable') {
        setSnapshot({
          contentType,
          contentId,
          title: resolvedSource.metadata?.title ?? null,
          artworkUri: resolvedSource.metadata?.artworkUri ?? null,
          status: 'error',
          sourceKind: 'unavailable',
          sourceUri: null,
          durationMillis: 0,
          positionMillis: 0,
          progressRatio: 0,
          isBuffering: false,
          errorMessage: 'No playable source is available',
          sleepTimerEndsAt: snapshot.sleepTimerEndsAt,
          sleepTimerRemainingMillis: snapshot.sleepTimerRemainingMillis
        });

        return snapshot;
      }

      setSnapshot({
        contentType,
        contentId,
        title: resolvedSource.metadata.title,
        artworkUri: resolvedSource.metadata.artworkUri,
        status: 'loading',
        sourceKind: resolvedSource.kind,
        sourceUri: resolvedSource.uri,
        durationMillis: 0,
        positionMillis: 0,
        progressRatio: 0,
        isBuffering: true,
        errorMessage: null,
        sleepTimerEndsAt: snapshot.sleepTimerEndsAt,
        sleepTimerRemainingMillis: snapshot.sleepTimerRemainingMillis
      });

      try {
        await TrackPlayer.reset();
        const track = toTrack(resolvedSource);
        await TrackPlayer.add(track);
        await TrackPlayer.updateNowPlayingMetadata({
          title: track.title,
          artist: track.artist,
          album: track.album,
          artwork: track.artwork,
          duration: track.duration
        });
        sessionStartedAt = new Date().toISOString();

        if (autoPlay) {
          await TrackPlayer.play();
        }

        await syncSnapshotFromPlayer();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Playback could not start';
        setSnapshot({
          ...snapshot,
          status: 'error',
          isBuffering: false,
          errorMessage
        });
        deps.loggerService.error('Failed to load audio source', error);
      }

      return snapshot;
    },
    play: async () => {
      await ensurePlayerSetup();
      await TrackPlayer.play();
      await syncSnapshotFromPlayer();
    },
    pause: async () => {
      await ensurePlayerSetup();
      await TrackPlayer.pause();
      await syncSnapshotFromPlayer();
    },
    seekTo: async (positionMillis) => {
      await ensurePlayerSetup();
      await TrackPlayer.seekTo(Math.max(0, positionMillis) / 1000);
      await syncSnapshotFromPlayer();
    },
    seekBy: async (deltaMillis) => {
      await ensurePlayerSetup();
      await TrackPlayer.seekBy(deltaMillis / 1000);
      await syncSnapshotFromPlayer();
    },
    setSleepTimer: async (durationMillis) => {
      const targetEpochMs = durationMillis === null ? null : Date.now() + durationMillis;
      await setSleepTimerTargetEpochMs(targetEpochMs);
      await syncSleepTimerState(false);
    },
    clearSleepTimer: async () => {
      await setSleepTimerTargetEpochMs(null);
      await syncSleepTimerState(false);
    },
    stop: async () => {
      await ensurePlayerSetup();
      await persistSession();
      await setSleepTimerTargetEpochMs(null);
      stopSleepTimerTicker();

      try {
        await TrackPlayer.reset();
      } catch (error) {
        deps.loggerService.error('Failed to stop audio', error);
      }

      sessionStartedAt = null;
      setSnapshot(INITIAL_SNAPSHOT);
    }
  };
}
