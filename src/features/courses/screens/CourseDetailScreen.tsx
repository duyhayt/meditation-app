import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { getCourseById, getCourseLessons } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export function CourseDetailScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const course = getCourseById(route.params.courseId);
  const lessons = getCourseLessons(route.params.courseId);

  return (
    <MeditationScreen eyebrow="S12" title={t('courses.detailTitle')} subtitle={course?.description ?? t('courses.detailSubtitle')}>
      {lessons.map((lesson) => (
        <FeatureCard
          key={lesson.id}
          icon="lesson"
          eyebrow={`${lesson.durationMinutes} min`}
          title={lesson.title}
          description={course?.title ?? ''}
          meta="Play lesson"
          onPress={() => navigation.navigate('CourseLessonPlayer', { courseId: route.params.courseId, lessonId: lesson.id })}
        />
      ))}
    </MeditationScreen>
  );
}
