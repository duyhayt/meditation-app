import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { useCourseDetailQuery } from '@/features/content/hooks/use-content-queries';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export function CourseDetailScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const courseDetailQuery = useCourseDetailQuery(route.params.courseId);
  const course = courseDetailQuery.data?.course ?? null;
  const lessons = courseDetailQuery.data?.lessons ?? [];

  return (
    <MeditationScreen
      title={t('courses.detailTitle')}
      subtitle={course?.description ?? t('courses.detailSubtitle')}
      heroImageUri={course?.coverImageUri}
      heroTitle={course?.title ?? t('courses.detailTitle')}
      heroSubtitle={course?.description ?? t('courses.detailSubtitle')}
      heroEyebrow={t('courses.detailHeroEyebrow', { count: course?.lessonCount ?? 0 })}
      heroSize="compact"
      showBackButton
    >
      {courseDetailQuery.isLoading ? <LoadingState label={t('common.loadingCourseDetail')} /> : null}
      {courseDetailQuery.isError || !course ? (
        <EmptyState
          title={t('courses.detailTitle')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void courseDetailQuery.refetch()}
        />
      ) : null}
      {course ? (
        <>
          <SectionHeader title={t('courses.flowTitle')} description={t('courses.flowDescription')} />
          {lessons.map((lesson) => (
            <MeditationCard
              key={lesson.id}
              title={lesson.title}
              subtitle={course.title}
              durationLabel={t('common.minutesShort', { count: lesson.durationMinutes })}
              metaLabel={t('courses.lessonMeta')}
              imageUri={lesson.coverImageUri}
              tone="course"
              onPress={() => navigation.navigate('CourseLessonPlayer', { courseId: route.params.courseId, lessonId: lesson.id })}
            />
          ))}
        </>
      ) : null}
    </MeditationScreen>
  );
}
