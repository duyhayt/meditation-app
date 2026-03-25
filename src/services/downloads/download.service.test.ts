vi.mock('expo-file-system/legacy', () => ({
  getInfoAsync: vi.fn(async () => ({
    exists: true,
    uri: 'file:///downloads/five-minute-arrival.wav',
    size: 2048,
    isDirectory: false,
    modificationTime: 0
  })),
  downloadAsync: vi.fn(async () => ({
    uri: 'file:///downloads/five-minute-arrival.wav',
    status: 200,
    headers: {}
  }))
}));

import { createDownloadService } from './download.service';

describe('download service', () => {
  it('copies bundled assets into managed storage and marks the download completed', async () => {
    const downloadsRepository = {
      upsert: vi.fn(async (value) => ({
        id: 'download_1',
        createdAt: '2026-03-26T00:00:00.000Z',
        updatedAt: '2026-03-26T00:00:00.000Z',
        fileSizeBytes: null,
        localFileUri: null,
        lastError: null,
        progressPercent: 0,
        ...value
      })),
      getByContent: vi.fn(async () => null),
      list: vi.fn(async () => []),
      remove: vi.fn(async () => undefined)
    };

    const service = createDownloadService({
      downloadsRepository: downloadsRepository as never,
      contentRepository: {
        getOfflineContentMetadata: vi.fn(async () => ({
          contentType: 'meditation',
          contentId: 'five-minute-arrival',
          title: 'Five-Minute Arrival',
          artworkUri: 'https://example.com/image.jpg',
          tone: 'meditation',
          durationSeconds: 300,
          audioType: 'stream',
          streamUrl: 'https://cdn.example.com/audio.mp3',
          bundledAssetName: 'meditation/five-minute-arrival.wav',
          localFileUri: null,
          downloadStatus: null,
          contentVersion: 1,
          audioVersion: 2,
          isFavorite: false,
          isAvailableOffline: false,
          updatedAt: '2026-03-26T00:00:00.000Z'
        }))
      } as never,
      localFileStorageService: {
        fileExists: vi.fn(async () => false),
        getDownloadFileUri: vi.fn(async () => 'file:///downloads/five-minute-arrival.wav'),
        copyBundledAssetToDownloads: vi.fn(async () => 'file:///downloads/five-minute-arrival.wav'),
        deleteFile: vi.fn(async () => undefined),
        getDownloadsDirectory: vi.fn(async () => 'file:///downloads/')
      },
      loggerService: {
        info: vi.fn(),
        error: vi.fn()
      }
    });

    const result = await service.downloadContent('meditation', 'five-minute-arrival');

    expect(result?.downloadStatus).toBe('completed');
    expect(result?.localFileUri).toBe('file:///downloads/five-minute-arrival.wav');
    expect(downloadsRepository.upsert).toHaveBeenLastCalledWith(
      expect.objectContaining({
        contentType: 'meditation',
        contentId: 'five-minute-arrival',
        downloadStatus: 'completed',
        localFileUri: 'file:///downloads/five-minute-arrival.wav'
      })
    );
  });
});
