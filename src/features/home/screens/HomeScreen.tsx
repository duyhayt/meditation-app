import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { Button } from '@/components/ui/Button';
import { breathingExercises, meditationCategories, meditationCourses } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

export function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MeditationScreen eyebrow="Meditation App" title={t('home.title')} subtitle={t('home.subtitle')}>
      <View style={styles.actions}>
        <Button
          label={t('home.quickStart')}
          onPress={() =>
            navigation.navigate('AudioPlayer', {
              contentId: 'five-minute-arrival',
              contentType: 'meditation'
            })
          }
        />
        <Button
          label={t('home.continueSession')}
          variant="secondary"
          onPress={() =>
            navigation.navigate('AudioPlayer', {
              contentId: 'sleepy-body-scan',
              contentType: 'meditation'
            })
          }
        />
      </View>

      <AppText variant="title">{t('home.categories')}</AppText>
      {meditationCategories.map((category) => (
        <FeatureCard
          key={category.id}
          eyebrow={category.durationLabel}
          title={category.title}
          description={category.subtitle}
          meta={t('common.open')}
          onPress={() => navigation.navigate('MeditationList', { categoryId: category.id })}
        />
      ))}

      <AppText variant="title">{t('home.breathing')}</AppText>
      <FeatureCard
        icon="breath"
        eyebrow={breathingExercises[0]?.durationLabel}
        title={breathingExercises[0]?.title ?? ''}
        description={breathingExercises[0]?.pattern ?? ''}
        meta={t('common.open')}
        onPress={() => navigation.navigate('BreathingList')}
      />

      <AppText variant="title">{t('home.courses')}</AppText>
      <FeatureCard
        icon="course"
        eyebrow={`${meditationCourses[0]?.lessonCount ?? 0} lessons`}
        title={meditationCourses[0]?.title ?? ''}
        description={meditationCourses[0]?.description ?? ''}
        meta={t('common.open')}
        onPress={() => navigation.navigate('CourseList')}
      />
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12
  }
});
