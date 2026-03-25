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
      heroTitle="Explore a calmer library"
      heroSubtitle="Guided meditations, breathing rituals, and sleep content arranged like a real discovery app."
      heroEyebrow="Meditate"
      showBackButton={false}
    >
      <View style={styles.section}>
        <SectionHeader title="Featured paths" description="Explore the main moods and use cases first." />
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
        <SectionHeader title="Breathing rituals" description="Fast entry points for calm, focus, and recovery." />
        <MeditationCard
          title={breathingExercises[0]?.title ?? ''}
          subtitle={breathingExercises[0]?.pattern ?? ''}
          durationLabel={breathingExercises[0]?.durationLabel ?? ''}
          metaLabel="Guided"
          imageUri={breathingExercises[0]?.coverImageUri ?? ''}
          tone="breathing"
          onPress={() => navigation.navigate('BreathingList')}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Courses" description="Structured series for habit building and deeper consistency." />
        <MeditationCard
          title={meditationCourses[0]?.title ?? ''}
          subtitle={meditationCourses[0]?.description ?? ''}
          durationLabel={`${meditationCourses[0]?.totalMinutes ?? 0} min`}
          metaLabel={`${meditationCourses[0]?.lessonCount ?? 0} lessons`}
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
