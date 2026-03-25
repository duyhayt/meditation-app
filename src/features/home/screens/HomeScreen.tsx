import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ContinueSessionCard } from '@/components/common/ContinueSessionCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CategoryCard } from '@/components/meditation/CategoryCard';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  breathingExercises,
  meditationCategories,
  meditationCourses,
  meditations
} from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

export function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const lastSession = meditations.find((item) => item.id === 'sleepy-body-scan') ?? meditations[0];

  return (
    <MeditationScreen
      title={t('home.title')}
      subtitle={t('home.subtitle')}
      heroImageUri={meditations[0]?.coverImageUri}
      heroTitle={t('home.featuredTitle')}
      heroSubtitle={t('home.featuredSubtitle')}
      heroEyebrow={t('home.discover')}
      heroPrimaryActionLabel={t('home.quickStart')}
      heroSecondaryLabel="5 minutes"
      heroSize="compact"
      onHeroPrimaryAction={() =>
        navigation.navigate('AudioPlayer', {
          contentId: 'five-minute-arrival',
          contentType: 'meditation'
        })
      }
    >
      <SectionHeader title={t('home.continueTitle')} description={t('home.continueSubtitle')} />
      <ContinueSessionCard
        imageUri={lastSession.coverImageUri}
        title={lastSession.title}
        subtitle={`${lastSession.teacher} • ${lastSession.durationMinutes} min`}
        progressLabel="42% complete"
        onPress={() =>
          navigation.navigate('AudioPlayer', {
            contentId: lastSession.id,
            contentType: 'meditation'
          })
        }
      />

      <SectionHeader title={t('home.categories')} description={t('home.discover')} actionLabel={t('common.viewAll')} onAction={() => navigation.navigate('CategoryList')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
        {meditationCategories.map((category) => (
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

      <SectionHeader title={t('home.breathing')} description="Short visual sessions to reset your body and attention." />
      <MeditationCard
        title={breathingExercises[0]?.title ?? ''}
        subtitle={breathingExercises[0]?.pattern ?? ''}
        durationLabel={breathingExercises[0]?.durationLabel ?? ''}
        metaLabel="Breathing"
        imageUri={breathingExercises[0]?.coverImageUri ?? ''}
        tone="breathing"
        onPress={() => navigation.navigate('BreathingList')}
      />

      <SectionHeader title={t('home.courses')} description="Curated lesson journeys with a more structured pace." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
        {meditationCourses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
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
