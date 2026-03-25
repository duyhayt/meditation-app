import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/common/SectionHeader';
import { CategoryCard } from '@/components/meditation/CategoryCard';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  breathingExercises,
  meditationCategories,
  meditationCourses
} from '@/features/meditation/data/phase-one-content';

export function CategoryListScreen({
  navigation
}: {
  navigation: {
    navigate: (screen: 'MeditationList' | 'BreathingList' | 'CourseList', params?: { categoryId: string }) => void;
  };
}): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('meditate.categoryTitle')}
      subtitle={t('meditate.categorySubtitle')}
      heroImageUri={meditationCategories[0]?.coverImageUri}
      heroTitle={t('meditate.categoryHeroTitle')}
      heroSubtitle={t('meditate.categoryHeroSubtitle')}
      heroEyebrow={t('meditate.categoryHeroEyebrow')}
      showBackButton={false}
    >
      <View style={styles.section}>
        <SectionHeader title={t('meditate.featuredPathsTitle')} description={t('meditate.featuredPathsDescription')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {meditationCategories.map((category) => (
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
          title={breathingExercises[0]?.title ?? ''}
          subtitle={breathingExercises[0]?.pattern ?? ''}
          durationLabel={breathingExercises[0]?.durationLabel ?? ''}
          metaLabel={t('meditate.breathingMeta')}
          imageUri={breathingExercises[0]?.coverImageUri ?? ''}
          tone="breathing"
          onPress={() => navigation.navigate('BreathingList')}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('meditate.coursesSectionTitle')} description={t('meditate.coursesSectionDescription')} />
        <MeditationCard
          title={meditationCourses[0]?.title ?? ''}
          subtitle={meditationCourses[0]?.description ?? ''}
          durationLabel={t('common.minutesShort', { count: meditationCourses[0]?.totalMinutes ?? 0 })}
          metaLabel={t('common.lessonCount', { count: meditationCourses[0]?.lessonCount ?? 0 })}
          imageUri={meditationCourses[0]?.coverImageUri ?? ''}
          tone="course"
          onPress={() => navigation.navigate('CourseList')}
        />
      </View>
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
