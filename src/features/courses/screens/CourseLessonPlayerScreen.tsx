import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { ContentBadge } from '@/components/common/ContentBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  useCourseDetailQuery,
  useDownloadContentMutation,
  useResolvedContentSource,
  useRemoveDownloadedContentMutation,
  useToggleFavoriteMutation
} from '@/features/content/hooks/use-content-queries';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseLessonPlayer'>;

export function CourseLessonPlayerScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const courseDetailQuery = useCourseDetailQuery(route.params.courseId);
  const lesson = (courseDetailQuery.data?.lessons ?? []).find((item) => item.id === route.params.lessonId);
  const metadataQuery = useResolvedContentSource('course_lesson', route.params.lessonId);
  const toggleFavoriteMutation = useToggleFavoriteMutation('course_lesson', route.params.lessonId);
  const downloadMutation = useDownloadContentMutation('course_lesson', route.params.lessonId);
  const removeDownloadMutation = useRemoveDownloadedContentMutation('course_lesson', route.params.lessonId);
  const resolvedSource = metadataQuery.data;
  const metadata = resolvedSource?.metadata ?? null;
  const sourceLabel =
    resolvedSource?.kind === 'downloaded'
      ? t('common.downloaded')
      : resolvedSource?.kind === 'bundled'
        ? t('common.bundled')
        : resolvedSource?.kind === 'stream'
        ? t('common.streaming')
        : t('common.unavailable');

  return (
    <MeditationScreen
      title={t('courses.lessonTitle')}
      subtitle={t('courses.lessonSubtitle')}
      heroImageUri={lesson?.coverImageUri}
      heroTitle={lesson?.title ?? t('courses.lessonTitle')}
      heroSubtitle={t('courses.lessonPlayerHeroSubtitle')}
      heroEyebrow={t('courses.lessonPlayerHeroEyebrow')}
      showBackButton
    >
      {courseDetailQuery.isLoading ? <LoadingState label={t('common.loadingLesson')} /> : null}
      {courseDetailQuery.isError || !lesson ? (
        <EmptyState
          title={t('courses.lessonTitle')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => {
            void courseDetailQuery.refetch();
            void metadataQuery.refetch();
          }}
        />
      ) : null}
      {lesson ? (
        <View style={styles.stack}>
          <ContentBadge label={t('common.minutesShort', { count: lesson.durationMinutes })} icon="timer" />
          <ContentBadge label={sourceLabel} icon="download" />
          <AppButton
            label={t('courses.openSharedPlayer')}
            iconLeft="play"
            onPress={() =>
              navigation.navigate('AudioPlayer', {
                contentId: route.params.lessonId,
                contentType: 'course_lesson'
              })
            }
          />
          <AppButton
            label={
              resolvedSource?.kind === 'downloaded'
                ? t('audio.removeDownload')
                : t('audio.downloadForOffline')
            }
            iconLeft="download"
            variant="outline"
            loading={downloadMutation.isPending || removeDownloadMutation.isPending}
            onPress={() =>
              resolvedSource?.kind === 'downloaded'
                ? void removeDownloadMutation.mutateAsync()
                : void downloadMutation.mutateAsync()
            }
          />
          <AppButton
            label={metadata?.isFavorite ? t('favorites.removeAction') : t('favorites.saveAction')}
            iconLeft="favorite"
            variant={metadata?.isFavorite ? 'secondary' : 'outline'}
            loading={toggleFavoriteMutation.isPending}
            onPress={() => void toggleFavoriteMutation.mutateAsync()}
          />
        </View>
      ) : null}
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 12
  }
});
