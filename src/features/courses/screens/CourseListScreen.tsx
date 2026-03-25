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
      heroTitle={t('courses.heroTitle')}
      heroSubtitle={t('courses.heroSubtitle')}
      heroEyebrow={t('courses.heroEyebrow')}
      showBackButton
    >
      <SectionHeader title={t('courses.featuredJourneysTitle')} description={t('courses.featuredJourneysDescription')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
        {meditationCourses.map((course) => (
          <View key={course.id} style={styles.card}>
            <MeditationCard
              title={course.title}
              subtitle={course.description}
              durationLabel={t('common.minutesShort', { count: course.totalMinutes })}
              metaLabel={t('common.lessonCount', { count: course.lessonCount })}
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
