import * as FileSystem from 'expo-file-system/legacy';

import type { DownloadService, DownloadsRepository, ContentRepository, LocalFileStorageService, LoggerService } from '@/services/di/types';

export function createDownloadService(deps: {
  downloadsRepository: DownloadsRepository;
  contentRepository: ContentRepository;
  localFileStorageService: LocalFileStorageService;
  loggerService: LoggerService;
}): DownloadService {
  return {
    downloadContent: async (contentType, contentId) => {
      const metadata = await deps.contentRepository.getOfflineContentMetadata(contentType, contentId);

      if (!metadata) {
        return null;
      }

      if (metadata.localFileUri && (await deps.localFileStorageService.fileExists(metadata.localFileUri))) {
        return deps.downloadsRepository.upsert({
          contentType,
          contentId,
          audioType: 'downloaded',
          downloadStatus: 'completed',
          remoteUrl: metadata.streamUrl,
          localFileUri: metadata.localFileUri,
          version: metadata.audioVersion,
          progressPercent: 100
        });
      }

      await deps.downloadsRepository.upsert({
        contentType,
        contentId,
        audioType: metadata.audioType,
        downloadStatus: 'queued',
        remoteUrl: metadata.streamUrl,
        version: metadata.audioVersion,
        progressPercent: 0
      });

      const targetFileUri = await deps.localFileStorageService.getDownloadFileUri(contentType, contentId);

      try {
        await deps.downloadsRepository.upsert({
          contentType,
          contentId,
          audioType: metadata.audioType,
          downloadStatus: 'downloading',
          remoteUrl: metadata.streamUrl,
          version: metadata.audioVersion,
          progressPercent: 10
        });

        let localFileUri = targetFileUri;

        if (metadata.bundledAssetName) {
          localFileUri = await deps.localFileStorageService.copyBundledAssetToDownloads(
            metadata.bundledAssetName,
            contentType,
            contentId
          );
        } else if (metadata.streamUrl) {
          await FileSystem.downloadAsync(metadata.streamUrl, targetFileUri);
          localFileUri = targetFileUri;
        } else {
          throw new Error('No downloadable source is available');
        }

        const fileInfo = await FileSystem.getInfoAsync(localFileUri);

        return deps.downloadsRepository.upsert({
          contentType,
          contentId,
          audioType: 'downloaded',
          downloadStatus: 'completed',
          remoteUrl: metadata.streamUrl,
          localFileUri,
          fileSizeBytes: fileInfo.exists ? fileInfo.size : null,
          progressPercent: 100,
          version: metadata.audioVersion,
          lastError: null
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Download failed';
        deps.loggerService.error('Download failed', { contentType, contentId, error });

        return deps.downloadsRepository.upsert({
          contentType,
          contentId,
          audioType: metadata.audioType,
          downloadStatus: 'failed',
          remoteUrl: metadata.streamUrl,
          localFileUri: null,
          progressPercent: 0,
          version: metadata.audioVersion,
          lastError: errorMessage
        });
      }
    },
    removeDownloadedContent: async (contentType, contentId) => {
      const current = await deps.downloadsRepository.getByContent(contentType, contentId);

      if (current?.localFileUri) {
        await deps.localFileStorageService.deleteFile(current.localFileUri);
      }

      await deps.downloadsRepository.remove(contentType, contentId);
    }
  };
}
