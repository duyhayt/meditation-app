import { createContentRepository } from './content.repository';

describe('content repository', () => {
  it('maps offline metadata from joined content rows', async () => {
    const databaseService = {
      getDatabase: vi.fn(async () => ({
        getAllAsync: vi.fn(async () => []),
        getFirstAsync: vi.fn(async () => ({
          content_id: 'five-minute-arrival',
          title: 'Five-Minute Arrival',
          artwork_uri: 'https://example.com/image.jpg',
          tone: 'meditation',
          duration_seconds: 300,
          audio_type: 'stream',
          stream_url: 'https://cdn.example.com/audio.mp3',
          bundled_asset_name: null,
          local_file_uri: 'file:///downloads/audio.mp3',
          download_status: 'completed',
          content_version: 1,
          audio_version: 2,
          is_favorite: 1,
          updated_at: '2026-03-25T00:00:00.000Z'
        }))
      }))
    };

    const repository = createContentRepository({
      databaseService: databaseService as never
    });

    const metadata = await repository.getOfflineContentMetadata(
      'meditation',
      'five-minute-arrival'
    );

    expect(metadata).toEqual({
      contentType: 'meditation',
      contentId: 'five-minute-arrival',
      title: 'Five-Minute Arrival',
      artworkUri: 'https://example.com/image.jpg',
      tone: 'meditation',
      durationSeconds: 300,
      audioType: 'stream',
      streamUrl: 'https://cdn.example.com/audio.mp3',
      bundledAssetName: null,
      localFileUri: 'file:///downloads/audio.mp3',
      downloadStatus: 'completed',
      contentVersion: 1,
      audioVersion: 2,
      isFavorite: true,
      isAvailableOffline: true,
      updatedAt: '2026-03-25T00:00:00.000Z'
    });
  });
});
