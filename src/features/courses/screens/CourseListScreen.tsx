import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { useCoursesQuery } from '@/features/content/hooks/use-content-queries';

export function CourseListScreen({
  navigation
}: {
  navigation: { navigate: (name: 'CourseDetail', params: { courseId: string }) => void };
}): React.JSX.Element {
  const { t } = useTranslation();
  const coursesQuery = useCoursesQuery();
  const courses = coursesQuery.data ?? [];

  return (
    <MeditationScreen
      title={t('courses.title')}
      subtitle={t('courses.subtitle')}
      heroImageUri={courses[0]?.coverImageUri}
      heroTitle={t('courses.heroTitle')}
      heroSubtitle={t('courses.heroSubtitle')}
      heroEyebrow={t('courses.heroEyebrow')}
      showBackButton
    >
      {coursesQuery.isLoading ? <LoadingState label={t('common.loadingCourses')} /> : null}
      {coursesQuery.isError ? (
        <EmptyState
          title={t('courses.title')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void coursesQuery.refetch()}
        />
      ) : null}
      {!coursesQuery.isLoading && !coursesQuery.isError ? (
        <>
          <SectionHeader title={t('courses.featuredJourneysTitle')} description={t('courses.featuredJourneysDescription')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
            {courses.map((course) => (
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
        </>
      ) : null}
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
