import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { meditationCourses } from '@/features/meditation/data/phase-one-content';

export function CourseListScreen({
  navigation
}: {
  navigation: { navigate: (name: 'CourseDetail', params: { courseId: string }) => void };
}): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('courses.title')}
      subtitle={t('courses.subtitle')}
      heroImageUri={meditationCourses[0]?.coverImageUri}
      heroTitle="Structured paths, richer discovery"
      heroSubtitle="Courses now feel editorial and premium instead of just another plain list."
      heroEyebrow="Courses"
      showBackButton
    >
      <SectionHeader title="Featured journeys" description="Multi-lesson experiences that feel distinct from one-off meditations." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
        {meditationCourses.map((course) => (
          <View key={course.id} style={styles.card}>
            <MeditationCard
              title={course.title}
              subtitle={course.description}
              durationLabel={`${course.totalMinutes} min`}
              metaLabel={`${course.lessonCount} lessons`}
              imageUri={course.coverImageUri}
              tone="course"
              onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
            />
          </View>
        ))}
      </ScrollView>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  horizontalContent: {
    gap: 14,
    paddingRight: 4
  },
  card: {
    width: 262
  }
});
