import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { getCourseById, getCourseLessons } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export function CourseDetailScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const course = getCourseById(route.params.courseId);
  const lessons = getCourseLessons(route.params.courseId);

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
      <SectionHeader title={t('courses.flowTitle')} description={t('courses.flowDescription')} />
      {lessons.map((lesson) => (
        <MeditationCard
          key={lesson.id}
          title={lesson.title}
          subtitle={course?.title ?? ''}
          durationLabel={t('common.minutesShort', { count: lesson.durationMinutes })}
          metaLabel={t('courses.lessonMeta')}
          imageUri={lesson.coverImageUri}
          tone="course"
          onPress={() => navigation.navigate('CourseLessonPlayer', { courseId: route.params.courseId, lessonId: lesson.id })}
        />
      ))}
    </MeditationScreen>
  );
}
