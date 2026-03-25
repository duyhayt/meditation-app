const audioMocks = vi.hoisted(() => {
  const setAudioModeAsync = vi.fn(async () => undefined);
  const loadAsync = vi.fn(async () => ({
    isLoaded: true,
    uri: 'file:///downloads/five-minute-arrival.wav',
    progressUpdateIntervalMillis: 400,
    durationMillis: 60_000,
    positionMillis: 0,
    shouldPlay: true,
    isPlaying: true,
    isBuffering: false,
    rate: 1,
    shouldCorrectPitch: false,
    volume: 1,
    isMuted: false,
    audioPan: 0,
    isLooping: false,
    didJustFinish: false
  }));
  const playAsync = vi.fn(async () => undefined);
  const pauseAsync = vi.fn(async () => undefined);
  const stopAsync = vi.fn(async () => undefined);
  const unloadAsync = vi.fn(async () => undefined);
  const setPositionAsync = vi.fn(async () => undefined);
  const state = {
    statusHandler: null as ((status: unknown) => void) | null
  };

  return {
    setAudioModeAsync,
    loadAsync,
    playAsync,
    pauseAsync,
    stopAsync,
    unloadAsync,
    setPositionAsync,
    state
  };
});

vi.mock('@/services/audio/bundled-audio', () => ({
  getBundledAudioModule: vi.fn(() => 1)
}));

vi.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: audioMocks.setAudioModeAsync,
    Sound: class {
      setOnPlaybackStatusUpdate(callback: (status: unknown) => void) {
        audioMocks.state.statusHandler = callback;
      }
      loadAsync = audioMocks.loadAsync;
      playAsync = audioMocks.playAsync;
      pauseAsync = audioMocks.pauseAsync;
      stopAsync = audioMocks.stopAsync;
      unloadAsync = audioMocks.unloadAsync;
      setPositionAsync = audioMocks.setPositionAsync;
    }
  }
}));

import { createAudioService } from './audio.service';

describe('audio service', () => {
  beforeEach(() => {
    audioMocks.state.statusHandler = null;
    audioMocks.setAudioModeAsync.mockClear();
    audioMocks.loadAsync.mockClear();
    audioMocks.playAsync.mockClear();
    audioMocks.pauseAsync.mockClear();
    audioMocks.stopAsync.mockClear();
    audioMocks.unloadAsync.mockClear();
    audioMocks.setPositionAsync.mockClear();
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

    audioMocks.state.statusHandler?.({
      isLoaded: true,
      uri: 'file:///downloads/five-minute-arrival.wav',
      progressUpdateIntervalMillis: 400,
      durationMillis: 60_000,
      positionMillis: 50_000,
      shouldPlay: true,
      isPlaying: false,
      isBuffering: false,
      rate: 1,
      shouldCorrectPitch: false,
      volume: 1,
      isMuted: false,
      audioPan: 0,
      isLooping: false,
      didJustFinish: true
    });

    await service.stop();

    expect(audioMocks.loadAsync).toHaveBeenCalled();
    expect(service.getSnapshot().status).toBe('idle');
    expect(sessionHistoryRepository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        contentType: 'meditation',
        contentId: 'five-minute-arrival',
        isCompleted: true
      })
    );
  });
});
