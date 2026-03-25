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
      heroEyebrow={`${course?.lessonCount ?? 0} lessons`}
      heroSize="compact"
      showBackButton
    >
      <SectionHeader title="Lesson flow" description="Clear lesson rows make the course feel guided and practical." />
      {lessons.map((lesson) => (
        <MeditationCard
          key={lesson.id}
          title={lesson.title}
          subtitle={course?.title ?? ''}
          durationLabel={`${lesson.durationMinutes} min`}
          metaLabel="Lesson"
          imageUri={lesson.coverImageUri}
          tone="course"
          onPress={() => navigation.navigate('CourseLessonPlayer', { courseId: route.params.courseId, lessonId: lesson.id })}
        />
      ))}
    </MeditationScreen>
  );
}
