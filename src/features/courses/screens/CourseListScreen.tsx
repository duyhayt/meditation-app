import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { meditationCourses } from '@/features/meditation/data/phase-one-content';

export function CourseListScreen({ navigation }: { navigation: { navigate: (name: 'CourseDetail', params: { courseId: string }) => void } }): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S11" title={t('courses.title')} subtitle={t('courses.subtitle')}>
      {meditationCourses.map((course) => (
        <FeatureCard
          key={course.id}
          icon="course"
          eyebrow={`${course.lessonCount} lessons • ${course.totalMinutes} min`}
          title={course.title}
          description={course.description}
          meta="Open course"
          onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
        />
      ))}
    </MeditationScreen>
  );
}
