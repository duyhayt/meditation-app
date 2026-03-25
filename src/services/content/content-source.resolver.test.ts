import { resolveContentSource } from './content-source.resolver';

describe('content source resolver', () => {
  const metadata = {
    contentType: 'meditation',
    contentId: 'five-minute-arrival',
    title: 'Five-Minute Arrival',
    artworkUri: 'https://example.com/image.jpg',
    tone: 'meditation',
    durationSeconds: 300,
    audioType: 'stream',
    streamUrl: 'https://cdn.example.com/audio.mp3',
    bundledAssetName: 'meditation/five-minute-arrival.wav',
    localFileUri: 'file:///downloads/audio.wav',
    downloadStatus: 'completed',
    contentVersion: 1,
    audioVersion: 1,
    isFavorite: false,
    isAvailableOffline: false,
    updatedAt: '2026-03-26T00:00:00.000Z'
  } as const;

  it('prefers downloaded files over bundled and stream sources', () => {
    expect(
      resolveContentSource(metadata, {
        hasLocalFile: true,
        hasBundledAsset: true
      })
    ).toEqual({
      kind: 'downloaded',
      uri: 'file:///downloads/audio.wav',
      label: 'downloaded'
    });
  });

  it('falls back to bundled asset before stream when no local file exists', () => {
    expect(
      resolveContentSource(metadata, {
        hasLocalFile: false,
        hasBundledAsset: true
      })
    ).toEqual({
      kind: 'bundled',
      uri: 'meditation/five-minute-arrival.wav',
      label: 'bundled'
    });
  });
});
