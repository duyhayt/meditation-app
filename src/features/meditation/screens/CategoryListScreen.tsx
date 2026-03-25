import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CategoryCard } from '@/components/meditation/CategoryCard';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  useBreathingExercisesQuery,
  useCategoriesQuery,
  useCoursesQuery
} from '@/features/content/hooks/use-content-queries';

export function CategoryListScreen({
  navigation
}: {
  navigation: {
    navigate: (screen: 'MeditationList' | 'BreathingList' | 'CourseList', params?: { categoryId: string }) => void;
  };
}): React.JSX.Element {
  const { t } = useTranslation();
  const categoriesQuery = useCategoriesQuery();
  const breathingQuery = useBreathingExercisesQuery();
  const coursesQuery = useCoursesQuery();
  const categories = categoriesQuery.data ?? [];
  const firstExercise = breathingQuery.data?.[0] ?? null;
  const firstCourse = coursesQuery.data?.[0] ?? null;
  const isLoading =
    categoriesQuery.isLoading || breathingQuery.isLoading || coursesQuery.isLoading;
  const hasError = categoriesQuery.isError || breathingQuery.isError || coursesQuery.isError;

  return (
    <MeditationScreen
      title={t('meditate.categoryTitle')}
      subtitle={t('meditate.categorySubtitle')}
      heroImageUri={categories[0]?.coverImageUri}
      heroTitle={t('meditate.categoryHeroTitle')}
      heroSubtitle={t('meditate.categoryHeroSubtitle')}
      heroEyebrow={t('meditate.categoryHeroEyebrow')}
      showBackButton={false}
    >
      {isLoading ? <LoadingState label={t('common.loadingLibrary')} /> : null}
      {hasError ? (
        <EmptyState
          title={t('common.placeholderTitle')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => {
            void categoriesQuery.refetch();
            void breathingQuery.refetch();
            void coursesQuery.refetch();
          }}
        />
      ) : null}

      {!isLoading && !hasError ? (
        <>
      <View style={styles.section}>
        <SectionHeader title={t('meditate.featuredPathsTitle')} description={t('meditate.featuredPathsDescription')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
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
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('meditate.breathingSectionTitle')} description={t('meditate.breathingSectionDescription')} />
        <MeditationCard
          title={firstExercise?.title ?? ''}
          subtitle={firstExercise?.pattern ?? ''}
          durationLabel={firstExercise?.durationLabel ?? ''}
          metaLabel={t('meditate.breathingMeta')}
          imageUri={firstExercise?.coverImageUri ?? ''}
          tone="breathing"
          onPress={() => navigation.navigate('BreathingList')}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('meditate.coursesSectionTitle')} description={t('meditate.coursesSectionDescription')} />
        <MeditationCard
          title={firstCourse?.title ?? ''}
          subtitle={firstCourse?.description ?? ''}
          durationLabel={t('common.minutesShort', { count: firstCourse?.totalMinutes ?? 0 })}
          metaLabel={t('common.lessonCount', { count: firstCourse?.lessonCount ?? 0 })}
          imageUri={firstCourse?.coverImageUri ?? ''}
          tone="course"
          onPress={() => navigation.navigate('CourseList')}
        />
      </View>
        </>
      ) : null}
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10
  },
  horizontalContent: {
    gap: 12,
    paddingRight: 8
  },
  categoryCard: {
    width: 248
  }
});
