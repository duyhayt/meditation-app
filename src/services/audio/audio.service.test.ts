const trackPlayerMocks = vi.hoisted(() => {
  const setupPlayer = vi.fn(async () => undefined);
  const updateOptions = vi.fn(async () => undefined);
  const reset = vi.fn(async () => undefined);
  const add = vi.fn(async () => 0);
  const play = vi.fn(async () => undefined);
  const pause = vi.fn(async () => undefined);
  const seekTo = vi.fn(async () => undefined);
  const seekBy = vi.fn(async () => undefined);
  const getActiveTrack = vi.fn(async () => ({
    id: 'meditation:five-minute-arrival',
    title: 'Five-Minute Arrival',
    artwork: 'https://example.com/image.jpg',
    duration: 60
  }));
  const getProgress = vi.fn(async () => ({
    position: 50,
    duration: 60,
    buffered: 60
  }));
  const getPlaybackState = vi.fn(async () => ({
    state: 'playing'
  }));
  const updateNowPlayingMetadata = vi.fn(async () => undefined);
  const addEventListener = vi.fn(() => ({
    remove: vi.fn()
  }));

  return {
    setupPlayer,
    updateOptions,
    reset,
    add,
    play,
    pause,
    seekTo,
    seekBy,
    getActiveTrack,
    getProgress,
    getPlaybackState,
    updateNowPlayingMetadata,
    addEventListener
  };
});

const sleepTimerStorageState = vi.hoisted(() => ({
  targetEpochMs: null as number | null
}));

vi.mock('@/services/audio/bundled-audio', () => ({
  getBundledAudioModule: vi.fn(() => 1)
}));

vi.mock('@/services/audio/sleep-timer.storage', () => ({
  getSleepTimerTargetEpochMs: vi.fn(async () => sleepTimerStorageState.targetEpochMs),
  setSleepTimerTargetEpochMs: vi.fn(async (value: number | null) => {
    sleepTimerStorageState.targetEpochMs = value;
  })
}));

vi.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    setupPlayer: trackPlayerMocks.setupPlayer,
    updateOptions: trackPlayerMocks.updateOptions,
    reset: trackPlayerMocks.reset,
    add: trackPlayerMocks.add,
    play: trackPlayerMocks.play,
    pause: trackPlayerMocks.pause,
    seekTo: trackPlayerMocks.seekTo,
    seekBy: trackPlayerMocks.seekBy,
    getActiveTrack: trackPlayerMocks.getActiveTrack,
    getProgress: trackPlayerMocks.getProgress,
    getPlaybackState: trackPlayerMocks.getPlaybackState,
    updateNowPlayingMetadata: trackPlayerMocks.updateNowPlayingMetadata,
    addEventListener: trackPlayerMocks.addEventListener
  },
  AndroidAudioContentType: {
    Speech: 'speech'
  },
  AppKilledPlaybackBehavior: {
    ContinuePlayback: 'continue-playback'
  },
  Capability: {
    Play: 'play',
    Pause: 'pause',
    Stop: 'stop',
    SeekTo: 'seekTo',
    JumpForward: 'jumpForward',
    JumpBackward: 'jumpBackward'
  },
  Event: {
    PlaybackState: 'playback-state',
    PlaybackProgressUpdated: 'playback-progress-updated',
    PlaybackActiveTrackChanged: 'playback-active-track-changed',
    PlaybackQueueEnded: 'playback-queue-ended',
    PlaybackError: 'playback-error'
  },
  IOSCategory: {
    Playback: 'playback'
  },
  IOSCategoryMode: {
    SpokenAudio: 'spokenAudio'
  },
  IOSCategoryOptions: {
    AllowAirPlay: 'allowAirPlay'
  },
  State: {
    None: 'none',
    Ready: 'ready',
    Playing: 'playing',
    Paused: 'paused',
    Stopped: 'stopped',
    Loading: 'loading',
    Buffering: 'buffering',
    Error: 'error',
    Ended: 'ended'
  }
}));

import { createAudioService } from './audio.service';

describe('audio service', () => {
  beforeEach(() => {
    sleepTimerStorageState.targetEpochMs = null;

    trackPlayerMocks.setupPlayer.mockClear();
    trackPlayerMocks.updateOptions.mockClear();
    trackPlayerMocks.reset.mockClear();
    trackPlayerMocks.add.mockClear();
    trackPlayerMocks.play.mockClear();
    trackPlayerMocks.pause.mockClear();
    trackPlayerMocks.seekTo.mockClear();
    trackPlayerMocks.seekBy.mockClear();
    trackPlayerMocks.getActiveTrack.mockClear();
    trackPlayerMocks.getProgress.mockClear();
    trackPlayerMocks.getPlaybackState.mockClear();
    trackPlayerMocks.updateNowPlayingMetadata.mockClear();
    trackPlayerMocks.addEventListener.mockClear();
  });

  it('loads bundled playback sources and persists a finished session on stop', async () => {
    const sessionHistoryRepository = {
      add: vi.fn(async (value) => value),
      getLastPlayed: vi.fn(async () => null),
      listRecent: vi.fn(async () => [])
    };

    const service = createAudioService({
      contentRepository: {
        getOfflineContentMetadata: vi.fn(async () => ({
          contentType: 'meditation',
          contentId: 'five-minute-arrival',
          title: 'Five-Minute Arrival',
          artworkUri: 'https://example.com/image.jpg',
          tone: 'meditation',
          durationSeconds: 60,
          audioType: 'stream',
          streamUrl: 'https://cdn.example.com/audio.mp3',
          bundledAssetName: 'meditation/five-minute-arrival.wav',
          localFileUri: null,
          downloadStatus: null,
          contentVersion: 1,
          audioVersion: 1,
          isFavorite: false,
          isAvailableOffline: false,
          updatedAt: '2026-03-26T00:00:00.000Z'
        }))
      } as never,
      sessionHistoryRepository: sessionHistoryRepository as never,
      localFileStorageService: {
        fileExists: vi.fn(async () => false)
      } as never,
      loggerService: {
        info: vi.fn(),
        error: vi.fn()
      }
    });

    await service.load({
      contentType: 'meditation',
      contentId: 'five-minute-arrival',
      autoPlay: true
    });

    await service.stop();

    expect(trackPlayerMocks.setupPlayer).toHaveBeenCalled();
    expect(trackPlayerMocks.add).toHaveBeenCalled();
    expect(trackPlayerMocks.play).toHaveBeenCalled();
    expect(service.getSnapshot().status).toBe('idle');
    expect(sessionHistoryRepository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        contentType: 'meditation',
        contentId: 'five-minute-arrival',
        isCompleted: true
      })
    );
  });

  it('stores and clears sleep timer state', async () => {
    const service = createAudioService({
      contentRepository: {
        getOfflineContentMetadata: vi.fn(async () => null)
      } as never,
      sessionHistoryRepository: {
        add: vi.fn(async () => undefined),
        getLastPlayed: vi.fn(async () => null),
        listRecent: vi.fn(async () => [])
      } as never,
      localFileStorageService: {
        fileExists: vi.fn(async () => false)
      } as never,
      loggerService: {
        info: vi.fn(),
        error: vi.fn()
      }
    });

    await service.setSleepTimer(10 * 60_000);

    expect(service.getSnapshot().sleepTimerRemainingMillis).toBeGreaterThan(0);
    expect(service.getSnapshot().sleepTimerEndsAt).not.toBeNull();

    await service.clearSleepTimer();

    expect(service.getSnapshot().sleepTimerRemainingMillis).toBe(0);
    expect(service.getSnapshot().sleepTimerEndsAt).toBeNull();
  });
});
