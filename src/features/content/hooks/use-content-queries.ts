import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

import type { ContentEntityType, OfflineContentMetadataRecord } from '@/domain/database';
import {
  useAudioService,
  useContentRepository,
  useDailyProgressRepository,
  useDownloadService,
  useFavoritesRepository,
  useReminderService,
  useRemindersRepository,
  useSettingsRepository,
  useSessionHistoryRepository
} from '@/providers/ServicesProvider';

const contentKeys = {
  categories: ['content', 'categories'] as const,
  meditations: (categoryId?: string) => ['content', 'meditations', categoryId ?? 'all'] as const,
  meditation: (meditationId: string) => ['content', 'meditation', meditationId] as const,
  courses: ['content', 'courses'] as const,
  courseDetail: (courseId: string) => ['content', 'course-detail', courseId] as const,
  favoriteContent: ['content', 'favorites'] as const,
  metadata: (contentType: ContentEntityType, contentId: string) =>
    ['content', 'metadata', contentType, contentId] as const,
  recentSession: ['content', 'recent-session'] as const,
  breathing: ['content', 'breathing'] as const,
  sleepSounds: ['content', 'sleep-sounds'] as const,
  reminders: ['reminders', 'list'] as const,
  progress: ['progress', 'recent'] as const,
  history: ['history', 'recent'] as const,
  settings: ['settings', 'list'] as const
};

export function useCategoriesQuery() {
  const contentRepository = useContentRepository();

  return useQuery({
    queryKey: contentKeys.categories,
    queryFn: () => contentRepository.listCategories()
  });
}

export function useMeditationsQuery(categoryId?: string) {
  const contentRepository = useContentRepository();

  return useQuery({
    queryKey: contentKeys.meditations(categoryId),
    queryFn: () => contentRepository.listMeditations(categoryId)
  });
}

export function useMeditationDetailQuery(meditationId: string) {
  const contentRepository = useContentRepository();

  return useQuery({
    queryKey: contentKeys.meditation(meditationId),
    queryFn: () => contentRepository.getMeditationById(meditationId),
    enabled: Boolean(meditationId)
  });
}

export function useCoursesQuery() {
  const contentRepository = useContentRepository();

  return useQuery({
    queryKey: contentKeys.courses,
    queryFn: () => contentRepository.listCourses()
  });
}

export function useCourseDetailQuery(courseId: string) {
  const contentRepository = useContentRepository();

  return useQuery({
    queryKey: contentKeys.courseDetail(courseId),
    queryFn: async () => {
      const [course, lessons] = await Promise.all([
        contentRepository.getCourseById(courseId),
        contentRepository.listCourseLessons(courseId)
      ]);

      return {
        course,
        lessons
      };
    },
    enabled: Boolean(courseId)
  });
}

export function useBreathingExercisesQuery() {
  const contentRepository = useContentRepository();

  return useQuery({
    queryKey: contentKeys.breathing,
    queryFn: () => contentRepository.listBreathingExercises()
  });
}

export function useSleepSoundsQuery() {
  const contentRepository = useContentRepository();

  return useQuery({
    queryKey: contentKeys.sleepSounds,
    queryFn: () => contentRepository.listSleepSounds()
  });
}

export function useFavoriteContentQuery() {
  const contentRepository = useContentRepository();
  const favoritesRepository = useFavoritesRepository();

  return useQuery({
    queryKey: contentKeys.favoriteContent,
    queryFn: async (): Promise<OfflineContentMetadataRecord[]> => {
      const favorites = await favoritesRepository.list();
      const records = await Promise.all(
        favorites.map((favorite) =>
          contentRepository.getOfflineContentMetadata(favorite.contentType, favorite.contentId)
        )
      );

      return records.filter((record): record is OfflineContentMetadataRecord => Boolean(record));
    }
  });
}

export function useContentMetadataQuery(contentType: ContentEntityType, contentId: string) {
  const contentRepository = useContentRepository();

  return useQuery({
    queryKey: contentKeys.metadata(contentType, contentId),
    queryFn: () => contentRepository.getOfflineContentMetadata(contentType, contentId),
    enabled: Boolean(contentId)
  });
}

export function useRecentSessionContentQuery() {
  const contentRepository = useContentRepository();
  const sessionHistoryRepository = useSessionHistoryRepository();

  return useQuery({
    queryKey: contentKeys.recentSession,
    queryFn: async () => {
      const session = await sessionHistoryRepository.getLastPlayed();

      if (!session) {
        return null;
      }

      const metadata = await contentRepository.getOfflineContentMetadata(
        session.contentType,
        session.contentId
      );

      if (!metadata) {
        return null;
      }

      return {
        session,
        metadata
      };
    }
  });
}

