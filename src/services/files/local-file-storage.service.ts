import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

import { getBundledAudioModule } from '@/services/audio/bundled-audio';
import type { LocalFileStorageService } from '@/services/di/types';

const DOWNLOADS_DIR_NAME = 'downloads';

function getBaseDirectory(): string {
  return FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? '';
}

function assertBaseDirectory(directory: string): string {
  if (!directory) {
    throw new Error('No writable file system directory is available');
  }

  return directory;
}

export function createLocalFileStorageService(): LocalFileStorageService {
  const ensureDownloadsDirectory = async (): Promise<string> => {
    const baseDirectory = assertBaseDirectory(getBaseDirectory());
    const downloadsDirectory = `${baseDirectory}${DOWNLOADS_DIR_NAME}/`;
    const info = await FileSystem.getInfoAsync(downloadsDirectory);

    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(downloadsDirectory, { intermediates: true });
    }

    return downloadsDirectory;
  };

  return {
    getDownloadsDirectory: ensureDownloadsDirectory,
    getDownloadFileUri: async (contentType, contentId) => {
      const directory = await ensureDownloadsDirectory();
      return `${directory}${contentType}_${contentId}.wav`;
    },
    fileExists: async (uri) => {
      if (!uri) {
        return false;
      }

      const info = await FileSystem.getInfoAsync(uri);
      return info.exists;
    },
    deleteFile: async (uri) => {
      const info = await FileSystem.getInfoAsync(uri);

      if (info.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    },
    copyBundledAssetToDownloads: async (bundledAssetName, contentType, contentId) => {
      const moduleId = getBundledAudioModule(bundledAssetName);

      if (!moduleId) {
        throw new Error(`Bundled asset "${bundledAssetName}" is not registered`);
      }

      const asset = Asset.fromModule(moduleId);
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error(`Bundled asset "${bundledAssetName}" could not be resolved locally`);
      }

      const targetUri = await ensureDownloadsDirectory().then((directory) => `${directory}${contentType}_${contentId}.wav`);
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: targetUri
      });

      return targetUri;
    }
  };
}
