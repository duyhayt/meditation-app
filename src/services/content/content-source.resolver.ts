import type {
  OfflineContentMetadataRecord,
  ResolvedContentSourceKind
} from '@/domain/database';

export type ResolvedContentSource = {
  kind: ResolvedContentSourceKind;
  uri: string | null;
  label: 'downloaded' | 'bundled' | 'streaming' | 'unavailable';
};

export function resolveContentSource(
  metadata: OfflineContentMetadataRecord | null,
  options?: {
    hasLocalFile?: boolean;
    hasBundledAsset?: boolean;
  }
): ResolvedContentSource {
  if (!metadata) {
    return {
      kind: 'unavailable',
      uri: null,
      label: 'unavailable'
    };
  }

  if (metadata.localFileUri && options?.hasLocalFile) {
    return {
      kind: 'downloaded',
      uri: metadata.localFileUri,
      label: 'downloaded'
    };
  }

  if (metadata.bundledAssetName && options?.hasBundledAsset) {
    return {
      kind: 'bundled',
      uri: metadata.bundledAssetName,
      label: 'bundled'
    };
  }

  if (metadata.streamUrl) {
    return {
      kind: 'stream',
      uri: metadata.streamUrl,
      label: 'streaming'
    };
  }

  return {
    kind: 'unavailable',
    uri: null,
    label: 'unavailable'
  };
}