export function useDailyProgressQuery(limit = 14) {
  const dailyProgressRepository = useDailyProgressRepository();

  return useQuery({
    queryKey: [...contentKeys.progress, limit] as const,
    queryFn: () => dailyProgressRepository.listRecent(limit)
  });
}

export function useSessionHistoryQuery(limit = 20) {
  const sessionHistoryRepository = useSessionHistoryRepository();

  return useQuery({
    queryKey: [...contentKeys.history, limit] as const,
    queryFn: () => sessionHistoryRepository.listRecent(limit)
  });
}

export function useSettingsQuery() {
  const settingsRepository = useSettingsRepository();

  return useQuery({
    queryKey: contentKeys.settings,
    queryFn: () => settingsRepository.list()
  });
}

export function useToggleFavoriteMutation(contentType: ContentEntityType, contentId: string) {
  const favoritesRepository = useFavoritesRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => favoritesRepository.toggle(contentType, contentId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: contentKeys.favoriteContent }),
        queryClient.invalidateQueries({ queryKey: contentKeys.metadata(contentType, contentId) })
      ]);
    }
  });
}

export function useResolvedContentSource(contentType: ContentEntityType, contentId: string) {
  const audioService = useAudioService();

  return useQuery({
    queryKey: ['content', 'resolved-source', contentType, contentId] as const,
    queryFn: () => audioService.resolvePlayableSource(contentType, contentId),
    enabled: Boolean(contentId)
  });
}

export function usePlaybackSnapshot() {
  const audioService = useAudioService();

  return useSyncExternalStore(audioService.subscribe, audioService.getSnapshot, audioService.getSnapshot);
}

export function useDownloadContentMutation(contentType: ContentEntityType, contentId: string) {
  const downloadService = useDownloadService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => downloadService.downloadContent(contentType, contentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contentKeys.metadata(contentType, contentId) });
      await queryClient.invalidateQueries({
        queryKey: ['content', 'resolved-source', contentType, contentId]
      });
      await queryClient.invalidateQueries({ queryKey: contentKeys.recentSession });
    }
  });
}

export function useRemoveDownloadedContentMutation(contentType: ContentEntityType, contentId: string) {
  const downloadService = useDownloadService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => downloadService.removeDownloadedContent(contentType, contentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contentKeys.metadata(contentType, contentId) });
      await queryClient.invalidateQueries({
        queryKey: ['content', 'resolved-source', contentType, contentId]
      });
    }
  });
}

export function useRemindersQuery() {
  const remindersRepository = useRemindersRepository();

  return useQuery({
    queryKey: contentKeys.reminders,
    queryFn: () => remindersRepository.list()
  });
}

export function useSaveReminderMutation() {
  const reminderService = useReminderService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reminderService.saveReminder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contentKeys.reminders });
    }
  });
}

export function useSetReminderEnabledMutation() {
  const reminderService = useReminderService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reminderId, isEnabled }: { reminderId: string; isEnabled: boolean }) =>
      reminderService.setReminderEnabled(reminderId, isEnabled),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contentKeys.reminders });
    }
  });
}

export function useCompleteBreathingSessionMutation() {
  const sessionHistoryRepository = useSessionHistoryRepository();
  const dailyProgressRepository = useDailyProgressRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      exerciseId: string;
      durationSeconds: number;
      completionRatio: number;
      startedAt: string;
    }) => {
      const endedAt = new Date().toISOString();
      const completed = params.completionRatio >= 1;
      const progressDate = endedAt.slice(0, 10);

      await sessionHistoryRepository.add({
        contentType: 'breathing_exercise',
        contentId: params.exerciseId,
        sourceType: 'bundled',
        startedAt: params.startedAt,
        endedAt,
        progressSeconds: params.durationSeconds,
        completionRatio: params.completionRatio,
        isCompleted: completed
      });

      const totalMeditationSeconds = params.durationSeconds;
      await dailyProgressRepository.upsert({
        progressDate,
        totalMeditationSeconds,
        completedSessions: completed ? 1 : 0,
        streakQualified: totalMeditationSeconds >= 300,
        lastSessionAt: endedAt
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contentKeys.recentSession });
    }
  });
}
