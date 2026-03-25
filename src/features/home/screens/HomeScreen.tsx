import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ContinueSessionCard } from '@/components/common/ContinueSessionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CategoryCard } from '@/components/meditation/CategoryCard';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  useBreathingExercisesQuery,
  useCategoriesQuery,
  useCoursesQuery,
  useMeditationsQuery,
  useRecentSessionContentQuery
} from '@/features/content/hooks/use-content-queries';
import type { RootStackParamList } from '@/types/navigation';

export function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const categoriesQuery = useCategoriesQuery();
  const meditationsQuery = useMeditationsQuery();
  const breathingQuery = useBreathingExercisesQuery();
  const coursesQuery = useCoursesQuery();
  const recentSessionQuery = useRecentSessionContentQuery();
  const categories = categoriesQuery.data ?? [];
  const meditations = meditationsQuery.data ?? [];
  const courses = coursesQuery.data ?? [];
  const breathing = breathingQuery.data ?? [];
  const quickMeditation = meditations[0] ?? null;
  const recentSession = recentSessionQuery.data;
  const firstBreathingExercise = breathing[0] ?? null;
  const isLoading =
    categoriesQuery.isLoading ||
    meditationsQuery.isLoading ||
    breathingQuery.isLoading ||
    coursesQuery.isLoading ||
    recentSessionQuery.isLoading;
  const hasError =
    categoriesQuery.isError ||
    meditationsQuery.isError ||
    breathingQuery.isError ||
    coursesQuery.isError ||
    recentSessionQuery.isError;

  return (
    <MeditationScreen
      title={t('home.title')}
      subtitle={t('home.subtitle')}
      heroImageUri={quickMeditation?.coverImageUri}
      heroTitle={t('home.featuredTitle')}
      heroSubtitle={t('home.featuredSubtitle')}
      heroEyebrow={t('home.discover')}
      heroPrimaryActionLabel={t('home.quickStart')}
      heroSecondaryLabel={t('home.heroSecondaryLabel')}
      heroSize="compact"
      onHeroPrimaryAction={() =>
        quickMeditation
          ? navigation.navigate('AudioPlayer', {
              contentId: quickMeditation.id,
              contentType: 'meditation'
            })
          : undefined
      }
    >
      {isLoading ? <LoadingState label={t('common.loadingLibrary')} /> : null}
      {hasError ? (
        <EmptyState
          title={t('home.title')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => {
            void categoriesQuery.refetch();
            void meditationsQuery.refetch();
            void breathingQuery.refetch();
            void coursesQuery.refetch();
            void recentSessionQuery.refetch();
          }}
        />
      ) : null}

      {!isLoading && !hasError ? (
        <>
      <SectionHeader title={t('home.continueTitle')} description={t('home.continueSubtitle')} />
      {recentSession ? (
        <ContinueSessionCard
          imageUri={recentSession.metadata.artworkUri}
          title={recentSession.metadata.title}
          subtitle={t('home.lastSessionSubtitle', {
            teacher: recentSession.metadata.contentType === 'course_lesson' ? t('common.lesson') : t('common.guided'),
            count: Math.max(1, Math.round((recentSession.metadata.durationSeconds ?? 300) / 60))
          })}
          progressLabel={t('home.progressLabel', {
            value: Math.round(recentSession.session.completionRatio * 100)
          })}
          onPress={() =>
            navigation.navigate('AudioPlayer', {
              contentId: recentSession.session.contentId,
              contentType: recentSession.session.contentType
            })
          }
        />
      ) : (
        <EmptyState title={t('home.continueTitle')} description={t('home.continueEmpty')} />
      )}

      <SectionHeader title={t('home.categories')} description={t('home.discover')} actionLabel={t('common.viewAll')} onAction={() => navigation.navigate('CategoryList')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
        {categories.map((category) => (
          <View key={category.id} style={styles.horizontalCard}>
            <CategoryCard
              title={category.title}
              subtitle={category.subtitle}
              durationLabel={category.durationLabel}
              ambientLabel={category.ambientLabel}
              imageUri={category.coverImageUri}
              icon={category.tone === 'sleep' ? 'moon' : 'meditate'}
              onPress={() => navigation.navigate('MeditationList', { categoryId: category.id })}
            />
          </View>
        ))}
      </ScrollView>

      <SectionHeader title={t('home.breathing')} description={t('home.breathingDescription')} />
      <MeditationCard
        title={firstBreathingExercise?.title ?? ''}
        subtitle={firstBreathingExercise?.pattern ?? ''}
        durationLabel={firstBreathingExercise?.durationLabel ?? ''}
        metaLabel={t('home.breathingMeta')}
        imageUri={firstBreathingExercise?.coverImageUri ?? ''}
        tone="breathing"
        onPress={() => navigation.navigate('BreathingList')}
      />

      <SectionHeader title={t('home.courses')} description={t('home.coursesDescription')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
        {courses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
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
    gap: 12,
    paddingRight: 4
  },
  horizontalCard: {
    width: 256
  },
  courseCard: {
    width: 232
  }
});
