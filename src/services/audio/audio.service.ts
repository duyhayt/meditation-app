import { Audio, type AVPlaybackSource, type AVPlaybackStatus } from 'expo-av';

import type { ContentEntityType, OfflineContentMetadataRecord } from '@/domain/database';
import { getBundledAudioModule } from '@/services/audio/bundled-audio';
import type {
  AudioPlaybackSnapshot,
  AudioService,
  ContentRepository,
  LocalFileStorageService,
  LoggerService,
  ResolvedPlayableSource,
  SessionHistoryRepository
} from '@/services/di/types';

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
  errorMessage: null
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

export function createAudioService(deps: {
  contentRepository: ContentRepository;
  sessionHistoryRepository: SessionHistoryRepository;
  localFileStorageService: LocalFileStorageService;
  loggerService: LoggerService;
}): AudioService {
  let snapshot = INITIAL_SNAPSHOT;
  let sound: Audio.Sound | null = null;
  const listeners = new Set<() => void>();
  let sessionStartedAt: string | null = null;

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

  const unloadCurrentSound = async () => {
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        deps.loggerService.error('Failed to unload current sound', error);
      }
    }

    sound = null;
  };

  const handlePlaybackStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        setSnapshot({
          ...snapshot,
          status: 'error',
          isBuffering: false,
          errorMessage: status.error
        });
      }

      return;
    }

    const progressRatio = getCompletionRatio(status.positionMillis, status.durationMillis ?? 0);
    const nextStatus =
      status.isPlaying ? 'playing' : snapshot.status === 'loading' ? 'ready' : 'paused';

    updateSnapshot((current) => ({
      ...current,
      status: nextStatus,
      durationMillis: status.durationMillis ?? current.durationMillis,
      positionMillis: status.positionMillis,
      progressRatio,
      isBuffering: status.isBuffering,
      errorMessage: null
    }));

    if (status.didJustFinish) {
      void persistSession();
    }
  };

  const toPlaybackSource = (resolvedSource: ResolvedPlayableSource): AVPlaybackSource => {
    if (resolvedSource.kind === 'bundled' && resolvedSource.metadata?.bundledAssetName) {
      const moduleId = getBundledAudioModule(resolvedSource.metadata.bundledAssetName);

      if (moduleId) {
        return moduleId;
      }
    }

    if (!resolvedSource.uri) {
      throw new Error('No playable source URI is available');
    }

    return { uri: resolvedSource.uri };
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
      const metadata = await deps.contentRepository.getOfflineContentMetadata(contentType, contentId);
      return createPlaybackSource(deps.localFileStorageService, metadata);
    },
    load: async ({ contentType, contentId, autoPlay = true }) => {
      const resolvedSource = await (async () => {
        const metadata = await deps.contentRepository.getOfflineContentMetadata(contentType, contentId);
        return createPlaybackSource(deps.localFileStorageService, metadata);
      })();

      await persistSession();
      await unloadCurrentSound();

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
          errorMessage: 'No playable source is available'
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
        errorMessage: null
      });

      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true
        });
        sound = new Audio.Sound();
        sound.setOnPlaybackStatusUpdate(handlePlaybackStatus);
        sessionStartedAt = new Date().toISOString();
        await sound.loadAsync(toPlaybackSource(resolvedSource), {
          shouldPlay: autoPlay,
          progressUpdateIntervalMillis: 400
        });
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
      if (!sound) {
        return;
      }

      await sound.playAsync();
    },
    pause: async () => {
      if (!sound) {
        return;
      }

      await sound.pauseAsync();
    },
    seekTo: async (positionMillis) => {
      if (!sound) {
        return;
      }

      await sound.setPositionAsync(Math.max(0, positionMillis));
    },
    seekBy: async (deltaMillis) => {
      const nextPosition = Math.max(0, snapshot.positionMillis + deltaMillis);
      if (!sound) {
        return;
      }

      await sound.setPositionAsync(nextPosition);
    },
    stop: async () => {
      await persistSession();

      if (sound) {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (error) {
          deps.loggerService.error('Failed to stop audio', error);
        }
      }

      sound = null;
      sessionStartedAt = null;
      setSnapshot(INITIAL_SNAPSHOT);
    }
  };
}
